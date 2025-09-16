const API_KEY = "AIzaSyAYxosLe9ts62wxwRESgaSxrLcL8CuOs78";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
const personaje1 = "Gustavo Petro, Presidente de Colombia"
const personaje2 = "adolfo hitler" 

const debate = "tema aleatorio que los haga debatir"

// En tu archivo data.js

const prompt = `
Actúa como un moderador llamado Deivi. 
Inicia un debate breve entre dos personas:
- ${personaje1}
- ${personaje2}

El tema del debate es: ${debate}.
Quiero que las respuestas de los participantes y del moderador sean cortas, concisas y mantengan una conversación fluida.
Formatea la respuesta en HTML, usando etiquetas <p> para cada línea de diálogo y etiquetas <b> para los nombres. No incluyas ningún código extra.
`;
const chatContainer = document.getElementById("chat");
const headers = {
    'Content-Type': 'application/json'
};

const data = {
    "contents": [
        {
            "parts": [
                {
                    "text": prompt,
                }
            ]
        }
    ]
};

// Se utiliza 'async/await' para manejar la solicitud de forma asíncrona
async function generateContent() {
    try {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }

        const responseData = await response.json();
        // Extrae el texto de la respuesta de la IA
        const generatedText = responseData.candidates[0].content.parts[0].text;
        console.log("Respuesta de la IA:");
        
        pintarDatos(generatedText)

    } catch (error) {
        console.error("Hubo un error al llamar a la API:", error);
    }
}

 
generateContent();


function limpiarChat(){
    document.getElementById("chat").value ="";
}


function pintarDatos(texto){
const nuevoMensaje = document.createElement("div")
nuevoMensaje.innerHTML = texto;
chatContainer.appendChild(nuevoMensaje)
chatContainer.scrollTop = chatContainer.scrollHeight;
}