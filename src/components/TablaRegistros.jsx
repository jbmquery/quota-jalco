import React from "react";
import { MdContentCopy } from "react-icons/md";
import {toast} from "react-toastify";

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

  const columnas = [
    "mes",
    "codJalvo",
    "codBanco",
    "estado",
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
      case "cliente":
        return "p-1 max-w-60 min-w-60";
      case "asunto":
        return "p-1 max-w-15 min-w-15 text-center";
      case "perito":
        return "p-1 max-w-60 min-w-60";
      case "fecha":
        return "p-1 max-w-20 min-w-20 text-center";
      case "hora":
        return "p-1 max-w-20 min-w-20 text-center";
      case "comentario":
        return "p-1";
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

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead className="text-xs">
          <tr className="text-center">
            <th className="max-w-20 min-w-20 px-0">MES</th>
            <th className="min-w-20 max-w-20 px-0">COD. JALVO</th>
            <th className="min-w-20 max-w-20 px-0">COD. BANCO</th>
            <th className="max-w-40 min-w-40 px-0">ESTADO</th>
            <th className="max-w-60 min-w-60 px-0">CLIENTE</th>
            <th className="max-w-15 min-w-15 px-0">ASUNTO</th>
            <th className="max-w-60 min-w-60 px-0">PERITO</th>
            <th className="max-w-20 min-w-20 px-0">FECHA</th>
            <th className="max-w-20 min-w-20 px-0">HORA</th>
            <th className="px-0">COMENTARIO</th>
          </tr>
        </thead>

        <tbody className="text-xs">
          {registros.map((r) => (
            <tr
              key={r.id}
              onDoubleClick={() => onEditar(r)}
              className="cursor-pointer hover p-0"
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
                    style={{
                      backgroundColor: color || "",
                      cursor: "cell",
                    }}
                  >
                    {col === "estado" ? (
                      <span className={getBadgeEstado(r.estado)}>
                        {r.estado}
                      </span>
                    ) : col === "asunto" ? (
                      <button
                        className="btn btn-xs btn-outline btn-neutral-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          copiarAsunto(r);
                        }}
                      >
                        <MdContentCopy />
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
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TablaRegistros;
