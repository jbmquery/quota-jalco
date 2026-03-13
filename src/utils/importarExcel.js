import * as XLSX from "xlsx";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../services/firebase";

const excelFechaAString = (valor) => {
  if (typeof valor === "number") {
    const fecha = XLSX.SSF.parse_date_code(valor);

    if (!fecha) return "";

    const dia = String(fecha.d).padStart(2, "0");
    const mes = String(fecha.m).padStart(2, "0");
    const anio = String(fecha.y);

    return `${anio}-${mes}-${dia}`;
  }

  if (typeof valor === "string") {
    if (valor.includes("-")) {
      const partes = valor.split("-");

      if (partes.length === 3) {
        const anio = partes[0];
        const mes = partes[1];
        const dia = partes[2];

        return `${anio}-${mes}-${dia}`;
      }
    }

    return valor.toUpperCase();
  }

  return "";
};

const excelHoraAString = (valor) => {
  if (typeof valor === "number") {
    const totalSegundos = Math.round(valor * 24 * 60 * 60);

    const horas = String(Math.floor(totalSegundos / 3600)).padStart(2, "0");
    const minutos = String(
      Math.floor((totalSegundos % 3600) / 60)
    ).padStart(2, "0");

    return `${horas}:${minutos}`;
  }

  return String(valor ?? "").toUpperCase();
};

const aMayuscula = (valor) => {
  return String(valor ?? "").toUpperCase();
};

export const importarExcel = async (file) => {
  try {
    const data = await file.arrayBuffer();

    const workbook = XLSX.read(data);

    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const json = XLSX.utils.sheet_to_json(sheet);

    if (!json.length) {
      alert("El archivo está vacío.");
      return;
    }

    const columnasEsperadas = [
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

    const columnasArchivo = Object.keys(json[0]);

    const columnasValidas = columnasEsperadas.every((col) =>
      columnasArchivo.includes(col)
    );

    if (!columnasValidas) {
      alert("Las columnas del archivo no coinciden con el formato esperado.");
      return;
    }

    const snapshot = await getDocs(collection(db, "registros"));

    const existentes = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    let insertados = 0;
    let actualizados = 0;

    for (const fila of json) {
      const registroLimpio = {
        mes: aMayuscula(fila.mes),
        codJalvo: Number(fila.codJalvo),
        codBanco: Number(fila.codBanco),
        estado: aMayuscula(fila.estado),
        cliente: aMayuscula(fila.cliente),
        asunto: aMayuscula(fila.asunto),
        perito: aMayuscula(fila.perito),
        fecha: excelFechaAString(fila.fecha),
        hora: excelHoraAString(fila.hora),
        comentario: aMayuscula(fila.comentario),
        fecha_registro: Timestamp.now(),
      };

      const existente = existentes.find(
        (r) => Number(r.codBanco) === registroLimpio.codBanco
      );

      if (existente) {
        await updateDoc(doc(db, "registros", existente.id), registroLimpio);
        actualizados++;
      } else {
        await addDoc(collection(db, "registros"), registroLimpio);
        insertados++;
      }
    }

    alert(
      `Carga completada ✅\nInsertados: ${insertados}\nActualizados: ${actualizados}`
    );
  } catch (error) {
    console.error(error);
    alert("Error al importar archivo.");
  }
};