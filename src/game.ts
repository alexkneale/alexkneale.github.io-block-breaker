import { Ball } from "./ball";
import { Block } from "./block";
import { Explosion } from "./explosion";
import { Paddle } from "./paddle";

export class Game {
    // fields
    public document: Document;
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D | null;
    public startScreen: HTMLDivElement;
    public startButton: HTMLButtonElement;
    public endScreen: HTMLDivElement;
    public endMessage: HTMLHeadingElement;
    public restartButton: HTMLButtonElement;
    public levelDisplay: HTMLElement;
    public scoreDisplay: HTMLElement;
    public explosionSound: HTMLAudioElement;
    public explosions: Explosion[];
    public level: number;
    public ballSpeed: number;
    public countBlocks: number;
    public gameStarted: boolean;
    public gameOver: boolean;
    public ball: Ball;
    public paddle: Paddle;
    public blocks: Block[];
    public blockPositions: Pair[];

    public blocksGenerated: number;
    public blocksEliminated: number;

    constructor(document: Document) {
        // set flexible width, but fixed height
        this.document = document;
        this.canvas = document.getElementById(
            "game-canvas"
        ) as HTMLCanvasElement;
        this.canvas.width = window.innerWidth * 0.75;
        this.canvas.height = window.innerHeight * 0.75;
        this.ctx = this.canvas.getContext("2d");
        this.startScreen = document.getElementById(
            "start-screen"
        ) as HTMLDivElement;
        this.startButton = document.getElementById(
            "start-button"
        ) as HTMLButtonElement;
        this.endScreen = document.getElementById(
            "end-screen"
        ) as HTMLDivElement;
        this.endMessage = document.getElementById(
            "end-message"
        ) as HTMLHeadingElement;
        this.restartButton = document.getElementById(
            "restart-button"
        ) as HTMLButtonElement;
        this.levelDisplay = document.getElementById("level-display")!;
        this.scoreDisplay = document.getElementById("score-display")!;
        this.explosionSound = new Audio("sounds/explosion.mp3");
        this.explosionSound.volume = 0.6;
        this.explosions = [];
        this.level = 1;
        this.ballSpeed = 7;
        this.countBlocks = 20;

        // boolean statements for game status
        this.gameStarted = false;
        this.gameOver = false;

        this.paddle = new Paddle(
            this.canvas.width,
            this.canvas.height,
            this.ballSpeed
        );
        this.paddle.paddleSpeedUpdater(this.canvas.height);
        this.ballSpeed = this.paddle.speed;
        // ball initialisation
        this.ball = new Ball(
            this.canvas.width,
            this.canvas.height,
            this.ballSpeed
        );

        // block initialisation
        // array of block positions
        this.blockPositions = Block.generateFilteredRandomArray(
            this.countBlocks,
            this.canvas.width,
            this.canvas.height,
            this.canvas.width * 0.05,
            this.canvas.width * 0.05
        );

        if (!this.blockPositions) {
            throw new Error("No block positions");
        }

        // count number of blocks generated (to check winning condition later on)
        this.blocksGenerated = this.blockPositions.length;
        // start counting number of blocks eliminated
        this.blocksEliminated = 0;

        // array of blocks
        this.blocks = this.blockPositions.map(
            ([x, y]) => new Block(this.canvas.width, x, y)
        );

        this.setupEventListeners();
    }

    // function to ensure sizing of canvas is flexible
    public resizeCanvas = (): void => {
        // Set width and height to 75% of the current viewport width /height
        this.canvas.width = window.innerWidth * 0.75;
        this.canvas.height = window.innerHeight * 0.75;
        this.paddle.paddleSpeedUpdater(this.canvas.height);
        this.ball.ballSpeedUpdater(this.canvas.height);
        this.ballSpeed = this.paddle.speed;
    };

    // function for updating HUD (Heads Up Display containing display of levels and blocks destroyed)
    public updateHUD = () => {
        this.levelDisplay.textContent = `Level: ${this.level}`; // Or your preferred level logic
        this.scoreDisplay.textContent = `Blocks Destroyed: ${this.blocksEliminated}`;
    };

    // function for implementing touch screen movement of paddle
    // here we only consider single touch
    // first finger to touch screen is finger that decides movement of paddle
    // multitouch is not implemented
    public handleTouch(event: TouchEvent): void {
        // TouchEvent contains info about touch
        // first touch on screen
        const touch = event.touches[0];
        // dimensions of canvas
        const canvasRect = this.canvas.getBoundingClientRect();
        // collecting x coord of touch (relative to canvas)
        const touchX = touch.clientX - canvasRect.left;

        // check if user touched left or right side of canvas
        if (touchX < this.canvas.width / 2) {
            this.paddle.moveLeft(true);
            this.paddle.moveRight(false);
        } else {
            this.paddle.moveRight(true);
            this.paddle.moveLeft(false);
        }
    }

    // function for resetting game (after user won/lost round)
    // updates/resets paddle, ball, blocks etc in game

