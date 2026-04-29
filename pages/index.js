import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import app from "../lib/firebase";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const db = getFirestore(app);
    const snapshot = await getDocs(collection(db, "products"));

    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log("PRODUCTS:", data); // 👈 IMPORTANT
    setProducts(data);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Bracelets By Jazz 💎</h1>
      <p>Your colorful jewelry store</p>

      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "20px",
        flexWrap: "wrap",
        marginTop: "40px"
      }}>
        {products.length === 0 && <p>No products yet...</p>}

        {products.map(product => (
          <div key={product.id} style={{
            border: "1px solid #ccc",
            padding: "15px",
            borderRadius: "10px",
            width: "250px"
          }}>
            <img
              src={product.image}
              style={{ width: "100%", borderRadius: "10px" }}
            />
            <h3>{product.name}</h3>
            <p>${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
