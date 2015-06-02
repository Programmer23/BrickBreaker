function Ball() {
    this.x = 300;
    this.y = 20;
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
        var tx = this.x + this.vx;
        var ty = this.y + this.vy;

        if (tx >= 0 && tx <= 600 && ty > 400) {
            this.x = 300;
            this.y = 200;
            this.vx = -3;
            this.vy = 2;
        }

        if (ty >= 0 && ty <= 400 && (tx > 600 || tx < 0)) {
            this.vx *= -1;
        }

        if (tx >=0 && tx <=600 && ty < 0) {
            this.vy *= -1;
        }

        if (tx > p.x && tx < p.x + 60 && ty > p.y && ty < p.y + 10) {
            this.vy *= -1;
        }

        this.x += this.vx;
        this.y += this.vy;
    };
}

function Paddle() {
    this.x = 100;
    this.y = 375;

    this.draw = function(brush) {
        brush.fillRect(this.x, this.y, 60, 10);
    };

    this.move = function(d) {
        this.x += d;
    };
}

function Brick(x, y) {
    this.x = x;
    this.y = y;

    this.draw = function(brush) {
        brush.fillRect(this.x, this.y, 20, 10);
    };
}

$(window).mousemove(function(event) {
    p.move(event.originalEvent.movementX);
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
        brush.fillStyle = '#fff';
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