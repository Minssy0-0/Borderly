/* REPLACE the old applyCommunityFilters with this */
function applyCommunityFilters() {
    // 1. Get all the values from your filters
    const countryVal = document.getElementById('filterCountry').value.toLowerCase();
    const cityVal = document.getElementById('filterCity').value.toLowerCase();
    const categoryVal = document.getElementById('filterCategory').value; // NEW
    
    // Close the post expander if it's open
    if (typeof closeExpander === 'function') closeExpander();

    // 2. Get all the mini-cards currently on the screen
    const allCards = document.querySelectorAll('.mini-card');
    
    allCards.forEach(card => {
        // Find the post data in our database using the ID on the card
        const postId = card.id.replace('mini-', '');
        const post = db.posts.find(p => p.id == postId);
        
        if (post) {
            // Logic for Country/City
            const matchesCountry = countryVal === "" || post.location.toLowerCase().includes(countryVal);
            const matchesCity = cityVal === "" || post.location.toLowerCase().includes(cityVal);
            
            // Logic for Price (ensure activeCommunityPrice is defined in your JS)
            const matchesPrice = (typeof activeCommunityPrice === 'undefined' || activeCommunityPrice === 0) 
                                 || (post.price === activeCommunityPrice);
            
            // Logic for Category (NEW)
            // It matches if 'all' is selected OR if the post's category matches the dropdown
            const matchesCategory = (categoryVal === "all") || (post.category === categoryVal);

            // 3. FINAL CHECK: Only show if it matches EVERYTHING
            if (matchesCountry && matchesCity && matchesPrice && matchesCategory) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        }
    });
}



let activeCommunityPrice = 0;
    // 3. Update visual state for the reset (slash) icon
    const resetIcon = document.querySelector('.reset-price-wrapper');
    if (activeCommunityPrice === 0) {
        resetIcon.classList.add('active');
    } else {
        resetIcon.classList.remove('active');
    }

    // 4. Run the filter
    applyCommunityFilters();

    let activePriceFilter = 0; // Using 0 to mean 'All'

function setPrice(val) {
    activePriceFilter = val;

    // 1. Logic: Light up all dollars up to the selected value
    const dollars = document.querySelectorAll('.d-sign');
    dollars.forEach((d, index) => {
        if (index < val) {
            d.classList.add('active');
        } else {
            d.classList.remove('active');
        }
    });

    // 2. Handle the Reset icon visual
    const resetIcon = document.querySelector('.reset-price-wrapper');
    if (val === 0) {
        resetIcon.classList.add('active');
    } else {
        resetIcon.classList.remove('active');
    }

    // 3. Trigger the filter
    applyCommunityFilters();
}