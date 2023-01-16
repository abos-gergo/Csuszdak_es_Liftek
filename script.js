var background;
var player1;
var player2;
var number = 1;
var text = document.querySelector("#number");
text.innerHTML = `${number}db játékos`;
var decreaseButton = document.querySelector("#minus");
decreaseButton.innerHTML = "Csökkentés";
var increaseButton = document.querySelector("#plus");
increaseButton.innerHTML = "Növelés";
var startButton = document.querySelector("#start");
startButton.innerHTML = "Játék indítása!";
var MousePositionX = document.querySelector("#x-position");
MousePositionX.innerHTML = "Pozíció X: ";
var MousePositionY = document.querySelector("#y-position");
MousePositionX.innerHTML = "Pozíció Y: ";

function startGame() {
  background = new GameObject(1920, 1080, "Assets/Background.png", 0, 0, "image");
  player1 = new GameObject(30, 30, "green", 10, 120);
  player2 = new GameObject(100, 100, "red", 0, 620);
  myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 1920;
        this.canvas.height = 1080;
        this.context = this.canvas.getContext("2d");
        this.context.imageSmoothingEnabled = false;
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
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
}

function DecreasePlayer() {
  if (number > 1 && number <= 4) {
    number = number - 1;
    text.innerHTML = `${number}db játékos`;
  }
}

function IncreasePlayer() {
  if (number >= 1 && number < 4) {
    number = number + 1;
    text.innerHTML = `${number}db játékos`;
  }
}

function GeneratePlayers() {
  decreaseButton.disabled = true;
  increaseButton.disabled = true;
}

decreaseButton.addEventListener("click", DecreasePlayer);
increaseButton.addEventListener("click", IncreasePlayer);
startButton.addEventListener("click", GeneratePlayers);

function tellPos(p) {
  MousePositionX.innerHTML = "Position X: " + p.pageX;
  MousePositionY.innerHTML = "Position Y: " + p.pageY;
}
addEventListener("mousemove", tellPos, false);


function tileNumberToScreenPosition(number){
    tileIndex = number - 1;
    tileY = Math.floor(tileIndex / 10);
    tileFloor = 9 - tileY;

    tileX = (tileIndex % 10);
    if (tileFloor % 2 == 0){
        tileX = 9 - tileX;
    }
    return [tileX * 108, tileFloor * 108];
}