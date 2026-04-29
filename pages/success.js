import { useRouter } from "next/router";

export default function Success() {
  const router = useRouter();
  const { orderId } = router.query;

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>🎉 Order Successful!</h1>

      <p>Your Order ID:</p>
      <h2 style={{ color: "green" }}>{orderId}</h2>

      <p>Save this ID to track your order</p>

      <a href="/track">
        <button>Track Order</button>
      </a>
    </div>
  );
}
