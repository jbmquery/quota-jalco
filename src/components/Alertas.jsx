import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { ImInfo } from "react-icons/im";

function Alertas({ registros, onEditar }) {
  const [alertas, setAlertas] = useState([]);

  useEffect(() => {
    const verificarAlertas = () => {
      const ahora = new Date();

      const alertasMostradas =
        JSON.parse(localStorage.getItem("alertasMostradas")) || [];

      const nuevas = registros.filter((r) => {
        if (r.estado !== "INSPECCION") return false;
        if (!r.fecha || !r.hora) return false;

        const clave = `${r.id}_${r.fecha}_${r.hora}`;

        if (alertasMostradas.includes(clave)) return false;

        const [anio, mes, dia] = r.fecha.split("-");
        const [hora, minuto] = r.hora.split(":");

        const fechaRegistro = new Date(
          Number(anio),
          Number(mes) - 1,
          Number(dia),
          Number(hora) + 1,
          Number(minuto)
        );

        return fechaRegistro <= ahora;
      });

      if (nuevas.length > 0) {
        const nuevasClaves = nuevas.map(
          (r) => `${r.id}_${r.fecha}_${r.hora}`
        );

        localStorage.setItem(
          "alertasMostradas",
          JSON.stringify([...alertasMostradas, ...nuevasClaves])
        );
      }

      setAlertas(nuevas);
    };

    verificarAlertas();

    const intervalo = setInterval(verificarAlertas, 60000);

    return () => clearInterval(intervalo);
  }, [registros]);

  const cerrarAlerta = (id) => {
    setAlertas((prev) => prev.filter((a) => a.id !== id));
  };

  const abrirRegistro = (registro) => {
    onEditar(registro);
    cerrarAlerta(registro.id);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3">
      {alertas.map((r) => (
        <div
          key={`${r.id}_${r.fecha}_${r.hora}`}
          className="
            w-[300px] md:w-[420px]
            bg-white
            border-b-6
            border-info
            shadow-xs
            rounded-md
            p-4
            cursor-pointer
            hover:shadow-lg
            transition-all
            duration-500
            ease-out
            animate-[slideIn_0.5s_ease-out]
          "
          onClick={() => abrirRegistro(r)}
        >
          <div className="flex flex-row justify-between items-center text-center py-2">
            <div className="flex flex-row justify-between text-xs text-neutral-800 gap-4 items-center">
              <ImInfo className="text-xl text-info" />
              <span>Fecha: {r.fecha}</span>
              <span>Hora: {r.hora}</span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                cerrarAlerta(r.id);
              }}
              className="text-neutral-800 font-bold hover:text-info"
            >
              <X size={20} />
            </button>
          </div>

          <div className="text-sm text-neutral-800">
            <div>
              <strong className="text-xs">Asunto:</strong>
              <div className="truncate text-xs">{r.asunto}</div>
            </div>

            <div className="mt-2">
              <strong className="text-xs">Comentario:</strong>
              <div className="truncate text-xs">
                {(r.comentario || "").slice(0, 50)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Alertas;