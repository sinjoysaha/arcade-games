var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
var ballXSpeed = 7;
var ballYSpeed = 3;

var paddle1X = 250;
var paddle2X = 250;

var player1Score = 0;
var player2Score = 0;

const RADIUS = 10;
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 10;
const WIN_SCORE = 3;

var showingWinScreen = false;

function calculateMousePos(evt){
	var mouseX = evt.clientX;
	var mouseY = evt.clientY;
	return {x:mouseX,y:mouseY};
}

function handleMouseClick(){
	if(showingWinScreen){
		player1Score=0;
		player2Score=0;
		showingWinScreen=false;
	}
}

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');
	
	ballReset();	
	var fps = 50;
	setInterval(function(){moveEverything();drawEverything();}, 1000/fps);
	
	canvas.addEventListener('mousemove', 
		function(evt){
			var mousePos = calculateMousePos(evt);
			paddle1X = mousePos.x - (PADDLE_WIDTH/2);
		});
		
	canvas.addEventListener('mousedown', handleMouseClick);
}

function ballReset(){
	if(player1Score>=WIN_SCORE || player2Score>=WIN_SCORE){
		showingWinScreen = true;
	}

	ballX = canvas.width/5 + Math.floor(Math.random()*600);
	ballY = canvas.height/2;
	ballXSpeed = (ballXSpeed/Math.abs(ballXSpeed))*(-(5+Math.random()*7));
	ballYSpeed = -ballYSpeed;
	
}

function computerMovement(){
	paddle2XCenter = paddle2X + (PADDLE_WIDTH/2);
	if(paddle2X+PADDLE_WIDTH-50 < ballX){
		paddle2X += 6;
	}
	else if(paddle2X+50 > ballX){
		paddle2X -= 6;
	}
}

function moveEverything(){
	if(showingWinScreen){
		return;
	}
	computerMovement();

	ballX += ballXSpeed;
	ballY += ballYSpeed;
	
	if(ballX-RADIUS < 0){
		ballXSpeed = -ballXSpeed;
		
	}
	if(ballX+RADIUS > canvas.width){
		ballXSpeed = -ballXSpeed;
	}
	if(ballY+RADIUS > canvas.height){
		if(ballX+RADIUS > paddle1X && ballX-RADIUS < paddle1X+PADDLE_WIDTH){
			ballYSpeed = -ballYSpeed;
			
			var deltaX = ballX - (paddle1X + (PADDLE_WIDTH/2));
			ballXSpeed = deltaX*0.25;
		}
		else{
			player2Score++;
			ballReset();
		}
		
	}
	if(ballY-RADIUS < 0){
		if(ballX+RADIUS > paddle2X && ballX-RADIUS < paddle2X+PADDLE_WIDTH){
			ballYSpeed = -ballYSpeed;
			
			var deltaX = ballX - (paddle2X + (PADDLE_WIDTH/2));
			ballXSpeed = deltaX*0.3;
		}
		else{
			player1Score++;
			ballReset();
		}
		
	}
}

function drawNet(){
	canvasContext.fillStyle = 'white';
	for(var i=0;i<canvas.width;i+=40){
		colorRect(i,canvas.height/2 - 1,20,2);
	}
}

function drawEverything() {
	colorRect(0,0,canvas.width, canvas.height,'black');
	
	if(showingWinScreen){
		canvasContext.fillStyle = 'white';
		canvasContext.fillText("Click to continue",canvas.width/2.21, canvas.height*0.75);
		
		if(player1Score>=WIN_SCORE){
			canvasContext.fillText("You WON!",canvas.width/2.13, canvas.height/2);
		}
		else if(player2Score>=WIN_SCORE){
			canvasContext.fillText("You Lose!",canvas.width/2.13, canvas.height/2);
		}
		return;
	}
		
	drawNet();
	
	colorRect(paddle1X,canvas.height-PADDLE_HEIGHT,PADDLE_WIDTH, PADDLE_HEIGHT,'white');
	colorRect(paddle2X,0,PADDLE_WIDTH, PADDLE_HEIGHT,'white');
	
	colorCircle(ballX, ballY, RADIUS, 'white');
	
	canvasContext.fillStyle = 'white';
	canvasContext.fillText(player1Score, canvas.width/2, canvas.height*0.75);
	canvasContext.fillText(player2Score, canvas.width/2, canvas.height*0.25);
	
}

function colorRect(leftX, topY, width, height, drawColor){
	canvasContext.fillStyle = drawColor;
	canvasContext.fillRect(leftX,topY,width, height);
}
function colorCircle(centerX, centerY, radius, drawColor){
	canvasContext.fillStyle = drawColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
	canvasContext.fill();
}

