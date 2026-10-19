// ============================================================
// TodoItem.jsx
// Affiche UNE seule tâche sous forme de carte.
// ============================================================

// Ordre logique des statuts : on ne peut qu'avancer, jamais reculer
const ordreStatuts = ["Non commencé", "En cours", "Terminé"];

// Classe CSS associée à chaque statut (pour la couleur du badge)
const classesStatut = {
  "Non commencé": "statut-non-commence",
  "En cours": "statut-en-cours",
  "Terminé": "statut-termine",
};

// Transforme un nombre de jours restants en texte lisible + classe CSS
// Ex. : 2 -> "Dans 2 jours", 1 -> "Demain", -3 -> "En retard de 3 jours"
function calculerDelai(joursRestants) {
  if (joursRestants < 0) {
    const n = Math.abs(joursRestants);
    return {
      texte: `En retard de ${n} jour${n > 1 ? "s" : ""}`,
      classe: "delai-retard",
    };
  }
  if (joursRestants === 0) {
    return { texte: "Aujourd'hui", classe: "delai-aujourdhui" };
  }
  if (joursRestants === 1) {
    return { texte: "Demain", classe: "delai-proche" };
  }
  if (joursRestants <= 2) {
    return { texte: `Dans ${joursRestants} jours`, classe: "delai-proche" };
  }
  return { texte: `Dans ${joursRestants} jours`, classe: "" };
}

function TodoItem({
  tache,          // l'objet tâche à afficher
  changerStatut,  // fonction pour changer le statut
  modifierTache,  // fonction pour charger la tâche dans le formulaire
  supprimerTache, // fonction pour supprimer la tâche
}) {
  const terminee = tache.statut === "Terminé";

  // Modifier : seulement si la tâche n'est pas commencée
  const modificationAutorisee = tache.statut === "Non commencé";

  // Supprimer : autorisé tant que la tâche n'est pas terminée
  // (donc "Non commencé" ET "En cours")
  const suppressionAutorisee = tache.statut === "Non commencé";

  // --- Règle des statuts -------------------------------------
  // On ne propose que le statut actuel et les suivants
  const indexActuel = ordreStatuts.indexOf(tache.statut);
  const statutsDisponibles = ordreStatuts.slice(indexActuel);

  // --- Calcul du délai ---------------------------------------
  // On compare des dates à minuit pour éviter les erreurs d'heure
  const maintenant = new Date();
  const debutAujourdHui = new Date(
    maintenant.getFullYear(),
    maintenant.getMonth(),
    maintenant.getDate()
  );

  // "2026-10-21" -> [2026, 10, 21] -> date locale à minuit
  const [annee, mois, jour] = tache.deadline.split("-").map(Number);
  const dateDeadline = new Date(annee, mois - 1, jour);

  // Nombre de jours entre aujourd'hui et la deadline
  // (négatif = déjà dépassée). Math.round gère le changement d'heure.
  const joursRestants = Math.round(
    (dateDeadline - debutAujourdHui) / 86400000
  );

  const delai = calculerDelai(joursRestants);

  // En retard = deadline dépassée ET tâche non terminée
  const enRetard = joursRestants < 0 && !terminee;

  // Échéance aujourd'hui (bord gauche rouge vif)
  const echeanceAujourdHui = joursRestants === 0 && !terminee;

  // Classes CSS de la carte
  const classesCarte = [
    "carte-tache",
    enRetard ? "en-retard" : "",
    echeanceAujourdHui ? "echeance-aujourdhui" : "",
    tache.statut === "En cours" ? "en-cours" : "",
    terminee ? "terminee" : "",
  ].join(" ");

  // Suppression avec confirmation si la tâche est déjà en cours
  function gererSuppression() {
    if (
      tache.statut === "En cours" &&
      !window.confirm(`« ${tache.nom} » est en cours. La supprimer quand même ?`)
    ) {
      return; // l'utilisateur a annulé
    }
    supprimerTache(tache.id);
  }

  return (
    <article className={classesCarte}>
      {/* Nom de la tâche */}
      <h3>{tache.nom}</h3>

      {/* Date limite */}
      <p className="ligne-deadline">
        <strong>📆 Deadline :</strong> {tache.deadline}
      </p>

      {/* Délai restant (masqué si la tâche est terminée) */}
      {!terminee && (
        <p className="ligne-delai">
          <span className={`delai ${delai.classe}`}>⏳ {delai.texte}</span>
        </p>
      )}

      {/* Menu de statut (restreint selon la règle ci-dessus) */}
      <label>
        Statut
        <select
          className={`statut ${classesStatut[tache.statut]}`}
          value={tache.statut}
          disabled={terminee}
          onChange={(e) => changerStatut(tache.id, e.target.value)}
        >
          {statutsDisponibles.map((statut) => (
            <option key={statut} value={statut}>
              {statut}
            </option>
          ))}
        </select>
      </label>

      {/* Message affiché seulement si la tâche est en retard */}
      {enRetard && (
        <p className="alerte-retard">⚠️ Deadline dépassée !</p>
      )}

      {/* Boutons : Modifier (Non commencé) et Supprimer (Non commencé / En cours) */}
      {suppressionAutorisee && (
        <div className="actions">
          {modificationAutorisee && (
            <button type="button" onClick={() => modifierTache(tache)}>
              ✏️ Modifier
            </button>
          )}

          <button
            type="button"
            className="bouton-supprimer"
            onClick={gererSuppression}
          >
            🗑️ Supprimer
          </button>
        </div>
      )}
    </article>
  );
}

export default TodoItem;