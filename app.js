let coins = [];
let portfolio = JSON.parse(localStorage.getItem("portfolio")) || [];
let currentCoin = null;

async function fetchCoins() {
  const res = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true");
  const data = await res.json();
  coins = data;
  renderAll();
}

function renderAll() {
  renderCoins("market", coins);
  renderCoins("gainers", [...coins].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h).slice(0, 10));
  renderCoins("losers", [...coins].sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h).slice(0, 10));
  renderPortfolio();
}

function renderCoins(sectionId, list) {
  const container = document.getElementById(sectionId);
  container.innerHTML = "";
  list.forEach((coin) => {
    const div = document.createElement("div");
    div.className = "coin";
    div.innerHTML = `
      <div>
        <h3>${coin.name} (${coin.symbol.toUpperCase()})</h3>
        <p>Price: $${coin.current_price}</p>
        <canvas id="chart-${coin.id}" width="100" height="30"></canvas>
      </div>
      <div>
        <button class="buy-btn" onclick='openTrade("buy", ${JSON.stringify(coin)})'>Buy</button>
        <button class="sell-btn" onclick='openTrade("sell", ${JSON.stringify(coin)})'>Sell</button>
      </div>
    `;
    container.appendChild(div);
    renderChart(`chart-${coin.id}`, coin.sparkline_in_7d.price);
  });
}

function renderChart(id, data) {
  const ctx = document.getElementById(id).getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: data.map((_, i) => i),
      datasets: [{
        data: data,
        borderColor: "#fcd535",
        borderWidth: 1,
        tension: 0.4,
        pointRadius: 0
      }]
    },
    options: {
      responsive: false,
      plugins: { legend: { display: false } },
      scales: { x: { display: false }, y: { display: false } },
    }
  });
}

function openTrade(type, coin) {
  currentCoin = { ...coin, type };
  document.getElementById("tradeTitle").textContent = `${type.toUpperCase()} ${coin.name}`;
  document.getElementById("tradeModal").style.display = "flex";
}

document.getElementById("closeModal").onclick = () => {
  document.getElementById("tradeModal").style.display = "none";
};

document.getElementById("confirmTrade").onclick = () => {
  const amount = parseFloat(document.getElementById("tradeAmount").value);
  const leverage = parseFloat(document.getElementById("tradeLeverage").value);
  if (!amount || !leverage) return alert("Invalid values");

  const total = amount * leverage;

  if (currentCoin.type === "buy") {
    const existing = portfolio.find(c => c.id === currentCoin.id);
    if (existing) {
      existing.amount += total / currentCoin.current_price;
    } else {
      portfolio.push({
        id: currentCoin.id,
        name: currentCoin.name,
        symbol: currentCoin.symbol,
        amount: total / currentCoin.current_price,
        price: currentCoin.current_price
      });
    }
  } else {
    portfolio = portfolio.filter(c => c.id !== currentCoin.id);
  }

  localStorage.setItem("portfolio", JSON.stringify(portfolio));
  document.getElementById("tradeModal").style.display = "none";
  renderPortfolio();
};

function renderPortfolio() {
  const container = document.getElementById("portfolioContainer");
  container.innerHTML = "";
  portfolio.forEach((coin) => {
    const price = coins.find(c => c.id === coin.id)?.current_price || coin.price;
    const totalValue = (coin.amount * price).toFixed(2);
    const div = document.createElement("div");
    div.className = "portfolio-item";
    div.innerHTML = `
      <div>
        <h3>${coin.name} (${coin.symbol.toUpperCase()})</h3>
        <p>Holding: ${coin.amount.toFixed(4)} | Value: $${totalValue}</p>
      </div>
    `;
    container.appendChild(div);
  });
}

function showTab(id) {
  document.querySelectorAll(".tab-content").forEach(el => el.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

document.getElementById("themeToggle").onclick = () => {
  document.body.classList.toggle("dark");
  document.getElementById("themeToggle").textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
};

fetchCoins();
