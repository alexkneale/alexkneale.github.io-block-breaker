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
        // set fixed height and width
        this.width = 150;
        this.height = 20;
        // plave paddle in middle (horizontally)
        // x is midpoint in paddle
        this.x = (canvasWidth - this.width) / 2;
        // place paddle 30 pixels above bottom
        this.y = canvasHeight - this.height - 30;
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
