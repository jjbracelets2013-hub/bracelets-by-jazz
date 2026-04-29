import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import app from "../lib/firebase";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function Home() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

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

  // 🛒 ADD TO CART
  const addToCart = (product) => {
    setCart([...cart, product]);
    alert("Added to cart");
  };

  // 💳 CHECKOUT
  const checkout = async () => {
    const stripe = await stripePromise;

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items: cart }),
    });

    const session = await res.json();

    await stripe.redirectToCheckout({ sessionId: session.id });
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      
      <h1>Bracelets By Jazz 💎</h1>
      <p>Your colorful jewelry store</p>

      <img
        src="/banner.png"
        style={{ width: "100%", maxWidth: "900px", borderRadius: "10px" }}
      />

      {/* 🛒 CART BUTTON */}
      <div style={{ marginTop: "20px" }}>
        <button onClick={checkout}>
          Checkout ({cart.length})
        </button>
      </div>

      {/* PRODUCTS */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "20px",
        marginTop: "40px"
      }}>
        {products.map(product => (
          <div key={product.id} style={{
            border: "1px solid #ddd",
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

            <button onClick={() => addToCart(product)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
