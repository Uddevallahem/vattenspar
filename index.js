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
                    font-size: 1.5rem;
                }
                
                h2 {
                    text-align: center;
                }

                h3 {
                    text-align: left;
                    font-family: 'Aleo', sans-serif;
                    color: #446F83;
                    font-size: 1.5rem;
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
                    box-sizing: border-box; /* Se till att padding inte överskrider maxbredden */
                }
                
                .box:hover {
                    background-color: #85A1AE;
                }


                .boxg {
                    background-color: ##76967D;
                    color: white;
                    padding: 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin-top: 20px;
                    width: 100%; /* Gör boxen responsiv */
                    max-width: 400px; /* Maxbredd */
                    box-sizing: border-box; /* Se till att padding inte överskrider maxbredden */
                }
                
                .boxg:hover {
                    background-color: #CDDAD3;
                }
                
                .hidden {
                    display: none;
                    margin-bottom: 20px;
                    text-align: center;

                }
                
                .visible {
                    display: block;
                }

                .radio-container {
                    display: flex;
                    gap: 20px;
                    margin: 10px 0;
                    font-size: 18px;
                    font-family: 'Aleo', sans-serif;
                    color: #446F83;
                }
                
                .radio-container input {
                    margin-right: 5px;
                    color: #446F83;

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
                    text-align: center;
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

                /* Justera storleken för mellanliggande skärmar */
                @media (max-width: 900px) {              
                    .box {
                        width: 90%;
                    }
                
                    h1, h3 {
                        font-size: 1.5rem; 
                    }
                    .slider-container {
                        max-width: 350px;
                    }
                }

                /* Justera storleken för små skärmar */
                @media (max-width: 600px) {
                    body {
                        padding-top: 10px;
                    }
                    h1, h3 {
                        font-size: 1.5rem; 
                    }
                    .box {
                        width: 100%;
                        margin: 10px 0;
                    }
                
                    .slider-container {
                        max-width: 300px;
                        text-align: center;
                    }

                }
            </style>
        </head>
        <body>
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.0/xlsx.full.min.js"></script> 



<!-- Här är det HTML-kommentarer -->
    

             <h3>Har ni nya eller äldre vattenkranar?</h3>
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
        <h2>Duschar du länge?</h2>
        <p id="questionDuscha2" class="hidden" style="font-style: italic;">
            Ange hur många minuter du kan korta ner din duschtid och se hur mycket vatten du kan spara!
        </p>
        <div class="slider-container hidden" id="sliderContainer2">
            <input type="range" min="1" max="15" value="1" class="slider" id="waterSlider2">
            <span class="slider-value" id="sliderValue2">1</span>
            <div class="slider-labels">
                <span>1</span>
                <span>15</span>
            </div>
            <p id="moreInfo2" class="hidden">
                Du sparar ungefär <b><span id="waterSavings2">0</span> liter vatten per duschtillfälle</b> genom att korta ner din duschtid med <span id="sliderValueText2">1</span> minuter.
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
                Du sparar ungefär <b><span id="waterSavings3">0</span> liter vatten per dag</b> genom att stänga av vattnet när ni borstar tänderna jämfört med att ha vattnet på under tiden.
            </p>
        </div>
    </div>

    <div class="box" id="infoBox4">
        <h2>Tvål & Schampo</h2>
        <p id="questionDuscha4" class="hidden" style="font-style: italic;">
            Hur många duschar blir det i ert hushåll varje vecka?
        </p>
        <div class="slider-container hidden" id="sliderContainer4">
            <input type="range" min="1" max="49" value="1" class="slider" id="waterSlider4">
            <span class="slider-value" id="sliderValue4">1</span>
            <div class="slider-labels">
                <span>1</span>
                <span>49</span>
            </div>
            <p id="moreInfo4" class="hidden">
                Ni sparar ungefär <b><span id="waterSavings4">0</span> liter vatten per vecka</b> om ni stänger av vattnet i duschen under tiden ni tvålar/schamponerar er.
            </p>
        </div>
    </div>


    <div class="box" id="infoBox5">
        <h2>Läckande WC</h2>
        <p id="questionDuscha5" class="hidden" style="font-style: italic;">
            Hur många dagar tar det innan du felanmäler en läckande/rinnande toalett?
        </p>
        <div class="slider-container hidden" id="sliderContainer5">
            <input type="range" min="1" max="14" value="1" class="slider" id="waterSlider5">
            <span class="slider-value" id="sliderValue5">1</span>
            <div class="slider-labels">
                <span>1</span>
                <span>14</span>
            </div>
            <p id="moreInfo5" class="hidden">
                Under den här tiden har det förbrukats ungefär <b><span id="waterSavings5">0</span> liter vatten</b>.
            </p>
        </div>
    </div>


    <div class="box" id="infoBox6">
        <h2>Droppande kran</h2>
        <p id="questionDuscha6" class="hidden" style="font-style: italic;">
            Hur många dagar tar det innan du felanmäler en droppande vattenkran?
        </p>
        <div class="slider-container hidden" id="sliderContainer6">
            <input type="range" min="1" max="14" value="1" class="slider" id="waterSlider6">
            <span class="slider-value" id="sliderValue6">1</span>
            <div class="slider-labels">
                <span>1</span>
                <span>14</span>
            </div>
            <p id="moreInfo6" class="hidden">
                Under den här tiden har det förbrukats ungefär <b><span id="waterSavings6">0</span> liter vatten </b>.
            </p>
        </div>
    </div>

    <div class="boxg" id="infoBox7">
        <h2>Spara pengar!</h2>
        <p id="questionDuscha7" class="hidden">
            Har du individuell mätning och debitering (IMD) av ditt vatten? Då sparar du ungefär 1 krona per sparad liter vatten! Så i rutorna ovan kan du tänka kronor istället för liter.
        </p>
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

document.getElementById('infoBox7').addEventListener('click', function(event) {
    if (event.target.id !== 'waterSlider7') {
        var moreInfo = document.getElementById('moreInfo7');
        var questionDuscha = document.getElementById('questionDuscha7');
        var sliderContainer = document.getElementById('sliderContainer7');
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



        
// Nummer 1
const slider = document.getElementById("waterSlider");
const sliderValue = document.getElementById("sliderValue");
const waterSavings = document.getElementById("waterSavings");

document.querySelectorAll('input[name="blandare"]').forEach(radio => {
    radio.addEventListener('change', updateWaterSavings);  
});

slider.addEventListener("input", updateWaterSavings);

function updateWaterSavings() {
    const sliderVal = parseInt(slider.value); 
    const selectedBlandare = document.querySelector('input[name="blandare"]:checked') ? document.querySelector('input[name="blandare"]:checked').value : "ny"; 
    
    let savings = 0;

    // HÄR GÖRS FUNKTIONERNA
    if (selectedBlandare === "ny") {
        savings = sliderVal * 7.4 - 14;
    } else if (selectedBlandare === "gammal") {
        savings = sliderVal * 14 - 14;
    }

    savings = Math.max(savings, 0);

    savings = Math.round(savings); 

   
    sliderValue.innerText = sliderVal; 
    waterSavings.innerText = savings; 

    var sliderWidth = slider.offsetWidth;
    var newLeft = ((sliderVal - 1) / 14) * sliderWidth; 
    sliderValue.style.left = newLeft + 'px'; 
}

updateWaterSavings(); 


// Nummer 2 
const slider2 = document.getElementById("waterSlider2");
const sliderValue2 = document.getElementById("sliderValue2");
const waterSavings2 = document.getElementById("waterSavings2");

slider2.addEventListener("input", updateWaterSavings2);
document.querySelectorAll('input[name="blandare"]').forEach(radio => {
    radio.addEventListener('change', updateWaterSavings2); 
});

function updateWaterSavings2() {
    const sliderVal2 = parseInt(slider2.value); 
    const selectedBlandare = document.querySelector('input[name="blandare"]:checked') ? document.querySelector('input[name="blandare"]:checked').value : "ny"; 
    
    let savings2 = 0;

    // HÄR GÖRS FUNKTIONERNA
    if (selectedBlandare === "ny") {
        savings2 = sliderVal2 * 7,5;  
    } else if (selectedBlandare === "gammal") {
        savings2 = sliderVal2 * 12; 
    }

    savings2 = Math.max(savings2, 0);

    savings2 = Math.round(savings2); 

   
    sliderValue2.innerText = sliderVal2; 
    waterSavings2.innerText = savings2; 
    document.getElementById("sliderValueText2").innerText = sliderVal2; 


    var sliderWidth2 = slider2.offsetWidth;
    var newLeft2 = ((sliderVal2 - 1) / 14) * sliderWidth2; 
    sliderValue2.style.left = newLeft2 + 'px'; 
}

updateWaterSavings2(); 



// Nummer 3 
const slider3 = document.getElementById("waterSlider3");
const sliderValue3 = document.getElementById("sliderValue3");
const waterSavings3 = document.getElementById("waterSavings3");

slider3.addEventListener("input", updateWaterSavings3);
document.querySelectorAll('input[name="blandare"]').forEach(radio => {
    radio.addEventListener('change', updateWaterSavings3); 
});

function updateWaterSavings3() {
    const sliderVal3 = parseInt(slider3.value); 
    const selectedBlandare = document.querySelector('input[name="blandare"]:checked') ? document.querySelector('input[name="blandare"]:checked').value : "ny"; 
    
    let savings3 = 0;

    // HÄR GÖRS FUNKTIONERNA
    if (selectedBlandare === "ny") {
        savings3 = sliderVal3 * 4 *6,1;  
    } else if (selectedBlandare === "gammal") {
        savings3 = sliderVal3 * 4 * 12,8; 
    }

    savings3 = Math.max(savings3, 0);

    savings3 = Math.round(savings3); 

   
    sliderValue3.innerText = sliderVal3; 
    waterSavings3.innerText = savings3; 

    var sliderWidth3 = slider3.offsetWidth;
    var newLeft3 = ((sliderVal3 - 1) / 7) * sliderWidth3; 
    sliderValue3.style.left = newLeft3 + 'px'; 
}

updateWaterSavings3();




// Nummer 4 
const slider4 = document.getElementById("waterSlider4");
const sliderValue4 = document.getElementById("sliderValue4");
const waterSavings4 = document.getElementById("waterSavings4");

slider4.addEventListener("input", updateWaterSavings4);
document.querySelectorAll('input[name="blandare"]').forEach(radio => {
    radio.addEventListener('change', updateWaterSavings4); 
});

function updateWaterSavings4() {
    const sliderVal4 = parseInt(slider4.value); 
    const selectedBlandare = document.querySelector('input[name="blandare"]:checked') ? document.querySelector('input[name="blandare"]:checked').value : "ny"; 
    
    let savings4 = 0;

    // HÄR GÖRS FUNKTIONERNA
    if (selectedBlandare === "ny") {
        savings4 = sliderVal4 * 7,5 *1,5;  
    } else if (selectedBlandare === "gammal") {
        savings4 = sliderVal4 * 12 * 1,5; 
    }

    savings4 = Math.max(savings4, 0);

    savings4 = Math.round(savings4); 

   
    sliderValue4.innerText = sliderVal4; 
    waterSavings4.innerText = savings4; 

    var sliderWidth4 = slider4.offsetWidth;
    var newLeft4 = ((sliderVal4 - 1) / 48) * sliderWidth4; 
    sliderValue4.style.left = newLeft4 + 'px'; 
}

updateWaterSavings4();





  document.getElementById('waterSlider5').addEventListener('input', function() {
                var slider5 = document.getElementById('waterSlider5');
                var sliderValue5 = slider5.value;
                var waterSavings5 = sliderValue5 * 1000; // Här kan man ändra 8 till vad ekvationen egentligen skall vara
                document.getElementById('waterSavings5').innerText = waterSavings5;
                var sliderValueElement5 = document.getElementById('sliderValue5');
                sliderValueElement5.innerText = sliderValue5;
                var sliderWidth5 = slider5.offsetWidth;
                var newLeft5 = ((sliderValue5 - 1) / 13) * sliderWidth5; // Justera för det nya intervallet 1-8
                sliderValueElement5.style.left = newLeft5 + 'px';
            });




  document.getElementById('waterSlider6').addEventListener('input', function() {
                var slider6 = document.getElementById('waterSlider6');
                var sliderValue6 = slider6.value;
                var waterSavings6 = sliderValue6 * 55; // Här kan man ändra 8 till vad ekvationen egentligen skall vara
                document.getElementById('waterSavings6').innerText = waterSavings6;
                var sliderValueElement6 = document.getElementById('sliderValue6');
                sliderValueElement6.innerText = sliderValue6;
                var sliderWidth6 = slider6.offsetWidth;
                var newLeft6 = ((sliderValue6 - 1) / 13) * sliderWidth6; // Justera för det nya intervallet 1-8
                sliderValueElement6.style.left = newLeft6 + 'px';
            });



            </script>
        </body>
        </html>
    `;
    return html;
}
