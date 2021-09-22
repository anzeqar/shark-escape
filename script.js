const div = document.querySelector(".container");
const moveUp = document.querySelector("#up");
const moveDown = document.querySelector("#down");
const moveLeft = document.querySelector("#left");
const moveRight = document.querySelector("#right");
var heightRatio = 1.7777777777;
var fish;
var background;
var score;
function startGame() {
  gameConfig.start();
  background = new component(
    960,
    486,
    "./img/game-background.png",
    0,
    0,
    "background"
  );
  fish = new component(70, 50, "./img/fish.png", 10, 216, "image");
  shark = new component(160, 70, "./img/shark.png", 600, 205, "image");
  score = new component("30px", "Helvetica", "maroon", 550, 40, "text");
}
var gameConfig = {
  canvas: document.createElement("canvas"),
  start: function () {
    this.canvas.height = 486;
    this.canvas.width = this.canvas.height * 1.777777;

    this.context = this.canvas.getContext("2d");
    div.insertBefore(this.canvas, div.childNodes[0]);
    this.interval = setInterval(gameFrame, 20);
    this.frames = 0;
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop: function () {
    clearInterval(this.interval);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  },
};

function intervalFrames(n) {
  if ((gameConfig.frames / n) % 1 == 0) return true;
  return false;
}
function component(width, height, color, x, y, type) {
  this.type = type;
  if (this.type == "image" || this.type == "background") {
    this.image = new Image();
    this.image.src = color;
  }
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;
  this.update = function () {
    var ctx = gameConfig.canvas.getContext("2d");
    if (type == "image" || type == "background") {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      if (type == "background") {
        ctx.drawImage(
          this.image,
          this.x + this.width,
          this.y,
          this.width,
          this.height
        );
      }
    } else if (type == "text") {
      ctx.font = this.width + " " + this.height;
      ctx.fillStyle = color;
      ctx.fillText(this.text, this.x, this.y);
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  };
  this.newPosition = function () {
    if (fish.x < 0) {
      fish.speedX = 0;
      fish.x = 2;
    } else if (fish.x + fish.width > 864) {
      fish.speedX = 0;
      fish.x = 862 - fish.width;
    } else if (fish.y < 0) {
      fish.speedY = 0;
      fish.y = 2;
    } else if (fish.y + fish.height > 486) {
      fish.speedY = 0;
      fish.y = 486 - fish.height;
    } else {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.type == "background") {
        if (this.x == -this.width) {
          this.x = 0;
        }
      }
    }
  };
  this.collideShark = function (shark) {
    var fishLeft = this.x;
    var fishRight = this.x + this.width;
    var fishTop = this.y;
    var fishBottom = this.y + this.height;
    var sharkLeft = shark.x;
    var sharkRight = shark.x + shark.width;
    var sharkTop = shark.y;
    var sharkBottom = shark.y + shark.height;
    var collide = true;
    if (
      fishBottom < sharkTop ||
      fishTop > sharkBottom ||
      fishRight < sharkLeft ||
      fishLeft > sharkRight
    ) {
      collide = false;
    } else {
      collide = true;
    }
    return collide;
  };
}
var sharks = [];
function gameFrame() {
  for (i = 0; i < sharks.length; i += 1) {
    if (fish.collideShark(shark) || fish.collideShark(sharks[i])) {
      gameConfig.stop();
      return;
    }
  }

  gameConfig.clear();
  background.x -= 1;
  background.newPosition();
  background.update();
  fish.newPosition();
  fish.update();
  gameConfig.frames += 1;
  if (gameConfig.frames == 1 || intervalFrames(120)) {
    x = gameConfig.canvas.width;
    y = gameConfig.canvas.height - 200;
    maxHeight = 417;
    minHeight = 0;
    sharkRandomHeight = Math.floor(
      Math.random() * (maxHeight - minHeight + 1) + minHeight
    );
    sharks.push(
      new component(160, 70, "./img/shark.png", 860, sharkRandomHeight, "image")
    );
  }
  for (i = 0; i < sharks.length; i += 1) {
    sharks[i].x += -1;
    sharks[i].update();
  }

  shark.x += -1;
  shark.update();
  score.text = "Score: " + (gameConfig.frames / 50).toFixed(0);
  score.update();
}
moveUp.addEventListener("mousedown", function () {
  fish.speedY -= 3;
});
moveDown.addEventListener("mousedown", function () {
  fish.speedY += 3;
});
moveLeft.addEventListener("mousedown", function () {
  fish.speedX -= 3;
});
moveRight.addEventListener("mousedown", function () {
  fish.speedX += 3;
});

moveUp.addEventListener("touchstart", function () {
  fish.speedY -= 3;
});
moveDown.addEventListener("touchstart", function () {
  fish.speedY += 3;
});
moveLeft.addEventListener("touchstart", function () {
  fish.speedX -= 3;
});
moveRight.addEventListener("touchstart", function () {
  fish.speedX += 3;
});

function resetSpeed() {
  fish.speedX = 0;
  fish.speedY = 0;
}
moveUp.addEventListener("mouseup", resetSpeed);
moveDown.addEventListener("mouseup", resetSpeed);
moveLeft.addEventListener("mouseup", resetSpeed);
moveRight.addEventListener("mouseup", resetSpeed);

moveUp.addEventListener("touchend", resetSpeed);
moveDown.addEventListener("touchend", resetSpeed);
moveLeft.addEventListener("touchend", resetSpeed);
moveRight.addEventListener("touchend", resetSpeed);

addEventListener("keydown", (e) => {
  if (e.key == "ArrowUp" || e.key == "Up") {
    fish.speedY -= 2;
  } else if (e.key == "ArrowDown" || e.key == "Down") {
    fish.speedY += 2;
  } else if (e.key == "ArrowLeft" || e.key == "Left") {
    fish.speedX -= 2;
  } else if (e.key == "ArrowRight" || e.key == "Right") {
    fish.speedX += 2;
  } else {
    fish.speedX = 0;
    fish.speedY = 0;
  }
});

addEventListener("keyup", (e) => {
  if (
    e.key == "ArrowUp" ||
    e.key == "Up" ||
    e.key == "ArrowDown" ||
    e.key == "Down"
  ) {
    fish.speedY = 0;
  } else if (
    e.key == "ArrowLeft" ||
    e.key == "Left" ||
    e.key == "ArrowRight" ||
    e.key == "Right"
  ) {
    fish.speedX = 0;
  }
});
var buttonVisibility = "hide";
var showHide = document.querySelector("#show-hide");
var buttons = document.querySelector(".buttons");
function showButtons() {
  if (buttonVisibility == "show") {
    showHide.innerHTML = "Show Buttons";
    buttonVisibility = "hide";
    buttons.style.display = "none";
  } else if (buttonVisibility == "hide") {
    showHide.innerHTML = "Hide Buttons";
    buttonVisibility = "show";
    buttons.style.display = "flex";
  }
}

startGame();
setTimeout(() => {
  document.querySelector(".footer").style.display = "none";
}, 5000);
