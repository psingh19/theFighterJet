let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

//background
let background = new Image();
background.src = "images/background1.jpg";
let bg2 = new Image();
bg2.src = "images/bg2.jpg";
let gm = new Image();
gm.src = "images/gameOver.png";

//my jet
let jet = new Image();
jet.src = "images/jet1.png";

//my missile
let missile = new Image();
missile.src = "images/missile1.png";

//enemies
var enemy1 = new Image();
var enemy2 = new Image();
enemy1.src = "images/enemy.png";
enemy2.src = "images/enemy1.png";
let enemyX = canvas.width + 100;
let enemyY = 150;
let enemy2X = canvas.width + 400;
let enemy2Y = 40;

//enemies missiles
let missile2 = new Image();
missile2.src = "images/emissile.png";
let missileX = enemyX;
let missileY = enemyY;
let miss2X = enemy2X;
let miss2Y = enemy2Y;

//sounds
var c = document.createElement('audio');
c.src = "music/Cannon.mp3";
var m = document.createElement('audio');
m.src = "music/Missile.mp3";
var mouse = document.createElement('audio');
mouse.src = "music/click.mp3";
var yes = document.createElement('audio');
yes.src = "music/buttonn.mp3";
var bgMusic = document.createElement('audio');
bgMusic.src = "music/2.mp3";

var spriteW = 150,
    spriteH = 100;
var bgW = canvas.width,
    bgH = 450;
var jetX = 45;
var jetY = 150;
let isUp = true;
let isMissile = false;
let missX = jetX;
let missY = jetY;
let missileArr = [];
let firstMiss = [];
let secondMiss = [];
var missInterval;
let fire;
let movement;
let isSecond1 = true;
let isSecond2 = true;
var gameArea;
var gameOver = false;
var isPlay = false;
var mouseX;
var mouseY;
var isLevelSelected = false;
var clicked = false;
let cx;
let cy;
let dist;
var count = 0;
let isDone = false;
let speed = 5;

let isExpert = false;
let isBeginner = false;

function setUp() {
    //event listener for user movements
    addEventListener("keydown", function(event) {
        dir = event.keyCode;
        if (dir == 38) {
            if (jetY > 0) {
                jetY -= speed;
            }
        }
        if (dir == 40) {
            if (jetY < canvas.height - 200) {
                jetY += speed;
            }
        }
        if (dir == 37) {
            if (jetX > 0) {
                jetX -= speed;
            }
        }
        if (dir == 39) {
            if (jetX < canvas.width - 200) {
                jetX += speed;
            }
        }
    });
    // event listener for user missile
    addEventListener("keyup", function(event) {
        fire = event.keyCode;
        if (fire == 32 && gameOver == false) {
            missileArr.push(new coor(missX, missY, jetX, jetY));
            isMissile = true;
            m.play();
        }
    });

    //initialize the whole game
    if (isLevelSelected == false) {
        drawPlay();
    }

    canvas.onclick = function() {
        if (isLevelSelected == false) {
            mouseX = event.offsetX;
            mouseY = event.offsetY;

            if (gameOver == true) {
                gameOver = false;
                setTimeout(function() {
                    drawPlay();
                    mouse.play();
                }, 300);
            }

            //check the click inside the circle
            cx = mouseX - canvas.width / 2;
            cy = mouseY - canvas.height / 2;
            dist = Math.sqrt(cx * cx + cy * cy);
            if (dist < 60 && isDone == false) {
                isDone = true;
                setTimeout(function() {
                    levels()
                }, 300);
                yes.play();
                isPlay = true;
            }

            if (isPlay == true) {
                //beginners
                if (mouseX > 180 && mouseX < 400 && mouseY > 190 && mouseY < 255) {
                    mouse.play();
                    setTimeout(function() {
                        isLevelSelected = true;
                        game();
                        speed = 4;
                    }, 300);
                    isPlay = false;
                } //experts
                else if (mouseX > 520 && mouseX < 740 && mouseY > 190 && mouseY < 255) {
                    mouse.play();
                    setTimeout(function() {
                        isLevelSelected = true;
                        isExpert = true;
                        expert();
                        speed = 2;
                    }, 300);
                    isPlay = false;
                }

            }
        } //end level selected
    } //end on-click


} //end setUp

