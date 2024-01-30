import { ShapeRendererOptions } from "../../shapes/shapeRendererOptions.js";
import { Point } from "./point.js";

export class Segment {
    constructor(public startPoint: Point, public endPoint: Point) {

    }

    draw(context: CanvasRenderingContext2D, options: ShapeRendererOptions = {}) {
        context.beginPath();
        context.moveTo(this.startPoint.x, this.startPoint.y);
        context.lineTo(this.endPoint.x, this.endPoint.y);
        const { fillColor = "black", strokeColor = "grey", lineThickness = 2, dashes = [] } = options;
        context.strokeStyle = strokeColor;
        context.fillStyle = fillColor;
        context.lineWidth = lineThickness;
        context.setLineDash(dashes);
        context.stroke();
    }

    equal(segment: Segment) {
        return (this.startPoint.equal(segment.startPoint) && this.endPoint.equal(segment.endPoint))
            || (this.endPoint.equal(segment.startPoint) && this.startPoint.equal(segment.endPoint));
    }

    containPoint(point: Point): boolean {
        return this.startPoint.equal(point) || this.endPoint.equal(point);
    }

    pointsEqual(): boolean {
        return this.startPoint.equal(this.endPoint);
    }

    pointsOverlap(): boolean {
        return this.startPoint.getRenderer().overlap(this.endPoint.getRenderer());
    }
}