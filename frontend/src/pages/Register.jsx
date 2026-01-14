import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await API.post("/auth/register", form);
      navigate("/");
    } catch {
      alert("Registration failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-2xl font-bold mb-4">Register</h2>

        {["name", "email", "password", "college", "qualification", "address"].map(field => (
          <input key={field}
            className="w-full p-2 border mb-3"
            placeholder={field}
            type={field === "password" ? "password" : "text"}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
          />
        ))}

        <button onClick={handleRegister}
          className="w-full bg-green-600 text-white py-2 rounded">
          Register
        </button>
      </div>
    </div>
  );
}
