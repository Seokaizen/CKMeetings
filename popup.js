// Cuando se carga el popup
document.addEventListener("DOMContentLoaded", function() {
    // Ejecutar el script en la pestaña activa para extraer la transcripción
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.scripting.executeScript({
            target: {tabId: tabs[0].id},
            function: extractTranscription
        }, function(results) {
            if (results && results[0] && results[0].result) {
                // Colocar el texto extraído en el textarea
                document.getElementById("transcription-text").value = results[0].result;
            } else {
                document.getElementById("transcription-text").value = "No se encontró ninguna transcripción.";
            }
        });
    });

    // Agregar evento al botón de copiar
    document.getElementById("copy-btn").addEventListener("click", function() {
        let transcription = document.getElementById("transcription-text").value;
        if (transcription) {
            navigator.clipboard.writeText(transcription).then(function() {
                alert("Texto copiado al portapapeles.");
            }).catch(function() {
                alert("Error al copiar el texto.");
            });
        }
    });
});

// Función que se ejecuta en la página web para extraer la transcripción
function extractTranscription() {
    let xpath = "//div[@id='transcript-container']//p";
    let result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    
    let transcription = '';
    for (let i = 0; i < result.snapshotLength; i++) {
        transcription += result.snapshotItem(i).textContent + "\n";
    }
    return transcription;
}
