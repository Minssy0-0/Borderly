/* REPLACE the old applyCommunityFilters with this */
function applyCommunityFilters() {
    const countryVal = document.getElementById('filterCountry').value.toLowerCase();
    const cityVal = document.getElementById('filterCity').value.toLowerCase();
    const categoryVal = document.getElementById('filterCategory').value; 
    
    const allCards = document.querySelectorAll('.mini-card');
    allCards.forEach(card => {
        const postId = card.id.replace('mini-', '');
        const post = db.posts.find(p => p.id == postId);
        
        if (post) {
            const matchesCountry = countryVal === "" || post.location.toLowerCase().includes(countryVal);
            const matchesCity = cityVal === "" || post.location.toLowerCase().includes(cityVal);
            const matchesPrice = (activeCommunityPrice === 0) || (post.price === activeCommunityPrice);
            
            // Matches if "All" is selected OR if the post category matches the filter
            const matchesCategory = (categoryVal === "all" || categoryVal === "") || (post.category === categoryVal);

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