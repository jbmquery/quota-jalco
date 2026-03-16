//src/components/Alertas.jsx
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { ImInfo } from "react-icons/im";

function Alertas({ registros, onEditar, soundMuted }) {
  const [alertas, setAlertas] = useState([]);
  const sonido = new Audio("/alerta.mp3");

  useEffect(() => {
    const verificarAlertas = () => {
      const ahora = new Date();

      const hoyAnio = ahora.getFullYear();
      const hoyMes = ahora.getMonth();
      const hoyDia = ahora.getDate();

      const alertasMostradas =
        JSON.parse(localStorage.getItem("alertasMostradas")) || [];

      const nuevas = registros.filter((r) => {
        if (r.estado !== "INSPECCION") return false;
        if (!r.fecha || !r.hora) return false;

        const clave = `${r.id}_${r.fecha}_${r.hora}`;

        if (alertasMostradas.includes(clave)) return false;

        const [anio, mes, dia] = r.fecha.split("-");
        const [hora, minuto] = r.hora.split(":");

        const anioNum = Number(anio);
        const mesNum = Number(mes) - 1;
        const diaNum = Number(dia);

        // ✅ Validar estrictamente que sea HOY
        if (anioNum !== hoyAnio || mesNum !== hoyMes || diaNum !== hoyDia) {
          return false;
        }

        // ✅ Construir fecha alerta = hora registro + 1 hora
        const fechaAlerta = new Date(
          Number(anioNum),
          Number(mesNum),
          Number(diaNum),
          Number(hora) + 1,
          Number(minuto),
        );

        // ✅ Solo mostrar si ya llegó la hora
        return fechaAlerta <= ahora;
      });

      if (nuevas.length > 0) {
        if (!soundMuted) {
          sonido.play().catch(() => {});
        }

        const nuevasClaves = nuevas.map((r) => `${r.id}_${r.fecha}_${r.hora}`);

        localStorage.setItem(
          "alertasMostradas",
          JSON.stringify([...alertasMostradas, ...nuevasClaves]),
        );
      }

      setAlertas((prev) => {
        const existentes = prev.map((a) => `${a.id}_${a.fecha}_${a.hora}`);

        const realmenteNuevas = nuevas.filter(
          (n) => !existentes.includes(`${n.id}_${n.fecha}_${n.hora}`),
        );

        return [...prev, ...realmenteNuevas];
      });
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
    <>
      {alertas.map((r) => (
        <div
          key={`${r.id}_${r.fecha}_${r.hora}`}
          className="
            w-[300px] md:w-[420px]
            bg-white
            border-b-6
            border-info
            shadow-xl/30
            rounded-md
            p-4
            cursor-pointer
            inset-shadow-sm
            hover:shadow-lg hover:scale-[1.02]
            transition-all
            duration-1000
            ease-out
            animate-[slideIn_2.9s_cubic-bezier(0.22,1,0.36,1)]
            bg-white
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
    </>
  );
}

export default Alertas;
