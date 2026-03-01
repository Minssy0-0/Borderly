

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
                    <img src="${db.currentUser?.avatar || 'Stock/defaultPic.webp'}" class="user-avatar">
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


// Open the modal
document.querySelector('.create-post-btn').onclick = () => {
    document.getElementById('postModalOverlay').style.display = 'flex';
};

function closePostModal() {
    document.getElementById('postModalOverlay').style.display = 'none';
}


// 1. GLOBAL STATE
let currentSelectedPrice = 0; 

// 2. MODAL CONTROLS
const modal = document.getElementById('postFormModal');

// Handles opening the modal from the Profile 'Share a Tip' button
const createBtn = document.querySelector('.create-post-btn');
if (createBtn) {
    createBtn.onclick = () => {
        document.getElementById('postFormModal').style.display = 'flex';
    };
}

function closeForm() {
    document.getElementById('postFormModal').style.display = 'none';
    setPrice(0); // Reset the blue signs when closing
}

// 3. THE PRICE SELECTOR LOGIC
function setPrice(val) {
    currentSelectedPrice = val; // val is 0 if slashed dollar is clicked
    const signs = document.querySelectorAll('#priceSelector .d-sign');
    
    signs.forEach(sign => {
        const signValue = parseInt(sign.getAttribute('data-value'));
        // If val=0, this is always false, turning all signs gray
        if (signValue <= val) {
            sign.classList.add('active-blue');
        } else {
            sign.classList.remove('active-blue');
        }
    });
    console.log("Price set to:", currentSelectedPrice);
}

// 4. IMAGE PREVIEW
function updatePreviewImage(url) {
    const img = document.getElementById('templateImg');
    if (img) img.src = url || 'images/default-post.png';
}
function updatePreview() {
    const place = document.getElementById('postPlaceName').value;
    const city = document.getElementById('postCity').value;
    const country = document.getElementById('postCountry').value;
    
    const previewLocation = document.querySelector('.location span');
    
    if (previewLocation) {
        let fullLoc = place;
        if (city || country) {
            fullLoc += " | " + city + (city && country ? ", " : "") + country;
        }
        previewLocation.textContent = fullLoc || "Location";
    }
}
/*FINAL POSTING LOGIC*/

function confirmAndPost() {
    const content = document.getElementById('postContent').value;
    const locationName = document.getElementById('postLocation').value;
    const imageUrl = document.getElementById('postImage').value;

    const category = document.getElementById('postCategory').value;


    if (!content || !locationName || !category) {
        alert("Please provide a location, description, and category!");
        return;
    }

    const response = createPost(content, locationName, currentSelectedPrice, imageUrl, category);
    
    if (response.success) {
        alert("Trip shared!");
        location.reload(); 
    }
}

function triggerFileInput() {
    document.getElementById('postImageFile').click();
}

document.getElementById('postImageFile').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    
    reader.onload = function(event) {
        const imageData = event.target.result;
        const container = document.getElementById('imagePreviewContainer');

        document.getElementById('templateImg').src = imageData;

        document.getElementById('postImage').value = imageData;

        container.classList.add('image-uploaded');
    };

    reader.readAsDataURL(file);
});

function toggleDropdown() {
    document.getElementById('categoryOptions').classList.toggle('show');
}

function selectOption(val, label) {
    document.getElementById('postCategory').value = val;

    document.getElementById('selectedTypeText').innerText = label;

    document.getElementById('categoryOptions').classList.remove('show');
}

window.onclick = function(event) {
    if (!event.target.matches('.dropdown-selected') && !event.target.matches('#selectedTypeText')) {
        const dropdowns = document.getElementsByClassName("dropdown-options");
        for (let i = 0; i < dropdowns.length; i++) {
            if (dropdowns[i].classList.contains('show')) {
                dropdowns[i].classList.remove('show');
            }
        }
    }
}

function toggleCategoryMenu() {
    document.getElementById('categoryMenu').classList.toggle('show');
}

function pickCategory(val, label) {
    document.getElementById('postCategory').value = val;
    document.getElementById('selectedCategoryText').innerText = label;
    document.getElementById('selectedCategoryText').style.color = "#466bc3";
    document.getElementById('categoryMenu').classList.remove('show');
}

// Close dropdown if user clicks elsewhere
window.addEventListener('click', function(e) {
    const menu = document.getElementById('categoryMenu');
    const trigger = document.getElementById('categoryTrigger');
    if (menu && menu.classList.contains('show') && !trigger.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove('show');
    }
});

function saveToDiary(postId) {
    const originalPost = db.posts.find(p => p.id == postId);

    if (!db.currentUser) {
        alert("Please log in to save posts!");
        return;
    }

    const diaryEntry = {
        ...originalPost,
        id: Date.now().toString(), 
        author: db.currentUser.username,
        folder: "General", 
        createdAt: new Date().toISOString()
    };


    db.posts.push(diaryEntry);
    saveDB(); 
    alert("Saved to your diary!");
}

const authorAvatar = post.authorAvatar || "Stock/defaultPic.webp";

return `
    <div class="post-card">
        ...
        <img src="${authorAvatar}" class="user-avatar">
        ...
    </div>
`;