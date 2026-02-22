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

function filterCountries(input, resultsId) {
    const list = document.getElementById(resultsId);
    const query = input.value.toLowerCase();

    if (query.length > 2) {
        const filtered = countries.filter(country => 
            country.toLowerCase().startsWith(query)
        );

        if (filtered.length > 0) {
            list.style.display = "block";
            filtered.forEach(country => {
                const li = document.createElement("li");
                li.textContent = country;
                li.onclick = () => {
                    input.value = country;
                    list.style.display = "none";
                };
                list.appendChild(li);
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



/*outputs the info from relations + fallback*/
function updateResults() {
    const from = document.getElementById('originInput').value;
    const to = document.getElementById('destinationInput').value;
    const container = document.getElementById('results-container');
    if (!from || !to) {
        container.style.opacity = "0";
        return;
    }
    const routeKey = `${from}-${to}`;
    const result = travelRules[routeKey];

    if (result) {
        container.style.opacity = "1";
        document.getElementById('docsText').innerText = result.docs;
        document.getElementById('visaText').innerText = result.visa;
        document.getElementById('vaxText').innerText = result.vax;
        document.getElementById('insText').innerText = result.ins;

        const badge = document.getElementById('status-badge');
    badge.innerHTML = `<i class="fa-solid fa-circle-check"></i> Verified for ${from} to ${to}`;
    badge.className = "badge-verified";
    } else {
        /*fallback message*/
        container.style.opacity = "1";
        const msg = "Our team is currently verifying the latest 2026 travel protocols for this specific route. Please consult the official embassy website for immediate travel.";
        
        document.getElementById('docsText').innerText = msg;
        document.getElementById('visaText').innerText = "Check back soon for updated visa requirements.";
        document.getElementById('vaxText').innerText = "Health advisories are being updated.";
        document.getElementById('insText').innerText = "Travel insurance is always recommended for international trips.";
        const badge = document.getElementById('status-badge');
    badge.innerHTML = `<i class="fa-solid fa-clock"></i> Updating Data for ${from} to ${to}`;
    badge.className = "badge-update";
    }
}

li.onclick = () => {
    input.value = country;
    list.style.display = "none";
    updateResults(); 
};

window.onload = function() {
    const params = new URLSearchParams(window.location.search);
    const fromValue = params.get('from');
    const toValue = params.get('to');

    if (fromValue && toValue) {
        document.getElementById('originInput').value = fromValue;
        document.getElementById('destinationInput').value = toValue;
        
        if (typeof updateResults === "function") {
            updateResults();
        }
    }
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