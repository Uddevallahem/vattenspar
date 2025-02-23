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
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Vattenutmaningen</title>
            <link rel="icon" type="image/x-icon" href="images/favicon.ico">
            <link href="https://fonts.googleapis.com/css2?family=Aleo:wght@400;700&display=swap" rel="stylesheet">
            <style>
    /* Här är det CSS-kommentarer */
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
                    align-items: left;
                    justify-content: flex-start;
                    height: 100vh;
                    margin: 0;
                    background-color: #ffffff;
                    padding-top: 20px;
                }
                
                h1 {
                    font-family: 'Aleo', sans-serif;
                    color: #446F83;
                    text-align: left;
                }
                
                h2 {
                    text-align: center;
                }

                h3 {
                    text-align: left;
                }
                
                .pokal {
                    width: 30px;
                    height: auto;
                }
                
                .vattendroppar {
                    width: 30px;
                    height: auto;
                }
                
                .container {
                    text-align: center;
                    margin-top: 10px;
                }
                
                .box {
                    background-color: #446F83;
                    color: white;
                    padding: 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin-top: 20px;
                    width: 100%; /* Gör boxen responsiv */
                    max-width: 400px; /* Maxbredd */
                }
                
                .box:hover {
                    background-color: #85A1AE;
                }
                
                .hidden {
                    display: none;
                }
                
                .visible {
                    display: block;
                }
                
                .slider-container {
                    margin-top: 20px;
                    position: relative;
                    width: 100%;
                    max-width: 400px; /* Maxbredd för slider */
                }
                
                .slider {
                    width: 100%;
                }
                
                .slider-value {
                    position: absolute;
                    top: -25px;
                    left: 50%;
                    transform: translateX(-50%);
                    font-weight: bold;
                }
                
                .slider-labels {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 10px;
                }
                                                 
                #savingsText {
                    text-align: left;
                    margin-top: 10px;
                    font-weight: bold;
                    color: #446F82;
                }
                
                .leaderboard-container {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                }
                                
                .leaderboard {
                    align-self: flex-start;
                    width: 25%;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    background-color: transparent;
                    margin-top: 20px;            /* Mellanrum mellan boxarna */

                }
                
                #monthly-leaderboard, #yearly-leaderboard {
                    width: 20%;                    /* Bredd på boxarna*/
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    background-color: #fff;
                    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
                }
                
                ol {
                    list-style-position: inside;
                    text-align: left;
                }
                
                li {
                    margin: 5px 0;
                }
                
                /* Media Queries */
                @media (max-width: 1200px) {
                    .leaderboard-container {
                        top: 40px;
                        left: 10px;
                    }
                
                    .leaderboard {
                        width: 40%;
                    }
                
                    #monthly-leaderboard, #yearly-leaderboard {
                        width: 80%;
                    }
                
                    .box {
                        width: 90%;
                    }
                }
                
                @media (max-width: 900px) {
                    .leaderboard-container {
                        top: 20px;
                        left: 10px;
                        padding-top: 10px;
                    }
                
                    .leaderboard {
                        width: 50%;
                    }
                
                    #monthly-leaderboard, #yearly-leaderboard {
                        width: 90%;
                    }
                
                    .box {
                        width: 90%;
                    }
                
                    .slider-container {
                        max-width: 350px;
                    }
                }
                
                @media (max-width: 600px) {
                    body {
                        padding-top: 10px;
                    }
                
                    .leaderboard-container h1 {
                        font-size: 20px;
                    }
                
                    .leaderboard {
                        width: 100%;
                    }
                
                    #monthly-leaderboard, #yearly-leaderboard {
                        width: 100%;
                    }
                
                    .box {
                        width: 100%;
                        margin: 10px 0;
                    }
                
                    .slider-container {
                        max-width: 300px;
                    }
                
                }
            </style>
        </head>
        <body>
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.0/xlsx.full.min.js"></script> 



