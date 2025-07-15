import "./style.scss";

// modules
import { Paddle } from "./paddle";
import { Ball, ballSpeedUpdater } from "./ball";
import {
    Block,
    isTooClose,
    generateFilteredRandomArray,
    getRandomInRange,
} from "./block";
import { Explosion, blockCentreDistance } from "./explosion";

//// Global Variables

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

// levels and blocks destroyed (score) display

const levelDisplay = document.getElementById("level-display")!;
const scoreDisplay = document.getElementById("score-display")!;

// array to store explosions
const explosions: Explosion[] = [];

// initial ball speed
let ballSpeed: number;

//initial level
let level = 1;

// block parameters

const countBlocks = 20;

// boolean statements for game status
let gameStarted = false;
let gameOver = false;

//// function declarations

// function to ensure sizing of canvas is flexible
const resizeCanvas = () => {
    // Set width and height to 75% of the current viewport width /height
    canvas.width = window.innerWidth * 0.75;
    canvas.height = window.innerHeight * 0.75;
};

// function for updating HUD (Heads Up Display containing display of levels and blocks destroyed)
const updateHUD = () => {
    levelDisplay.textContent = `Level: ${level}`; // Or your preferred level logic
    scoreDisplay.textContent = `Blocks Destroyed: ${blocksEliminated}`;
};

// function for resetting game (after user won/lost round)
// updates/resets paddle, ball, blocks etc in game

const resetGame = () => {
    // increase ball speed if previous round was won
    if (!gameOver) {
        ballSpeed += 2;
    }
    // reset logic
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
        canvas.width * 0.05,
        canvas.width * 0.05
    );

    // generate new instances of block classes, stored in blocks array
    newPositions.forEach(([x, y]) =>
        blocks.push(new Block(canvas.width, x, y))
    );

    // reset ball and paddle
    // object.assign allows us to reset, while keeping original variable names
    Object.assign(ball, new Ball(canvas.width, canvas.height, ballSpeed));
    Object.assign(paddle, new Paddle(canvas.width, canvas.height, ballSpeed));
};

// func for activating end screen pop up
// change message depending on if user wins/loses
const showEndScreen = (message: string) => {
    endMessage.textContent = message;
    endScreen.classList.add("active");
};

// main game loop for game

const gameLoop = () => {
    // wait for user to start game
    if (!gameStarted) return;

    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw paddle
    paddle.update(canvas.width);
    paddle.draw(ctx);

    // draw ball
    ball.draw(ctx);

    // update position of ball
    gameOver = ball.update(paddle, canvas.height, canvas.width);
    // check that ball has not escape (losing condition)
    if (gameOver) {
        showEndScreen("Game Over!");
        return;
    }

    // check for block being destroyed
    for (let i = blocks.length - 1; i >= 0; i--) {
        // ball hitting block condition
        if (blocks[i].broken(ball)) {
            // block being explosive
            if (blocks[i].explosive) {
                const explosiveBlock = blocks[i];

                // add new explosion to array of explosions
                // explosion coords == centre of explosive brick
                explosions.push(
                    new Explosion(
                        explosiveBlock.x + explosiveBlock.width / 2,
                        explosiveBlock.y + explosiveBlock.height / 2,
                        explosiveBlock.width * 3
                    )
                );

                // find and remove exploded bricks (including explosive brick)
                for (let j = blocks.length - 1; j >= 0; j--) {
                    // distance from blocks to exploded block
                    const distance = blockCentreDistance(
                        blocks[j],
                        explosiveBlock
                    );
                    // remove blocks 3 width away from explosive block
                    if (distance < explosiveBlock.width * 3) {
                        blocks.splice(j, 1);
                    }
                }

                // update count of blocks eliminated, and HUD
                blocksEliminated = blocksGenerated - blocks.length;
                updateHUD();

                // use break to avoid double mutation in this loop
                break;
            } else {
                // block not being explosive case - just remove the block
                blocks.splice(i, 1);

                // update count of blocks eliminated, and HUD
                blocksEliminated = blocksGenerated - blocks.length;
                updateHUD();
            }
        }
    }
    // loop through array of explosions, displaying or removing explosions
    for (let i = explosions.length - 1; i >= 0; i--) {
        const active = explosions[i].update();
        // remove explosion if inactive
        if (!active) {
            // remove finished explosion
            explosions.splice(i, 1); // remove finished explosions
        } else {
            // draw active explision
            explosions[i].draw(ctx);
        }
    }

    // check for winning condition
    if (blocks.length === 0) {
        // increase level and display message to user
        level += 1;
        showEndScreen(`You Win! New Level ${level} Unlocked!`);
        return;
    }

    // draw remaining blocks
    for (const block of blocks) {
        block.draw(ctx);
    }

    // call gameLoop again before next screen frame (ensures frame updates)
    requestAnimationFrame(gameLoop);
};

//// DOM manipulation (eventlisteners)

// check if user resizes window
window.addEventListener("resize", resizeCanvas());

// check if user clicks start game button
startButton.addEventListener("click", () => {
    // remove active class from start button element
    // this will get rid of start button when game started
    startScreen.classList.remove("active");
    // change game logic variables accordingly, so we loop through game
    gameStarted = true;
    gameOver = false;
    // start loop through game
    gameLoop();
});
// check if user clicks restart game function
restartButton.addEventListener("click", () => {
    // remove active class from restart button element
    // this will get rid of restart button when game restarted
    endScreen.classList.remove("active");
    // reset game before restarting loop
    resetGame();
    // reset HUD
    updateHUD();
    // start loop again
    gameLoop();
});

// padel keyboard control handlers
// when key pressed down
document.addEventListener("keydown", (e) => {
    // check if key is arrow left/right or a/d
    if (e.key === "ArrowLeft" || e.key === "a") {
        paddle.moveLeft(true);
    } else if (e.key === "ArrowRight" || e.key === "d") {
        paddle.moveRight(true);
    }
});

// when key released
document.addEventListener("keyup", (e) => {
    // check if key is arrow left/right or a/d
    if (e.key === "ArrowLeft" || e.key === "a") {
        paddle.moveLeft(false);
    } else if (e.key === "ArrowRight" || e.key === "d") {
        paddle.moveRight(false);
    }
});

//// Initialising game

// initial resizing
resizeCanvas();

// set initial ball speed, depending on canvas height
ballSpeed = ballSpeedUpdater(canvas.height);

// paddle initialisation
const paddle = new Paddle(canvas.width, canvas.height, ballSpeed);

// ball initialisation
const ball = new Ball(canvas.width, canvas.height, ballSpeed);

// block initialisation
// array of block positions
const blockPositions = generateFilteredRandomArray(
    countBlocks,
    canvas.width,
    canvas.height,
    canvas.width * 0.05,
    canvas.width * 0.05
);

if (!blockPositions) {
    throw new Error("No block positions");
}

// count number of blocks generated (to check winning condition later on)
const blocksGenerated = blockPositions.length;
// start counting number of blocks eliminated
let blocksEliminated = 0;

// array of blocks
const blocks: Block[] = blockPositions.map(
    ([x, y]) => new Block(canvas.width, x, y)
);

// drawing each block
for (const block of blocks) {
    block.draw(ctx);
}

// Start the loop
gameLoop();
