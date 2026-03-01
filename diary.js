function openFolder(name) {
    const contentArea = document.getElementById('folderContentArea');
    const grid = document.getElementById('diaryPostsGrid');
    const title = document.getElementById('activeFolderName');
e
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

    // Filter posts for current user, newest first
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