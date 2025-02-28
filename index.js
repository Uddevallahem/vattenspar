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
                    margin-bottom: 20px;
                }
                
                .visible {
                    display: block;
                }

                .radio-container {
                    display: flex;
                    gap: 20px;
                    margin: 10px 0;
                    font-size: 18px;
                }
                
                .radio-container input {
                    margin-right: 5px;
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
                    margin-top: 10px;
                    transform: translateX(-50%);
                    font-weight: bold;
                }
                
                .slider-labels {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 25px;
                }
                                                 
                #savingsText {
                    text-align: left;
                    margin-top: 10px;
                    font-weight: bold;
                    color: #446F82;
                }
                
                            
                /* Media Queries */
                @media (max-width: 1200px) {               
                    .box {
                        width: 90%;
                    }
                }
                
                @media (max-width: 900px) {              
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
    

             <h3>Har du nya eller äldre blandare?</h3>
<div class="radio-container">
    <label>
        <input type="radio" name="blandare" value="ny" checked> Nya
    </label>
    <label>
        <input type="radio" name="blandare" value="gammal"> Äldre
    </label>
</div>

             
             <div class="container">   
    <div class="box" id="infoBox">
        <h2>Diska för hand</h2>
        <p id="questionDuscha" class="hidden">
            Hur länge brukar du diska under rinnande vatten?
        </p>
        <div class="slider-container hidden" id="sliderContainer">
            <input type="range" min="1" max="15" value="0" class="slider" id="waterSlider">
            <span class="slider-value" id="sliderValue">0</span>
            <div class="slider-labels">
                <span>1</span>
                <span>15</span>
            </div>
            <p id="moreInfo" class="hidden">
                Du sparar upp till <b><span id="waterSavings">0</span> liter vatten per disktillfälle</b> om du fyller din diskho med vatten istället för att diska under rinnande vatten.
            </p>
        </div>
    </div>



    <div class="box" id="infoBox2">
        <h2>Duscha kortare</h2>
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



    <div class="box" id="infoBox3">
        <h2>Borsta tänderna</h2>
        <p id="questionDuscha3" class="hidden" style="font-style: italic;">
            Hur många är ni i hushållet?
        </p>
        <div class="slider-container hidden" id="sliderContainer3">
            <input type="range" min="1" max="8" value="1" class="slider" id="waterSlider3">
            <span class="slider-value" id="sliderValue3">1</span>
            <div class="slider-labels">
                <span>1</span>
                <span>8</span>
            </div>
            <p id="moreInfo3" class="hidden">
                Du sparar ungefär <span id="waterSavings3">8</span> liter vatten per vecka genom att stänga av kranen.
            </p>
        </div>
    </div>

    <div class="box" id="infoBox4">
        <h2>Tvåla</h2>
        <p id="questionDuscha4" class="hidden" style="font-style: italic;">
            Hur många är ni i hushållet?
        </p>
        <div class="slider-container hidden" id="sliderContainer4">
            <input type="range" min="1" max="8" value="1" class="slider" id="waterSlider4">
            <span class="slider-value" id="sliderValue4">1</span>
            <div class="slider-labels">
                <span>1</span>
                <span>8</span>
            </div>
            <p id="moreInfo4" class="hidden">
                Du sparar ungefär <span id="waterSavings4">8</span> liter vatten per vecka genom att stänga av kranen.
            </p>
        </div>
    </div>


    <div class="box" id="infoBox5">
        <h2>Läckande WC</h2>
        <p id="questionDuscha5" class="hidden" style="font-style: italic;">
            Hur många är ni i hushållet?
        </p>
        <div class="slider-container hidden" id="sliderContainer5">
            <input type="range" min="1" max="8" value="1" class="slider" id="waterSlider5">
            <span class="slider-value" id="sliderValue5">1</span>
            <div class="slider-labels">
                <span>1</span>
                <span>8</span>
            </div>
            <p id="moreInfo5" class="hidden">
                Du sparar ungefär <span id="waterSavings5">8</span> liter vatten per vecka genom att stänga av kranen.
            </p>
        </div>
    </div>


    <div class="box" id="infoBox6">
        <h2>Droppande kran</h2>
        <p id="questionDuscha6" class="hidden" style="font-style: italic;">
            Hur många är ni i hushållet?
        </p>
        <div class="slider-container hidden" id="sliderContainer6">
            <input type="range" min="1" max="8" value="1" class="slider" id="waterSlider6">
            <span class="slider-value" id="sliderValue6">1</span>
            <div class="slider-labels">
                <span>1</span>
                <span>8</span>
            </div>
            <p id="moreInfo6" class="hidden">
                Du sparar ungefär <span id="waterSavings6">8</span> liter vatten per vecka genom att stänga av kranen.
            </p>
        </div>
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

document.getElementById('infoBox3').addEventListener('click', function(event) {
    if (event.target.id !== 'waterSlider3') {
        var moreInfo = document.getElementById('moreInfo3');
        var questionDuscha = document.getElementById('questionDuscha3');
        var sliderContainer = document.getElementById('sliderContainer3');
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


document.getElementById('infoBox4').addEventListener('click', function(event) {
    if (event.target.id !== 'waterSlider4') {
        var moreInfo = document.getElementById('moreInfo4');
        var questionDuscha = document.getElementById('questionDuscha4');
        var sliderContainer = document.getElementById('sliderContainer4');
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


document.getElementById('infoBox5').addEventListener('click', function(event) {
    if (event.target.id !== 'waterSlider5') {
        var moreInfo = document.getElementById('moreInfo5');
        var questionDuscha = document.getElementById('questionDuscha5');
        var sliderContainer = document.getElementById('sliderContainer5');
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


document.getElementById('infoBox6').addEventListener('click', function(event) {
    if (event.target.id !== 'waterSlider6') {
        var moreInfo = document.getElementById('moreInfo6');
        var questionDuscha = document.getElementById('questionDuscha6');
        var sliderContainer = document.getElementById('sliderContainer6');
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





        
// Nummer 1 (Första boxen)
const slider = document.getElementById("waterSlider");
const sliderValue = document.getElementById("sliderValue");
const waterSavings = document.getElementById("waterSavings");

document.querySelectorAll('input[name="blandare"]').forEach(radio => {
    radio.addEventListener('change', updateWaterSavings);  // Lyssna på blandarändringar
});

slider.addEventListener("input", updateWaterSavings);

function updateWaterSavings() {
    const sliderVal = parseInt(slider.value); // Hämta slidervärdet
    const selectedBlandare = document.querySelector('input[name="blandare"]:checked') ? document.querySelector('input[name="blandare"]:checked').value : "ny"; // Hämta vald blandare, fallback till "ny" om inget valt
    
    let savings = 0;

    // HÄR GÖRS FUNKTIONERNA
    if (selectedBlandare === "ny") {
        savings = sliderVal * 7.4 - 14;
    } else if (selectedBlandare === "gammal") {
        savings = sliderVal * 14 - 14;
    }

    savings = Math.max(savings, 0);

    savings = Math.floor(savings); // Ta bort decimaler

    // Uppdatera UI
    sliderValue.innerText = sliderVal; // Visar sliderns aktuella värde
    waterSavings.innerText = savings; // Uppdatera vattenbesparingen utan decimaler

    var sliderWidth = slider.offsetWidth;
    var newLeft = ((sliderVal - 1) / 14) * sliderWidth; // Justera maxvärde om slidern har ett annat max
    sliderValue.style.left = newLeft + 'px'; // Flytta etiketten till rätt position
}

updateWaterSavings(); // Kör funktionen vid sidladdning för att visa rätt startvärde


// Nummer 2 (Andra boxen)
const slider2 = document.getElementById("waterSlider2");
const sliderValue2 = document.getElementById("sliderValue2");
const waterSavings2 = document.getElementById("waterSavings2");

slider2.addEventListener("input", updateWaterSavings2); // Lyssna på slider2 förändringar
document.querySelectorAll('input[name="blandare"]').forEach(radio => {
    radio.addEventListener('change', updateWaterSavings2); // Lyssna på blandarändringar för andra boxen
});

function updateWaterSavings2() {
    const sliderVal2 = parseInt(slider2.value); // Hämta slidervärdet
    const selectedBlandare = document.querySelector('input[name="blandare"]:checked') ? document.querySelector('input[name="blandare"]:checked').value : "ny"; // Hämta vald blandare, använder samma som första slider
    
    let savings2 = 0;

    // HÄR GÖRS FUNKTIONERNA
    if (selectedBlandare === "ny") {
        savings2 = sliderVal2 * 8 - 16;  // Justera ekvationen om det behövs
    } else if (selectedBlandare === "gammal") {
        savings2 = sliderVal2 * 16 - 16; // Justera ekvationen om det behövs
    }

    savings2 = Math.max(savings2, 0);

    savings2 = Math.floor(savings2); // Ta bort decimaler

    // Uppdatera UI
    sliderValue2.innerText = sliderVal2; // Visar sliderns aktuella värde
    waterSavings2.innerText = savings2; // Uppdatera vattenbesparingen utan decimaler

    var sliderWidth2 = slider2.offsetWidth;
    var newLeft2 = ((sliderVal2 - 1) / 7) * sliderWidth2; // Justera för det nya intervallet 1-8
    sliderValue2.style.left = newLeft2 + 'px'; // Flytta etiketten till rätt position
}

updateWaterSavings2(); // Kör funktionen vid sidladdning för att visa rätt startvärde







            document.getElementById('waterSlider3').addEventListener('input', function() {
                var slider3 = document.getElementById('waterSlider3');
                var sliderValue3 = slider3.value;
                var waterSavings3 = sliderValue3 * 8; // Här kan man ändra 8 till vad ekvationen egentligen skall vara
                document.getElementById('waterSavings3').innerText = waterSavings3;
                var sliderValueElement3 = document.getElementById('sliderValue3');
                sliderValueElement3.innerText = sliderValue3;
                var sliderWidth3 = slider3.offsetWidth;
                var newLeft3 = ((sliderValue3 - 1) / 7) * sliderWidth3; // Justera för det nya intervallet 1-8
                sliderValueElement3.style.left = newLeft3 + 'px';
            });

  document.getElementById('waterSlider4').addEventListener('input', function() {
                var slider4 = document.getElementById('waterSlider4');
                var sliderValue4 = slider4.value;
                var waterSavings4 = sliderValue4 * 8; // Här kan man ändra 8 till vad ekvationen egentligen skall vara
                document.getElementById('waterSavings4').innerText = waterSavings4;
                var sliderValueElement4 = document.getElementById('sliderValue4');
                sliderValueElement4.innerText = sliderValue4;
                var sliderWidth4 = slider4.offsetWidth;
                var newLeft4 = ((sliderValue4 - 1) / 7) * sliderWidth4; // Justera för det nya intervallet 1-8
                sliderValueElement4.style.left = newLeft4 + 'px';
            });


  document.getElementById('waterSlider5').addEventListener('input', function() {
                var slider5 = document.getElementById('waterSlider5');
                var sliderValue5 = slider5.value;
                var waterSavings5 = sliderValue5 * 8; // Här kan man ändra 8 till vad ekvationen egentligen skall vara
                document.getElementById('waterSavings5').innerText = waterSavings5;
                var sliderValueElement5 = document.getElementById('sliderValue5');
                sliderValueElement5.innerText = sliderValue5;
                var sliderWidth5 = slider5.offsetWidth;
                var newLeft5 = ((sliderValue5 - 1) / 7) * sliderWidth5; // Justera för det nya intervallet 1-8
                sliderValueElement5.style.left = newLeft5 + 'px';
            });


  document.getElementById('waterSlider6').addEventListener('input', function() {
                var slider6 = document.getElementById('waterSlider6');
                var sliderValue6 = slider6.value;
                var waterSavings6 = sliderValue6 * 8; // Här kan man ändra 8 till vad ekvationen egentligen skall vara
                document.getElementById('waterSavings6').innerText = waterSavings6;
                var sliderValueElement6 = document.getElementById('sliderValue6');
                sliderValueElement6.innerText = sliderValue6;
                var sliderWidth6 = slider6.offsetWidth;
                var newLeft6 = ((sliderValue6 - 1) / 7) * sliderWidth6; // Justera för det nya intervallet 1-8
                sliderValueElement6.style.left = newLeft6 + 'px';
            });


            </script>
        </body>
        </html>
    `;
    return html;
}
