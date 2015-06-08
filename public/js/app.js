function Ball() {
    this.x = 300;
    this.y = 90;
    this.vx = -3;
    this.vy = 2;

    this.draw = function(brush) {
        brush.beginPath();
        brush.arc(this.x, this.y, 10, 0, 2*Math.PI);
        brush.closePath();
        brush.fillStyle = '#fff';
        brush.fill();
    };

    this.move = function() {
        var newx = this.x + this.vx;
        var newy = this.y + this.vy;

        // teleports ball to start position if it hits the bottom of the screen
        if (newx >= 0 && newx <= 600 && newy > 400) {
            this.x = 300;
            this.y = 90;
            this.vx = -3;
            this.vy = 2;
        }

        // if the ball hits the left or right walls, it bounces horizontally
        if (newy >= 0 && newy <= 400 && (newx > 600 || newx < 0)) {
            this.vx *= -1;
        }

        // if the ball hits the top of the screen, it bounces vertically
        if (newx >=0 && newx <=600 && newy < 0) {
            this.vy *= -1;
        }

        // if the ball hits the paddle, it bounces vertically
        if (newx > p.x && newx < p.x + 60 && newy > p.y && newy < p.y + 10) {
            this.vy *= -1.1;
        }

        for(var i in a1){
            a1[i].hit()
        }
        for(var i in a2){
            a2[i].hit()
        }
        for(var i in a3){
            a3[i].hit()
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
        brush.fillRect(this.x, this.y, 60, 10);
    };
}

function Brick(x, y) {
    this.x = x;
    this.y = y;

    this.draw = function(brush) {
        brush.fillRect(this.x, this.y, 20, 10);
    };

    this.hit = function() {
        if (b.x > this.x && b.x < this.x + 20 && b.y > this.y && b.y < this.y + 20) {
            b.bounce();
        }
    }
}

var left = false;
var right = false;

$(window).keydown(function(event) {
    if (event.keyCode == 37) {
        left = true;
    } else if (event.keyCode == 39) {
        right = true;
    }
});

$(window).keyup(function(event) {
    if (event.keyCode == 37) {
        left = false;
    } else if (event.keyCode == 39) {
        right = false;
    }
});

function draw() {
    var canvas = document.getElementById('canvas');
    var brush = canvas.getContext('2d');

    brush.fillStyle = '#000';
    brush.fillRect(0, 0, 600, 400);

    // Draw
    b.draw(brush);
    p.draw(brush);
    for(var i in a1) {
        brush.fillStyle = '#ff0000';
        a1[i].draw(brush);
    }
    for(var i in a2) {
        brush.fillStyle = '#0000ff';
        a2[i].draw(brush);
    }
    for(var i in a3) {
        brush.fillStyle = '#008000';
        a3[i].draw(brush);
    }

    if (left && p.x > 0) {
        p.x -= 5;
    } else if (right && p.x < 536) {
        p.x += 5;
    }

    // Move
    b.move();

    window.requestAnimationFrame(draw);
}

var b = new Ball();
var p = new Paddle();
var a1 = ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9', 'b10', 'b11', 'b12', 'b13', 'b14', 'b15', 'b16', 'b17', 'b18', 'b19', 'b20', 'b21', 'b22', 'b23', 'b24', 'b25'];
var a2 = ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9', 'b10', 'b11', 'b12', 'b13', 'b14', 'b15', 'b16', 'b17', 'b18', 'b19', 'b20', 'b21', 'b22', 'b23', 'b24', 'b25'];
var a3 = ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9', 'b10', 'b11', 'b12', 'b13', 'b14', 'b15', 'b16', 'b17', 'b18', 'b19', 'b20', 'b21', 'b22', 'b23', 'b24', 'b25'];
var bx = 5;
for(var i in a1) {
    a1[i] = new Brick(bx, 10);
    bx += 25;
}
var bx = 5
for(var i in a2) {
    a2[i] = new Brick(bx, 25);
    bx += 25;
}
var bx = 5
for(var i in a3) {
    a3[i] = new Brick(bx, 40);
    bx += 25;
}
draw();