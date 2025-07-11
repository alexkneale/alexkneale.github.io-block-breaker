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

    constructor(canvasWidth: number, canvasHeight: number) {
        // set flexible width, but fixed height
        this.width = canvasWidth * 0.25;
        this.height = 15;
        // plave paddle in middle (horizontally)
        this.x = (canvasWidth - this.width) / 2;
        // place paddle at 0.9 height down pixels above bottom
        this.y = 0.9 * canvasHeight;
        // set speed
        this.speed = 7;
    }

    public update(canvasWidth: number) {
        if (this.movingRight && this.x + this.width < canvasWidth) {
            this.x += this.speed;
        } else if (this.movingLeft && this.x > 0) {
            this.x -= this.speed;
        }
    }

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "green";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    public moveLeft(on: boolean) {
        this.movingLeft = on;
    }

    public moveRight(on: boolean) {
        this.movingRight = on;
    }
}
