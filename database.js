// ADD THIS TO THE VERY TOP OF database.js
window.redirectToAuth = function() {
    console.log("Redirect blocked by Stylization Mode");
};

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

function createPost(content, location, price, image, category) {
    if (!db.currentUser) {
        alert("You must be logged in to post!");
        return { success: false };
    }

    const newPost = {
        id: Date.now(),
        author: db.currentUser.username,
        authorAvatar: db.currentUser.profilePic || 'images/default-user.png',
        content: content,
        location: location,
        price: parseInt(price), // Ensures it's a number
        category: category,      // <--- THIS IS THE NEW LINE
        image: image,
        likes: [],
        createdAt: new Date().toISOString()
    };

    db.posts.unshift(newPost); // Adds to the top of the list
    saveDB(); // This updates your localStorage
    return { success: true, post: newPost };
}

/*Save Post to Diary*/
function saveToDiary(postId) {
    const post = db.posts.find(p => p.id === postId);
    if (!post) {
        alert("Post not found!");
        return false;
    }

    // Get existing diary items from localStorage
    let diaryItems = JSON.parse(localStorage.getItem('diary_items')) || [];
    
    // Check if post is already in diary
    const exists = diaryItems.some(item => item.id === postId);
    if (exists) {
        alert("This destination is already in your diary!");
        return false;
    }

    // Create diary item object
    const diaryItem = {
        id: postId,
        title: post.location,
        country: post.location.split(',').pop().trim() || 'Unknown',
        image: post.image || 'images/default-post.png',
        timestamp: new Date().toISOString(),
        postContent: post.content
    };

    // Add to diary and save
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
    },
    "Bulgaria-France": { 
        docs: "Valid passport or national ID card.",
        visa: "No visa required (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "European Health Insurance Card recommended."
    },
    "Bulgaria-Germany": { 
        docs: "Valid passport or national ID card.",
        visa: "Visa-free (Schengen).",
        vax: "No required vaccines.",
        ins: "EHIC recommended."
    },
    "Bulgaria-Italy": { 
        docs: "Valid passport or national ID card.",
        visa: "Visa-free (Schengen).",
        vax: "No special vaccines.",
        ins: "EHIC recommended."
    },
    "Bulgaria-Spain": { 
        docs: "Valid passport or national ID card.",
        visa: "Visa-free (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "EHIC recommended."
    },
    "Bulgaria-Greece": { 
        docs: "Valid passport or national ID card.",
        visa: "Visa-free (Schengen).",
        vax: "No required vaccines.",
        ins: "EHIC recommended."
    },
    "Bulgaria-UnitedKingdom": { 
        docs: "Valid passport required.",
        visa: "Electronic Travel Authorisation (ETA) required.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Bulgaria-UnitedStates": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Comprehensive travel insurance recommended."
    },
    "Bulgaria-Canada": { 
        docs: "Valid passport required.",
        visa: "eTA required for air travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Bulgaria-Australia": { 
        docs: "Valid passport required.",
        visa: "Visa required (eVisitor available).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Bulgaria-Japan": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Bulgaria-Brazil": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Bulgaria-Turkey": { 
        docs: "Valid passport or national ID card accepted.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Bulgaria-Georgia": { 
        docs: "Valid passport or national ID card accepted.",
        visa: "Visa-free (long stay allowed).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required."
    },
    "Bulgaria-Serbia": { 
        docs: "Valid passport or national ID card.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Bulgaria-Mexico": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Bulgaria-SouthAfrica": { 
        docs: "Valid passport required.",
        visa: "Visa required before arrival.",
        vax: "Yellow fever certificate if applicable.",
        ins: "Travel insurance recommended."
    },
    "Bulgaria-Thailand": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "Yellow fever certificate if arriving from risk areas.",
        ins: "Travel insurance recommended."
    },
    "Bulgaria-UAE": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Bulgaria-Tunisia": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Bulgaria-Argentina": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },

    "France-Bulgaria": { 
        docs: "Valid passport or national ID card.",
        visa: "Visa-free (EU free movement).",
        vax: "No mandatory vaccines.",
        ins: "European Health Insurance Card recommended."
    },
    "France-Germany": { 
        docs: "Valid passport or national ID card.",
        visa: "No visa required (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "EHIC recommended."
    },
    "France-Italy": { 
        docs: "Valid passport or national ID card.",
        visa: "Visa-free (Schengen).",
        vax: "No special vaccines.",
        ins: "EHIC recommended."
    },
    "France-Spain": { 
        docs: "Valid passport or national ID card.",
        visa: "Visa-free (Schengen).",
        vax: "No required vaccines.",
        ins: "EHIC recommended."
    },
    "France-Greece": { 
        docs: "Valid passport or national ID card.",
        visa: "Visa-free (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "EHIC recommended."
    },
    "France-UnitedKingdom": { 
        docs: "Valid passport required.",
        visa: "Electronic Travel Authorisation (ETA) required.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "France-UnitedStates": { 
        docs: "Biometric passport required.",
        visa: "ESTA required (Visa Waiver Program).",
        vax: "No mandatory vaccines.",
        ins: "Comprehensive travel insurance recommended."
    },
    "France-Canada": { 
        docs: "Valid passport required.",
        visa: "eTA required for air travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "France-Australia": { 
        docs: "Valid passport required.",
        visa: "eVisitor visa required.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "France-Japan": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "France-Brazil": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines (yellow fever recommended for some regions).",
        ins: "Travel insurance recommended."
    },
    "France-Turkey": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "France-Georgia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 1 year.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required."
    },
    "France-Serbia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "France-Mexico": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 180 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "France-SouthAfrica": { 
        docs: "Valid passport (2 blank pages recommended).",
        visa: "Visa-free up to 90 days.",
        vax: "Yellow fever certificate if arriving from risk countries.",
        ins: "Travel insurance recommended."
    },
    "France-Thailand": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "Yellow fever certificate if applicable.",
        ins: "Travel insurance recommended."
    },
    "France-UAE": { 
        docs: "Valid passport required (6 months validity recommended).",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "France-Tunisia": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "France-Argentina": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },

    "Germany-Bulgaria": { 
        docs: "Valid passport or national ID card.",
        visa: "Visa-free (EU free movement).",
        vax: "No mandatory vaccines.",
        ins: "European Health Insurance Card recommended."
    },
    "Germany-France": { 
        docs: "Valid passport or national ID card.",
        visa: "Visa-free (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "EHIC recommended."
    },
        "Germany-Italy": { 
        docs: "Valid passport or national ID card.",
        visa: "Visa-free (Schengen).",
        vax: "No special vaccines.",
        ins: "EHIC recommended."
    },
    "Germany-Spain": { 
        docs: "Valid passport or national ID card.",
        visa: "Visa-free (Schengen).",
        vax: "No required vaccines.",
        ins: "EHIC recommended."
    },
    "Germany-Greece": { 
        docs: "Valid passport or national ID card.",
        visa: "Visa-free (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "EHIC recommended."
    },
    "Germany-UnitedKingdom": { 
        docs: "Valid passport required.",
        visa: "Electronic Travel Authorisation (ETA) required.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Germany-UnitedStates": { 
        docs: "Biometric passport required.",
        visa: "ESTA required (Visa Waiver Program).",
        vax: "No mandatory vaccines.",
        ins: "Comprehensive travel insurance recommended."
    },
    "Germany-Canada": { 
        docs: "Valid passport required.",
        visa: "eTA required for air travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Germany-Australia": { 
        docs: "Valid passport required.",
        visa: "eVisitor visa required.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Germany-Japan": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Germany-Brazil": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines (yellow fever recommended for some regions).",
        ins: "Travel insurance recommended."
    },
    "Germany-Turkey": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Germany-Georgia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 1 year.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required."
    },
    "Germany-Serbia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Germany-Mexico": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 180 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Germany-SouthAfrica": { 
        docs: "Valid passport (2 blank pages recommended).",
        visa: "Visa-free up to 90 days.",
        vax: "Yellow fever certificate if arriving from risk countries.",
        ins: "Travel insurance recommended."
    },
    "Germany-Thailand": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "Yellow fever certificate if applicable.",
        ins: "Travel insurance recommended."
    },
    "Germany-UAE": { 
        docs: "Valid passport required (6 months validity recommended).",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Germany-Tunisia": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Germany-Argentina": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },

    "Italy-Bulgaria": { 
        docs: "Valid passport or national ID card.",
        visa: "Visa-free (EU free movement).",
        vax: "No mandatory vaccines.",
        ins: "European Health Insurance Card recommended."
    },
    "Italy-France": { 
        docs: "Valid passport or national ID card.",
        visa: "Visa-free (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "EHIC recommended."
    },
    "Italy-Germany": { 
        docs: "Valid passport or national ID card.",
        visa: "Visa-free (Schengen).",
        vax: "No required vaccines.",
        ins: "EHIC recommended."
    },
    "Italy-Spain": { 
        docs: "Valid passport or national ID card.",
        visa: "Visa-free (Schengen).",
        vax: "No special vaccines.",
        ins: "EHIC recommended."
    },
    "Italy-Greece": { 
        docs: "Valid passport or national ID card.",
        visa: "Visa-free (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "EHIC recommended."
    },
    "Italy-UnitedKingdom": { 
        docs: "Valid passport required.",
        visa: "Electronic Travel Authorisation (ETA) required.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Italy-UnitedStates": { 
        docs: "Biometric passport required.",
        visa: "ESTA required (Visa Waiver Program).",
        vax: "No mandatory vaccines.",
        ins: "Comprehensive travel insurance recommended."
    },
    "Italy-Canada": { 
        docs: "Valid passport required.",
        visa: "eTA required for air travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Italy-Australia": { 
        docs: "Valid passport required.",
        visa: "eVisitor visa required.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Italy-Japan": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Italy-Brazil": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines (yellow fever recommended in some regions).",
        ins: "Travel insurance recommended."
    },
    "Italy-Turkey": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Italy-Georgia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 1 year.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required."
    },
    "Italy-Serbia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Italy-Mexico": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 180 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Italy-SouthAfrica": { 
        docs: "Valid passport (2 blank pages recommended).",
        visa: "Visa-free up to 90 days.",
        vax: "Yellow fever certificate if arriving from risk countries.",
        ins: "Travel insurance recommended."
    },
    "Italy-Thailand": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "Yellow fever certificate if applicable.",
        ins: "Travel insurance recommended."
    },
    "Italy-UAE": { 
        docs: "Valid passport required (6 months validity recommended).",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Italy-Tunisia": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Italy-Argentina": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },

    "Spain-Bulgaria": { 
        docs: "Valid passport or national ID card.",
        visa: "Visa-free (EU free movement).",
        vax: "No mandatory vaccines.",
        ins: "European Health Insurance Card recommended."
    },
    "Spain-France": { 
        docs: "Valid passport or national ID card.",
        visa: "Visa-free (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "EHIC recommended."
    },
    "Spain-Germany": { 
        docs: "Valid passport or national ID card.",
        visa: "Visa-free (Schengen).",
        vax: "No required vaccines.",
        ins: "EHIC recommended."
    },
    "Spain-Italy": { 
        docs: "Valid passport or national ID card.",
        visa: "Visa-free (Schengen).",
        vax: "No special vaccines.",
        ins: "EHIC recommended."
    },
    "Spain-Greece": { 
        docs: "Valid passport or national ID card.",
        visa: "Visa-free (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "EHIC recommended."
    },
    "Spain-UnitedKingdom": { 
        docs: "Valid passport required.",
        visa: "Electronic Travel Authorisation (ETA) required.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Spain-UnitedStates": { 
        docs: "Biometric passport required.",
        visa: "ESTA required (Visa Waiver Program).",
        vax: "No mandatory vaccines.",
        ins: "Comprehensive travel insurance recommended."
    },
    "Spain-Canada": { 
        docs: "Valid passport required.",
        visa: "eTA required for air travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Spain-Australia": { 
        docs: "Valid passport required.",
        visa: "eVisitor visa required.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Spain-Japan": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Spain-Brazil": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines (yellow fever recommended in some regions).",
        ins: "Travel insurance recommended."
    },
    "Spain-Turkey": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Spain-Georgia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 1 year.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required."
    },
    "Spain-Serbia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Spain-Mexico": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 180 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Spain-SouthAfrica": { 
        docs: "Valid passport (2 blank pages recommended).",
        visa: "Visa-free up to 90 days.",
        vax: "Yellow fever certificate if arriving from risk countries.",
        ins: "Travel insurance recommended."
    },
    "Spain-Thailand": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "Yellow fever certificate if applicable.",
        ins: "Travel insurance recommended."
    },
    "Spain-UAE": { 
        docs: "Valid passport required (6 months validity recommended).",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Spain-Tunisia": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Spain-Argentina": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },

    "Greece-Bulgaria": { 
        docs: "Valid passport or national ID card.",
        visa: "Visa-free (EU free movement).",
        vax: "No mandatory vaccines.",
        ins: "European Health Insurance Card recommended."
    },
    "Greece-France": { 
        docs: "Valid passport or national ID card.",
        visa: "Visa-free (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "EHIC recommended."
    },
    "Greece-Germany": { 
        docs: "Valid passport or national ID card.",
        visa: "Visa-free (Schengen).",
        vax: "No required vaccines.",
        ins: "EHIC recommended."
    },
    "Greece-Italy": { 
        docs: "Valid passport or national ID card.",
        visa: "Visa-free (Schengen).",
        vax: "No special vaccines.",
        ins: "EHIC recommended."
    },
    "Greece-Spain": { 
        docs: "Valid passport or national ID card.",
        visa: "Visa-free (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "EHIC recommended."
    },
    "Greece-UnitedKingdom": { 
        docs: "Valid passport required.",
        visa: "Electronic Travel Authorisation (ETA) required.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Greece-UnitedStates": { 
        docs: "Biometric passport required.",
        visa: "ESTA required (Visa Waiver Program).",
        vax: "No mandatory vaccines.",
        ins: "Comprehensive travel insurance recommended."
    },
    "Greece-Canada": { 
        docs: "Valid passport required.",
        visa: "eTA required for air travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Greece-Australia": { 
        docs: "Valid passport required.",
        visa: "eVisitor visa required.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Greece-Japan": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Greece-Brazil": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines (yellow fever recommended in some regions).",
        ins: "Travel insurance recommended."
    },
    "Greece-Turkey": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Greece-Georgia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 1 year.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required."
    },
    "Greece-Serbia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Greece-Mexico": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 180 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Greece-SouthAfrica": { 
        docs: "Valid passport (2 blank pages recommended).",
        visa: "Visa-free up to 90 days.",
        vax: "Yellow fever certificate if arriving from risk countries.",
        ins: "Travel insurance recommended."
    },
    "Greece-Thailand": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "Yellow fever certificate if applicable.",
        ins: "Travel insurance recommended."
    },
    "Greece-UAE": { 
        docs: "Valid passport required (6 months validity recommended).",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Greece-Tunisia": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Greece-Argentina": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },

    "UnitedKingdom-Bulgaria": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (EU short stay).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "UnitedKingdom-France": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen short stay).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "UnitedKingdom-Germany": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "UnitedKingdom-Italy": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "UnitedKingdom-Spain": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "UnitedKingdom-Greece": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "UnitedKingdom-UnitedStates": { 
        docs: "Valid biometric passport required.",
        visa: "ESTA required (Visa Waiver Program).",
        vax: "No mandatory vaccines.",
        ins: "Comprehensive travel insurance recommended."
    },
    "UnitedKingdom-Canada": { 
        docs: "Valid passport required.",
        visa: "eTA required for air travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "UnitedKingdom-Australia": { 
        docs: "Valid passport required.",
        visa: "ETA or eVisitor required.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "UnitedKingdom-Japan": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay (up to 90 days).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "UnitedKingdom-Brazil": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines (yellow fever recommended for some regions).",
        ins: "Travel insurance recommended."
    },
    "UnitedKingdom-Turkey": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "UnitedKingdom-Georgia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 1 year.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required."
    },
    "UnitedKingdom-Serbia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "UnitedKingdom-Mexico": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 180 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "UnitedKingdom-SouthAfrica": { 
        docs: "Valid passport required (2 blank pages recommended).",
        visa: "Visa-free up to 90 days.",
        vax: "Yellow fever certificate if arriving from risk areas.",
        ins: "Travel insurance recommended."
    },
    "UnitedKingdom-Thailand": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "Yellow fever certificate if applicable.",
        ins: "Travel insurance recommended."
    },
    "UnitedKingdom-UAE": { 
        docs: "Valid passport required (6 months validity recommended).",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "UnitedKingdom-Tunisia": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "UnitedKingdom-Argentina": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },

    "UnitedStates-Bulgaria": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (EU short stay).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "UnitedStates-France": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen short stay).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "UnitedStates-Germany": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "UnitedStates-Italy": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "UnitedStates-Spain": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "UnitedStates-Greece": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "UnitedStates-UnitedKingdom": { 
        docs: "Valid passport required.",
        visa: "Electronic Travel Authorisation (ETA) required.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "UnitedStates-Canada": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay (tourism/business).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "UnitedStates-Australia": { 
        docs: "Valid passport required.",
        visa: "ETA required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "UnitedStates-Japan": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "UnitedStates-Brazil": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay (tourism).",
        vax: "No mandatory vaccines (yellow fever recommended in some regions).",
        ins: "Travel insurance recommended."
    },
    "UnitedStates-Turkey": { 
        docs: "Valid passport required.",
        visa: "e-Visa required before arrival.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "UnitedStates-Georgia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 1 year.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "UnitedStates-Serbia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "UnitedStates-Mexico": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay (tourism).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "UnitedStates-SouthAfrica": { 
        docs: "Valid passport required (2 blank pages recommended).",
        visa: "Visa-free up to 90 days.",
        vax: "Yellow fever certificate if arriving from risk countries.",
        ins: "Travel insurance recommended."
    },
    "UnitedStates-Thailand": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "Yellow fever certificate if applicable.",
        ins: "Travel insurance recommended."
    },
    "UnitedStates-UAE": { 
        docs: "Valid passport required (6 months validity recommended).",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "UnitedStates-Tunisia": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "UnitedStates-Argentina": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },

    "Canada-Bulgaria": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (EU short stay).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Canada-France": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Canada-Germany": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Canada-Italy": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Canada-Spain": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Canada-Greece": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Canada-UnitedKingdom": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay (tourism/business).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Canada-UnitedStates": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay (tourism/business).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Canada-Australia": { 
        docs: "Valid passport required.",
        visa: "ETA or eVisitor required.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Canada-Japan": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Canada-Brazil": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay (tourism).",
        vax: "No mandatory vaccines (yellow fever recommended for some regions).",
        ins: "Travel insurance recommended."
    },
    "Canada-Turkey": { 
        docs: "Valid passport required.",
        visa: "e-Visa required before arrival.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Canada-Georgia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 1 year.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Canada-Serbia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Canada-Mexico": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay (tourism).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Canada-SouthAfrica": { 
        docs: "Valid passport required (2 blank pages recommended).",
        visa: "Visa-free up to 90 days.",
        vax: "Yellow fever certificate if arriving from risk countries.",
        ins: "Travel insurance recommended."
    },
    "Canada-Thailand": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "Yellow fever certificate if applicable.",
        ins: "Travel insurance recommended."
    },
    "Canada-UAE": { 
        docs: "Valid passport required (6 months validity recommended).",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Canada-Tunisia": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Canada-Argentina": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    }, 

    "Australia-Bulgaria": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (EU short stay).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Australia-France": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Australia-Germany": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Australia-Italy": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Australia-Spain": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Australia-Greece": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Australia-UnitedKingdom": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay (tourism/business).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Australia-UnitedStates": { 
        docs: "Valid passport required.",
        visa: "ESTA required (Visa Waiver Program).",
        vax: "No mandatory vaccines.",
        ins: "Comprehensive travel insurance recommended."
    },
    "Australia-Canada": { 
        docs: "Valid passport required.",
        visa: "eTA required for air travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Australia-Japan": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Australia-Brazil": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay (tourism).",
        vax: "No mandatory vaccines (yellow fever recommended in some regions).",
        ins: "Travel insurance recommended."
    },
    "Australia-Turkey": { 
        docs: "Valid passport required.",
        visa: "e-Visa required before arrival.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Australia-Georgia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 1 year.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Australia-Serbia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Australia-Mexico": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay (tourism).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Australia-SouthAfrica": { 
        docs: "Valid passport required (2 blank pages recommended).",
        visa: "Visa-free up to 90 days.",
        vax: "Yellow fever certificate if arriving from risk countries.",
        ins: "Travel insurance recommended."
    },
    "Australia-Thailand": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "Yellow fever certificate if applicable.",
        ins: "Travel insurance recommended."
    },
    "Australia-UAE": { 
        docs: "Valid passport required (6 months validity recommended).",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Australia-Tunisia": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Australia-Argentina": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },

    "Japan-Bulgaria": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (EU short stay).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Japan-France": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Japan-Germany": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Japan-Italy": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Japan-Spain": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Japan-Greece": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Japan-UnitedKingdom": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay (tourism/business).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Japan-UnitedStates": { 
        docs: "Valid passport required.",
        visa: "ESTA required (Visa Waiver Program).",
        vax: "No mandatory vaccines.",
        ins: "Comprehensive travel insurance recommended."
    },
    "Japan-Canada": { 
        docs: "Valid passport required.",
        visa: "eTA required for air travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Japan-Australia": { 
        docs: "Valid passport required.",
        visa: "ETA or eVisitor required.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Japan-Brazil": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay (tourism).",
        vax: "No mandatory vaccines (yellow fever recommended in some regions).",
        ins: "Travel insurance recommended."
    },
    "Japan-Turkey": { 
        docs: "Valid passport required.",
        visa: "e-Visa required before arrival.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Japan-Georgia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 1 year.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Japan-Serbia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Japan-Mexico": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay (tourism).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Japan-SouthAfrica": { 
        docs: "Valid passport required (2 blank pages recommended).",
        visa: "Visa-free up to 90 days.",
        vax: "Yellow fever certificate if arriving from risk countries.",
        ins: "Travel insurance recommended."
    },
    "Japan-Thailand": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "Yellow fever certificate if applicable.",
        ins: "Travel insurance recommended."
    },
    "Japan-UAE": { 
        docs: "Valid passport required (6 months validity recommended).",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Japan-Tunisia": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Japan-Argentina": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },

    "Brazil-Bulgaria": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (EU short stay).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Brazil-France": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Brazil-Germany": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Brazil-Italy": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Brazil-Spain": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Brazil-Greece": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Brazil-UnitedKingdom": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay (tourism/business).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Brazil-UnitedStates": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Comprehensive travel insurance recommended."
    },
    "Brazil-Canada": { 
        docs: "Valid passport required.",
        visa: "eTA required for air travel (if eligible) or visa.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Brazil-Australia": { 
        docs: "Valid passport required.",
        visa: "eVisitor/ETA required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Brazil-Japan": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay (tourism).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Brazil-Turkey": { 
        docs: "Valid passport required.",
        visa: "e-Visa required before arrival.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Brazil-Georgia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 1 year.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Brazil-Serbia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Brazil-Mexico": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel (or visa exemption if holding valid US/Schengen visa).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Brazil-SouthAfrica": { 
        docs: "Valid passport required (2 blank pages recommended).",
        visa: "Visa-free up to 90 days.",
        vax: "Yellow fever certificate recommended/required if applicable.",
        ins: "Travel insurance recommended."
    },
    "Brazil-Thailand": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "Yellow fever certificate may be required if arriving from risk areas.",
        ins: "Travel insurance recommended."
    },
    "Brazil-UAE": { 
        docs: "Valid passport required (6 months validity recommended).",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Brazil-Tunisia": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Brazil-Argentina": { 
        docs: "Valid passport or national ID card accepted (Mercosur travel).",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },

    "Turkey-Bulgaria": { 
        docs: "Valid passport or national ID card accepted.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Turkey-France": { 
        docs: "Valid passport required.",
        visa: "Schengen visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required for visa."
    },
    "Turkey-Germany": { 
        docs: "Valid passport required.",
        visa: "Schengen visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required for visa."
    },
    "Turkey-Italy": { 
        docs: "Valid passport required.",
        visa: "Schengen visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required for visa."
    },
    "Turkey-Spain": { 
        docs: "Valid passport required.",
        visa: "Schengen visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required for visa."
    },
    "Turkey-Greece": { 
        docs: "Valid passport required.",
        visa: "Schengen visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required for visa."
    },
    "Turkey-UnitedKingdom": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Turkey-UnitedStates": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Comprehensive travel insurance recommended."
    },
    "Turkey-Canada": { 
        docs: "Valid passport required.",
        visa: "Visa required (or eTA if eligible with visa/PR).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Turkey-Australia": { 
        docs: "Valid passport required.",
        visa: "eVisitor/ETA or visa required.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Turkey-Japan": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay (tourism).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Turkey-Brazil": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Turkey-Georgia": { 
        docs: "Valid passport or national ID card accepted.",
        visa: "Visa-free.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Turkey-Serbia": { 
        docs: "Valid passport or national ID card accepted.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Turkey-Mexico": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel (or exemption if holding US/Schengen visa).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Turkey-SouthAfrica": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel.",
        vax: "Yellow fever certificate if arriving from risk countries.",
        ins: "Travel insurance recommended."
    },
    "Turkey-Thailand": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "Yellow fever certificate if applicable.",
        ins: "Travel insurance recommended."
    },
    "Turkey-UAE": { 
        docs: "Valid passport required (6 months validity recommended).",
        visa: "Visa-free or visa on arrival (short stay).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Turkey-Tunisia": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Turkey-Argentina": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },

    "Georgia-Bulgaria": { 
        docs: "Valid passport or national ID card accepted.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required."
    },
    "Georgia-France": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen short stay).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Georgia-Germany": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Georgia-Italy": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Georgia-Spain": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Georgia-Greece": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Georgia-UnitedKingdom": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay (tourism).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Georgia-UnitedStates": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Comprehensive travel insurance recommended."
    },
    "Georgia-Canada": { 
        docs: "Valid passport required.",
        visa: "Visa required (or eTA if eligible with visa/PR).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Georgia-Australia": { 
        docs: "Valid passport required.",
        visa: "Visa or ETA required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Georgia-Japan": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Georgia-Brazil": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Georgia-Turkey": { 
        docs: "Valid passport or national ID card accepted.",
        visa: "Visa-free.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Georgia-Serbia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Georgia-Mexico": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel (or exemption if holding US/Schengen visa).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Georgia-SouthAfrica": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel.",
        vax: "Yellow fever certificate if arriving from risk countries.",
        ins: "Travel insurance recommended."
    },
    "Georgia-Thailand": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "Yellow fever certificate if applicable.",
        ins: "Travel insurance recommended."
    },
    "Georgia-UAE": { 
        docs: "Valid passport required (6 months validity recommended).",
        visa: "Visa-free or visa on arrival (short stay).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Georgia-Tunisia": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Georgia-Argentina": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },

    "Serbia-Bulgaria": { 
        docs: "Valid passport or national ID card accepted.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Serbia-France": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen short stay).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Serbia-Germany": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Serbia-Italy": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Serbia-Spain": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Serbia-Greece": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Serbia-UnitedKingdom": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay (tourism/business).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Serbia-UnitedStates": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Comprehensive travel insurance recommended."
    },
    "Serbia-Canada": { 
        docs: "Valid passport required.",
        visa: "Visa required (or eTA if eligible with visa/PR).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Serbia-Australia": { 
        docs: "Valid passport required.",
        visa: "Visa or ETA required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Serbia-Japan": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Serbia-Brazil": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Serbia-Turkey": { 
        docs: "Valid passport or national ID card accepted.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Serbia-Georgia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 1 year.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Serbia-Mexico": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel (or exemption with valid US/Schengen visa).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Serbia-SouthAfrica": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel.",
        vax: "Yellow fever certificate if arriving from risk countries.",
        ins: "Travel insurance recommended."
    },
    "Serbia-Thailand": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "Yellow fever certificate if applicable.",
        ins: "Travel insurance recommended."
    },
    "Serbia-UAE": { 
        docs: "Valid passport required (6 months validity recommended).",
        visa: "Visa-free or visa on arrival (short stay).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Serbia-Tunisia": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Serbia-Argentina": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },

    "Mexico-Bulgaria": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (EU short stay).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Mexico-France": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen short stay).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Mexico-Germany": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Mexico-Italy": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Mexico-Spain": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Mexico-Greece": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Mexico-UnitedKingdom": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay (tourism/business).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Mexico-UnitedStates": { 
        docs: "Valid passport required.",
        visa: "Visa required (B1/B2) unless holding US status/waiver eligibility.",
        vax: "No mandatory vaccines.",
        ins: "Comprehensive travel insurance recommended."
    },
    "Mexico-Canada": { 
        docs: "Valid passport required.",
        visa: "eTA required for air travel (if eligible) or visa.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Mexico-Australia": { 
        docs: "Valid passport required.",
        visa: "ETA or visitor visa required.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Mexico-Japan": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay (tourism).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Mexico-Brazil": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay (tourism).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Mexico-Turkey": { 
        docs: "Valid passport required.",
        visa: "e-Visa required before arrival.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Mexico-Georgia": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Mexico-Serbia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Mexico-SouthAfrica": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel.",
        vax: "Yellow fever certificate if arriving from risk countries.",
        ins: "Travel insurance recommended."
    },
    "Mexico-Thailand": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "Yellow fever certificate if applicable.",
        ins: "Travel insurance recommended."
    },
    "Mexico-UAE": { 
        docs: "Valid passport required (6 months validity recommended).",
        visa: "Visa-free or visa on arrival (short stay).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Mexico-Tunisia": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Mexico-Argentina": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },

    "SouthAfrica-Bulgaria": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (EU short stay).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "SouthAfrica-France": { 
        docs: "Valid passport required.",
        visa: "Schengen visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required for visa."
    },
    "SouthAfrica-Germany": { 
        docs: "Valid passport required.",
        visa: "Schengen visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required for visa."
    },
    "SouthAfrica-Italy": { 
        docs: "Valid passport required.",
        visa: "Schengen visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required for visa."
    },
    "SouthAfrica-Spain": { 
        docs: "Valid passport required.",
        visa: "Schengen visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required for visa."
    },
    "SouthAfrica-Greece": { 
        docs: "Valid passport required.",
        visa: "Schengen visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required for visa."
    },
    "SouthAfrica-UnitedKingdom": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay (tourism/business).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "SouthAfrica-UnitedStates": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Comprehensive travel insurance recommended."
    },
    "SouthAfrica-Canada": { 
        docs: "Valid passport required.",
        visa: "Visa required (or eTA if eligible with visa/PR).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "SouthAfrica-Australia": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "SouthAfrica-Japan": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay (tourism).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "SouthAfrica-Brazil": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "Yellow fever certificate may be required depending on travel history.",
        ins: "Travel insurance recommended."
    },
    "SouthAfrica-Turkey": { 
        docs: "Valid passport required.",
        visa: "e-Visa required before arrival.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "SouthAfrica-Georgia": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "SouthAfrica-Serbia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "SouthAfrica-Mexico": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel (or exemption with valid US/Schengen visa).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "SouthAfrica-Thailand": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "Yellow fever certificate if arriving from risk countries.",
        ins: "Travel insurance recommended."
    },
    "SouthAfrica-UAE": { 
        docs: "Valid passport required (6 months validity recommended).",
        visa: "Visa-free or visa on arrival (short stay).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "SouthAfrica-Tunisia": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "SouthAfrica-Argentina": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },

    "Thailand-Bulgaria": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (EU short stay).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Thailand-France": { 
        docs: "Valid passport required.",
        visa: "Schengen visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required for visa."
    },
    "Thailand-Germany": { 
        docs: "Valid passport required.",
        visa: "Schengen visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required for visa."
    },
    "Thailand-Italy": { 
        docs: "Valid passport required.",
        visa: "Schengen visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required for visa."
    },
    "Thailand-Spain": { 
        docs: "Valid passport required.",
        visa: "Schengen visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required for visa."
    },
    "Thailand-Greece": { 
        docs: "Valid passport required.",
        visa: "Schengen visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required for visa."
    },
    "Thailand-UnitedKingdom": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay (tourism).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Thailand-UnitedStates": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Comprehensive travel insurance recommended."
    },
    "Thailand-Canada": { 
        docs: "Valid passport required.",
        visa: "Visa required (or eTA if eligible with visa/PR).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Thailand-Australia": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay or ETA required depending on duration.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Thailand-Japan": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay (tourism).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Thailand-Brazil": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "Yellow fever certificate may be required if arriving from risk areas.",
        ins: "Travel insurance recommended."
    },
    "Thailand-Turkey": { 
        docs: "Valid passport required.",
        visa: "e-Visa or visa on arrival depending on stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Thailand-Georgia": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Thailand-Serbia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Thailand-Mexico": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel (or exemption with valid US/Schengen visa).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Thailand-SouthAfrica": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel.",
        vax: "Yellow fever certificate if arriving from risk countries.",
        ins: "Travel insurance recommended."
    },
    "Thailand-UAE": { 
        docs: "Valid passport required (6 months validity recommended).",
        visa: "Visa-free or visa on arrival (short stay).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Thailand-Tunisia": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Thailand-Argentina": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },

    "UAE-Bulgaria": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (EU short stay).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "UAE-France": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "UAE-Germany": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "UAE-Italy": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "UAE-Spain": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "UAE-Greece": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (Schengen).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "UAE-UnitedKingdom": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay (tourism/business).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "UAE-UnitedStates": { 
        docs: "Valid passport required.",
        visa: "ESTA required (Visa Waiver Program).",
        vax: "No mandatory vaccines.",
        ins: "Comprehensive travel insurance recommended."
    },
    "UAE-Canada": { 
        docs: "Valid passport required.",
        visa: "eTA required for air travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "UAE-Australia": { 
        docs: "Valid passport required.",
        visa: "ETA or eVisitor required.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "UAE-Japan": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "UAE-Brazil": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines (yellow fever recommended in some regions).",
        ins: "Travel insurance recommended."
    },
    "UAE-Turkey": { 
        docs: "Valid passport required.",
        visa: "Visa-free or visa on arrival (short stay).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "UAE-Georgia": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "UAE-Serbia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "UAE-Mexico": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel (or exemption with valid US/Schengen visa).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "UAE-SouthAfrica": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "Yellow fever certificate if arriving from risk countries.",
        ins: "Travel insurance recommended."
    },
    "UAE-Thailand": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "UAE-Tunisia": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "UAE-Argentina": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },

    "Tunisia-Bulgaria": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (EU short stay).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Tunisia-France": { 
        docs: "Valid passport required.",
        visa: "Schengen visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required for visa."
    },
    "Tunisia-Germany": { 
        docs: "Valid passport required.",
        visa: "Schengen visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required for visa."
    },
    "Tunisia-Italy": { 
        docs: "Valid passport required.",
        visa: "Schengen visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required for visa."
    },
    "Tunisia-Spain": { 
        docs: "Valid passport required.",
        visa: "Schengen visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required for visa."
    },
    "Tunisia-Greece": { 
        docs: "Valid passport required.",
        visa: "Schengen visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required for visa."
    },
    "Tunisia-UnitedKingdom": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Tunisia-UnitedStates": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Comprehensive travel insurance recommended."
    },
    "Tunisia-Canada": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Tunisia-Australia": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Tunisia-Japan": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Tunisia-Brazil": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Tunisia-Turkey": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Tunisia-Georgia": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Tunisia-Serbia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Tunisia-Mexico": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel (or exemption with valid US/Schengen visa).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Tunisia-SouthAfrica": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel.",
        vax: "Yellow fever certificate if arriving from risk countries.",
        ins: "Travel insurance recommended."
    },
    "Tunisia-Thailand": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Tunisia-UAE": { 
        docs: "Valid passport required (6 months validity recommended).",
        visa: "Visa-free or visa on arrival (short stay).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Tunisia-Argentina": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },

    "Tunisia-Bulgaria": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days (EU short stay).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Tunisia-France": { 
        docs: "Valid passport required.",
        visa: "Schengen visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required for visa."
    },
    "Tunisia-Germany": { 
        docs: "Valid passport required.",
        visa: "Schengen visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required for visa."
    },
    "Tunisia-Italy": { 
        docs: "Valid passport required.",
        visa: "Schengen visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required for visa."
    },
    "Tunisia-Spain": { 
        docs: "Valid passport required.",
        visa: "Schengen visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required for visa."
    },
    "Tunisia-Greece": { 
        docs: "Valid passport required.",
        visa: "Schengen visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance required for visa."
    },
    "Tunisia-UnitedKingdom": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Tunisia-UnitedStates": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Comprehensive travel insurance recommended."
    },
    "Tunisia-Canada": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Tunisia-Australia": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Tunisia-Japan": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Tunisia-Brazil": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Tunisia-Turkey": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Tunisia-Georgia": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Tunisia-Serbia": { 
        docs: "Valid passport required.",
        visa: "Visa-free up to 90 days.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Tunisia-Mexico": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel (or exemption with valid US/Schengen visa).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Tunisia-SouthAfrica": { 
        docs: "Valid passport required.",
        visa: "Visa required before travel.",
        vax: "Yellow fever certificate if arriving from risk countries.",
        ins: "Travel insurance recommended."
    },
    "Tunisia-Thailand": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Tunisia-UAE": { 
        docs: "Valid passport required (6 months validity recommended).",
        visa: "Visa-free or visa on arrival (short stay).",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    },
    "Tunisia-Argentina": { 
        docs: "Valid passport required.",
        visa: "Visa-free short stay.",
        vax: "No mandatory vaccines.",
        ins: "Travel insurance recommended."
    }
};

