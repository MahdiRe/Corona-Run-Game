
// Game piece variable declaration
var myGamePiece, myObstacles, myScore, myHealth;

// Game logic varialble declaration
var i, height, minGap, maxGap, obstacleTypes, numberOfLanes, x, y, randomObstacle;

function init() {
    // Types of obstacles
    obstacleTypes = [
        {src: "corona.png", caption: "virus", injurious: true}, 
        {src: "mask.jpg", caption: "mask", injurious: false},
        {src: "plaintea.jpg", caption: "plaintea", injurious: false},
        {src: "sneeze.jpg", caption: "sneeze", injurious: true},
        {src: "zombie.jpg", caption: "zombie", injurious: true}
    ];
}
  
init();

function startGame() {
    myGamePiece = new component(30, 30, "sonic.jpg", 10, 120, "image", "sonic");
    myScore = new component("30px", "Consolas", "black", 280, 40, "text", "myScore");
    myHealth = new component("30px", "Consolas", "black", 40, 40, "text", "myHealth"); // Health Edit #1
    myObstacles = [];
    myGameArea.start();
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.healthCount = 100; // Health Edit #4
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function(e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = true;
            myGamePiece.image.src = "sonicRun.jpg";
        })
        window.addEventListener('keyup', function(e) {
            myGameArea.keys[e.keyCode] = false;
            myGamePiece.image.src = "sonic.jpg";
        })
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function() {
        clearInterval(this.interval);
    }
}

function component(width, height, color, x, y, type, caption) {
    this.caption = caption;
    if (type == "image") {
        this.image = new Image();
        this.image.src = color;
    }
    this.type = type;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else if (type == "image") {
            ctx.drawImage(this.image,
                this.x,
                this.y,
                this.width, this.height);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
    }
    this.crashWith = function(otherobj) {

        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;

        if ((mybottom < othertop) ||
            (mytop > otherbottom) ||
            (myright < otherleft) ||
            (myleft > otherright)) {
            crash = false;
        } /* else {
            console.log(otherobj.caption);
        } */
        return crash;
    }
}

function updateGameArea() {

    var x, y;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            
            for(j=0; j<obstacleTypes.length; j++){
                if(myObstacles[i].caption == obstacleTypes[j].caption){
                    /* console.log("Is injurios: " + obstacleTypes[j].injurious); */
                    if (obstacleTypes[j].injurious) {
                        myGameArea.healthCount -= 0.5;
                    }else if(myGameArea.healthCount != 100){
                        myGameArea.healthCount += 0.5;
                    }
                }
            }

            if (myGameArea.healthCount<=-0.5){
                console.log("Game over!")
                myGameArea.stop();
                return;
            }
        }
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;
        height = 40;
        minGap = 40;
        maxGap = 50;

        // Picking random number of lanes
        numberOfLanes = Math.floor(Math.random() * 3) + 1;
        y = 0;
        for(i=0; i<numberOfLanes; i++){
            if (i==0){
                y = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
            }else{
                y += (height + Math.floor(Math.random() * (maxGap - minGap + 1) + minGap));
            }
            randomObstacle = obstacleTypes[ Math.floor(Math.random() * obstacleTypes.length) ];
            myObstacles.push(new component(height, height, randomObstacle.src, x, y, "image", randomObstacle.caption));
        }
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].speedX = -1; 
        myObstacles[i].newPos();
        myObstacles[i].update();
    }

    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
    if (myGameArea.keys && myGameArea.keys[37]) {
        myGamePiece.speedX = -1;
    }
    if (myGameArea.keys && myGameArea.keys[39]) {
        myGamePiece.speedX = 1;
    }
    if (myGameArea.keys && myGameArea.keys[38]) {
        myGamePiece.speedY = -1;
    }
    if (myGameArea.keys && myGameArea.keys[40]) {
        myGamePiece.speedY = 1;
    }
    myGamePiece.newPos();
    myGamePiece.update();
 
    // Score updating
    myScore.text = "SCORE: " + myGameArea.frameNo;
    myScore.update();

    // Health updating
    myHealth.text = "Health: " + myGameArea.healthCount;
    myHealth.update();
    
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {
        return true;
    }
    return false;
}

function move(dir) {
    myGamePiece.image.src = "sonicRun.jpg";
    if (dir == "up") {
        myGamePiece.speedY = -1;
    }
    if (dir == "down") {
        myGamePiece.speedY = 1;
    }
    if (dir == "left") {
        myGamePiece.speedX = -1;
    }
    if (dir == "right") {
        myGamePiece.speedX = 1;
    }
}

function clearmove() {
    myGamePiece.image.src = "sonic.jpg";
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
}

function restartGame() { 

    var pause = document.getElementById("pause");
    var play = document.getElementById("play");
    play.disabled = true;
    pause.disabled = false;
    myGameArea.stop();
    myGameArea.clear();
    startGame();
}

function pause() {
    var pause = document.getElementById("pause");
    var play = document.getElementById("play");
    pause.disabled = true;
    play.disabled = false;
    myGameArea.stop();
}

function play() {
    var pause = document.getElementById("pause");
    var play = document.getElementById("play");
    play.disabled = true;
    pause.disabled = false;
    myGameArea.interval = setInterval(updateGameArea, 20);
}
