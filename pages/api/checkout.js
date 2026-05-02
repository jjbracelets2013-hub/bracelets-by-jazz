import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  try {
    const { items, email } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      // ✅ THIS ENABLES EMAIL RECEIPTS
      customer_email: email,

      line_items: items.map(item => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100,
        },
        quantity: 1,
      })),

      mode: "payment",

      // ✅ REDIRECT AFTER PAYMENT
      success_url: "https://bracelets-by-jazz-shop.vercel.app/success",
      cancel_url: "https://bracelets-by-jazz-shop.vercel.app/",
    });

    res.json({ id: session.id });

  } catch (err) {
    console.error("STRIPE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
}
