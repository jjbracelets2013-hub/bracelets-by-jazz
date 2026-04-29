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

    setProducts(data);
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Bracelets By Jazz 💎</h1>
      <p>Your colorful jewelry store</p>

      <div style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "20px",
        marginTop: "30px"
      }}>
        {products.map(product => (
          <div key={product.id} style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "15px",
            width: "250px"
          }}>
            <img
              src={product.image}
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
