import React, { useState, useEffect } from "react";

export default function TravailScreen() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [totalToday, setTotalToday] = useState(0);
  const [goal, setGoal] = useState(480); // Objectif par défaut en minutes (8 heures)
  const [progress, setProgress] = useState(0);
  const [motivationalPhrase, setMotivationalPhrase] = useState("");

  const motivationalPhrases = [
    "Personne ne viendra te sauver. Bouge-toi.",
    "Tu veux des résultats ? Alors fais ce que 99% ne font pas.",
    "Arrête d’attendre d’être motivé. Agis.",
    "Tu n’es pas fatigué. Tu es juste habitué à abandonner.",
    "Chaque seconde où tu hésites, quelqu'un devient meilleur que toi.",
    "Moins de paroles. Plus d’action.",
    "Tu dis vouloir une meilleure vie, prouve-le.",
    "Si c’était facile, tout le monde le ferait.",
    "Ton futur toi te dira merci ou te détestera. Choisis.",
    "Le confort détruit les rêves. La discipline les construit.",
    "Ta vie actuelle est le résultat des choix que TU as faits.",
    "Personne ne te doit rien. Gagne-le.",
    "Tu veux la liberté ? Discipline-toi maintenant.",
  ];


  // Charger les sessions et l'objectif au montage
  useEffect(() => {
    const loadData = () => {
      try {
        const storedSessions = localStorage.getItem("deepWorkSessions");
        if (storedSessions) {
          const parsedSessions = JSON.parse(storedSessions);
          setSessions(parsedSessions);
          calculateTotalToday(parsedSessions);
        }
        const storedGoal = localStorage.getItem("deepWorkGoal");
        if (storedGoal) {
          setGoal(parseFloat(storedGoal));
        }
      } catch (error) {
        console.error("Erreur lors du chargement :", error);
      }
    };
    loadData();
  }, []);

  // Calculer le total du jour et mettre à jour la progression
  const calculateTotalToday = (sessionsList) => {
    const today = new Date().toDateString();
    const todaySessions = sessionsList.filter(session => 
      new Date(session.date).toDateString() === today
    );
    const total = todaySessions.reduce((sum, session) => sum + session.duration, 0);
    setTotalToday(total);
    updateProgress(total);
  };

  // Mettre à jour la progression et la phrase motivante
  const updateProgress = (total) => {
    const goalMs = goal * 60000; // Convertir minutes en ms
    const percentage = Math.min((total / goalMs) * 100, 100);
    setProgress(percentage);
    setMotivationalPhrase(getRandomPhrase(percentage));
  };

  // Sélectionner une phrase motivante basée sur le progrès
  const getRandomPhrase = (percentage) => {
    let filteredPhrases;
    if (percentage < 25) {
      filteredPhrases = motivationalPhrases.slice(0, 3);
    } else if (percentage < 75) {
      filteredPhrases = motivationalPhrases.slice(3, 7);
    } else {
      filteredPhrases = motivationalPhrases.slice(7);
    }
    return filteredPhrases[Math.floor(Math.random() * filteredPhrases.length)];
  };

  // Sauvegarder l'objectif
  const saveGoal = (newGoal) => {
    setGoal(newGoal);
    localStorage.setItem("deepWorkGoal", newGoal.toString());
    updateProgress(totalToday);
  };

  // Timer pour mettre à jour le temps écoulé
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  // Fonction pour démarrer le chronomètre
  const startTimer = () => {
    setStartTime(Date.now() - elapsedTime);
    setIsRunning(true);
  };

  // Fonction pour arrêter le chronomètre et sauvegarder
  const stopTimer = () => {
    setIsRunning(false);
    const session = {
      id: Date.now(),
      duration: elapsedTime,
      date: new Date().toISOString(),
    };
    const updatedSessions = [...sessions, session];
    setSessions(updatedSessions);
    calculateTotalToday(updatedSessions);
    try {
      localStorage.setItem("deepWorkSessions", JSON.stringify(updatedSessions));
      alert(`Session sauvegardée\nTemps travaillé : ${formatTime(elapsedTime)}`);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde :", error);
      alert("Erreur : Impossible de sauvegarder la session.");
    }
    setElapsedTime(0);
  };

  // Fonction pour formater le temps (HH:MM:SS)
  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div style={styles.container}>
      {/* Fond dégradé violet */}
      <div style={styles.background}></div>
      
      {/* CONTENU */}
      <div style={styles.content}>
        {/* Header pour le titre, objectif et total du jour */}
        <div style={styles.header}>
          <p style={styles.title}>Deep Work</p>
          <div style={styles.goalContainer}>
            <label style={styles.goalLabel}>Objectif quotidien (minutes) :</label>
            <input
              type="number"
              value={goal}
              onChange={(e) => saveGoal(parseFloat(e.target.value) || 0)}
              style={styles.goalInput}
              min="0"
              step="1"
            />
          </div>
          <p style={styles.totalText}>Total aujourd'hui : {formatTime(totalToday)}</p>
        </div>
        
        {/* Corps centré pour le timer, progression et phrase */}
        <div style={styles.body}>
          <div style={styles.timerContainer}>
            <p style={styles.timerText}>{formatTime(elapsedTime)}</p>
            <button
              style={{ ...styles.button, ...(isRunning ? styles.stopButton : styles.startButton) }}
              onClick={isRunning ? stopTimer : startTimer}
            >
              {isRunning ? "Stop" : "Start"}
            </button>
            
            {/* Barre de progression */}
            <div style={styles.progressContainer}>
              <div style={{ ...styles.progressBar, width: `${progress}%` }}></div>
              <p style={styles.progressText}>{Math.round(progress)}% complété</p>
            </div>
            
            {/* Phrase motivante */}
            <p style={styles.motivationalText}>{motivationalPhrase}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: "relative",
    height: "100vh",
    width: "100vw",
    overflow: "hidden", // Empêche le scroll
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "linear-gradient(to bottom, #f4e8ff, #e4d1ff, #d0baff, #b89cff)",
    zIndex: -1,
  },
  content: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "1vh 0", // Réduit
    borderBottom: "1px solid #b89cff",
  },
  title: {
    fontSize: "2.5rem", // Réduit de 4.2rem à 2.5rem
    fontWeight: "bold",
    color: "#4b0082",
    textAlign: "center",
    margin: 0,
  },
  goalContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: "0.5vh 0", // Réduit
  },
  goalLabel: {
    fontSize: "1rem", // Réduit
    color: "#4b0082",
    marginBottom: "0.25vh",
  },
  goalInput: {
    fontSize: "1rem", // Réduit
    padding: "0.25vh",
    border: "1px solid #b89cff",
    borderRadius: "5px",
    textAlign: "center",
    width: "15vw",
    minWidth: "60px",
  },
  totalText: {
    fontSize: "1.2rem", // Réduit
    color: "#4b0082",
    textAlign: "center",
    margin: "0.5vh 0 0 0",
  },
  body: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  timerContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  timerText: {
    fontSize: "3.5rem", // Réduit de 6rem à 3.5rem
    fontWeight: "bold",
    color: "#4b0082",
    margin: "0 0 1vh 0", // Réduit
  },
  button: {
    padding: "1vh 8vw", // Réduit
    borderRadius: "25px",
    border: "none",
    cursor: "pointer",
    fontSize: "1.5rem", // Réduit
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: "1vh", // Réduit
  },
  startButton: {
    backgroundColor: "#4b0082",
  },
  stopButton: {
    backgroundColor: "#ff4500",
  },
  progressContainer: {
    width: "70vw", // Réduit
    maxWidth: "300px",
    height: "3vh", // Réduit
    backgroundColor: "#e4d1ff",
    borderRadius: "10px",
    overflow: "hidden",
    marginBottom: "1vh", // Réduit
    position: "relative",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#4b0082",
    transition: "width 0.5s ease",
  },
  progressText: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: "1rem", // Réduit
    fontWeight: "bold",
    color: "#ffffff",
    margin: 0,
  },
  motivationalText: {
    fontSize: "1.2rem", // Réduit
    fontWeight: "bold",
    color: "#4b0082",
    textAlign: "center",
    margin: "0.5vh 0 0 0", // Réduit
    fontStyle: "italic",
  },
};
