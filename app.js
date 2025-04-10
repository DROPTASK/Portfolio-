// app.js

let coins = []; let portfolio = JSON.parse(localStorage.getItem("portfolio")) || []; let currentCoin = null;

async function fetchCoins() { const res = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true"); const data = await res.json(); coins = data; renderCoins(); }

function renderCoins() { const container = document.getElementById("coinsContainer"); container.innerHTML = ""; coins.forEach((coin) => { const div = document.createElement("div"); div.className = "coin"; div.innerHTML = <div> <h3>${coin.name} (${coin.symbol.toUpperCase()})</h3> <p>$${coin.current_price}</p> <canvas id="chart-${coin.id}"></canvas> </div> <div> <button class="buy-btn" onclick='openTrade("buy", ${JSON.stringify(coin)})'>Buy</button> <button class="sell-btn" onclick='openTrade("sell", ${JSON.stringify(coin)})'>Sell</button> </div>; container.appendChild(div); renderChart(chart-${coin.id}, coin.sparkline_in_7d.price); }); }

function renderChart(id, data) { const ctx = document.getElementById(id).getContext("2d"); new Chart(ctx, { type: "line", data: { labels: data.map((_, i) => i), datasets: [{ data: data, borderColor: "#fcd535", borderWidth: 1, tension: 0.3, pointRadius: 0, }] }, options: { responsive: false, plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } }, } }); }

function openTrade(type, coin) { currentCoin = { ...coin, type }; document.getElementById("tradeTitle").textContent = ${type.toUpperCase()} ${coin.name}; document.getElementById("tradeModal").style.display = "flex"; }

document.getElementById("closeModal").onclick = () => { document.getElementById("tradeModal").style.display = "none"; };

document.getElementById("confirmTrade").onclick = () => { const amount = parseFloat(document.getElementById("tradeAmount").value); const leverage = parseFloat(document.getElementById("tradeLeverage").value); if (isNaN(amount) || amount <= 0 || isNaN(leverage) || leverage < 1) return alert("Invalid input");

const totalAmount = amount * leverage;

if (currentCoin.type === "buy") { const existing = portfolio.find(c => c.id === currentCoin.id); if (existing) { existing.amount += totalAmount / currentCoin.current_price; } else { portfolio.push({ id: currentCoin.id, name: currentCoin.name, symbol: currentCoin.symbol, amount: totalAmount / currentCoin.current_price, price: currentCoin.current_price, }); } } else if (currentCoin.type === "sell") { portfolio = portfolio.filter(c => c.id !== currentCoin.id); }

localStorage.setItem("portfolio", JSON.stringify(portfolio)); renderPortfolio(); document.getElementById("tradeModal").style.display = "none"; };

function renderPortfolio() { const container = document.getElementById("portfolioContainer"); container.innerHTML = ""; portfolio.forEach((coin) => { const div = document.createElement("div"); div.className = "portfolio-item"; const totalValue = (coin.amount * coins.find(c => c.id === coin.id)?.current_price || coin.price).toFixed(2); div.innerHTML = <div> <h3>${coin.name} (${coin.symbol.toUpperCase()})</h3> <p>Holding: ${coin.amount.toFixed(4)} | Value: $${totalValue}</p> </div>; container.appendChild(div); }); }

function showTab(id) { document.querySelectorAll(".tab-content").forEach(el => el.classList.remove("active")); document.getElementById(id).classList.add("active"); }

document.getElementById("themeToggle").onclick = () => { document.body.classList.toggle("dark"); document.getElementById("themeToggle").textContent = document.body.classList.contains("dark") ? "☀️" : "🌙"; };

fetchCoins(); renderPortfolio();

