import { db } from "./firebase.js";
import { collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const form = document.getElementById("reservaForm");
const mensaje = document.getElementById("mensaje");
const fechaInput = document.getElementById("fecha");
const horaSelect = document.getElementById("hora");
const horaLabel = document.getElementById("horaLabel");
const reserva = document.querySelector('.reserva');

// Inicial: ocultar hora
reserva.classList.remove('showHora');

// Generar turnos disponibles
function generarTurnosDisponibles(turnosOcupados = []) {
  horaSelect.innerHTML = "";
  for (let h = 10; h < 20; h++) {
    for (let m = 0; m < 60; m += 15) {
      const hora = h.toString().padStart(2,"0");
      const minuto = m.toString().padStart(2,"0");
      const valor = `${hora}:${minuto}`;
      const option = document.createElement("option");
      option.value = valor;
      option.text = valor;
      if(turnosOcupados.includes(valor)){
        option.disabled = true;
        option.text += " (ocupado)";
      }
      horaSelect.appendChild(option);
    }
  }
  // Mostrar con animación
  reserva.classList.add('showHora');
}

// Cuando cambia la fecha
fechaInput.addEventListener("change", async () => {
  const fechaSeleccionada = fechaInput.value;
  if (!fechaSeleccionada) {
    reserva.classList.remove('showHora');
    return;
  }

  const [year, month, day] = fechaSeleccionada.split("-");
  const fechaDDMM = `${day}-${month}`;

  const q = query(collection(db, "Turnos"), where("fecha", "==", fechaDDMM));
  const snapshot = await getDocs(q);
  const turnosOcupados = snapshot.docs.map(doc => doc.data().hora);

  generarTurnosDisponibles(turnosOcupados);
});

// Enviar reserva
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
    reserva.classList.remove('showHora');

    // Botón de agregar al calendario
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
      const blob = new Blob([icsContent], {type: 'text/calendar'});
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'Turno_Estrellita.ics';
      link.click();
    });

  } catch (error) {
    console.error("Error al reservar:", error);
    mensaje.innerText = "❌ Error al reservar turno.";
  }
});

// Formatear fecha para ICS
function formatDateICS(date) {
  return date.toISOString().replace(/[-:]/g,'').split('.')[0];
}
