addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request).catch(handleError));
});

async function handleRequest(request) {
    try {
        const data = await fetchData();
        const html = generateHTML(data);
        return new Response(html, {
            headers: {
                'content-type': 'text/html',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            },
        });
    } catch (error) {
        return handleError(error);
    }
}

async function fetchData() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/uddevallahem/vattenspar/main/package.json');
        const text = await response.text();
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }
        // Försök att parsa texten som JSON
        try {
            return JSON.parse(text);
        } catch (error) {
            throw new Error('Received non-JSON response');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

function handleError(error) {
    return new Response(`Error: ${error.message}`, {
        status: 500,
        headers: {
            'content-type': 'text/plain',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        },
    });
}

function generateHTML(data) {
    let html = `
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Vattenutmaningen</title>
            <link href="https://fonts.googleapis.com/css2?family=Aleo:wght@400;700&display=swap" rel="stylesheet">
            <style>
                @font-face {
                    font-family: 'Twisted System';
                    src: url('https://raw.githubusercontent.com/uddevallahem/vattenspar/main/fonts/TwistedSystem.otf') format('opentype');
                    font-weight: normal;
                    font-style: normal;
                }
                body {
                    font-family: 'Aleo', sans-serif;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    margin: 0;
                    background-color: #f0f0f0;
                }
                h1 {
                    font-family: 'Twisted System', sans-serif;
                }
                .pokal {
                    width: 30px;
                    height: auto;
                }
                .container {
                    text-align: center;
                    margin-top: 20px;
                }
                .box {
                    background-color: #4CAF50;
                    color: white;
                    padding: 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin-top: 20px;
                }
                .box:hover {
                    background-color: #45a049;
                }
                .hidden {
                    display: none;
                }
                .visible {
                    display: block;
                }
            </style>
        </head>
        <body>
            <h1>Vattenutmaningen <img src="https://raw.githubusercontent.com/uddevallahem/vattenspar/main/images/pokal_blue_ill.png" alt="Pokal" class="pokal"></h1>
            <p>Välkommen till Vattenutmaningen! Här kan vi tillsammans spara vatten och göra en insats för miljön.</p>
            <div class="container">
                <div class="box" id="infoBox">
                    <h2>Duscha kortare</h2>
                    <p id="moreInfo" class="hidden">Genom att duscha kortare kan du spara vatten och energi. Det är bra för både miljön och din plånbok!</p>
                </div>
            </div>
            <script>
                document.getElementById('infoBox').addEventListener('click', function() {
                    var moreInfo = document.getElementById('moreInfo');
                    if (moreInfo.classList.contains('hidden')) {
                        moreInfo.classList.remove('hidden');
                        moreInfo.classList.add('visible');
                    } else {
                        moreInfo.classList.remove('visible');
                        moreInfo.classList.add('hidden');
                    }
                });
            </script>
        </body>
        </html>
    `;
    return html;
}
