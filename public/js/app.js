// ABOUT THE BRICKBREAKER GAME
//
// You control a paddle. You have to hit the ball. If it slips by you you lose the game.
// When you hit a brick with teh ball you get a point.
// There are special bricks too.
// Orange bricks are double points, and dark range bricks are random points.
// A yellow brick makes the ball bounce vertical so its easy for you to hit.



// Ball is the object that hits the bricks and the paddle
function Ball() {

// The ball's position
    this.x = ballStartX;
    this.y = ballStartY;

// The ball's velocity, starts random, but always with a positive vy (down)
    this.vx = Math.random() * 6 + -3; // random vx from -3 to 3
    this.vy = Math.random() * 4 + 2; // random vy from 2 to 6

    this.setRandomVelocity = function(){
        this.vx = Math.random() * 6 + -3; // random vx from -3 to 3
        this.vy = Math.random() * 4 + 2; // random vy from 2 to 6
    };

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
    };

    // make the ball easy to hit by making it travel slow and almost pure vertical
    this.makeBallEasyToHit = function(){
        // we dont want vx = 0 because a pure vertical ball
        // would never hit any other bricks to the sides
        this.vx = 0.5;
        this.vy = 2;
    };


    // update the position of the ball
    this.move = function() {
        var newx = this.x + this.vx;
        var newy = this.y + this.vy;

        // if ball hits the bottom of the screen, teleport ball to its start position
        if (newy > screenSizeY) {
            this.x = ballStartX;
            this.y = ballStartY;
            this.setRandomVelocity();
            gameOver();
        }

        // if the ball hits the left or right walls, it bounces horizontally
        if (newx > screenSizeX || newx < 0) {
            this.vx *= -1;
        }

        // if the ball hits the top of the screen, it bounces vertically
        if (newy < 0) {
            this.bounce();
        }

        // if the ball hits the paddle, it bounces vertically
        if (this.hitPaddle(newx,newy)) {
            this.bounce();
        }

        for(var i in brickRow1){
            brickRow1[i].checkIfBallHitMe()
        }
        for(var i in brickRow2){
            brickRow2[i].checkIfBallHitMe()
        }
        for(var i in brickRow3){
            brickRow3[i].checkIfBallHitMe()
        }

        // update ball position
        this.x += this.vx;
        this.y += this.vy;
    };

    // just reverse the vertical velocity of the ball
    this.bounce = function(){
        this.vy *= -1;
    };
}

function Paddle() {
    this.x = paddleStartX;
    this.y = paddleStartY;

    this.draw = function(brush) {
        brush.fillRect(this.x, this.y, paddleSizeX, paddleSizeY);
    };
}

// special hit codes for a brick tell the game what to do when you hit a brick
var regularBrick = 0;       // A regular brick gives one point
var doubleScoreBrick = 1;   // Gives 2 points
var randomScoreBrick = 2;   // Gives random number of points
var ballEasyToHitBrick = 3; // Makes the ball travel vertical and slow, so its easy to hit

