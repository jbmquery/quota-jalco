import React, { useEffect, useMemo, useState } from "react";
import { db } from "../services/firebase";
import Navbar from "../components/Navbar";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

function AnalyticsPage() {
  const [registros, setRegistros] = useState([]);

  const currentYear = new Date().getFullYear();

  const [filtroAnio, setFiltroAnio] = useState(String(currentYear));
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("TODOS");

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

  const aniosDisponibles = useMemo(() => {
    const years = new Set();

    registros.forEach((r) => {
      if (r.fecha_registro?.toDate) {
        years.add(String(r.fecha_registro.toDate().getFullYear()));
      }
    });

    return Array.from(years).sort((a, b) => b - a);
  }, [registros]);

  const registrosFiltrados = useMemo(() => {
    const hoy = new Date();

    return registros.filter((r) => {
      if (!r.fecha_registro?.toDate) return false;

      const fecha = r.fecha_registro.toDate();

      const yearOk = String(fecha.getFullYear()) === filtroAnio;

      let inicioOk = true;
      let finOk = true;

      if (fechaInicio) {
        inicioOk = fecha >= new Date(fechaInicio);
      }

      if (fechaFin) {
        const fin = new Date(fechaFin);
        fin.setHours(23, 59, 59, 999);
        finOk = fecha <= fin;
      }

      if (fechaInicio && !fechaFin) {
        finOk = fecha <= hoy;
      }

      const estadoOk = filtroEstado === "TODOS" || r.estado === filtroEstado;

      return yearOk && inicioOk && finOk && estadoOk;
    });
  }, [registros, filtroAnio, fechaInicio, fechaFin, filtroEstado]);

  const totalRegistros = registrosFiltrados.length;

  const totalPte = registrosFiltrados.filter(
    (r) => r.estado === "PTE. AGENDAR",
  ).length;

  const totalElaborado = registrosFiltrados.filter(
    (r) => r.estado === "ELABORACION",
  ).length;

  const totalDesestimado = registrosFiltrados.filter(
    (r) => r.estado === "DESESTIMADO",
  ).length;

  const promedio =
    totalRegistros > 0
      ? (totalRegistros / Math.max(1, registrosFiltrados.length)).toFixed(2)
      : 0;

  const barrasData = useMemo(() => {
    const map = {};

    registrosFiltrados.forEach((r) => {
      const fecha = r.fecha_registro.toDate();

      const key =
        fechaInicio || fechaFin
          ? `${String(fecha.getDate()).padStart(2, "0")}/${String(
              fecha.getMonth() + 1,
            ).padStart(2, "0")}`
          : fecha.toLocaleString("es-PE", { month: "long" }).toUpperCase();

      if (!map[key]) {
        map[key] = {
          name: key,
          "PTE. AGENDAR": 0,
          ELABORACION: 0,
          DESESTIMADO: 0,
          INSPECCION: 0,
          "DOC. ADICIONALES": 0,
        };
      }

      map[key][r.estado] += 1;
    });

    return Object.values(map);
  }, [registrosFiltrados, fechaInicio, fechaFin]);

  const estadosData = useMemo(() => {
    const map = {};

    registrosFiltrados.forEach((r) => {
      map[r.estado] = (map[r.estado] || 0) + 1;
    });

    return Object.entries(map).map(([name, value]) => ({
      name,
      value,
    }));
  }, [registrosFiltrados]);

  const topClientes = useMemo(() => {
    const map = {};

    registrosFiltrados.forEach((r) => {
      if (!r.cliente) return;
      map[r.cliente] = (map[r.cliente] || 0) + 1;
    });

    return Object.entries(map)
      .map(([cliente, total]) => ({ cliente, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [registrosFiltrados]);

  const COLORS = ["#E72E98", "#F1B715", "#67D392", "#E9607C", "#5EBBFE"];

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-neutral-200">
      <Navbar />
      <div className="w-full max-w-full p-4">
        {/* FILTROS */}
        <div className="flex flex-col lg:flex-row flex-wrap gap-3 mb-6 w-full justify-center">
          {/* FILTRO POR AÑO */}
          <div className="border p-3 rounded-lg flex flex-col gap-2 border-gray-400 w-full lg:w-auto min-w-0">
            <span className="text-xs text-gray-500">FILTRO POR AÑO</span>

            <select
              className="select select-bordered w-full lg:w-50"
              value={filtroAnio}
              onChange={(e) => setFiltroAnio(e.target.value)}
            >
              {aniosDisponibles.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* FILTRO FECHAS */}
          <div className="border p-3 rounded-lg flex flex-col gap-2 border-gray-400 w-full lg:w-auto min-w-0">
            <span className="text-xs text-gray-500">
              FILTRO POR INTERVALO DE FECHAS
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-2 items-center w-full">
              <input
                type="date"
                className="input input-bordered w-full min-w-0 lg:w-50"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />

              <span className="text-xs text-gray-500 text-center">HASTA</span>

              <input
                type="date"
                className="input input-bordered w-full min-w-0 lg:w-50"
                value={fechaFin}
                min={fechaInicio || undefined}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>
          </div>

          {/* FILTRO ESTADOS */}
          <div className="border p-3 rounded-lg flex flex-col gap-2 border-gray-400 w-full lg:w-auto min-w-0">
            <span className="text-xs text-gray-500">FILTRO POR ESTADOS</span>

            <select
              className="select select-bordered w-full lg:w-50"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="TODOS">TODOS LOS ESTADOS</option>
              <option>PTE. AGENDAR</option>
              <option>ELABORACION</option>
              <option>DESESTIMADO</option>
            </select>
          </div>
        </div>

        {/* STATS */}
        <div className="w-full flex flex-row items-center justify-center text-center">
          <div className="stats shadow mb-6 w-full stats-vertical md:stats-horizontal bg-white rounded-2xl">
            <div className="stat">
              <div className="stat-title">Total Registros</div>
              <div className="stat-value text-black">{totalRegistros}</div>
            </div>

            <div className="stat">
              <div className="stat-title">PTE. AGENDAR</div>
              <div className="stat-value text-secondary">{totalPte}</div>
            </div>

            <div className="stat">
              <div className="stat-title">ELABORACIÓN</div>
              <div className="stat-value text-success">{totalElaborado}</div>
            </div>

            <div className="stat">
              <div className="stat-title">DESESTIMADO</div>
              <div className="stat-value text-error">{totalDesestimado}</div>
            </div>

            <div className="stat">
              <div className="stat-title">Promedio diario</div>
              <div className="stat-value text-black">{promedio}</div>
            </div>
          </div>
        </div>

        {/* GRAFICOS */}
        <div className="grid grid-cols-1 lg:grid-cols-8 gap-6 mb-6">
          {/* CAMBIO TEMPORAL */}
          <div className="bg-white rounded-2xl shadow p-4 h-[380px] col-span-1 lg:col-span-4">
            <h2 className="font-bold mb-4">Cambio temporal</h2>

            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={barrasData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />

                <Bar
                  dataKey="PTE. AGENDAR"
                  stackId="a"
                  fill="#E72E98"
                  radius={[0, 0, 0, 0]}
                />

                <Bar
                  dataKey="ELABORACION"
                  stackId="a"
                  fill="#67D392"
                  radius={[0, 0, 0, 0]}
                />

                <Bar
                  dataKey="DESESTIMADO"
                  stackId="a"
                  fill="#E9607C"
                  radius={[0, 0, 0, 0]}
                />

                <Bar
                  dataKey="INSPECCION"
                  stackId="a"
                  fill="#F1B715"
                  radius={[0, 0, 0, 0]}
                />

                <Bar
                    dataKey="DOC. ADICIONALES"
                  stackId="a"
                  fill="#5EBBFE"
                  radius={[0, 0, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ESTADOS */}
          <div className="bg-white rounded-2xl shadow p-4 h-[380px] col-span-1 lg:col-span-2">
            <h2 className="font-bold mb-4">Estados</h2>

            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie data={estadosData} dataKey="value" outerRadius={130}>
                  {estadosData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* TOP CLIENTES */}
          <div className="bg-white rounded-2xl shadow p-4 h-[380px] col-span-1 lg:col-span-2">
            <h2 className="font-bold mb-4">Top 5 clientes recurrentes</h2>

            {topClientes.map((c, i) => (
              <div
                key={i}
                className="flex justify-between py-2 border-b text-xs"
              >
                <span>{c.cliente}</span>
                <span>{c.total}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;
