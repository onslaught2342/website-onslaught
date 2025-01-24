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
    if (cookieTheme) {
        return cookieTheme;
    }
    return localStorage.getItem('theme');
}
function applyTheme(theme) {
    if (theme === 'dark') {
        body.classList.add('dark-mode');
        themeToggleButton.querySelector('img').src = 'darkbulb-icon.png';
    } else {
        body.classList.remove('dark-mode');
        themeToggleButton.querySelector('img').src = 'lightbulb-icon.png';
    }
}

const savedTheme = getSavedTheme();
applyTheme(savedTheme || 'light');

themeToggleButton.addEventListener('click', () => {
    if (body.classList.contains('dark-mode')) {
        applyTheme('light');
        setCookie(cookieName, 'light', 30);
        localStorage.setItem('theme', 'light');
    } else {
        applyTheme('dark');
        setCookie(cookieName, 'dark', 30);
        localStorage.setItem('theme', 'dark');
    }
});
