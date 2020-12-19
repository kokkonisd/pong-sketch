/**
 * Pong (https://en.wikipedia.org/wiki/Pong)
 * Implemented by Dimitri Kokkonis (https://kokkonisd.github.io/)
 * This file contains the code describing the Paddle object for the Pong game.
 */


/**
 * This class describes a paddle in Pong.
 *
 * @class      Paddle (name)
 */
class Paddle {

    /**
     * Constructs a new instance of the Paddle class.
     *
     * @param {float} x          The horizontal position of the Paddle. 
     * @param {float} y          The vertical position of the Paddle. 
     * @param {int}   width      The width of the Paddle. 
     * @param {int}   height     The height of the Paddle. 
     * @param {float} speed      The movement speed of the Paddle. 
     * @param {float} upperLimit The upper (vertical) limit of the Paddle's movement.
     * @param {float} lowerLimit The lower (vertical) limit of the Paddle's movement.
     */
    constructor (x, y, width, height, speed, upperLimit, lowerLimit)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.upperLimit = upperLimit;
        this.lowerLimit = lowerLimit;
    }


    /**
     * Displays the Paddle.
     */
    display ()
    {
        push();

        noStroke();
        fill('white');

        rect(this.x,
             this.y,
             this.width,
             this.height);

        pop();
    }


    /**
     * Moves the Paddle up.
     */
    moveUp ()
    {
        this.y -= this.speed;

        if (this.y <= this.upperLimit) {
            this.y = 0;
        }
    }


    /**
     * Moves the Paddle down.
     */
    moveDown ()
    {
        this.y += this.speed;

        if (this.y + this.height >= this.lowerLimit) {
            this.y = this.lowerLimit - this.height;
        }
    }

}
