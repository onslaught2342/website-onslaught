const themeToggleButton = document.getElementById('theme-toggle');
const body = document.body;

// Check if there's a saved theme preference in localStorage
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    themeToggleButton.querySelector('img').src = 'darkbulb-icon.png';
}

themeToggleButton.addEventListener('click', () => {
    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        themeToggleButton.querySelector('img').src = 'lightbulb-icon.png';
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.add('dark-mode');
        themeToggleButton.querySelector('img').src = 'darkbulb-icon.png';
        localStorage.setItem('theme', 'dark');
    }
});
