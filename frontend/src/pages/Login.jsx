import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <input className="w-full p-2 border mb-3" placeholder="Email"
          onChange={(e) => setEmail(e.target.value)} />
        <input type="password" className="w-full p-2 border mb-3" placeholder="Password"
          onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded">
          Login
        </button>
        <p className="mt-4 text-sm text-center">
            Not registered?{" "}
            <a href="/register" className="text-blue-600 font-semibold">
                Register
            </a>
            </p>

      </div>
    </div>
  );
}
