document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('suggested-grid');
    
    // 1. Check if grid exists
    if (!grid) {
        alert("CRITICAL ERROR: Could not find 'suggested-grid' in your HTML!");
        return;
    }

    // 2. Check for travelRules
    // Note: travelRules must be defined in database.js
    if (typeof travelRules === 'undefined' || travelRules === null) {
        grid.innerHTML = "<h3>Database Error: 'travelRules' variable is missing. Check database.js!</h3>";
        return;
    }

    const keys = Object.keys(travelRules);
    console.log("Database Keys found:", keys);
    console.table(travelRules); // This prints your data in a nice table in the console (F12)

    if (keys.length === 0) {
        grid.innerHTML = "<h3>The travelRules database is empty!</h3>";
        return;
    }

    // 3. Render cards
    grid.innerHTML = ''; // Clear any existing text
    keys.forEach(key => {
        const rule = travelRules[key];
        const [fromRaw, toRaw] = key.split('-');
        
        const from = fromRaw.charAt(0).toUpperCase() + fromRaw.slice(1);
        const to = toRaw.charAt(0).toUpperCase() + toRaw.slice(1);

        const card = document.createElement('div');
        card.className = 'suggested-card';
        card.innerHTML = `
            <div class="card-header">
                <h2>${from} <i class="fa-solid fa-arrow-right"></i> ${to}</h2>
                <button class="save-btn" onclick="saveRoute('${key}')">Save</button>
            </div>
            <div class="info-grid">
                <div class="info-box"><h4>Documents</h4><p>${rule.docs || 'No info'}</p></div>
                <div class="info-box"><h4>Visa</h4><p>${rule.visa || 'No info'}</p></div>
                <div class="info-box"><h4>Vaccines</h4><p>${rule.vax || 'No info'}</p></div>
                <div class="info-box"><h4>Insurance</h4><p>${rule.ins || 'No info'}</p></div>
            </div>
            <button class="full-check-btn" onclick="window.location.href='checker.html?from=${from}&to=${to}'">
                Open in Full Checker
            </button>
        `;
        grid.appendChild(card);
    });
});