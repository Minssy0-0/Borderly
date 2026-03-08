function handleMainSearch() {
    const from = document.getElementById('originInput').value;
    const to = document.getElementById('destinationInput').value;
    
    if (from && to) {
        // Redirects to checker.html with the search terms in the URL
        window.location.href = `checker.html?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
    } else {
        alert("Please enter both a starting point and a destination.");
    }
}

const countries = [
    "Slovakia", "Slovenia", "Spain", "Turkey", "Thailand", "United Kingdom",
    "USA", "France", "Germany", "Italy", "Netherlands", "Portugal",
    "Greece", "Austria", "Belgium", "Denmark", "Finland", "Ireland",
    "Norway", "Poland", "Sweden", "Switzerland",

    // Europe
    "Bulgaria", "Romania", "Hungary", "Czech Republic", "Croatia",
    "Serbia", "Bosnia and Herzegovina", "Montenegro", "Albania",
    "North Macedonia", "Estonia", "Latvia", "Lithuania", "Iceland",
    "Luxembourg", "Malta", "Cyprus", "Ukraine", "Belarus", "Moldova",

    // North America
    "Canada", "Mexico", "Cuba", "Jamaica", "Dominican Republic",
    "Costa Rica", "Panama", "Guatemala", "Honduras", "El Salvador",
    "Nicaragua",

    // South America
    "Brazil", "Argentina", "Chile", "Peru", "Colombia", "Ecuador",
    "Venezuela", "Bolivia", "Paraguay", "Uruguay", "Guyana", "Suriname",

    // Asia
    "Japan", "South Korea", "China", "India", "Indonesia", "Malaysia",
    "Singapore", "Vietnam", "Philippines", "Pakistan", "Bangladesh",
    "Sri Lanka", "Nepal", "Mongolia", "Kazakhstan", "Uzbekistan",
    "United Arab Emirates", "Saudi Arabia", "Qatar", "Kuwait", "Oman",
    "Israel", "Jordan", "Lebanon", "Iran", "Iraq",

    // Africa
    "Egypt", "Morocco", "Algeria", "Tunisia", "Libya",
    "South Africa", "Nigeria", "Kenya", "Ethiopia", "Ghana",
    "Senegal", "Tanzania", "Uganda", "Angola", "Zimbabwe",

    // Oceania
    "Australia", "New Zealand", "Fiji", "Papua New Guinea"
];


const airlineList = [
    "Ryanair", "EasyJet", "Lufthansa", "Air France", "British Airways",
    "Turkish Airlines", "Alitalia", "Iberia", "United Airlines",
    "American Airlines", "Japan Airlines", "Thai Airways", "Emirates",
    "Qantas", "Latam"
];

// --- LUGGAGE CHECKER LOGIC ---
function initLuggageChecker() {
    const airlineInput = document.getElementById('airlineSearch');
    const airlineResults = document.getElementById('airlineResults');
    const luggageText = document.getElementById('luggageText');
    const checkBtn = document.getElementById('checkLuggageBtn');

    if (!airlineInput || !airlineResults || !luggageText || !checkBtn) return;

    const airlineNames = Object.keys(window.luggageRules || {});

    // Function to actually display the data
    const displayAirlineData = (name) => {
        const rule = window.luggageRules[name];
        if (rule) {
            luggageText.innerHTML = `
                <div class="luggage-info-card">
                    <p><strong><i class="fa-solid fa-briefcase"></i> Carry-on:</strong> ${rule.carryOn}</p>
                    <p><strong><i class="fa-solid fa-suitcase"></i> Checked:</strong> ${rule.checkIn}</p>
                    <p class="tipping-note"><strong>Note:</strong> ${rule.extra}</p>
                </div>
            `;
            airlineResults.style.display = 'none';
        }
    };

    // 1. Handle typing/dropdown
    airlineInput.addEventListener('input', (e) => {
        const val = e.target.value.trim().toLowerCase();
        airlineResults.innerHTML = '';
        if (val.length > 0) {
            const matches = airlineNames.filter(n => n.toLowerCase().includes(val));
            if (matches.length > 0) {
                airlineResults.style.display = 'block';
                matches.forEach(name => {
                    const li = document.createElement('li');
                    li.textContent = name;
                    li.onclick = () => {
                        airlineInput.value = name;
                        displayAirlineData(name);
                    };
                    airlineResults.appendChild(li);
                });
            } else { airlineResults.style.display = 'none'; }
        } else { airlineResults.style.display = 'none'; }
    });

    checkBtn.addEventListener('click', () => {
        const inputVal = airlineInput.value.trim();
        const exactMatch = airlineNames.find(n => n.toLowerCase() === inputVal.toLowerCase());
        if (exactMatch) {
            displayAirlineData(exactMatch);
        } else {
            luggageText.innerText = "Airline not found. Please select from the dropdown.";
        }
    });

    airlineInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkBtn.click();
    });
}


function filterCountries(input, resultsId) {
    const list = document.getElementById(resultsId);
    if (!list) return;
    const query = input.value.toLowerCase();
    list.innerHTML = ""; 

    if (query.length > 1) {
        const filtered = countries.filter(country => 
            country.toLowerCase().startsWith(query)
        );

        if (filtered.length > 0) {
            list.style.display = "block";
            filtered.forEach(country => {
                const div = document.createElement("div");
                div.className = "suggestion-item"; 
                div.textContent = country;
                div.onclick = () => {
                    input.value = country;
                    list.style.display = "none";
                    if (typeof updateResults === "function") updateResults();
                    if (typeof updatePreview === "function") updatePreview();
                    if (input && input.id === 'destinationInput') {
                        updateRecommendationHeader();
                        updateRecommendedCities();
                    }
                };
                list.appendChild(div);
            });
        } else {
            list.style.display = "none";
        }
    } else {
        list.style.display = "none";
    }
}

function filterCities(input, resultsId) {
    const list = document.getElementById(resultsId);
    if (!list) return;
    const query = input.value.toLowerCase();
    list.innerHTML = ""; 

    if (query.length > 1) {
        const filtered = cities.filter(city => 
            city.toLowerCase().startsWith(query)
        );

        if (filtered.length > 0) {
            list.style.display = "block";
            filtered.forEach(city => {
                const div = document.createElement("div");
                div.className = "suggestion-item";
                div.textContent = city;
                div.onclick = () => {
                    input.value = city;
                    list.style.display = "none";
                    if (typeof updatePreview === "function") updatePreview();
                };
                list.appendChild(div);
            });
        } else {
            list.style.display = "none";
        }
    } else {
        list.style.display = "none";
    }
}


function updateResults() {
    const fromInput = document.getElementById('originInput');
    const toInput = document.getElementById('destinationInput');
    const container = document.getElementById('results-container');
    const badge = document.getElementById('verificationBadge');

    if (!fromInput || !toInput) return;

    const from = fromInput.value.trim();
    const to = toInput.value.trim();

    // The Fix: Case-insensitive search through window.travelRules keys
    const routeKey = Object.keys(window.travelRules).find(
        k => k.toLowerCase() === `${from.toLowerCase()}-${to.toLowerCase()}`
    );
    
    const data = routeKey ? window.travelRules[routeKey] : null;

    if (data) {
        // Standard Card Updates
        document.getElementById('docsText').innerText = data.docs;
        document.getElementById('visaText').innerText = data.visa;
        document.getElementById('vaxText').innerText = data.vax;
        document.getElementById('insText').innerText = data.ins;

        // New Card Updates (Currency, Tipping, Power, Emergency)
        if(document.getElementById('currencyText')) {
            document.getElementById('currencyText').innerText = data.currency || "---";
        }
        if(document.getElementById('tippingText')) {
            document.getElementById('tippingText').innerText = data.tipping || "Select a route to view tipping customs.";
        }
        if(document.getElementById('powerText')) {
            document.getElementById('powerText').innerText = data.power || "---";
        }
        if(document.getElementById('emergencyText')) {
            document.getElementById('emergencyText').innerText = data.emergency || "---";
        }

        // Update Badge
        if(badge) {
            badge.innerHTML = `<i class="fa-solid fa-circle-check"></i> Verified for ${from} to ${to}`;
            badge.className = "badge-verified";
        }
        
        if(container) container.style.opacity = "1";

    } else if (from && to) {
        // Fallback for missing routes
        if(document.getElementById('docsText')) {
            document.getElementById('docsText').innerText = "We are currently gathering the latest requirements for this specific route.";
        }
        if(badge) {
            badge.innerHTML = `<i class="fa-solid fa-clock"></i> Updating...`;
            badge.className = "badge-update";
        }
        if(container) container.style.opacity = "1";
    }
}

window.addEventListener('load', () => {
    const params = new URLSearchParams(window.location.search);
    const fromParam = params.get('from');
    const toParam = params.get('to');

    if (fromParam && toParam) {
        document.getElementById('originInput').value = fromParam;
        document.getElementById('destinationInput').value = toParam;
        updateResults();
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const destInput = document.getElementById('destinationInput');
    destInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
    });

    initLuggageChecker();

    if (typeof renderRecommendedCards === 'function') {
        renderRecommendedCards();
    }
});
