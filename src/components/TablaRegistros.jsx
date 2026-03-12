import React from "react";

function TablaRegistros({ registros, onEditar }) {
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
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead className="text-xs">
          <tr>
            <th>MES</th>
            <th>COD. JALVO</th>
            <th>COD. BANCO</th>
            <th>ESTADO</th>
            <th className="min-w-50">CLIENTE</th>
            <th className="min-w-50">ASUNTO</th>
            <th>PERITO</th>
            <th className="min-w-30">FECHA</th>
            <th>HORA</th>
            <th className="min-w-50">COMENTARIO</th>
          </tr>
        </thead>

        <tbody className="text-xs">
          {registros.map((r) => (
            <tr
              key={r.id}
              onDoubleClick={() => onEditar(r)}
              className="cursor-pointer hover"
            >
              <th>{r.mes}</th>
              <td>{r.codJalvo}</td>
              <td>{r.codBanco}</td>
              {/* ESTADO CON BADGE */}
              <td>
                <span className={getBadgeEstado(r.estado)}>{r.estado}</span>
              </td>
              <td>{r.cliente}</td>
              <td>{r.asunto}</td>
              <td>{r.perito}</td>
              <td>{r.fecha}</td>
              <td>{r.hora}</td>
              <td>{r.comentario}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TablaRegistros;