    public resetGame = (): void => {
        // increase ball speed if previous round was won
        if (!this.gameOver) {
            this.ballSpeed += 2;
        }
        // reset logic
        this.gameOver = false;

        // empty array of class instances
        this.blocks.length = 0;

        // restart count of blocks eliminated
        this.blocksEliminated = 0;

        // generate new coords for blocks
        const newPositions = Block.generateFilteredRandomArray(
            this.countBlocks,
            this.canvas.width,
            this.canvas.height,
            this.canvas.width * 0.05,
            this.canvas.width * 0.05
        );

        // generate new instances of block classes, stored in blocks array
        newPositions.forEach(([x, y]) =>
            this.blocks.push(new Block(this.canvas.width, x, y))
        );

        // reset ball and paddle
        // object.assign allows us to reset, while keeping original variable names
        Object.assign(
            this.ball,
            new Ball(this.canvas.width, this.canvas.height, this.ballSpeed)
        );
        Object.assign(
            this.paddle,
            new Paddle(this.canvas.width, this.canvas.height, this.ballSpeed)
        );
    };

    // func for activating end screen pop up
    // change message depending on if user wins/loses
    showEndScreen = (message: string) => {
        this.endMessage.textContent = message;
        this.endScreen.classList.add("active");
    };

    // main game loop for game

    public gameLoop = (): void => {
        if (!this.ctx) return;

        // wait for user to start game
        if (!this.gameStarted) return;

        // clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // draw paddle
        this.paddle.update(this.canvas.width);
        this.paddle.draw(this.ctx);

        // draw ball
        this.ball.draw(this.ctx);

        // update position of ball
        this.gameOver = this.ball.update(
            this.paddle,
            this.canvas.height,
            this.canvas.width
        );
        // check that ball has not escape (losing condition)
        if (this.gameOver) {
            this.showEndScreen("Game Over!");
            return;
        }

        // check for block being destroyed
        for (let i = this.blocks.length - 1; i >= 0; i--) {
            // ball hitting block condition
            if (this.blocks[i].broken(this.ball)) {
                // block being explosive
                if (this.blocks[i].explosive) {
                    this.explosionSound.currentTime = 0;
                    this.explosionSound.play();

                    const explosiveBlock = this.blocks[i];

                    // add new explosion to array of explosions
                    // explosion coords == centre of explosive brick
                    this.explosions.push(
                        new Explosion(
                            explosiveBlock.x + explosiveBlock.width / 2,
                            explosiveBlock.y + explosiveBlock.height / 2,
                            explosiveBlock.width * 3
                        )
                    );

                    // find and remove exploded bricks (including explosive brick)
                    for (let j = this.blocks.length - 1; j >= 0; j--) {
                        // distance from blocks to exploded block
                        const distance = Block.blockCentreDistance(
                            this.blocks[j],
                            explosiveBlock
                        );
                        // remove blocks 3 width away from explosive block
                        if (distance < explosiveBlock.width * 3) {
                            this.blocks.splice(j, 1);
                        }
                    }

                    // update count of blocks eliminated, and HUD
                    this.blocksEliminated =
                        this.blocksGenerated - this.blocks.length;
                    this.updateHUD();

                    // use break to avoid double mutation in this loop
                    break;
                } else {
                    // block not being explosive case - just remove the block
                    this.blocks.splice(i, 1);

                    // update count of blocks eliminated, and HUD
                    this.blocksEliminated =
                        this.blocksGenerated - this.blocks.length;
                    this.updateHUD();
                }
            }
        }

        // loop through array of explosions, displaying or removing explosions
        for (let i = this.explosions.length - 1; i >= 0; i--) {
            const active = this.explosions[i].update();
            // remove explosion if inactive
            if (!active) {
                // remove finished explosion
                this.explosions.splice(i, 1); // remove finished explosions
            } else {
                // draw active explision
                this.explosions[i].draw(this.ctx);
            }
        }

        // check for winning condition
        if (this.blocks.length === 0) {
            // increase level and display message to user
            this.level += 1;
            this.showEndScreen(`You Win! New Level ${this.level} Unlocked!`);
            return;
        }

        // draw remaining blocks
        for (const block of this.blocks) {
            block.draw(this.ctx);
        }

        // call gameLoop again before next screen frame (ensures frame updates)
        requestAnimationFrame(this.gameLoop);
    };

    public startGame = (): void => {
        if (!this.ctx) return;

        // initial resizing
        this.resizeCanvas();

        // drawing each block
        for (const block of this.blocks) {
            block.draw(this.ctx);
        }

        // Start the loop
        this.gameLoop();
    };

    //// DOM manipulation (eventlisteners)

    private setupEventListeners(): void {
        window.addEventListener("resize", this.resizeCanvas);

        this.canvas.addEventListener("touchstart", this.handleTouch.bind(this));
        this.canvas.addEventListener("touchmove", this.handleTouch.bind(this));
        this.canvas.addEventListener("touchend", () => {
            this.paddle.moveLeft(false);
            this.paddle.moveRight(false);
        });

        this.startButton.addEventListener("click", () => {
            this.startScreen.classList.remove("active");
            this.gameStarted = true;
            this.gameOver = false;
            this.gameLoop();
        });

        this.restartButton.addEventListener("click", () => {
            this.endScreen.classList.remove("active");
            this.resetGame();
            this.updateHUD();
            this.gameLoop();
        });

        this.document.addEventListener("keydown", (e) => {
            if (e.key === "ArrowLeft" || e.key === "a")
                this.paddle.moveLeft(true);
            if (e.key === "ArrowRight" || e.key === "d")
                this.paddle.moveRight(true);
        });

        this.document.addEventListener("keyup", (e) => {
            if (e.key === "ArrowLeft" || e.key === "a")
                this.paddle.moveLeft(false);
            if (e.key === "ArrowRight" || e.key === "d")
                this.paddle.moveRight(false);
        });
    }
}
// define type pair
type Pair = [number, number];
