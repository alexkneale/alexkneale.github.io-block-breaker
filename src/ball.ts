import type { Paddle } from "./paddle";

export class Ball {
    // position
    public x: number;
    public y: number;
    //dimensions
    public radius: number;
    // speed
    public speed: number;
    // angle
    public angle: number;
    // speed in each direction
    public vx: number;
    public vy: number;

    constructor(
        // ctx: CanvasRenderingContext2D,
        canvasWidth: number,
        canvasHeight: number,
        speed: number
    ) {
        // this.ctx = ctx;
        // this.canvasWidth = canvasWidth;
        // this.canvasHeight = canvasHeight;

        // radius
        this.radius = 4;

        // place circle in middle (horizontally)
        // x is centre of circle
        this.x = canvasWidth / 2 - this.radius;
        // place ball 100 pixels above bottom
        this.y = 0.1 * canvasHeight;
        // set initial speed
        this.speed = speed;
        // random orientation
        // restrain randomness to be within interesting range of angles (avoid angle close to horizontal/vertical)
        this.angle =
            Math.random() * (1 / 3 - 1 / 6) * Math.PI + (Math.PI * 1) / 6;
        // velocity in each direction
        this.vx = this.speed * Math.cos(this.angle);
        // start negative vertical component, so that ball is not going straight down when game initiated (easier for user to start a game)
        this.vy = -this.speed * Math.sin(this.angle);
    }
    // function to update position of ball and check for
    // - collisions with walls
    // - collisions with blocks
    // returns boolean (whether or not ball has gone through bottom of screen: game over condition)
    public update(
        paddle: Paddle,
        canvasHeight: number,
        canvasWidth: number
    ): boolean {
        // move ball
        this.x += this.vx;
        this.y += this.vy;

        // then check for collisions
        // handle x and y separately

        //x, wall collision (right/left)
        if (this.x + this.radius >= canvasWidth || this.x - this.radius <= 0) {
            this.vx = -this.vx;
        }

        // y, wall collision (top)
        // wall collision (top)
        if (this.y - this.radius <= 0) {
            this.vy = -this.vy;
        }

        // note paddle x and y are coords of top left corner of rectangle
        // here we add radius, as otherwise ball would pass through
        // two extremes of the paddle
        const withinPaddleX =
            this.x + this.radius >= paddle.x &&
            this.x - this.radius <= paddle.x + paddle.width;

        const hittingPaddleY =
            this.y + this.radius >= paddle.y &&
            this.y - this.radius <= paddle.y + paddle.height;

        // check to see paddle collision

        if (withinPaddleX && hittingPaddleY) {
            this.vy = -Math.abs(this.vy); // bounce up
        }

        // Game over: ball below bottom
        if (this.y - this.radius > canvasHeight) {
            return true; // game over
        }

        return false;
    }

    // function for drawing ball, colour red
    public draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.closePath();
    }

    // function to determine ball speed depending on screen size
    // increasing screen size, increase ball speed to make game more lively
    ballSpeedUpdater = (canvasHeight: number): void => {
        if (canvasHeight < 700) {
            this.speed = 6;
        } else if (canvasHeight < 900) {
            this.speed = 7;
        } else if (canvasHeight < 1100) {
            this.speed = 9;
        } else {
            this.speed = 10;
        }
    };
}
