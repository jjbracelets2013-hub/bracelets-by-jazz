export default function Home() {
  return (
    <div style={{ 
      background: "#e6f4ff", 
      minHeight: "100vh",
      padding: "20px"
    }}>

      {/* TITLE */}
      <h1 style={{
        textAlign: "center",
        fontSize: "32px",
        color: "#d4af37"
      }}>
        Bracelets By Jazz 💎
      </h1>

      {/* SUBTEXT */}
      <p style={{ textAlign: "center", marginBottom: "20px" }}>
        Your colorful jewelry store
      </p>

      {/* 🔥 THIS IS YOUR BANNER */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img 
          src="/banner.png"
          style={{
            width: "90%",
            maxWidth: "600px",
            borderRadius: "15px"
          }}
        />
      </div>

      {/* BUTTON */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button style={{
          padding: "12px 25px",
          background: "#0077cc",
          color: "white",
          border: "none",
          borderRadius: "8px"
        }}>
          Shop Now
        </button>
      </div>

    </div>
  );
}
