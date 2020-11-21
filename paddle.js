/**
 * Pong (https://en.wikipedia.org/wiki/Pong)
 * Implemented by Dimitri Kokkonis (https://kokkonisd.github.io/)
 * This file contains the code describing the Paddle object for the Pong game.
 */


class Paddle {

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

    moveUp ()
    {
        if (this.y - this.speed >= this.upperLimit) {
            this.y -= this.speed;
        }
    }

    moveDown ()
    {
        if (this.y + this.height + this.speed <= this.lowerLimit) {
            this.y += this.speed;
        }
    }

}
