//src/components/AlertasPendientes.jsx
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { TbAlertTriangleFilled } from "react-icons/tb";

function AlertasPendientes({ pendientes, onEditar }) {
  const [alertas, setAlertas] = useState([]);

  useEffect(() => {
    const verificarAlertas = () => {
      const ahora = new Date();

      const hoyAnio = ahora.getFullYear();
      const hoyMes = ahora.getMonth();
      const hoyDia = ahora.getDate();

      const alertasMostradas =
        JSON.parse(localStorage.getItem("alertasPendientesMostradas")) || [];

      const nuevas = pendientes.filter((p) => {
        if (p.estado !== "PENDIENTE") return false;
        if (!p.fecha || !p.hora) return false;

        const clave = `${p.id}_${p.fecha}_${p.hora}`;

        if (alertasMostradas.includes(clave)) return false;

        const [anio, mes, dia] = p.fecha.split("-");
        const [hora, minuto] = p.hora.split(":");

        const anioNum = Number(anio);
        const mesNum = Number(mes) - 1;
        const diaNum = Number(dia);

        if (anioNum !== hoyAnio || mesNum !== hoyMes || diaNum !== hoyDia) {
          return false;
        }

        const fechaAlerta = new Date(
          anioNum,
          mesNum,
          diaNum,
          Number(hora),
          Number(minuto),
        );

        return fechaAlerta <= ahora;
      });

      if (nuevas.length > 0) {
        const nuevasClaves = nuevas.map((p) => `${p.id}_${p.fecha}_${p.hora}`);

        localStorage.setItem(
          "alertasPendientesMostradas",
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
  }, [pendientes]);

  const cerrarAlerta = (id) => {
    setAlertas((prev) => prev.filter((a) => a.id !== id));
  };

  const abrirPendiente = (pendiente) => {
    onEditar(pendiente);
    cerrarAlerta(pendiente.id);
  };

  return (
    <>
      {alertas.map((p) => (
        <div
          key={`${p.id}_${p.fecha}_${p.hora}`}
          className="
            w-[300px] md:w-[420px]
            bg-white
            border-b-6
            border-warning
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
          "
          onClick={() => abrirPendiente(p)}
        >
          <div className="flex flex-row justify-between items-center py-2">
            <div className="flex flex-row text-xs text-neutral-800 gap-4 items-center">
              <TbAlertTriangleFilled className="text-xl text-warning" />
              <span>Fecha: {p.fecha}</span>
              <span>Hora: {p.hora}</span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                cerrarAlerta(p.id);
              }}
              className="text-neutral-800 hover:text-warning"
            >
              <X size={20} />
            </button>
          </div>

          <div className="text-sm text-neutral-800">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-row gap-2">
                <strong className="text-xs">Cod. Jalvo:</strong>
                <div className="truncate text-xs">{p.codJalvo}</div>
              </div>

              <div className="flex flex-row gap-2">
                <strong className="text-xs">Cod. Banco:</strong>
                <div className="truncate text-xs">{p.codBanco}</div>
              </div>
            </div>

            <div className="mt-2">
              <strong className="text-xs">Comentario:</strong>
              <div className="truncate text-xs">
                {(p.comentario || "").slice(0, 50)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default AlertasPendientes;
