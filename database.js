
window.db = {
    users: JSON.parse(localStorage.getItem('borderly_users')) || [],
    currentUser: JSON.parse(localStorage.getItem('borderly_session')) || null,
    folders: JSON.parse(localStorage.getItem('borderly_folders')) || ["General", "Summer 2025", "Wishlist"],
    savedTrips: JSON.parse(localStorage.getItem('borderly_saved_trips')) || [] 
};

window.saveDB = function() {
    localStorage.setItem('borderly_users', JSON.stringify(window.db.users));
    localStorage.setItem('borderly_session', JSON.stringify(window.db.currentUser));
    localStorage.setItem('borderly_folders', JSON.stringify(window.db.folders));
    localStorage.setItem('borderly_saved_trips', JSON.stringify(window.db.savedTrips));
}
window.logout = function() {
    window.db.currentUser = null;
    localStorage.removeItem('borderly_session');
    window.location.href = 'index.html';
};
function updateNavAuth() {
    const logoutBtn = document.getElementById('logoutBtn');
    const isLoggedIn = localStorage.getItem('borderly_session') !== null;

    if (logoutBtn) {
        logoutBtn.style.display = isLoggedIn ? 'block' : 'none';
    }
}

window.addEventListener('load', updateNavAuth);

function loginUser(email, password) {
    const user = db.users.find(u => u.email === email && u.password === password);
    if (user) {
        db.currentUser = user;
        saveDB();
        return true;
    }
    return false;
}

function updateGlobalDiaryUI() {
    const diaryCircle = document.getElementById('diaryCircle');
    const diaryIcon = document.getElementById('diaryIcon');
    const previewContent = document.getElementById('diaryPreviewContent');
    const user = JSON.parse(localStorage.getItem('borderly_session'));


    if (!diaryCircle || !diaryIcon || !previewContent) {
        console.log("Diary elements not found on this page. Skipping UI update.");
        return; 
    }

    if (user) {
        /*LOGGED IN STATE*/
        diaryCircle.className = "diary-circle diary-member-circle";
        diaryIcon.className = "fa-solid fa-book-atlas diary-member-icon";
        const userPosts = (window.db?.posts || []).filter(p => p.author === user.username);
        
        if (userPosts.length > 0) {
            const latest = userPosts.slice(-2).reverse();
            previewContent.innerHTML = latest.map(post => `
                <div class="mini-preview-item">
                    <strong>${post.location}</strong>
                    <p>${post.category}</p>
                </div>
            `).join('') + `<hr><a href="diary.html" class="view-all-link">View All</a>`;
        } else {
            previewContent.innerHTML = "<p class='diary-empty'>Your diary is empty. Start saving!</p>";
        }
    } else {
        /*GUEST STATE*/
        diaryCircle.className = "diary-circle diary-guest-circle";
        diaryIcon.className = "fa-solid fa-book-atlas diary-guest-icon";
        previewContent.innerHTML = `
            <p class="diary-empty">Log in to save your travel plans and view your diary.</p>
            <button onclick="gatekeeper('diary.html')" class="diary-login-btn">Log In</button>
        `;
    }
}

function handleDiaryClick() {
    gatekeeper('diary.html');
}
document.addEventListener('DOMContentLoaded', updateGlobalDiaryUI);

function saveToDiary(postId) {
    const post = db.posts.find(p => p.id === postId);
    if (!post) {
        alert("Post not found!");
        return false;
    }

    let diaryItems = JSON.parse(localStorage.getItem('diary_items')) || [];
    
    const exists = diaryItems.some(item => item.id === postId);
    if (exists) {
        alert("This destination is already in your diary!");
        return false;
    }

    const diaryItem = {
        id: postId,
        title: post.location,
        country: post.location.split(',').pop().trim() || 'Unknown',
        image: post.image || 'images/default-post.png',
        timestamp: new Date().toISOString(),
        postContent: post.content
    };
    diaryItems.push(diaryItem);
    localStorage.setItem('diary_items', JSON.stringify(diaryItems));
    
    alert("Added to your travel diary!");
    return true;
}

function registerUser(username, email, password) {
    const exists = db.users.find(u => u.email === email);
    if (exists) return { success: false, message: "Email already registered." };

    const newUser = {
        id: "user_" + Date.now(), 
        username: username,
        email: email,
        password: password,
        avatar: null,
        followers: [],
        following: [], 
        posts: [],     
        bio: "Hey there! I'm using Borderly."
    };

    db.users.push(newUser);
    saveDB();
    db.currentUser = newUser;
    saveDB();
    return { success: true };
}

function syncGlobalAvatar() {
    const savedAvatar = localStorage.getItem('profileAvatar');
    
    if (savedAvatar) {
        const navAvatar = document.getElementById('navAvatar');
        const mainProfilePic = document.getElementById('mainProfilePic');

        if (navAvatar) navAvatar.src = savedAvatar;
        if (mainProfilePic) mainProfilePic.src = savedAvatar;
    }
}
window.addEventListener('load', syncGlobalAvatar);











