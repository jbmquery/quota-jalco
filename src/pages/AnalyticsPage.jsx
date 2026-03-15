import React, { useEffect, useMemo, useState } from "react";
import { db } from "../services/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

function AnalyticsPage() {
  const [registros, setRegistros] = useState([]);
  const [pendientes, setPendientes] = useState([]);
  const [filtroMes, setFiltroMes] = useState("TODOS");

  useEffect(() => {
    const q = query(
      collection(db, "registros"),
      orderBy("fecha_registro", "desc")
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

  const registrosFiltrados = useMemo(() => {
    if (filtroMes === "TODOS") return registros;
    return registros.filter((r) => r.mes === filtroMes);
  }, [registros, filtroMes]);

  const estadosData = useMemo(() => {
    const estados = {};

    registrosFiltrados.forEach((r) => {
      estados[r.estado] = (estados[r.estado] || 0) + 1;
    });

    return Object.entries(estados).map(([name, value]) => ({
      name,
      value,
    }));
  }, [registrosFiltrados]);

  const mesesData = useMemo(() => {
    const meses = {};

    registros.forEach((r) => {
      meses[r.mes] = (meses[r.mes] || 0) + 1;
    });

    return Object.entries(meses).map(([name, value]) => ({
      name,
      value,
    }));
  }, [registros]);

  const pendientesActivos = pendientes.filter(
    (p) => p.estado === "PENDIENTE"
  ).length;

  const totalRegistros = registrosFiltrados.length;

  const COLORS = [
    "#3b82f6",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
  ];

  return (
    <div className="min-h-screen bg-neutral-200 p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

        <div className="stat bg-white rounded-2xl shadow">
          <div className="stat-title">Total Registros</div>
          <div className="stat-value text-primary">{totalRegistros}</div>
        </div>

        <div className="stat bg-white rounded-2xl shadow">
          <div className="stat-title">Pendientes</div>
          <div className="stat-value text-warning">{pendientesActivos}</div>
        </div>

        <div className="stat bg-white rounded-2xl shadow">
          <div className="stat-title">Inspección</div>
          <div className="stat-value text-warning">
            {registrosFiltrados.filter((r) => r.estado === "INSPECCION").length}
          </div>
        </div>

        <div className="stat bg-white rounded-2xl shadow">
          <div className="stat-title">Elaboración</div>
          <div className="stat-value text-success">
            {registrosFiltrados.filter((r) => r.estado === "ELABORACION").length}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-4 mb-6">
        <select
          className="select select-bordered"
          value={filtroMes}
          onChange={(e) => setFiltroMes(e.target.value)}
        >
          <option value="TODOS">TODOS</option>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-white rounded-2xl shadow p-4 h-[420px]">
          <h2 className="font-bold mb-4">Estados actuales</h2>

          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={estadosData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow p-4 h-[420px]">
          <h2 className="font-bold mb-4">Distribución general</h2>

          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={estadosData}
                dataKey="value"
                nameKey="name"
                outerRadius={130}
              >
                {estadosData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow p-4 h-[420px] lg:col-span-2">
          <h2 className="font-bold mb-4">Registros por mes</h2>

          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={mesesData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}

export default AnalyticsPage;