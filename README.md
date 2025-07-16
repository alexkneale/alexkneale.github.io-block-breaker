# 🚀 Block Breaker Game

A space-themed block breaker game built with **TypeScript**, **HTML5 Canvas**, and **SCSS**. This game features animated explosions, multiple block types, levels, and retro-futuristic visuals.

---

## 📖 Table of Contents

-   [🎮 Game Overview](#game-overview)
-   [⚙️ Features](#️features)
-   [🧱 Block Types](#block-types)
-   [💥 Explosive Mechanics](#explosive-mechanics)
-   [📐 Collision Detection](#collision-detection)
-   [☝️ Touch Screen](#touch-screen)
-   [⚠️ Known Issue: Tunnelling Effect](#️known-issue-tunnelling-effect)
-   [🔧 Future Improvements](#future-improvements)
-   [🖥️ Running the Game](#️running-the-game)
-   [📁 Project Structure](#project-structure)
-   [📜 License](#license)

---

## 🎮 Game Overview

In this breakout-style game, the player controls a paddle to bounce a ball and eliminate blocks on the screen. Destroy all blocks to win each level. The difficulty increases with each level as ball and paddle speeds increase.

The game includes a **heads-up display (HUD)** for level and score, a **popup-based start/end system**, and a **thematic explosion animation** when explosive bricks are hit.

---

## ⚙️ Features

-   Responsive canvas resizing
-   Keyboard paddle control (← → or A / D)
-   Touch Screen functionality for mobile users
-   Multiple levels with increasing speed
-   Animated explosion mechanics
-   Sound effects
-   Four block types with different durability
-   Neon/space visual theme
-   Restart functionality after game over or level win

---

## 🧱 Block Types

There are four types of blocks, each with unique durability and visual style:

| Hits Required | Shadow Color | Description                          |
| ------------- | ------------ | ------------------------------------ |
| 1             | Light Green  | Weak Block                           |
| 2             | Light Blue   | Medium Block                         |
| 3             | Purple       | Strong Block                         |
| 1 (Explosive) | Fiery Orange | Explosive Block with AoE destruction |

These are displayed at the bottom of the game in a **block library section** to help players identify them.

---

## 💥 Explosive Mechanics

When an **explosive block** is hit, all nearby blocks within a defined **blast radius** (3× the block width) are instantly destroyed. The explosion includes a visual animation centered on the explosive block, using a radial expansion effect.

---

## 📐 Collision Detection

The game uses axis-aligned bounding box (AABB) logic with ball-edge checks to determine which side of a block the ball hits:

-   **Top or bottom**: inverts vertical velocity (`vy`)
-   **Left or right**: inverts horizontal velocity (`vx`)

This makes gameplay physically consistent.

---

## ☝️ Touch Screen

To allow mobile and tablet users to enjoy the game, basic touch screen functionality has been implemented. Instead of adding visible on-screen buttons, which can clutter the interface, the canvas itself responds to touch input:

-   When the left side of the canvas is touched, the paddle moves left.
-   When the right side is touched, the paddle moves right.

---

## ⚠️ Known Issue: Tunnelling Effect

At high ball speeds or on small screens with small blocks, the ball may occasionally **pass through block corners** without bouncing — a phenomenon known as the **tunnelling effect**.

This happens when the ball moves so far in a single frame that it _skips over_ the collision zone. While rare, it leads to destroyed blocks without realistic deflection.

### 💡 Potential Fixes

-   Implement continuous collision detection (CCD)
-   Use **raycasting** or **predictive bounding** between frames
-   Reduce frame step or cap ball velocity

This is marked as an area for **future improvement**.

---

## 🔧 Future Improvements

-   Add power-ups and multi-ball mechanics
-   Adaptive difficulty based on performance
-   Fix tunnelling via predictive collision detection

---

## 🖥️ Running the Game

The game is live on Github Pages:

https://alexkneale.github.io/alexkneale.github.io-block-breaker/

## 📁 Project Structure

```
block-breaker/
├── src/
│   ├── main.ts
│   ├── ball.ts
│   ├── paddle.ts
│   ├── block.ts
│   ├── explosion.ts
│   └── style.scss
├── index.html README.md
├── README.md
├── vite.config.ts (if using Vite)
└── package.json
```

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

Enjoy the game and feel free to contribute!
