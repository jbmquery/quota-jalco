import React, { useEffect, useState } from "react";
import { db } from "../services/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";

function ModalPendientes({ open, onClose, pendienteEditar }) {
  const [form, setForm] = useState({
    codJalvo: "",
    codBanco: "",
    comentario: "",
    fecha: "",
    hora: "",
    estado: "PENDIENTE",
  });

  useEffect(() => {
    if (pendienteEditar) {
      setForm({
        codJalvo: pendienteEditar.codJalvo || "",
        codBanco: pendienteEditar.codBanco || "",
        comentario: pendienteEditar.comentario || "",
        fecha: pendienteEditar.fecha || "",
        hora: pendienteEditar.hora || "",
        estado: pendienteEditar.estado || "PENDIENTE",
      });
    } else {
      setForm({
        codJalvo: "",
        codBanco: "",
        comentario: "",
        fecha: "",
        hora: "",
        estado: "PENDIENTE",
      });
    }
  }, [pendienteEditar]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "codJalvo" || name === "codBanco"
          ? value.replace(/\D/g, "")
          : value,
    }));
  };

  const guardarPendiente = async () => {
    try {
      if (pendienteEditar) {
        await updateDoc(doc(db, "pendientes", pendienteEditar.id), {
          ...form,
          codJalvo: Number(form.codJalvo),
          codBanco: Number(form.codBanco),
        });

        toast.success("Pendiente actualizado");
      } else {
        await addDoc(collection(db, "pendientes"), {
          ...form,
          codJalvo: Number(form.codJalvo),
          codBanco: Number(form.codBanco),
          fecha_registro: serverTimestamp(),
        });

        toast.success("Pendiente guardado");
      }

      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar");
    }
  };

  const eliminarPendiente = async () => {
    if (!pendienteEditar) return;

    try {
      await deleteDoc(doc(db, "pendientes", pendienteEditar.id));
      toast.success("Pendiente eliminado");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Error al eliminar");
    }
  };

  if (!open) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box rounded-2xl max-w-lg">
        <h3 className="font-bold text-lg mb-4">
          {pendienteEditar ? "Editar Pendiente" : "Nuevo Pendiente"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="text"
            name="codJalvo"
            placeholder="COD. JALVO"
            className="input input-bordered"
            value={form.codJalvo}
            onChange={handleChange}
          />

          <input
            type="text"
            name="codBanco"
            placeholder="COD. BANCO"
            className="input input-bordered"
            value={form.codBanco}
            onChange={handleChange}
          />

          <input
            type="date"
            name="fecha"
            className="input input-bordered"
            value={form.fecha}
            onChange={handleChange}
          />

          <input
            type="time"
            name="hora"
            className="input input-bordered"
            value={form.hora}
            onChange={handleChange}
          />

          <select
            name="estado"
            className="select select-bordered"
            value={form.estado}
            onChange={handleChange}
          >
            <option value="" disabled>
              ESTADO
            </option>
            <option value="PENDIENTE">PENDIENTE</option>
            <option value="LISTO">LISTO</option>
          </select>

          <textarea
            name="comentario"
            placeholder="COMENTARIO"
            className="textarea w-full textarea-bordered md:col-span-2"
            rows="4"
            value={form.comentario}
            onChange={handleChange}
          />
        </div>

        <div className="modal-action flex justify-between">
        <button className="btn rounded-xl" onClick={onClose}>
            Cerrar
        </button>

        <div className="flex gap-2">
            {pendienteEditar && (
            <button
                className="btn btn-error rounded-xl text-white"
                onClick={eliminarPendiente}
            >
                Eliminar
            </button>
            )}

            <button
            className="btn btn-success text-white rounded-xl"
            onClick={guardarPendiente}
            >
            Guardar
            </button>
        </div>
        </div>
      </div>
    </dialog>
  );
}

export default ModalPendientes;
