/**
 * Pong (https://en.wikipedia.org/wiki/Pong)
 * Implemented by Dimitri Kokkonis (https://kokkonisd.github.io/)
 * This file contains the main logic code for the Pong game.
 */


// Constants
const CANVAS_WIDTH = 700;
const CANVAS_HEIGHT = 500;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 60;
const PADDLE_SPEED = 10;
const PONG_SIZE = 10;
const PONG_BASE_SPEED = 2;
const PONG_SPEED_INCREMENT = 1;
const W_KEY = 87;
const S_KEY = 83;

// Paddles
let leftPaddle;
let rightPaddle;

// Pong
let pong;

// Scores & countdown
let leftScore = 0;
let rightScore = 0;
let countdown = "3";

// Audio for Chrome
let ctx;
let ctxOn;
let isPlaying = false;
let bounceSound;
let scoreSound;


function preload ()
{
    soundFormats('wav');
    bounceSound = loadSound('sound/bounce');
    scoreSound = loadSound('sound/score');
}


function setupAudio ()
{
    ctx = getAudioContext();
    ctxOn = createButton('play');
    ctxOn.position(windowWidth / 2 - ctxOn.size().width / 2, CANVAS_HEIGHT / 2 - ctxOn.size().height / 2)

    ctxOn.mouseReleased(() => {
        ctx.resume().then(() => {
        console.log('Audio Context is now ON');
            ctxOn.hide();
            isPlaying = true;
            loop();
            reset();
            
        });
    });
}


function setup ()
{
    canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    background('black');
    setupAudio();
    noLoop();


    leftPaddle = new Paddle(0,
                            CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
                            PADDLE_WIDTH,
                            PADDLE_HEIGHT,
                            PADDLE_SPEED,
                            0,
                            CANVAS_HEIGHT);

    rightPaddle = new Paddle(CANVAS_WIDTH - PADDLE_WIDTH,
                             CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
                             PADDLE_WIDTH,
                             PADDLE_HEIGHT,
                             PADDLE_SPEED,
                             0,
                             CANVAS_HEIGHT);

    pong = new Pong(CANVAS_WIDTH / 2 - PONG_SIZE / 2,
                    CANVAS_HEIGHT / 2 - PONG_SIZE / 2,
                    PONG_SIZE,
                    PONG_BASE_SPEED);

    frameRate(60);   
}


function reset ()
{
    resetPaddles();
    resetPong();
}


function draw ()
{
    if (!isPlaying) {
        return
    }
    // Clear canvas
    background('black');

    // Dashed line right down the midle
    drawDashedLane();

    // Draw countdown
    drawCountdown();

    // Draw scores
    drawScores();
    
    // Handle input
    handlePaddleMotion();
    // Draw Paddles
    leftPaddle.display();
    rightPaddle.display();
    
    // Handle Pong's movement
    updatePong();
    // Draw Pong
    pong.display();
}


function drawCountdown ()
{
    push();

    textSize(48);
    fill('white');
    textAlign(CENTER, CENTER);
    textFont('monospace');

    text(countdown, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 40);

    pop();
}


function drawScores ()
{
    push();

    textSize(48);
    fill('white');
    textAlign(CENTER, CENTER);
    textFont('monospace');

    let offset = 50;

    text(str(leftScore), offset, 40);
    text(str(rightScore), CANVAS_WIDTH - offset, 40);

    pop();
}


function drawDashedLane ()
{
    push();

    strokeWeight(5);
    stroke('gray');
    drawingContext.setLineDash([10, 25]);
    line(CANVAS_WIDTH / 2, 0, CANVAS_WIDTH / 2, CANVAS_HEIGHT);

    pop();
}


function handlePaddleMotion ()
{
    if (keyIsDown(UP_ARROW)) {
        rightPaddle.moveUp();
    }

    if (keyIsDown(DOWN_ARROW)) {
        rightPaddle.moveDown();
    }

    if (keyIsDown(W_KEY)) {
        leftPaddle.moveUp();
    }

    if (keyIsDown(S_KEY)) {
        leftPaddle.moveDown();
    }
}


function resetPaddles ()
{
    leftPaddle.y = CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2;
    rightPaddle.y = CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2;
}


async function resetPong ()
{
    pong.x = CANVAS_WIDTH / 2 - pong.size / 2;
    pong.y = CANVAS_HEIGHT / 2 - pong.size / 2;
    pong.directionX = random([1, -1]);
    pong.directionY = random([1, -1]);
    pong.speedX = 0;
    pong.speedY = 0;

    countdown = "3";
    await sleep(1000);
    countdown = "2";
    await sleep(1000);
    countdown = "1";
    await sleep(1000);
    countdown = "";

    pong.speedX = pong.baseSpeed;
    pong.speedY = random(pong.baseSpeed * 0.5, pong.baseSpeed * 2);
}


function updatePong ()
{
    pong.x += pong.speedX * pong.directionX;
    pong.y += pong.speedY * pong.directionY;

    if (pong.x <= leftPaddle.width) {
        if ((pong.y + pong.size >= leftPaddle.y) && (pong.y <= leftPaddle.y + leftPaddle.height)) {
            bounceSound.play();
            pong.speedX += PONG_SPEED_INCREMENT;
            pong.speedY += PONG_SPEED_INCREMENT;
            pong.directionX = -pong.directionX;
        } else {
            scoreSound.play();
            rightScore++;
            resetPong();
        }
    }

    if (pong.x + pong.size >= CANVAS_WIDTH - rightPaddle.width) {
        if ((pong.y + pong.size >= rightPaddle.y) && (pong.y <= rightPaddle.y + rightPaddle.height)) {
            bounceSound.play();
            pong.speedX += PONG_SPEED_INCREMENT;
            pong.speedY += PONG_SPEED_INCREMENT;
            pong.directionX = -pong.directionX;
        } else {
            scoreSound.play();
            leftScore++;
            resetPong();
        }
    }

    if (pong.y <= 0 || pong.y + pong.size >= CANVAS_HEIGHT) {
        bounceSound.play();
        pong.directionY = -pong.directionY;
    }
}


function sleep (ms)
{
  return new Promise(resolve => setTimeout(resolve, ms));
}
