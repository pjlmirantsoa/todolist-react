// ============================================================
// TodoList.jsx
// Affiche les 3 colonnes (Urgent / Très important / Important)
// et y range les tâches correspondantes.
// ============================================================

import TodoItem from "./TodoItem";

// Les 3 niveaux de priorité avec leur icône
const priorites = [
  { nom: "Urgent", icone: "🔥" },
  { nom: "Très important", icone: "⭐" },
  { nom: "Important", icone: "📌" },
];

function TodoList({
  taches,         // toutes les tâches
  changerStatut,  // transmis à TodoItem
  modifierTache,  // transmis à TodoItem
  supprimerTache, // transmis à TodoItem
}) {
  return (
    <div className="grilles-taches">
      {/* On crée une colonne pour chaque priorité */}
      {priorites.map(({ nom, icone }) => {
        // On ne garde que les tâches de cette priorité
        const tachesPrioritaires = taches.filter(
          (tache) => tache.priorite === nom
        );

        return (
          <section
            key={nom}
            // Ex. : "Très important" -> "grille-très-important"
            className={`grille grille-${nom
              .toLowerCase()
              .replaceAll(" ", "-")}`}
          >
            {/* En-tête de la colonne */}
            <h2>
              <span className="icone-priorite">{icone}</span> {nom}
            </h2>

            {/* Compteur de tâches de la colonne */}
            <p className="compteur">{tachesPrioritaires.length} tâche(s)</p>

            {/* Message si vide, sinon liste des cartes */}
            {tachesPrioritaires.length === 0 ? (
              <p className="vide">Aucune tâche pour le moment.</p>
            ) : (
              tachesPrioritaires.map((tache) => (
                <TodoItem
                  key={tache.id}
                  tache={tache}
                  changerStatut={changerStatut}
                  modifierTache={modifierTache}
                  supprimerTache={supprimerTache}
                />
              ))
            )}
          </section>
        );
      })}
    </div>
  );
}

export default TodoList;