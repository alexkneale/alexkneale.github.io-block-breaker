import "./style.scss";

import { Paddle } from "./paddle";
import { Ball } from "./ball";
import { Block } from "./block";

//// START GAME CONDITIONS

// get canvas and context
const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

if (!ctx) throw new Error("2D context not supported");

//paddle

const paddle = new Paddle(ctx, canvas.width, canvas.height);

// ball

const ball = new Ball(ctx, canvas.width, canvas.height);

// blocks

// define type pair
type Pair = [number, number];

// function for checking two blocks aren't overlapping
const isTooClose = (
    firstBlock: Pair,
    secondBlock: Pair,
    width: number,
    height: number
): boolean => {
    const dx = Math.abs(firstBlock[0] - secondBlock[0]);
    const dy = Math.abs(firstBlock[1] - secondBlock[1]);
    return dx < width && dy < height;
};

const getRandomInRange = (min: number, max: number): number =>
    Math.random() * (max - min) + min;

const generateFilteredRandomArray = (
    n: number,
    canvasWidth: number,
    canvasHeight: number,
    height: number,
    width: number,
    maxAttempts = 1000000
): Pair[] => {
    const result: Pair[] = [];

    let attempts = 0;
    while (result.length < n && attempts < maxAttempts) {
        // generate potential block coord
        const candidate: Pair = [
            getRandomInRange(width, canvasWidth - width),
            getRandomInRange(0, canvasHeight - 150),
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

const countBlocks = 20;
const blockHeight = 20;
const blockWidth = 20;

const blockPositions = generateFilteredRandomArray(
    countBlocks,
    canvas.width,
    canvas.height,
    blockHeight,
    blockWidth
);

if (!blockPositions) {
    throw new Error("No block positions");
}

const blocksGenerated = blockPositions.length;

// array of blocks
const blocks: Block[] = blockPositions.map(
    ([x, y]) =>
        new Block(
            ctx,
            canvas.width,
            canvas.height,
            blockHeight,
            blockWidth,
            x,
            y
        )
);

// drawing each block, at the beginning
for (const block of blocks) {
    block.draw();
}

let blocksEliminated = 0;

function gameLoop() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // draw paddle
    paddle.update();
    paddle.draw();

    // draw ball
    ball.draw();

    // check for ball escaping
    gameOver = ball.update(paddle);

    if (gameOver) {
        alert("Game Over!");
        return;
    }

    // check for block being destroyed
    for (let i = blocks.length - 1; i >= 0; i--) {
        if (blocks[i].broken(ball)) {
            blocks.splice(i, 1); // remove the block
            blocksEliminated++;
        }
    }
    if (blocksEliminated === blocksGenerated) {
        alert("Game Over!");
        return;
    }
    // draw remaining blocks
    for (const block of blocks) {
        block.draw();
    }

    requestAnimationFrame(gameLoop);
}

let gameOver = false;

gameLoop(); // Start the loop