// Luggage Rules by Airline
const luggageRules = {
    "Ryanair": {
        cabin: "40 x 20 x 25 cm (10kg)",
        checked: "10 kg first bag - €10-20, second bag from €9",
        description: "Strict carry-on size limits"
    },
    "EasyJet": {
        cabin: "45 x 36 x 20 cm (up to 15kg)",
        checked: "Not included, from €2-30+",
        description: "Standard carry-on policy"
    },
    "Lufthansa": {
        cabin: "55 x 40 x 20 cm (8kg)",
        checked: "23 kg first bag included",
        description: "Generous checked baggage allowance"
    },
    "Air France": {
        cabin: "55 x 35 x 25 cm (12kg)",
        checked: "23 kg first bag included",
        description: "Standard European carrier"
    },
    "British Airways": {
        cabin: "56 x 45 x 25 cm (23kg)",
        checked: "20-23 kg included by class",
        description: "Allow larger cabin baggage"
    },
    "Turkish Airlines": {
        cabin: "55 x 40 x 20 cm (8kg)",
        checked: "23 kg included on most routes",
        description: "Business and Economy available"
    },
    "Alitalia": {
        cabin: "55 x 35 x 25 cm (10kg)",
        checked: "23 kg first bag included",
        description: "Standard Italian carrier"
    },
    "Iberia": {
        cabin: "56 x 45 x 25 cm (12kg)",
        checked: "23 kg included",
        description: "Spanish carrier with good allowances"
    },
    "United Airlines": {
        cabin: "56 x 36 x 23 cm (10kg)",
        checked: "23 kg included on transatlantic",
        description: "US-based international carrier"
    },
    "American Airlines": {
        cabin: "56 x 36 x 23 cm (10kg)",
        checked: "23 kg included on international",
        description: "US-based international carrier"
    },
    "Japan Airlines": {
        cabin: "55 x 40 x 20 cm (10kg)",
        checked: "23 kg included on international",
        description: "Premium Japanese carrier"
    },
    "Thai Airways": {
        cabin: "56 x 45 x 25 cm (7kg)",
        checked: "20-30 kg depending on class",
        description: "Southeast Asian premium airline"
    },
    "Emirates": {
        cabin: "55 x 38 x 20 cm (7kg)",
        checked: "23-30 kg depending on class",
        description: "Luxury Middle Eastern carrier"
    },
    "Qantas": {
        cabin: "56 x 36 x 23 cm (7kg)",
        checked: "20-30 kg on international",
        description: "Australian premium airline"
    },
    "Latam": {
        cabin: "55 x 35 x 25 cm (10kg)",
        checked: "23 kg included",
        description: "South American carrier"
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