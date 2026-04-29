import { useState } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import app from "../lib/firebase";

export default function Track() {
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState("");

  const checkOrder = async () => {
    const db = getFirestore(app);
    const docRef = doc(db, "orders", orderId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setStatus(docSnap.data().status);
    } else {
      setStatus("Order not found");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Track Your Order</h1>

      <input
        placeholder="Enter Order ID"
        onChange={(e) => setOrderId(e.target.value)}
      />

      <br /><br />

      <button onClick={checkOrder}>
        Track Order
      </button>

      <h2>{status}</h2>
    </div>
  );
}
