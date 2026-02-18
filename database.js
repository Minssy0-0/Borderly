// Initialize our "Database"
const db = {
    // Get data from LocalStorage or start with an empty list
    users: JSON.parse(localStorage.getItem('borderly_users')) || [],
    posts: JSON.parse(localStorage.getItem('borderly_posts')) || [],
    currentUser: JSON.parse(localStorage.getItem('borderly_session')) || null
};

// Function to save current state to LocalStorage
function saveDB() {
    localStorage.setItem('borderly_users', JSON.stringify(db.users));
    localStorage.setItem('borderly_posts', JSON.stringify(db.posts));
    localStorage.setItem('borderly_session', JSON.stringify(db.currentUser));
}


// This object acts as your "Virtual Database"
const db = {
    // Check browser storage for existing data, or start with an empty array []
    users: JSON.parse(localStorage.getItem('borderly_users')) || [],
    posts: JSON.parse(localStorage.getItem('borderly_posts')) || [],
    // This tracks who is currently logged in
    currentUser: JSON.parse(localStorage.getItem('borderly_session')) || null
};

// This function "saves" your changes into the browser's memory
function saveDB() {
    localStorage.setItem('borderly_users', JSON.stringify(db.users));
    localStorage.setItem('borderly_posts', JSON.stringify(db.posts));
    localStorage.setItem('borderly_session', JSON.stringify(db.currentUser));
}

// Function to log out
function logout() {
    db.currentUser = null;
    saveDB();
    window.location.href = 'index.html';
}