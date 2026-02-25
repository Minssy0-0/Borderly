// ADD THIS TO THE VERY TOP OF database.js
window.redirectToAuth = function() {
    console.log("Redirect blocked by Stylization Mode");
};

// Then, search your whole project (Ctrl+Shift+F) for "window.location.href = 'auth.html'"
// and change it to redirectToAuth();










const db = {
    users: JSON.parse(localStorage.getItem('borderly_users')) || [],
    posts: JSON.parse(localStorage.getItem('borderly_posts')) || [],
    currentUser: JSON.parse(localStorage.getItem('borderly_session')) || null
};

function saveDB() {
    localStorage.setItem('borderly_users', JSON.stringify(db.users));
    localStorage.setItem('borderly_posts', JSON.stringify(db.posts));
    localStorage.setItem('borderly_session', JSON.stringify(db.currentUser));
}

function logout() {
    db.currentUser = null;
    saveDB();
    window.location.href = 'index.html';
}

 /*to Log In*/
function loginUser(email, password) {
    const user = db.users.find(u => u.email === email && u.password === password);
    if (user) {
        db.currentUser = user;
        saveDB();
        return true;
    }
    return false;
}

/*Create a Post (Linked to Current User)*/
function createPost(content, location, priceRating, image = "") {
    if (!db.currentUser) return { success: false }; //

    const newPost = {
        id: "post_" + Date.now(), //
        userId: db.currentUser.id, //
        author: db.currentUser.username, //
        authorAvatar: db.currentUser.avatar, //
        content: content, //
        location: location, //
        price: priceRating, // 0 if none selected, 1-5 if clicked
        image: image, //
        likes: [], //
        date: new Date().toLocaleDateString() //
    };

    db.posts.unshift(newPost); //
    saveDB(); //
    return { success: true }; //
}

function registerUser(username, email, password) {
    const exists = db.users.find(u => u.email === email);
    if (exists) return { success: false, message: "Email already registered." };

    const newUser = {
        id: "user_" + Date.now(), 
        username: username,
        email: email,
        password: password,
        avatar: "images/default-user.png",
        followers: [],
        following: [], 
        posts: [],     
        bio: "Hey there! I'm using Borderly."
    };

    db.users.push(newUser);
    saveDB();
    // Auto-login after registration
    db.currentUser = newUser;
    saveDB();
    return { success: true };
}

// Inside auth.html script
function handleLogin() {
    const email = document.querySelector('#loginForm input[type="text"]').value;
    const pass = document.querySelector('#loginForm input[type="password"]').value;

    // Use the function from database.js
    if (loginUser(email, pass)) {
        window.location.href = 'index.html'; // Redirect to home
    } else {
        alert("Invalid credentials! Try: (your registered email/pass)");
    }
}













const travelRules = {
    "Spain-Turkey": {
        docs: "Passport valid for 6 months beyond entry date.",
        visa: "E-visa required for Spanish citizens. Apply online at the official portal.",
        vax: "No special vaccines required for 2026 entry.",
        ins: "Standard travel insurance with medical coverage is recommended."
    },
    "USA-France": {
        docs: "Passport must be valid for 3 months beyond your stay.",
        visa: "No Visa required for tourism under 90 days for US Citizens.",
        vax: "Standard boosters recommended.",
        ins: "Schengen visa insurance required (min €30,000 coverage)."
    }
};

// 3. The logic that updates the cards
function updateResults() {
    const fromInput = document.getElementById('originInput');
    const toInput = document.getElementById('destinationInput');
    
    if (!fromInput || !toInput) return; // Stop if we aren't on the checker page

    const from = fromInput.value;
    const to = toInput.value;
    const key = `${from}-${to}`;
    const container = document.getElementById('results-container');

    if (travelRules[key]) {
        const data = travelRules[key];
        document.getElementById('docsText').innerText = data.docs;
        document.getElementById('visaText').innerText = data.visa;
        document.getElementById('vaxText').innerText = data.vax;
        document.getElementById('insText').innerText = data.ins;
        if(container) container.style.opacity = "1";
    } else if (from && to) {
        document.getElementById('docsText').innerText = "Data for this specific route is being verified. Check back soon!";
        if(container) container.style.opacity = "1";
    }
}

// 4. Handle data coming from the Main Page URL
/*
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
            updateResults();
        }
    }
});*/
// 4. Handle data coming from the Main Page URL
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

    /* TEMPORARILY DISABLED FOR STYLIZATION:
       This was forcing you back to the login page.
    
    if (window.location.pathname.includes('profile.html') && !db.currentUser) {
        window.location.href = 'auth.html';
    }
    */
});