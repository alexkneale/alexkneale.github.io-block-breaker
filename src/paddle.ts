export class Paddle {
    // position
    public x: number;
    public y: number;
    //dimensions
    public width: number;
    public height: number;
    // speed
    public speed: number;
    // logic variables for keyboard movement
    private movingLeft: boolean = false;
    private movingRight: boolean = false;

    constructor(canvasWidth: number, canvasHeight: number, speed: number) {
        // set flexible width, but fixed height
        this.width = canvasWidth * 0.25;
        this.height = 15;
        // plave paddle in middle (horizontally)
        this.x = (canvasWidth - this.width) / 2;
        // place paddle at 0.9 height down pixels above bottom
        this.y = 0.9 * canvasHeight;
        // set speed
        this.speed = speed;
    }

    // update position of paddle on screen
    public update(canvasWidth: number) {
        // check moving logic, and paddle within canvas, and update accordingly
        if (this.movingRight && this.x + this.width < canvasWidth) {
            this.x += this.speed;
        } else if (this.movingLeft && this.x > 0) {
            this.x -= this.speed;
        }
    }

    // draw paddle
    public draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "aquamarine";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    //functions to update moving logic variables

    public moveLeft(on: boolean) {
        this.movingLeft = on;
    }

    public moveRight(on: boolean) {
        this.movingRight = on;
    }
}
