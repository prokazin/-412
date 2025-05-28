
let speed = 0;
let increment = 2;
let lossRate = 1;
let autoSpeedInterval = null;
let jokeTimer = 0;
const speedDisplay = document.getElementById("speed");
const jokeDisplay = document.getElementById("joke");
const clickSound = document.getElementById("click-sound");
const jokes = ["Опять потёк...", "Минус сальник", "Где мои ковры?", "Тосол долей", "Завёлся с толкача"];

document.getElementById("moskvich").addEventListener("click", () => {
  speed += increment;
  clickSound.currentTime = 0;
  clickSound.play();
  updateDisplay();
  saveGame();
});

function updateDisplay() {
  speedDisplay.textContent = "Скорость: " + Math.floor(speed) + " км/ч";
}

function buy(item) {
  if (item === "spoiler" && speed >= 20) {
    speed -= 20;
    increment += 1;
    alert("Установлен спойлер!");
  }
  if (item === "tape" && speed >= 50) {
    speed -= 50;
    lossRate = 0.5;
    alert("Замотали изолентой!");
  }
  if (item === "chrome" && speed >= 100) {
    speed -= 100;
    if (!autoSpeedInterval) {
      autoSpeedInterval = setInterval(() => {
        speed += 3;
        updateDisplay();
        saveGame();
      }, 1000);
    }
    alert("Теперь хром блестит!");
  }
  updateDisplay();
  saveGame();
}

function resetGame() {
  speed = 0;
  increment = 2;
  lossRate = 1;
  if (autoSpeedInterval) clearInterval(autoSpeedInterval);
  autoSpeedInterval = null;
  updateDisplay();
  saveGame();
}

setInterval(() => {
  speed = Math.max(0, speed - lossRate);
  updateDisplay();
  jokeTimer++;
  if (jokeTimer % 10 === 0 && speed > 0) {
    const joke = jokes[Math.floor(Math.random() * jokes.length)];
    jokeDisplay.textContent = joke;
  }
  saveGame();
}, 1000);

// ---- Сохранение через VK Bridge ----

async function saveGame() {
  try {
    const data = {
      speed,
      increment,
      lossRate,
      autoSpeed: !!autoSpeedInterval
    };
    await vkBridge.send("VKWebAppStorageSet", {
      key: "moskvich_state",
      value: JSON.stringify(data)
    });
  } catch (e) {
    console.warn("Ошибка сохранения:", e);
  }
}

async function loadGame() {
  try {
    const result = await vkBridge.send("VKWebAppStorageGet", {
      keys: ["moskvich_state"]
    });
    const stored = result.keys.find(item => item.key === "moskvich_state");
    if (stored && stored.value) {
      const data = JSON.parse(stored.value);
      speed = data.speed || 0;
      increment = data.increment || 2;
      lossRate = data.lossRate || 1;
      if (data.autoSpeed) {
        autoSpeedInterval = setInterval(() => {
          speed += 3;
          updateDisplay();
          saveGame();
        }, 1000);
      }
    }
  } catch (e) {
    console.warn("Ошибка загрузки:", e);
  } finally {
    updateDisplay();
  }
}

vkBridge.send("VKWebAppInit").then(loadGame);
