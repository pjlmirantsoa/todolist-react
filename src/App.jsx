// ============================================================
// App.jsx
// Composant principal : il garde TOUT l'état de l'application
// et contient la logique (ajouter, modifier, supprimer...).
// ============================================================

import { useState, useEffect } from "react";
import "./App.css";

import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";

// Ordre des statuts : sert à empêcher tout retour en arrière
const ordreStatuts = ["Non commencé", "En cours", "Terminé"];

function App() {
  // --- ÉTATS -------------------------------------------------

  // Liste des tâches, lue depuis le localStorage au démarrage
  const [taches, setTaches] = useState(() => {
    try {
      const donnees = localStorage.getItem("taches");
      return donnees ? JSON.parse(donnees) : [];
    } catch {
      return []; // en cas d'erreur de lecture, on repart d'une liste vide
    }
  });

  // Champs du formulaire
  const [nom, setNom] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priorite, setPriorite] = useState("Urgent");

  // id de la tâche en cours de modification (null = aucune)
  const [idModification, setIdModification] = useState(null);

  // Le formulaire est-il visible ? (caché au départ)
  const [formulaireOuvert, setFormulaireOuvert] = useState(false);

  // --- SAUVEGARDE AUTOMATIQUE --------------------------------
  // À chaque changement de la liste, on la sauvegarde dans le navigateur
  useEffect(() => {
    localStorage.setItem("taches", JSON.stringify(taches));
  }, [taches]);

  // --- FONCTIONS ---------------------------------------------

  // Vide les champs du formulaire (sans changer sa visibilité)
  function viderChamps() {
    setNom("");
    setDeadline("");
    setPriorite("Urgent");
    setIdModification(null);
  }

  // Ouvre le formulaire vide, prêt pour une nouvelle tâche
  function ouvrirFormulaire() {
    viderChamps();
    setFormulaireOuvert(true);
  }

  // Vide les champs ET cache le formulaire
  function annulerFormulaire() {
    viderChamps();
    setFormulaireOuvert(false);
  }

  // Ajoute une nouvelle tâche
  function ajouterTache() {
    // Sécurité : on refuse un nom vide ou une date manquante
    if (!nom.trim() || !deadline) return;

    const nouvelleTache = {
      id: Date.now(), // identifiant unique basé sur l'heure
      nom: nom.trim(),
      deadline,
      priorite,
      statut: "Non commencé", // toute nouvelle tâche commence ici
    };

    setTaches((anciennes) => [...anciennes, nouvelleTache]);
    annulerFormulaire(); // on ferme le formulaire après l'ajout
  }

  // Change le statut d'une tâche, mais UNIQUEMENT vers l'avant
  function changerStatut(id, nouveauStatut) {
    setTaches((anciennes) =>
      anciennes.map((tache) => {
        // On ne touche pas aux autres tâches
        if (tache.id !== id) return tache;

        // Règle : le nouveau statut doit être au même niveau ou plus loin
        // (En cours -> Non commencé est refusé, Terminé -> * est refusé)
        const ancienIndex = ordreStatuts.indexOf(tache.statut);
        const nouvelIndex = ordreStatuts.indexOf(nouveauStatut);
        if (nouvelIndex < ancienIndex) return tache;

        return { ...tache, statut: nouveauStatut };
      })
    );
  }

  // Charge une tâche dans le formulaire pour la modifier
  function modifierTache(tache) {
    setNom(tache.nom);
    setDeadline(tache.deadline);
    setPriorite(tache.priorite);
    setIdModification(tache.id);
    setFormulaireOuvert(true); // on affiche le formulaire
  }

  // Enregistre les changements faits dans le formulaire
  function enregistrerModification() {
    if (!nom.trim() || !deadline) return;

    setTaches((anciennes) =>
      anciennes.map((tache) =>
        tache.id === idModification
          ? { ...tache, nom: nom.trim(), deadline, priorite }
          : tache
      )
    );

    annulerFormulaire(); // on ferme le formulaire après l'enregistrement
  }

  // Supprime une tâche
  function supprimerTache(id) {
    setTaches((anciennes) => anciennes.filter((tache) => tache.id !== id));

    // Si on supprimait la tâche en cours d'édition, on ferme le formulaire
    if (id === idModification) {
      annulerFormulaire();
    }
  }

  // --- STATISTIQUES (barre de progression) -------------------
  const total = taches.length;
  const terminees = taches.filter((t) => t.statut === "Terminé").length;
  const pourcentage = total === 0 ? 0 : Math.round((terminees / total) * 100);

  // --- AFFICHAGE ---------------------------------------------
  return (
    <main className="application">
      {/* En-tête */}
      <header className="entete">
        <h1>📝 Ma Todo List</h1>

        {/* Résumé : nombre de tâches terminées + barre de progression */}
        <div className="progression">
          <span>
            {terminees} / {total} terminée(s) — {pourcentage} %
          </span>
          <div className="barre">
            <div
              className="barre-remplie"
              style={{ width: `${pourcentage}%` }}
            />
          </div>
        </div>
      </header>

      {/* Boutons + formulaire (affiché au clic sur "+ Nouvelle tâche") */}
      <TodoForm
        nom={nom}
        setNom={setNom}
        deadline={deadline}
        setDeadline={setDeadline}
        priorite={priorite}
        setPriorite={setPriorite}
        idModification={idModification}
        formulaireOuvert={formulaireOuvert}
        ouvrirFormulaire={ouvrirFormulaire}
        ajouterTache={ajouterTache}
        enregistrerModification={enregistrerModification}
        annulerFormulaire={annulerFormulaire}
      />

      <h2 className="titre-grilles">Mes tâches</h2>

      {/* Les 3 colonnes de tâches */}
      <TodoList
        taches={taches}
        changerStatut={changerStatut}
        modifierTache={modifierTache}
        supprimerTache={supprimerTache}
      />
    </main>
  );
}

export default App;