//for beginners
function game() {
    bgMusic.play();
    if (gameOver == false && isLevelSelected == true) {
        ctx.clearRect(0, 0, canvas.width, canvas.width);
        var cycle = 0;
        var sourceX = 0;
        sourceEnd = 850;
        gameArea = setInterval(function() {
            ctx.drawImage(background, sourceX, 0, sourceEnd, bgH, 0, 0, sourceEnd, bgH);
            ctx.drawImage(bg2, 0, 0, bgW, bgH, sourceEnd, 0, bgW, bgH);
            sourceX = (sourceX + 2) % 850;
            (sourceEnd < 2) ? sourceEnd = 848: sourceEnd -= 2;
            ctx.drawImage(jet, jetX, jetY);

            //draw score
            ctx.fillStyle = "black";
            ctx.font = "20px Calibri";
            ctx.fillText("Score: " + count, 10, 20);
            ctx.fill();
            enemies();

            //collision with missile
            if (isMissile == true) {
                for (let i = 0; i < missileArr.length; i++) {
                    if (missileArr[i].missX < canvas.width - 50) {
                        missileArr[i].missX += 6;
                        if ((missileArr[i].missX + 60 < enemyX + 164 && missileArr[i].missX + 60 > enemyX) && (missileArr[i].missY + 10 < enemyY + 59 && missileArr[i].missY + 10 > enemyY)) {
                            c.play();
                            enemyX = canvas.width + 200;
                            enemyY = (Math.random() * 250);
                            missileArr.splice(i);
                            count += 50;
                        } else if ((missileArr[i].missX + 60 < enemy2X + 164 && missileArr[i].missX + 60 > enemy2X) && (missileArr[i].missY + 10 < enemy2Y + 59 && missileArr[i].missY + 10 > enemy2Y)) {
                            enemy2X = canvas.width + 200;
                            enemy2Y = (Math.random() * 300);
                            missileArr.splice(i);
                            c.play();
                            count += 50;
                        } else {
                            ctx.drawImage(missile, missileArr[i].missX, missileArr[i].missY);
                        }
                    }
                }
            } //end isMissile

            //collision of jet
            if (((enemyX <= jetX + 180 && enemyX >= jetX) || (enemyX + 164 <= jetX + 180 && enemyX + 164 >= jetX)) && ((enemyY + 20 >= jetY && enemyY + 20 <= jetY + 50) || (enemyY + 40 >= jetY && enemyY + 40 <= jetY + 50))) {
                clearInterval(gameArea);
                c.play();
                ctx.clearRect(0, 0, canvas.width, canvas.width);
                ctx.drawImage(gm, 0, 0);
                gameOver = true;
                isLevelSelected = false;
                done();
                count = 0;
                resetFun();
            }

            if (((enemy2X <= jetX + 180 && enemy2X >= jetX) || (enemy2X + 150 <= jetX + 180 && enemy2X + 150 >= jetX)) && ((enemy2Y + 20 >= jetY && enemy2Y + 20 <= jetY + 62) || (enemy2Y + 28 >= jetY && enemy2Y + 28 <= jetY + 50))) {
                clearInterval(gameArea);
                c.play();
                ctx.clearRect(0, 0, canvas.width, canvas.width);
                ctx.drawImage(gm, 0, 0);
                gameOver = true;
                isLevelSelected = false;
                done();
                count = 0;
                resetFun();
            }

        }, 10);


    } //end gameOver
}

