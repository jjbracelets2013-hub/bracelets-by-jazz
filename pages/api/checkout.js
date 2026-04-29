import Stripe from "stripe";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const firebaseConfig = {
  apiKey: "AIzaSyBqM7AmL4eRJWW8QI0CvphDJZBtEYYztuo",
  authDomain: "bracelets-by-jazz.firebaseapp.com",
  projectId: "bracelets-by-jazz",
  storageBucket: "bracelets-by-jazz.firebasestorage.app",
  messagingSenderId: "1033924415222",
  appId: "1:1033924415222:web:dfec7503ef5e90c0a2e6d7",
  measurementId: "G-175WYT5X9V"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default async function handler(req, res) {
  const { items } = req.body;

  // 🔥 SAVE ORDER TO FIREBASE
  const orderRef = await addDoc(collection(db, "orders"), {
  items,
  status: "Pending",
  createdAt: new Date()
});
const orderId = orderRef.id;
  // 💳 STRIPE CHECKOUT
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: items.map(item => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: 1,
    })),
    mode: "payment",
    success_url: `${req.headers.origin}/success?orderId=${orderId}`,
    cancel_url: req.headers.origin,
  });

  res.json({ id: session.id });
}
