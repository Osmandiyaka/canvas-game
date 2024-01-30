import { Circle } from "../../shapes/circle.js";

export class Point {
    private renderer: Circle = new Circle(this);
    public selected = false;
    private prevX: number = 0;
    private prevY: number = 0;
    private canvasWidth = 0;
    private canvasHeight = 0;

    constructor(public x: number, public y: number) {
        this.prevX = x;
        this.prevY = y;
    }


    equal(point: Point): boolean {
        return this.x == point.x && this.y == point.y;
    }

    render(context: CanvasRenderingContext2D, renderer: Circle) {
        this.renderer = renderer;
        renderer.render(context);
        this.canvasHeight = context.canvas.height;
        this.canvasWidth = context.canvas.width;
    }

    getRenderer(): Circle {
        return this.renderer;
    }

    tryMoveTo(point: Point) {
        if (!point.equal(this)) {
            this.x = point.x;
            this.y = point.y;
        }
    }

    moveLeft(distance: number) {
        const newX = Math.max(0, this.x - distance);
        this.x = newX;
    }

    moveRight(distance: number) {
        const newX = Math.min(this.x + distance, this.canvasWidth-this.renderer.radius);
        this.x = newX;
    }

    moveTop(distance: number) {
        const newY = Math.max(0, this.y - distance);
        this.y = newY;
    }

    moveBottom(distance: number) {
        const newY = Math.min(this.y + distance, this.canvasHeight-this.renderer.radius);
        this.y = newY;
    }

    completeMove() {
        this.prevX = this.x;
        this.prevY = this.y;
    }

    revertMove() {
        this.x = this.prevX;
        this.y = this.prevY;
    }

    distanceFrom(point: Point): number {
        const distance = Math.sqrt((point.x - this.x) ** 2 + (point.y - this.y) ** 2);
        return distance;
    }

    angleFrom(point: Point): number {
        const deltaY = point.y - this.y;
        const deltaX = point.x - this.x;
        const radianAngle = Math.atan2(deltaY, deltaX);
        return radianAngle;
    }
}