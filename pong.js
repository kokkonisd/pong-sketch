/**
 * Pong (https://en.wikipedia.org/wiki/Pong)
 * Implemented by Dimitri Kokkonis (https://kokkonisd.github.io/)
 * This file contains the code describing the Pong object for the Pong game.
 */


/**
 * This class describes the pong in Pong.
 *
 * @class      Pong (name)
 */
class Pong {

    /**
     * Constructs a new instance of the Pong class.
     *
     * @param {float} x          The horizontal position of the Pong. 
     * @param {float} y          The vertical position of the Pong. 
     * @param {int}   size       The size of the Pong (it's a square). 
     * @param {float} baseSpeed  The base (minimum) movement speed of the Pong. 
     */
    constructor (x, y, size, baseSpeed)
    {
        this.x = x;
        this.y = y;
        this.size = size;
        this.baseSpeed = baseSpeed;
    }


    /**
     * Displays the Pong.
     */
    display ()
    {
        push();

        noStroke();
        fill('white');

        rect(this.x, this.y, this.size);

        pop();
    }

}
