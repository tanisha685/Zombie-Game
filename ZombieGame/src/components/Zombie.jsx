import zombieImg from "../assets/zombie.png";

export default function Zombie({ x, y }) {
  return (
    <img
      src={zombieImg}
      alt="zombie"
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
