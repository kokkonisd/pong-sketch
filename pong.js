/**
 * Pong (https://en.wikipedia.org/wiki/Pong)
 * Implemented by Dimitri Kokkonis (https://kokkonisd.github.io/)
 * This file contains the code describing the Pong object for the Pong game.
 */


class Pong {

    constructor (x, y, size, baseSpeed)
    {
        this.x = x;
        this.y = y;
        this.size = size;
        this.baseSpeed = baseSpeed;
    }


    display ()
    {
        push();

        noStroke();
        fill('white');

        rect(this.x, this.y, this.size);

        pop();
    }

}
