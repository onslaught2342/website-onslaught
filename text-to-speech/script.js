document.addEventListener("DOMContentLoaded", function () {
    const synth = window.speechSynthesis;
    const textInput = document.getElementById("textInput");
    const voiceSelect = document.getElementById("voiceSelect");
    const rate = document.getElementById("range");
    const pitch = document.getElementById("pitch");
    const rateValue = document.getElementById("rateValue");
    const pitchValue = document.getElementById("pitchValue");
    const button = document.getElementById("button");
    let voices = [];
    if (!("speechSynthesis" in window)) {
        alert("Sorry, your browser does not support text-to-speech.");
        return;
    }
    function populateVoices() {
        voices = synth.getVoices();
        voiceSelect.innerHTML = "";

        voices.forEach((voice) => {
            const option = document.createElement("option");
            option.value = voice.name;
            option.textContent = `${voice.name} (${voice.lang})`;
            option.setAttribute("data-name", voice.name);
            if (voice.default) {
                option.selected = true;
            }
            voiceSelect.appendChild(option);
        });
    }
    populateVoices();
    if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = populateVoices;
    }
    rate.addEventListener("input", () => {
        rateValue.textContent = rate.value;
    });
    pitch.addEventListener("input", () => {
        pitchValue.textContent = pitch.value;
    });
    function speak() {
        if (synth.speaking) {
            synth.cancel();
        }

        if (textInput.value !== "") {
            const speakText = new SpeechSynthesisUtterance(textInput.value);
            const selectedVoice = voiceSelect.selectedOptions[0].getAttribute("data-name");
            const selectedVoiceObject = voices.find(voice => voice.name === selectedVoice);
            if (selectedVoiceObject) {
                speakText.voice = selectedVoiceObject;
            }
            speakText.rate = parseFloat(rate.value);
            speakText.pitch = parseFloat(pitch.value);
            speakText.onstart = () => {
                button.textContent = "Stop";
                console.log("Speech started.");
            };
            speakText.onend = () => {
                button.textContent = "Speak";
                console.log("Speech finished.");
            };

            speakText.onerror = (e) => {
                button.textContent = "Speak";
                console.error("Speech synthesis error:", e);
            };

            synth.speak(speakText);
        }
    }
    button.addEventListener("click", () => {
        if (synth.speaking) {
            synth.cancel();
            button.textContent = "Speak";
            console.log("Speech canceled.");
        } else {
            speak();
        }
    });
});