window.travelRules = {
    "Spain-Turkey": {
        docs: "Passport valid for 6 months beyond entry date.",
        visa: "E-visa required for Spanish citizens. Apply online at the official portal.",
        vax: "No special vaccines required for 2026 entry.",
        ins: "Standard travel insurance with medical coverage is recommended.",
        power: "Type C / F (230V)",
        currency: "Turkish Lira (₺)",
        tipping: "5–10% customary.",
        emergency: "112"
    },
    "USA-France": {
        docs: "Passport must be valid for 3 months beyond your stay.",
        visa: "No Visa required for tourism under 90 days for US Citizens.",
        vax: "Standard boosters recommended.",
        ins: "Schengen visa insurance required (min €30,000 coverage).",
        power: "Type C / E (230V)",
        currency: "Euro (€)",
        tipping: "Round up or leave 5–10%.",
        emergency: "112"
    },
    "Bulgaria-France": { 
        docs: "Valid passport or national ID card.",
        visa: "No visa required (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "European Health Insurance Card recommended.",
        power: "Type C / E (230V)",
        currency: "Euro (€)",
        tipping: "Round up or leave 5–10%.",
        emergency: "112"
    },
    "Bulgaria-Germany": { 
        docs: "Valid passport or national ID card.",
        visa: "Visa-free (Schengen).",
        vax: "No required vaccines.",
        ins: "EHIC recommended.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "5–10% tip common.",
        emergency: "112"
    },
    "Bulgaria-Italy": { 
        docs: "Valid passport or national ID card.",
        visa: "Visa-free (Schengen).",
        vax: "No special vaccines.",
        ins: "EHIC recommended.",
        power: "Type C / F / L (230V)",
        currency: "Euro (€)",
        tipping: "Service charge common, small tip appreciated.",
        emergency: "112"
    },
    "Bulgaria-Spain": { 
        docs: "Valid passport or national ID card.",
        visa: "Visa-free (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "EHIC recommended.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "Small tip or rounding up.",
        emergency: "112"
    },
    "Bulgaria-Greece": { 
        docs: "Valid passport or national ID card.",
        visa: "Visa-free (Schengen).",
        vax: "No required vaccines.",
        ins: "EHIC recommended.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "5–10% common.",
        emergency: "112"
    },
    "Bulgaria-UnitedKingdom": { 
        docs: "Valid passport required.",
        visa: "Electronic Travel Authorisation (ETA) required.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type G (230V)",
        currency: "Pound Sterling (£)",
        tipping: "10–12% if service not included.",
        emergency: "999 / 112"
    },
    "Bulgaria-UnitedStates": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Comprehensive travel insurance recommended.",
        power: "Type A / B (120V)",
        currency: "US Dollar ($)",
        tipping: "15–20% expected.",
        emergency: "911"
    },
    "Bulgaria-Canada": { 
        docs: "Valid passport required.",
        visa: "eTA required for air travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (120V)",
        currency: "Canadian Dollar ($)",
        tipping: "15–20% typical.",
        emergency: "911"
    },
    "Bulgaria-Australia": { 
        docs: "Valid passport required.",
        visa: "Visa required (eVisitor available).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type I (230V)",
        currency: "Australian Dollar ($)",
        tipping: "Not expected but appreciated.",
        emergency: "000"
    },
    "Bulgaria-Japan": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (100V)",
        currency: "Japanese Yen (¥)",
        tipping: "Tipping not customary.",
        emergency: "110 / 119"
    },
    "Bulgaria-Brazil": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / N (127–220V)",
        currency: "Brazilian Real (R$)",
        tipping: "10% usually included.",
        emergency: "190 / 192"
    },
    "Bulgaria-Turkey": { 
        docs: "Valid passport or national ID card accepted.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Turkish Lira (₺)",
        tipping: "5–10% customary.",
        emergency: "112"
    },
    "Bulgaria-Georgia": { 
        docs: "Valid passport or national ID card accepted.",
        visa: "Visa-free (long stay allowed).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Bulgaria-Serbia": { 
        docs: "Valid passport or national ID card.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Bulgaria-Mexico": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (127V)",
        currency: "Mexican Peso ($)",
        tipping: "10–15% expected.",
        emergency: "911"
    },
    "Bulgaria-SouthAfrica": { 
        docs: "Valid passport required.",
        visa: "Visa required before arrival.",
        vax: "Yellow fever certificate if applicable.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Bulgaria-Thailand": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "Yellow fever certificate if arriving from risk areas.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Bulgaria-UAE": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Bulgaria-Tunisia": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Bulgaria-Argentina": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },

    "France-Bulgaria": { 
        docs: "Valid passport or national ID card.",
        visa: "Visa-free (EU free movement).",
        vax: "No mandatory vaccines.",
        ins: "European Health Insurance Card recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "France-Germany": { 
        docs: "Valid passport or national ID card.",
        visa: "No visa required (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "EHIC recommended.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "5–10% tip common.",
        emergency: "112"
    },
    "France-Italy": { 
        docs: "Valid passport or national ID card.",
        visa: "Visa-free (Schengen).",
        vax: "No special vaccines.",
        ins: "EHIC recommended.",
        power: "Type C / F / L (230V)",
        currency: "Euro (€)",
        tipping: "Service charge common, small tip appreciated.",
        emergency: "112"
    },
    "France-Spain": { 
        docs: "Valid passport or national ID card.",
        visa: "Visa-free (Schengen).",
        vax: "No required vaccines.",
        ins: "EHIC recommended.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "Small tip or rounding up.",
        emergency: "112"
    },
    "France-Greece": { 
        docs: "Valid passport or national ID card.",
        visa: "Visa-free (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "EHIC recommended.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "5–10% common.",
        emergency: "112"
    },
    "France-UnitedKingdom": { 
        docs: "Valid passport required.",
        visa: "Electronic Travel Authorisation (ETA) required.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type G (230V)",
        currency: "Pound Sterling (£)",
        tipping: "10–12% if service not included.",
        emergency: "999 / 112"
    },
    "France-UnitedStates": { 
        docs: "Biometric passport required.",
        visa: "ESTA required (Visa Waiver Program).",
        vax: "No mandatory vaccines.",
        ins: "Comprehensive travel insurance recommended.",
        power: "Type A / B (120V)",
        currency: "US Dollar ($)",
        tipping: "15–20% expected.",
        emergency: "911"
    },
    "France-Canada": { 
        docs: "Valid passport required.",
        visa: "eTA required for air travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (120V)",
        currency: "Canadian Dollar ($)",
        tipping: "15–20% typical.",
        emergency: "911"
    },
    "France-Australia": { 
        docs: "Valid passport required.",
        visa: "eVisitor visa required.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type I (230V)",
        currency: "Australian Dollar ($)",
        tipping: "Not expected but appreciated.",
        emergency: "000"
    },
    "France-Japan": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (100V)",
        currency: "Japanese Yen (¥)",
        tipping: "Tipping not customary.",
        emergency: "110 / 119"
    },
    "France-Brazil": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines (yellow fever recommended for some regions).",
        ins: "Travel insurance recommended.",
        power: "Type C / N (127–220V)",
        currency: "Brazilian Real (R$)",
        tipping: "10% usually included.",
        emergency: "190 / 192"
    },
    "France-Turkey": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Turkish Lira (₺)",
        tipping: "5–10% customary.",
        emergency: "112"
    },
    "France-Georgia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 1 year.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "France-Serbia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "France-Mexico": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 180 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (127V)",
        currency: "Mexican Peso ($)",
        tipping: "10–15% expected.",
        emergency: "911"
    },
    "France-SouthAfrica": { 
        docs: "Valid passport (2 blank pages recommended).",
        visa: "Visa-free up to 90 days.",
        vax: "Yellow fever certificate if arriving from risk countries.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "France-Thailand": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "Yellow fever certificate if applicable.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "France-UAE": { 
        docs: "Valid passport required (6 months validity recommended).",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "France-Tunisia": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "France-Argentina": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },

    "Germany-Bulgaria": { 
        docs: "Valid passport or national ID card.",
        visa: "Visa-free (EU free movement).",
        vax: "No mandatory vaccines.",
        ins: "European Health Insurance Card recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Germany-France": { 
        docs: "Valid passport or national ID card.",
        visa: "Visa-free (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "EHIC recommended.",
        power: "Type C / E (230V)",
        currency: "Euro (€)",
        tipping: "Round up or leave 5–10%.",
        emergency: "112"
    },
        "Germany-Italy": { 
        docs: "Valid passport or national ID card.",
        visa: "Visa-free (Schengen).",
        vax: "No special vaccines.",
        ins: "EHIC recommended.",
        power: "Type C / F / L (230V)",
        currency: "Euro (€)",
        tipping: "Service charge common, small tip appreciated.",
        emergency: "112"
    },
    "Germany-Spain": { 
        docs: "Valid passport or national ID card.",
        visa: "Visa-free (Schengen).",
        vax: "No required vaccines.",
        ins: "EHIC recommended.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "Small tip or rounding up.",
        emergency: "112"
    },
    "Germany-Greece": { 
        docs: "Valid passport or national ID card.",
        visa: "Visa-free (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "EHIC recommended.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "5–10% common.",
        emergency: "112"
    },
    "Germany-UnitedKingdom": { 
        docs: "Valid passport required.",
        visa: "Electronic Travel Authorisation (ETA) required.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type G (230V)",
        currency: "Pound Sterling (£)",
        tipping: "10–12% if service not included.",
        emergency: "999 / 112"
    },
    "Germany-UnitedStates": { 
        docs: "Biometric passport required.",
        visa: "ESTA required (Visa Waiver Program).",
        vax: "No mandatory vaccines.",
        ins: "Comprehensive travel insurance recommended.",
        power: "Type A / B (120V)",
        currency: "US Dollar ($)",
        tipping: "15–20% expected.",
        emergency: "911"
    },
    "Germany-Canada": { 
        docs: "Valid passport required.",
        visa: "eTA required for air travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (120V)",
        currency: "Canadian Dollar ($)",
        tipping: "15–20% typical.",
        emergency: "911"
    },
    "Germany-Australia": { 
        docs: "Valid passport required.",
        visa: "eVisitor visa required.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type I (230V)",
        currency: "Australian Dollar ($)",
        tipping: "Not expected but appreciated.",
        emergency: "000"
    },
    "Germany-Japan": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (100V)",
        currency: "Japanese Yen (¥)",
        tipping: "Tipping not customary.",
        emergency: "110 / 119"
    },
    "Germany-Brazil": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines (yellow fever recommended for some regions).",
        ins: "Travel insurance recommended.",
        power: "Type C / N (127–220V)",
        currency: "Brazilian Real (R$)",
        tipping: "10% usually included.",
        emergency: "190 / 192"
    },
    "Germany-Turkey": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Turkish Lira (₺)",
        tipping: "5–10% customary.",
        emergency: "112"
    },
    "Germany-Georgia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 1 year.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Germany-Serbia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Germany-Mexico": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 180 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (127V)",
        currency: "Mexican Peso ($)",
        tipping: "10–15% expected.",
        emergency: "911"
    },
    "Germany-SouthAfrica": { 
        docs: "Valid passport (2 blank pages recommended).",
        visa: "Visa-free up to 90 days.",
        vax: "Yellow fever certificate if arriving from risk countries.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Germany-Thailand": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "Yellow fever certificate if applicable.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Germany-UAE": { 
        docs: "Valid passport required (6 months validity recommended).",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Germany-Tunisia": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Germany-Argentina": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },

    "Italy-Bulgaria": { 
        docs: "Valid passport or national ID card.",
        visa: "Visa-free (EU free movement).",
        vax: "No mandatory vaccines.",
        ins: "European Health Insurance Card recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Italy-France": { 
        docs: "Valid passport or national ID card.",
        visa: "Visa-free (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "EHIC recommended.",
        power: "Type C / E (230V)",
        currency: "Euro (€)",
        tipping: "Round up or leave 5–10%.",
        emergency: "112"
    },
    "Italy-Germany": { 
        docs: "Valid passport or national ID card.",
        visa: "Visa-free (Schengen).",
        vax: "No required vaccines.",
        ins: "EHIC recommended.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "5–10% tip common.",
        emergency: "112"
    },
    "Italy-Spain": { 
        docs: "Valid passport or national ID card.",
        visa: "Visa-free (Schengen).",
        vax: "No special vaccines.",
        ins: "EHIC recommended.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "Small tip or rounding up.",
        emergency: "112"
    },
    "Italy-Greece": { 
        docs: "Valid passport or national ID card.",
        visa: "Visa-free (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "EHIC recommended.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "5–10% common.",
        emergency: "112"
    },
    "Italy-UnitedKingdom": { 
        docs: "Valid passport required.",
        visa: "Electronic Travel Authorisation (ETA) required.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type G (230V)",
        currency: "Pound Sterling (£)",
        tipping: "10–12% if service not included.",
        emergency: "999 / 112"
    },
    "Italy-UnitedStates": { 
        docs: "Biometric passport required.",
        visa: "ESTA required (Visa Waiver Program).",
        vax: "No mandatory vaccines.",
        ins: "Comprehensive travel insurance recommended.",
        power: "Type A / B (120V)",
        currency: "US Dollar ($)",
        tipping: "15–20% expected.",
        emergency: "911"
    },
    "Italy-Canada": { 
        docs: "Valid passport required.",
        visa: "eTA required for air travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (120V)",
        currency: "Canadian Dollar ($)",
        tipping: "15–20% typical.",
        emergency: "911"
    },
    "Italy-Australia": { 
        docs: "Valid passport required.",
        visa: "eVisitor visa required.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type I (230V)",
        currency: "Australian Dollar ($)",
        tipping: "Not expected but appreciated.",
        emergency: "000"
    },
    "Italy-Japan": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (100V)",
        currency: "Japanese Yen (¥)",
        tipping: "Tipping not customary.",
        emergency: "110 / 119"
    },
    "Italy-Brazil": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines (yellow fever recommended in some regions).",
        ins: "Travel insurance recommended.",
        power: "Type C / N (127–220V)",
        currency: "Brazilian Real (R$)",
        tipping: "10% usually included.",
        emergency: "190 / 192"
    },
    "Italy-Turkey": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Turkish Lira (₺)",
        tipping: "5–10% customary.",
        emergency: "112"
    },
    "Italy-Georgia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 1 year.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Italy-Serbia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Italy-Mexico": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 180 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (127V)",
        currency: "Mexican Peso ($)",
        tipping: "10–15% expected.",
        emergency: "911"
    },
    "Italy-SouthAfrica": { 
        docs: "Valid passport (2 blank pages recommended).",
        visa: "Visa-free up to 90 days.",
        vax: "Yellow fever certificate if arriving from risk countries.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Italy-Thailand": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "Yellow fever certificate if applicable.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Italy-UAE": { 
        docs: "Valid passport required (6 months validity recommended).",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Italy-Tunisia": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Italy-Argentina": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },

    "Spain-Bulgaria": { 
        docs: "Valid passport or national ID card.",
        visa: "Visa-free (EU free movement).",
        vax: "No mandatory vaccines.",
        ins: "European Health Insurance Card recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Spain-France": { 
        docs: "Valid passport or national ID card.",
        visa: "Visa-free (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "EHIC recommended.",
        power: "Type C / E (230V)",
        currency: "Euro (€)",
        tipping: "Round up or leave 5–10%.",
        emergency: "112"
    },
    "Spain-Germany": { 
        docs: "Valid passport or national ID card.",
        visa: "Visa-free (Schengen).",
        vax: "No required vaccines.",
        ins: "EHIC recommended.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "5–10% tip common.",
        emergency: "112"
    },
    "Spain-Italy": { 
        docs: "Valid passport or national ID card.",
        visa: "Visa-free (Schengen).",
        vax: "No special vaccines.",
        ins: "EHIC recommended.",
        power: "Type C / F / L (230V)",
        currency: "Euro (€)",
        tipping: "Service charge common, small tip appreciated.",
        emergency: "112"
    },
    "Spain-Greece": { 
        docs: "Valid passport or national ID card.",
        visa: "Visa-free (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "EHIC recommended.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "5–10% common.",
        emergency: "112"
    },
    "Spain-UnitedKingdom": { 
        docs: "Valid passport required.",
        visa: "Electronic Travel Authorisation (ETA) required.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type G (230V)",
        currency: "Pound Sterling (£)",
        tipping: "10–12% if service not included.",
        emergency: "999 / 112"
    },
    "Spain-UnitedStates": { 
        docs: "Biometric passport required.",
        visa: "ESTA required (Visa Waiver Program).",
        vax: "No mandatory vaccines.",
        ins: "Comprehensive travel insurance recommended.",
        power: "Type A / B (120V)",
        currency: "US Dollar ($)",
        tipping: "15–20% expected.",
        emergency: "911"
    },
    "Spain-Canada": { 
        docs: "Valid passport required.",
        visa: "eTA required for air travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (120V)",
        currency: "Canadian Dollar ($)",
        tipping: "15–20% typical.",
        emergency: "911"
    },
    "Spain-Australia": { 
        docs: "Valid passport required.",
        visa: "eVisitor visa required.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type I (230V)",
        currency: "Australian Dollar ($)",
        tipping: "Not expected but appreciated.",
        emergency: "000"
    },
    "Spain-Japan": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (100V)",
        currency: "Japanese Yen (¥)",
        tipping: "Tipping not customary.",
        emergency: "110 / 119"
    },
    "Spain-Brazil": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines (yellow fever recommended in some regions).",
        ins: "Travel insurance recommended.",
        power: "Type C / N (127–220V)",
        currency: "Brazilian Real (R$)",
        tipping: "10% usually included.",
        emergency: "190 / 192"
    },
    "Spain-Turkey": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Turkish Lira (₺)",
        tipping: "5–10% customary.",
        emergency: "112"
    },
    "Spain-Georgia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 1 year.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Spain-Serbia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Spain-Mexico": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 180 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (127V)",
        currency: "Mexican Peso ($)",
        tipping: "10–15% expected.",
        emergency: "911"
    },
    "Spain-SouthAfrica": { 
        docs: "Valid passport (2 blank pages recommended).",
        visa: "Visa-free up to 90 days.",
        vax: "Yellow fever certificate if arriving from risk countries.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Spain-Thailand": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "Yellow fever certificate if applicable.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Spain-UAE": { 
        docs: "Valid passport required (6 months validity recommended).",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Spain-Tunisia": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Spain-Argentina": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },

    "Greece-Bulgaria": { 
        docs: "Valid passport or national ID card.",
        visa: "Visa-free (EU free movement).",
        vax: "No mandatory vaccines.",
        ins: "European Health Insurance Card recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Greece-France": { 
        docs: "Valid passport or national ID card.",
        visa: "Visa-free (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "EHIC recommended.",
        power: "Type C / E (230V)",
        currency: "Euro (€)",
        tipping: "Round up or leave 5–10%.",
        emergency: "112"
    },
    "Greece-Germany": { 
        docs: "Valid passport or national ID card.",
        visa: "Visa-free (Schengen).",
        vax: "No required vaccines.",
        ins: "EHIC recommended.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "5–10% tip common.",
        emergency: "112"
    },
    "Greece-Italy": { 
        docs: "Valid passport or national ID card.",
        visa: "Visa-free (Schengen).",
        vax: "No special vaccines.",
        ins: "EHIC recommended.",
        power: "Type C / F / L (230V)",
        currency: "Euro (€)",
        tipping: "Service charge common, small tip appreciated.",
        emergency: "112"
    },
    "Greece-Spain": { 
        docs: "Valid passport or national ID card.",
        visa: "Visa-free (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "EHIC recommended.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "Small tip or rounding up.",
        emergency: "112"
    },
    "Greece-UnitedKingdom": { 
        docs: "Valid passport required.",
        visa: "Electronic Travel Authorisation (ETA) required.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type G (230V)",
        currency: "Pound Sterling (£)",
        tipping: "10–12% if service not included.",
        emergency: "999 / 112"
    },
    "Greece-UnitedStates": { 
        docs: "Biometric passport required.",
        visa: "ESTA required (Visa Waiver Program).",
        vax: "No mandatory vaccines.",
        ins: "Comprehensive travel insurance recommended.",
        power: "Type A / B (120V)",
        currency: "US Dollar ($)",
        tipping: "15–20% expected.",
        emergency: "911"
    },
    "Greece-Canada": { 
        docs: "Valid passport required.",
        visa: "eTA required for air travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (120V)",
        currency: "Canadian Dollar ($)",
        tipping: "15–20% typical.",
        emergency: "911"
    },
    "Greece-Australia": { 
        docs: "Valid passport required.",
        visa: "eVisitor visa required.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type I (230V)",
        currency: "Australian Dollar ($)",
        tipping: "Not expected but appreciated.",
        emergency: "000"
    },
    "Greece-Japan": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (100V)",
        currency: "Japanese Yen (¥)",
        tipping: "Tipping not customary.",
        emergency: "110 / 119"
    },
    "Greece-Brazil": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines (yellow fever recommended in some regions).",
        ins: "Travel insurance recommended.",
        power: "Type C / N (127–220V)",
        currency: "Brazilian Real (R$)",
        tipping: "10% usually included.",
        emergency: "190 / 192"
    },
    "Greece-Turkey": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Turkish Lira (₺)",
        tipping: "5–10% customary.",
        emergency: "112"
    },
    "Greece-Georgia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 1 year.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Greece-Serbia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Greece-Mexico": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 180 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (127V)",
        currency: "Mexican Peso ($)",
        tipping: "10–15% expected.",
        emergency: "911"
    },
    "Greece-SouthAfrica": { 
        docs: "Valid passport (2 blank pages recommended).",
        visa: "Visa-free up to 90 days.",
        vax: "Yellow fever certificate if arriving from risk countries.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Greece-Thailand": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "Yellow fever certificate if applicable.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Greece-UAE": { 
        docs: "Valid passport required (6 months validity recommended).",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Greece-Tunisia": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Greece-Argentina": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },

    "UnitedKingdom-Bulgaria": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (EU short stay).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "UnitedKingdom-France": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen short stay).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / E (230V)",
        currency: "Euro (€)",
        tipping: "Round up or leave 5–10%.",
        emergency: "112"
    },
    "UnitedKingdom-Germany": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "5–10% tip common.",
        emergency: "112"
    },
    "UnitedKingdom-Italy": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F / L (230V)",
        currency: "Euro (€)",
        tipping: "Service charge common, small tip appreciated.",
        emergency: "112"
    },
    "UnitedKingdom-Spain": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "Small tip or rounding up.",
        emergency: "112"
    },
    "UnitedKingdom-Greece": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "5–10% common.",
        emergency: "112"
    },
    "UnitedKingdom-UnitedStates": { 
        docs: "Valid biometric passport required.",
        visa: "ESTA required (Visa Waiver Program).",
        vax: "No mandatory vaccines.",
        ins: "Comprehensive travel insurance recommended.",
        power: "Type A / B (120V)",
        currency: "US Dollar ($)",
        tipping: "15–20% expected.",
        emergency: "911"
    },
    "UnitedKingdom-Canada": { 
        docs: "Valid passport required.",
        visa: "eTA required for air travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (120V)",
        currency: "Canadian Dollar ($)",
        tipping: "15–20% typical.",
        emergency: "911"
    },
    "UnitedKingdom-Australia": { 
        docs: "Valid passport required.",
        visa: "ETA or eVisitor required.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type I (230V)",
        currency: "Australian Dollar ($)",
        tipping: "Not expected but appreciated.",
        emergency: "000"
    },
    "UnitedKingdom-Japan": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay (up to 90 days).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (100V)",
        currency: "Japanese Yen (¥)",
        tipping: "Tipping not customary.",
        emergency: "110 / 119"
    },
    "UnitedKingdom-Brazil": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines (yellow fever recommended for some regions).",
        ins: "Travel insurance recommended.",
        power: "Type C / N (127–220V)",
        currency: "Brazilian Real (R$)",
        tipping: "10% usually included.",
        emergency: "190 / 192"
    },
    "UnitedKingdom-Turkey": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Turkish Lira (₺)",
        tipping: "5–10% customary.",
        emergency: "112"
    },
    "UnitedKingdom-Georgia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 1 year.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "UnitedKingdom-Serbia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "UnitedKingdom-Mexico": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 180 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (127V)",
        currency: "Mexican Peso ($)",
        tipping: "10–15% expected.",
        emergency: "911"
    },
    "UnitedKingdom-SouthAfrica": { 
        docs: "Valid passport required (2 blank pages recommended).",
        visa: "Visa-free up to 90 days.",
        vax: "Yellow fever certificate if arriving from risk areas.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "UnitedKingdom-Thailand": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "Yellow fever certificate if applicable.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "UnitedKingdom-UAE": { 
        docs: "Valid passport required (6 months validity recommended).",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "UnitedKingdom-Tunisia": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "UnitedKingdom-Argentina": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },

    "UnitedStates-Bulgaria": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (EU short stay).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "UnitedStates-France": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen short stay).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / E (230V)",
        currency: "Euro (€)",
        tipping: "Round up or leave 5–10%.",
        emergency: "112"
    },
    "UnitedStates-Germany": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "5–10% tip common.",
        emergency: "112"
    },
    "UnitedStates-Italy": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F / L (230V)",
        currency: "Euro (€)",
        tipping: "Service charge common, small tip appreciated.",
        emergency: "112"
    },
    "UnitedStates-Spain": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "Small tip or rounding up.",
        emergency: "112"
    },
    "UnitedStates-Greece": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "5–10% common.",
        emergency: "112"
    },
    "UnitedStates-UnitedKingdom": { 
        docs: "Valid passport required.",
        visa: "Electronic Travel Authorisation (ETA) required.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type G (230V)",
        currency: "Pound Sterling (£)",
        tipping: "10–12% if service not included.",
        emergency: "999 / 112"
    },
    "UnitedStates-Canada": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay (tourism/business).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (120V)",
        currency: "Canadian Dollar ($)",
        tipping: "15–20% typical.",
        emergency: "911"
    },
    "UnitedStates-Australia": { 
        docs: "Valid passport required.",
        visa: "ETA required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type I (230V)",
        currency: "Australian Dollar ($)",
        tipping: "Not expected but appreciated.",
        emergency: "000"
    },
    "UnitedStates-Japan": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (100V)",
        currency: "Japanese Yen (¥)",
        tipping: "Tipping not customary.",
        emergency: "110 / 119"
    },
    "UnitedStates-Brazil": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay (tourism).",
        vax: "No mandatory vaccines (yellow fever recommended in some regions).",
        ins: "Travel insurance recommended.",
        power: "Type C / N (127–220V)",
        currency: "Brazilian Real (R$)",
        tipping: "10% usually included.",
        emergency: "190 / 192"
    },
    "UnitedStates-Turkey": { 
        docs: "Valid passport required.",
        visa: "e-Visa required before arrival.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Turkish Lira (₺)",
        tipping: "5–10% customary.",
        emergency: "112"
    },
    "UnitedStates-Georgia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 1 year.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "UnitedStates-Serbia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "UnitedStates-Mexico": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay (tourism).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (127V)",
        currency: "Mexican Peso ($)",
        tipping: "10–15% expected.",
        emergency: "911"
    },
    "UnitedStates-SouthAfrica": { 
        docs: "Valid passport required (2 blank pages recommended).",
        visa: "Visa-free up to 90 days.",
        vax: "Yellow fever certificate if arriving from risk countries.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "UnitedStates-Thailand": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "Yellow fever certificate if applicable.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "UnitedStates-UAE": { 
        docs: "Valid passport required (6 months validity recommended).",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "UnitedStates-Tunisia": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "UnitedStates-Argentina": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },

    "Canada-Bulgaria": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (EU short stay).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Canada-France": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / E (230V)",
        currency: "Euro (€)",
        tipping: "Round up or leave 5–10%.",
        emergency: "112"
    },
    "Canada-Germany": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "5–10% tip common.",
        emergency: "112"
    },
    "Canada-Italy": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F / L (230V)",
        currency: "Euro (€)",
        tipping: "Service charge common, small tip appreciated.",
        emergency: "112"
    },
    "Canada-Spain": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "Small tip or rounding up.",
        emergency: "112"
    },
    "Canada-Greece": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "5–10% common.",
        emergency: "112"
    },
    "Canada-UnitedKingdom": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay (tourism/business).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type G (230V)",
        currency: "Pound Sterling (£)",
        tipping: "10–12% if service not included.",
        emergency: "999 / 112"
    },
    "Canada-UnitedStates": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay (tourism/business).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (120V)",
        currency: "US Dollar ($)",
        tipping: "15–20% expected.",
        emergency: "911"
    },
    "Canada-Australia": { 
        docs: "Valid passport required.",
        visa: "ETA or eVisitor required.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type I (230V)",
        currency: "Australian Dollar ($)",
        tipping: "Not expected but appreciated.",
        emergency: "000"
    },
    "Canada-Japan": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (100V)",
        currency: "Japanese Yen (¥)",
        tipping: "Tipping not customary.",
        emergency: "110 / 119"
    },
    "Canada-Brazil": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay (tourism).",
        vax: "No mandatory vaccines (yellow fever recommended for some regions).",
        ins: "Travel insurance recommended.",
        power: "Type C / N (127–220V)",
        currency: "Brazilian Real (R$)",
        tipping: "10% usually included.",
        emergency: "190 / 192"
    },
    "Canada-Turkey": { 
        docs: "Valid passport required.",
        visa: "e-Visa required before arrival.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Turkish Lira (₺)",
        tipping: "5–10% customary.",
        emergency: "112"
    },
    "Canada-Georgia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 1 year.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Canada-Serbia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Canada-Mexico": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay (tourism).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (127V)",
        currency: "Mexican Peso ($)",
        tipping: "10–15% expected.",
        emergency: "911"
    },
    "Canada-SouthAfrica": { 
        docs: "Valid passport required (2 blank pages recommended).",
        visa: "Visa-free up to 90 days.",
        vax: "Yellow fever certificate if arriving from risk countries.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Canada-Thailand": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "Yellow fever certificate if applicable.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Canada-UAE": { 
        docs: "Valid passport required (6 months validity recommended).",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Canada-Tunisia": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Canada-Argentina": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    }, 

    "Australia-Bulgaria": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (EU short stay).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Australia-France": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / E (230V)",
        currency: "Euro (€)",
        tipping: "Round up or leave 5–10%.",
        emergency: "112"
    },
    "Australia-Germany": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "5–10% tip common.",
        emergency: "112"
    },
    "Australia-Italy": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F / L (230V)",
        currency: "Euro (€)",
        tipping: "Service charge common, small tip appreciated.",
        emergency: "112"
    },
    "Australia-Spain": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "Small tip or rounding up.",
        emergency: "112"
    },
    "Australia-Greece": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "5–10% common.",
        emergency: "112"
    },
    "Australia-UnitedKingdom": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay (tourism/business).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type G (230V)",
        currency: "Pound Sterling (£)",
        tipping: "10–12% if service not included.",
        emergency: "999 / 112"
    },
    "Australia-UnitedStates": { 
        docs: "Valid passport required.",
        visa: "ESTA required (Visa Waiver Program).",
        vax: "No mandatory vaccines.",
        ins: "Comprehensive travel insurance recommended.",
        power: "Type A / B (120V)",
        currency: "US Dollar ($)",
        tipping: "15–20% expected.",
        emergency: "911"
    },
    "Australia-Canada": { 
        docs: "Valid passport required.",
        visa: "eTA required for air travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (120V)",
        currency: "Canadian Dollar ($)",
        tipping: "15–20% typical.",
        emergency: "911"
    },
    "Australia-Japan": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (100V)",
        currency: "Japanese Yen (¥)",
        tipping: "Tipping not customary.",
        emergency: "110 / 119"
    },
    "Australia-Brazil": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay (tourism).",
        vax: "No mandatory vaccines (yellow fever recommended in some regions).",
        ins: "Travel insurance recommended.",
        power: "Type C / N (127–220V)",
        currency: "Brazilian Real (R$)",
        tipping: "10% usually included.",
        emergency: "190 / 192"
    },
    "Australia-Turkey": { 
        docs: "Valid passport required.",
        visa: "e-Visa required before arrival.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Turkish Lira (₺)",
        tipping: "5–10% customary.",
        emergency: "112"
    },
    "Australia-Georgia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 1 year.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Australia-Serbia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Australia-Mexico": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay (tourism).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (127V)",
        currency: "Mexican Peso ($)",
        tipping: "10–15% expected.",
        emergency: "911"
    },
    "Australia-SouthAfrica": { 
        docs: "Valid passport required (2 blank pages recommended).",
        visa: "Visa-free up to 90 days.",
        vax: "Yellow fever certificate if arriving from risk countries.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Australia-Thailand": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "Yellow fever certificate if applicable.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Australia-UAE": { 
        docs: "Valid passport required (6 months validity recommended).",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Australia-Tunisia": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Australia-Argentina": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },

    "Japan-Bulgaria": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (EU short stay).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Japan-France": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / E (230V)",
        currency: "Euro (€)",
        tipping: "Round up or leave 5–10%.",
        emergency: "112"
    },
    "Japan-Germany": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "5–10% tip common.",
        emergency: "112"
    },
    "Japan-Italy": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F / L (230V)",
        currency: "Euro (€)",
        tipping: "Service charge common, small tip appreciated.",
        emergency: "112"
    },
    "Japan-Spain": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "Small tip or rounding up.",
        emergency: "112"
    },
    "Japan-Greece": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "5–10% common.",
        emergency: "112"
    },
    "Japan-UnitedKingdom": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay (tourism/business).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type G (230V)",
        currency: "Pound Sterling (£)",
        tipping: "10–12% if service not included.",
        emergency: "999 / 112"
    },
    "Japan-UnitedStates": { 
        docs: "Valid passport required.",
        visa: "ESTA required (Visa Waiver Program).",
        vax: "No mandatory vaccines.",
        ins: "Comprehensive travel insurance recommended.",
        power: "Type A / B (120V)",
        currency: "US Dollar ($)",
        tipping: "15–20% expected.",
        emergency: "911"
    },
    "Japan-Canada": { 
        docs: "Valid passport required.",
        visa: "eTA required for air travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (120V)",
        currency: "Canadian Dollar ($)",
        tipping: "15–20% typical.",
        emergency: "911"
    },
    "Japan-Australia": { 
        docs: "Valid passport required.",
        visa: "ETA or eVisitor required.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type I (230V)",
        currency: "Australian Dollar ($)",
        tipping: "Not expected but appreciated.",
        emergency: "000"
    },
    "Japan-Brazil": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay (tourism).",
        vax: "No mandatory vaccines (yellow fever recommended in some regions).",
        ins: "Travel insurance recommended.",
        power: "Type C / N (127–220V)",
        currency: "Brazilian Real (R$)",
        tipping: "10% usually included.",
        emergency: "190 / 192"
    },
    "Japan-Turkey": { 
        docs: "Valid passport required.",
        visa: "e-Visa required before arrival.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Turkish Lira (₺)",
        tipping: "5–10% customary.",
        emergency: "112"
    },
    "Japan-Georgia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 1 year.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Japan-Serbia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Japan-Mexico": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay (tourism).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (127V)",
        currency: "Mexican Peso ($)",
        tipping: "10–15% expected.",
        emergency: "911"
    },
    "Japan-SouthAfrica": { 
        docs: "Valid passport required (2 blank pages recommended).",
        visa: "Visa-free up to 90 days.",
        vax: "Yellow fever certificate if arriving from risk countries.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Japan-Thailand": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "Yellow fever certificate if applicable.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Japan-UAE": { 
        docs: "Valid passport required (6 months validity recommended).",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Japan-Tunisia": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Japan-Argentina": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },

    "Brazil-Bulgaria": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (EU short stay).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Brazil-France": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / E (230V)",
        currency: "Euro (€)",
        tipping: "Round up or leave 5–10%.",
        emergency: "112"
    },
    "Brazil-Germany": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "5–10% tip common.",
        emergency: "112"
    },
    "Brazil-Italy": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F / L (230V)",
        currency: "Euro (€)",
        tipping: "Service charge common, small tip appreciated.",
        emergency: "112"
    },
    "Brazil-Spain": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "Small tip or rounding up.",
        emergency: "112"
    },
    "Brazil-Greece": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "5–10% common.",
        emergency: "112"
    },
    "Brazil-UnitedKingdom": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay (tourism/business).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type G (230V)",
        currency: "Pound Sterling (£)",
        tipping: "10–12% if service not included.",
        emergency: "999 / 112"
    },
    "Brazil-UnitedStates": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Comprehensive travel insurance recommended.",
        power: "Type A / B (120V)",
        currency: "US Dollar ($)",
        tipping: "15–20% expected.",
        emergency: "911"
    },
    "Brazil-Canada": { 
        docs: "Valid passport required.",
        visa: "eTA required for air travel (if eligible) or visa.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (120V)",
        currency: "Canadian Dollar ($)",
        tipping: "15–20% typical.",
        emergency: "911"
    },
    "Brazil-Australia": { 
        docs: "Valid passport required.",
        visa: "eVisitor/ETA required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type I (230V)",
        currency: "Australian Dollar ($)",
        tipping: "Not expected but appreciated.",
        emergency: "000"
    },
    "Brazil-Japan": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay (tourism).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (100V)",
        currency: "Japanese Yen (¥)",
        tipping: "Tipping not customary.",
        emergency: "110 / 119"
    },
    "Brazil-Turkey": { 
        docs: "Valid passport required.",
        visa: "e-Visa required before arrival.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Turkish Lira (₺)",
        tipping: "5–10% customary.",
        emergency: "112"
    },
    "Brazil-Georgia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 1 year.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Brazil-Serbia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Brazil-Mexico": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel (or visa exemption if holding valid US/Schengen visa).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (127V)",
        currency: "Mexican Peso ($)",
        tipping: "10–15% expected.",
        emergency: "911"
    },
    "Brazil-SouthAfrica": { 
        docs: "Valid passport required (2 blank pages recommended).",
        visa: "Visa-free up to 90 days.",
        vax: "Yellow fever certificate recommended/required if applicable.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Brazil-Thailand": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "Yellow fever certificate may be required if arriving from risk areas.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Brazil-UAE": { 
        docs: "Valid passport required (6 months validity recommended).",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Brazil-Tunisia": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Brazil-Argentina": { 
        docs: "Valid passport or national ID card accepted (Mercosur travel).",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },

    "Turkey-Bulgaria": { 
        docs: "Valid passport or national ID card accepted.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Turkey-France": { 
        docs: "Valid passport required.",
        visa: "Schengen visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required for visa.",
        power: "Type C / E (230V)",
        currency: "Euro (€)",
        tipping: "Round up or leave 5–10%.",
        emergency: "112"
    },
    "Turkey-Germany": { 
        docs: "Valid passport required.",
        visa: "Schengen visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required for visa.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "5–10% tip common.",
        emergency: "112"
    },
    "Turkey-Italy": { 
        docs: "Valid passport required.",
        visa: "Schengen visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required for visa.",
        power: "Type C / F / L (230V)",
        currency: "Euro (€)",
        tipping: "Service charge common, small tip appreciated.",
        emergency: "112"
    },
    "Turkey-Spain": { 
        docs: "Valid passport required.",
        visa: "Schengen visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required for visa.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "Small tip or rounding up.",
        emergency: "112"
    },
    "Turkey-Greece": { 
        docs: "Valid passport required.",
        visa: "Schengen visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required for visa.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "5–10% common.",
        emergency: "112"
    },
    "Turkey-UnitedKingdom": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type G (230V)",
        currency: "Pound Sterling (£)",
        tipping: "10–12% if service not included.",
        emergency: "999 / 112"
    },
    "Turkey-UnitedStates": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Comprehensive travel insurance recommended.",
        power: "Type A / B (120V)",
        currency: "US Dollar ($)",
        tipping: "15–20% expected.",
        emergency: "911"
    },
    "Turkey-Canada": { 
        docs: "Valid passport required.",
        visa: "Visa required (or eTA if eligible with visa/PR).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (120V)",
        currency: "Canadian Dollar ($)",
        tipping: "15–20% typical.",
        emergency: "911"
    },
    "Turkey-Australia": { 
        docs: "Valid passport required.",
        visa: "eVisitor/ETA or visa required.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type I (230V)",
        currency: "Australian Dollar ($)",
        tipping: "Not expected but appreciated.",
        emergency: "000"
    },
    "Turkey-Japan": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay (tourism).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (100V)",
        currency: "Japanese Yen (¥)",
        tipping: "Tipping not customary.",
        emergency: "110 / 119"
    },
    "Turkey-Brazil": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / N (127–220V)",
        currency: "Brazilian Real (R$)",
        tipping: "10% usually included.",
        emergency: "190 / 192"
    },
    "Turkey-Georgia": { 
        docs: "Valid passport or national ID card accepted.",
        visa: "Visa-free.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Turkey-Serbia": { 
        docs: "Valid passport or national ID card accepted.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Turkey-Mexico": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel (or exemption if holding US/Schengen visa).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (127V)",
        currency: "Mexican Peso ($)",
        tipping: "10–15% expected.",
        emergency: "911"
    },
    "Turkey-SouthAfrica": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel.",
        vax: "Yellow fever certificate if arriving from risk countries.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Turkey-Thailand": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "Yellow fever certificate if applicable.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Turkey-UAE": { 
        docs: "Valid passport required (6 months validity recommended).",
        visa: "Visa-free or visa on arrival (short stay).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Turkey-Tunisia": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Turkey-Argentina": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },

    "Georgia-Bulgaria": { 
        docs: "Valid passport or national ID card accepted.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Georgia-France": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen short stay).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / E (230V)",
        currency: "Euro (€)",
        tipping: "Round up or leave 5–10%.",
        emergency: "112"
    },
    "Georgia-Germany": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "5–10% tip common.",
        emergency: "112"
    },
    "Georgia-Italy": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F / L (230V)",
        currency: "Euro (€)",
        tipping: "Service charge common, small tip appreciated.",
        emergency: "112"
    },
    "Georgia-Spain": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "Small tip or rounding up.",
        emergency: "112"
    },
    "Georgia-Greece": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "5–10% common.",
        emergency: "112"
    },
    "Georgia-UnitedKingdom": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay (tourism).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type G (230V)",
        currency: "Pound Sterling (£)",
        tipping: "10–12% if service not included.",
        emergency: "999 / 112"
    },
    "Georgia-UnitedStates": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Comprehensive travel insurance recommended.",
        power: "Type A / B (120V)",
        currency: "US Dollar ($)",
        tipping: "15–20% expected.",
        emergency: "911"
    },
    "Georgia-Canada": { 
        docs: "Valid passport required.",
        visa: "Visa required (or eTA if eligible with visa/PR).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (120V)",
        currency: "Canadian Dollar ($)",
        tipping: "15–20% typical.",
        emergency: "911"
    },
    "Georgia-Australia": { 
        docs: "Valid passport required.",
        visa: "Visa or ETA required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type I (230V)",
        currency: "Australian Dollar ($)",
        tipping: "Not expected but appreciated.",
        emergency: "000"
    },
    "Georgia-Japan": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (100V)",
        currency: "Japanese Yen (¥)",
        tipping: "Tipping not customary.",
        emergency: "110 / 119"
    },
    "Georgia-Brazil": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / N (127–220V)",
        currency: "Brazilian Real (R$)",
        tipping: "10% usually included.",
        emergency: "190 / 192"
    },
    "Georgia-Turkey": { 
        docs: "Valid passport or national ID card accepted.",
        visa: "Visa-free.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Turkish Lira (₺)",
        tipping: "5–10% customary.",
        emergency: "112"
    },
    "Georgia-Serbia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Georgia-Mexico": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel (or exemption if holding US/Schengen visa).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (127V)",
        currency: "Mexican Peso ($)",
        tipping: "10–15% expected.",
        emergency: "911"
    },
    "Georgia-SouthAfrica": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel.",
        vax: "Yellow fever certificate if arriving from risk countries.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Georgia-Thailand": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "Yellow fever certificate if applicable.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Georgia-UAE": { 
        docs: "Valid passport required (6 months validity recommended).",
        visa: "Visa-free or visa on arrival (short stay).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Georgia-Tunisia": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Georgia-Argentina": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },

    "Serbia-Bulgaria": { 
        docs: "Valid passport or national ID card accepted.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Serbia-France": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen short stay).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / E (230V)",
        currency: "Euro (€)",
        tipping: "Round up or leave 5–10%.",
        emergency: "112"
    },
    "Serbia-Germany": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "5–10% tip common.",
        emergency: "112"
    },
    "Serbia-Italy": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F / L (230V)",
        currency: "Euro (€)",
        tipping: "Service charge common, small tip appreciated.",
        emergency: "112"
    },
    "Serbia-Spain": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "Small tip or rounding up.",
        emergency: "112"
    },
    "Serbia-Greece": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "5–10% common.",
        emergency: "112"
    },
    "Serbia-UnitedKingdom": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay (tourism/business).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type G (230V)",
        currency: "Pound Sterling (£)",
        tipping: "10–12% if service not included.",
        emergency: "999 / 112"
    },
    "Serbia-UnitedStates": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Comprehensive travel insurance recommended.",
        power: "Type A / B (120V)",
        currency: "US Dollar ($)",
        tipping: "15–20% expected.",
        emergency: "911"
    },
    "Serbia-Canada": { 
        docs: "Valid passport required.",
        visa: "Visa required (or eTA if eligible with visa/PR).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (120V)",
        currency: "Canadian Dollar ($)",
        tipping: "15–20% typical.",
        emergency: "911"
    },
    "Serbia-Australia": { 
        docs: "Valid passport required.",
        visa: "Visa or ETA required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type I (230V)",
        currency: "Australian Dollar ($)",
        tipping: "Not expected but appreciated.",
        emergency: "000"
    },
    "Serbia-Japan": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (100V)",
        currency: "Japanese Yen (¥)",
        tipping: "Tipping not customary.",
        emergency: "110 / 119"
    },
    "Serbia-Brazil": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / N (127–220V)",
        currency: "Brazilian Real (R$)",
        tipping: "10% usually included.",
        emergency: "190 / 192"
    },
    "Serbia-Turkey": { 
        docs: "Valid passport or national ID card accepted.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Turkish Lira (₺)",
        tipping: "5–10% customary.",
        emergency: "112"
    },
    "Serbia-Georgia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 1 year.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Serbia-Mexico": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel (or exemption with valid US/Schengen visa).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (127V)",
        currency: "Mexican Peso ($)",
        tipping: "10–15% expected.",
        emergency: "911"
    },
    "Serbia-SouthAfrica": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel.",
        vax: "Yellow fever certificate if arriving from risk countries.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Serbia-Thailand": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "Yellow fever certificate if applicable.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Serbia-UAE": { 
        docs: "Valid passport required (6 months validity recommended).",
        visa: "Visa-free or visa on arrival (short stay).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Serbia-Tunisia": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Serbia-Argentina": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },

    "Mexico-Bulgaria": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (EU short stay).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Mexico-France": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen short stay).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / E (230V)",
        currency: "Euro (€)",
        tipping: "Round up or leave 5–10%.",
        emergency: "112"
    },
    "Mexico-Germany": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "5–10% tip common.",
        emergency: "112"
    },
    "Mexico-Italy": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F / L (230V)",
        currency: "Euro (€)",
        tipping: "Service charge common, small tip appreciated.",
        emergency: "112"
    },
    "Mexico-Spain": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "Small tip or rounding up.",
        emergency: "112"
    },
    "Mexico-Greece": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "5–10% common.",
        emergency: "112"
    },
    "Mexico-UnitedKingdom": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay (tourism/business).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type G (230V)",
        currency: "Pound Sterling (£)",
        tipping: "10–12% if service not included.",
        emergency: "999 / 112"
    },
    "Mexico-UnitedStates": { 
        docs: "Valid passport required.",
        visa: "Visa required (B1/B2) unless holding US status/waiver eligibility.",
        vax: "No mandatory vaccines.",
        ins: "Comprehensive travel insurance recommended.",
        power: "Type A / B (120V)",
        currency: "US Dollar ($)",
        tipping: "15–20% expected.",
        emergency: "911"
    },
    "Mexico-Canada": { 
        docs: "Valid passport required.",
        visa: "eTA required for air travel (if eligible) or visa.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (120V)",
        currency: "Canadian Dollar ($)",
        tipping: "15–20% typical.",
        emergency: "911"
    },
    "Mexico-Australia": { 
        docs: "Valid passport required.",
        visa: "ETA or visitor visa required.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type I (230V)",
        currency: "Australian Dollar ($)",
        tipping: "Not expected but appreciated.",
        emergency: "000"
    },
    "Mexico-Japan": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay (tourism).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (100V)",
        currency: "Japanese Yen (¥)",
        tipping: "Tipping not customary.",
        emergency: "110 / 119"
    },
    "Mexico-Brazil": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay (tourism).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / N (127–220V)",
        currency: "Brazilian Real (R$)",
        tipping: "10% usually included.",
        emergency: "190 / 192"
    },
    "Mexico-Turkey": { 
        docs: "Valid passport required.",
        visa: "e-Visa required before arrival.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Turkish Lira (₺)",
        tipping: "5–10% customary.",
        emergency: "112"
    },
    "Mexico-Georgia": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Mexico-Serbia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Mexico-SouthAfrica": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel.",
        vax: "Yellow fever certificate if arriving from risk countries.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Mexico-Thailand": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "Yellow fever certificate if applicable.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Mexico-UAE": { 
        docs: "Valid passport required (6 months validity recommended).",
        visa: "Visa-free or visa on arrival (short stay).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Mexico-Tunisia": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Mexico-Argentina": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },

    "SouthAfrica-Bulgaria": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (EU short stay).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "SouthAfrica-France": { 
        docs: "Valid passport required.",
        visa: "Schengen visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required for visa.",
        power: "Type C / E (230V)",
        currency: "Euro (€)",
        tipping: "Round up or leave 5–10%.",
        emergency: "112"
    },
    "SouthAfrica-Germany": { 
        docs: "Valid passport required.",
        visa: "Schengen visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required for visa.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "5–10% tip common.",
        emergency: "112"
    },
    "SouthAfrica-Italy": { 
        docs: "Valid passport required.",
        visa: "Schengen visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required for visa.",
        power: "Type C / F / L (230V)",
        currency: "Euro (€)",
        tipping: "Service charge common, small tip appreciated.",
        emergency: "112"
    },
    "SouthAfrica-Spain": { 
        docs: "Valid passport required.",
        visa: "Schengen visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required for visa.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "Small tip or rounding up.",
        emergency: "112"
    },
    "SouthAfrica-Greece": { 
        docs: "Valid passport required.",
        visa: "Schengen visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required for visa.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "5–10% common.",
        emergency: "112"
    },
    "SouthAfrica-UnitedKingdom": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay (tourism/business).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type G (230V)",
        currency: "Pound Sterling (£)",
        tipping: "10–12% if service not included.",
        emergency: "999 / 112"
    },
    "SouthAfrica-UnitedStates": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Comprehensive travel insurance recommended.",
        power: "Type A / B (120V)",
        currency: "US Dollar ($)",
        tipping: "15–20% expected.",
        emergency: "911"
    },
    "SouthAfrica-Canada": { 
        docs: "Valid passport required.",
        visa: "Visa required (or eTA if eligible with visa/PR).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (120V)",
        currency: "Canadian Dollar ($)",
        tipping: "15–20% typical.",
        emergency: "911"
    },
    "SouthAfrica-Australia": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type I (230V)",
        currency: "Australian Dollar ($)",
        tipping: "Not expected but appreciated.",
        emergency: "000"
    },
    "SouthAfrica-Japan": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay (tourism).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (100V)",
        currency: "Japanese Yen (¥)",
        tipping: "Tipping not customary.",
        emergency: "110 / 119"
    },
    "SouthAfrica-Brazil": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "Yellow fever certificate may be required depending on travel history.",
        ins: "Travel insurance recommended.",
        power: "Type C / N (127–220V)",
        currency: "Brazilian Real (R$)",
        tipping: "10% usually included.",
        emergency: "190 / 192"
    },
    "SouthAfrica-Turkey": { 
        docs: "Valid passport required.",
        visa: "e-Visa required before arrival.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Turkish Lira (₺)",
        tipping: "5–10% customary.",
        emergency: "112"
    },
    "SouthAfrica-Georgia": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "SouthAfrica-Serbia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "SouthAfrica-Mexico": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel (or exemption with valid US/Schengen visa).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (127V)",
        currency: "Mexican Peso ($)",
        tipping: "10–15% expected.",
        emergency: "911"
    },
    "SouthAfrica-Thailand": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "Yellow fever certificate if arriving from risk countries.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "SouthAfrica-UAE": { 
        docs: "Valid passport required (6 months validity recommended).",
        visa: "Visa-free or visa on arrival (short stay).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "SouthAfrica-Tunisia": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "SouthAfrica-Argentina": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },

    "Thailand-Bulgaria": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (EU short stay).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Thailand-France": { 
        docs: "Valid passport required.",
        visa: "Schengen visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required for visa.",
        power: "Type C / E (230V)",
        currency: "Euro (€)",
        tipping: "Round up or leave 5–10%.",
        emergency: "112"
    },
    "Thailand-Germany": { 
        docs: "Valid passport required.",
        visa: "Schengen visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required for visa.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "5–10% tip common.",
        emergency: "112"
    },
    "Thailand-Italy": { 
        docs: "Valid passport required.",
        visa: "Schengen visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required for visa.",
        power: "Type C / F / L (230V)",
        currency: "Euro (€)",
        tipping: "Service charge common, small tip appreciated.",
        emergency: "112"
    },
    "Thailand-Spain": { 
        docs: "Valid passport required.",
        visa: "Schengen visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required for visa.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "Small tip or rounding up.",
        emergency: "112"
    },
    "Thailand-Greece": { 
        docs: "Valid passport required.",
        visa: "Schengen visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required for visa.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "5–10% common.",
        emergency: "112"
    },
    "Thailand-UnitedKingdom": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay (tourism).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type G (230V)",
        currency: "Pound Sterling (£)",
        tipping: "10–12% if service not included.",
        emergency: "999 / 112"
    },
    "Thailand-UnitedStates": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Comprehensive travel insurance recommended.",
        power: "Type A / B (120V)",
        currency: "US Dollar ($)",
        tipping: "15–20% expected.",
        emergency: "911"
    },
    "Thailand-Canada": { 
        docs: "Valid passport required.",
        visa: "Visa required (or eTA if eligible with visa/PR).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (120V)",
        currency: "Canadian Dollar ($)",
        tipping: "15–20% typical.",
        emergency: "911"
    },
    "Thailand-Australia": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay or ETA required depending on duration.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type I (230V)",
        currency: "Australian Dollar ($)",
        tipping: "Not expected but appreciated.",
        emergency: "000"
    },
    "Thailand-Japan": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay (tourism).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (100V)",
        currency: "Japanese Yen (¥)",
        tipping: "Tipping not customary.",
        emergency: "110 / 119"
    },
    "Thailand-Brazil": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "Yellow fever certificate may be required if arriving from risk areas.",
        ins: "Travel insurance recommended.",
        power: "Type C / N (127–220V)",
        currency: "Brazilian Real (R$)",
        tipping: "10% usually included.",
        emergency: "190 / 192"
    },
    "Thailand-Turkey": { 
        docs: "Valid passport required.",
        visa: "e-Visa or visa on arrival depending on stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Turkish Lira (₺)",
        tipping: "5–10% customary.",
        emergency: "112"
    },
    "Thailand-Georgia": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Thailand-Serbia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Thailand-Mexico": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel (or exemption with valid US/Schengen visa).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (127V)",
        currency: "Mexican Peso ($)",
        tipping: "10–15% expected.",
        emergency: "911"
    },
    "Thailand-SouthAfrica": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel.",
        vax: "Yellow fever certificate if arriving from risk countries.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Thailand-UAE": { 
        docs: "Valid passport required (6 months validity recommended).",
        visa: "Visa-free or visa on arrival (short stay).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Thailand-Tunisia": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Thailand-Argentina": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },

    "UAE-Bulgaria": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (EU short stay).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "UAE-France": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / E (230V)",
        currency: "Euro (€)",
        tipping: "Round up or leave 5–10%.",
        emergency: "112"
    },
    "UAE-Germany": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "5–10% tip common.",
        emergency: "112"
    },
    "UAE-Italy": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F / L (230V)",
        currency: "Euro (€)",
        tipping: "Service charge common, small tip appreciated.",
        emergency: "112"
    },
    "UAE-Spain": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "Small tip or rounding up.",
        emergency: "112"
    },
    "UAE-Greece": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "5–10% common.",
        emergency: "112"
    },
    "UAE-UnitedKingdom": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay (tourism/business).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type G (230V)",
        currency: "Pound Sterling (£)",
        tipping: "10–12% if service not included.",
        emergency: "999 / 112"
    },
    "UAE-UnitedStates": { 
        docs: "Valid passport required.",
        visa: "ESTA required (Visa Waiver Program).",
        vax: "No mandatory vaccines.",
        ins: "Comprehensive travel insurance recommended.",
        power: "Type A / B (120V)",
        currency: "US Dollar ($)",
        tipping: "15–20% expected.",
        emergency: "911"
    },
    "UAE-Canada": { 
        docs: "Valid passport required.",
        visa: "eTA required for air travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (120V)",
        currency: "Canadian Dollar ($)",
        tipping: "15–20% typical.",
        emergency: "911"
    },
    "UAE-Australia": { 
        docs: "Valid passport required.",
        visa: "ETA or eVisitor required.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type I (230V)",
        currency: "Australian Dollar ($)",
        tipping: "Not expected but appreciated.",
        emergency: "000"
    },
    "UAE-Japan": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (100V)",
        currency: "Japanese Yen (¥)",
        tipping: "Tipping not customary.",
        emergency: "110 / 119"
    },
    "UAE-Brazil": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines (yellow fever recommended in some regions).",
        ins: "Travel insurance recommended.",
        power: "Type C / N (127–220V)",
        currency: "Brazilian Real (R$)",
        tipping: "10% usually included.",
        emergency: "190 / 192"
    },
    "UAE-Turkey": { 
        docs: "Valid passport required.",
        visa: "Visa-free or visa on arrival (short stay).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Turkish Lira (₺)",
        tipping: "5–10% customary.",
        emergency: "112"
    },
    "UAE-Georgia": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "UAE-Serbia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "UAE-Mexico": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel (or exemption with valid US/Schengen visa).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (127V)",
        currency: "Mexican Peso ($)",
        tipping: "10–15% expected.",
        emergency: "911"
    },
    "UAE-SouthAfrica": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "Yellow fever certificate if arriving from risk countries.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "UAE-Thailand": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "UAE-Tunisia": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "UAE-Argentina": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },

    "Tunisia-Bulgaria": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (EU short stay).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Tunisia-France": { 
        docs: "Valid passport required.",
        visa: "Schengen visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required for visa.",
        power: "Type C / E (230V)",
        currency: "Euro (€)",
        tipping: "Round up or leave 5–10%.",
        emergency: "112"
    },
    "Tunisia-Germany": { 
        docs: "Valid passport required.",
        visa: "Schengen visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required for visa.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "5–10% tip common.",
        emergency: "112"
    },
    "Tunisia-Italy": { 
        docs: "Valid passport required.",
        visa: "Schengen visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required for visa.",
        power: "Type C / F / L (230V)",
        currency: "Euro (€)",
        tipping: "Service charge common, small tip appreciated.",
        emergency: "112"
    },
    "Tunisia-Spain": { 
        docs: "Valid passport required.",
        visa: "Schengen visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required for visa.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "Small tip or rounding up.",
        emergency: "112"
    },
    "Tunisia-Greece": { 
        docs: "Valid passport required.",
        visa: "Schengen visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required for visa.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "5–10% common.",
        emergency: "112"
    },
    "Tunisia-UnitedKingdom": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type G (230V)",
        currency: "Pound Sterling (£)",
        tipping: "10–12% if service not included.",
        emergency: "999 / 112"
    },
    "Tunisia-UnitedStates": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Comprehensive travel insurance recommended.",
        power: "Type A / B (120V)",
        currency: "US Dollar ($)",
        tipping: "15–20% expected.",
        emergency: "911"
    },
    "Tunisia-Canada": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (120V)",
        currency: "Canadian Dollar ($)",
        tipping: "15–20% typical.",
        emergency: "911"
    },
    "Tunisia-Australia": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type I (230V)",
        currency: "Australian Dollar ($)",
        tipping: "Not expected but appreciated.",
        emergency: "000"
    },
    "Tunisia-Japan": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (100V)",
        currency: "Japanese Yen (¥)",
        tipping: "Tipping not customary.",
        emergency: "110 / 119"
    },
    "Tunisia-Brazil": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / N (127–220V)",
        currency: "Brazilian Real (R$)",
        tipping: "10% usually included.",
        emergency: "190 / 192"
    },
    "Tunisia-Turkey": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Turkish Lira (₺)",
        tipping: "5–10% customary.",
        emergency: "112"
    },
    "Tunisia-Georgia": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Tunisia-Serbia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Tunisia-Mexico": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel (or exemption with valid US/Schengen visa).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (127V)",
        currency: "Mexican Peso ($)",
        tipping: "10–15% expected.",
        emergency: "911"
    },
    "Tunisia-SouthAfrica": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel.",
        vax: "Yellow fever certificate if arriving from risk countries.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Tunisia-Thailand": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Tunisia-UAE": { 
        docs: "Valid passport required (6 months validity recommended).",
        visa: "Visa-free or visa on arrival (short stay).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Tunisia-Argentina": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },

    "Tunisia-Bulgaria": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (EU short stay).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Tunisia-France": { 
        docs: "Valid passport required.",
        visa: "Schengen visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required for visa.",
        power: "Type C / E (230V)",
        currency: "Euro (€)",
        tipping: "Round up or leave 5–10%.",
        emergency: "112"
    },
    "Tunisia-Germany": { 
        docs: "Valid passport required.",
        visa: "Schengen visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required for visa.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "5–10% tip common.",
        emergency: "112"
    },
    "Tunisia-Italy": { 
        docs: "Valid passport required.",
        visa: "Schengen visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required for visa.",
        power: "Type C / F / L (230V)",
        currency: "Euro (€)",
        tipping: "Service charge common, small tip appreciated.",
        emergency: "112"
    },
    "Tunisia-Spain": { 
        docs: "Valid passport required.",
        visa: "Schengen visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required for visa.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "Small tip or rounding up.",
        emergency: "112"
    },
    "Tunisia-Greece": { 
        docs: "Valid passport required.",
        visa: "Schengen visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required for visa.",
        power: "Type C / F (230V)",
        currency: "Euro (€)",
        tipping: "5–10% common.",
        emergency: "112"
    },
    "Tunisia-UnitedKingdom": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type G (230V)",
        currency: "Pound Sterling (£)",
        tipping: "10–12% if service not included.",
        emergency: "999 / 112"
    },
    "Tunisia-UnitedStates": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Comprehensive travel insurance recommended.",
        power: "Type A / B (120V)",
        currency: "US Dollar ($)",
        tipping: "15–20% expected.",
        emergency: "911"
    },
    "Tunisia-Canada": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (120V)",
        currency: "Canadian Dollar ($)",
        tipping: "15–20% typical.",
        emergency: "911"
    },
    "Tunisia-Australia": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type I (230V)",
        currency: "Australian Dollar ($)",
        tipping: "Not expected but appreciated.",
        emergency: "000"
    },
    "Tunisia-Japan": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (100V)",
        currency: "Japanese Yen (¥)",
        tipping: "Tipping not customary.",
        emergency: "110 / 119"
    },
    "Tunisia-Brazil": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / N (127–220V)",
        currency: "Brazilian Real (R$)",
        tipping: "10% usually included.",
        emergency: "190 / 192"
    },
    "Tunisia-Turkey": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Turkish Lira (₺)",
        tipping: "5–10% customary.",
        emergency: "112"
    },
    "Tunisia-Georgia": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Tunisia-Serbia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Tunisia-Mexico": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel (or exemption with valid US/Schengen visa).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type A / B (127V)",
        currency: "Mexican Peso ($)",
        tipping: "10–15% expected.",
        emergency: "911"
    },
    "Tunisia-SouthAfrica": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel.",
        vax: "Yellow fever certificate if arriving from risk countries.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Tunisia-Thailand": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Tunisia-UAE": { 
        docs: "Valid passport required (6 months validity recommended).",
        visa: "Visa-free or visa on arrival (short stay).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    },
    "Tunisia-Argentina": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended.",
        power: "Type C / F (230V)",
        currency: "Local currency",
        tipping: "Small tip appreciated.",
        emergency: "112"
    }
};


