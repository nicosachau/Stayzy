"use strict";

const jsonUrl = "/api/apartments";   //Pfad zu Wohnungsdaten
const reviewsUrl = "/api/reviews";   //Pfad zu Bewertungen

let allListings = [];
let allReviews = [];
let currentIndex = 0;
const PAGE_SIZE = 9;

function renderNextListings() {
  const container = document.getElementById('wohnungsliste');
  const nextListings = allListings.slice(currentIndex, currentIndex + PAGE_SIZE);

  nextListings.forEach((wohnung) => {
    const wohnungDiv = document.createElement('div');
    wohnungDiv.className = 'angebot';
    const imageUrl = wohnung.picture_url;
    const anzahlBewertungen = allReviews.filter(review => review.listing_id === wohnung.id).length;
    const ort = wohnung.neighbourhood_group ? wohnung.neighbourhood : wohnung.neighbourhood;

    wohnungDiv.innerHTML = `
      <div class="angebot-item">
        <img src="${imageUrl}" alt="Ferienwohnung ${wohnung.name}" class="wohnung-bild">
        <div class="wohnung-info">
          <h2>${wohnung.name || 'Ferienwohnung'}</h2>
          <p class="wohnung-details"><strong>Ort:</strong> ${ort}</p>
          <p class="wohnung-details"><strong>Wohnungstyp:</strong> ${wohnung.room_type}</p>
          <p class="wohnung-details"><strong>Preis:</strong> ${wohnung.price} € / Nacht</p>
          <p class="wohnung-details"><strong>Bewertungen:</strong> ${wohnung.number_of_reviews || anzahlBewertungen} Bewertungen</p>
          <a href="detail.html?id=${wohnung.id}" class="details-link">Details ansehen</a>
        </div>
      </div>
    `;

    container.appendChild(wohnungDiv);
  });

  currentIndex += PAGE_SIZE;

  // Button ausblenden, wenn keine weiteren Wohnungen mehr da sind
  const loadMoreButton = document.getElementById('load-more');
  if (loadMoreButton) {
    if (currentIndex >= allListings.length) {
      loadMoreButton.style.display = 'none';
    } else {
      loadMoreButton.style.display = '';
    }
  }
}

// Zurück zum Anfang: Seite scrollen und Liste zurücksetzen
function backToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

Promise.all([
  fetch(jsonUrl).then(res => res.json()),
  fetch(reviewsUrl).then(res => res.json())
])
  .then(([listings, reviews]) => {
    allListings = listings;
    allReviews = reviews;
    currentIndex = 0;
    const listContainer = document.getElementById('wohnungsliste');
    if (listContainer) {
      listContainer.innerHTML = ""; // Liste leeren
    }
    renderNextListings();

    const loadMoreButton = document.getElementById('load-more');
    if (loadMoreButton) {
      loadMoreButton.onclick = renderNextListings;
    }

    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
      backToTopButton.onclick = backToTop;
    }
  })
  .catch(error => console.error("Fehler beim Laden:", error));


// ------- Sidebar Karte -------

let mapInitialized = false;
let map;

// Element‑Refs
const btnOpen = document.getElementById('mapToggle');
const panel = document.getElementById('mapContainer');
const btnClose = document.getElementById('closeMap');

// Open‑Handler
if (btnOpen) {
  btnOpen.addEventListener('click', () => {
    panel.classList.add('open');
    if (!mapInitialized) {
      initMapSidebar();
      mapInitialized = true;
    } else {
      map.invalidateSize(); // falls schon initialisiert, nach dem Öffnen neu rendern
    }
  });
}

// Close‑Handler
if (btnClose) {
  btnClose.addEventListener('click', () => {
    panel.classList.remove('open');
  });
}

