import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const form = document.getElementById("reservaForm");
const mensaje = document.getElementById("mensaje");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const fecha = document.getElementById("fecha").value;
  const telefono = document.getElementById("telefono").value;

  try {
    // 🔥 ahora se guarda en la colección "Turnos"
    await addDoc(collection(db, "Turnos"), {
      nombre,
      fecha,
      telefono,
      estado: "Pendiente",
      creado: new Date()
    });
    mensaje.innerText = "✅ Turno reservado con éxito!";
    form.reset();
  } catch (error) {
    console.error("Error al reservar:", error);
    mensaje.innerText = "❌ Error al reservar turno.";
  }
});

