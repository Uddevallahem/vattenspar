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
                    border: 2px solid #365463;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3); /* Lätt skugga */
                    margin-top: 20px;
                    width: 100%; /* Gör boxen responsiv */
                    max-width: 400px; /* Maxbredd */
                    box-sizing: border-box; /* Se till att padding inte överskrider maxbredden */
                }
                
                .box:hover {
                    background-color: #85A1AE;
                    box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.3); /* Ökad skugga vid hover */
                    transform: translateY(-2px); /* Liten upphöjning */
                }
                
                .box:active:not(:has(.slider:active)) {
                    background-color: #2b3e4b;
                    box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.4);
                    transform: translateY(2px);
                }

                .boxg {
                    background-color: #76967D;
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
                    background-color: #8FAF96;
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
    

             <h3>Har ni äldre eller nya vattenkranar?</h3>
<div class="radio-container">
    <label>
            <input type="radio" name="blandare" value="gammal" checked> Äldre
    </label>
    <label>
            <input type="radio" name="blandare" value="ny"> Nya
    </label>
</div>

             
             <div class="container">   

             
    <div class="box" id="infoBox">
        <h2>Diska</h2>
        <p id="questionDuscha" class="hidden">
            <u>Diskar du under rinnande vatten?</u> 
        </p>
        <p id="fraga" class="hidden">
            Dra i reglaget nedan för att ange <b>hur många minuter</b> du brukar diska under rinnande vatten. Se direkt hur mycket vatten du kan spara genom att istället fylla diskhon.
        </p>
        <div class="slider-container hidden" id="sliderContainer">
            <input type="range" min="0" max="15" value="0" class="slider" id="waterSlider">
            <span class="slider-value" id="sliderValue">0</span>
            <div class="slider-labels">
                <span>0</span>
                <span>15</span>
            </div>
            <p id="moreInfo" class="hidden">
                Du kan spara upp till <b><span id="waterSavings">0</span> liter vatten varje gång du diskar!</b> 
            </p>
        </div>
    </div>



    <div class="box" id="infoBox2">
        <h2>Kortare dusch</h2>
        <p id="questionDuscha2" class="hidden">
            Hur många minuter kan du korta ner din duschtid? Dra i reglaget och se direkt hur mycket vatten du sparar!
        </p>
        <div class="slider-container hidden" id="sliderContainer2">
            <input type="range" min="0" max="15" value="0" class="slider" id="waterSlider2">
            <span class="slider-value" id="sliderValue2">1</span>
            <div class="slider-labels">
                <span>0</span>
                <span>15</span>
            </div>
            <p id="moreInfo2" class="hidden">
                Du sparar ungefär <b><span id="waterSavings2">0</span> liter vatten per duschtillfälle</b> genom att korta ner din duschtid med <span id="sliderValueText2">0</span> minuter.
            </p>
        </div>
    </div>



    <div class="box" id="infoBox3">
        <h2>Borsta tänderna</h2>
        <p id="questionDuscha3" class="hidden">
            <u>Borstar ni tänderna med vattenkranen på? </u>
        </p>
        <p id="fraga3" class="hidden">
            Dra i reglaget för att ange <b> hur många personer ni är i hushållet</b> och se hur mycket vatten ni kan spara varje dag genom att stänga av kranen när ni borstar tänderna.
        </p>
        <div class="slider-container hidden" id="sliderContainer3">
            <input type="range" min="0" max="8" value="0" class="slider" id="waterSlider3">
            <span class="slider-value" id="sliderValue3">1</span>
            <div class="slider-labels">
                <span>0</span>
                <span>8</span>
            </div>
            <p id="moreInfo3" class="hidden">
                Ni kan spara  ungefär <b><span id="waterSavings3">0</span> liter vatten per dag</b> genom att stänga av vattnet istället för att låta det rinna.
            </p>
        </div>
    </div>


    <div class="box" id="infoBox4">
        <h2>Duschpaus</h2>
        <p id="questionDuscha4" class="hidden">
            <u>Är vattnet på i duschen när ni använder tvål & schampo?</u>
        </p>
        <p id="fraga4" class="hidden">
            Dra i reglaget för att ange <b>hur många duschar det blir i ert hushåll varje vecka</b> och se hur mycket vatten ni kan spara genom att stänga av vattnet medan ni tvålar in er och schamponerar håret.
        </p>
        <div class="slider-container hidden" id="sliderContainer4">
            <input type="range" min="0" max="49" value="0" class="slider" id="waterSlider4">
            <span class="slider-value" id="sliderValue4">1</span>
            <div class="slider-labels">
                <span>0</span>
                <span>49</span>
            </div>
            <p id="moreInfo4" class="hidden">
                Ni kan spara ungefär <b><span id="waterSavings4">0</span> liter vatten per vecka</b> genom att pausa vattnet i duschen.
            </p>
        </div>
    </div>


    <div class="box" id="infoBox5">
        <h2>Läckande WC</h2>
        <p id="questionDuscha5" class="hidden">
            <u> Hur snabbt felanmäler du en läckande toalett? </u>
        </p>
        <p id="fraga5" class="hidden">
            Dra i reglaget för att ange <b>hur många dagar det brukar ta innan du felanmäler</b> en läckande eller rinnande toalett och se hur mycket vatten som kan förbrukas under den tiden.
        </p>
        <div class="slider-container hidden" id="sliderContainer5">
            <input type="range" min="0" max="14" value="0" class="slider" id="waterSlider5">
            <span class="slider-value" id="sliderValue5">1</span>
            <div class="slider-labels">
                <span>0</span>
                <span>14</span>
            </div>
            <p id="moreInfo5" class="hidden">
                Under den här tiden kan det ha förbrukats ungefär <b><span id="waterSavings5">0</span> liter vatten</b>.
            </p>
        </div>
    </div>


    <div class="box" id="infoBox6">
        <h2>Droppande kran</h2>
        <p id="questionDuscha6" class="hidden">
            <u> Hur snabbt felanmäler du en droppande vattenkran? </u>
        </p>
        <p id="fraga6" class="hidden">
            Dra i reglaget för att ange <b>hur många dagar det brukar ta innan du felanmäler</b> en dropande vattenkran och se hur mycket vatten som kan förbrukas under den tiden.
        </p>
        <div class="slider-container hidden" id="sliderContainer6">
            <input type="range" min="0" max="14" value="0" class="slider" id="waterSlider6">
            <span class="slider-value" id="sliderValue6">1</span>
            <div class="slider-labels">
                <span>0</span>
                <span>14</span>
            </div>
            <p id="moreInfo6" class="hidden">
                Under den här tiden kan det ha förbrukats ungefär <b><span id="waterSavings6">0</span> liter vatten </b>.
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
        var fraga = document.getElementById('fraga');
        var sliderContainer = document.getElementById('sliderContainer');
        if (moreInfo.classList.contains('hidden')) {
            moreInfo.classList.remove('hidden');
            moreInfo.classList.add('visible');
            questionDuscha.classList.remove('hidden');
            questionDuscha.classList.add('visible');
            fraga.classList.remove('hidden');
            fraga.classList.add('visible');
            sliderContainer.classList.remove('hidden');
            sliderContainer.classList.add('visible');
        } else {
            moreInfo.classList.remove('visible');
            moreInfo.classList.add('hidden');
            questionDuscha.classList.remove('visible');
            questionDuscha.classList.add('hidden'); 
            fraga.classList.remove('visible');
            fraga.classList.add('hidden'); 
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
        var fraga3 = document.getElementById('fraga3');
        var sliderContainer = document.getElementById('sliderContainer3');
        if (moreInfo.classList.contains('hidden')) {
            moreInfo.classList.remove('hidden');
            moreInfo.classList.add('visible');
            questionDuscha.classList.remove('hidden');
            questionDuscha.classList.add('visible');
            fraga3.classList.remove('hidden');
            fraga3.classList.add('visible'); 
            sliderContainer.classList.remove('hidden');
            sliderContainer.classList.add('visible');
        } else {
            moreInfo.classList.remove('visible');
            moreInfo.classList.add('hidden');
            questionDuscha.classList.remove('visible');
            questionDuscha.classList.add('hidden');
            fraga3.classList.remove('visible');
            fraga3.classList.add('hidden');
            sliderContainer.classList.remove('visible');
            sliderContainer.classList.add('hidden');
        }
    }
});


