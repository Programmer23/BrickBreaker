function Ball() {
    this.x = 300;
    this.y = 200;
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

        if (tx >= 0 && tx <= 600 && (ty > 400 || ty < 0)) {
            this.vy *= -1;
        }

        if (ty >= 0 && ty <= 400 && tx > 600) {
            this.vx *= -1.1;
        }

        if (ty >= 0 && ty <= 400 && tx < 0) {
            this.x = 200;
            this.y = 300;
            this.vx = -3;
            this.vy = 2;
        }

        if (tx > p.x && tx < p.x + 60 && ty > p.y && ty < p.y + 10) {
            this.vx *= -1;
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

function Brick() {
    this.x = 5;
    this.y = 10;

    this.draw = function(brush) {
        brush.fillRect(this.x, this.y, 25, 10);
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
    i.draw(brush);

    // Move
    b.move();

    window.requestAnimationFrame(draw);
}

var b = new Ball();
var p = new Paddle();
var i = new Brick();
draw();