import { db } from "./firebase.js";
import { collection, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const listaTurnos = document.getElementById("listaTurnos");
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modalContent");
let turnoActual = null;

async function cargarTurnos() {
  listaTurnos.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "Turnos"));
  querySnapshot.forEach((turno) => {
    const datos = turno.data();
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${datos.nombre}</td>
      <td>${new Date(datos.fecha).toLocaleString()}</td>
      <td>${datos.telefono}</td>
      <td>${datos.estado}</td>
      <td><button class="acciones" data-id="${turno.id}" data-telefono="${datos.telefono}">Acciones</button></td>
    `;

    listaTurnos.appendChild(fila);
  });

  document.querySelectorAll(".acciones").forEach(btn => {
    btn.addEventListener("click", () => {
      turnoActual = {
        id: btn.getAttribute("data-id"),
        telefono: btn.getAttribute("data-telefono")
      };
      abrirModal();
    });
  });
}

function abrirModal() {
  modal.style.display = "flex";
}

function cerrarModal() {
  modal.style.display = "none";
}

document.getElementById("cerrarModal").addEventListener("click", cerrarModal);

// 📞 Contactar cliente por WhatsApp
document.getElementById("whatsappBtn").addEventListener("click", () => {
  if (turnoActual) {
    window.open(`https://wa.me/${turnoActual.telefono}`, "_blank");
  }
});

// 🔄 Cambiar estado
document.querySelectorAll(".estadoBtn").forEach(btn => {
  btn.addEventListener("click", async () => {
    if (turnoActual) {
      await updateDoc(doc(db, "Turnos", turnoActual.id), { estado: btn.dataset.estado });
      cerrarModal();
      cargarTurnos();
    }
  });
});

// 📨 Enviar confirmación (simulado)
document.getElementById("confirmacionBtn").addEventListener("click", () => {
  alert("📩 Confirmación enviada al cliente (demo).");
  cerrarModal();
});

cargarTurnos();
