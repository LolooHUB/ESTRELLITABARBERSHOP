import { db } from "./firebase.js";
import { collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const form = document.getElementById("reservaForm");
const mensaje = document.getElementById("mensaje");
const fechaInput = document.getElementById("fecha");
const horaSelect = document.getElementById("hora");

// Generar turnos de 10:00 a 19:45 cada 15 min
function generarTurnosDisponibles(turnosOcupados = []) {
  horaSelect.innerHTML = ""; // limpiar
  for (let h = 10; h < 20; h++) {
    for (let m = 0; m < 60; m += 15) {
      const hora = h.toString().padStart(2,"0");
      const minuto = m.toString().padStart(2,"0");
      const valor = `${hora}:${minuto}`;

      const option = document.createElement("option");
      option.value = valor;
      option.textContent = valor;

      // Bloquear solo si realmente está en el array
      if (turnosOcupados.includes(valor)) {
        option.disabled = true;
        option.textContent += " (ocupado)";
      }
      horaSelect.appendChild(option);
    }
  }
}

// Cuando cambia la fecha
fechaInput.addEventListener("change", async () => {
  const fecha = fechaInput.value;
  if (!fecha) return;

  const [year, month, day] = fecha.split("-");
  const fechaDDMM = `${day}-${month}`;

  try {
    const q = query(collection(db, "Turnos"), where("fecha", "==", fechaDDMM));
    const snapshot = await getDocs(q);
    // Filtrar solo strings válidos y trim
    const turnosOcupados = snapshot.docs.map(doc => {
      const h = doc.data().hora;
      return h ? h.toString().trim() : "";
    }).filter(h => h.length > 0);

    generarTurnosDisponibles(turnosOcupados);
  } catch(err){
    console.error("Error cargando turnos:", err);
  }
});

// Enviar reserva
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const fechaCompleta = fechaInput.value;
  const hora = horaSelect.value;
  const telefono = document.getElementById("telefono").value.trim();

  if (!hora) {
    mensaje.textContent = "❌ Seleccioná un horario disponible.";
    return;
  }

  const [year, month, day] = fechaCompleta.split("-");
  const fecha = `${day}-${month}`;

  try {
    await addDoc(collection(db, "Turnos"), {
      nombre,
      fecha,
      hora,
      telefono,
      estado: "Pendiente",
      creado: new Date()
    });

    mensaje.innerHTML = "✅ Turno reservado con éxito! <br> <button id='agregarCalendario'>Agregar al calendario</button>";
    form.reset();
    horaSelect.innerHTML = "";

    document.getElementById("agregarCalendario").addEventListener("click", () => {
      const start = new Date(`${fechaCompleta}T${hora}:00`);
      const end = new Date(start.getTime() + 30*60000);
      const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:Turno Estrellita Barbershop
DTSTART:${formatDateICS(start)}
DTEND:${formatDateICS(end)}
LOCATION:Dean Funes 583
DESCRIPTION:Turno reservado en Estrellita Barbershop
END:VEVENT
END:VCALENDAR
      `;
      const blob = new Blob([icsContent], { type: 'text/calendar' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'Turno_Estrellita.ics';
      link.click();
    });

  } catch (err) {
    console.error("Error al reservar:", err);
    mensaje.textContent = "❌ Error al reservar turno.";
  }
});

function formatDateICS(date) {
  return date.toISOString().replace(/[-:]/g,'').split('.')[0];
}
