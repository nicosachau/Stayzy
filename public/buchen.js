"use strict";

const params = new URLSearchParams(window.location.search);
const apartmentId = params.get("id");
const start = params.get("start");
const end = params.get("end");

if (!apartmentId || !start || !end) {
  alert("Fehlende Buchungsdaten in der URL.");
  window.location.href = "index.html";
}


fetch(`/api/apartments/${apartmentId}`)
  .then(res => res.json())
  .then(data => {
    document.getElementById("wohnungsinfo").innerHTML = `
      <strong>${data.name}</strong><br />
      Buchung von <strong>${start}</strong> bis <strong>${end}</strong><br />
      Preis: <strong>${data.price} €</strong> pro Nacht
    `;
  });

document.getElementById("buchungsformular").addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const adresse = document.getElementById("adresse").value;
  const user_id = localStorage.getItem("user_id") || 1;

  fetch("/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id,
      apartment_id: apartmentId,
      start_date: start,
      end_date: end,
      name,
      adresse
    }),
  })
    .then(res => res.json())
    .then(() => {
      alert("Buchung erfolgreich!");
      window.location.href = "index.html";
    })
    .catch((err) => {
      console.error("Fehler bei der Buchung:", err);
      alert("Fehler beim Speichern.");
    });
});