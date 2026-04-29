import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import app from "../lib/firebase";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const db = getFirestore(app);
      const snapshot = await getDocs(collection(db, "products"));

      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setProducts(data);
    } catch (err) {
      console.error("ERROR FETCHING PRODUCTS:", err);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      
      {/* HEADER */}
      <h1 style={{ fontSize: "40px" }}>Bracelets By Jazz 💎</h1>
      <p>Your colorful jewelry store</p>

      {/* BANNER */}
      <img
        src="/banner.png"
        style={{
          width: "100%",
          maxWidth: "900px",
          borderRadius: "10px",
          marginTop: "20px"
        }}
      />

      {/* PRODUCTS */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "20px",
          marginTop: "40px"
        }}
      >
        {products.length === 0 && <p>No products yet...</p>}

        {products.map(product => (
          <div
            key={product.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "15px",
              width: "250px",
              background: "white"
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              style={{ width: "100%", borderRadius: "10px" }}
            />

            <h3>{product.name}</h3>
            <p>${product.price}</p>

            <button
              style={{
                background: "blue",
                color: "white",
                padding: "10px",
                border: "none",
                borderRadius: "5px"
              }}
            >
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
