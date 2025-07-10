import "./style.scss";

// modules
import { Paddle } from "./paddle";
import { Ball } from "./ball";
import { Block } from "./block";
import { Explosion } from "./explosion";
//// START GAME CONDITIONS

//// Elements capture
// get canvas and context
const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
if (!ctx) throw new Error("2D context not supported");

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

//// global variables (let ...)

// array to store explosions
const explosions: Explosion[] = [];

// initial ball speed
let ballSpeed = 7;

// define type pair
type Pair = [number, number];

// block parameters
const countBlocks = 10;
const blockHeight = 40;
const blockWidth = 40;

// explosive block radius
const explosiveRadius = 150;

// count of blocks eliminated - to determine when game won

// boolean statements for game status
let gameStarted = false;
let gameOver = false;

//// function declarations

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

// func for generating random number in a given min max range
const getRandomInRange = (min: number, max: number): number =>
    Math.random() * (max - min) + min;

// func for attempting to generate n non-overlapping blocks
// at random positions on screen

const generateFilteredRandomArray = (
    //number of blocks to attempt to generate
    n: number,
    // canvas properties
    canvasWidth: number,
    canvasHeight: number,
    // block properties
    height: number,
    width: number,
    // number of times we try to generate set
    // of blocks (to avoid potentially infinite loop)
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

const resetGame = () => {
    //if(!ctx) return;
    // function to reset paddle, ball, blocks etc

    // check if previous round was won
    if (!gameOver) {
        ballSpeed += 1;
        paddle.speed += 1;
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
        blocks.push(new Block(blockHeight, blockWidth, x, y))
    );

    // reset ball and paddle
    // object.assign allows us to reset, while keeping original variable names
    Object.assign(ball, new Ball(canvas.width, ballSpeed));
    Object.assign(paddle, new Paddle(canvas.width, canvas.height));
};

// func for activating end screen pop up
const showEndScreen = (message: string) => {
    // change message depending on if user wins/loses
    endMessage.textContent = message;
    endScreen.classList.add("active");
};

const blockCentreDistance = (block1: Block, block2: Block): number => {
    return Math.sqrt((block1.x - block2.x) ** 2 + (block1.y - block2.y) ** 2);
};

const brickInExplosionRange = (
    blocks: Block[],
    explosiveBlock: Block
): Block[] => {
    return blocks.filter(
        (block) => blockCentreDistance(block, explosiveBlock) > explosiveRadius
    );
};

const gameLoop = () => {
    // wait for user to start game, or catch if game over
    if (!gameStarted || gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // draw paddle
    paddle.update(canvas.width);
    paddle.draw(ctx);

    // draw ball
    ball.draw(ctx);

    // check for ball escaping - losing condition
    gameOver = ball.update(paddle, canvas.height, canvas.width);

    if (gameOver) {
        showEndScreen("Game Over!");
        return;
    }

    // check for block being destroyed
    for (let i = blocks.length - 1; i >= 0; i--) {
        if (blocks[i].broken(ball)) {
            if (blocks[i].explosive) {
                const explosiveBlock = blocks[i];
                // explosion animation
                explosions.push(
                    new Explosion(
                        blocks[i].x + blocks[i].width / 2,
                        blocks[i].y + blocks[i].height / 2,
                        explosiveRadius
                    )
                );

                // find and remove exploded bricks (including explosive brick)
                blocks = brickInExplosionRange(blocks, explosiveBlock);
                blocksEliminated = blocksGenerated - blocks.length;
            } else {
                blocks.splice(i, 1); // remove the block
                blocksEliminated = blocksGenerated - blocks.length;
            }
        }
    }
    // check for winning condition

    if (blocks.length === 0) {
        showEndScreen(`You Win! New Level ${ballSpeed - 5} Unlocked!`);
        return;
    }
    // draw remaining blocks
    for (const block of blocks) {
        block.draw(ctx);
    }
    for (let i = explosions.length - 1; i >= 0; i--) {
        const active = explosions[i].update();
        if (!active) {
            explosions.splice(i, 1); // remove finished explosions
        } else {
            explosions[i].draw(ctx);
        }
    }

    requestAnimationFrame(gameLoop);
};

//// DOM manipulation (eventlisteners)

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

// padel keyboard control handlers
// when key pressed down
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key === "a") {
        paddle.moveLeft(true);
    } else if (e.key === "ArrowRight" || e.key === "d") {
        paddle.moveRight(true);
    }
}); // when key released
document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft" || e.key === "a") {
        paddle.moveLeft(false);
    } else if (e.key === "ArrowRight" || e.key === "d") {
        paddle.moveRight(false);
    }
});

//// Initialising game

// paddle
const paddle = new Paddle(canvas.width, canvas.height);

// ball
const ball = new Ball(canvas.width, ballSpeed);

// block
// array of block positions
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

// count number of blocks generated
const blocksGenerated = blockPositions.length;
let blocksEliminated = 0;

// array of blocks
let blocks: Block[] = blockPositions.map(
    ([x, y]) => new Block(blockHeight, blockWidth, x, y)
);

// drawing each block
for (const block of blocks) {
    block.draw(ctx);
}

// Start the loop
gameLoop();
