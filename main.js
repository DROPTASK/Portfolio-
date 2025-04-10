let coins = []; let portfolio = JSON.parse(localStorage.getItem("portfolio")) || []; let balance = parseFloat(localStorage.getItem("balance")) || 10000;

const coinList = document.getElementById("coin-list"); const portfolioCards = document.getElementById("portfolioCards"); const portfolioView = document.getElementById("portfolioView"); const balanceDisplay = document.getElementById("balance"); const tabs = document.querySelectorAll(".tab"); const themeToggle = document.getElementById("themeToggle"); const themeIcon = document.getElementById("themeIcon"); const tradeModal = document.getElementById("tradeModal"); const tradeAmount = document.getElementById("tradeAmount"); const tradeTitle = document.getElementById("tradeTitle"); const confirmTrade = document.getElementById("confirmTrade"); const cancelTrade = document.getElementById("cancelTrade"); const customModal = document.getElementById("customModal"); const customAddress = document.getElementById("customAddress"); const confirmCustom = document.getElementById("confirmCustom"); const cancelCustom = document.getElementById("cancelCustom");

let currentTrade = null; let currentTab = "hot";

balanceDisplay.textContent = balance.toFixed(2);

async function fetchCoins() { const res = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=true"); const all = await res.json(); coins = all.slice(0, 10000); renderCoins(); }

function renderCoins() { coinList.innerHTML = ""; portfolioView.classList.add("hidden"); coinList.classList.remove("hidden"); let filtered = coins; if (currentTab === "gainers") filtered = [...coins].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h).slice(0, 20); if (currentTab === "losers") filtered = [...coins].sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h).slice(0, 20); if (currentTab === "hot") filtered = coins.slice(0, 20); filtered.forEach((coin) => { const div = document.createElement("div"); div.className = "p-4 glass rounded-xl shadow text-center"; div.innerHTML = <img src="${coin.image}" class="w-12 h-12 mx-auto"/> <h2 class="font-bold mt-2">${coin.name}</h2> <p>$${coin.current_price}</p> <p class="text-sm ${coin.price_change_percentage_24h > 0 ? 'text-green-500' : 'text-red-500'}"> ${coin.price_change_percentage_24h.toFixed(2)}% </p> <button onclick="openTrade('${coin.id}', 'buy')" class="mt-2 px-4 py-1 bg-green-500 text-white rounded">Buy</button> <button onclick="openTrade('${coin.id}', 'sell')" class="mt-1 px-4 py-1 bg-red-500 text-white rounded">Sell</button>; coinList.appendChild(div); }); }

function openTrade(id, type) { currentTrade = { id, type }; const coin = coins.find(c => c.id === id); tradeTitle.textContent = ${type.toUpperCase()} ${coin.name}; tradeAmount.value = ""; tradeModal.classList.remove("hidden"); }

function executeTrade() { const coin = coins.find(c => c.id === currentTrade.id); const amount = parseFloat(tradeAmount.value); if (!amount || amount <= 0) return; if (currentTrade.type === "buy") { if (amount > balance) return; balance -= amount; const qty = amount / coin.current_price; const existing = portfolio.find(p => p.id === coin.id); if (existing) existing.qty += qty; else portfolio.push({ id: coin.id, name: coin.name, image: coin.image, qty }); } else { const holding = portfolio.find(p => p.id === coin.id); if (!holding || holding.qty * coin.current_price < amount) return; const qty = amount / coin.current_price; holding.qty -= qty; balance += amount; if (holding.qty <= 0.00001) portfolio = portfolio.filter(p => p.id !== coin.id); } updatePortfolio(); tradeModal.classList.add("hidden"); }

function updatePortfolio() { localStorage.setItem("portfolio", JSON.stringify(portfolio)); localStorage.setItem("balance", balance); balanceDisplay.textContent = balance.toFixed(2); }

function showPortfolio() { portfolioView.classList.remove("hidden"); coinList.classList.add("hidden"); portfolioCards.innerHTML = ""; portfolio.forEach((p) => { const coin = coins.find(c => c.id === p.id); const value = (coin.current_price * p.qty).toFixed(2); const div = document.createElement("div"); div.className = "p-4 glass rounded-xl shadow text-center"; div.innerHTML = <img src="${p.image}" class="w-12 h-12 mx-auto"/> <h2 class="font-bold mt-2">${p.name}</h2> <p>${p.qty.toFixed(4)} coins</p> <p>$${value}</p>; portfolioCards.appendChild(div); }); }

function toggleTheme() { document.body.classList.toggle("bg-white"); document.body.classList.toggle("bg-gray-900"); document.body.classList.toggle("text-gray-800"); 
                      document.body.classList.toggle("text-white"); themeIcon.classList.toggle("fa-sun"); themeIcon.classList.toggle("fa-moon"); }

function addCustomCoin(address) { // dummy data for custom coin simulation const fake = { id: address, name: "Custom Coin", image: "https://via.placeholder.com/50", current_price: 1, price_change_percentage_24h: 0 }; coins.unshift(fake); renderCoins(); }

tabs.forEach((tab) => { tab.onclick = () => { tabs.forEach(t => t.classList.remove("tab-active")); tab.classList.add("tab-active"); currentTab = tab.dataset.tab; if (currentTab === "portfolio") showPortfolio(); else renderCoins(); }; });

themeToggle.onclick = toggleTheme; confirmTrade.onclick = executeTrade; cancelTrade.onclick = () => tradeModal.classList.add("hidden");

addCustomCoinBtn = document.getElementById("addCustomCoin"); addCustomCoinBtn.onclick = () => customModal.classList.remove("hidden"); confirmCustom.onclick = () => { const addr = customAddress.value.trim(); if (addr) addCustomCoin(addr); customModal.classList.add("hidden"); }; cancelCustom.onclick = () => customModal.classList.add("hidden");

fetchCoins();

