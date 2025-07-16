import { Block } from "./block";

// explosion class

export class Explosion {
    // centre of explosion
    private x: number;
    private y: number;
    // max and current radius
    private maxRadius: number;
    private currentRadius: number = 0;
    // animation specifics
    private expansionRate: number = 7;
    private opacity: number = 1;
    private fadeRate: number = 0.001;

    constructor(x: number, y: number, maxRadius: number) {
        this.x = x;
        this.y = y;
        this.maxRadius = maxRadius;
    }

    // update current radius/opacity, and return whether or not explosion finished
    public update(): boolean {
        this.currentRadius += this.expansionRate;
        this.opacity -= this.fadeRate;
        return this.currentRadius < this.maxRadius && this.opacity > 0;
    }
    // draw explosion
    public draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.currentRadius, 0, Math.PI * 2);
        // orange with transparency
        ctx.fillStyle = `rgba(255, 100, 0, ${this.opacity})`;
        ctx.fill();
    }
}
