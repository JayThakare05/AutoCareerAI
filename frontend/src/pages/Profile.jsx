import { useEffect, useState } from "react";
import API from "../api/api";

export default function Profile() {
  const [user, setUser] = useState({});
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    API.get("/profile").then(res => setUser(res.data));
  }, []);

  const updateProfile = async () => {
    await API.put("/profile", user);
    alert("Profile updated");
  };

  const uploadPhoto = async () => {
    const fd = new FormData();
    fd.append("photo", photo);
    await API.post("/profile/photo", fd);
    alert("Photo uploaded");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="bg-white p-6 rounded shadow max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">My Profile</h2>

        {["name", "college", "qualification", "address"].map(field => (
          <input
            key={field}
            className="w-full p-2 border mb-3"
            value={user[field] || ""}
            placeholder={field}
            onChange={e => setUser({ ...user, [field]: e.target.value })}
          />
        ))}

        <input
          className="w-full p-2 border mb-3 bg-gray-100"
          value={user.email || ""}
          disabled
        />

        <button
          onClick={updateProfile}
          className="w-full bg-blue-600 text-white py-2 rounded mb-6"
        >
          Update Profile
        </button>

        <hr className="mb-4" />

        <input type="file" onChange={e => setPhoto(e.target.files[0])} />
        <button
          onClick={uploadPhoto}
          className="w-full bg-green-600 text-white py-2 rounded mt-3"
        >
          Upload Profile Photo
        </button>
      </div>
    </div>
  );
}
