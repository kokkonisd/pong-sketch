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


/**
 * Pre-loads sound assets.
 */
function preload ()
{
    soundFormats('wav');
    bounceSound = loadSound('sound/bounce');
    scoreSound = loadSound('sound/score');
}


/**
 * Sets up the audio of the sketch.
 *
 * In Chrome, you need the user to somehow enable audio; this is done here via a "play" button. The sketch does nothing
 * while this has not been clicked.
 */
function setupAudio ()
{
    ctx = getAudioContext();
    ctxOn = createButton('play');
    ctxOn.position(windowWidth / 2 - ctxOn.size().width / 2, CANVAS_HEIGHT / 2 - ctxOn.size().height / 2)

    ctxOn.mouseReleased(() => {
        ctx.resume().then(() => {
        console.log('Audio Context is now ON');
            ctxOn.hide();
            // Launch the sketch
            isPlaying = true;
            loop();
            reset();
        });
    });
}


/**
 * Sets up the sketch.
 */
function setup ()
{
    canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    background('black');
    setupAudio();
    frameRate(60);
    noLoop();

    // Create paddles
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

    // Create pong
    pong = new Pong(CANVAS_WIDTH / 2 - PONG_SIZE / 2,
                    CANVAS_HEIGHT / 2 - PONG_SIZE / 2,
                    PONG_SIZE,
                    PONG_BASE_SPEED);

}


/**
 * Resets the paddles and the pong.
 */
function reset ()
{
    resetPaddles();
    resetPong();
}


/**
 * Draws the game screen on a fixed frequency.
 */
function draw ()
{
    if (!isPlaying) {
        // User hasn't clicked the "play" button yet, do not draw anything
        return
    }

    // Clear canvas
    background('black');

    // Dashed line right down the midle
    drawDashedLine();

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


/**
 * Draws the countdown, based on the global countdown text.
 */
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


/**
 * Draws the score of each player.
 */
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


/**
 * Draws a dashed line straight down the middle of the screen.
 */
function drawDashedLine ()
{
    push();

    strokeWeight(5);
    stroke('gray');
    drawingContext.setLineDash([10, 25]);
    line(CANVAS_WIDTH / 2, 0, CANVAS_WIDTH / 2, CANVAS_HEIGHT);

    pop();
}


/**
 * Handles user input for paddles.
 */
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


/**
 * Resets the paddles to their original position.
 */
function resetPaddles ()
{
    leftPaddle.y = CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2;
    rightPaddle.y = CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2;
}


/**
 * Resets the pong to its original position.
 *
 * A 3 second countdown is performed before the paddle is launched again.
 */
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


/**
 * Updates the pong's orientation, velocity and position based on where it is and what it's hitting.
 */
function updatePong ()
{
    // Allow a few pixels of tolerance for collision detection
    let verticalTolerance = 5;
    let horizontalTolerance = 2;

    // Move pong
    pong.x += pong.speedX * pong.directionX;
    pong.y += pong.speedY * pong.directionY;

    // Pong has hit the left side
    if (pong.x <= leftPaddle.width - horizontalTolerance) {
        // If the left paddle is there, bounce back
        if ((pong.y + pong.size >= leftPaddle.y - verticalTolerance) &&
            (pong.y <= leftPaddle.y + leftPaddle.height + verticalTolerance)) {
            // Play a bounce sound
            bounceSound.play();
            // Speed up the pong
            pong.speedX += PONG_SPEED_INCREMENT;
            pong.speedY += PONG_SPEED_INCREMENT;
            // Change the pong's horizontal direction
            pong.directionX = -pong.directionX;
        // If not, right player scores
        } else {
            // Play a score sound
            scoreSound.play();
            // Increase right player's score
            rightScore++;
            // Reset the pong
            resetPong();
        }
    }

    if (pong.x + pong.size >= CANVAS_WIDTH - rightPaddle.width + horizontalTolerance) {
        // If the right paddle is there, bounce back
        if ((pong.y + pong.size >= rightPaddle.y - verticalTolerance) &&
            (pong.y <= rightPaddle.y + rightPaddle.height + verticalTolerance)) {
            // Play a bounce sound
            bounceSound.play();
            // Speed up the pong
            pong.speedX += PONG_SPEED_INCREMENT;
            pong.speedY += PONG_SPEED_INCREMENT;
            // Change the pong's horizontal direction
            pong.directionX = -pong.directionX;
        // If not, left player scores
        } else {
            // Play a score sound
            scoreSound.play();
            // Increase left player's score
            leftScore++;
            // Reset the pong
            resetPong();
        }
    }

    // If the pong hits the top or the bottom of the screen, bounce
    if (pong.y <= 0 || pong.y + pong.size >= CANVAS_HEIGHT) {
        // Play a bounce sound
        bounceSound.play();
        // Change the pong's vertical direction
        pong.directionY = -pong.directionY;
    }
}


/**
 * Sleeps for a given amount of milliseconds.
 * @param  {int} ms the amount of milliseconds to sleep for.
 * @return {Promise}    a promise to allow for the Timeout (sleep).
 */
function sleep (ms)
{
  return new Promise(resolve => setTimeout(resolve, ms));
}
