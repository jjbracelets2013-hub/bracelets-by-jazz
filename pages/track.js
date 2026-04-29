import { useState } from "react";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import app from "../lib/firebase";

export default function Track() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);

  const searchOrder = async () => {
    try {
      const db = getFirestore(app);

      const q = query(
        collection(db, "orders"),
        where("__name__", "==", orderId)
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        alert("Order not found");
        return;
      }

      const data = snapshot.docs[0].data();
      setOrder(data);
    } catch (err) {
      console.error(err);
      alert("Error finding order");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <h1>Track Your Order 📦</h1>

      <input
        placeholder="Enter Order ID"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
        style={{ padding: "10px", width: "300px" }}
      />

      <br /><br />

      <button onClick={searchOrder}>
        Track Order
      </button>

      {order && (
        <div style={{
          marginTop: "30px",
          border: "1px solid #ccc",
          padding: "20px",
          borderRadius: "10px"
        }}>
          <h3>Status: {order.status}</h3>

          <h4>Items:</h4>
          {order.items.map((item, i) => (
            <p key={i}>
              {item.name} - ${item.price}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
