var background;
var gameStarted = false;
var animationOngoing = -1;
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
var winner = -1;
var players = [];
var mouse_position = [0, 0];
var buttons = [
  new Button(59, 59, 1119, 541, "Assets/Red_Left_Arrow.png", DecreasePlayer),
  new Button(59, 59, 1273, 541, "Assets/Green_Right_Arrow.png", IncreasePlayer),
  new Button(765, 174, 1119, 606, "Assets/Start.png", PlayerGenerate) //Norbi feladata a gomb működése
];
var gameObjects = [new GameObject(62, 62, "Assets/1.png", 1194, 541, "image"), new GameObject(540, 58, "Assets/Jatekos.png", 1344, 542, "image")];

function initialize() {
  background = new GameObject(1920, 1080, "Assets/Background.png", 0, 0, "image");
  myGameArea.start();

}

function PlayerGenerate() {
  for (let i = 0; i < playerCount; i++) {
    playerCount * players.push(new Player(`Assets/Player${i + 1}right.png`, i));
  }
  buttons = [new Button(765, 174, 1119, 876, "Assets/Roll.png", rollAndMove)];
  gameObjects = [new GameObject(300, 300, "Assets/Player1right.png", 1144, 541, "image")];
  gameStarted = true;
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

function Button(width, height, x, y, img_src, onclick) {
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.x2 = x + width;
  this.y2 = y + height;
  this.img = new Image();
  this.img.src = img_src;
  this.onclick = onclick;
  this.opacity = 1;
  this.mouse_over = function () {
    if (mouse_position[0] >= this.x && mouse_position[0] <= this.x2) {
      if (mouse_position[1] >= this.y && mouse_position[1] <= this.y2) {
        return true;
      }
    }
    return false;
  }
  this.clicked = function () {
    if (this.mouse_over() && animationOngoing == -1) {
      this.onclick();
    }
  };
  this.update = function () {
    if (animationOngoing != -1) {
      this.opacity = 0.7;
    }
    else {
      this.opacity = 1;
    }
    ctx.globalAlpha = this.opacity;
    if (this.mouse_over() && animationOngoing == -1) {
      ctx.drawImage(this.img, this.x + 3, this.y - 3, this.width, this.height);
    } else {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
    ctx.globalAlpha = 1;
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
  this.opacity = 1;

  this.update = function () {
    ctx = myGameArea.context;
    if (this.type == "image") {
      ctx.globalAlpha = this.opacity;
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
      ctx.globalAlpha = 1;
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  };
}

function Player(color, index) {
  this.img = new Image();
  this.img.src = color;
  this.width = 50;
  this.height = 50;
  [this.x, this.y] = tileNumberToScreenPosition(1);
  this.tileNumber = 98;
  this.targetTileNumber = 98;
  this.opacity = 1;
  this.index = index;
  this.direction = "right";

  this.update = function () {
    ctx = myGameArea.context;
    let inAnimation = false;
    if (winner == this.index && this.tileNumber == 100) {
      this.width = moveTovards(this.width, 790, 10);
      this.height = moveTovards(this.height, 790, 10);
      this.x = moveTovards(this.x, 555, 7.5);
    }
    else {
      this.tileNumber = moveTovards(this.tileNumber, this.targetTileNumber, 0.15);
      if (this.tileNumber % 1 != 0) {
        let prevTile = tileNumberToScreenPosition(Math.floor(this.tileNumber));
        let nextTile = tileNumberToScreenPosition(Math.ceil(this.tileNumber));
        [this.x, this.y] = lerp(prevTile, nextTile, this.tileNumber % 1);
      }
      else {
        [this.x, this.y] = tileNumberToScreenPosition(this.tileNumber);
      }
      connections.forEach(connection => {
        if (connection.start == this.tileNumber && connection.start == this.targetTileNumber) {
          inAnimation = true;
          this.opacity = moveTovards(this.opacity, 0, 0.11);
          if (this.opacity == 0) {
            this.tileNumber = connection.end;
            this.targetTileNumber = connection.end;
          }
        }
        else if (connection.end == this.targetTileNumber) {
          this.opacity = moveTovards(this.opacity, 1, 0.11);
          if (this.opacity != 1) {
            inAnimation = true;
          }
        }
      });
    }
    if (Math.floor((this.tileNumber - 1) / 10) % 2 == 0) {
      this.direction = "right";
    }
    else {
      this.direction = "left";
    }
    if (inAnimation || this.tileNumber != this.targetTileNumber) {
      animationOngoing = this.index;
    }
    else if (animationOngoing == this.index) {
      animationOngoing = -1;
      gameObjects[0].img.src = `Assets/Player${currentPlayerIndex + 1}right.png`;
    }
    this.img.src = `Assets/Player${this.index + 1}${this.direction}.png`;
    ctx.globalAlpha = this.opacity;
    ctx.drawImage(this.img, this.x + 25, this.y + 50 + (Math.abs((this.tileNumber % 1) - 0.5) - 0.5) * 20, this.width, this.height);
    ctx.globalAlpha = 1;
  };
}

function Connection(start, end) {
  this.start = start;
  this.end = end;
}


function updateGameArea() {
  myGameArea.clear();
  background.update();
  if (!gameStarted) {
    gameObjects[0].img.src = `Assets/${playerCount}.png`;
  }
  if (winner != -1) {
    background.opacity = moveTovards(background.opacity, 0, 0.015);
    gameObjects.forEach(gameObject => {
      gameObject.opacity = moveTovards(gameObject.opacity, 0, 0.015);
    });
    buttons.forEach(button => {
      button.opacity = moveTovards(button.opacity, 0, 0.015);
    });
  }
  gameObjects.forEach(gameObject => {
    gameObject.update();
  });
  players.forEach(player => {
    player.update();
  });
  buttons.forEach(button => {
    button.update();
  });
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
}
addEventListener("mousemove", tellPos, false);

function tileNumberToScreenPosition(number) {
  tileIndex = number - 1;
  tileY = Math.floor(tileIndex / 10);
  tileFloor = 9 - tileY;

  tileX = (tileIndex % 10);
  if (tileFloor % 2 == 0) {
    tileX = 9 - tileX;
  }
  return [tileX * 108, tileFloor * 108];
}

function rollAndMove() {
  randomNumber = Math.ceil(Math.random() * 6);
  if (players[currentPlayerIndex].targetTileNumber + randomNumber < 100) {
    players[currentPlayerIndex].targetTileNumber += randomNumber;
  }
  else {
    players[currentPlayerIndex].targetTileNumber = 100;
    winner = currentPlayerIndex;
  }
  currentPlayerIndex += 1;
  if (currentPlayerIndex == players.length) {
    currentPlayerIndex = 0;
  }
}

function onclick() {
  buttons.forEach(button => {
    button.clicked();
  });
}

addEventListener("click", onclick, false);


function lerp(a, b, t) {
  let e0 = a[0] + (b[0] - a[0]) * t;
  let e1 = a[1] + (b[1] - a[1]) * t;
  return [e0, e1];
}

function moveTovards(a, b, v) {
  let difference = Math.abs(a - b);
  if (difference < 1) {
    v = v / 2
  }
  if (b > a) {
    if (a + v > b) {
      return b;
    }
    return a + v;
  }
  else {
    if (a - v < b) {
      return b;
    }
    return a - v;
  }
}