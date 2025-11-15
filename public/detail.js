"use strict";

let startDate = null;
let endDate = null;

// URL-Parameter "id" auslesen und prüfen
const params = new URLSearchParams(window.location.search);
const idParam = params.get("id");

if (idParam === null) {
  document.getElementById("detail-container").innerHTML = "<p>Keine Wohnung ausgewählt.</p>";
  throw new Error("Kein id-Parameter in der URL");
}

const wohnungId = Number(idParam);
if (isNaN(wohnungId) || wohnungId <= 0) {
  document.getElementById("detail-container").innerHTML = "<p>Ungültige ID.</p>";
  throw new Error("Ungültige ID in der URL");
}

let availableDatesSet = new Set();
let currentDate = new Date();

const createCalendarHTML = () => `
  <h3>Verfügbarkeit:</h3>
  <div class="calendar">
    <div class="calendar-header">
      <button id="kalender-prev"><i class="fa-solid fa-chevron-left"></i></button>
      <div class="monthYear" id="monthYear"></div>
      <button id="kalender-next"><i class="fa-solid fa-chevron-right"></i></button>
    </div>
    <div class="days">
      <div class="day">Mo</div>
      <div class="day">Di</div>
      <div class="day">Mi</div>
      <div class="day">Do</div>
      <div class="day">Fr</div>
      <div class="day">Sa</div>
      <div class="day">So</div>
    </div>
    <div class="dates" id="dates"></div>
    <button id="buchenBtn">Jetzt buchen</button>
  </div>
`;

function updateCalendar() {
  const monthYearElement = document.getElementById("monthYear");
  const datesElement = document.getElementById("dates");

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const totalDays = lastDay.getDate();

  const firstDayIndex = (firstDay.getDay() + 6) % 7;
  const monthYearString = currentDate.toLocaleString("default", { month: "long", year: "numeric" });
  monthYearElement.textContent = monthYearString;

  let datesHTML = "";

  for (let i = 0; i < firstDayIndex; i++) {
    datesHTML += `<div class="date inactive"></div>`;
  }


  for (let i = 1; i <= totalDays; i++) {
    const dateObj = new Date(currentYear, currentMonth, i);
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    const isToday = dateObj.toDateString() === new Date().toDateString();
    const isAvailable = availableDatesSet.has(dateStr);
    let className = "date";
    let cursor = "default";

    if (isToday) className += " active";
    if (!isAvailable) className += " booked";
    if (isAvailable) {
      className += " available";
      cursor = "pointer";
    }

    datesHTML += `<div class="${className}" style="cursor: ${cursor};" id="date${i}">${i}</div>`;
  }

  const remainingDays = (7 - ((firstDayIndex + totalDays) % 7)) % 7;
  for (let i = 0; i < remainingDays; i++) {
    datesHTML += `<div class="date inactive"></div>`;
  }
  datesElement.innerHTML = datesHTML;
}

