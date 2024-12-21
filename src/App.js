import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // State to manage player names, current player, and timer
  const [players, setPlayers] = useState([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [gameStartTime, setGameStartTime] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [playerDurations, setPlayerDurations] = useState({});
  const [playerDoneCounts, setPlayerDoneCounts] = useState({});
  const [currentDuration, setCurrentDuration] = useState(0);
  const [totalGameDuration, setTotalGameDuration] = useState(0);

  // Function to add a player
  const addPlayer = (name) => {
    if (name.trim()) {
      setPlayers([...players, name]);
      setPlayerDurations({ ...playerDurations, [name]: 0 });
      setPlayerDoneCounts({ ...playerDoneCounts, [name]: 0 });
    }
  };

  // Function to start the game
  const startGame = () => {
    if (players.length > 0) {
      setIsRunning(true);
      setStartTime(Date.now());
      setGameStartTime(Date.now());
    }
  };

  // Function to handle when the current player is done
  const playerDone = () => {
    const endTime = Date.now();
    const duration = Math.floor((endTime - startTime) / 1000);

    const currentPlayer = players[currentPlayerIndex];
    setPlayerDurations((prev) => ({
      ...prev,
      [currentPlayer]: prev[currentPlayer] + duration,
    }));

    setPlayerDoneCounts((prev) => ({
      ...prev,
      [currentPlayer]: prev[currentPlayer] + 1,
    }));

    setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
    setStartTime(Date.now());
    setCurrentDuration(0);
  };

  // Function to reset the game
  const resetGame = () => {
    setIsRunning(false);
    setCurrentPlayerIndex(0);
    setStartTime(null);
    setGameStartTime(null);
    setCurrentDuration(0);
    setTotalGameDuration(0);
    setPlayerDurations(players.reduce((acc, player) => ({ ...acc, [player]: 0 }), {}));
    setPlayerDoneCounts(players.reduce((acc, player) => ({ ...acc, [player]: 0 }), {}));
  };

  // Function to remove a player
  const removePlayer = (name) => {
    setPlayers(players.filter(player => player !== name));
    const { [name]: _, ...remainingDurations } = playerDurations;
    const { [name]: __, ...remainingDoneCounts } = playerDoneCounts;
    
    setPlayerDurations(remainingDurations);
    setPlayerDoneCounts(remainingDoneCounts);
    
    // If the current player is removed, move to the next player
    if (name === players[currentPlayerIndex]) {
      setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
    }
  };

  // Update current duration every second
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setCurrentDuration(Math.floor((Date.now() - startTime) / 1000));
        setTotalGameDuration(Math.floor((Date.now() - gameStartTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, startTime, gameStartTime]);

  return (
    <div className="App">
      <header className="header">
        <h1>Drinking Game Timer</h1>
      </header>
      <main className="main">
        <div className="player-setup">
          <input
            type="text"
            placeholder="Enter player name"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                addPlayer(e.target.value);
                e.target.value = '';
              }
            }}
          />
          <button
            onClick={() => {
              const name = document.querySelector('input').value;
              addPlayer(name);
              document.querySelector('input').value = '';
            }}
          >
            Add Player
          </button>
        </div>
        <div className="player-list">
          <h2>Players</h2>
          <ul>
            {players.map((player, index) => (
              <li key={index}>
                <div className="player-details">
                  <span className="player-name">{player}</span>
                  <span className="player-time">Total Time: {playerDurations[player] || 0}s</span>
                  <span className="player-done">Done Count: {playerDoneCounts[player] || 0}</span>
                  <button className="btn-remove" onClick={() => removePlayer(player)}>
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {isRunning ? (
          <div className="game">
            <h2 className="current-player">Current Player: {players[currentPlayerIndex]}</h2>
            <p className="current-duration">Current Duration: {currentDuration}s</p>
            <p className="total-game-duration">Total Game Time: {totalGameDuration}s</p>
            <button className="btn-done" onClick={playerDone}>Done</button>
          </div>
        ) : (
          <button className="btn-start" onClick={startGame} disabled={players.length === 0}>
            Start Game
          </button>
        )}
        {isRunning && <button className="btn-reset" onClick={resetGame}>Reset Game</button>}
      </main>
    </div>
  );
}

export default App;
