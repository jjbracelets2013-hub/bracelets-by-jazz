import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs, doc, updateDoc } from "firebase/firestore";
import app from "../lib/firebase";

export default function Admin() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const db = getFirestore(app);
      const snapshot = await getDocs(collection(db, "orders"));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(data);
    };

    fetchOrders();
  }, []);

  const markDelivered = async (id) => {
    const db = getFirestore(app);
    const orderRef = doc(db, "orders", id);

    await updateDoc(orderRef, {
      status: "Delivered"
    });

    alert("Marked as delivered");
    location.reload();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Orders</h1>

      {orders.map((order) => (
        <div key={order.id} style={{
          marginBottom: "20px",
          border: "1px solid #ccc",
          padding: "10px"
        }}>
          <p><strong>Order ID:</strong> {order.id}</p>
          <p>Status: {order.status}</p>

          {order.items.map((item, idx) => (
            <p key={idx}>{item.name} - ${item.price}</p>
          ))}

          {order.status !== "Delivered" && (
            <button onClick={() => markDelivered(order.id)}>
              Mark Delivered
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
