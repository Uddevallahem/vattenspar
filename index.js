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
                    align-items: center;
                    justify-content: flex-start;
                    height: 100vh;
                    margin: 0;
                    background-color: #f0f0f0;
                    padding-top: 20px; /* Lägg till lite padding från toppen om det behövs */
                }
                h1 {
                    font-family: 'Twisted System', sans-serif;
                }
                h2 {
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
                    margin-top: 20px;
                }
                .box {
                    background-color: #446F82;
                    color: white;
                    padding: 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin-top: 20px;
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
                    margin-top: 40px;
                    position: relative;
                    width: 100%;
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
                
                .title-container-progress {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    padding-top: 10px; /* Lägger till lite avstånd mellan titeln och progressboxen */
                }
                .progress-container {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    width: 100%;
                    max-width: 600px; /* Sätt en maxbredd för progressbaren */
                    background-color: #f3f3f3;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    overflow: hidden;
                    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
                    padding-top: 20px; /* Justera padding om det behövs */
                }
                                
                .progress-bar {
                    width: 0;
                    height: 30px;
                    background-color: #85A1AE;
                    text-align: center;
                    line-height: 30px;
                    color: white;
                    transition: width 0.3s ease;
                }
                #savingsText {
                   text-align: center;
                   margin-top: 10px;
                   font-weight: bold;
                   color: #446F82;
                }

                .leaderboard-container {
                    position: absolute;
                    top: 20px;
                    left: 20px;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    padding-top: 20px; /* Lägg till lite padding från toppen om det behövs */
                }
                .leaderboard-container h1 {
                    margin: 0; /* Ta bort extra marginaler */
                    font-size: 24px; /* Justera storlek om nödvändigt */
                    display: flex;
                    align-items: left; /* Centrera titel och ikon horisontellt */
                }
                .leaderboard-container h1 img {
                    margin-left: 10px; /* Ge lite utrymme mellan text och ikon */
                }
                .leaderboard {
                    align-self: flex-start;
                    margin: 10px 0;
                    width: 25%;
                    border: 1px solid #ccc;
                    padding: 10px;
                    border-radius: 5px;
                    background-color: transparent; /* Ingen vit bakgrund */
                }
                #monthly-leaderboard, #yearly-leaderboard {
                    margin: 20px 0;
                    width: 60%;
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
            </style>
        </head>
        <body>
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.0/xlsx.full.min.js"></script> 
<!-- Här är det HTML-kommentarer -->
            <h1>Vattenutmaningen <img src="https://raw.githubusercontent.com/uddevallahem/vattenspar/main/images/vattendroppar_blue_ill.png" alt="Pokal" class="pokal"></h1>
            <p>Välkommen till Vattenutmaningen! Här kan vi tillsammans spara vatten och göra en insats för miljön.</p>

            
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Leaderboards</title>
    <link rel="stylesheet" href="styles.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.0/xlsx.full.min.js"></script>
</head>
<body>
    <div class="leaderboard-container">
    <h1>Leaderboards <img src="https://raw.githubusercontent.com/uddevallahem/vattenspar/main/images/pokal_blue_ill.png" alt="Pokal" class="pokal"></h1>
        <div id="monthly-leaderboard" class="leaderboard">
            <h2>Topp 3 fastigheter som sparat mest vatten den här månaden</h2>
            <ol id="monthly-list">
                <li id="monthly-first"> <b><span id="monthly-first1"></b>   </span><span id="monthly-first2"></span> </li>
                <li id="monthly-second"> <b><span id="monthly-second1"></b>   </span><span id="monthly-second2"></span> </li>
                <li id="monthly-third"> <b><span id="monthly-third1"></b>   </span><span id="monthly-third2"></span> </li>
            </ol>
        </div>
        <div id="yearly-leaderboard" class="leaderboard">
            <h2>Topp 3 fastigheter som sparat mest vatten det här året (2025)</h2>
            <ol id="yearly-list">
                <li id="yearly-first"> <b><span id="yearly-first1"></b>    </span><span id="yearly-first2"></span> </li>
                <li id="yearly-second"> <b><span id="yearly-second1"></b>    </span><span id="yearly-second2"></span> </li>
                <li id="yearly-third"> <b><span id="yearly-third1"></b>    </span><span id="yearly-third2"></span> </li>
            </ol>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>


    <div class="title-container-progress">
        <h1>Totala besparning för samtliga hyresgäster under 2025:</h1>
    </div>
<div class="progress-container">
    <div class="progress-bar" id="totalSavingsBar"></div>
    <p id="savingsText">Ni har tillsammans sparat 85 507 000 liter vatten, fantastiskt jobbat!</p>
</div>


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
            <script>
// Här är det JavaScript-kommentarer


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


            document.addEventListener('DOMContentLoaded', function() {
                var totalSavingsBar = document.getElementById('totalSavingsBar');
                var maxSavings = 216000000;
                var currentSavings = 85507000;
                var progressPercentage = (currentSavings / maxSavings) * 100;
                totalSavingsBar.style.width = progressPercentage + '%';
            });
            
       
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

           

            </script>
        </body>
        </html>
    `;
    return html;
}
