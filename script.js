
vkBridge.send('VKWebAppInit');

let count = 0;
const clickDisplay = document.getElementById("clicks");
const jokeDisplay = document.getElementById("joke");
const memesContainer = document.getElementById("memes");
const jokes = ["Опять потёк...", "Минус сальник", "Тосол не забудь!", "Где мои ковры?", "Лонжероны держатся на вере"];

document.getElementById("moskvich").addEventListener("click", () => {
  count++;
  clickDisplay.textContent = "Кликов: " + count;
  if (count % 10 === 0) {
    const joke = jokes[Math.floor(Math.random() * jokes.length)];
    jokeDisplay.textContent = joke;
  }
  if (count === 20) showMeme("meme1.jpg");
  if (count === 50) showMeme("meme2.jpg");
  if (count === 100) showMeme("meme3.jpg");

  // Пример сохранения кликов в VK Storage
  vkBridge.send("VKWebAppStorageSet", {
    key: "moskvich_clicks",
    value: count.toString()
  }).catch((e) => console.error("Ошибка VK Storage", e));
});

// При загрузке пробуем загрузить счёт из VK Storage
vkBridge.send("VKWebAppStorageGet", {
  keys: ["moskvich_clicks"]
}).then(data => {
  const value = data.keys[0]?.value;
  if (value) {
    count = parseInt(value);
    clickDisplay.textContent = "Кликов: " + count;
  }
}).catch((e) => console.error("Ошибка загрузки VK Storage", e));

function showMeme(filename) {
  const img = document.createElement("img");
  img.src = filename;
  memesContainer.appendChild(img);
}