fetch(`/api/apartments/${wohnungId}`)
  .then(res => res.json())
  .then(wohnung => {
    if (!wohnung) {
      document.getElementById("detail-container").innerHTML = "<p>Wohnung nicht gefunden.</p>";
      return;
    }

    const detailHTML = `
      <section class="top-section">
        <section class="left-section">
          <p>
            <b class="wohnungsname">${wohnung.name}</b> 
            <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#EAC452">
              <path d="m384-334 96-74 96 74-36-122 90-64H518l-38-124-38 124H330l90 64-36 122Z m247-369Z"/>
            </svg>${wohnung.rating} <span class="review-count">(${wohnung.reviews || 0} Bewertungen)</span>
          </p>
          <img id="wohnung-image" src="${wohnung.picture_url}" alt="${wohnung.name}" class="wohnung-bild">
        </section>
        <section class="right-section">  
          <ul class="list">
            <li><strong>Typ:</strong> ${wohnung.room_type}</li>
            <li><strong>Stadtteil:</strong> ${wohnung.neighbourhood}</li>
            <li><strong>Preis:</strong> ${wohnung.price ? wohnung.price + " € / Nacht" : "Nicht angegeben"}</li>
            <li><strong>Schlafzimmer:</strong> ${wohnung.bedrooms || 0}</li>
            <li><strong>Betten:</strong> ${wohnung.beds || 0}</li>
            <li><strong>Badezimmer:</strong> ${wohnung.bathrooms || 0}</li>
            <li><strong>max. Gäste:</strong> ${wohnung.accommodates || 1} Personen</li>
            <li><strong>min. Nächte:</strong> ${wohnung.minimum_nights || 1}</li>
            <li><strong>Ausstattung:</strong> ${wohnung.amenities}</li>
          </ul>
        </section>
      </section>
      <section class="bottom-section">
        <div class="description">
          <p><strong>Beschreibung:</strong></p>
          <p>${wohnung.description || "Keine Beschreibung vorhanden."}</p>
        </div>
        <ul class="host-list">
          <h3>Vermieter/in:</h3>
          <img id="host-image" src="${wohnung.host_picture_url}" alt="${wohnung.host_name}" width="100">
          <li>${wohnung.host_name}</li>
          <li>${wohnung.host_since ? "Vermietet seit: " + wohnung.host_since : "Vermietet seit: Unbekannt"}</li>
          <li>${wohnung.host_response_time ? "Antwortet " + wohnung.host_response_time : "Antwortzeit: Unbekannt"}</li>
        </ul>
      </section>
      ${createCalendarHTML()}
      <div id="map"></div>
      <section id="reviews-section" class="container">
        <h3>Bewertungen</h3>
        <ul id="reviews-list" class="reviews-list"></ul>
        <button id="load-more-reviews" class="btn-load-more">Weitere Bewertungen laden</button>
      </section>
    `;
    document.getElementById("detail-container").innerHTML = detailHTML;




// -------------------------------------------
// Buchungszeitraum auswählen (Start + Ende)
// -------------------------------------------
function formatDateFromElement(el) {
  const tag = el.textContent.padStart(2, "0");
  const [monat, jahr] = document.getElementById("monthYear").textContent.split(" ");
  const monatMap = {
    Januar: "01", Februar: "02", März: "03", April: "04",
    Mai: "05", Juni: "06", Juli: "07", August: "08",
    September: "09", Oktober: "10", November: "11", Dezember: "12"
  };
  return `${jahr}-${monatMap[monat]}-${tag}`;
}

function highlightSelectedRange() {
  document.querySelectorAll(".date").forEach(d => d.classList.remove("active", "in-range"));
  if (!startDate) return;

  const startEl = findDateElement(startDate);
  if (startEl) startEl.classList.add("active");

  if (endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    document.querySelectorAll(".date.available").forEach(el => {
      const current = new Date(formatDateFromElement(el));
      if (current > start && current < end) el.classList.add("in-range");
      if (formatDateFromElement(el) === endDate) el.classList.add("active");
    });
  }
}

function findDateElement(dateStr) {
  return [...document.querySelectorAll(".date.available")]
    .find(el => formatDateFromElement(el) === dateStr);
}

document.addEventListener("click", function (event) {
  const clickedElement = event.target;
  if (clickedElement.classList.contains("date") && clickedElement.classList.contains("available")) {
    const selectedDateStr = formatDateFromElement(clickedElement);

    if (!startDate) {
      startDate = selectedDateStr;
      endDate = null;
    } else if (!endDate) {
      if (new Date(selectedDateStr) >= new Date(startDate)) {
        endDate = selectedDateStr;
      } else {
        startDate = selectedDateStr;
        endDate = null;
      }
    } else {
      startDate = selectedDateStr;
      endDate = null;
    }

    highlightSelectedRange();
  }
});

document.getElementById("buchenBtn").addEventListener("click", () => {
  if (!startDate || !endDate) {
    alert("Bitte wähle einen vollständigen Buchungszeitraum aus.");
    return;
  }
  window.location.href = `buchen.html?id=${wohnungId}&start=${startDate}&end=${endDate}`;
});




    // Bewertungen laden
    let reviewIndex = 0;
    let allReviewsForListing = [];

    function renderReviews() {
      const listEl = document.getElementById('reviews-list');
      const loadMoreBtn = document.getElementById('load-more-reviews');
      const chunkSize = reviewIndex === 0 ? 3 : 20;
      const nextReviews = allReviewsForListing.slice(reviewIndex, reviewIndex + chunkSize);

      nextReviews.forEach(review => {
        const li = document.createElement('li');
        li.classList.add('review-item');
        li.innerHTML = `
          <p><strong>${review.reviewer_name}</strong></p>
          <p>${review.comments}</p>
        `;
        listEl.appendChild(li);
      });

      reviewIndex += nextReviews.length;
      if (reviewIndex >= allReviewsForListing.length) {
        loadMoreBtn.style.display = 'none';
      }
    }

    function loadReviews() {
      if (allReviewsForListing.length === 0) {
        fetch('/api/reviews')
          .then(res => res.json())
          .then(data => {
            allReviewsForListing = data.filter(r => r.listing_id === wohnungId);
            renderReviews();
          })
          .catch(err => console.error(err));
      } else {
        renderReviews();
      }
    }

    document.getElementById('load-more-reviews').addEventListener('click', loadReviews);
    loadReviews();

    // Karte anzeigen
    if (wohnung.latitude && wohnung.longitude) {
      var map = L.map('map').setView([wohnung.latitude, wohnung.longitude], 14);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);
      L.marker([wohnung.latitude, wohnung.longitude])
        .addTo(map)
        .bindPopup(`<b>${wohnung.name}</b><br>${wohnung.neighbourhood || ''}`);
    }

    // Kalender-Navigation
    document.getElementById("kalender-prev").addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() - 1);
      updateCalendar();
    });
    document.getElementById("kalender-next").addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() + 1);
      updateCalendar();
    });

    // Kalenderdaten laden
    fetch(`/api/calendar/${wohnung.id}`)
      .then(res => res.json()) //  Antwort wird zuerst in JSON umgewandelt
      .then(calendarData => {
        availableDatesSet = new Set(
         calendarData.filter(item => item.available === "t").map(item => item.date)
        );
       updateCalendar();
     })
     .catch(err => console.error("Kalenderdaten Fehler:", err));


  })
  .catch(error => {
    console.error("Fehler beim Laden der Wohnungsdaten:", error);
    document.getElementById("detail-container").innerHTML = "<p>Fehler beim Laden der Wohnungsdetails.</p>";
  });

  