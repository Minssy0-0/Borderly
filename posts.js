function initShareButton() {
    const shareBtn = document.getElementById('openPostModal');
    const postModal = document.getElementById('postFormModal');
    const imageInput = document.getElementById('postImageInput'); // Ensure this ID matches your HTML <input type="file">

    if (shareBtn) {
        shareBtn.onclick = (e) => {
            e.preventDefault();
            if (typeof db !== 'undefined' && !db.currentUser) {
                alert("Please log in to share a tip!");
                return;
            }
            if (postModal) postModal.style.display = 'flex';
            
            const modalUsername = document.querySelector('#postFormModal .username');
            const modalAvatar = document.querySelector('#postFormModal .user-avatar');
            if (modalUsername && db.currentUser) modalUsername.innerText = db.currentUser.username;
            if (modalAvatar && db.currentUser) modalAvatar.src = db.currentUser.avatar || 'Stock/defaultPic.webp';
        };
        // Add this inside the end of initShareButton function
    const fileInput = document.getElementById('postImageFile');
    if (fileInput) {
        fileInput.onchange = function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const imgElement = document.getElementById('templateImg');
                    if (imgElement) {
                        imgElement.src = event.target.result; 
                        
                        // Hide prompt, show replace button
                        const uploadLabel = document.getElementById('uploadLabel');
                        const replaceBtn = document.getElementById('replaceBtn');
                        if (uploadLabel) uploadLabel.style.display = 'none';
                        if (replaceBtn) replaceBtn.style.display = 'flex';
                        
                        window.showPreview(); // Sync the card preview
                    }
                };
                reader.readAsDataURL(file);
            }
        };
    }
    }

    // --- NEW READER LOGIC ---
    if (imageInput) {
        imageInput.onchange = function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = function() {
                    const base64String = reader.result;
                    // Update the preview image in the modal
                    const previewImg = document.getElementById('previewImg');
                    if (previewImg) previewImg.src = base64String;
                    
                    // Save it to a global variable so the Post function can grab it
                    window.tempUploadedImage = base64String;
                };
                reader.readAsDataURL(file);
            }
        };
    }

    const contentInput = document.getElementById('postContent');
    const placeInput = document.getElementById('postPlaceName');
    if (contentInput) contentInput.oninput = window.showPreview;
    if (placeInput) placeInput.oninput = window.showPreview;
}
window.closeForm = function() {
    const modal = document.getElementById('postFormModal');
    if (modal) modal.style.display = 'none';
};

window.toggleCategoryMenu = function() {
    const menu = document.getElementById('categoryMenu');
    if (menu) menu.classList.toggle('show');
};

window.pickCategory = function(val, label) {
    const hiddenInput = document.getElementById('postCategory');
    const displaySpan = document.getElementById('selectedCategoryText');
    if (hiddenInput) hiddenInput.value = val;
    if (displaySpan) {
        displaySpan.innerText = label;
        displaySpan.style.color = "#466bc3";
    }
    const menu = document.getElementById('categoryMenu');
    if (menu) menu.classList.remove('show');
};

window.currentPriceRating = 0;
window.setPrice = function(val) {
    // Save the number so showPreview can see it
    window.currentPriceRating = val; 

    // Visual feedback for the dollar signs in the modal
    const signs = document.querySelectorAll('.d-sign');
    signs.forEach((s, index) => {
        if (index < val) {
            s.style.color = '#466bc3';
            s.style.opacity = '1';
        } else {
            s.style.color = '#cbd5e1';
            s.style.opacity = '0.5';
        }
    });

    // Run the preview immediately so the dollars appear before you even start typing
    window.showPreview();
};

