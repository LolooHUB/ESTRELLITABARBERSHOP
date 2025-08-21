import { db } from "./firebase.js";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const tabla = document.getElementById("turnosTable").querySelector("tbody");

// Cargar todos los turnos
async function cargarTurnos() {
  tabla.innerHTML = ""; // limpiar
  try {
    const snapshot = await getDocs(collection(db, "Turnos"));
    snapshot.docs.forEach(docSnap => {
      const data = docSnap.data();
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${data.nombre}</td>
        <td>${data.telefono}</td>
        <td>${data.fecha}</td>
        <td>${data.hora}</td>
        <td>${data.estado}</td>
        <td>
          <button class="btnEliminar">Eliminar</button>
          <button class="btnPendiente">Pendiente</button>
          <button class="btnConfirmado">Confirmado</button>
        </td>
      `;

      // Eliminar
      tr.querySelector(".btnEliminar").addEventListener("click", async () => {
        if (confirm(`Eliminar turno de ${data.nombre} el ${data.fecha} a las ${data.hora}?`)) {
          await deleteDoc(doc(db, "Turnos", docSnap.id));
          cargarTurnos(); // recargar tabla
        }
      });

      // Cambiar a Pendiente
      tr.querySelector(".btnPendiente").addEventListener("click", async () => {
        await updateDoc(doc(db, "Turnos", docSnap.id), { estado: "Pendiente" });
        cargarTurnos();
      });

      // Cambiar a Confirmado
      tr.querySelector(".btnConfirmado").addEventListener("click", async () => {
        await updateDoc(doc(db, "Turnos", docSnap.id), { estado: "Confirmado" });
        cargarTurnos();
      });

      tabla.appendChild(tr);
    });
  } catch (err) {
    console.error("Error cargando turnos:", err);
  }
}

// Cargar turnos al iniciar
window.addEventListener("DOMContentLoaded", cargarTurnos);