window.luggageRules = {
    "Ryanair": {
        carryOn: "40 x 20 x 25 cm (10kg)",
        checkIn: "10 kg first bag - €10-20, second bag from €9",
        extra: "Strict carry-on size limits"
    },
    "EasyJet": {
        carryOn: "45 x 36 x 20 cm (up to 15kg)",
        checkIn: "Not included, from €2-30+",
        extra: "Standard carry-on policy"
    },
    "Lufthansa": {
        carryOn: "55 x 40 x 20 cm (8kg)",
        checkIn: "23 kg first bag included",
        extra: "Generous checked baggage allowance"
    },
    "Air France": {
        carryOn: "55 x 35 x 25 cm (12kg)",
        checkIn: "23 kg first bag included",
        extra: "Standard European carrier"
    },
    "British Airways": {
        carryOn: "56 x 45 x 25 cm (23kg)",
        checkIn: "20-23 kg included by class",
        extra: "Allow larger cabin baggage"
    },
    "Turkish Airlines": {
        carryOn: "55 x 40 x 20 cm (8kg)",
        checkIn: "23 kg included on most routes",
        extra: "Business and Economy available"
    },
    "Alitalia": {
        carryOn: "55 x 35 x 25 cm (10kg)",
        checkIn: "23 kg first bag included",
        extra: "Standard Italian carrier"
    },
    "Iberia": {
        carryOn: "56 x 45 x 25 cm (12kg)",
        checkIn: "23 kg included",
        extra: "Spanish carrier with good allowances"
    },
    "United Airlines": {
        carryOn: "56 x 36 x 23 cm (10kg)",
        checkIn: "23 kg included on transatlantic",
        extra: "US-based international carrier"
    },
    "American Airlines": {
        carryOn: "56 x 36 x 23 cm (10kg)",
        checkIn: "23 kg included on international",
        extra: "US-based international carrier"
    },
    "Japan Airlines": {
        carryOn: "55 x 40 x 20 cm (10kg)",
        checkIn: "23 kg included on international",
        extra: "Premium Japanese carrier"
    },
    "Thai Airways": {
        carryOn: "56 x 45 x 25 cm (7kg)",
        checkIn: "20-30 kg depending on class",
        extra: "Southeast Asian premium airline"
    },
    "Emirates": {
        carryOn: "55 x 38 x 20 cm (7kg)",
        checkIn: "23-30 kg depending on class",
        extra: "Luxury Middle Eastern carrier"
    },
    "Qantas": {
        carryOn: "56 x 36 x 23 cm (7kg)",
        checkIn: "20-30 kg on international",
        extra: "Australian premium airline"
    },
    "Latam": {
        carryOn: "55 x 35 x 25 cm (10kg)",
        checkIn: "23 kg included",
        extra: "South American carrier"
    }
};


