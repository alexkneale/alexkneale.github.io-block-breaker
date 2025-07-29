import "./style.scss";

// modules
import { Paddle } from "./paddle";
import { Ball } from "./ball";

import { Block } from "./block";

import { Explosion } from "./explosion";
import { Game } from "./game";

const game = new Game(document);
game.gameLoop();
