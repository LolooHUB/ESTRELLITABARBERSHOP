import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const form = document.getElementById("reservaForm");
const mensaje = document.getElementById("mensaje");

// Generar horarios cada 15 minutos entre 10:00 y 20:00
function generarTurnos() {
  const select = document.getElementById("hora");
  select.innerHTML = "";

  for (let h = 10; h < 20; h++) {
    for (let m = 0; m < 60; m += 15) {
      let hora = h.toString().padStart(2, "0");
      let minuto = m.toString().padStart(2, "0");
      const option = document.createElement("option");
      option.value = `${hora}:${minuto}`;
      option.text = `${hora}:${minuto}`;
      select.appendChild(option);
    }
  }
}

generarTurnos();

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

