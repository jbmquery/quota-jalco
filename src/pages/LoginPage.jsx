import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {

      await signInWithEmailAndPassword(auth, email, password);

      navigate("/registros");

    } catch (error) {

      alert("Error de login: " + error.message);

    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-500">

      <div className="card w-96 bg-white shadow-xl rounded-2xl p-5">

        <div className="card-body">

          <h2 className="text-3xl font-bold text-center">
            Iniciar Sesión
          </h2>

          <p className="text-center text-sm opacity-70">
            Accede a tu panel de control
          </p>

          <form onSubmit={handleLogin} className="mt-4 space-y-4">

            <input
              type="email"
              placeholder="correo@email.com"
              className="input input-primary w-full"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="********"
              className="input input-primary w-full"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />

            <button className="btn btn-primary w-full">
              Ingresar
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}