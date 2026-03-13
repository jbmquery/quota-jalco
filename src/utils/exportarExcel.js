import * as XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";

const formatearFecha = (fecha) => {
  if (!fecha) return "";

  if (typeof fecha === "string" && fecha.includes("-")) {
    const partes = fecha.split("-");

    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
  }

  return fecha;
};

const generarNombreArchivo = () => {
  const ahora = new Date();

  const dia = String(ahora.getDate()).padStart(2, "0");
  const mes = String(ahora.getMonth() + 1).padStart(2, "0");
  const anio = ahora.getFullYear();

  const hora = String(ahora.getHours()).padStart(2, "0");
  const minuto = String(ahora.getMinutes()).padStart(2, "0");

  return `registro${dia}${mes}${anio}-${hora}${minuto}.xlsx`;
};

export const exportarExcel = (registros, cellColors) => {
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

  const data = registros.map((r) => {
    const fila = {};

    columnas.forEach((col) => {
      fila[col] = col === "fecha" ? formatearFecha(r[col]) : r[col] ?? "";
    });

    return fila;
  });

  const ws = XLSX.utils.json_to_sheet(data);

  const range = XLSX.utils.decode_range(ws["!ref"]);

  for (let R = 1; R <= range.e.r; R++) {
    const registro = registros[R - 1];

    columnas.forEach((col, C) => {
      const cellRef = XLSX.utils.encode_cell({ r: R, c: C });

      if (!ws[cellRef]) return;

      const cellId = `${registro.id}_${col}`;

      let fillColor = null;

      // Resaltado manual
      if (cellColors[cellId]) {
        fillColor = cellColors[cellId].replace("#", "");
      }

      // Badge estado tiene prioridad
      if (col === "estado") {
        switch ((registro.estado || "").toUpperCase()) {
          case "ELABORACION":
            fillColor = "DFF2CE";
            break;
          case "DESESTIMADO":
            fillColor = "FBDDE4";
            break;
          case "DOC. ADICIONALES":
            fillColor = "D9E1F2";
            break;
          case "PTE. AGENDAR":
            fillColor = "FCE4D6";
            break;
          case "INSPECCION":
            fillColor = "FFF2CC";
            break;
        }
      }

      ws[cellRef].s = {
        fill: fillColor
          ? {
              patternType: "solid",
              fgColor: { rgb: fillColor },
            }
          : undefined,
      };
    });
  }

  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, ws, "Registros");

  const excelBuffer = XLSX.write(wb, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([excelBuffer], {
    type: "application/octet-stream",
  });

  saveAs(blob, generarNombreArchivo());
};