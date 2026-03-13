//src/utils/exportarExcel.js
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

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
      fila[col] = r[col] ?? "";
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

      ws[cellRef].s = {};

      if (cellColors[cellId]) {
        ws[cellRef].s.fill = {
          fgColor: { rgb: cellColors[cellId].replace("#", "") },
        };
      }

      if (col === "estado") {
        let color = "FFFFFF";

        switch (registro.estado) {
          case "ELABORACION":
            color = "22C55E";
            break;
          case "DESESTIMADO":
            color = "EF4444";
            break;
          case "DOC. ADICIONALES":
            color = "3B82F6";
            break;
          case "PTE. AGENDAR":
            color = "A855F7";
            break;
          case "INSPECCION":
            color = "FACC15";
            break;
        }

        ws[cellRef].s.fill = {
          fgColor: { rgb: color },
        };
      }
    });
  }

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Registros");

  const excelBuffer = XLSX.write(wb, {
    bookType: "xlsx",
    type: "array",
    cellStyles: true,
  });

  const blob = new Blob([excelBuffer], {
    type: "application/octet-stream",
  });

  saveAs(blob, "registros.xlsx");
};