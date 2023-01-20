var background;
var player1;
var player2;
var playerCount = 1;
var increase = IncreasePlayer();
var decrease = DecreasePlayer();
var mouse_position = [0, 0];
var increasebtn = new Button(59, 59, 1122, 541);
var decreasebtn = new Button(59, 59, 1276, 541);

function startGame() {
  background = new GameObject(
    1920,
    1080,
    "Assets/Background.png",
    0,
    0,
    "image"
  );
  player1 = new GameObject(30, 30, "green", 10, 120);
  player2 = new GameObject(100, 100, "red", 0, 620);
  myGameArea.start();
}

var myGameArea = {
  canvas: document.createElement("canvas"),
  start: function () {
    this.canvas.width = 1920;
    this.canvas.height = 1080;
    this.context = this.canvas.getContext("2d");
    this.context.imageSmoothingEnabled = false;
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, 20);
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
};

function Button(width, height, x, y) {
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.x2 = x + width;
  this.y2 = y + height;
  this.update = function () {
    if (mouse_position[0] >= this.x && mouse_position[0] <= this.x2) {
      if (mouse_position[1] >= this.y && mouse_position[1] <= this.y2) {
        // console.log("asd");
      }
    }
  };
}

function GameObject(width, height, color, x, y, type) {
  if (type == "image") {
    this.img = new Image();
    this.img.src = color;
  }
  this.type = type;
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;

  this.update = function () {
    ctx = myGameArea.context;
    if (this.type == "image") {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  };
}

function updateGameArea() {
  myGameArea.clear();
  background.update();
  player1.update();
  player2.update();
  increasebtn.update();
  decreasebtn.update();
}

function DecreasePlayer() {
  if (playerCount > 1 && playerCount <= 4) {
    playerCount = playerCount - 1;
  }
}

function IncreasePlayer() {
  if (playerCount >= 1 && playerCount < 4) {
    playerCount = playerCount + 1;
  }
}

function GeneratePlayers() {}

function tellPos(p) {
  mouse_position = [p.pageX, p.pageY];
  console.log(`x: ${p.pageX}\ny: ${p.pageY}`);
}
addEventListener("mousemove", tellPos, false);

function tileNumberToScreenPosition(number) {
  tileIndex = number - 1;
  tileY = Math.floor(tileIndex / 10);
  tileFloor = 9 - tileY;

  tileX = tileIndex % 10;
  if (tileFloor % 2 == 0) {
    tileX = 9 - tileX;
  }
  return [tileX * 108, tileFloor * 108];
}
