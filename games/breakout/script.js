const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");

let w = canvas.width;                       // canvas's width
let h = canvas.height;                      // canvas's height
let r = 5;                                  // ball's radius
let x = (w - r) / 2;                        // ball's horizontal position
let y =  w / 2;                             // ball's vertical position
let dx =  2;                                // ball's horizontal direction
let dy = -2;                                // ball's vertical direction
let ph = 10;                                // paddle's height
let pw = 30;                                // paddle's width
let px = (w - pw) / 2;                      // paddle's horizontal position
let rPressed = false;                       // right key pressed flag
let lPressed = false;                       // left key pressed flag
let rs = 14;                                // number of rows of bricks
let cs = 8;                                 // number of cols of bricks
let bp = 5;                                 // padding in between bricks
let bh = 10;                                // bricks' height
let bw = (w - (bp * (rs + 3)) -20) / rs;    // bricks' width
let bt = 20;                                // brick's offset top
let bl = 20;                                // brick's offset left
let s = 0;                                  // score
let l = 3;                                  // lives remaining

// Init wall

let bricks = [];
for (let c = 0; c < cs; c++) {
    bricks[c] = [];
    for (let r = 0; r < rs; r++) {
        bricks[c][r] = {x: 0, y: 0, status: 1};
    }
}

// Collision detection

function detect() {
    for (let c = 0; c < cs; c++) {
        for (let r = 0; r < rs; r++) {
            let b = bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x + bw && y > b.y && y < b.y + bh) {
                    dy = -dy;
                    b.status = 0;
                    s++;
                }
            }
        }
    }
}

// Draw functions

function drawBoundaries() {
    ctx.beginPath();
    ctx.lineWidth = "10";
    ctx.strokeStyle = "#FFFFFF";
    ctx.rect(10, 10, w-20, h-20);
    ctx.stroke();
    ctx.closePath();
}

function drawBricks() {
    for (let c = 0; c < cs; c++) {
        for (let r = 0; r < rs; r++) {
            if(bricks[c][r].status == 1) {
                let bx = (r * (bw + bp)) + bl;
                let by = (c * (bh + bp)) + bt;
                bricks[c][r].x = bx;
                bricks[c][r].y = by;
                ctx.beginPath();
                ctx.rect(bx, by, bw, bh);
                if      (c < 2) ctx.fillStyle = RGBtoHex(155,   9,  6);
                else if (c < 4) ctx.fillStyle = RGBtoHex(194, 131, 13);
                else if (c < 6) ctx.fillStyle = RGBtoHex(  0, 127, 36);
                else            ctx.fillStyle = RGBtoHex(202, 197, 28);
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.rect(x, y, r, r);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(px, canvas.height-ph-20, pw, ph);
    ctx.fillStyle = RGBtoHex(0, 131, 194);
    ctx.fill();
    ctx.closePath();
}

function draw() {
    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw
    drawBoundaries();
    drawBricks();
    drawBall();
    drawPaddle();
    // Hit a brick?
    detect();
    // Rebound
    if (x + dx > w-r || x + dx < r) {
        dx = -dx;
    }
    if (y + dy < r) {
        dy = -dy;
    }
    else if (y + dy > h-r) {
        if (x > px && x < px + pw) {
          dy = -dy;
        }
        else {
            lives--;
            if(!lives) {
                // Game over
            }
            else {
                x = w/2;
                y = h/2;
                dx =  2;
                dy = -2;
                px = (w - pw)/2;
            }
        }
    }
    // Move
    if(rPressed && px < w-pw) {
        px += 5;
      }
      else if(lPressed && px > 0) {
        px -= 5;
      }
      x += dx;
      y += dy;
}

function RGBtoHex(r,g,b) {
    r = r.toString(16);
    g = g.toString(16);
    b = b.toString(16);
  
    if (r.length == 1)
      r = "0" + r;
    if (g.length == 1)
      g = "0" + g;
    if (b.length == 1)
      b = "0" + b;
  
    return "#" + r + g + b;
}

// Event listeners

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

// Event handlers

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        lPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        lPressed = false;
    }
}

function mouseMoveHandler(e) {
  let relativeX = e.clientX - canvas.offsetLeft;
  if(relativeX > 0 && relativeX < canvas.width) {
    px = relativeX - pw/2;
  }
}


// Draw every 10 ms

setInterval(draw, 10);