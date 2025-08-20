import { db } from "./firebase.js";
import { collection, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const listaTurnos = document.getElementById("listaTurnos");
const modal = document.getElementById("modal");
const turnoActual = { id: null, telefono: null };

async function cargarTurnos() {
  listaTurnos.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "Turnos"));
  querySnapshot.forEach((turno) => {
    const datos = turno.data();
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${datos.nombre}</td>
      <td>${datos.fecha}</td>
      <td>${datos.hora}</td>
      <td>${datos.telefono}</td>
      <td>${datos.estado}</td>
      <td><button class="acciones" data-id="${turno.id}" data-telefono="${datos.telefono}">Acciones</button></td>
    `;
    listaTurnos.appendChild(fila);
  });

  document.querySelectorAll(".acciones").forEach(btn => {
    btn.addEventListener("click", () => {
      turnoActual.id = btn.dataset.id;
      turnoActual.telefono = btn.dataset.telefono;
      modal.style.display = "flex";
    });
  });
}

// Cerrar modal
document.getElementById("cerrarModal").addEventListener("click", () => modal.style.display="none");

// WhatsApp
document.getElementById("whatsappBtn").addEventListener("click", () => {
  if(turnoActual.telefono) window.open(`https://wa.me/${turnoActual.telefono}`, "_blank");
});

// Cambiar estado
document.querySelectorAll(".estadoBtn").forEach(btn => {
  btn.addEventListener("click", async () => {
    if(turnoActual.id){
      await updateDoc(doc(db, "Turnos", turnoActual.id), { estado: btn.dataset.estado });
      modal.style.display="none";
      cargarTurnos();
    }
  });
});

// Enviar confirmación (simulado)
document.getElementById("confirmacionBtn").addEventListener("click", () => {
  alert("📩 Confirmación enviada al cliente (demo).");
  modal.style.display="none";
});

cargarTurnos();
