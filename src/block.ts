import type { Ball } from "./ball";

export class Block {
    // position
    public x: number;
    public y: number;
    //dimensions
    public width: number;
    public height: number;
    public hits: number;
    public explosive: boolean;
    constructor(
        // have positions, heigh and width as inputs to constructor, to avoid overlap
        height: number,
        width: number,
        x: number,
        y: number
    ) {
        const r: number = Math.random();
        // 50% chance
        if (r < 0.5) {
            this.hits = 1;
            this.explosive = false;
        } // next 30% chance (0.5 to 0.8)
        else if (r < 0.8) {
            this.hits = 2;
            this.explosive = false;
        } // next 10% chance (0.8 to 0.9)
        else if (r < 0.9) {
            this.hits = 3;
            this.explosive = false;
        } else {
            // next 10% chance (0.9 to 1.0)
            this.hits = 1;
            this.explosive = true;
        }

        // set fixed height and width
        this.width = height;
        this.height = width;
        this.x = x;
        this.y = y;
    }

    // function to check if ball has hit block
    public broken(ball: Ball): boolean {
        // ball 'sides', or rather planes passing through extremities of ball
        // effectively creating enclosing square around ball
        const ballRight = ball.x + ball.radius;
        const ballLeft = ball.x - ball.radius;
        const ballBottom = ball.y + ball.radius;
        const ballTop = ball.y - ball.radius;

        // sides of block

        const blockRight = this.x + this.width;
        const blockLeft = this.x;
        const blockBottom = this.y + this.height;
        const blockTop = this.y;

        const withinBlockX = ballRight >= blockLeft && ballLeft <= blockRight;

        const withinBlockY = ballBottom >= blockTop && ballTop <= blockBottom;

        // check to see paddle collision

        if (withinBlockX && withinBlockY) {
            const overlapLeft = ballRight - blockLeft;
            const overlapRight = blockRight - ballLeft;
            const overlapBottom = blockBottom - ballTop;
            const overlapTop = ballBottom - blockTop;

            const minOverlap = Math.min(
                overlapLeft,
                overlapRight,
                overlapBottom,
                overlapTop
            );

            switch (minOverlap) {
                case overlapLeft:
                    ball.vx = -Math.abs(ball.vx);
                    // decrease hits and check if hits = 0 (block destroyed)
                    this.hits -= 1;
                    return !this.hits ? true : false;
                case overlapRight:
                    ball.vx = Math.abs(ball.vx);
                    this.hits -= 1;
                    return !this.hits ? true : false;
                case overlapTop:
                    ball.vy = -Math.abs(ball.vy);
                    this.hits -= 1;
                    return !this.hits ? true : false;

                case overlapBottom:
                    ball.vy = Math.abs(ball.vy);
                    this.hits -= 1;
                    return !this.hits ? true : false;

                default:
                    return true;
            }
        }
        return false;
    }

    public draw(ctx: CanvasRenderingContext2D) {
        if (this.explosive) {
            ctx.fillStyle = "white";
        } else if (this.hits === 3) {
            ctx.fillStyle = "blue";
        } else if (this.hits === 2) {
            ctx.fillStyle = "purple";
        } else {
            ctx.fillStyle = "yellow";
        }

        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