function generatePostHTML(post) {
    const authorData = db.users.find(u => u.username === post.author);
    const avatar = authorData?.avatar || 'images/default-user.png';
    
    let priceHTML = (post.price && post.price > 0) ? `<div class="price-rating">${"$".repeat(post.price)}</div>` : "";
    const isOwner = db.currentUser && db.currentUser.username === post.author;
    const isProfilePage = window.location.pathname.includes('profile.html');

    
    
    // Only show delete button if both are true
    const deleteBtn = (isOwner && isProfilePage) 
        ? `<button class="delete-btn" onclick="deletePost('${post.id}')"><i class="fa-solid fa-trash"></i></button>` 
        : "";

    return `
    <div class="post-card">
        <div class="post-left">
            <img src="${post.image || 'images/default-post.png'}" alt="Trip Image">
        </div>
        <div class="post-right">
            <div class="post-user-header">
                <img src="${avatar}" class="user-avatar">
                <a href="profile.html?user=${post.author}" class="username">${post.author}</a>
            </div>
            <div class="post-body">
                <p class="description">${post.content}</p>
                <div class="location"><i class="fa-solid fa-location-dot"></i> ${post.location}</div>
                ${priceHTML}
            </div>
            <div class="post-footer">
                <div class="likes">
                    <i class="fa-solid fa-heart"></i> ${post.likes ? post.likes.length : 0}
                </div>
                <div class="post-actions">
                    <button class="diary-btn" onclick="saveToDiary('${post.id}')">Add to Diary</button>
                    ${deleteBtn}
                </div>
            </div>
        </div>
    </div>`;
}
window.renderAllFeeds = function() {
    const globalFeed = document.getElementById('globalFeed');
    if (!globalFeed || typeof db === 'undefined') return;

    const postsToRender = [...db.posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    globalFeed.innerHTML = postsToRender.map(post => generatePostHTML(post)).join('');
};

window.confirmPost = function() {
    // 1. Grab values from the modal inputs
    const content = document.getElementById('postContent').value;
    const city = document.getElementById('postCity').value;
    const country = document.getElementById('postCountry').value;
    const category = document.getElementById('selectedCategoryName').innerText;
    const image = document.getElementById('previewImg').src;

    // 2. Validation
    if (!content || !city || !country) {
        alert("Please fill in the location and description!");
        return;
    }

    // 3. The "Birth Certificate" (Must match community.js filters)
    const newPost = {
        id: Date.now(),
        author: window.db.currentUser.username,
        authorAvatar: window.db.currentUser.avatar || 'Stock/defaultPic.webp',
        location: `${city}, ${country}`, 
        city: city,       // Used by community.js filter
        country: country, // Used by community.js filter
        content: content,
        image: image,
        price: window.currentPriceRating || 0,
        category: category,
        createdAt: new Date().toISOString()
    };

    try {
        window.db.posts.unshift(newPost); // Add to the top of the list
        window.saveDB();                  // Securely save to LocalStorage
        console.log("Post saved successfully:", newPost);
        
        alert("Tip Shared!");
        window.location.href = "community.html"; // Redirect to see the post
    } catch (err) {
        console.error("Critical Save Error:", err);
    }
};

window.deletePost = function(postId) {
    if (!confirm("Are you sure you want to delete this tip?")) return;
    db.posts = db.posts.filter(p => p.id != postId);
    if (typeof saveDB === 'function') {
        saveDB();
        renderAllFeeds(); 
    }
};

window.saveToDiary = function(postId) {
    const originalPost = db.posts.find(p => p.id == postId);
    if (!db.currentUser || !originalPost) return;

    const diaryEntry = {
        ...originalPost,
        id: Date.now().toString(),
        author: db.currentUser.username,
        folder: "General",
        createdAt: new Date().toISOString()
    };

    db.posts.push(diaryEntry);
    if (typeof saveDB === 'function') saveDB();
    alert("Saved to Diary!");
};


document.addEventListener('DOMContentLoaded', () => {
    initShareButton();
    renderAllFeeds();
});

window.triggerFileInput = function() {
    document.getElementById('postImageFile').click();
};

const fileInput = document.getElementById('postImageFile');
if (fileInput) {
    fileInput.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                document.getElementById('uploadLabel').style.display = 'none';
                document.getElementById('replaceBtn').style.display = 'flex';
                window.showPreview();
            };
            reader.readAsDataURL(file);
        }
    };
}

window.showPreview = function() {
    // 1. Grab all the current values
    const content = document.getElementById('postContent').value;
    const place = document.getElementById('postPlaceName').value;
    const city = document.getElementById('postCity').value;
    const country = document.getElementById('postCountry').value;
    
    // CRITICAL: Look at the global price variable
    const price = window.currentPriceRating || 0; 

    // 2. Update the Text Description
    const previewContent = document.querySelector('.post-body .description');
    if (previewContent) {
        previewContent.innerText = content; 
    }

    // 3. Update the Location
    const previewLoc = document.querySelector('.post-body .location');
    if (previewLoc) {
        const locationStr = `${place}${city ? ', ' + city : ''}${country ? ', ' + country : ''}`;
        previewLoc.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${locationStr}`;
    }

    // 4. Update the Dollars (This prevents them from disappearing)
    const previewPrice = document.querySelector('.post-body .price-rating');
    if (previewPrice) {
        if (price > 0) {
            previewPrice.innerText = "$".repeat(price);
            previewPrice.style.display = "inline-block"; // Ensure it's visible
            previewPrice.style.visibility = "visible";   // Double check visibility
        } else {
            previewPrice.innerText = "";
            previewPrice.style.display = "none"; 
        }
    }
};

// --- THE POSTING ENGINE ---
window.createNewPost = function() {
    if (!window.db.currentUser) {
        alert("You must be logged in to post!");
        return;
    }

    const place = document.getElementById('postPlaceName').value;
    const city = document.getElementById('postCity').value;
    const country = document.getElementById('postCountry').value;
    const content = document.getElementById('postContent').value;
    const category = document.getElementById('postCategorySelect')?.value || 'Other';
    const price = window.currentPriceRating || 1;

    // Use the uploaded image, or a default if they didn't upload anything
    const finalImage = window.tempUploadedImage || 'Stock/default-trip.webp';

    if (!place || !content) {
        alert("Please provide at least a place name and description!");
        return;
    }

    const newPost = {
        id: Date.now(), 
        author: window.db.currentUser.username,
        authorAvatar: window.db.currentUser.avatar || 'Stock/defaultPic.webp',
        location: `${place}, ${city}, ${country}`,
        city: city,
        country: country,
        category: category,
        price: price,
        image: finalImage, // This is now the Base64 string!
        content: content,
        createdAt: new Date().toISOString(),
        folder: "General"
    };

    try {
        window.db.posts.unshift(newPost); // Adds to the start of the list
        window.saveDB();
        
        // Clear temp storage after successful post
        window.tempUploadedImage = null; 
        
        alert("Post shared successfully!");
        window.closeForm(); 
        window.location.href = "community.html";
    } catch (err) {
        console.error("Save Error:", err);
        alert("Could not save post. The image might be too large for the browser memory.");
    }
};