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
  const [clientesExistentes, setClientesExistentes] = useState([]);
  const [sugerenciasCliente, setSugerenciasCliente] = useState([]);
  const [peritosExistentes, setPeritosExistentes] = useState([]);
  const [sugerenciasPerito, setSugerenciasPerito] = useState([]);

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

    setSugerenciasCliente([]);
    setSugerenciasPerito([]);
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
      onClose();
      limpiarFormulario();
    } catch (error) {
      console.error("Error guardando:", error);
    }
  };

  const handleEliminar = async () => {
    if (!window.confirm("¿Eliminar este registro?")) return;

    try {
      await deleteDoc(doc(db, "registros", registroEditar.id));
      onClose();
      limpiarFormulario();
    } catch (error) {
      console.error("Error eliminando:", error);
    }
  };

  const asunto = `${codJalvo} - ${codBanco} - ${cliente}`;

  useEffect(() => {
    const cargarDatos = async () => {
      const snapshot = await getDocs(collection(db, "registros"));

      const clientes = snapshot.docs
        .map((doc) => doc.data().cliente?.trim())
        .filter((c) => c);

      const peritos = snapshot.docs
        .map((doc) => doc.data().perito?.trim())
        .filter((p) => p);

/*       console.log("CLIENTES:", clientes);
      console.log("PERITOS:", peritos);
      console.log(snapshot.docs.map((doc) => doc.data())); */

      setClientesExistentes([...new Set(clientes)]);
      setPeritosExistentes([...new Set(peritos)]);
    };

    cargarDatos();
  }, []);

  if (!open) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box md:max-w-3xl max-w-[90vw] max-h-[90vh] overflow-y-auto">
        <h3 className="font-bold text-lg mb-4">Nuevo Registro</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-400">CODIGO JALCO</span>
            <input
              type="number"
              placeholder="COD JALVO"
              className="input input-bordered w-full"
              value={codJalvo}
              onChange={(e) => setCodJalvo(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-400">CODIGO BANCO</span>
            <input
              type="number"
              placeholder="COD BANCO"
              className="input input-bordered w-full"
              value={codBanco}
              onChange={(e) => setCodBanco(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-400">MES</span>
            <select
              className="select select-bordered w-full"
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
          </div>

          <div className="flex flex-col gap-1 col-span-1 md:col-span-2 w-full relative">
            <span className="text-xs text-gray-400">CLIENTE</span>

            <input
              type="text"
              placeholder="CLIENTE"
              className="input input-bordered w-full"
              value={cliente}
              onChange={(e) => {
                const valor = e.target.value;
                setCliente(valor);

                if (valor.trim() === "") {
                  setSugerenciasCliente([]);
                  return;
                }

                const filtrados = clientesExistentes
                  .filter((c) => c.toLowerCase().includes(valor.toLowerCase()))
                  .slice(0, 6);

                setSugerenciasCliente(filtrados);
              }}
              onBlur={() => {
                setTimeout(() => setSugerenciasCliente([]), 150);
              }}
            />

            {sugerenciasCliente.length > 0 && (
              <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-[9999] max-h-48 overflow-y-auto">
                {sugerenciasCliente.map((item, index) => (
                  <li
                    key={index}
                    className="px-3 py-2 hover:bg-neutral-100 cursor-pointer text-sm"
                    onClick={() => {
                      setCliente(item);
                      setSugerenciasCliente([]);
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-400">ESTADO</span>
            <select
              className="select select-bordered w-full"
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
          </div>

          <div className="flex flex-col gap-1 col-span-1 md:col-span-2 w-full relative">
            <span className="text-xs text-gray-400">PERITO</span>

            <input
              type="text"
              placeholder="PERITO"
              className="input input-bordered w-full"
              value={perito}
              onChange={(e) => {
                const valor = e.target.value;
                setPerito(valor);

                if (valor.trim() === "") {
                  setSugerenciasPerito([]);
                  return;
                }

                const filtrados = peritosExistentes
                  .filter((p) => p.toLowerCase().includes(valor.toLowerCase()))
                  .slice(0, 6);

                setSugerenciasPerito(filtrados);
              }}
              onBlur={() => {
                setTimeout(() => setSugerenciasPerito([]), 150);
              }}
            />

            {sugerenciasPerito.length > 0 && (
              <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-[9999] max-h-48 overflow-y-auto">
                {sugerenciasPerito.map((item, index) => (
                  <li
                    key={index}
                    className="px-3 py-2 hover:bg-neutral-100 cursor-pointer text-sm"
                    onClick={() => {
                      setPerito(item);
                      setSugerenciasPerito([]);
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-400">FECHA</span>
            <input
              type="date"
              className="input input-bordered w-full"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1 col-span-1 md:col-span-2 w-full">
            <span className="text-xs text-gray-400">ASUNTO</span>
            <input
              type="text"
              className="input input-bordered w-full border-gray-300"
              value={asunto}
              disabled
            />
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-400">HORA</span>
            <input
              type="time"
              className="input input-bordered w-full"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1 col-span-1 md:col-span-3 w-full">
            <span className="text-xs text-gray-400">COMENTARIO</span>
            <textarea
              placeholder="COMENTARIO"
              className="textarea textarea-bordered w-full"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
            />
          </div>
        </div>

        <div className="modal-action flex flex-row justify-between">
          <button
            className="btn rounded-xl"
            onClick={() => {
              limpiarFormulario();
              onClose();
            }}
          >
            Cerrar
          </button>
          <div className="flex flex-row gap-2">
            {editando && (
              <button
                className="btn btn-error rounded-xl text-white"
                onClick={handleEliminar}
              >
                Eliminar Registro
              </button>
            )}
            <button
              className="btn btn-success rounded-xl text-white"
              onClick={handleGuardar}
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalRegistro;
