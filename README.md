# Block Breaker

## Basic

We start with creating a basic version of block breaker

### HTML

-   [x] Paddle at bottom of screen
-   [x] Ball
-   [x] Walls everywhere but bottom
-   [x] Blocks to destroy
-   [ ] Pop up to restart game

### SCSS

-   [x] Paddle, walls, blocks and ball should all be different colour
-   [x] Blocks should have fun layout, with opportunities for ball to go through

### TS

-   Paddle
    -   [x] Should be able to move it right/left with arrow keys
-   Paddle/Ball
    -   [x] Ball should bounce off paddle
-   Ball
    -   [x] Should move in 2D at some sort of angle (randomly generated)
    -   [x]
-   Ball / Wall
    -   [x] Should bounce of all walls
-   Ball / Bottom
    -   [x] Should disappear if it goes through bottom. End game condition
-   Ball / Blocks
    -   [x] Ball should bounce off block, and block should then disappear.
-   Pop up to restart game
    -   [ ] Popup, with option to play again

Current Issues with Basic Version

General

-   [ ] ASK REMI ABOUT FORMAT OF TS (order of:
        params, func declaration, class, const variables from doc)

HTML

-   [ ] Would be nice to have opening title page
-   [ ] Would be nice to have start button (less abrupt start)
-   [ ] Would be nice to display blocks destroyed on side (or levels, if we decide to do that)
-   [ ] Would be nice to have game over pop up, and restart option

SCSS

-   [ ] So far not compatible with mobile dimensions --> fix this
-   [ ] Nicer designs than just simple monochromatic blocks and circles

TS

-   [ ] Randomly generated angle can result in boring game it it causes ball trajectory to be too vertical. Change range of randomly generated angle
-   [ ] Include ball bouncing horizontally off side of blocks
-   [ ] Look at ball contact range again (tiny inconsistencies spotted)
-   [ ] Have levels, with updated ball speed
