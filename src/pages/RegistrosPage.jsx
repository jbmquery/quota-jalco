//src/pages/RegistrosPage.jsx
import { HiPaintBrush } from "react-icons/hi2";
import React, { useState, useEffect } from "react";
import ModalRegistro from "../components/ModalRegistro";
import { db } from "../services/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import TablaRegistros from "../components/TablaRegistros";

function RegistrosPage() {
  const [openModal, setOpenModal] = useState(false);
  const [registros, setRegistros] = useState([]);
  const registrosPte = registros.filter((r) => r.estado === "PTE. AGENDAR");
  const registrosInspeccion = registros.filter(
    (r) => r.estado === "INSPECCION",
  );
  const registrosDocs = registros.filter(
    (r) => r.estado === "DOC. ADICIONALES",
  );
  const registrosElaboracion = registros.filter(
    (r) => r.estado === "ELABORACION",
  );
  const registrosDesestimado = registros.filter(
    (r) => r.estado === "DESESTIMADO",
  );
  const [registroEditar, setRegistroEditar] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, "registros"),
      orderBy("fecha_registro", "desc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setRegistros(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-200">
      {/* Navbar */}
      <div className="navbar bg-primary shadow-sm">
        <div className="flex-1 px-2">
          <a className="text-xl text-white font-bold mr-2">QUOTA JALCO</a>
          <a className="text-xl text-white opacity-75 italic">
            by JBM Solutions
          </a>
        </div>

        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li>
              <a className="text-white font-bold">Salir</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex flex-col gap-3 p-3">
        <div className="tabs tabs-box bg-slate-400 border-base-300 rounded-lg">
          {/* TAB 1 */}
          <input
            type="radio"
            name="tabs_registros"
            className="tab tabs-lg font-bold"
            aria-label="GENERAL"
            defaultChecked
          />

          <div className="tab-content bg-base-100 border-base-300 p-6">
            <div className="flex flex-col md:flex-row mb-5 justify-between gap-2">
              <div>
                <button
                  className="btn btn-primary rounded-xl"
                  onClick={() => setOpenModal(true)}
                >
                  + Agregar Registro
                </button>
              </div>
              <div className="flex flex-row gap-1 md:gap-2">
                <button className="btn text-xl bg-white text-gray-400 rounded-xl shadow-sm">
                  <HiPaintBrush />
                </button>
                <button className="btn text-xl bg-amber-300 text-black rounded-xl shadow-sm">
                  <HiPaintBrush />
                </button>
                <button className="btn text-xl bg-pink-500 text-white rounded-xl shadow-sm">
                  <HiPaintBrush />
                </button>
                <button className="btn text-xl bg-cyan-400 text-white rounded-xl shadow-sm">
                  <HiPaintBrush />
                </button>
                <input
                  type="text"
                  className="input input-primary rounded-xl"
                  placeholder="Buscar registro... "
                />
              </div>
            </div>
            <TablaRegistros
              registros={registros}
              onEditar={setRegistroEditar}
            />
          </div>

          {/* TAB 2 */}
          <input
            type="radio"
            name="tabs_registros"
            className="tab tabs-lg font-bold"
            aria-label="PTE. AGENDAR"
          />

          <div className="tab-content bg-base-100 border-base-300 p-6">
            <div className="flex flex-row mb-5 justify-end">
              <div>
                <input
                  type="text"
                  className="input input-primary"
                  placeholder="Buscar registro... "
                />
              </div>
            </div>
            <TablaRegistros
              registros={registrosPte}
              onEditar={setRegistroEditar}
            />
          </div>

          {/* TAB 3 */}
          <input
            type="radio"
            name="tabs_registros"
            className="tab tabs-lg font-bold"
            aria-label="INSPECCION"
          />

          <div className="tab-content bg-base-100 border-base-300 p-6">
            <div className="flex flex-row mb-5 justify-end">
              <div>
                <input
                  type="text"
                  className="input input-primary"
                  placeholder="Buscar registro... "
                />
              </div>
            </div>
            <TablaRegistros
              registros={registrosInspeccion}
              onEditar={setRegistroEditar}
            />
          </div>

          {/* TAB 4 */}
          <input
            type="radio"
            name="tabs_registros"
            className="tab tabs-lg font-bold"
            aria-label="DOC. ADICIONALES"
          />

          <div className="tab-content bg-base-100 border-base-300 p-6">
            <div className="flex flex-row mb-5 justify-end">
              <div>
                <input
                  type="text"
                  className="input input-primary"
                  placeholder="Buscar registro... "
                />
              </div>
            </div>
            <TablaRegistros
              registros={registrosDocs}
              onEditar={setRegistroEditar}
            />
          </div>

          {/* TAB 5 */}
          <input
            type="radio"
            name="tabs_registros"
            className="tab tabs-lg font-bold"
            aria-label="ELABORACION"
          />

          <div className="tab-content bg-base-100 border-base-300 p-6">
            <div className="flex flex-row mb-5 justify-end">
              <div>
                <input
                  type="text"
                  className="input input-primary"
                  placeholder="Buscar registro... "
                />
              </div>
            </div>
            <TablaRegistros
              registros={registrosElaboracion}
              onEditar={setRegistroEditar}
            />
          </div>
          {/* TAB 6 */}
          <input
            type="radio"
            name="tabs_registros"
            className="tab tabs-lg font-bold"
            aria-label="DESESTIMADO"
          />

          <div className="tab-content bg-base-100 border-base-300 p-6">
            <div className="flex flex-row mb-5 justify-end">
              <div>
                <input
                  type="text"
                  className="input input-primary"
                  placeholder="Buscar registro... "
                />
              </div>
            </div>
            <TablaRegistros
              registros={registrosDesestimado}
              onEditar={setRegistroEditar}
            />
          </div>
        </div>
      </div>
      {/* MODAL */}
      <ModalRegistro
        open={openModal || registroEditar}
        onClose={() => {
          setOpenModal(false);
          setRegistroEditar(null);
        }}
        registroEditar={registroEditar}
      />
    </div>
  );
}

export default RegistrosPage;
