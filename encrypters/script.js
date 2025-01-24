const themeToggleButton = document.getElementById('theme-toggle');
const body = document.body;
const cookieName = 'theme';

function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

function getCookie(name) {
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
}

function getSavedTheme() {
    const cookieTheme = getCookie(cookieName);
    return cookieTheme || localStorage.getItem('theme') || 'light'; // Default to light theme
}

function applyTheme(theme) {
    if (theme === 'dark') {
        body.classList.add('dark-mode');
        themeToggleButton.querySelector('i').classList.remove('fa-sun');
        themeToggleButton.querySelector('i').classList.add('fa-moon');
    } else {
        body.classList.remove('dark-mode');
        themeToggleButton.querySelector('i').classList.remove('fa-moon');
        themeToggleButton.querySelector('i').classList.add('fa-sun');
    }
}

const savedTheme = getSavedTheme();
applyTheme(savedTheme);

themeToggleButton.addEventListener('click', () => {
    const currentTheme = body.classList.contains('dark-mode') ? 'light' : 'dark';
    applyTheme(currentTheme);
    setCookie(cookieName, currentTheme, 30);
    localStorage.setItem('theme', currentTheme);
});
