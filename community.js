function applyCommunityFilters() {
    const countryVal = document.getElementById('filterCountry').value.toLowerCase();
    const cityVal = document.getElementById('filterCity').value.toLowerCase();
    const categoryVal = document.getElementById('filterCategory').value;
    
    const allCards = document.querySelectorAll('.mini-card');
    
    allCards.forEach(card => {
        const postId = card.id.replace('mini-', '');
        const post = window.db.posts.find(p => p.id == postId);
        
        if (post) {
            // If search box is empty, it counts as a match (matchesEverything)
            const matchesCountry = countryVal === "" || post.country.toLowerCase().includes(countryVal);
            const matchesCity = cityVal === "" || post.city.toLowerCase().includes(cityVal);
            const matchesCategory = categoryVal === "all" || post.category === categoryVal;
            const matchesPrice = (activePriceFilter === 0) || (post.price === activePriceFilter);

            // ONLY hide if it fails one of the ACTIVE filters
            if (matchesCountry && matchesCity && matchesCategory && matchesPrice) {
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

function renderCommunityFeed() {
    const feedGrid = document.querySelector('.feed-grid');
    if (!feedGrid) return;

    // 1. Sort posts: Newest first (Latest to Oldest)
    const sortedPosts = [...window.db.posts].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
    );

    // 2. Clear the grid
    feedGrid.innerHTML = '';

    // 3. Render all posts
    sortedPosts.forEach(post => {
        // We use your existing mini-card HTML structure
        const cardHTML = `
            <div class="mini-card" id="mini-${post.id}" onclick="expandPost(${post.id})">
                <div class="mini-card-image">
                    <img src="${post.image}" alt="${post.location}">
                    <div class="mini-card-price">${"$".repeat(post.price)}</div>
                </div>
                <div class="mini-card-info">
                    <div class="mini-author">
                        <img src="${post.authorAvatar}" class="author-img">
                        <span>${post.author}</span>
                    </div>
                    <h3>${post.location}</h3>
                    <p class="mini-category">${post.category}</p>
                </div>
            </div>
        `;
        feedGrid.innerHTML += cardHTML;
    });
}

// Ensure this runs when the page loads
document.addEventListener('DOMContentLoaded', renderCommunityFeed);


/**
 * Renders the 3 most recent posts for the home page 'Recommended' section.
 */
function renderRecommendedPosts() {
    const recGrid = document.getElementById('recommendedFeed');
    if (!recGrid) return; // Stop if we are not on the home page

    // 1. Sort posts by newest first
    const sortedPosts = [...window.db.posts].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
    );

    // 2. Take only the first 3
    const latestThree = sortedPosts.slice(0, 3);

    // 3. Clear and Render
    recGrid.innerHTML = '';
    
    if (latestThree.length === 0) {
        recGrid.innerHTML = '<p class="empty-msg">No tips shared yet. Be the first!</p>';
        return;
    }

    latestThree.forEach(post => {
        // Reuse your existing mini-card HTML structure
        const cardHTML = `
            <div class="mini-card" id="mini-${post.id}" onclick="window.location.href='community.html'">
                <div class="mini-card-image">
                    <img src="${post.image}" alt="${post.location}">
                    <div class="mini-card-price">${"$".repeat(post.price)}</div>
                </div>
                <div class="mini-card-info">
                    <div class="mini-author">
                        <img src="${post.authorAvatar || 'Stock/defaultPic.webp'}" class="author-img">
                        <span>${post.author}</span>
                    </div>
                    <h3>${post.location}</h3>
                    <p class="mini-category">${post.category}</p>
                </div>
            </div>
        `;
        recGrid.innerHTML += cardHTML;
    });
}

// CALL IT: Run this when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('recommendedFeed')) {
        renderRecommendedPosts();
    }
});