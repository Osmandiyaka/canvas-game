import { Circle } from "../../shapes/circle.js";
export class Point {
    x;
    y;
    renderer = new Circle(this);
    selected = false;
    prevX = 0;
    prevY = 0;
    canvasWidth = 0;
    canvasHeight = 0;
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.prevX = x;
        this.prevY = y;
    }
    equal(point) {
        return this.x == point.x && this.y == point.y;
    }
    render(context, renderer) {
        this.renderer = renderer;
        renderer.render(context);
        this.canvasHeight = context.canvas.height;
        this.canvasWidth = context.canvas.width;
    }
    getRenderer() {
        return this.renderer;
    }
    tryMoveTo(point) {
        if (!point.equal(this)) {
            this.x = point.x;
            this.y = point.y;
        }
    }
    moveLeft(distance) {
        const newX = Math.max(0, this.x - distance);
        this.x = newX;
    }
    moveRight(distance) {
        const newX = Math.min(this.x + distance, this.canvasWidth - this.renderer.radius);
        this.x = newX;
    }
    moveTop(distance) {
        const newY = Math.max(0, this.y - distance);
        this.y = newY;
    }
    moveBottom(distance) {
        const newY = Math.min(this.y + distance, this.canvasHeight - this.renderer.radius);
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
    distanceFrom(point) {
        const distance = Math.sqrt((point.x - this.x) ** 2 + (point.y - this.y) ** 2);
        return distance;
    }
    angleFrom(point) {
        const deltaY = point.y - this.y;
        const deltaX = point.x - this.x;
        const radianAngle = Math.atan2(deltaY, deltaX);
        return radianAngle;
    }
}
