/**
 * Pong (https://en.wikipedia.org/wiki/Pong)
 * Implemented by Dimitri Kokkonis (https://kokkonisd.github.io/)
 * This file contains the main logic code for the Pong game.
 */


// Constants
const CANVAS_WIDTH = 700;
const CANVAS_HEIGHT = 500;
const PADDLE_WIDTH = 8;
const PADDLE_HEIGHT = 40;
const PADDLE_SPEED = 10;

const W_KEY = 87;
const S_KEY = 83;

// Paddles
let leftPaddle;
let rightPaddle;


function setup ()
{
    canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    background('black');

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

    frameRate(60);
    loop();
}


function draw ()
{
    // Clear canvas
    background('black');

    // Dashed line right down the midle
    draw_dashed_line();

    // Draw scores
    // TODO
    
    // Handle input
    handlePaddleMotion();
    // Draw Paddles
    leftPaddle.display();
    rightPaddle.display();
    
    // Draw Pong
    // TODO
}


function draw_dashed_line ()
{
    push();

    strokeWeight(5);
    stroke('white');
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
