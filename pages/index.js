import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import app from "../lib/firebase";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function Home() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

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

  // 🛒 ADD TO CART
  const addToCart = (product) => {
    setCart(prev => [...prev, product]);
  };

  // ❌ REMOVE ITEM
  const removeFromCart = (index) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
  };

  // 💰 TOTAL
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  // 💳 CHECKOUT
  const checkout = async () => {
    try {
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
    } catch (err) {
      console.error("CHECKOUT ERROR:", err);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      
      {/* HEADER */}
      <h1 style={{ fontSize: "40px" }}>Bracelets By Jazz 💎</h1>
      <p>Your colorful jewelry store</p>

      {/* TRACK ORDER BUTTON (SAFE POSITION) */}
      <div style={{ marginBottom: "10px" }}>
        <a href="/track">
          <button style={{ padding: "10px", cursor: "pointer" }}>
            Track Your Order 📦
          </button>
        </a>
      </div>

      {/* BANNER */}
      <img
        src="/banner.png"
        alt="Banner"
        style={{
          width: "100%",
          maxWidth: "900px",
          borderRadius: "10px"
        }}
      />

      {/* CART BUTTON */}
      <div style={{ marginTop: "20px" }}>
        <button onClick={() => setShowCart(true)}>
          Cart ({cart.length})
        </button>
      </div>

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

            <button onClick={() => addToCart(product)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* CART PANEL */}
      {showCart && (
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: "300px",
            height: "100%",
            background: "white",
            boxShadow: "-2px 0 10px rgba(0,0,0,0.2)",
            padding: "20px",
            overflowY: "auto"
          }}
        >
          <h2>Your Cart</h2>

          {cart.length === 0 && <p>No items</p>}

          {cart.map((item, i) => (
            <div key={i} style={{ marginBottom: "15px" }}>
              <p>{item.name}</p>
              <p>${item.price}</p>
              <button onClick={() => removeFromCart(i)}>
                Remove
              </button>
            </div>
          ))}

          <hr />

          <h3>Total: ${total}</h3>

          <button onClick={checkout}>
            Checkout
          </button>

          <br /><br />

          <button onClick={() => setShowCart(false)}>
            Close
          </button>
        </div>
      )}
    </div>
  );
}
