const addProduct = async () => {
  try {
    const db = getFirestore(app);

    if (!name || !price || !image) {
      alert("Fill all fields and upload an image first.");
      return;
    }

    await addDoc(collection(db, "products"), {
      name,
      price: Number(price),
      image
    });

    alert("Product added!");
  } catch (err) {
    console.error("ADD PRODUCT ERROR:", err);
    alert(err.message);
  }
};
  );
}
