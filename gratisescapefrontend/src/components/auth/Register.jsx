import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Register = () => {
  const [form, setForm] = useState({ nome: "", cognome: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        form,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      toast.success("Registrazione riuscita! Controlla la mail per confermare.");
      navigate("/login");
    } catch (err) {
      toast.error("Errore durante la registrazione.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Registrati</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="nome" value={form.nome} onChange={handleChange} placeholder="Nome" className="form-control mb-2" />
        <input type="text" name="cognome" value={form.cognome} onChange={handleChange} placeholder="Cognome" className="form-control mb-2" />
        <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" className="form-control mb-2" />
        <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" className="form-control mb-3" />
        <button className="btn btn-textcolor">
  Registrati
</button>

      </form>
    </div>
  );
};

export default Register;