document.getElementById('infoBox4').addEventListener('click', function(event) {
    if (event.target.id !== 'waterSlider4') {
        var moreInfo = document.getElementById('moreInfo4');
        var questionDuscha = document.getElementById('questionDuscha4');
        var fraga4 = document.getElementById('fraga4');
        var sliderContainer = document.getElementById('sliderContainer4');
        if (moreInfo.classList.contains('hidden')) {
            moreInfo.classList.remove('hidden');
            moreInfo.classList.add('visible');
            questionDuscha.classList.remove('hidden');
            questionDuscha.classList.add('visible');
            fraga4.classList.remove('hidden');
            fraga4.classList.add('visible'); 
            sliderContainer.classList.remove('hidden');
            sliderContainer.classList.add('visible');
        } else {
            moreInfo.classList.remove('visible');
            moreInfo.classList.add('hidden');
            questionDuscha.classList.remove('visible');
            questionDuscha.classList.add('hidden');
            fraga4.classList.remove('visible');
            fraga4.classList.add('hidden');
            sliderContainer.classList.remove('visible');
            sliderContainer.classList.add('hidden');
        }
    }
});


document.getElementById('infoBox5').addEventListener('click', function(event) {
    if (event.target.id !== 'waterSlider5') {
        var moreInfo = document.getElementById('moreInfo5');
        var questionDuscha = document.getElementById('questionDuscha5');
        var fraga5 = document.getElementById('fraga5');
        var sliderContainer = document.getElementById('sliderContainer5');
        if (moreInfo.classList.contains('hidden')) {
            moreInfo.classList.remove('hidden');
            moreInfo.classList.add('visible');
            questionDuscha.classList.remove('hidden');
            questionDuscha.classList.add('visible');
            fraga5.classList.remove('hidden');
            fraga5.classList.add('visible'); 
            sliderContainer.classList.remove('hidden');
            sliderContainer.classList.add('visible');
        } else {
            moreInfo.classList.remove('visible');
            moreInfo.classList.add('hidden');
            questionDuscha.classList.remove('visible');
            questionDuscha.classList.add('hidden');
            fraga5.classList.remove('visible');
            fraga5.classList.add('hidden');
            sliderContainer.classList.remove('visible');
            sliderContainer.classList.add('hidden');
        }
    }
});


