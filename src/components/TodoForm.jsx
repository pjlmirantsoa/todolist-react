// ============================================================
// TodoForm.jsx
// Barre de boutons (+ Nouvelle tâche / Bloquer un créneau)
// et formulaire d'ajout / de modification, affiché à la demande.
// Il ne gère aucun état lui-même : tout vient de App.jsx (props).
// ============================================================

function TodoForm({
  nom,                     // texte du champ "Nom de la tâche"
  setNom,                  // fonction pour changer le nom
  deadline,                // date limite (format AAAA-MM-JJ)
  setDeadline,             // fonction pour changer la deadline
  priorite,                // priorité choisie
  setPriorite,             // fonction pour changer la priorité
  idModification,          // id de la tâche en cours de modification (null = mode ajout)
  formulaireOuvert,        // true = le formulaire est visible
  ouvrirFormulaire,        // fonction qui ouvre le formulaire (mode ajout)
  ajouterTache,            // fonction appelée en mode ajout
  enregistrerModification, // fonction appelée en mode modification
  annulerFormulaire,       // fonction qui ferme et vide le formulaire
}) {
  // On est en mode "modification" si un id est présent
  const enModification = idModification !== null;

  // Appelée quand on valide le formulaire (clic sur le bouton ou touche Entrée)
  function gererSoumission(e) {
    e.preventDefault(); // empêche le rechargement de la page

    if (enModification) {
      enregistrerModification(); // on met à jour la tâche existante
    } else {
      ajouterTache(); // on crée une nouvelle tâche
    }
  }

  return (
    <section className="zone-ajout">
      {/* Barre de boutons : toujours visible */}
      <div className="barre-actions">
        {/* Ouvre le formulaire en mode ajout */}
        <button
          type="button"
          className="bouton-principal"
          onClick={ouvrirFormulaire}
        >
          + Nouvelle tâche
        </button>

        {/* Lien externe vers l'agenda pour réserver un créneau */}
        <a
          className="bouton-calendrier"
          href="https://calendar.google.com/calendar/u/0/appointments/AcZssZ3-FCZa4Wqpp1w15tyF94XWRMKfTEnlNyZbcNo="
          target="_blank"
          rel="noopener noreferrer"
        >
          📅 Bloquer un créneau avec Elvino
        </a>
      </div>

      {/* Le formulaire n'apparaît que si formulaireOuvert est vrai */}
      {formulaireOuvert && (
        <form className="form-tache" onSubmit={gererSoumission}>
          {/* Champ : nom de la tâche */}
          <label className="champ-nom">
            Nom de la tâche
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Nom de la tâche"
              required
              autoFocus // le curseur est directement dans ce champ
            />
          </label>

          {/* Champ : date limite */}
          <label>
            Deadline
            <input
              type="date"
              value={deadline}
              min={new Date().getFullYear() + "-" +String(new Date().getMonth() + 1).padStart(2, "0") + "-" +String(new Date().getDate()).padStart(2, "0")}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
          </label>

          {/* Champ : priorité */}
          <label>
            Priorité
            <select
              value={priorite}
              onChange={(e) => setPriorite(e.target.value)}
            >
              <option value="Urgent">Urgent</option>
              <option value="Très important">Très important</option>
              <option value="Important">Important</option>
            </select>
          </label>

          {/* Boutons de validation du formulaire */}
          <div className="boutons-formulaire">
            <button type="submit" className="bouton-principal">
              {enModification ? "Enregistrer" : "Ajouter"}
            </button>

            {/* Ferme le formulaire sans rien enregistrer */}
            <button
              type="button"
              className="bouton-annuler"
              onClick={annulerFormulaire}
            >
              Annuler
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

export default TodoForm;