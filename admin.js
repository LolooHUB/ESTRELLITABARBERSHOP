import { db } from "./firebase.js";
import { collection, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const listaTurnos = document.getElementById("listaTurnos");

async function cargarTurnos() {
  listaTurnos.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "Turnos")); // 👈 acá
  querySnapshot.forEach((turno) => {
    const datos = turno.data();
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${datos.nombre}</td>
      <td>${new Date(datos.fecha).toLocaleString()}</td>
      <td>${datos.telefono}</td>
      <td>${datos.estado}</td>
      <td><button class="aceptar" data-id="${turno.id}">Aceptar</button></td>
    `;

    listaTurnos.appendChild(fila);
  });

  document.querySelectorAll(".aceptar").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      await updateDoc(doc(db, "Turnos", id), { estado: "Aceptado" }); // 👈 acá
      cargarTurnos();
    });
  });
}

cargarTurnos();
