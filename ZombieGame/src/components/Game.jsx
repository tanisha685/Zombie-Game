import React, { useEffect, useRef, useState } from "react";
import Player from "./Player";
import Zombie from "./Zombie";

const GAME_WIDTH = 600;
const GAME_HEIGHT = 400;

export default function Game() {
  const [playerPos, setPlayerPos] = useState({ x: 300, y: 200 });
  const [zombies, setZombies] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(
    () => Number(localStorage.getItem("zombieHighScore")) || 0
  );
  const [gameStarted, setGameStarted] = useState(false);

  const gameRef = useRef(null);

  const movePlayer = (dir) => {
    setPlayerPos((prev) => {
      let newX = prev.x;
      let newY = prev.y;

      if (dir === "up") newY -= 10;
      if (dir === "down") newY += 10;
      if (dir === "left") newX -= 10;
      if (dir === "right") newX += 10;

      newX = Math.max(0, Math.min(newX, GAME_WIDTH - 30));
      newY = Math.max(0, Math.min(newY, GAME_HEIGHT - 30));

      return { x: newX, y: newY };
    });
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (isGameOver || !gameStarted) return;
      if (e.key === "ArrowUp") movePlayer("up");
      if (e.key === "ArrowDown") movePlayer("down");
      if (e.key === "ArrowLeft") movePlayer("left");
      if (e.key === "ArrowRight") movePlayer("right");
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isGameOver, gameStarted]);

  useEffect(() => {
    if (isGameOver || !gameStarted) return;
    const interval = setInterval(() => {
      const side = Math.floor(Math.random() * 4);
      let x, y;
      switch (side) {
        case 0:
          x = 0;
          y = Math.random() * GAME_HEIGHT;
          break;
        case 1:
          x = GAME_WIDTH;
          y = Math.random() * GAME_HEIGHT;
          break;
        case 2:
          x = Math.random() * GAME_WIDTH;
          y = 0;
          break;
        case 3:
          x = Math.random() * GAME_WIDTH;
          y = GAME_HEIGHT;
          break;
        default:
          x = 0;
          y = 0;
      }
      setZombies((prev) => [...prev, { x, y, id: Date.now() + Math.random() }]);
    }, 1300);

    return () => clearInterval(interval);
  }, [isGameOver, gameStarted]);

  useEffect(() => {
    if (isGameOver || !gameStarted) return;
    const interval = setInterval(() => {
      setZombies((prev) => {
        return prev.map((z) => {
          const dx = playerPos.x - z.x;
          const dy = playerPos.y - z.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const speed = 1.5;
          return {
            ...z,
            x: z.x + (dx / dist) * speed,
            y: z.y + (dy / dist) * speed,
          };
        });
      });

      zombies.forEach((z) => {
        if (
          Math.abs(z.x - playerPos.x) < 25 &&
          Math.abs(z.y - playerPos.y) < 25
        ) {
          setIsGameOver(true);
          setGameStarted(false);
          if (score > highScore) {
            localStorage.setItem("zombieHighScore", score);
            setHighScore(score);
          }
        }
      });
    }, 30);

    return () => clearInterval(interval);
  }, [playerPos, zombies, isGameOver, gameStarted]);

  useEffect(() => {
    if (isGameOver || !gameStarted) return;
    const timer = setInterval(() => {
      setScore((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isGameOver, gameStarted]);

  const restartGame = () => {
    setIsGameOver(false);
    setScore(0);
    setPlayerPos({ x: 300, y: 200 });
    setZombies([]);
    setGameStarted(true);
  };

  const btnStyle = {
    padding: "10px 20px",
    fontSize: "1.5rem",
    margin: "5px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#222",
    color: "#0f0",
    boxShadow: "0 0 5px #0f0",
    cursor: "pointer",
  };

  return (
    <div
      style={{
        textAlign: "center",
        color: "#fff",
        background: "#111",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "10px" }}>
        🧟 Zombie Survival Game
      </h1>

      {!gameStarted && !isGameOver && (
        <>
          <div
            style={{
              maxWidth: "500px",
              margin: "0 auto 20px",
              backgroundColor: "#222",
              padding: "15px",
              borderRadius: "10px",
              border: "1px solid #444",
              fontSize: "1rem",
              boxShadow: "0 0 8px #0f0",
            }}
          >
            <strong>🎮 Game Rules:</strong>
            <ul
              style={{
                textAlign: "left",
                paddingLeft: "20px",
                marginTop: "10px",
              }}
            >
              <li>Use Arrow Keys or Buttons to move.</li>
              <li>Survive as long as you can.</li>
              <li>Don't let zombies touch you!</li>
            </ul>
          </div>

          <button
            onClick={() => setGameStarted(true)}
            style={{
              padding: "10px 20px",
              fontSize: "1.1rem",
              backgroundColor: "#0f0",
              color: "#000",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            ▶️ Start Game
          </button>
        </>
      )}

      {gameStarted && (
        <>
          <div style={{ fontSize: "18px", margin: "10px 0" }}>
            🧠 Score: {score} &nbsp; | 🏆 High Score: {highScore}
          </div>

          <div
            ref={gameRef}
            style={{
              width: "90vw",
              maxWidth: "600px",
              height: "60vw",
              maxHeight: "400px",
              border: "3px solid #0f0",
              position: "relative",
              background: "#111",
              overflow: "hidden",
              margin: "20px auto",
              boxShadow: "0 0 20px #0f0",
              borderRadius: "10px",
            }}
          >
            <Player x={playerPos.x} y={playerPos.y} />
            {zombies.map((z) => (
              <Zombie key={z.id} x={z.x} y={z.y} />
            ))}
          </div>

          {!isGameOver && (
            <div style={{ marginTop: "20px" }}>
              <div>
                <button onClick={() => movePlayer("up")} style={btnStyle}>
                  ⬆️
                </button>
              </div>
              <div>
                <button onClick={() => movePlayer("left")} style={btnStyle}>
                  ⬅️
                </button>
                <button onClick={() => movePlayer("down")} style={btnStyle}>
                  ⬇️
                </button>
                <button onClick={() => movePlayer("right")} style={btnStyle}>
                  ➡️
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {isGameOver && (
        <div
          style={{
            marginTop: "20px",
            maxWidth: "90vw",
            marginInline: "auto",
            background: "rgba(0,0,0,0.85)",
            padding: "20px",
            borderRadius: "15px",
            border: "2px solid red",
            boxShadow: "0 0 15px red",
            fontSize: "1.5rem",
          }}
        >
          💀 <strong>Game Over</strong> 💀
          <br />
          <br />
          Your Score: {score} <br />
          High Score: {highScore} <br />
          <br />
          <button
            onClick={restartGame}
            style={{
              padding: "10px 20px",
              fontSize: "1rem",
              backgroundColor: "#0f0",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            🔁 Restart
          </button>
        </div>
      )}
    </div>
  );
}
