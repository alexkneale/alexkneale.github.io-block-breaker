import "./style.scss";

import { Paddle } from "./paddle";
import { Ball } from "./ball";
import { Block } from "./block";

//// START GAME CONDITIONS

// get canvas and context
const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
let ballSpeed = 7;

if (!ctx) throw new Error("2D context not supported");

// paddle

const paddle = new Paddle(ctx, canvas.width, canvas.height);

// ball

const ball = new Ball(ctx, canvas.width, canvas.height, ballSpeed);

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

// block parameters
const countBlocks = 10;
const blockHeight = 40;
const blockWidth = 40;

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

// count of blocks eliminated - to determine when game won
let blocksEliminated = 0;

// boolean statements for game status
let gameStarted = false;
let gameOver = false;

// screens and buttons for starting/restarting game
const startScreen = document.getElementById("start-screen") as HTMLDivElement;
const startButton = document.getElementById(
    "start-button"
) as HTMLButtonElement;

const endScreen = document.getElementById("end-screen") as HTMLDivElement;
const endMessage = document.getElementById("end-message") as HTMLHeadingElement;
const restartButton = document.getElementById(
    "restart-button"
) as HTMLButtonElement;

// event listeners for starting and restarting game

startButton.addEventListener("click", () => {
    // remove active class from start button element
    // this will get rid of start button when game started
    startScreen.classList.remove("active");
    // change bools accordingly, so we loop through game
    gameStarted = true;
    gameOver = false;
    gameLoop();
});

restartButton.addEventListener("click", () => {
    // remove active class from restart button element
    // this will get rid of restart button when game restarted
    endScreen.classList.remove("active");
    // reset game before restarting loop
    resetGame();
    gameLoop();
});

function resetGame() {
    // function to reset paddle, ball, blocks etc

    // check if previous round was won
    if (!gameOver) {
        ballSpeed += 1;
    }

    // reset logic for game having been lost (in case it was)
    gameOver = false;

    // empty array of class instances
    blocks.length = 0;

    // restart count of blocks eliminated
    blocksEliminated = 0;

    // generate new coords for blocks
    const newPositions = generateFilteredRandomArray(
        countBlocks,
        canvas.width,
        canvas.height,
        blockWidth,
        blockHeight
    );

    // generate new instances of block classes, stored in blocks array
    newPositions.forEach(([x, y]) =>
        blocks.push(
            new Block(
                ctx,
                canvas.width,
                canvas.height,
                blockHeight,
                blockWidth,
                x,
                y
            )
        )
    );

    // reset ball and paddle
    // object.assign allows us to reset, while keeping original variable names
    Object.assign(ball, new Ball(ctx, canvas.width, canvas.height, ballSpeed));
    Object.assign(paddle, new Paddle(ctx, canvas.width, canvas.height));
}

// func for activating end screen pop up
function showEndScreen(message: string) {
    // change message depending on if user wins/loses
    endMessage.textContent = message;
    endScreen.classList.add("active");
}

function gameLoop() {
    // wait for user to start game, or catch if game over
    if (!gameStarted || gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // draw paddle
    paddle.update();
    paddle.draw();

    // draw ball
    ball.draw();

    // check for ball escaping - losing condition
    gameOver = ball.update(paddle);

    if (gameOver) {
        showEndScreen("Game Over!");
        return;
    }

    // check for block being destroyed
    for (let i = blocks.length - 1; i >= 0; i--) {
        if (blocks[i].broken(ball)) {
            blocks.splice(i, 1); // remove the block
            blocksEliminated++;
        }
    }
    // check for winning condition

    if (blocksEliminated === blocksGenerated) {
        showEndScreen(`You Win! New Level ${ballSpeed - 5} Unlocked!`);
        return;
    }
    // draw remaining blocks
    for (const block of blocks) {
        block.draw();
    }

    requestAnimationFrame(gameLoop);
}

gameLoop(); // Start the loop
