function openFolder(name) {
    const contentArea = document.getElementById('folderContentArea');
    const grid = document.getElementById('diaryPostsGrid');
    const title = document.getElementById('activeFolderName');
    contentArea.style.display = 'block';
    title.innerText = name;

    contentArea.scrollIntoView({ behavior: 'smooth', block: 'start' });

    const folderPosts = db.posts.filter(p => 
        p.author === db.currentUser.username && p.folder === name
    );

    grid.innerHTML = '';
    if (folderPosts.length === 0) {
        grid.innerHTML = `<p style="grid-column: span 3; text-align: center; color: #94a3b8; padding: 40px;">This folder is empty.</p>`;
        return;
    }

    folderPosts.forEach(post => {
        const cardHTML = generateMiniCardHTML(post); 
        grid.innerHTML += cardHTML;
    });

    attachExpanderListeners(); 
}

function closeFolderView() {
    document.getElementById('folderContentArea').style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateDiaryState() {
    const emptyUI = document.getElementById('emptyDiary');
    const filledUI = document.getElementById('filledDiary');
    const previewGrid = document.getElementById('fullPostsPreview');

    const userPosts = db.posts
        .filter(p => p.author === db.currentUser.username)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (userPosts.length > 0) {
        emptyUI.style.display = 'none';
        filledUI.style.display = 'block';

        const latestTwo = userPosts.slice(0, 2);

        previewGrid.innerHTML = latestTwo.map(post => `
            <article class="diary-full-card">
                <img src="${post.image}" alt="${post.location}">
                <div class="diary-full-content">
                    <span class="post-folder"><i class="fa-solid fa-folder-open"></i> ${post.folder}</span>
                    <h2>${post.location}</h2>
                    <p>${post.content}</p>
                    <div class="post-footer-meta">
                        <span><i class="fa-solid fa-calendar-day"></i> ${new Date(post.createdAt).toLocaleDateString()}</span>
                        <span><i class="fa-solid fa-tag"></i> ${post.category}</span>
                    </div>
                </div>
            </article>
        `).join('');
    } else {
        emptyUI.style.display = 'block';
        filledUI.style.display = 'none';
    }
}
document.addEventListener('DOMContentLoaded', () => {
    updateDiaryState();
});

function saveToDiary(from, to) {
    const routeKey = `${from}-${to}`;
    const routeData = window.travelRules[routeKey];

    if (!routeData) {
        alert("Route data not found!");
        return;
    }

    let myDiary = JSON.parse(localStorage.getItem('borderly_diary')) || [];

    const exists = myDiary.find(trip => trip.id === routeKey);
    if (exists) {
        alert("This trip is already in your diary! ✈️");
        return;
    }

    const newTrip = {
        id: routeKey,
        from: from,
        to: to,
        visa: routeData.visa,
        vax: routeData.vax,
        currency: routeData.currency,
        savedAt: new Date().toLocaleDateString()
    };

    myDiary.push(newTrip);
    localStorage.setItem('borderly_diary', JSON.stringify(myDiary));
    alert(`Success! ${to} has been added to your Trip Diary.`);
    if (typeof updateDiaryPreview === "function") {
        updateDiaryPreview();
    }
}

function updateDiaryState() {
    const emptyUI = document.getElementById('emptyDiary');
    const filledUI = document.getElementById('filledDiary');
    const previewGrid = document.getElementById('fullPostsPreview');

    if (!previewGrid) return;
    const userPosts = (window.db && db.posts) ? db.posts.filter(p => p.author === db.currentUser?.username) : [];
    const savedRoutes = JSON.parse(localStorage.getItem('borderly_diary')) || [];

    if (userPosts.length > 0 || savedRoutes.length > 0) {
        emptyUI.style.display = 'none';
        filledUI.style.display = 'block';

        let combinedHTML = '';

        savedRoutes.forEach(trip => {
            combinedHTML += `
                <div class="route-card board-ticket">
                    <div class="ticket-main">
                        <div class="ticket-header">
                            <h3>${trip.from} <i class="fa-solid fa-plane"></i> ${trip.to}</h3>
                        </div>
                        <div class="ticket-info">
                            <div class="info-item"><span class="info-label">Visa</span><span class="info-value">${trip.visa}</span></div>
                            <div class="info-item"><span class="info-label">Health</span><span class="info-value">${trip.vax}</span></div>
                        </div>
                    </div>
                    <div class="ticket-stub">
                        <button class="remove-diary-btn" onclick="removeFromDiary('${trip.id}')">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        userPosts.forEach(post => {
            combinedHTML += `
                <article class="diary-full-card">
                    <img src="${post.image}" alt="${post.location}">
                    <div class="diary-full-content">
                        <span class="post-folder"><i class="fa-solid fa-folder-open"></i> ${post.folder}</span>
                        <h2>${post.location}</h2>
                        <p>${post.content}</p>
                    </div>
                </article>
            `;
        });

        previewGrid.innerHTML = combinedHTML;
    } else {
        emptyUI.style.display = 'block';
        filledUI.style.display = 'none';
    }
}

window.addEventListener('load', updateDiaryPreview);

function handleDiaryClick() {
    window.location.href = 'diary.html';
}


function renderSavedTrips() {
    const container = document.getElementById('savedTripsContainer');
    if (!container) return;

    const savedTrips = JSON.parse(localStorage.getItem('borderly_diary')) || [];

    if (savedTrips.length === 0) {
        container.innerHTML = `<p class="empty-msg">No routes saved yet. Start exploring!</p>`;
        return;
    }

    container.innerHTML = savedTrips.map(trip => `
        <div class="route-card board-ticket">
            <div class="ticket-main">
                <div class="ticket-header">
                    <h3>${trip.from} <i class="fa-solid fa-plane"></i> ${trip.to}</h3>
                </div>
                <div class="ticket-info">
                    <div class="info-item"><span class="info-label">Visa</span><span class="info-value">${trip.visa}</span></div>
                    <div class="info-item"><span class="info-label">Health</span><span class="info-value">${trip.vax}</span></div>
                </div>
            </div>
            <div class="ticket-stub">
                <button class="remove-btn" onclick="removeFromDiary('${trip.id}')">Remove</button>
            </div>
        </div>
    `).join('');
}

window.addEventListener('load', renderSavedTrips);
function removeFromDiary(tripId) {
    let savedTrips = JSON.parse(localStorage.getItem('borderly_diary')) || [];
    savedTrips = savedTrips.filter(t => t.id !== tripId);
    localStorage.setItem('borderly_diary', JSON.stringify(savedTrips));
    renderSavedTrips();
    if(typeof updateDiaryPreview === 'function') updateDiaryPreview(); 
}