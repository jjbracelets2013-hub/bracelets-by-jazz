import { useState, useEffect } from "react";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, getDocs, doc, updateDoc, addDoc } from "firebase/firestore";
import app from "../lib/firebase";

export default function Admin() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);

  const auth = getAuth(app);

  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        fetchOrders();
      }
    });
  }, []);

  // 🔐 LOGIN
  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login success");
    } catch (err) {
      console.log(err);
      alert(err.message);
    }
  };

  // 📦 GET ORDERS
  const fetchOrders = async () => {
    const db = getFirestore(app);
    const snapshot = await getDocs(collection(db, "orders"));
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setOrders(data);
  };

  // 📸 UPLOAD IMAGE TO CLOUDINARY
  const uploadImage = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "my_uploads");

    setUploading(true);

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dfijp0los/image/upload",
      {
        method: "POST",
        body: data,
      }
    );

    const result = await res.json();
    setUploading(false);

    return result.secure_url;
  };

  // 🛒 ADD PRODUCT
  const addProduct = async () => {
    try {
      const db = getFirestore(app);

      if (!name || !price || !image) {
        alert("Fill all fields and upload an image first.");
        return;
      }

      await addDoc(collection(db, "products"), {
        name,
        price: Number(price),
        image
      });

      alert("Product added!");

      // reset fields
      setName("");
      setPrice("");
      setImage("");
    } catch (err) {
      console.error("ADD PRODUCT ERROR:", err);
      alert(err.message);
    }
  };

  // 🚚 MARK ORDER DELIVERED
  const markDelivered = async (id) => {
    const db = getFirestore(app);
    await updateDoc(doc(db, "orders", id), {
      status: "Delivered"
    });
    fetchOrders();
  };

  // 🔐 LOGIN SCREEN
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

  // ✅ ADMIN DASHBOARD
  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>

      {/* 🔥 ADD PRODUCT */}
      <h2>Add Product</h2>

      <input
        placeholder="Product Name"
        value={name}
        onChange={(e)=>setName(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Price"
        value={price}
        onChange={(e)=>setPrice(e.target.value)}
      />
      <br /><br />

      <input
        type="file"
        onChange={async (e) => {
          const file = e.target.files[0];
          const url = await uploadImage(file);
          setImage(url);
        }}
      />

      {uploading && <p>Uploading image...</p>}

      <br /><br />

      <button onClick={addProduct}>
        Add Product
      </button>

      <hr />

      {/* 📦 ORDERS */}
      <h2>Orders</h2>

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
