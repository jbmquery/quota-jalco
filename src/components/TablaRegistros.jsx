import React from "react";

function TablaRegistros({
  registros,
  onEditar,
  selectedCell,
  setSelectedCell,
  cellColors
}) {

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
    "comentario"
  ];

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead className="text-xs">
          <tr>
            <th>MES</th>
            <th>COD. JALVO</th>
            <th>COD. BANCO</th>
            <th>ESTADO</th>
            <th>CLIENTE</th>
            <th>ASUNTO</th>
            <th>PERITO</th>
            <th>FECHA</th>
            <th>HORA</th>
            <th>COMENTARIO</th>
          </tr>
        </thead>

        <tbody className="text-xs">
          {registros.map((r) => (
            <tr
              key={r.id}
              onDoubleClick={() => onEditar(r)}
              className="cursor-pointer hover"
            >
              {columnas.map((col, i) => {

                const cellId = `${r.id}_${col}`;
                const color = cellColors[cellId];

                return (
                  <td
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCell(cellId);
                    }}
                    style={{
                      backgroundColor: color || "",
                      cursor: "cell"
                    }}
                  >
                    {col === "estado" ? (
                      <span className={getBadgeEstado(r.estado)}>
                        {r.estado}
                      </span>
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