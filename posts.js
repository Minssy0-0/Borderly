

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
