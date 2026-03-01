function updateNavbarUI() {
    const navRight = document.getElementById('navRightControls');
    const navLeft = document.getElementById('navLeftControls');
    const cloudAuth = document.getElementById('cloudAuthArea');

    // Safety check: if the page doesn't have these containers, stop the script
    if (!navRight || !navLeft) return;

    if (db.currentUser) {
        // --- MEMBER STATE ---
        
        // 1. LEFT SIDE: Profile Circle (next to cloud)
        navLeft.innerHTML = `
            <a href="profile.html" class="nav-icon-link">
                <div class="profile-circle">
                    <img src="${db.currentUser.avatar || 'Stock/defaultPic.webp'}" class="nav-avatar">
                </div>
            </a>`;

        // 2. RIGHT SIDE: Trip Diary Circle
        navRight.innerHTML = `
            <div class="diary-wrapper">
                <a href="diary.html" class="nav-icon-link">
                    <div class="diary-circle">
                        <i class="fa-solid fa-book-bookmark"></i>
                    </div>
                </a>
                <div class="diary-dropdown">
                    <div style="font-weight: 800; font-size: 0.7rem; color: #94a3b8; margin-bottom: 10px;">YOUR SAVES</div>
                    <div id="dropdownSavesList"><p style="font-size: 0.8rem; color: #64748b;">Your diary is empty.</p></div>
                    <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 10px 0;">
                    <a href="diary.html" class="diary-dropdown-link">Open Diary</a>
                </div>
            </div>`;

        // 3. CLOUD MENU: Logout Button
        if (cloudAuth) {
            cloudAuth.innerHTML = `
                <hr style="border:0; border-top:1px solid #eee; margin: 10px 0;">
                <button onclick="logout()" class="cloud-logout-btn">Logout</button>`;
        }
    } else {
        // --- GUEST STATE ---
        navLeft.innerHTML = `
            <a href="auth.html" class="nav-icon-link">
                <div class="profile-circle guest-mode">
                    <img src="Stock/defaultPic.webp" class="nav-avatar" style="opacity: 0.6;">
                </div>
            </a>`;

        navRight.innerHTML = `
            <div class="diary-wrapper">
                <a href="auth.html" class="nav-icon-link">
                    <div class="diary-circle guest-diary">
                        <i class="fa-solid fa-lock"></i>
                    </div>
                </a>
            </div>`;
            
        if (cloudAuth) cloudAuth.innerHTML = '';
    }
}

