const encryptButton = document.getElementById('encryptButton');
const decryptButton = document.getElementById('decryptButton');
const generateKeysButton = document.getElementById('generateKeysButton');
const downloadKeysButton = document.getElementById('downloadKeysButton');
const loadPublicKeyFile = document.getElementById('loadPublicKeyFile');
const loadPrivateKeyFile = document.getElementById('loadPrivateKeyFile');
const passphraseInput = document.getElementById('passphrase');
const setPassphraseButton = document.getElementById('setPassphraseButton');
const keyMessage = document.getElementById('keyMessage');
const passphraseMessage = document.getElementById('passphraseMessage');
window.onload = function() {
    const publicKey = getCookie('publicKey');
    const privateKey = getCookie('privateKey');
    
    if (publicKey) {
        document.getElementById('publicKey').value = publicKey;
    }
    
    if (privateKey) {
        document.getElementById('privateKey').value = privateKey;
    }
};

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    const name = cname + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
generateKeysButton.addEventListener('click', function() {
    const crypt = new JSEncrypt();
    crypt.getKey();
    const publicKey = crypt.getPublicKey();
    const privateKey = crypt.getPrivateKey();
    setCookie('publicKey', publicKey, 30);
    setCookie('privateKey', privateKey, 30);
    
    document.getElementById('publicKey').value = publicKey;
    document.getElementById('privateKey').value = privateKey;
    keyMessage.innerHTML = "RSA keys generated and stored in cookies!";

    downloadKeysButton.style.display = 'inline-block';
});
downloadKeysButton.addEventListener('click', function() {
    const publicKey = document.getElementById('publicKey').value;
    const privateKey = document.getElementById('privateKey').value;
    const publicBlob = new Blob([publicKey], { type: 'text/plain' });
    const privateBlob = new Blob([privateKey], { type: 'text/plain' });
    const publicUrl = URL.createObjectURL(publicBlob);
    const privateUrl = URL.createObjectURL(privateBlob);
    const publicLink = document.createElement('a');
    publicLink.href = publicUrl;
    publicLink.download = 'publicKey.txt';
    document.body.appendChild(publicLink);
    publicLink.click();
    document.body.removeChild(publicLink);
    URL.revokeObjectURL(publicUrl);
    const privateLink = document.createElement('a');
    privateLink.href = privateUrl;
    privateLink.download = 'privateKey.txt';
    document.body.appendChild(privateLink);
    privateLink.click();
    document.body.removeChild(privateLink);
    URL.revokeObjectURL(privateUrl);
});
loadPublicKeyFile.addEventListener('change', function() {
    const reader = new FileReader();
    reader.onload = function(event) {
        document.getElementById('publicKey').value = event.target.result;
        setCookie('publicKey', event.target.result, 30); // Store in cookie
        keyMessage.innerHTML = "Public key loaded from file!";
    };
    reader.readAsText(this.files[0]);
});

loadPrivateKeyFile.addEventListener('change', function() {
    const reader = new FileReader();
    reader.onload = function(event) {
        document.getElementById('privateKey').value = event.target.result;
        setCookie('privateKey', event.target.result, 30); // Store in cookie
        keyMessage.innerHTML = "Private key loaded from file!";
    };
    reader.readAsText(this.files[0]);
});

setPassphraseButton.addEventListener('click', function() {
    const passphrase = passphraseInput.value;
    if (passphrase) {
        passphraseMessage.innerHTML = "Passphrase set successfully!";
    } else {
        passphraseMessage.innerHTML = "No passphrase set.";
    }
});
encryptButton.addEventListener('click', function() {
    const fileInput = document.getElementById('fileInput');
    const publicKey = document.getElementById('publicKey').value;
    const messageBox = document.getElementById('encryptMessage');
    
    messageBox.innerHTML = "";

    if (fileInput.files.length === 0 || !publicKey) {
        messageBox.innerHTML = "Please select a file and paste the public key.";
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(event) {
        const fileContent = event.target.result;
        const crypt = new JSEncrypt();
        crypt.setPublicKey(publicKey);
        const encrypted = crypt.encrypt(fileContent);

        if (!encrypted) {
            messageBox.innerHTML = "Encryption failed. Invalid public key.";
            return;
        }
        const blob = new Blob([encrypted], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name + '.enc';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        messageBox.innerHTML = "File encrypted successfully! Download it.";
    };

    reader.readAsText(file);
});
decryptButton.addEventListener('click', function() {
    const fileInputDecrypt = document.getElementById('fileInputDecrypt');
    const privateKey = document.getElementById('privateKey').value;
    const messageBox = document.getElementById('decryptMessage');
    
    messageBox.innerHTML = "";

    if (fileInputDecrypt.files.length === 0 || !privateKey) {
        messageBox.innerHTML = "Please select an encrypted file and paste the private key.";
        return;
    }

    const file = fileInputDecrypt.files[0];
    const reader = new FileReader();
    
    reader.onload = function(event) {
        const encryptedContent = event.target.result;
        const crypt = new JSEncrypt();
        crypt.setPrivateKey(privateKey);
        const decrypted = crypt.decrypt(encryptedContent);

        if (!decrypted) {
            messageBox.innerHTML = "Decryption failed. Invalid private key or corrupted file.";
            return;
        }

        const blob = new Blob([decrypted], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = file.name.replace('.enc', '');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        messageBox.innerHTML = "File decrypted successfully! Download it.";
    };

    reader.readAsText(file);
});