let currentIndex = 0;

function renderRecommendedCards() {
    const grid = document.getElementById('recommendedGrid');
    if (!grid || !window.travelRules) return;

    const featured = [
        { key: "Spain-Turkey", badge: "popular", label: "Most Popular" },
        { key: "Bulgaria-Spain", badge: "easy", label: "EU Traveler" },
        { key: "UnitedKingdom-France", badge: "light", label: "Quick Trip" }
    ];

    grid.innerHTML = '';

    featured.forEach((item, index) => {
        const data = window.travelRules[item.key];
        if (!data) return;

        const [from, to] = item.key.split('-');
        const card = document.createElement('div');
        card.className = 'route-card';
        
        // Clicking the card moves the slider
        card.onclick = () => {
            if (index !== currentIndex) {
                currentIndex = index;
                updateSliderClasses();
            }
        };

        card.innerHTML = `
            <div class="ticket-main">
                <div class="ticket-header">
                    <h3>${from} <i class="fa-solid fa-plane" style="color: #466bc3; margin: 0 10px;"></i> ${to}</h3>
                </div>
                <div class="ticket-info">
                    <div class="info-item"><span class="info-label">Visa</span><span class="info-value">${data.visa}</span></div>
                    <div class="info-item"><span class="info-label">Health</span><span class="info-value">${data.vax}</span></div>
                    <div class="info-item"><span class="info-label">Power</span><span class="info-value">${data.power}</span></div>
                    <div class="info-item"><span class="info-label">Currency</span><span class="info-value">${data.currency}</span></div>
                </div>
            </div>
            <div class="ticket-stub">
                <div class="ticket-barcode"></div>
                <span class="ticket-badge badge-${item.badge}">${item.label}</span>
                
                <button class="add-diary-btn" onclick="event.stopPropagation(); saveToDiary('${from}', '${to}')">
                    + DIARY
                </button>
            </div>
        `;
        grid.appendChild(card);
    });

    updateSliderClasses();
}

function updateSliderClasses() {
    const cards = document.querySelectorAll('.route-card');
    const total = cards.length;

    cards.forEach((card, i) => {
        card.classList.remove('active', 'prev', 'next');
        
        if (i === currentIndex) {
            card.classList.add('active');
        } else if (i === (currentIndex - 1 + total) % total) {
            card.classList.add('prev');
        } else if (i === (currentIndex + 1) % total) {
            card.classList.add('next');
        }
    });
}

// Global function for the buttons
window.moveSlider = function(direction) {
    const cards = document.querySelectorAll('.route-card');
    if (cards.length === 0) return;
    currentIndex = (currentIndex + direction + cards.length) % cards.length;
    updateSliderClasses();
};

window.addEventListener('load', renderRecommendedCards);



function renderAllBoardingPasses() {
    const boardGrid = document.getElementById('suggested-grid');
    if (!boardGrid || !window.travelRules) return;

    boardGrid.innerHTML = '';

    // Loop through every single route in your database.js
    Object.keys(window.travelRules).forEach(routeKey => {
        const data = window.travelRules[routeKey];
        const [from, to] = routeKey.split('-');

        const card = document.createElement('div');
        card.className = 'route-card board-ticket'; // Added 'board-ticket' for specific styling
        
        card.innerHTML = `
            <div class="ticket-main">
                <div class="ticket-header">
                    <h3>${from} <i class="fa-solid fa-plane-arrival" style="font-size: 1rem; color: #cbd5e1; margin: 0 10px;"></i> ${to}</h3>
                    <div class="ticket-divider"></div>
                </div>
                <div class="ticket-info">
                    <div class="info-item"><span class="info-label">Visa</span><span class="info-value">${data.visa}</span></div>
                    <div class="info-item"><span class="info-label">Health</span><span class="info-value">${data.vax}</span></div>
                    <div class="info-item"><span class="info-label">Currency</span><span class="info-value">${data.currency}</span></div>
                    <div class="info-item"><span class="info-label">Docs</span><span class="info-value">${data.docs}</span></div>
                </div>
            </div>
            <div class="ticket-stub">
                <div class="ticket-barcode"></div>
                <button class="add-diary-btn" onclick="saveToDiary('${from}', '${to}')">
                    + SAVE
                </button>
            </div>
        `;
        boardGrid.appendChild(card);
    });
}

// Logic to check which page we are on
window.addEventListener('load', () => {
    if (document.getElementById('suggested-grid')) {
        renderAllBoardingPasses();
    } else if (document.getElementById('recommendedGrid')) {
        renderRecommendedCards(); // Your existing homepage function
    }
});

function filterByOrigin() {
    const originSearch = document.getElementById('boardSearchInput').value.toLowerCase().trim();
    const grid = document.getElementById('suggested-grid');
    
    if (!grid || !window.travelRules) return;

    grid.innerHTML = '';

    // Get all routes from database.js
    const allRoutes = Object.keys(window.travelRules);

    // Filter routes where the STARTING country matches the search
    const filteredRoutes = allRoutes.filter(routeKey => {
        const [from, to] = routeKey.toLowerCase().split('-');
        return from.includes(originSearch);
    });

    // If no match found and search is not empty
    if (filteredRoutes.length === 0 && originSearch !== "") {
        grid.innerHTML = `<p class="no-results">No routes found starting from "${originSearch}".</p>`;
        return;
    }

    // Render the filtered cards
    filteredRoutes.forEach(routeKey => {
        const data = window.travelRules[routeKey];
        const [from, to] = routeKey.split('-');
        
        // Determine badge based on data (e.g., if visa is 'None' it's 'Easy')
        let badgeType = "light";
        let badgeLabel = "Standard";
        
        if (data.visa.toLowerCase().includes("none") || data.visa.toLowerCase().includes("not required")) {
            badgeType = "easy";
            badgeLabel = "Easy Travel";
        }

        const card = document.createElement('div');
        card.className = 'route-card board-ticket';
        card.innerHTML = `
            <div class="ticket-main">
                <div class="ticket-header">
                    <h3>${from} <i class="fa-solid fa-arrow-right" style="font-size: 0.9rem; color: #466bc3; margin: 0 10px;"></i> ${to}</h3>
                    <div class="ticket-divider"></div>
                </div>
                <div class="ticket-info">
                    <div class="info-item"><span class="info-label">Visa</span><span class="info-value">${data.visa}</span></div>
                    <div class="info-item"><span class="info-label">Health</span><span class="info-value">${data.vax}</span></div>
                    <div class="info-item"><span class="info-label">Currency</span><span class="info-value">${data.currency}</span></div>
                    <div class="info-item"><span class="info-label">Power</span><span class="info-value">${data.power}</span></div>
                </div>
            </div>
            <div class="ticket-stub">
                <div class="ticket-barcode"></div>
                <span class="ticket-badge badge-${badgeType}">${badgeLabel}</span>
                <button class="add-diary-btn" onclick="saveToDiary('${from}', '${to}')">+ DIARY</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

window.addEventListener('load', () => {
    if (document.getElementById('suggested-grid')) {
        filterByOrigin(); 
    }
});