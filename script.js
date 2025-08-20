import { db } from "./firebase.js";
import { collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const form = document.getElementById("reservaForm");
const mensaje = document.getElementById("mensaje");
const fechaInput = document.getElementById("fecha");
const horaSelect = document.getElementById("hora");

// Generar todos los turnos de un día
function generarTurnosDisponibles(turnosOcupados = []) {
  horaSelect.innerHTML = "";
  for (let h = 10; h < 20; h++) {
    for (let m = 0; m < 60; m += 15) {
      let hora = h.toString().padStart(2, "0");
      let minuto = m.toString().padStart(2, "0");
      let valor = `${hora}:${minuto}`;
      const option = document.createElement("option");
      option.value = valor;
      option.text = valor;
      if (turnosOcupados.includes(valor)) {
        option.disabled = true;
        option.text += " (ocupado)";
      }
      horaSelect.appendChild(option);
    }
  }
  horaSelect.style.display = "block";
}

// Escuchar cambio de fecha
fechaInput.addEventListener("change", async () => {
  const fechaSeleccionada = fechaInput.value;
  if (!fechaSeleccionada) return;

  // Consultar turnos ocupados
  const q = query(collection(db, "Turnos"), where("fecha", "==", fechaSeleccionada));
  const snapshot = await getDocs(q);
  const turnosOcupados = snapshot.docs.map(doc => doc.data().hora);

  generarTurnosDisponibles(turnosOcupados);

  // Mostrar con animación
  const horaLabel = document.getElementById("horaLabel");
  horaLabel.style.display = "block";
  horaLabel.style.opacity = "1";
  horaLabel.style.transform = "translateY(0)";

  horaSelect.style.display = "block";
  setTimeout(() => {  // Pequeño delay para animación suave
    horaSelect.style.opacity = "1";
    horaSelect.style.transform = "translateY(0)";
  }, 50);
});


// Guardar reserva
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value;
  const fecha = fechaInput.value;
  const hora = horaSelect.value;
  const telefono = document.getElementById("telefono").value;

  if(!hora){
    mensaje.innerText = "❌ Seleccioná un horario disponible.";
    return;
  }

  try {
    await addDoc(collection(db, "Turnos"), {
      nombre,
      fecha,
      hora,
      telefono,
      estado: "Pendiente",
      creado: new Date()
    });
    mensaje.innerText = "✅ Turno reservado con éxito!";
    form.reset();
    horaSelect.style.display = "none";
  } catch (error) {
    console.error("Error al reservar:", error);
    mensaje.innerText = "❌ Error al reservar turno.";
  }
});
