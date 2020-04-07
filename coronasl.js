
// Game piece variable declaration
var myGamePiece, myObstacles, myScore, myHealth;

// Game logic varialble declaration
var i, height, minGap, maxGap, obstacleDetails, numberOfLanes, x, y, randomObstacle;

/* var myObstacles;
var myScore;
var myHealth; */

function init() {
    // initialisation stuff here
    // Types of obstacles
    obstacleDetails = [
        {src: "corona.png", caption: "virus"}, 
        {src: "mask.jpg", caption: "mask"},
        {src: "plaintea.jpg", caption: "plaintea"},
        {src: "sneeze.jpg", caption: "sneeze"},
        {src: "zombie.jpg", caption: "zombie"}
    ];
}
  
init();


function startGame() {
    myGamePiece = new component(30, 30, "sonic.jpg", 10, 120, "image", "Sonic");
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
        } else {
            console.log(otherobj.caption);

            switch(otherobj.caption) {
                case "Banana":
                  text = "Banana is good!";
                  break;
                case "Orange":
                  text = "I am not a fan of orange.";
                  break;
                case "Apple":
                  text = "How you like them apples?";
                  break;
                default:
                  text = "I have never heard of that fruit...";
              }
        }
        return crash;
    }
}

function updateGameArea() {

    var x, y;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            myGameArea.healthCount -= 0.5; // Health Edit #

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
        /* minHeight = 50; //20
        maxHeight = 100; //200
        height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight); */
        height = 40;
        minGap = 40;
        maxGap = 50;
        /* gap1 = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap); // Three random gaps in between - Y coordinates
        gap2 = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
        gap3 = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
        myObstacles.push(new component(height, height, "corona.png", x, gap1, "image", "Virus"));
        myObstacles.push(new component(height, height, "corona.png", x, (height+gap1+gap2), "image", "Virus"));
        myObstacles.push(new component(height, height, "mask.png", x, (height+height+gap1+gap2+gap3), "image", "MASK")); */

        // Picking random number of lanes
        numberOfLanes = Math.floor(Math.random() * 3) + 1;
        y = 0;
        for(i=0; i<numberOfLanes; i++){
            if (i==0){
                y = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
            }else{
                y += (height + Math.floor(Math.random() * (maxGap - minGap + 1) + minGap));
            }
            randomObstacle = obstacleDetails[ Math.floor(Math.random() * obstacleDetails.length) ];
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

    myScore.text = "SCORE: " + myGameArea.frameNo;
    myScore.update();

    // Health Edit #2
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
