document.getElementById('encryptButton').addEventListener('click', function() {
    const fileInput = document.getElementById('fileInput');
    const encryptKey = document.getElementById('encryptKey').value;
    const messageBox = document.getElementById('encryptMessage');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    
    progressBar.style.width = '0%';
    progressBar.style.display = 'block';
    progressText.innerText = "0%";

    messageBox.innerHTML = "";

    if (fileInput.files.length === 0 || !encryptKey) {
        messageBox.innerHTML = "Please select a file and enter an encryption key.";
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onloadstart = function() {
        progressBar.style.display = 'block';
    };

    reader.onprogress = function(event) {
        if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            progressBar.style.width = progress + '%';
            progressText.innerText = progress + '%';
        }
    };

    reader.onload = function(event) {
        const fileData = event.target.result;
        const wordArray = CryptoJS.lib.WordArray.create(fileData);
        const encrypted = CryptoJS.AES.encrypt(wordArray, encryptKey).toString();
        const blob = new Blob([encrypted], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name + '.enc';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        messageBox.innerHTML = "File encrypted successfully! Download it.";
        progressBar.style.width = '100%';
        progressText.innerText = '100%';
        setTimeout(() => progressBar.style.display = 'none', 1000);
    };

    reader.onerror = function() {
        messageBox.innerHTML = "There was an error reading the file.";
        progressBar.style.display = 'none';
    };

    reader.readAsArrayBuffer(file);
});

document.getElementById('decryptButton').addEventListener('click', function() {
    const fileInputDecrypt = document.getElementById('fileInputDecrypt');
    const decryptKey = document.getElementById('decryptKey').value;
    const messageBox = document.getElementById('decryptMessage');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    
    progressBar.style.width = '0%';
    progressBar.style.display = 'block';
    progressText.innerText = "0%";

    messageBox.innerHTML = "";

    if (fileInputDecrypt.files.length === 0 || !decryptKey) {
        messageBox.innerHTML = "Please select an encrypted file and enter the decryption key.";
        return;
    }

    const file = fileInputDecrypt.files[0];
    const reader = new FileReader();

    reader.onloadstart = function() {
        progressBar.style.display = 'block';
    };

    reader.onprogress = function(event) {
        if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            progressBar.style.width = progress + '%';
            progressText.innerText = progress + '%';
        }
    };

    reader.onload = function(event) {
        const encryptedContent = event.target.result;
        const decrypted = CryptoJS.AES.decrypt(encryptedContent, decryptKey);
        
        const decoded = decrypted.toString(CryptoJS.enc.Utf8);
        
        if (!decoded) {
            messageBox.innerHTML = "Decryption failed. Invalid key or corrupted file.";
            progressBar.style.display = 'none';
            return;
        }

        const base64String = decoded;
        const binaryString = atob(base64String);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);

        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        const blob = new Blob([bytes], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name.replace('.enc', '');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        messageBox.innerHTML = "File decrypted successfully! Download it.";
        progressBar.style.width = '100%';
        progressText.innerText = '100%';
        setTimeout(() => progressBar.style.display = 'none', 1000);
    };

    reader.onerror = function() {
        messageBox.innerHTML = "There was an error reading the file.";
        progressBar.style.display = 'none';
    };

    reader.readAsText(file);
});