function Brick(x, y, color) {
    // position of the brick's upper left corner
    this.x = x;
    this.y = y;

    // The specialHitCode tell the game what to do when you hit the brick.
    this.setSpecialHitCode = function(){
        // generate a random number between 1 and 50
        // we use Math.round to keep the random number an integer instead of a float
        var randomNumber = Math.round(Math.random() * 50);

        if (randomNumber == 1) {
            this.color = orange;
            return doubleScoreBrick;
        }
        else if (randomNumber == 2) {
            this.color = darkorange;
            return  randomScoreBrick;
        }
        else if (randomNumber == 3) {
            this.color = yellow;
            return  ballEasyToHitBrick;
        }
        else { // number must be between 4 and 50
            this.color = color;
            return regularBrick;
        }
    };

    this.specialHitCode = this.setSpecialHitCode();

    // whether the brick should be drawn (because it hasnt ever been hit by the ball)
    this.shouldDrawBrick = true;

    // draw the brick
    this.draw = function(brush) {
        if(this.shouldDrawBrick) {
            brush.fillStyle = this.color;
            brush.fillRect(this.x, this.y, brickSizeX, brickSizeY);
        }
    };

    this.checkIfBallHitMe = function() {
        if (this.shouldDrawBrick){
            // check if the ball has hit this brick
            if (b.x > this.x && b.x < this.x + brickSizeX + XspaceBetweenBricks && b.y > this.y && b.y < this.y + + brickSizeY + YspaceBetweenBricks) {this.shouldDrawBrick = false;
                b.bounce();

                // what happens when the ball hits this brick depends on what kind of brick it is
                if (this.specialHitCode == doubleScoreBrick){
                    // score 2 points instead of 1
                    increaseScore(2);
                }
                else if (this.specialHitCode == randomScoreBrick){
                    // score a random integer number of points between 1 and 5
                    increaseScore(Math.round(Math.random()* 5 + 1));
                }
                else if (this.specialHitCode == ballEasyToHitBrick){
                    increaseScore(1);
                    b.makeBallEasyToHit();
                }
                else { // must be a regular score brick
                    increaseScore(1);
                }
            }
        }
    };
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

    // Draw all 3 rows of bricks
    for(var i in brickRow1) {
        brickRow1[i].draw(brush);
    }
    for(var i in brickRow2) {
        brickRow2[i].draw(brush);
    }
    for(var i in brickRow3) {
        brickRow3[i].draw(brush);
    }

    // draw the stats on the HTML
    $('#score').html("Player:" + "xxx" + "      Current Score:" + score);
    $('#hiscore').html("High score during this session:" + hiScoreDuringThisGame);
    $('#highestscoreever').html("Your highest score ever:" + "xxx");

    // control the paddle
    if (leftArrowKeyPressed && p.x > 0) {
        p.x -= paddleMoveSpeed;
    } else if (rightArrowKeyPressed && p.x < screenSizeX - paddleSizeX) {
        p.x += paddleMoveSpeed;
    }

    // Move the ball
    b.move();

    window.requestAnimationFrame(drawGame);
}

// create three rows of bricks
function createBricks(){
 // brickx is the horiontal location of the brick
    var brickx = XspaceBetweenBricks;
    var row1Y = 10;
    var row2Y = row1Y + brickSizeY + YspaceBetweenBricks;
    var row3Y = row2Y + brickSizeY + YspaceBetweenBricks;

    // loop to create 25 bricks in 3 rows
    for (var i = 1; i <= numberOfBricksPerRow; i++){
// I found how to add to arrays of objects on stackoverflow.com/questions/15742442/declaring-array-of-objects
        brickRow1.push(new Brick(brickx, row1Y, red));
        brickRow2.push(new Brick(brickx, row2Y, blue));
        brickRow3.push(new Brick(brickx, row3Y, green));

        // update the horiontal location of the brick (to the right)
        brickx += brickSizeX + XspaceBetweenBricks;
    }
}

// increase score is called whenever the ball hits a brick
function increaseScore(extra){
    score += extra;
    // update hi score if necessary
    if (hiScoreDuringThisGame < score) {
        hiScoreDuringThisGame = score;
    }
}

// gameOver is called when the paddle misses a ball
function gameOver(){
    score = 0;
    // restore all bricks
    for(var i in brickRow1){
        brickRow1[i].shouldDrawBrick = true;
        brickRow2[i].shouldDrawBrick = true;
        brickRow3[i].shouldDrawBrick = true;
    }
}

// The values used in this program
var ballStartX = 300;
var ballStartY = 90;

var ballRadius = 10;

var screenSizeX = 600;
var screenSizeY = 400;

var paddleSizeX = 60;
var paddleSizeY = 10;

var paddleStartX = 275;
var paddleStartY = 375;

var paddleMoveSpeed = 5;

var brickSizeX = 20;
var brickSizeY = 10;
var XspaceBetweenBricks = 5;
var YspaceBetweenBricks = 5;
var numberOfBricksPerRow = 25;

// color codes are listed at http://www.w3schools.com/html/html_colornames.asp
var white = '#fff';
var black = '#000';
var red = '#ff0000';
var blue = '#0000ff';
var green = '#008000';
var darkorange = '#ff8c00';
var orange = '#ffa500';
var yellow = '#ffff00';



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
var hiScoreDuringThisGame = 0;
var playerName; // need to pull this from the database
var highestScoreEver; // need to pull this from the database


var b = new Ball();
var p = new Paddle();

// Create three rows of bricks
// I found how to make arrays of objects and add to them on stackoverflow.com/questions/15742442/declaring-array-of-objects
var brickRow1 = new Array();
var brickRow2 = new Array();
var brickRow3 = new Array();
createBricks();

drawGame();