//for expert
function expert() {
    bgMusic.play();
    if (gameOver == false && isLevelSelected == true && isExpert == true) {
        //automatic missile attack
        missInterval = setInterval(function() {
            firstMiss.push(new coor2(missileX, missileY, enemyX, enemyY));
            secondMiss.push(new coor3(miss2X, miss2Y, enemy2X, enemy2Y));
        }, 2000);
        if (gameOver == true) {
            clearInterval(missInterval);
        }

        ctx.clearRect(0, 0, canvas.width, canvas.width);
        var cycle = 0;
        var sourceX = 0;
        sourceEnd = 850;
        gameArea = setInterval(function() {
            ctx.drawImage(background, sourceX, 0, sourceEnd, bgH, 0, 0, sourceEnd, bgH);
            ctx.drawImage(bg2, 0, 0, bgW, bgH, sourceEnd, 0, bgW, bgH);
            sourceX = (sourceX + 2) % 850;
            (sourceEnd < 2) ? sourceEnd = 848: sourceEnd -= 2;
            ctx.drawImage(jet, jetX, jetY);

            //draw score
            ctx.fillStyle = "black";
            ctx.font = "20px Calibri";
            ctx.fillText("Score: " + count, 10, 20);
            ctx.fill();
            enemies();

            //collision with missile
            if (isMissile == true) {
                for (let i = 0; i < missileArr.length; i++) {
                    if (missileArr[i].missX < canvas.width - 50) {
                        missileArr[i].missX += 6;
                        if ((missileArr[i].missX + 60 < enemyX + 164 && missileArr[i].missX + 60 > enemyX) && (missileArr[i].missY + 10 < enemyY + 59 && missileArr[i].missY + 10 > enemyY)) {
                            c.play();
                            enemyX = canvas.width + 200;
                            enemyY = (Math.random() * 250);
                            missileArr.splice(i);
                            count += 50;
                        } else if ((missileArr[i].missX + 60 < enemy2X + 164 && missileArr[i].missX + 60 > enemy2X) && (missileArr[i].missY + 10 < enemy2Y + 59 && missileArr[i].missY + 10 > enemy2Y)) {
                            enemy2X = canvas.width + 200;
                            enemy2Y = (Math.random() * 300);
                            missileArr.splice(i);
                            c.play();
                            count += 50;
                        } else {
                            ctx.drawImage(missile, missileArr[i].missX, missileArr[i].missY);
                        }
                    }
                }
            } //end isMissile

            //movement of enemies missiles
            for (let k = 0; k < firstMiss.length; k++) {
                if (firstMiss[k].missileX > -200) {
                    firstMiss[k].missileX -= 6;
                }
                if (((firstMiss[k].missileX <= jetX + 180 && firstMiss[k].missileX >= jetX) || (firstMiss[k].missileX + 40 <= jetX + 180 && firstMiss[k].missileX + 40 >= jetX)) && ((firstMiss[k].missileY + 14 >= jetY && firstMiss[k].missileY + 14 <= jetY + 35) || (firstMiss[k].missileY >= jetY && firstMiss[k].missileY <= jetY + 35))) {
                    clearInterval(gameArea);
                    clearInterval(missInterval);
                    c.play();
                    ctx.clearRect(0, 0, canvas.width, canvas.width);
                    ctx.drawImage(gm, 0, 0);
                    gameOver = true;
                    isLevelSelected = false;
                    done();
                    count = 0;
                    resetFun();
                } else {
                    ctx.drawImage(missile2, firstMiss[k].missileX, firstMiss[k].missileY);
                }
            }

            for (let l = 0; l < secondMiss.length; l++) {
                if (secondMiss[l].miss2X > -100) {
                    secondMiss[l].miss2X -= 6;
                }
                if (((secondMiss[l].miss2X <= jetX + 180 && secondMiss[l].miss2X >= jetX) || (secondMiss[l].miss2X + 40 <= jetX + 180 && secondMiss[l].miss2X + 40 >= jetX)) && ((secondMiss[l].miss2Y + 14 >= jetY && secondMiss[l].miss2Y + 14 <= jetY + 35) || (secondMiss[l].miss2Y >= jetY && secondMiss[l].miss2Y <= jetY + 35))) {
                    clearInterval(gameArea);
                    clearInterval(missInterval);
                    c.play();
                    ctx.clearRect(0, 0, canvas.width, canvas.width);
                    ctx.drawImage(gm, 0, 0);
                    gameOver = true;
                    isLevelSelected = false;
                    done();
                    count = 0;
                    resetFun();
                } else {
                    ctx.drawImage(missile2, secondMiss[l].miss2X, secondMiss[l].miss2Y);
                }
            }


            //collision of jet with Enemies
            if (((enemyX <= jetX + 180 && enemyX >= jetX) || (enemyX + 164 <= jetX + 180 && enemyX + 164 >= jetX)) && ((enemyY + 28 >= jetY && enemyY + 28 <= jetY + 40) || (enemyY + 28 >= jetY && enemyY + 28 <= jetY + 40))) {
                clearInterval(gameArea);
                clearInterval(missInterval);
                c.play();
                ctx.clearRect(0, 0, canvas.width, canvas.width);
                ctx.drawImage(gm, 0, 0);
                gameOver = true;
                isLevelSelected = false;
                done();
                count = 0;
                firstMiss = [];
                secondMiss = [];
                bgMusic.pause();
            }

            if (((enemy2X <= jetX + 180 && enemy2X >= jetX) || (enemy2X + 150 <= jetX + 180 && enemy2X + 150 >= jetX)) && ((enemy2Y + 28 >= jetY && enemy2Y + 28 <= jetY + 40) || (enemy2Y + 28 >= jetY && enemy2Y + 28 <= jetY + 40))) {

                clearInterval(gameArea);
                clearInterval(missInterval);
                c.play();
                ctx.clearRect(0, 0, canvas.width, canvas.width);
                ctx.drawImage(gm, 0, 0);
                gameOver = true;
                isLevelSelected = false;
                done();
                count = 0;
                firstMiss = [];
                secondMiss = [];
                bgMusic.pause();
            }
        }, 10);



    } //end gameOver

}

