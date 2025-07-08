export class Paddle {
    // canvas properties
    private ctx: CanvasRenderingContext2D;
    private canvasWidth: number;
    // position
    public x: number;
    public y: number;
    //dimensions
    public width: number;
    public height: number;
    // speed
    private speed: number;
    // logic variables for keyboard movement
    private moveLeft: boolean = false;
    private moveRight: boolean = false;

    constructor(
        ctx: CanvasRenderingContext2D,
        canvasWidth: number,
        canvasHeight: number
    ) {
        this.ctx = ctx;
        this.canvasWidth = canvasWidth;
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

        // attach input handlers
        // when key pressed down
        document.addEventListener("keydown", this.keyDownHandler.bind(this));
        // when key released
        document.addEventListener("keyup", this.keyUpHandler.bind(this));
    }

    private keyDownHandler(e: KeyboardEvent) {
        // right arrow or d for right movement
        if (e.key === "ArrowRight" || e.key === "d") this.moveRight = true;
        // left arrow or a for left movement
        else if (e.key === "ArrowLeft" || e.key === "a") this.moveLeft = true;
    }

    private keyUpHandler(e: KeyboardEvent) {
        if (e.key === "ArrowRight" || e.key === "d") this.moveRight = false;
        else if (e.key === "ArrowLeft" || e.key === "a") this.moveLeft = false;
    }

    // move right/left when key pressed and within range
    public update() {
        if (this.moveRight && this.x + this.width < this.canvasWidth) {
            // increase x by speed
            this.x += this.speed;
        } else if (this.moveLeft && this.x > 0) {
            // decrease x by speed
            this.x -= this.speed;
        }
    }

    public draw() {
        this.ctx.fillStyle = "green";
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
