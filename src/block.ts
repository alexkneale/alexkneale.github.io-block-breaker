import type { Ball } from "./ball";

export class Block {
    // position
    public x: number;
    public y: number;
    //dimensions
    public width: number;
    public height: number;

    constructor(
        // have positions, heigh and width as inputs to constructor, to avoid overlap
        height: number,
        width: number,
        x: number,
        y: number
    ) {
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
                    return true;
                case overlapRight:
                    ball.vx = Math.abs(ball.vx);
                    return true;
                case overlapTop:
                    ball.vy = -Math.abs(ball.vy);
                    return true;
                case overlapBottom:
                    ball.vy = Math.abs(ball.vy);
                    return true;
                default:
                    return false;
            }
        }
        return false;
    }

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "blue";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