//reset everything
function resetFun() {
    missileArr = [];
    firstMiss = [];
    secondMiss = [];
    enemyX = canvas.width + 100;
    enemyY = 150;
    enemy2X = canvas.width + 400;
    enemy2Y = 40;
    missileX = enemyX;
    missileY = enemyY;
    miss2X = enemy2X;
    miss2Y = enemy2Y;
    jetX = 45;
    jetY = 150;
    bgMusic.pause();
}

//draw play icon
function drawPlay() {
    isDone = false;
    ctx.clearRect(0, 0, canvas.width, canvas.width);
    ctx.drawImage(gm, 0, 0);
    ctx.fillStyle = "black";
    ctx.font = "35px Calibri";
    ctx.fillText("Play", 420, 328);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 60, 0, 2 * Math.PI);
    ctx.fillStyle = '#00b200';
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    ctx.stroke();


    //Draw a triangle in it
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.moveTo(429, 198);
    ctx.lineTo(429, 255);
    ctx.lineTo(canvas.width / 2 + 34, canvas.height / 2);
    ctx.lineTo(429, 198);
    ctx.fillStyle = 'yellow';
    ctx.fill();
    ctx.stroke();
}



function levels() {
    ctx.clearRect(0, 0, canvas.width, canvas.width);
    ctx.drawImage(gm, 0, 0);
    ctx.beginPath();
    ctx.fillStyle = '#00b200';
    ctx.fillRect(180, 190, 220, 65);
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.strokeRect(180, 190, 220, 65);
    ctx.stroke();

    ctx.fillStyle = "yellow";
    ctx.font = "35px Calibri";
    ctx.fillText("Beginners", 217, 235);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = '#00b200';
    ctx.fillRect(520, 190, 220, 65);
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.strokeRect(520, 190, 220, 65);
    ctx.stroke();

    ctx.fillStyle = "yellow";
    ctx.font = "35px Calibri";
    ctx.fillText("Experts", 575, 235);
    ctx.fill();
}

//gamOver image
let go = new Image();
go.src = "images/over.png";

//prints when game over
function done() {
    if (gameOver == true) {
        ctx.drawImage(go, canvas.width / 2 - 128, canvas.height / 2 - 130);
        ctx.fillStyle = "black";
        ctx.font = "15px Verdana";
        ctx.fillText("Your Score is " + count, 385, 340);
        ctx.fill();
        ctx.fillStyle = "black";
        ctx.font = "20px Verdana";
        ctx.fillText("Click to play again!!", 360, 368);
        ctx.fill();
        jetX = 45;
        jetY = 150;
        enemyX = canvas.width + 100;
        enemyY = 150;
        enemy2X = canvas.width + 400;
        enemy2Y = 40;
    }
}

//following three are constructors for missiles
function coor(missX, missY, jetX, jetY) {
    this.missX = jetX + 50;
    this.missY = jetY + 41;
}

function coor2(missileX, missileY, enemyX, enemyY) {
    this.missileX = enemyX;
    this.missileY = enemyY + 30;
}

function coor3(miss2X, miss2Y, enemy2X, enemy2Y) {
    this.miss2X = enemy2X;
    this.miss2Y = enemy2Y + 30;
}

function enemies() {
    ctx.drawImage(enemy1, enemyX, enemyY);
    ctx.drawImage(enemy2, enemy2X, enemy2Y);
    enemyX -= 2;
    enemy2X -= 2;


    if (enemyX < -150) {
        if (isSecond1 == true) {
            enemy1.src = "images/enemy3.png";
            isSecond1 = false;
        } else {
            enemy1.src = "images/enemy.png";
            isSecond1 = true;
        }
        enemyY = Math.round((Math.random() * 100));
        enemyX = canvas.width + 100;

    }

    if (enemy2X < -150) {
        if (isSecond2 == true) {
            enemy2.src = "images/enemy4.png";
            isSecond2 = false;
        } else {
            enemy2.src = "images/enemy1.png";
            isSecond2 = true;
        }
        enemy2Y = Math.round((Math.random() * 200));
        enemy2X = canvas.width + 400;

    }
}
