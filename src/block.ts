import type { Ball } from "./ball";

// hit sound to play when block is hit
const hitSound = new Audio("sounds/block.mp3");
hitSound.volume = 0.5;

//// block class

export class Block {
    // position
    public x: number;
    public y: number;
    //dimensions
    public width: number;
    public height: number;
    public hits: number;
    // whether or not block explosive
    public explosive: boolean;

    // construct using width of canvas and coordinates
    constructor(
        // have positions, heigh and width as inputs to constructor, to avoid overlap
        canvasWidth: number,
        x: number,
        y: number
    ) {
        // type of block (number of hits and explosivity)
        // determined by probability distribution

        const r: number = Math.random();
        // 50% chance that block has one hit and non explosive
        if (r < 0.5) {
            this.hits = 1;
            this.explosive = false;
        } // next 30% chance (0.5 to 0.8)
        // block has 2 hits and is non-explosive
        else if (r < 0.8) {
            this.hits = 2;
            this.explosive = false;
        } // next 10% chance (0.8 to 0.9)
        // block has 3 hits and is non-explosive
        else if (r < 0.9) {
            this.hits = 3;
            this.explosive = false;
        } else {
            // next 10% chance (0.9 to 1.0)
            // block has 1 hit and is explosive
            this.hits = 1;
            this.explosive = true;
        }

        // set fixed height and width
        this.width = canvasWidth * 0.05;
        this.height = this.width;
        this.x = x;
        this.y = y;
    }

    // function to check if ball has hit block
    // returns boolean (true if block has been DESTROYED (not jus hit))
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

        // logic statements to see if ball is within x and y coords of block

        const withinBlockX = ballRight >= blockLeft && ballLeft <= blockRight;

        const withinBlockY = ballBottom >= blockTop && ballTop <= blockBottom;

        // if ball has 'hit' block (within coords of block)

        if (withinBlockX && withinBlockY) {
            // play sounds
            hitSound.currentTime = 0;
            hitSound.play();
            // determine overlap between 'sides' of ball (as described above)
            // and sides of block
            const overlapLeft = ballRight - blockLeft;
            const overlapRight = blockRight - ballLeft;
            const overlapBottom = blockBottom - ballTop;
            const overlapTop = ballBottom - blockTop;

            // find which overlap is smallest
            // this tells us which side of the block the ball hit
            const minOverlap = Math.min(
                overlapLeft,
                overlapRight,
                overlapBottom,
                overlapTop
            );

            // side of block ball hits determines future dynamics of ball
            switch (minOverlap) {
                // e.g. ball hit left side of block, then sign of x component of velocity must be flipped (ball bouncing off left side)
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
                    return false;
            }
        }
        return false;
    }

    // function to draw block
    // number of hits block has determines colour of block
    // explosive --> red with some 'fire' shadow
    // 3 hits --> purple
    // 2 hits --> light blue
    // 1 hit --> light green

    public draw(ctx: CanvasRenderingContext2D) {
        let gradient: CanvasGradient;

        if (this.explosive) {
            gradient = ctx.createLinearGradient(
                this.x,
                this.y,
                this.x,
                this.y + this.height
            );
            gradient.addColorStop(0, "#ff4d4d"); // bright red
            gradient.addColorStop(1, "#ff9900"); // orange
            ctx.shadowColor = "#FFFFFF"; // white glow
            ctx.shadowColor = Math.random() > 0.5 ? "#ff0000" : "#ffa500"; // 'fire' shadow effect
        } else if (this.hits === 3) {
            gradient = ctx.createLinearGradient(
                this.x,
                this.y,
                this.x,
                this.y + this.height
            );
            gradient.addColorStop(0, "#6a0dad"); // purple
            gradient.addColorStop(1, "#8a2be2"); // blue-violet
            ctx.shadowColor = "#FF8C00"; // orange glow
        } else if (this.hits === 2) {
            gradient = ctx.createLinearGradient(
                this.x,
                this.y,
                this.x,
                this.y + this.height
            );
            gradient.addColorStop(0, "#1e90ff"); // dodger blue
            gradient.addColorStop(1, "#00ced1"); // dark turquoise
            ctx.shadowColor = "#8A2BE2"; // violet glow
        } else {
            gradient = ctx.createLinearGradient(
                this.x,
                this.y,
                this.x,
                this.y + this.height
            );
            gradient.addColorStop(0, "#7fff00"); // chartreuse
            gradient.addColorStop(1, "#00ff7f"); // spring green
            ctx.shadowColor = "#3B9C9C"; // cyan glow
        }

        ctx.fillStyle = gradient;
        ctx.shadowBlur = 12;

        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

//// functions

// define type pair
type Pair = [number, number];

// function for checking two blocks are overlapping
export const isTooClose = (
    firstBlock: Pair,
    secondBlock: Pair,
    width: number,
    height: number
): boolean => {
    const dx = Math.abs(firstBlock[0] - secondBlock[0]);
    const dy = Math.abs(firstBlock[1] - secondBlock[1]);
    return dx < width && dy < height;
};

// func for generating random number in a given min max range
export const getRandomInRange = (min: number, max: number): number =>
    Math.random() * (max - min) + min;

// func for attempting to generate n non-overlapping blocks
// at random positions on screen

export const generateFilteredRandomArray = (
    //number of blocks to attempt to generate
    n: number,
    // canvas properties
    canvasWidth: number,
    canvasHeight: number,
    // block properties
    height: number,
    width: number,
    // number of times we try to generate set of blocks (to avoid potentially infinite loop)
    maxAttempts = 1000000
): Pair[] => {
    const result: Pair[] = [];

    let attempts = 0;
    while (result.length < n && attempts < maxAttempts) {
        // generate potential block coord
        const candidate: Pair = [
            getRandomInRange(width, canvasWidth - width),
            getRandomInRange(0, 0.75 * canvasHeight),
        ];

        // check for overlap before pushing
        const isValid = result.every(
            (existing) => !isTooClose(candidate, existing, width, height)
        );

        if (isValid) {
            result.push(candidate);
        }

        attempts++;
    }
    // check to see if fewer than n blocks made
    if (result.length < n) {
        throw new Error(
            `Could not generate ${n} sufficiently distinct points after ${maxAttempts} attempts.`
        );
    }

    return result;
};
