export class Explosion {
    private x: number;
    private y: number;
    private maxRadius: number;
    private currentRadius: number = 0;
    private expansionRate: number = 2;
    private opacity: number = 1;
    private fadeRate: number = 0.02;

    constructor(x: number, y: number, maxRadius: number) {
        this.x = x;
        this.y = y;
        this.maxRadius = maxRadius;
    }

    public update(): boolean {
        this.currentRadius += this.expansionRate;
        this.opacity -= this.fadeRate;
        return this.currentRadius < this.maxRadius && this.opacity > 0;
    }

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 100, 0, ${this.opacity})`; // fiery orange with transparency
        ctx.fill();
    }
}
