import { db } from "./firebase.js";
import { collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const form = document.getElementById("reservaForm");
const mensaje = document.getElementById("mensaje");
const fechaInput = document.getElementById("fecha");
const horaSelect = document.getElementById("hora");
const horaLabel = document.getElementById("horaLabel");

// Inicializar label y select ocultos
horaLabel.style.opacity = "0";
horaLabel.style.transform = "translateY(-20px)";
horaSelect.style.opacity = "0";
horaSelect.style.transform = "translateY(-20px)";
horaSelect.style.display = "none";

// Función para generar turnos disponibles
function generarTurnosDisponibles(turnosOcupados = []) {
  horaSelect.innerHTML = "";

  for (let h = 10; h < 20; h++) {
    for (let m = 0; m < 60; m += 15) {
      const hora = h.toString().padStart(2, "0");
      const minuto = m.toString().padStart(2, "0");
      const valor = `${hora}:${minuto}`;
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

  // Mostrar label y select con animación
  horaLabel.style.display = "block";
  horaSelect.style.display = "block";
  setTimeout(() => {
    horaLabel.style.opacity = "1";
    horaLabel.style.transform = "translateY(0)";
    horaSelect.style.opacity = "1";
    horaSelect.style.transform = "translateY(0)";
  }, 50);
}

// Escuchar cambio de fecha
fechaInput.addEventListener("change", async () => {
  const fechaSeleccionada = fechaInput.value;
  if (!fechaSeleccionada) return;

  // Fijar año al actual y guardar solo dd-mm
  const [year, month, day] = fechaSeleccionada.split("-");
  const fechaDDMM = `${day}-${month}`;

  // Consultar turnos de esa fecha (dd-mm) en Firestore
  const q = query(collection(db, "Turnos"), where("fecha", "==", fechaDDMM));
  const snapshot = await getDocs(q);
  const turnosOcupados = snapshot.docs.map(doc => doc.data().hora);

  generarTurnosDisponibles(turnosOcupados);
});

// Escuchar submit del formulario
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value;
  const fechaCompleta = fechaInput.value;
  const hora = horaSelect.value;
  const telefono = document.getElementById("telefono").value;

  if (!hora) {
    mensaje.innerText = "❌ Seleccioná un horario disponible.";
    return;
  }

  // Guardar solo día y mes
  const [year, month, day] = fechaCompleta.split("-");
  const fecha = `${day}-${month}`;

  try {
    await addDoc(collection(db, "Turnos"), {
      nombre,
      fecha,   // dd-mm
      hora,
      telefono,
      estado: "Pendiente",
      creado: new Date()
    });
    mensaje.innerText = "✅ Turno reservado con éxito!";
    form.reset();
    horaSelect.style.display = "none";
    horaLabel.style.opacity = "0";
    horaLabel.style.transform = "translateY(-20px)";
    horaSelect.style.opacity = "0";
    horaSelect.style.transform = "translateY(-20px)";
  } catch (error) {
    console.error("Error al reservar:", error);
    mensaje.innerText = "❌ Error al reservar turno.";
  }
});

