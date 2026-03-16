//src/pages/RegistrosPage.jsx
import { HiPaintBrush } from "react-icons/hi2";
import React, { useState, useEffect } from "react";
import ModalRegistro from "../components/ModalRegistro";
import { db } from "../services/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import TablaRegistros from "../components/TablaRegistros";
import Buscador from "../components/Buscador";
import Resaltador from "../components/Resaltador";
import { RiFileExcel2Line } from "react-icons/ri";
import { IoMdCloudUpload } from "react-icons/io";
import { exportarExcel } from "../utils/exportarExcel";
import { importarExcel } from "../utils/importarExcel";
import Alertas from "../components/Alertas";
import { IoIosNotifications } from "react-icons/io";
import { SiGoogleanalytics } from "react-icons/si";
import TablaPendientes from "../components/TablaPendientes";
import ModalPendientes from "../components/ModalPendientes";
import AlertasPendientes from "../components/AlertasPendientes";
import {useNavigate} from "react-router-dom";
import Navbar from "../components/Navbar";

function RegistrosPage() {
  const [openModal, setOpenModal] = useState(false);
  const [registroEditar, setRegistroEditar] = useState(null);
  const [registros, setRegistros] = useState([]);
  const [buscar, setBuscar] = useState("");
  const [selectedCell, setSelectedCell] = useState(null);
  const [cellColors, setCellColors] = useState(() => {
    const saved = localStorage.getItem("tablaResaltados");
    return saved ? JSON.parse(saved) : {};
  });
  const [pendientes, setPendientes] = useState([]);
  const [openPendiente, setOpenPendiente] = useState(false);
  const [pendienteEditar, setPendienteEditar] = useState(null);
  const navigate = useNavigate();
  const [soundMuted, setSoundMuted] = useState(() => {
    return JSON.parse(localStorage.getItem("soundMuted")) || false;
  });

  useEffect(() => {
    localStorage.setItem("soundMuted", JSON.stringify(soundMuted));
  }, [soundMuted]);

  useEffect(() => {
    localStorage.setItem("tablaResaltados", JSON.stringify(cellColors));
  }, [cellColors]);

  const registrosFiltrados = registros.filter((r) => {
    const texto = buscar.toLowerCase();

    return Object.values(r).some((valor) =>
      String(valor).toLowerCase().includes(texto),
    );
  });

  const registrosPte = registrosFiltrados.filter(
    (r) => r.estado === "PTE. AGENDAR",
  );

  const registrosInspeccion = registrosFiltrados.filter(
    (r) => r.estado === "INSPECCION",
  );

  const registrosDocs = registrosFiltrados.filter(
    (r) => r.estado === "DOC. ADICIONALES",
  );

  const registrosElaboracion = registrosFiltrados.filter(
    (r) => r.estado === "ELABORACION",
  );

  const registrosDesestimado = registrosFiltrados.filter(
    (r) => r.estado === "DESESTIMADO",
  );

  const pendientesSoloPendiente = pendientes.filter(
    (p) => p.estado === "PENDIENTE"
  );

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

  useEffect(() => {
    const q = query(
      collection(db, "pendientes"),
      orderBy("fecha_registro", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPendientes(data);
    });

    return () => unsubscribe();
  }, []);

  const aplicarColor = (color) => {
    if (!selectedCell) return;

    setCellColors((prev) => {
      const nuevo = { ...prev };

      if (color === "remove") {
        delete nuevo[selectedCell];
      } else {
        nuevo[selectedCell] = color;
      }

      return nuevo;
    });
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    await importarExcel(file);
  };

  const abrirModalEditar = (registro) => {
    setRegistroEditar(registro);
    setOpenModal(true);
  };

  const abrirModalPendiente = (pendiente) => {
    setPendienteEditar(pendiente);
    setOpenPendiente(true);
  };

  return (
    <div className="min-h-screen bg-neutral-200">
      {/* Navbar */}
      <Navbar soundMuted={soundMuted} setSoundMuted={setSoundMuted} />

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
            <div className="flex flex-col lg:flex-row mb-5 justify-between gap-2">
              <div className="flex flex-row gap-1 md:gap-2 justify-between">
                <button
                  className="btn btn-primary rounded-xl"
                  onClick={() => setOpenModal(true)}
                >
                  + Agregar Registro
                </button>
                <div className="flex flex-row gap-1 md:gap-2">
                  <button
                    className="btn rounded-xl text-2xl bg-green-500 hover:bg-green-600 text-white shadow-sm"
                    onClick={() =>
                      exportarExcel(registrosFiltrados, cellColors)
                    }
                  >
                    <RiFileExcel2Line />
                  </button>
                  <>
                    <input
                      type="file"
                      accept=".xlsx"
                      id="excelUpload"
                      hidden
                      onChange={handleImport}
                    />

                    <button
                      className="btn rounded-xl text-2xl bg-blue-500 hover:bg-blue-600 text-white shadow-sm"
                      onClick={() =>
                        document.getElementById("excelUpload").click()
                      }
                    >
                      <IoMdCloudUpload />
                    </button>
                  </>
                </div>
              </div>
              <div className="flex flex-row gap-1 md:gap-2 justify-between">
                <Resaltador onColor={aplicarColor} />
                <Buscador value={buscar} onChange={setBuscar} />
              </div>
            </div>
            <div className="h-[calc(100vh-260px)]">
              <TablaRegistros
                registros={registrosFiltrados}
                onEditar={abrirModalEditar}
                selectedCell={selectedCell}
                setSelectedCell={setSelectedCell}
                cellColors={cellColors}
              />
            </div>
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
              <div className="flex flex-row gap-1 md:gap-2">
                <Resaltador onColor={aplicarColor} />
                <Buscador value={buscar} onChange={setBuscar} />
              </div>
            </div>
            <div className="h-[calc(100vh-260px)]">
              <TablaRegistros
                registros={registrosPte}
                onEditar={abrirModalEditar}
                selectedCell={selectedCell}
                setSelectedCell={setSelectedCell}
                cellColors={cellColors}
              />
            </div>
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
              <div className="flex flex-row gap-1 md:gap-2">
                <Resaltador onColor={aplicarColor} />
                <Buscador value={buscar} onChange={setBuscar} />
              </div>
            </div>
            <div className="h-[calc(100vh-260px)]">
              <TablaRegistros
                registros={registrosInspeccion}
                onEditar={abrirModalEditar}
                selectedCell={selectedCell}
                setSelectedCell={setSelectedCell}
                cellColors={cellColors}
              />
            </div>
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
              <div className="flex flex-row gap-1 md:gap-2">
                <Resaltador onColor={aplicarColor} />
                <Buscador value={buscar} onChange={setBuscar} />
              </div>
            </div>
            <div className="h-[calc(100vh-260px)]">
              <TablaRegistros
                registros={registrosDocs}
                onEditar={abrirModalEditar}
                selectedCell={selectedCell}
                setSelectedCell={setSelectedCell}
                cellColors={cellColors}
              />
            </div>
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
              <div className="flex flex-row gap-1 md:gap-2">
                <Resaltador onColor={aplicarColor} />
                <Buscador value={buscar} onChange={setBuscar} />
              </div>
            </div>
            <div className="h-[calc(100vh-260px)]">
              <TablaRegistros
                registros={registrosElaboracion}
                onEditar={abrirModalEditar}
                selectedCell={selectedCell}
                setSelectedCell={setSelectedCell}
                cellColors={cellColors}
              />
            </div>
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
              <div className="flex flex-row gap-1 md:gap-2">
                <Resaltador onColor={aplicarColor} />
                <Buscador value={buscar} onChange={setBuscar} />
              </div>
            </div>
            <div className="h-[calc(100vh-260px)]">
              <TablaRegistros
                registros={registrosDesestimado}
                onEditar={abrirModalEditar}
                selectedCell={selectedCell}
                setSelectedCell={setSelectedCell}
                cellColors={cellColors}
              />
            </div>
          </div>

          {/* TAB 7 */}
          <input
            type="radio"
            name="tabs_registros"
            className="tab tabs-lg font-bold text-black"
            aria-label="PENDIENTES"
          />

          <div className="tab-content bg-base-100 border-base-300 p-6">
            <div className="flex flex-row mb-5 justify-start">
              <div className="flex flex-row gap-1 md:gap-2">
                <button
                  className="btn btn-info rounded-xl text-white"
                  onClick={() => setOpenPendiente(true)}
                >
                  + Agregar Pendiente
                </button>
              </div>
            </div>
            <div className="h-[calc(100vh-260px)]">
              <TablaPendientes
                pendientes={pendientesSoloPendiente}
                onEditar={abrirModalPendiente}
              />
            </div>
          </div>
        </div>
      </div>
      {/* MODAL */}
      <ModalRegistro
        open={openModal || !!registroEditar}
        onClose={() => {
          setOpenModal(false);
          setRegistroEditar(null);
        }}
        registroEditar={registroEditar}
      />
      {/* MODAL PENDIENTES */}
      <ModalPendientes
        open={openPendiente || !!pendienteEditar}
        onClose={() => {
          setOpenPendiente(false);
          setPendienteEditar(null);
        }}
        pendienteEditar={pendienteEditar}
      />
      {/* ALERTAS */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3">
        <Alertas
          registros={registros}
          onEditar={(registro) => abrirModalEditar(registro)}
          soundMuted={soundMuted}
        />

        <AlertasPendientes
          pendientes={pendientes}
          onEditar={(pendiente) => abrirModalPendiente(pendiente)}
          soundMuted={soundMuted}
        />
      </div>
    </div>
  );
}

export default RegistrosPage;
