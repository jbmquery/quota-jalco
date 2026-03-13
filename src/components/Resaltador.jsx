import { HiPaintBrush } from "react-icons/hi2";

function Resaltador({ onColor }) {

  const botones = [
    { color: "remove", bg: "bg-white text-gray-400 hover:bg-gray-300" },
    { color: "#fde047", bg: "bg-amber-300 text-black hover:bg-amber-400" },
    { color: "#ec4899", bg: "bg-pink-500 text-white hover:bg-pink-600" },
    { color: "#22d3ee", bg: "bg-cyan-400 text-white hover:bg-cyan-500" },
  ];

  return (
    <div className="flex flex-row gap-1 md:gap-2">
      {botones.map((b, i) => (
        <button
          key={i}
          onClick={() => onColor(b.color)}
          className={`btn text-xl rounded-xl shadow-sm ${b.bg}`}
        >
          <HiPaintBrush />
        </button>
      ))}
    </div>
  );
}

export default Resaltador;