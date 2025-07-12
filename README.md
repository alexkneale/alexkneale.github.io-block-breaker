# Block Breaker

## Basic

We start with creating a basic version of block breaker. Here is our plan for basic version (06/07/2025)

### HTML

-   [x] Paddle at bottom of screen
-   [x] Ball
-   [x] Walls everywhere but bottom
-   [x] Blocks to destroy
-   [x] Pop up to restart game

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
    -   [x] Popup, with option to play again

Improvements to Basic Version (09/07/2025)

General

HTML

-   [x] Would be nice to have opening title page
-   [x] Would be nice to have start button (less abrupt start)
-   [x] Would be nice to have game over pop up, and restart option

SCSS

-   [ ] So far not compatible with mobile dimensions --> fix this
-   [ ] Nicer designs than just simple monochromatic blocks and circles

TS

-   [x] Randomly generated angle can result in boring game if it causes ball trajectory to be too vertical. Change range of randomly generated angle
-   [x] Include ball bouncing horizontally off side of blocks (ambitious)
-   [x] Look at ball contact range again (tiny inconsistencies spotted)
-   [x] Have levels, with updated ball speed
-   [x] Have different bricks (some with multiple hits /explosions etc)

Final things to add

HTML

-   [x] Display blocks destroyed in round, and current level
-   [x] Have block lives 'library' on side, displaying how many times you need to hit each brick type before they go away
-   [x] On start screen, have brief description of which controls to use (arrows or A/D or touchscreen arrows)

SCSS

-   [x] Add space theme to background
-   [x] Improve designs of blocks, ball and paddle. Something more visually appealing
-   [ ] Sounds when bricks destroyed, explosion sounds when explosive bricks destroyed
-   [ ] Encouraging messages when x blocks destroyed
-   [ ] Messages about speed everytime you level up

TS

-   [ ] Touchscreen?
-   [ ] Multiple Balls extension? (potentially)
