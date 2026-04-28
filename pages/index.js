import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const products = [
  { id: 1, name: "Rainbow Bracelet", price: 4, image: "/product1.png" },
  { id: 2, name: "Ocean Bracelet", price: 5, image: "/product2.png" },
  { id: 3, name: "Luxury Beads", price: 7, image: "/product3.png" },
];

export default function Home() {

  const handleCheckout = async (product) => {
    const stripe = await stripePromise;

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [
          {
            name: product.name,
            price: product.price,
            quantity: 1,
          },
        ],
      }),
    });

    const data = await res.json();
    await stripe.redirectToCheckout({ sessionId: data.id });
  };

  return (
    <div style={{ background: "#e6f4ff", minHeight: "100vh", padding: "20px" }}>
{/* BANNER */}
<div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
  <img 
    src="/banner.png"
    style={{
      width: "90%",
      maxWidth: "800px",
      borderRadius: "15px"
    }}
  />
</div>
      <h1 style={{ textAlign: "center", color: "#d4af37" }}>
        Bracelets By Jazz 💎
      </h1>

      <p style={{ textAlign: "center" }}>
        Your colorful jewelry store
      </p>

      {/* PRODUCT GRID */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "20px",
        marginTop: "30px"
      }}>
        {products.map(product => (
          <div key={product.id} style={{
            background: "white",
            padding: "15px",
            borderRadius: "12px",
            textAlign: "center",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
          }}>
            <img src={product.image} style={{ width: "100%", borderRadius: "10px" }} />

            <h3>{product.name}</h3>
            <p>${product.price}</p>

            <button onClick={() => handleCheckout(product)} style={{
              background: "#0077cc",
              color: "white",
              padding: "10px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}>
              Buy Now
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
