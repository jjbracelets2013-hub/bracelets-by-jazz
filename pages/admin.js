import { useState, useEffect } from "react";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, getDocs, doc, updateDoc } from "firebase/firestore";
import app from "../lib/firebase";

export default function Admin() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState([]);
  
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const auth = getAuth(app);

  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        fetchOrders();
      }
    });
  }, []);

  const login = async () => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login success");
  } catch (err) {
    console.log(err);
    alert(err.message);
  }
};

  const fetchOrders = async () => {
    const db = getFirestore(app);
    const snapshot = await getDocs(collection(db, "orders"));
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setOrders(data);
  };

  const markDelivered = async (id) => {
    const db = getFirestore(app);
    await updateDoc(doc(db, "orders", id), {
      status: "Delivered"
    });
    fetchOrders();
  };

  if (!user) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>Admin Login</h2>
        <input placeholder="Email" onChange={(e)=>setEmail(e.target.value)} />
        <br /><br />
        <input type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)} />
        <br /><br />
        <button onClick={login}>Login</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>

      {orders.map(order => (
        <div key={order.id} style={{ border:"1px solid #ccc", margin:"10px", padding:"10px" }}>
          <p><strong>ID:</strong> {order.id}</p>
          <p>Status: {order.status}</p>

          {order.items.map((item,i)=>(
            <p key={i}>{item.name} - ${item.price}</p>
          ))}

          {order.status !== "Delivered" && (
            <button onClick={()=>markDelivered(order.id)}>
              Mark Delivered
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
