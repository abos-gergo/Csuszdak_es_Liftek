var background;
var player1;
var player2;
// const number = document.querySelector('.number');

function startGame() {
    background = new GameObject(720, 720, "Assets/Background.png", 0, 0, "image");
    player1 = new GameObject(30, 30, "green", 0, 144);
    player2 = new GameObject(30, 30, "red", 0, 648);
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 720;
        this.canvas.height = 720;
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

    this.update = function(){
        ctx = myGameArea.context;
        if (this.type == "image") {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
        else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}

function updateGameArea() {
    myGameArea.clear();
    background.update();
    player1.update();
    player2.update();
}

function adottMezo(player1) {
    var x = player1.x;
    var y = player1.y;
    var emelet = 10 - (y / 72);
    var mezo = x + 72;
    if (emelet % 2 == 0){
        mezo = x / 72;
    }
    else {
        mezo = (720 - x) / 72;
    }
    var akt_mezo = (emelet * 10) + mezo;
    console.log(akt_mezo);
}