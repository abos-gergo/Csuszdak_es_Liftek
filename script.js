var background;
var connections = [
  new Connection(4, 25), 
  new Connection(13, 46), 
  new Connection(27, 5),
  new Connection(33, 49), 
  new Connection(40, 3),
  new Connection(42, 63),
  new Connection(43, 18),
  new Connection(50, 69),
  new Connection(54, 31),
  new Connection(62, 81),
  new Connection(66, 45),
  new Connection(74, 92),
  new Connection(76, 58),
  new Connection(89, 53),
  new Connection(99, 41)];
var playerCount = 1;
var currentPlayerIndex = 0;
var players = [];
var mouse_position = [0, 0];
var increasebtn = new Button(59, 59, 1122, 541);
var decreasebtn = new Button(59, 59, 1276, 541);

function startGame() {
  background = new GameObject(1920, 1080, "Assets/Background.png", 0, 0, "image");
  players.push(new Player("blue"));
  players.push(new Player("green"));
  players.push(new Player("red"));
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

function Player(color) {
    this.width = 50;
    this.height = 50;
    [this.x, this.y] = tileNumberToScreenPosition(1);
    this.tileNumber = 1;
  
    this.update = function () {
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        
        [this.x, this.y] = tileNumberToScreenPosition(this.tileNumber);
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
  }

function Connection(start, end) {
  this.start = start;
  this.end = end;
}


function updateGameArea() {
  myGameArea.clear();
  background.update();
  players.forEach(player => {
    player.update();
  });
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

function tellPos(p) {
  mouse_position = [p.pageX, p.pageY];
  console.log(`x: ${p.pageX}\ny: ${p.pageY}`);
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

function rollAndMove(){
    randomNumber = Math.ceil(Math.random() * 6);
    players[currentPlayerIndex].tileNumber += randomNumber;
    connections.forEach(connection => {
      if (connection.start == players[currentPlayerIndex].tileNumber) {
        players[currentPlayerIndex].tileNumber = connection.end;
      }
      
    });
    currentPlayerIndex += 1;
    if (currentPlayerIndex == players.length) {
        currentPlayerIndex = 0;
    }

}
