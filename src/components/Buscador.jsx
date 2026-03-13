function Buscador({ value, onChange }) {
  return (
    <input
      type="text"
      placeholder="Buscar en registros..."
      className="input input-primary rounded-xl w-full md:w-64"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export default Buscador;