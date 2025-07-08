import playerImg from "../assets/soccer-player.png";

export default function Player({ x, y }) {
  return (
    <img
      src={playerImg}
      alt="player"
      style={{
        width: 40,
        height: 40,
        position: "absolute",
        left: x,
        top: y,
        pointerEvents: "none",
      }}
    />
  );
}
