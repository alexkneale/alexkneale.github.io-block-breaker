export class Block {
    // canvas properties
    private ctx: CanvasRenderingContext2D;
    private canvasWidth: number;
    private canvasHeight: number;
    // position
    public x: number;
    public y: number;
    //dimensions
    public width: number;
    public height: number;

    constructor(
        ctx: CanvasRenderingContext2D,
        canvasWidth: number,
        canvasHeight: number,
        // have positions, heigh and width as inputs to constructor, to avoid overlap
        height: number,
        width: number,
        x: number,
        y: number
    ) {
        this.ctx = ctx;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        // set fixed height and width
        this.width = height;
        this.height = width;
        this.x = x;
        this.y = y;
    }

    // function to check if ball has hit block
    public broken(ball: Ball): boolean {
        const withinBlockX =
            ball.x + ball.radius >= this.x &&
            ball.x - ball.radius <= this.x + this.width;

        const withinBlockY =
            ball.y + ball.radius >= this.y &&
            ball.y - ball.radius <= this.y + this.height;

        // check to see paddle collision

        if (withinBlockX && withinBlockY) {
            ball.vy = -ball.vy;
            return true;
        }
    }

    public draw() {
        this.ctx.fillStyle = "blue";
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
