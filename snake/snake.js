const CANVAS_SIZE = Math.min(Math.round(Math.floor(window.innerWidth / 60)) * 50, 600);
const CELL_SIZE = CANVAS_SIZE / 20;
const FPS = 5;
const SNAKE_COLOR = "#77b355"
const FOOD_COLOR = "orange"

const snake = {
  body: [{ x: 0, y: 0 }],
  direction: "right",

  move() {
    let lastCell = {
      x: snake.body[0].x,
      y: snake.body[0].y
    };
    if (snake.direction === "up") {
      snake.body[0].y -= CELL_SIZE;
    } else if (snake.direction === "right") {
      snake.body[0].x += CELL_SIZE;
    } else if (snake.direction === "down") {
      snake.body[0].y += CELL_SIZE;
    } else if (snake.direction === "left") {
      snake.body[0].x -= CELL_SIZE;
    }

    for (let i = 1; i < snake.body.length; ++i) {
      const tempCell = { x: snake.body[i].x, y: snake.body[i].y };
      snake.body[i] = lastCell;
      lastCell = tempCell;
    }
  },

  reset() {
    this.body = [{ x: 0, y: 0 }];
    this.direction = "right";
  },

  isOutOfBounds() {
    return this.body[0].x < 0 || this.body[0].x >= CANVAS_SIZE
      || this.body[0].y < 0 || this.body[0].y >= CANVAS_SIZE;
  },

  isEatingSelf() {
    return this.body.slice(1).some(cell => cell.x === this.body[0].x && cell.y === this.body[0].y);
  },

  getTail() {
    const tail = this.body[this.body.length - 1];
    return { x: tail.x, y: tail.y };
  }
};

const food = {
  x: 0,
  y: 0,

  newPosition() {
    const { x, y } = getRandomFoodPosition();
    this.x = x;
    this.y = y;
  }
};

let isPlaying = false;
let gameSpeed = 0;
let timerId;
let touchStartX = 0;
let touchStartY = 0;
let score = 0;

document.addEventListener("keyup", handleKeyInput);
document.addEventListener("touchstart", handleTouchStart);
document.addEventListener("touchend", handleTouchEnd);

const startButton = document.getElementById("start-btn")
startButton.addEventListener("click", startGame)

const scoreSpan = document.getElementById("score");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

function update() {
  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  const tail = snake.getTail();
  snake.move();

  if (snake.isOutOfBounds() || snake.isEatingSelf()) {
    resetGame();
  }

  if (isEatingFood()) {
    food.newPosition();
    snake.body.push(tail);
    updateSpeed();
    scoreSpan.innerText = ++score;
  }

  drawSnake();
  drawFood();
}

function startGame() {
  food.newPosition();
  startGameLoop();
  startButton.disabled = true;
}

function resetGame() {
  snake.reset();
  clearInterval(timerId);
  gameSpeed = 0;
  startButton.disabled = false;
  score = 0;
  scoreSpan.innerText = "0";
}

function startGameLoop() {
  timerId = setInterval(update, 1000 / FPS);
}

function updateSpeed() {
  gameSpeed += 3;
  clearInterval(timerId);
  timerId = setInterval(update, (1000 / FPS) - gameSpeed);
}

function isEatingFood() {
  return food.x === snake.body[0].x && food.y === snake.body[0].y;
}

function drawSnake() {
  ctx.fillStyle = SNAKE_COLOR;
  const head = snake.body[0];
  ctx.fillRect(head.x, head.y, CELL_SIZE, CELL_SIZE);

  ctx.fillStyle = "black";
  if (snake.direction == "right") {
    ctx.beginPath();
    ctx.arc(head.x + CELL_SIZE - CELL_SIZE / 3, head.y + CELL_SIZE / 3, CELL_SIZE / 8, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(head.x + CELL_SIZE - CELL_SIZE / 3, head.y + CELL_SIZE - CELL_SIZE / 3, CELL_SIZE / 8, 0, 2 * Math.PI);
    ctx.stroke();
  } else if (snake.direction == "left") {
    ctx.beginPath();
    ctx.arc(head.x + CELL_SIZE / 3, head.y + CELL_SIZE / 3, CELL_SIZE / 8, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(head.x + CELL_SIZE / 3, head.y + CELL_SIZE - CELL_SIZE / 3, CELL_SIZE / 8, 0, 2 * Math.PI);
    ctx.stroke();
  } else if (snake.direction == "up") {
    ctx.beginPath();
    ctx.arc(head.x + CELL_SIZE / 3, head.y + CELL_SIZE / 3, CELL_SIZE / 8, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(head.x + CELL_SIZE - CELL_SIZE / 3, head.y + CELL_SIZE / 3, CELL_SIZE / 8, 0, 2 * Math.PI);
    ctx.stroke();
  } else if (snake.direction == "down") {
    ctx.beginPath();
    ctx.arc(head.x + CELL_SIZE / 3, head.y + CELL_SIZE - CELL_SIZE / 3, CELL_SIZE / 8, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(head.x + CELL_SIZE - CELL_SIZE / 3, head.y + CELL_SIZE - CELL_SIZE / 3, CELL_SIZE / 8, 0, 2 * Math.PI);
    ctx.stroke();
  }


  ctx.fillStyle = SNAKE_COLOR;
  snake.body.forEach((cell, i) => {
    if (i != 0) {
      ctx.fillRect(cell.x, cell.y, CELL_SIZE, CELL_SIZE);
    }
  })
}

function drawFood() {
  ctx.fillStyle = FOOD_COLOR;
  ctx.fillRect(food.x, food.y, CELL_SIZE, CELL_SIZE);
}

function getRandomFoodPosition() {
  let cell = getRandomCell();
  while (snake.body.filter(v => v.x === cell.x && v.y === cell.y).length > 0) {
    cell = getRandomCell();
  };
  return { x: cell.x, y: cell.y };
}

function getRandomCell() {
  return {
    x: getRandomIntInRange(0, CANVAS_SIZE / CELL_SIZE - 1) * CELL_SIZE,
    y: getRandomIntInRange(0, CANVAS_SIZE / CELL_SIZE - 1) * CELL_SIZE
  };
}

function getRandomIntInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function handleKeyInput(e) {
  if (['ArrowUp', 'w'].includes(e.key) && snake.direction != "down") {
    snake.direction = "up";
  } else if (['ArrowRight', 'd'].includes(e.key) && snake.direction != "left") {
    snake.direction = "right";
  } else if (['ArrowDown', 's'].includes(e.key) && snake.direction != "up") {
    snake.direction = "down";
  } else if (['ArrowLeft', 'a'].includes(e.key) && snake.direction != "right") {
    snake.direction = "left";
  }
}

function handleTouchStart(e) {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
}

function handleTouchEnd(e) {
  const touchEndX = e.changedTouches[0].screenX
  const touchEndY = e.changedTouches[0].screenY

  xDistance = touchEndX - touchStartX;
  yDistance = touchEndY - touchStartY;

  if (Math.abs(xDistance) > Math.abs(yDistance)) {
    if (xDistance > 0 && snake.direction != "left") {
      snake.direction = "right";
    } else if (xDistance < 0 && snake.direction != "right") {
      snake.direction = "left";
    }
  } else if (Math.abs(yDistance) > Math.abs(xDistance)) {
    if (yDistance > 0 && snake.direction != "up") {
      snake.direction = "down";
    } else if (yDistance < 0 && snake.direction != "down") {
      snake.direction = "up";
    }
  }
}
