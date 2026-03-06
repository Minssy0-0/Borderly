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
function handleLogin(e) {
    if(e) e.preventDefault();
    
    const emailInput = document.getElementById('loginEmail').value;
    const passInput = document.getElementById('loginPass').value;

    // We look inside window.db.users
    const user = window.db.users.find(u => u.email === emailInput && u.password === passInput);

    if (user) {
        window.db.currentUser = user;
        window.saveDB(); // This locks the session in
        alert("Login Successful!");
        window.location.href = 'index.html';
    } else {
        alert("Invalid email or password. Please try again.");
    }
}

function handleSignUp(e) {
    if(e) e.preventDefault();

    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const pass = document.getElementById('regPass').value;

    // Check if user already exists
    if (window.db.users.find(u => u.email === email)) {
        alert("This email is already registered!");
        return;
    }

    const newUser = {
        username: name,
        email: email,
        password: pass,
        avatar: 'Stock/defaultPic.webp',
        bio: "Traveler"
    };

    window.db.users.push(newUser);
    window.saveDB(); 
    console.log("Sign up complete. Redirecting...");
    alert("Account created! You can now log in.");
    showLoginForm(); 
}


window.switchTab = function(tab) {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const loginBtn = document.getElementById('loginTabBtn');
    const signupBtn = document.getElementById('signupTabBtn');
    const tabsContainer = document.querySelector('.auth-tabs');

    // 1. Handle the Visual Tabs (Colors & Slider)
    if (tab === 'signup') {
        tabsContainer.classList.add('signup-active');
        signupBtn.classList.add('active');
        loginBtn.classList.remove('active');
    } else {
        tabsContainer.classList.remove('signup-active');
        loginBtn.classList.add('active');
        signupBtn.classList.remove('active');
    }

    // 2. Handle the Form Visibility (Fade effect from before)
    if (tab === 'signup') {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        // Add a tiny delay to trigger the opacity fade-in
        setTimeout(() => signupForm.classList.add('active-form'), 10);
        loginForm.classList.remove('active-form');
    } else {
        signupForm.style.display = 'none';
        loginForm.style.display = 'block';
        setTimeout(() => loginForm.classList.add('active-form'), 10);
        signupForm.classList.remove('active-form');
    }
};