export class Ball {
    // canvas properties
    private ctx: CanvasRenderingContext2D;
    private canvasWidth: number;
    private canvasHeight: number;
    // position
    public x: number;
    public y: number;
    //dimensions
    private radius: number;
    // speed
    private speed: number;
    // angle
    public angle: number;
    // speed in each direction
    public vx: number;
    public vy: number;

    constructor(
        ctx: CanvasRenderingContext2D,
        canvasWidth: number,
        canvasHeight: number
    ) {
        this.ctx = ctx;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        // radius
        this.radius = 4;

        // place circle in middle (horizontally)
        // x is centre of circle
        this.x = canvasWidth / 2 - this.radius;
        // place paddle 100 pixels above bottom
        this.y = 100;
        // set speed
        this.speed = 7;
        // random orientation
        this.angle = Math.random() * 2 * Math.PI;
        // velocity in each direction
        this.vx = this.speed * Math.cos(this.angle);
        this.vy = this.speed * Math.sin(this.angle);
    }

    // move right/left when key pressed and within range
    public update(paddle: Paddle): boolean {
        // move ball
        this.x += this.vx;
        this.y += this.vy;

        // then check for collisions
        // handle x and y separately

        //x, wall collision (right/left)
        if (
            this.x + this.radius >= this.canvasWidth ||
            this.x - this.radius <= 0
        ) {
            this.vx = -this.vx;
        }

        // y, wall collision (top)
        // wall collision (top)
        if (this.y - this.radius <= 0) {
            this.vy = -this.vy;
        }

        // note paddle x and y are coords of top left corner of rectangle
        const withinPaddleX =
            this.x >= paddle.x && this.x <= paddle.x + paddle.width;

        const hittingPaddleY =
            this.y + this.radius >= paddle.y &&
            this.y + this.radius <= paddle.y + paddle.height;

        // check to see paddle collision

        if (withinPaddleX && hittingPaddleY) {
            this.vy = -Math.abs(this.vy); // bounce up
        }

        // Game over: ball below bottom
        if (this.y - this.radius > this.canvasHeight) {
            return true; // game over
        }

        return false;
    }

    public draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = "red";
        this.ctx.fill();
        this.ctx.closePath();
    }
}