document.getElementById('infoBox6').addEventListener('click', function(event) {
    if (event.target.id !== 'waterSlider6') {
        var moreInfo = document.getElementById('moreInfo6');
        var questionDuscha = document.getElementById('questionDuscha6');
        var fraga6 = document.getElementById('fraga6');
        var sliderContainer = document.getElementById('sliderContainer6');
        if (moreInfo.classList.contains('hidden')) {
            moreInfo.classList.remove('hidden');
            moreInfo.classList.add('visible');
            questionDuscha.classList.remove('hidden');
            questionDuscha.classList.add('visible');
            fraga6.classList.remove('hidden');
            fraga6.classList.add('visible'); 
            sliderContainer.classList.remove('hidden');
            sliderContainer.classList.add('visible');
        } else {
            moreInfo.classList.remove('visible');
            moreInfo.classList.add('hidden');
            questionDuscha.classList.remove('visible');
            questionDuscha.classList.add('hidden');
            fraga6.classList.remove('visible');
            fraga6.classList.add('hidden');
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
    var newLeft = ((sliderVal) / 15) * sliderWidth; 
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
    var newLeft2 = ((sliderVal2) / 15) * sliderWidth2; 
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
        savings3 = sliderVal3 * 24,4;  
    } else if (selectedBlandare === "gammal") {
        savings3 = sliderVal3 * 51,2; 
    }

    savings3 = Math.max(savings3, 0);

    savings3 = Math.round(savings3); 

   
    sliderValue3.innerText = sliderVal3; 
    waterSavings3.innerText = savings3; 

    var sliderWidth3 = slider3.offsetWidth;
    var newLeft3 = ((sliderVal3) / 8) * sliderWidth3; 
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
        savings4 = sliderVal4 * 11,25;  
    } else if (selectedBlandare === "gammal") {
        savings4 = sliderVal4 * 18; 
    }

    savings4 = Math.max(savings4, 0);

    savings4 = Math.round(savings4); 

   
    sliderValue4.innerText = sliderVal4; 
    waterSavings4.innerText = savings4; 

    var sliderWidth4 = slider4.offsetWidth;
    var newLeft4 = ((sliderVal4) / 49) * sliderWidth4; 
    sliderValue4.style.left = newLeft4 + 'px'; 
}

updateWaterSavings4();





// Nummer 5 
const slider5 = document.getElementById("waterSlider5");
const sliderValue5 = document.getElementById("sliderValue5");
const waterSavings5 = document.getElementById("waterSavings5");

slider5.addEventListener("input", updateWaterSavings5);
document.querySelectorAll('input[name="blandare"]').forEach(radio => {
    radio.addEventListener('change', updateWaterSavings5); 
});

function updateWaterSavings5() {
    const sliderVal5 = parseInt(slider5.value); 
    const selectedBlandare = document.querySelector('input[name="blandare"]:checked') ? document.querySelector('input[name="blandare"]:checked').value : "ny"; 
    
    let savings5 = 0;

    // HÄR GÖRS FUNKTIONERNA
    if (selectedBlandare === "ny") {
        savings5 = sliderVal5 * 1000;  
    } else if (selectedBlandare === "gammal") {
        savings5 = sliderVal5 * 1000; 
    }

    savings5 = Math.max(savings5, 0);

    savings5 = Math.round(savings5); 

   
    sliderValue5.innerText = sliderVal5; 
    waterSavings5.innerText = savings5; 

    var sliderWidth5 = slider5.offsetWidth;
    var newLeft5 = ((sliderVal5) / 14) * sliderWidth5; 
    sliderValue5.style.left = newLeft5 + 'px'; 
}

updateWaterSavings5();





// Nummer 6 
const slider6 = document.getElementById("waterSlider6");
const sliderValue6 = document.getElementById("sliderValue6");
const waterSavings6 = document.getElementById("waterSavings6");

slider6.addEventListener("input", updateWaterSavings6);
document.querySelectorAll('input[name="blandare"]').forEach(radio => {
    radio.addEventListener('change', updateWaterSavings6); 
});

function updateWaterSavings6() {
    const sliderVal6 = parseInt(slider6.value); 
    const selectedBlandare = document.querySelector('input[name="blandare"]:checked') ? document.querySelector('input[name="blandare"]:checked').value : "ny"; 
    
    let savings6 = 0;

    // HÄR GÖRS FUNKTIONERNA
    if (selectedBlandare === "ny") {
        savings6 = sliderVal6 * 55;  
    } else if (selectedBlandare === "gammal") {
        savings6 = sliderVal6 * 55; 
    }

    savings6 = Math.max(savings6, 0);

    savings6 = Math.round(savings6); 

   
    sliderValue6.innerText = sliderVal6; 
    waterSavings6.innerText = savings6; 

    var sliderWidth6 = slider6.offsetWidth;
    var newLeft6 = ((sliderVal6) / 14) * sliderWidth6; 
    sliderValue6.style.left = newLeft6 + 'px'; 
}

updateWaterSavings6();





            </script>
        </body>
        </html>
    `;
    return html;
}
