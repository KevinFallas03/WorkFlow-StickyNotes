/*
JS File to manage Text-To-Speech functions

References:
- https://dev.to/asaoluelijah/speech-recognition-with-javascript-4lh6
- https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition

*/

const isCompatible = () => 'speechSynthesis' in window;

const startSpeechRecognition = () => {
    if (isCompatible) {
        const recognition = new webkitSpeechRecognition();

        // Remove comment for spanish
        //recognition.lang = "es-US"

        recognition.onstart = () => alert("Speech Recognition Listening...");

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            if (transcript === "read board" || transcript === "lee la pizarra") {
                if (!HelperTTS.paused) {
                    startTTS();
                }
            }
            console.log("Speech: ",transcript);
        };

        recognition.start()
    }
    else{
        console.error("Speech Recognition Not Supported");
    }
}