const canvas = document.querySelector(".game-canvas");
const ctx = canvas.getContext("2d");
const startBtn = document.querySelector(".game-start");
const resetBtn = document.querySelector(".game-reset");
const scoreElement = document.querySelector(".game-score");

// Розмір клітинки і кількість клітинок
const cellSize = 20;
const cellCount = canvas.width / cellSize;

// Переваги для зображень
const snakeImg = new Image();
snakeImg.src = "img/snake.png";

const foodImg = new Image();
foodImg.src = "img/cherry.png";

// Змінні для управління грою
let snake = [];
let food = {};
let score = 0;
let isGameOver = true;
let direction = "right";

// Функція старту гри
function startGame() {
  if (isGameOver) {
    isGameOver = false;
    snake = [
      { x: 3, y: 1 },
      { x: 2, y: 1 },
      { x: 1, y: 1 },
    ];
    food = createFood();
    score = 0;
    direction = "right";
    scoreElement.textContent = "Очки: " + score;
    gameLoop();
  }
}

// Функція перезапуску гри
function resetGame() {
  isGameOver = true;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Функція створення їжі
function createFood() {
  return {
    x: Math.floor(Math.random() * cellCount),
    y: Math.floor(Math.random() * cellCount),
  };
}

// Функція перевірки столкнення зі стінами або самою собою
function checkCollision(head) {
  return (
    head.x < 0 ||
    head.x >= cellCount ||
    head.y < 0 ||
    head.y >= cellCount ||
    snake.some((segment) => segment.x === head.x && segment.y === head.y)
  );
}

// Функція головного ігрового циклу
function gameLoop() {
  if (isGameOver) return;

  // Оновлення позиції змійки
  const head = { ...snake[0] };
  switch (direction) {
    case "up":
      head.y -= 1;
      break;
    case "down":
      head.y += 1;
      break;
    case "left":
      head.x -= 1;
      break;
    case "right":
      head.x += 1;
      break;
  }

  // Перевірка столкнення
  if (checkCollision(head)) {
    isGameOver = true;
    alert("Гра закінчена. Ваш рахунок: " + score);
    return;
  }

  // Додавання голови до змійки
  snake.unshift(head);

  // Перевірка, чи змійка з'їла їжу
  if (head.x === food.x && head.y === food.y) {
    score += 1;
    scoreElement.textContent = "Очки: " + score;
    food = createFood();
  } else {
    // Видалення хвоста змійки, якщо не з'їла їжу
    snake.pop();
  }

  // Очищення полотна
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Малювання їжі
  ctx.drawImage(
    foodImg,
    food.x * cellSize,
    food.y * cellSize,
    cellSize,
    cellSize
  );

  // Малювання змійки
  snake.forEach((segment) => {
    ctx.drawImage(
      snakeImg,
      segment.x * cellSize,
      segment.y * cellSize,
      cellSize,
      cellSize
    );
  });

  // Перехід до наступного кадру через 300 мілісекунд (повільніший рух)
  setTimeout(gameLoop, 300);
}

// Обробник клавіш для управління змійкою
function handleKeyPress(event) {
  switch (event.key) {
    case "ArrowUp":
      direction = "up";
      break;
    case "ArrowDown":
      direction = "down";
      break;
    case "ArrowLeft":
      direction = "left";
      break;
    case "ArrowRight":
      direction = "right";
      break;
  }
}

// Додавання обробників подій до кнопок
startBtn.addEventListener("click", startGame);
resetBtn.addEventListener("click", resetGame);
window.addEventListener("keydown", handleKeyPress);