<!-- Här är det HTML-kommentarer -->

            <h1>Vattenutmaningen <img src="https://raw.githubusercontent.com/uddevallahem/vattenspar/main/images/vattendroppar_blue_ill.png" alt="Pokal" class="pokal"></h1>
             <div class="container">
    <div class="box" id="infoBox">
        <h2>Duscha kortare</h2>
        <p id="questionDuscha" class="hidden">
            Hur många gånger i veckan duschar ni?
        </p>
        <div class="slider-container hidden" id="sliderContainer">
            <input type="range" min="0" max="20" value="0" class="slider" id="waterSlider">
            <span class="slider-value" id="sliderValue">0</span>
            <div class="slider-labels">
                <span>0</span>
                <span>20</span>
            </div>
            <p id="moreInfo" class="hidden">
                Du sparar ungefär <b><span id="waterSavings">0</span> liter vatten per vecka</b> genom att duscha kortare.
            </p>
        </div>
    </div>

    <div class="box" id="infoBox2">
        <h2>Stäng av kranen</h2>
        <p id="questionDuscha2" class="hidden" style="font-style: italic;">
            Hur många är ni i hushållet?
        </p>
        <div class="slider-container hidden" id="sliderContainer2">
            <input type="range" min="1" max="8" value="1" class="slider" id="waterSlider2">
            <span class="slider-value" id="sliderValue2">1</span>
            <div class="slider-labels">
                <span>1</span>
                <span>8</span>
            </div>
            <p id="moreInfo2" class="hidden">
                Du sparar ungefär <span id="waterSavings2">8</span> liter vatten per vecka genom att stänga av kranen.
            </p>
        </div>
    </div>
</div>


<h1>Leaderboards <img src="https://raw.githubusercontent.com/uddevallahem/vattenspar/main/images/pokal_blue_ill.png" alt="Pokal" class="pokal"></h1>      
    <div class="leaderboard-container">
        <div id="monthly-leaderboard" class="leaderboard">
            <h3>Topp 3 fastigheter som sparat mest vatten den här månaden</h3>
            <ol id="monthly-list">
                <li id="monthly-first"> <b><span id="monthly-first1"></b>   </span><span id="monthly-first2"></span> </li>
                <li id="monthly-second"> <b><span id="monthly-second1"></b>   </span><span id="monthly-second2"></span> </li>
                <li id="monthly-third"> <b><span id="monthly-third1"></b>   </span><span id="monthly-third2"></span> </li>
            </ol>
        </div>
        <div id="yearly-leaderboard" class="leaderboard">
            <h3>Topp 3 fastigheter som sparat mest vatten det här året (2025)</h3>
            <ol id="yearly-list">
                <li id="yearly-first"> <b><span id="yearly-first1"></b>    </span><span id="yearly-first2"></span> </li>
                <li id="yearly-second"> <b><span id="yearly-second1"></b>    </span><span id="yearly-second2"></span> </li>
                <li id="yearly-third"> <b><span id="yearly-third1"></b>    </span><span id="yearly-third2"></span> </li>
            </ol>
        </div>
    </div>

    
            <script>
// Här är det JavaScript-kommentarer
         
       
    document.getElementById('infoBox').addEventListener('click', function(event) {
    if (event.target.id !== 'waterSlider') {
        var moreInfo = document.getElementById('moreInfo');
        var questionDuscha = document.getElementById('questionDuscha');
        var sliderContainer = document.getElementById('sliderContainer');
        if (moreInfo.classList.contains('hidden')) {
            moreInfo.classList.remove('hidden');
            moreInfo.classList.add('visible');
            questionDuscha.classList.remove('hidden');
            questionDuscha.classList.add('visible');
            sliderContainer.classList.remove('hidden');
            sliderContainer.classList.add('visible');
        } else {
            moreInfo.classList.remove('visible');
            moreInfo.classList.add('hidden');
            questionDuscha.classList.remove('visible');
            questionDuscha.classList.add('hidden'); 
            sliderContainer.classList.remove('visible');
            sliderContainer.classList.add('hidden');
        }
    }
});

