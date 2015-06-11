
// Ball is the object that hits the bricks and the paddle
function Ball() {

// The ball's position
    this.x = ballStartX;
    this.y = ballStartY;

// The ball's velocity
    this.vx = Math.random() * 6 + -3;
    this.vy = Math.random() * 5 + 2;

    this.setRandomVelocity = function(){
        this.vx = Math.random() * 6 + -3;
        this.vy = Math.random() * 5 + 2;
    }

    // Drawing the ball is just drawing a filled in circle
    this.draw = function(brush) {
        brush.beginPath();
        brush.arc(this.x, this.y, ballRadius, 0, 2*Math.PI);
        brush.closePath();
        brush.fillStyle = white;
        brush.fill();
    };

    // returns true if the ball hit the paddle
    this.hitPaddle = function(newx,newy){
        return (newx > p.x && newx < p.x + paddleSizeX && newy > p.y && newy < p.y + paddleSizeX);
    }

    // update the position of the ball
    this.move = function() {
        var newx = this.x + this.vx;
        var newy = this.y + this.vy;

        // if ball hits the bottom of the screen, teleport ball to start position
        if (newx >= 0 && newx <= screenSizeX && newy > screenSizeY) {
            this.x = ballStartX;
            this.y = ballStartY;
            this.setRandomVelocity();
//            this.vx = -3;
//            this.vy = 2;
            score = 0;
            for(var i in brickRow1){
                brickRow1[i].shouldDrawBrick = true;
            }
            for(var i in brickRow2){
                brickRow2[i].shouldDrawBrick = true;
            }
            for(var i in brickRow3){
                brickRow3[i].shouldDrawBrick = true;
            }
        }

        // if the ball hits the left or right walls, it bounces horizontally
        if (newy >= 0 && newy <= screenSizeY && (newx > screenSizeX || newx < 0)) {
            this.vx *= -1;
        }

        // if the ball hits the top of the screen, it bounces vertically
        if (newx >=0 && newx <= screenSizeX && newy < 0) {
            this.vy *= -1;
        }

        // if the ball hits the paddle, it bounces vertically
        if (this.hitPaddle(newx,newy)) {
            this.vy *= -1;
        }

        for(var i in brickRow1){
            brickRow1[i].hit()
        }
        for(var i in brickRow2){
            brickRow2[i].hit()
        }
        for(var i in brickRow3){
            brickRow3[i].hit()
        }

        this.x += this.vx;
        this.y += this.vy;
    };
    this.bounce = function(){
        this.vy *= -1;
    }
}

function Paddle() {
    this.x = 275;
    this.y = 375;

    this.draw = function(brush) {
        brush.fillRect(this.x, this.y, paddleSizeX, paddleSizeY);
    };
}

function Brick(x, y, color) {

    // position of the brick's upper left corner
    this.x = x;
    this.y = y;

    this.color = color;

    // whether the brick should be drawn (because it hasnt ever been hit)
    this.shouldDrawBrick = true;


    this.draw = function(brush) {
        if(this.shouldDrawBrick) {
            brush.fillStyle = this.color;
            brush.fillRect(this.x, this.y, brickSizeX, brickSizeY);
        }
    };

    this.hit = function() {
        if (b.x > this.x && b.x < this.x + 25 && b.y > this.y && b.y < this.y + 15 && this.shouldDrawBrick) {
            b.bounce();
            this.shouldDrawBrick = false;
            score += 1;
        }
    }
}

// drawGame is the main function for drawing all parts of the game
function drawGame() {

    var canvas = document.getElementById('canvas');
    var brush = canvas.getContext('2d');

    brush.fillStyle = black;
    brush.fillRect(0, 0, screenSizeX, screenSizeY);

    // Draw ball
    b.draw(brush);

    // Draw brush
    p.draw(brush);

    // Draw all rows of bricks
    for(var i in brickRow1) {
        brickRow1[i].draw(brush);
    }
    for(var i in brickRow2) {
        brickRow2[i].draw(brush);
    }
    for(var i in brickRow3) {
        brickRow3[i].draw(brush);
    }

    $('#score').html("Score:" + score);

    if (leftArrowKeyPressed && p.x > 0) {
        p.x -= 5;
    } else if (rightArrowKeyPressed && p.x < 536) {
        p.x += 5;
    }

    // Move
    b.move();

    window.requestAnimationFrame(drawGame);
}

// create three rows of bricks
function createBricks(){
    var brickx = XspaceBetweenBricks;
    var row1Y = 10;
    var row2Y = row1Y + brickSizeY + YspaceBetweenBricks;
    var row3Y = row2Y + brickSizeY + YspaceBetweenBricks;

    for (var i = 1; i <= numberOfBricksPerRow; i++){
        brickRow1.push(new Brick(brickx, row1Y, red));
        brickRow2.push(new Brick(brickx, row2Y, blue));
        brickRow3.push(new Brick(brickx, row3Y, green));
        brickx += brickSizeX + XspaceBetweenBricks;
    }
}

// The values used in this program
var ballStartX = 300;
var ballStartY = 90;

var ballStartVX = -3;
var ballStartVY = 2;

var ballRadius = 10;

var screenSizeX = 600;
var screenSizeY = 400;

var paddleSizeX = 60;
var paddleSizeY = 10;

var brickSizeX = 20;
var brickSizeY = 10;
var XspaceBetweenBricks = 5;
var YspaceBetweenBricks = 5;
var numberOfBricksPerRow = 25;

var white = '#fff';
var black = '#000';
var red = '#ff0000';
var blue = '#0000ff';
var green = '#008000';


// Handle key presses
var leftArrowKeyPressed = false;
var rightArrowKeyPressed = false;

$(window).keydown(function(event) {
    if (event.keyCode == 37) {
        leftArrowKeyPressed = true;
    } else if (event.keyCode == 39) {
        rightArrowKeyPressed = true;
    }
});

$(window).keyup(function(event) {
    if (event.keyCode == 37) {
        leftArrowKeyPressed = false;
    } else if (event.keyCode == 39) {
        rightArrowKeyPressed = false;
    }
});


var score = 0;

var b = new Ball();
var p = new Paddle();

// create three rows of bricks
var brickRow1 = new Array();
var brickRow2 = new Array();
var brickRow3 = new Array();
createBricks();

drawGame();