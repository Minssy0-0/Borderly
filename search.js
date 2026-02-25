function handleMainSearch() {
    const from = document.getElementById('originInput').value;
    const to = document.getElementById('destinationInput').value;
    
    if (from && to) {
        window.location.href = `checker.html?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
    } else {
        alert("Please enter both a starting point and a destination.");
    }
}




const countries = ["Slovakia", "Slovenia", "Spain", "Turkey", "Thailand", "United Kingdom", "USA", "France", "Germany", "Italy", "Netherlands", "Portugal", "Greece", "Austria", "Belgium", "Denmark", "Finland", "Ireland", "Norway", "Poland", "Sweden", "Switzerland"];
const cities = [
    "Bratislava", "Ljubljana", "Madrid", "Barcelona", "Istanbul", "Ankara", 
    "Bangkok", "London", "Manchester", "New York", "Los Angeles", "Chicago", 
    "Paris", "Lyon", "Berlin", "Munich", "Rome", "Milan", "Amsterdam", 
    "Lisbon", "Athens", "Vienna", "Brussels", "Copenhagen", "Helsinki", 
    "Dublin", "Oslo", "Warsaw", "Stockholm", "Zurich", "Geneva"
];  

function filterCountries(input, resultsId) {
    const list = document.getElementById(resultsId);
    if (!list) return;
    const query = input.value.toLowerCase();
    list.innerHTML = ""; // Clear previous results

    if (query.length > 1) {
        const filtered = countries.filter(country => 
            country.toLowerCase().startsWith(query)
        );

        if (filtered.length > 0) {
            list.style.display = "block";
            filtered.forEach(country => {
                // Change from 'li' to 'div' + class 'suggestion-item'
                const div = document.createElement("div");
                div.className = "suggestion-item"; 
                div.textContent = country;
                div.onclick = () => {
                    input.value = country;
                    list.style.display = "none";
                    // Only call updateResults if it exists (on the checker page)
                    if (typeof updateResults === "function") updateResults();
                    // Only call updatePreview if it exists (on the profile page)
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

// Close dropdown if user clicks outside
document.addEventListener("click", (e) => {
    if (!e.target.closest(".input-wrapper")) {
        document.querySelectorAll(".custom-dropdown").forEach(d => d.style.display = "none");
    }
});




/*Info cards*/
function updatePageContent(from, to) {
    const container = document.getElementById('results-container');
    const key = `${from}-${to}`;
    const data = travelRules[key]; // Pulling from your database.js

    if (data) {
        container.style.opacity = "1";


        document.getElementById('docsText').innerText = data.docs;
        document.getElementById('visaText').innerText = data.visa;
        document.getElementById('vaxText').innerText = data.vax;
        document.getElementById('insText').innerText = data.ins;
    } else {
        document.getElementById('docsText').innerText = "We are currently gathering the latest requirements for this specific route. Please check back shortly!";
    }
}
li.onclick = () => {
    input.value = country;
    list.style.display = "none";
    updateResults(); 
};

// 1. The function that fills the cards
function updateResults() {
    const from = document.getElementById('originInput').value;
    const to = document.getElementById('destinationInput').value;
    const container = document.getElementById('results-container');
    const badge = document.getElementById('status-badge');

    if (!from || !to) return;

    const routeKey = `${from}-${to}`;
    const result = travelRules[routeKey]; // Looks in database.js

    if (result) {
        // Update Text
        document.getElementById('docsText').innerText = result.docs;
        document.getElementById('visaText').innerText = result.visa;
        document.getElementById('vaxText').innerText = result.vax;
        document.getElementById('insText').innerText = result.ins;
        
        // Show Badge & Container
        badge.innerHTML = `<i class="fa-solid fa-circle-check"></i> Verified for ${from} to ${to}`;
        badge.className = "badge-verified";
        container.style.opacity = "1";
    } else {
        // Fallback if route is missing
        document.getElementById('docsText').innerText = "We are currently updating data for this route.";
        badge.innerHTML = `<i class="fa-solid fa-clock"></i> Updating...`;
        badge.className = "badge-update";
        container.style.opacity = "1";
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

// This single block replaces all other window.onload or load listeners
window.addEventListener('load', () => {
    const params = new URLSearchParams(window.location.search);
    const fromParam = params.get('from');
    const toParam = params.get('to');

    if (fromParam && toParam) {
        const originBox = document.getElementById('originInput');
        const destBox = document.getElementById('destinationInput');
        
        if (originBox && destBox) {
            originBox.value = fromParam;
            destBox.value = toParam;
            updateResults(); // This triggers the info cards to appear
        }
    }
});