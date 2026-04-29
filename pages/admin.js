import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import app from "../lib/firebase";

export default function Admin() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const db = getFirestore(app);
      const snapshot = await getDocs(collection(db, "orders"));
      const data = snapshot.docs.map(doc => doc.data());
      setOrders(data);
    };

    fetchOrders();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Orders</h1>

      {orders.map((order, i) => (
        <div key={i} style={{ marginBottom: "20px", border: "1px solid #ccc", padding: "10px" }}>
          <p>Status: {order.status}</p>

          {order.items.map((item, idx) => (
            <p key={idx}>{item.name} - ${item.price}</p>
          ))}
        </div>
      ))}
    </div>
  );
}
