import { useState, useEffect } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "firebase/auth";

import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  deleteDoc
} from "firebase/firestore";

import app from "../lib/firebase";

export default function Admin() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

  const [uploading, setUploading] = useState(false);

  const auth = getAuth(app);

  // 🔐 AUTH
  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        fetchOrders();
        fetchProducts();
      }
    });
  }, []);

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login success");
    } catch (err) {
      alert(err.message);
    }
  };

  // 📦 GET PRODUCTS
  const fetchProducts = async () => {
    const db = getFirestore(app);
    const snapshot = await getDocs(collection(db, "products"));

    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    setProducts(data);
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

  // 📸 UPLOAD IMAGE (CLOUDINARY)
  const uploadImage = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "my_uploads"); // ⚠️ make sure this matches Cloudinary

    setUploading(true);

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dfijp0los/image/upload",
      {
        method: "POST",
        body: data
      }
    );

    const result = await res.json();

    setUploading(false);

    return result.secure_url;
  };

  // 🛒 ADD PRODUCT
  const addProduct = async () => {
    try {
      if (!name || !price || !image) {
        alert("Wait for image upload or fill all fields.");
        return;
      }

      const db = getFirestore(app);

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

      fetchProducts();
    } catch (err) {
      alert(err.message);
    }
  };

  // ❌ DELETE PRODUCT
  const deleteProduct = async (id) => {
    const db = getFirestore(app);
    await deleteDoc(doc(db, "products", id));
    fetchProducts();
  };

  // 🚚 MARK ORDER
  const markDelivered = async (id) => {
    const db = getFirestore(app);
    await updateDoc(doc(db, "orders", id), {
      status: "Delivered"
    });
    fetchOrders();
  };

  // 🔐 LOGIN UI
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

      {/* ADD PRODUCT */}
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

      <button onClick={addProduct} disabled={uploading}>
        {uploading ? "Uploading..." : "Add Product"}
      </button>

      <hr />

      {/* PRODUCTS */}
      <h2>Products</h2>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {products.map(product => (
          <div key={product.id} style={{
            border: "1px solid #ccc",
            padding: "15px",
            borderRadius: "10px",
            width: "200px"
          }}>
            <img src={product.image} style={{ width: "100%" }} />
            <p>{product.name}</p>
            <p>${product.price}</p>

            <button onClick={() => deleteProduct(product.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>

      <hr />

      {/* ORDERS */}
      <h2>Orders</h2>

      {orders.map(order => (
        <div key={order.id} style={{
          border:"1px solid #ccc",
          margin:"10px",
          padding:"10px"
        }}>
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