// Karte und Marker laden
function initMapSidebar() {
  // zentriere grob auf Salem
  map = L.map('map').setView([44.95, -123.05], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // für jede Wohnung einen Marker
  allListings.forEach(w => {
    if (w.latitude && w.longitude) {
      L.marker([w.latitude, w.longitude])
        .addTo(map)
        .bindPopup(`<b>${w.name}</b><br>${w.price} € / Nacht`);
    }
  });

  const CloseControl = L.Control.extend({
    options: { position: 'topright' },
    onAdd: function() {
      const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
      container.innerHTML = '<a href="#" title="Schließen">×</a>';
      // Klick‑Events nicht an die Karte weitergeben
      L.DomEvent.disableClickPropagation(container);
      container.addEventListener('click', e => {
        e.preventDefault();
        panel.classList.remove('open');
      });
      return container;
    }
  });
  map.addControl(new CloseControl());
}
function applyFilters() {
  // Holen der Filterwerte
  const nameFilter = document.getElementById('nameFilter').value.toLowerCase();
  const typeFilter = document.getElementById('typeFilter').value.toLowerCase();
  const neighbourhoodFilter = document.getElementById('neighbourhoodFilter').value.toLowerCase();
  const minRating = document.getElementById('minRatingFilter').value;
  const maxRating = document.getElementById('maxRatingFilter').value;
  const minPrice = document.getElementById('minPriceFilter').value;
  const maxPrice = document.getElementById('maxPriceFilter').value;
  
  // Holen der Sortierkriterien
  const sortCriteria = document.getElementById('sortCriteria').value;

  // Filterlogik
  let filteredListings = allListings.filter((wohnung) => {
    const anzahlBewertungen = allReviews.filter(review => review.listing_id === wohnung.id).length;
    
    let matchesFilter = true;

    if (nameFilter && !wohnung.name.toLowerCase().includes(nameFilter)) {
      matchesFilter = false;
    }

    if (typeFilter && !wohnung.room_type.toLowerCase().includes(typeFilter)) {
      matchesFilter = false;
    }

    if (neighbourhoodFilter && !wohnung.neighbourhood.toLowerCase().includes(neighbourhoodFilter)) {
      matchesFilter = false;
    }

    if (minRating && anzahlBewertungen < minRating) {
      matchesFilter = false;
    }

    if (maxRating && anzahlBewertungen > maxRating) {
      matchesFilter = false;
    }

    if (minPrice && wohnung.price < minPrice) {
      matchesFilter = false;
    }

    if (maxPrice && wohnung.price > maxPrice) {
      matchesFilter = false;
    }

    return matchesFilter;
  });

  // Sortierlogik
  if (sortCriteria === 'rating-asc') {
    filteredListings.sort((a, b) => a.number_of_reviews - b.number_of_reviews);
  } else if (sortCriteria === 'rating-desc') {
    filteredListings.sort((a, b) => b.number_of_reviews - a.number_of_reviews);
  } else if (sortCriteria === 'price-asc') {
    filteredListings.sort((a, b) => a.price - b.price);
  } else if (sortCriteria === 'price-desc') {
    filteredListings.sort((a, b) => b.price - a.price);
  }

  // Render die gefilterten und sortierten Angebote
  currentIndex = 0;
  const container = document.getElementById('wohnungsliste');
  container.innerHTML = '';
  filteredListings.slice(0, PAGE_SIZE).forEach((wohnung) => {
    const wohnungDiv = document.createElement('div');
    wohnungDiv.className = 'angebot';
    const imageUrl = wohnung.picture_url;
    const ort = wohnung.neighbourhood_group ? wohnung.neighbourhood : wohnung.neighbourhood;

    wohnungDiv.innerHTML = `
      <div class="angebot-item">
        <img src="${imageUrl}" alt="Ferienwohnung ${wohnung.name}" class="wohnung-bild">
        <div class="wohnung-info">
          <h2>${wohnung.name || 'Ferienwohnung'}</h2>
          <p class="wohnung-details"><strong>Ort:</strong> ${ort}</p>
          <p class="wohnung-details"><strong>Wohnungstyp:</strong> ${wohnung.room_type}</p>
          <p class="wohnung-details"><strong>Preis:</strong> ${wohnung.price} € / Nacht</p>
          <p class="wohnung-details"><strong>Bewertungen:</strong> ${wohnung.number_of_reviews || anzahlBewertungen} Bewertungen</p>
          <a href="detail.html?id=${wohnung.id}" class="details-link">Details ansehen</a>
        </div>
      </div>
    `;

    container.appendChild(wohnungDiv);
  });

  // Update der Buttons
  const loadMoreButton = document.getElementById('load-more');
  if (loadMoreButton) {
    if (filteredListings.length <= PAGE_SIZE) {
      loadMoreButton.style.display = 'none';
    } else {
      loadMoreButton.style.display = '';
    }
  }
}