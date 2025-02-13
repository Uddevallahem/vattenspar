export default {
  async fetch(request) {
    const data = {
      leaderboardMonth: [
        { objekt: "Hyresgäst A", minskning: 0.12 },
        { objekt: "Hyresgäst B", minskning: 0.10 },
        { objekt: "Hyresgäst C", minskning: 0.08 }
      ],
      leaderboardYear: [
        { objekt: "Hyresgäst X", minskning: 0.25 },
        { objekt: "Hyresgäst Y", minskning: 0.20 },
        { objekt: "Hyresgäst Z", minskning: 0.18 }
      ],
      totalSavings: 200000000,
      maxValue: 438158000,
      actions: [
        "Stäng av vattnet när du tvålar in dig",
        "Duscha kortare",
        "Se över läckande kranar och toaletter",
        "Minimera vattenanvändning vid disk och tvätt",
        "Välj kortare tvättprogram",
        "Samla regnvatten för bevattning",
        "Skölj förpackningar med diskvatten",
        "Ha vatten i kylskåpet",
        "Diska inte under rinnande vatten",
        "Stäng av vattnet när du borstar tänderna"
      ]
    };

    const html = `
      <!DOCTYPE html>
      <html lang="sv">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Vattenutmaningen</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; text-align: center; }
          .leaderboard { margin-top: 20px; }
          .entry { font-size: 18px; margin: 5px 0; }
          .progress-container { width: 80%; background: #ddd; border-radius: 10px; margin: 20px auto; overflow: hidden; }
          .progress-bar { height: 20px; background: green; width: 0%; transition: width 1s; }
          .action { margin-top: 10px; text-align: left; }
        </style>
      </head>
      <body>
        <h1>Vattenutmaningen 🏆</h1>
        <p>Top 3 hyresgäster som sparat mest vatten denna månad:</p>
        <div class="leaderboard" id="leaderboardMonth"></div>
        <p>Top 3 hyresgäster som sparat mest vatten under året:</p>
        <div class="leaderboard" id="leaderboardYear"></div>
        <h2>Totala besparingen 2025</h2>
        <div class="progress-container">
          <div class="progress-bar" id="progress-bar"></div>
        </div>
        <p id="total-savings"></p>
        <h2>Åtgärdsförslag</h2>
        <div id="actions"></div>
        <script>
          const data = ${JSON.stringify(data)};
          function renderLeaderboard(id, list) {
            const div = document.getElementById(id);
            const medals = ['🥇', '🥈', '🥉'];
            list.forEach((entry, index) => {
              div.innerHTML += `<div class='entry'>${medals[index]} <b>${entry.objekt}</b> - ${Math.abs(entry.minskning * 100)}% minskning</div>`;
            });
          }
          function renderActions() {
            const div = document.getElementById("actions");
            data.actions.forEach(action => {
              div.innerHTML += `<div class='action'><input type='checkbox'> ${action}</div>`;
            });
          }
          document.getElementById("progress-bar").style.width = (data.totalSavings / data.maxValue * 100) + "%";
          document.getElementById("total-savings").innerText = `Ni har tillsammans sparat ${data.totalSavings.toLocaleString()} liter vatten! 🎉`;
          renderLeaderboard("leaderboardMonth", data.leaderboardMonth);
          renderLeaderboard("leaderboardYear", data.leaderboardYear);
          renderActions();
        </script>
      </body>
      </html>
    `;
    
    return new Response(html, { headers: { "Content-Type": "text/html" } });
  }
};
