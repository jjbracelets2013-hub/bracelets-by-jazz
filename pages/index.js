"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const products = [
  { id: 1, name: "Rainbow Bracelet", price: 4, image: "/product1.png" },
  { id: 2, name: "Ocean Bracelet", price: 5, image: "/product2.png" },
  { id: 3, name: "Luxury Beads", price: 7, image: "/product3.png" },
];

export default function Home() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart([...cart, product]);
    alert(product.name + " added to cart!");
  };

  const checkout = async () => {
    const stripe = await stripePromise;

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items: cart }),
    });

    const data = await res.json();
    await stripe.redirectToCheckout({ sessionId: data.id });
  };

  return (
    <div style={{ background: "#e6f4ff", minHeight: "100vh", padding: "20px" }}>

      <h1 style={{ textAlign: "center", color: "#d4af37" }}>
        Bracelets By Jazz 💎
      </h1>

      {/* CART BUTTON */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button onClick={checkout} style={{
          background: "green",
          color: "white",
          padding: "10px",
          borderRadius: "6px"
        }}>
          Checkout ({cart.length})
        </button>
      </div>

      {/* PRODUCTS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "20px"
      }}>
        {products.map(product => (
          <div key={product.id} style={{
            background: "white",
            padding: "15px",
            borderRadius: "10px",
            textAlign: "center"
          }}>
            <img src={product.image} style={{ width: "100%" }} />
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
}