function updateResults() {
    const fromInput = document.getElementById('originInput');
    const toInput = document.getElementById('destinationInput');
    const container = document.getElementById('results-container');
    const badge = document.getElementById('verificationBadge');

    if (!fromInput || !toInput) return;

    const from = fromInput.value.trim();
    const to = toInput.value.trim();

    // The Fix: Case-insensitive search through window.travelRules keys
    const routeKey = Object.keys(window.travelRules).find(
        k => k.toLowerCase() === `${from.toLowerCase()}-${to.toLowerCase()}`
    );
    
    const data = routeKey ? window.travelRules[routeKey] : null;

    if (data) {
        // Standard Card Updates
        document.getElementById('docsText').innerText = data.docs;
        document.getElementById('visaText').innerText = data.visa;
        document.getElementById('vaxText').innerText = data.vax;
        document.getElementById('insText').innerText = data.ins;

        // New Card Updates (Currency, Tipping, Power, Emergency)
        if(document.getElementById('currencyText')) {
            document.getElementById('currencyText').innerText = data.currency || "---";
        }
        if(document.getElementById('tippingText')) {
            document.getElementById('tippingText').innerText = data.tipping || "Select a route to view tipping customs.";
        }
        if(document.getElementById('powerText')) {
            document.getElementById('powerText').innerText = data.power || "---";
        }
        if(document.getElementById('emergencyText')) {
            document.getElementById('emergencyText').innerText = data.emergency || "---";
        }

        // Update Badge
        if(badge) {
            badge.innerHTML = `<i class="fa-solid fa-circle-check"></i> Verified for ${from} to ${to}`;
            badge.className = "badge-verified";
        }
        
        if(container) container.style.opacity = "1";

    } else if (from && to) {
        // Fallback for missing routes
        if(document.getElementById('docsText')) {
            document.getElementById('docsText').innerText = "We are currently gathering the latest requirements for this specific route.";
        }
        if(badge) {
            badge.innerHTML = `<i class="fa-solid fa-clock"></i> Updating...`;
            badge.className = "badge-update";
        }
        if(container) container.style.opacity = "1";
    }
}

window.addEventListener('load', () => {
    const params = new URLSearchParams(window.location.search);
    const fromParam = params.get('from');
    const toParam = params.get('to');

    if (fromParam && toParam) {
        const originBox = document.getElementById('originInput');
        const destBox = document.getElementById('destinationInput');
        
        if (originBox && destBox) {
            originBox.value = fromParam;
            destBox.value = toParam;
            if (typeof updateResults === 'function') updateResults();
        }
    }
});


function gatekeeper(destination) {
    if (db.currentUser) {
        window.location.href = destination;
    } else {
        localStorage.setItem('redirectAfterAuth', destination);
        window.location.href = 'auth.html';
    }
}