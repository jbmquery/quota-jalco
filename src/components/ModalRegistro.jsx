//src/components/ModalRegistro.jsx
import { useState, useEffect } from "react";
import { db } from "../services/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";

function ModalRegistro({ open, onClose, registroEditar }) {
  const [mes, setMes] = useState("");
  const [codJalvo, setCodJalvo] = useState("");
  const [codBanco, setCodBanco] = useState("");
  const [estado, setEstado] = useState("");
  const [cliente, setCliente] = useState("");
  const [perito, setPerito] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [comentario, setComentario] = useState("");
  const editando = !!registroEditar;

  useEffect(() => {
    if (registroEditar) {
      setMes(registroEditar.mes || "");
      setCodJalvo(registroEditar.codJalvo || "");
      setCodBanco(registroEditar.codBanco || "");
      setEstado(registroEditar.estado || "");
      setCliente(registroEditar.cliente || "");
      setPerito(registroEditar.perito || "");
      setFecha(registroEditar.fecha || "");
      setHora(registroEditar.hora || "");
      setComentario(registroEditar.comentario || "");
    }
  }, [registroEditar]);

  const limpiarFormulario = () => {
    setMes("");
    setCodJalvo("");
    setCodBanco("");
    setEstado("");
    setCliente("");
    setPerito("");
    setFecha("");
    setHora("");
    setComentario("");
  };

  const handleGuardar = async () => {
    const clienteClean = cliente.trim().toUpperCase();
    const peritoClean = perito.trim().toUpperCase();
    const comentarioClean = comentario.trim().toUpperCase();
    const asunto = `${codJalvo} - ${codBanco} - ${clienteClean}`;

    try {
      if (!codBanco) {
        alert("Debes ingresar COD BANCO");
        return;
      }

      const snapshot = await getDocs(collection(db, "registros"));

      const codBancoNuevo = String(codBanco);

/*       console.log("editando:", editando);
      console.log("registroEditar:", registroEditar);
      console.log("codBancoNuevo:", codBancoNuevo); */
      const existeDuplicado = snapshot.docs.some((docItem) => {
        const data = docItem.data();

        const codExistente = String(data.codBanco);

        if (editando) {
          return (
            docItem.id !== registroEditar.id && codExistente === codBancoNuevo
          );
        }

        return codExistente === codBancoNuevo;
      });

      if (existeDuplicado) {
        alert(
          "El COD BANCO ya existe en la base de datos. Debes cambiarlo antes de guardar.",
        );
        return;
      }
      if (editando) {
        const ref = doc(db, "registros", registroEditar.id);
        await updateDoc(ref, {
          mes: mes.trim(),
          codJalvo: Number(codJalvo),
          codBanco: Number(codBanco),
          estado: estado.trim(),
          cliente: clienteClean,
          asunto: asunto.toUpperCase(),
          perito: peritoClean,
          fecha,
          hora,
          comentario: comentarioClean,
        });
      } else {
        await addDoc(collection(db, "registros"), {
          mes: mes.trim(),
          codJalvo: Number(codJalvo),
          codBanco: Number(codBanco),
          estado: estado.trim(),
          cliente: clienteClean,
          asunto: asunto.toUpperCase(),
          perito: peritoClean,
          fecha,
          hora,
          comentario: comentarioClean,
          fecha_registro: serverTimestamp(),
        });
      }

      limpiarFormulario();
      onClose();
    } catch (error) {
      console.error("Error guardando:", error);
    }
  };

  const handleEliminar = async () => {
    if (!window.confirm("¿Eliminar este registro?")) return;

    try {
      await deleteDoc(doc(db, "registros", registroEditar.id));
      limpiarFormulario();
      onClose();
    } catch (error) {
      console.error("Error eliminando:", error);
    }
  };

  const asunto = `${codJalvo} - ${codBanco} - ${cliente}`;

  if (!open) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-3xl">
        <h3 className="font-bold text-lg mb-4">Nuevo Registro</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <select
            className="select select-bordered"
            value={mes}
            onChange={(e) => setMes(e.target.value)}
          >
            <option value="" disabled>
              MES
            </option>
            <option>ENERO</option>
            <option>FEBRERO</option>
            <option>MARZO</option>
            <option>ABRIL</option>
            <option>MAYO</option>
            <option>JUNIO</option>
            <option>JULIO</option>
            <option>AGOSTO</option>
            <option>SETIEMBRE</option>
            <option>OCTUBRE</option>
            <option>NOVIEMBRE</option>
            <option>DICIEMBRE</option>
          </select>

          <input
            type="number"
            placeholder="COD JALVO"
            className="input input-bordered"
            value={codJalvo}
            onChange={(e) => setCodJalvo(e.target.value)}
          />

          <input
            type="number"
            placeholder="COD BANCO"
            className="input input-bordered"
            value={codBanco}
            onChange={(e) => setCodBanco(e.target.value)}
          />

          <select
            className="select select-bordered"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
          >
            <option value="" disabled>
              ESTADO
            </option>
            <option>PTE. AGENDAR</option>
            <option>INSPECCION</option>
            <option>DOC. ADICIONALES</option>
            <option>ELABORACION</option>
            <option>DESESTIMADO</option>
          </select>

          <input
            type="text"
            placeholder="CLIENTE"
            className="input input-bordered"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
          />

          <input
            type="text"
            className="input input-bordered"
            value={asunto}
            disabled
          />

          <input
            type="text"
            placeholder="PERITO"
            className="input input-bordered"
            value={perito}
            onChange={(e) => setPerito(e.target.value)}
          />

          <input
            type="date"
            className="input input-bordered"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />

          <input
            type="time"
            className="input input-bordered"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
          />

          <textarea
            placeholder="COMENTARIO"
            className="textarea textarea-bordered md:col-span-2"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
          />
        </div>

        <div className="modal-action">
          <button
            className="btn"
            onClick={() => {
              limpiarFormulario();
              onClose();
            }}
          >
            Cancelar
          </button>
          {editando && (
            <button className="btn btn-error" onClick={handleEliminar}>
              Eliminar Registro
            </button>
          )}
          <button className="btn btn-primary" onClick={handleGuardar}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalRegistro;
