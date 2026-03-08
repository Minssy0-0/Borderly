
window.addEventListener('load', () => {
    const savedName = localStorage.getItem('profileName');
    const savedBio = localStorage.getItem('profileBio');
    const savedAvatar = localStorage.getItem('profileAvatar');

    if (savedName) document.getElementById('displayUsername').innerText = savedName;
    if (savedBio) document.getElementById('displayBio').innerText = savedBio;
    if (savedAvatar && savedAvatar !== '' && savedAvatar !== 'Stock/defaultPic.webp') {
        document.getElementById('mainProfilePic').src = savedAvatar;
    } else {
        document.getElementById('mainProfilePic').src = 'Stock/defaultPic.webp';
    }
});

function openEditModal() {
    const modal = document.getElementById('editProfileModal');

    document.getElementById('editUsernameInput').value = document.getElementById('displayUsername').innerText;
    document.getElementById('editBioInput').value = document.getElementById('displayBio').innerText;
    document.getElementById('editAvatarPreview').src = document.getElementById('mainProfilePic').src;

    modal.style.display = 'flex';
}
function closeEditModal() {
    const modal = document.getElementById('editProfileModal');
    modal.style.display = 'none';
}
window.addEventListener('click', function(event) {
    const modal = document.getElementById('editProfileModal');
    if (event.target === modal) {
        closeEditModal();
    }
});
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
    const newAvatar = document.getElementById('editAvatarPreview').src;
    localStorage.setItem('profileAvatar', newAvatar);
    const navAvatar = document.getElementById('navAvatar');
    const mainProfilePic = document.getElementById('mainProfilePic');

    if (navAvatar) navAvatar.src = newAvatar;
    if (mainProfilePic) mainProfilePic.src = newAvatar;

    closeEditModal();
}

window.addEventListener('load', () => {
    const savedName = localStorage.getItem('profileName');
    const savedBio = localStorage.getItem('profileBio');
    const savedAvatar = localStorage.getItem('profileAvatar');

    if (savedName) document.getElementById('displayUsername').innerText = savedName;
    if (savedBio) document.getElementById('displayBio').innerText = savedBio;
    if (savedAvatar) document.getElementById('mainProfilePic').src = savedAvatar;
});