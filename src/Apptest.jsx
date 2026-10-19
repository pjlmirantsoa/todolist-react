
import { useState } from "react";
import "./App.css";

function Profil({ prenom, poste, departement }) {
  return (
    <div>
      <h2>{prenom}</h2>
      <p>Poste : {poste}</p>
      <p>Département : {departement}</p>
    </div>
  );
}

function App() {
  const [messageVisible, setMessageVisible] = useState(false);
  const [aime, setAime] = useState(false);
  const [nombreLikes, setNombreLikes] = useState(0);

  const [prenom, setPrenom] = useState("");
  const [poste, setPoste] = useState("");
  const [profil, setProfil] = useState(false);

  // Liste des formations
  const [formations, setFormations] = useState([
    { id: 1, nom: "JavaScript", duree: "2 semaines" },
    { id: 2, nom: "React", duree: "3 semaines" },
    { id: 3, nom: "API REST", duree: "1 semaine" }
  ]);

  // Champs du formulaire d'ajout
  const [nomFormation, setNomFormation] = useState("");
  const [dureeFormation, setDureeFormation] = useState("");

  function gererProfil() {
    if (!prenom.trim() || !poste.trim()) {
      alert("Veuillez renseigner le prénom et le poste.");
      return;
    }

    setProfil(!profil);
  }

  function gererLike() {
    if (aime) {
      setNombreLikes(nombreLikes - 1);
    } else {
      setNombreLikes(nombreLikes + 1);
    }

    setAime(!aime);
  }

  function ajouterFormation(e) {
    e.preventDefault();

    if (!nomFormation.trim() || !dureeFormation.trim()) {
      alert("Veuillez renseigner le nom et la durée.");
      return;
    }

    // Générer automatiquement le prochain ID
    const nouvelId =
      formations.length > 0
        ? Math.max(...formations.map(formation => formation.id)) + 1
        : 1;

    // Créer une nouvelle formation
    const nouvelleFormation = {
      id: nouvelId,
      nom: nomFormation.trim(),
      duree: dureeFormation.trim()
    };

    // Ajouter la formation à la liste existante
    setFormations([...formations, nouvelleFormation]);

    // Vider les champs après l'ajout
    setNomFormation("");
    setDureeFormation("");
  }



  return (
    <div>
      <h1>Mon profil</h1>

      <input
        type="text"
        placeholder="Prénom"
        value={prenom}
        onChange={(e) => setPrenom(e.target.value)}
      />

      <input
        type="text"
        placeholder="Poste"
        value={poste}
        onChange={(e) => setPoste(e.target.value)}
      />

      <button onClick={gererProfil}>
        {profil ? "Masquer mon profil" : "Afficher mon profil"}
      </button>

      {profil && (
        <div>
          <h2>Mon profil</h2>
          <p>Prénom : {prenom}</p>
          <p>Poste : {poste}</p>
        </div>
      )}

      <hr />

      <h1>Publication PJL</h1>
      <p>Bienvenue sur notre espace de partage !</p>
      <p>Nombre de likes : {nombreLikes}</p>

      <button onClick={gererLike}>
        {aime ? "Je n'aime plus 💔" : "J'aime ❤️"}
      </button>

      <hr />

      <h1>Bienvenue chez PJL</h1>

      <button onClick={() => setMessageVisible(!messageVisible)}>
        {messageVisible
          ? "Masquer le message"
          : "Afficher le message"}
      </button>

      {messageVisible && (
        <p>Tu apprends React avec succès !</p>
      )}

      <hr />

      <h1>Les profils de l'équipe</h1>

      <Profil
        prenom="Mirantsoa"
        poste="AGDSI"
        departement="Technique"
      />

      <Profil
        prenom="Elvino"
        poste="Responsable"
        departement="Technique"
      />

      <Profil
        prenom="Anna"
        poste="Data Manager"
        departement="S&E"
      />

      <hr />

      {/* Gestion des formations */}
      <h1>Mes formations</h1>

      <form onSubmit={ajouterFormation}>
        <div>
          <label>Nom de la formation :</label>
          <input
            type="text"
            value={nomFormation}
            onChange={(e) => setNomFormation(e.target.value)}
            placeholder="Ex : HTML et CSS"
          />
        </div>

        <div>
          <label>Durée de la formation :</label>
          <input
            type="text"
            value={dureeFormation}
            onChange={(e) => setDureeFormation(e.target.value)}
            placeholder="Ex : 2 semaines"
          />
        </div>

        <button type="submit">
          Ajouter une formation
        </button>
      </form>

      <h2>Liste des formations</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Durée</th>
          </tr>
        </thead>

        <tbody>
          {formations.map((formation) => (
            <tr key={formation.id}>
              <td>{formation.id}</td>
              <td>{formation.nom}</td>
              <td>{formation.duree}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p>Total : {formations.length} formations</p>
    </div>
  );
}

export default App;
