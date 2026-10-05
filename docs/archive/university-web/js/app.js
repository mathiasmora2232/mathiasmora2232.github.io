function navSlide() {
    const burger = document.querySelector(".burger");
    const nav = document.querySelector(".nav-links");
    const navLinks = document.querySelectorAll(".nav-links li");
    
    burger.addEventListener("click", () => {
        //Toggle Nav
        nav.classList.toggle("nav-active");
        
        //Animate Links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = ""
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.5}s`;
            }
        });
        //Burger Animation
        burger.classList.toggle("toggle");
    });
    
}

navSlide();
// Notificaciones panel
const notificationsBtn = document.getElementById('notificationsBtn');
const notificationsPanel = document.getElementById('notificationsPanel');
const closeNotifications = document.getElementById('closeNotifications');
const tabUnread = document.getElementById('tabUnread');
const tabAll = document.getElementById('tabAll');
const unreadList = document.getElementById('unreadList');
const allList = document.getElementById('allList');


notificationsBtn.addEventListener('click', () => {
  // Si ya está visible, ciérralo
  if (notificationsPanel.style.display === 'flex') {
    notificationsPanel.style.display = 'none';
  } else {
    notificationsPanel.style.display = 'flex';
  }
});

closeNotifications.addEventListener('click', () => {
  notificationsPanel.style.display = 'none';
});

tabUnread.addEventListener('click', () => {
  tabUnread.classList.add('active');
  tabAll.classList.remove('active');
  unreadList.style.display = '';
  allList.style.display = 'none';
});

tabAll.addEventListener('click', () => {
  tabAll.classList.add('active');
  tabUnread.classList.remove('active');
  allList.style.display = '';
  unreadList.style.display = 'none';
});