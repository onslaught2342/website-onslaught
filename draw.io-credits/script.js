document.getElementById('okayButton').onclick = function() {
    alert("Thank you for acknowledging the credits! You will be redirected shortly.");
    setTimeout(function() {
        window.location.href = '/draw.io';
    }, 1000);
};

document.getElementById('declineButton').onclick = function() {
    alert("You have declined to acknowledge the credits. You will be redirected to the homepage.");
    setTimeout(function() {
        window.location.href = '/';
    }, 1000);
};
