import { useState } from "react";

export default function Admin() {
  const [password, setPassword] = useState("");

  if (password !== "1234") {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>Admin Login</h2>
        <input
          type="password"
          placeholder="Enter password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Admin Panel</h1>
      <p>You can manage products here</p>
    </div>
  );
}
