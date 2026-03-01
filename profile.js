// Load saved data on page startup
window.addEventListener('load', () => {
    const savedName = localStorage.getItem('profileName');
    const savedBio = localStorage.getItem('profileBio');
    const savedAvatar = localStorage.getItem('profileAvatar');

    if (savedName) document.getElementById('displayUsername').innerText = savedName;
    if (savedBio) document.getElementById('displayBio').innerText = savedBio;
    // Use Stock/defaultPic.webp if no avatar or avatar is empty/unchanged
    if (savedAvatar && savedAvatar !== '' && savedAvatar !== 'Stock/defaultPic.webp') {
        document.getElementById('mainProfilePic').src = savedAvatar;
    } else {
        document.getElementById('mainProfilePic').src = 'Stock/defaultPic.webp';
    }
});

function openEditModal() {
    const modal = document.getElementById('editProfileModal');
    
    // 1. Pre-fill the inputs with what is currently on the page
    document.getElementById('editUsernameInput').value = document.getElementById('displayUsername').innerText;
    
    const currentBio = document.getElementById('displayBio').innerText;
    document.getElementById('editBioInput').value = (currentBio.includes("No bio added")) ? "" : currentBio;
    
    document.getElementById('editAvatarPreview').src = document.getElementById('mainProfilePic').src;

    modal.style.display = 'flex';
}

function closeEditModal() {
    document.getElementById('editProfileModal').style.display = 'none';
}

// Handle local photo upload for avatar
document.getElementById('avatarInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            document.getElementById('editAvatarPreview').src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

function saveProfile() {
    const newName = document.getElementById('editUsernameInput').value;
    const newBio = document.getElementById('editBioInput').value;
    const newAvatar = document.getElementById('editAvatarPreview').src;

    // 1. Update the UI
    document.getElementById('displayUsername').innerText = newName;
    document.getElementById('displayBio').innerText = newBio || "No bio added yet. Tell us about your adventures!";
    document.getElementById('mainProfilePic').src = newAvatar;

    // 2. Save to LocalStorage so it stays after refresh
    localStorage.setItem('profileName', newName);
    localStorage.setItem('profileBio', newBio);
    localStorage.setItem('profileAvatar', newAvatar);

    closeEditModal();
}

// 4. Load data automatically when page opens
window.addEventListener('load', () => {
    const savedName = localStorage.getItem('profileName');
    const savedBio = localStorage.getItem('profileBio');
    const savedAvatar = localStorage.getItem('profileAvatar');

    if (savedName) document.getElementById('displayUsername').innerText = savedName;
    if (savedBio) document.getElementById('displayBio').innerText = savedBio;
    if (savedAvatar) document.getElementById('mainProfilePic').src = savedAvatar;
});