document.getElementById('infoBox2').addEventListener('click', function(event) {
    if (event.target.id !== 'waterSlider2') {
        var moreInfo = document.getElementById('moreInfo2');
        var questionDuscha = document.getElementById('questionDuscha2');
        var sliderContainer = document.getElementById('sliderContainer2');
        if (moreInfo.classList.contains('hidden')) {
            moreInfo.classList.remove('hidden');
            moreInfo.classList.add('visible');
            questionDuscha.classList.remove('hidden');
            questionDuscha.classList.add('visible');
            sliderContainer.classList.remove('hidden');
            sliderContainer.classList.add('visible');
        } else {
            moreInfo.classList.remove('visible');
            moreInfo.classList.add('hidden');
            questionDuscha.classList.remove('visible');
            questionDuscha.classList.add('hidden');
            sliderContainer.classList.remove('visible');
            sliderContainer.classList.add('hidden');
        }
    }
});
        
        document.getElementById('waterSlider').addEventListener('input', function() {
            var slider = document.getElementById('waterSlider');
            var sliderValue = slider.value;
            var waterSavings = sliderValue * 8; // Här kan man ändra 8 till vad ekvationen egentligen skall vara
            document.getElementById('waterSavings').innerText = waterSavings;
            var sliderValueElement = document.getElementById('sliderValue');
            sliderValueElement.innerText = sliderValue;
            var sliderWidth = slider.offsetWidth;
            var newLeft = (sliderValue / 20) * sliderWidth;
            sliderValueElement.style.left = newLeft + 'px';
        });

            document.getElementById('waterSlider2').addEventListener('input', function() {
                var slider2 = document.getElementById('waterSlider2');
                var sliderValue2 = slider2.value;
                var waterSavings2 = sliderValue2 * 8; // Här kan man ändra 8 till vad ekvationen egentligen skall vara
                document.getElementById('waterSavings2').innerText = waterSavings2;
                var sliderValueElement2 = document.getElementById('sliderValue2');
                sliderValueElement2.innerText = sliderValue2;
                var sliderWidth2 = slider2.offsetWidth;
                var newLeft2 = ((sliderValue2 - 1) / 7) * sliderWidth2; // Justera för det nya intervallet 1-8
                sliderValueElement2.style.left = newLeft2 + 'px';
            });



document.addEventListener('DOMContentLoaded', function() {
                    const fileUrl = 'https://raw.githubusercontent.com/Uddevallahem/vattenspar/main/Data.xlsx'; 
                
                    fetch(fileUrl)
                    .then(response => response.arrayBuffer())
                    .then(data => {
                        const workbook = XLSX.read(data, { type: 'array' });
                        const sheet = workbook.Sheets['Sheet1'];
                        console.log(sheet); 
                        
                        // Monthly leaderboard
                        document.getElementById('monthly-first1').textContent = sheet['B102'].v;
                        document.getElementById('monthly-first2').textContent = sheet['B106'].v;
                        document.getElementById('monthly-second1').textContent = sheet['B103'].v;
                        document.getElementById('monthly-second2').textContent = sheet['B107'].v;
                        document.getElementById('monthly-third1').textContent = sheet['B104'].v;
                        document.getElementById('monthly-third2').textContent = sheet['B108'].v;

            
                        // Yearly leaderboard
                        document.getElementById('yearly-first1').textContent = sheet['C102'].v;
                        document.getElementById('yearly-first2').textContent = sheet['C106'].v;
                        document.getElementById('yearly-second1').textContent = sheet['C103'].v;
                        document.getElementById('yearly-second2').textContent = sheet['C107'].v;
                        document.getElementById('yearly-third1').textContent = sheet['C104'].v;
                        document.getElementById('yearly-third2').textContent = sheet['C108'].v;
                    })
                    .catch(error => console.error('Error fetching or parsing the Excel file:', error));
            });
           

            </script>
        </body>
        </html>
    `;
    return html;
}
