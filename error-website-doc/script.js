function goHome() {
    const baseUrl = getBaseUrl();
    window.location.href = baseUrl + '/index.html';
}
function getBaseUrl() {
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    return url.origin;
}
function displayBaseUrl() {
    const baseUrl = getBaseUrl();
    const baseUrlElement = document.getElementById('base-url');
    baseUrlElement.textContent = baseUrl;
}

window.onload = displayBaseUrl;
