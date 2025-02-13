addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
    const data = await fetchData();
    const sortedMonth = sortData(data, 'Minskning_månad');
    const sortedYear = sortData(data, 'Minskning_år');
    const totalSavings = data[0].Minskning_2025;

    const html = generateHTML(sortedMonth, sortedYear, totalSavings);
    return new Response(html, {
        headers: { 'content-type': 'text/html' },
    });
}

async function fetchData() {
    // Hämta data från en extern källa
    const response = await fetch('https://example.com/data.json');
    return await response.json();
}

function sortData(data, key) {
    return data.sort((a, b) => a[key] - b[key]).slice(0, 3);
}

function generateHTML(sortedMonth, sortedYear, totalSavings) {
    const medalIcons = ["🥇", "🥈", "🥉"];
    let html = `
        <html>
        <head><title>Vattenutmaningen 🏆</title></head>
        <body>
            <h1>Vattenutmaningen 🏆</h1>
            <p><em>(Exempelvis - Kan vi spara 10% tillsammans?)</em></p>
            <h2>Top 3 hyresgäster som sparat mest vatten den här månaden:</h2>
            ${generateLeaderboard(sortedMonth, 'Minskning_månad', medalIcons)}
            <h2>Top 3 hyresgäster som sparat mest vatten under året (2025):</h2>
            ${generateLeaderboard(sortedYear, 'Minskning_år', medalIcons)}
            <h2>Totala besparning för samtliga hyresgäster under 2025:</h2>
            <progress value="${totalSavings}" max="438158000"></progress>
            <p>Ni har tillsammans sparat ${formatNumber(totalSavings)} liter vatten, fantastiskt jobbat! 🎉</p>
        </body>
        </html>
    `;
    return html;
}

function generateLeaderboard(data, key, medalIcons) {
    return data.map((row, index) => {
        const reduction = Math.abs(Math.round(row[key] * 100)) + '%';
        return `<p>${medalIcons[index]} <strong>${row.Objekt}</strong> - ${reduction} minskning</p>`;
    }).join('');
}

function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
