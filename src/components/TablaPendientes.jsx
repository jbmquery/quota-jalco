//src/components/TablaPendientes.jsx
import React from "react";
import { useRef } from "react";

function TablaPendientes({ pendientes, onEditar }) {
  const pressTimer = useRef(null);
  const lastTap = useRef(0);

  const columnas = [
    "codJalvo",
    "codBanco",
    "comentario",
    "fecha",
    "hora",
    "estado",
  ];

  const formatearFecha = (fecha) => {
    if (!fecha) return "";

    const [year, month, day] = fecha.split("-");
    return `${day}/${month}/${year}`;
  };

  const getBadgeEstado = (estado) => {
    switch (estado) {
      case "PENDIENTE":
        return "badge badge-warning text-black";
      case "ATENDIDO":
        return "badge badge-success text-black";
      case "URGENTE":
        return "badge badge-error text-white";
      default:
        return "badge";
    }
  };

  const getWidth = (col) => {
    switch (col) {
      case "codJalvo":
        return "p-1 min-w-24 max-w-24 text-center";
      case "codBanco":
        return "p-1 min-w-24 max-w-24 text-center";
      case "comentario":
        return "p-1 min-w-80";
      case "fecha":
        return "p-1 min-w-24 max-w-24 text-center";
      case "hora":
        return "p-1 min-w-20 max-w-20 text-center";
      case "estado":
        return "p-1 min-w-28 max-w-28 text-center";
      default:
        return "";
    }
  };

  return (
    <div className="overflow-auto h-full rounded-lg border border-base-300">
      <table className="table table-pin-rows">
        <thead className="text-xs sticky top-0 bg-base-100 z-20 shadow-sm">
          <tr className="text-center">
            <th className="px-0">COD. JALVO</th>
            <th className="px-0">COD. BANCO</th>
            <th className="px-0">COMENTARIO</th>
            <th className="px-0">FECHA</th>
            <th className="px-0">HORA</th>
            <th className="px-0">ESTADO</th>
          </tr>
        </thead>

        <tbody className="text-xs">
          {pendientes.map((p) => (
            <tr
              key={p.id}
              onDoubleClick={() => onEditar?.(p)}
              onClick={() => {
                const now = Date.now();

                if (now - lastTap.current < 300) {
                  onEditar?.(p);
                }

                lastTap.current = now;
              }}
              onTouchStart={() => {
                pressTimer.current = setTimeout(() => {
                  onEditar?.(p);
                }, 600);
              }}
              onTouchEnd={() => clearTimeout(pressTimer.current)}
              onTouchMove={() => clearTimeout(pressTimer.current)}
              className="cursor-pointer hover"
            >
              {columnas.map((col, i) => (
                <td key={i} className={getWidth(col)}>
                  {col === "estado" ? (
                    <span className={getBadgeEstado(p.estado)}>
                      {p.estado}
                    </span>
                  ) : col === "fecha" ? (
                    formatearFecha(p.fecha)
                  ) : (
                    p[col]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TablaPendientes;