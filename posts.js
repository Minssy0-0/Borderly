

// 1. The Dynamic HTML Builder
function generatePostHTML(post) {
    let priceDisplay = post.price > 0 ? `<div class="price-rating">${"$".repeat(post.price)}</div>` : "";
    
    return `
    <div class="post-card">
        <div class="post-left"><img src="${post.image}"></div>
        <div class="post-right">
            <div class="post-user-header">
                <img src="${post.authorAvatar}" class="user-avatar">
                <a href="profile.html?user=${post.author}" class="username">${post.author}</a>
            </div>
            <div class="post-body">
                <p class="description">${post.content}</p>
                <div class="location"><i class="fa-solid fa-location-dot"></i> ${post.location}</div>
                ${priceDisplay}
            </div>
            <div class="post-footer">
                <div class="likes"><i class="fa-solid fa-heart"></i> ${post.likes.length}</div>
                <button class="diary-btn" onclick="saveToDiary('${post.id}')">Save to Diary</button>
            </div>
        </div>
    </div>`;
}

// 2. The Feed Controller (decides which posts go where)
function renderAllFeeds() {
    const globalFeed = document.getElementById('globalFeed'); // For community.html
    const userFeed = document.getElementById('userPublicFeed'); // For profile.html
    const homeFeed = document.getElementById('homeRecentFeed'); // For index.html

    if (globalFeed) {
        globalFeed.innerHTML = db.posts.map(p => generatePostHTML(p)).join('');
    }
    
    if (homeFeed) {
        const recent = db.posts.slice(0, 3);
        homeFeed.innerHTML = recent.map(p => generatePostHTML(p)).join('');
    }
}
document.addEventListener('DOMContentLoaded', renderAllFeeds);


// Open/Close Form
document.getElementById('openPostModal').onclick = () => {
    document.getElementById('postFormModal').style.display = 'flex';
};

function closeForm() {
    document.getElementById('postFormModal').style.display = 'none';
}

function closePreview() {
    document.getElementById('previewModal').style.display = 'none';
}

// THE PREVIEW ENGINE
function showPreview() {
    const content = document.getElementById('postContent').value;
    const location = document.getElementById('postLocation').value;
    const price = parseInt(document.getElementById('postPrice').value);
    const image = document.getElementById('postImage').value || 'images/default-post.png';

    if (!content || !location) {
        alert("Please provide a location and a description!");
        return;
    }

    // Creating the HTML using your post-card structure
    const priceDisplay = "$".repeat(price);
    const previewHTML = `
        <div class="post-card" style="box-shadow: none; border: 2px solid #466bc3;">
            <div class="post-left">
                <img src="${image}" alt="Preview">
            </div>
            <div class="post-right">
                <div class="post-user-header">
                    <img src="${db.currentUser?.avatar || 'images/default-user.png'}" class="user-avatar">
                    <span class="username">${db.currentUser?.username || 'Styling_Guest'}</span>
                </div>
                <div class="post-body">
                    <p class="description">${content}</p>
                    <div class="location"><i class="fa-solid fa-location-dot"></i> ${location}</div>
                    <div class="price-rating">${priceDisplay}</div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('previewContainer').innerHTML = previewHTML;
    document.getElementById('previewModal').style.display = 'flex';
}

// Function to actually save the post using database.js createPost
function confirmPost() {
    const content = document.getElementById('postContent').value;
    const location = document.getElementById('postLocation').value;
    const price = parseInt(document.getElementById('postPrice').value);
    const image = document.getElementById('postImage').value;

    const result = createPost(content, location, price, image); // From database.js
    
    if (result.success) {
        alert("Post shared successfully!");
        location.reload(); // Refresh to show new post
    }
}

let selectedPrice = 0; // Starts at 0 (optional/none)

function setPrice(val) {
    selectedPrice = val;
    const signs = document.querySelectorAll('#priceSelector .d-sign');
    
    signs.forEach(sign => {
        const signValue = parseInt(sign.getAttribute('data-value'));
        if (signValue <= val) {
            sign.classList.add('active'); // Turn Borderly Blue
        } else {
            sign.classList.remove('active'); // Stay Gray
        }
    });
}

function updatePreviewImage(url) {
    document.getElementById('templateImg').src = url || 'images/default-post.png';
}

function confirmPost() {
    const content = document.getElementById('postContent').value;
    const location = document.getElementById('postLocation').value;
    const image = document.getElementById('postImage').value;

    if (!content || !location) {
        alert("Please fill in the location and description.");
        return;
    }

    // Pass selectedPrice to your database.js function
    const result = createPost(content, location, selectedPrice, image);
    
    if (result.success) {
        alert("Posted to Profile and Community!");
        location.reload(); 
    }
}

function generatePostHTML(post) {
    // Rule: Dollar signs ONLY show if price > 0
    let priceHTML = "";
    if (post.price && post.price > 0) {
        priceHTML = `<div class="price-rating">${"$".repeat(post.price)}</div>`;
    }

    return `
    <div class="post-card">
        <div class="post-left"><img src="${post.image || 'images/default-post.png'}"></div>
        <div class="post-right">
            <div class="post-user-header">
                <img src="${post.authorAvatar}" class="user-avatar">
                <a href="profile.html?user=${post.author}" class="username">${post.author}</a>
            </div>
            <div class="post-body">
                <p class="description">${post.content}</p>
                <div class="location"><i class="fa-solid fa-location-dot"></i> ${post.location}</div>
                ${priceHTML} </div>
            <div class="post-footer">
                <div class="likes"><i class="fa-solid fa-heart"></i> ${post.likes ? post.likes.length : 0}</div>
                <button class="diary-btn" onclick="saveToDiary('${post.id}')">Add to Diary</button> </div>
        </div>
    </div>`;
}



let currentSelectedPrice = 0;

// Open the modal
document.querySelector('.create-post-btn').onclick = () => {
    document.getElementById('postModalOverlay').style.display = 'flex';
};

function closePostModal() {
    document.getElementById('postModalOverlay').style.display = 'none';
}

function setPrice(val) {
    currentSelectedPrice = val;
    const signs = document.querySelectorAll('.d-sign');
    signs.forEach((s, index) => {
        // Highlight everything from left to the clicked sign
        if (index < val) {
            s.classList.add('active-blue');
        } else {
            s.classList.remove('active-blue');
        }
    });
}

function updatePreviewImage(url) {
    const img = document.getElementById('templateImg');
    img.src = url || 'images/default-post.png';
}

function confirmAndPost() {
    const content = document.getElementById('postContent').value;
    const locationName = document.getElementById('postLocation').value;
    const imageUrl = document.getElementById('postImage').value;

    if (!content || !locationName) {
        alert("Give your tip a location and description!");
        return;
    }

    // Use your createPost function from database.js
    const response = createPost(content, locationName, currentSelectedPrice, imageUrl);
    
    if (response.success) {
        alert("Trip shared!");
        location.reload(); // Refresh to see the new post in your feed
    }
}



function setPrice(val) {
    currentSelectedPrice = val;
    const signs = document.querySelectorAll('#priceSelector .d-sign');
    signs.forEach((s, index) => {
        // Class 'active-blue' turns the sign Borderly Blue
        if (index < val) {
            s.classList.add('active-blue');
        } else {
            s.classList.remove('active-blue');
        }
    });
}