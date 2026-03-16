//src/components/TablaRegistros.jsx
import React from "react";
import { MdContentCopy } from "react-icons/md";
import { toast } from "react-toastify";
import { useRef } from "react";

function TablaRegistros({ registros, onEditar, setSelectedCell, cellColors }) {
  const getBadgeEstado = (estado) => {
    switch (estado) {
      case "ELABORACION":
        return "badge badge-success text-black";
      case "DESESTIMADO":
        return "badge badge-error text-white";
      case "DOC. ADICIONALES":
        return "badge badge-info text-black";
      case "PTE. AGENDAR":
        return "badge badge-secondary text-white";
      case "INSPECCION":
        return "badge badge-warning text-black";
      default:
        return "badge";
    }
  };
  const pressTimer = useRef(null);
  const lastTap = useRef(0);
  const columnas = [
    "mes",
    "codJalvo",
    "codBanco",
    "estado",
    "copiarCliente",
    "cliente",
    "asunto",
    "perito",
    "fecha",
    "hora",
    "comentario",
  ];

  const formatearFecha = (fecha) => {
    if (!fecha) return "";

    const [year, month, day] = fecha.split("-");
    return `${day}/${month}/${year}`;
  };

  const getWidth = (col) => {
    switch (col) {
      case "mes":
        return "p-1 max-w-20 min-w-20 text-center";
      case "codJalvo":
        return "p-1 max-w-20 min-w-20 text-center";
      case "codBanco":
        return "p-1 min-w-20 max-w-20 text-center";
      case "estado":
        return "p-1 max-w-40 min-w-40 text-center";
      case "copiarCliente":
        return "p-1 max-w-12 min-w-12 text-center";
      case "cliente":
        return "p-1 max-w-60 min-w-60";
      case "asunto":
        return "p-1 max-w-15 min-w-15 text-center";
      case "perito":
        return "p-1 max-w-45 min-w-45";
      case "fecha":
        return "p-1 max-w-20 min-w-20 text-center";
      case "hora":
        return "p-1 max-w-20 min-w-20 text-center";
      case "comentario":
        return "p-1 min-w-200 md:min-w-auto ";
      default:
        return "";
    }
  };

  const copiarAsunto = async (registro) => {
    const texto = `${registro.codJalvo} - ${registro.codBanco} - ${registro.cliente}`;

    try {
      await navigator.clipboard.writeText(texto);
      toast.success("Asunto copiado al portapapeles");
    } catch (error) {
      console.error("Error copiando:", error);
    }
  };

  const copiarCliente = async (registro) => {
    const txtCliente = registro.cliente || "";

    try {
      await navigator.clipboard.writeText(txtCliente);
      toast.success("Cliente copiado al portapapeles");
    } catch (error) {
      console.error("Error copiando:", error);
    }
  };

  const obtenerFechaSolo = (timestamp) => {
    if (!timestamp) return "";

    const fecha = timestamp.toDate();
    return fecha.toISOString().split("T")[0];
  };

  let ultimoDia = null;
  let grupoColor = false;

  return (
    <div className="overflow-x-auto h-full rounded-lg border border-base-300">
      <table className="table table-pin-rows">
        <thead className="text-xs sticky top-0 bg-base-100 z-20">
          <tr className="text-center">
            <th className="max-w-20 min-w-20 px-0">MES</th>
            <th className="min-w-20 max-w-20 px-0">COD. JALVO</th>
            <th className="min-w-20 max-w-20 px-0">COD. BANCO</th>
            <th className="max-w-40 min-w-40 px-0">ESTADO</th>
            <th className="max-w-12 min-w-12 px-0"></th>
            <th className="max-w-60 min-w-60 px-0">CLIENTE</th>
            <th className="max-w-15 min-w-15 px-0">ASUNTO</th>
            <th className="max-w-45 min-w-45 px-0">PERITO</th>
            <th className="max-w-20 min-w-20 px-0">FECHA</th>
            <th className="max-w-20 min-w-20 px-0">HORA</th>
            <th className="px-0">COMENTARIO</th>
          </tr>
        </thead>

        <tbody className="text-xs">
          {registros.map((r) => {
            const diaActual = obtenerFechaSolo(r.fecha_registro);

            if (diaActual !== ultimoDia) {
              grupoColor = !grupoColor;
              ultimoDia = diaActual;
            }

            const bgGrupo = grupoColor ? "bg-neutral-200" : "bg-white";

            return (
              <tr
                key={r.id}
                onDoubleClick={() => onEditar(r)}
                onClick={() => {
                  const now = Date.now();

                  if (now - lastTap.current < 300) {
                    onEditar(r);
                  }

                  lastTap.current = now;
                }}
                onTouchStart={() => {
                  pressTimer.current = setTimeout(() => {
                    onEditar(r);
                  }, 600);
                }}
                onTouchEnd={() => {
                  clearTimeout(pressTimer.current);
                }}
                onTouchMove={() => {
                  clearTimeout(pressTimer.current);
                }}
                className={`cursor-pointer p-0 ${bgGrupo} hover:bg-neutral-200`}
              >
                {columnas.map((col, i) => {
                  const cellId = `${r.id}_${col}`;
                  const color = cellColors[cellId];

                  return (
                    <td
                      key={i}
                      className={getWidth(col)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCell(cellId);
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onEditar(r);
                      }}
                      style={{
                        backgroundColor: color || "",
                        cursor: "cell",
                      }}
                    >
                      {col === "estado" ? (
                        <span className={getBadgeEstado(r.estado)}>
                          {r.estado}
                        </span>
                      ) : col === "copiarCliente" ? (
                        <button
                          className={`btn btn-xs btn-outline border-none hover:bg-neutral-300`}
                          onClick={(e) => {
                            e.stopPropagation();
                            copiarCliente(r);
                          }}
                        >
                          <MdContentCopy className="text-base" />
                        </button>
                      ) : col === "asunto" ? (
                        <button
                          className="btn btn-xs btn-outline btn-neutral-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            copiarAsunto(r);
                          }}
                        >
                          <MdContentCopy className="text-base" />
                        </button>
                      ) : col === "fecha" ? (
                        formatearFecha(r[col])
                      ) : (
                        r[col]
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TablaRegistros;
