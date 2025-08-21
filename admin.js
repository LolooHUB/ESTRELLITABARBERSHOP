import { db } from "./firebase.js";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const listaTurnos = document.getElementById("listaTurnos");
const modal = document.getElementById("modal");
const cerrarModal = document.getElementById("cerrarModal");
const whatsappBtn = document.getElementById("whatsappBtn");
const confirmacionBtn = document.getElementById("confirmacionBtn");
let turnoActual = {};

// Cargar turnos
async function cargarTurnos() {
  listaTurnos.innerHTML = "";
  const snapshot = await getDocs(collection(db, "Turnos"));
  snapshot.forEach(docSnap => {
    const datos = docSnap.data();
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${datos.nombre}</td>
      <td>${datos.fecha}</td>
      <td>${datos.hora}</td>
      <td>${datos.telefono}</td>
      <td>${datos.estado}</td>
      <td>
        <button class="acciones" 
                data-id="${docSnap.id}" 
                data-nombre="${datos.nombre}" 
                data-fecha="${datos.fecha}" 
                data-hora="${datos.hora}" 
                data-telefono="${datos.telefono}">Acciones</button>
        <button class="eliminarBtn" data-id="${docSnap.id}">Eliminar</button>
      </td>
    `;
    listaTurnos.appendChild(tr);
  });

  // Botón Acciones
  document.querySelectorAll(".acciones").forEach(btn => {
    btn.addEventListener("click", () => {
      turnoActual = {
        id: btn.dataset.id,
        nombre: btn.dataset.nombre,
        fecha: btn.dataset.fecha,
        hora: btn.dataset.hora,
        telefono: btn.dataset.telefono,
        docRef: doc(db, "Turnos", btn.dataset.id)
      };
      modal.style.display = "flex";
    });
  });

  // Botón Eliminar
  document.querySelectorAll(".eliminarBtn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const confirmar = confirm("⚠️ ¿Estás seguro que querés eliminar este turno?");
      if (!confirmar) return;

      const docRef = doc(db, "Turnos", btn.dataset.id);
      await deleteDoc(docRef);
      alert("🗑️ Turno eliminado!");
      cargarTurnos();
    });
  });
}

// Botón WhatsApp
whatsappBtn.addEventListener("click", () => {
  if (!turnoActual.telefono) return;
  let telefonoLimpio = turnoActual.telefono.replace(/[\s\-()]/g, "");
  if (!telefonoLimpio.startsWith("+54")) telefonoLimpio = "+54" + telefonoLimpio;
  window.open(`https://wa.me/${telefonoLimpio}`, "_blank");
});

// Botones de estado
document.querySelectorAll(".estadoBtn").forEach(btn => {
  btn.addEventListener("click", async () => {
    await updateDoc(turnoActual.docRef, { estado: btn.dataset.estado });
    alert(`✅ Estado cambiado a ${btn.dataset.estado}`);
    modal.style.display = "none";
    cargarTurnos();
  });
});

// Enviar confirmación WhatsApp
confirmacionBtn.addEventListener("click", () => {
  if (!turnoActual.telefono) return;
  let telefonoLimpio = turnoActual.telefono.replace(/[\s\-()]/g, "");
  if (!telefonoLimpio.startsWith("+54")) telefonoLimpio = "+54" + telefonoLimpio;

  let mensajeTexto = `Hola! 👋 Tu turno en Estrellita Barbershop ha sido confirmado.\nNombre: ${turnoActual.nombre}\nFecha: ${turnoActual.fecha}\nHora: ${turnoActual.hora}`;
  const mensajeURL = encodeURIComponent(mensajeTexto);
  window.open(`https://wa.me/${telefonoLimpio}?text=${mensajeURL}`, "_blank");
  alert("📩 Confirmación enviada!");
  modal.style.display = "none";
});

// Cerrar modal
cerrarModal.addEventListener("click", () => modal.style.display = "none");

// Cargar turnos al inicio
cargarTurnos();
