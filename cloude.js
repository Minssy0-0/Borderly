const navLeft = document.querySelector('.nav-left');
const cloudToggle = document.getElementById('cloudToggle');

cloudToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  navLeft.classList.toggle('open');
});

document.addEventListener('click', (e) => {
  if (!navLeft.contains(e.target)) {
    navLeft.classList.remove('open');
  }
});

