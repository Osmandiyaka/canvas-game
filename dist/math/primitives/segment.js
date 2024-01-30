export class Segment {
    startPoint;
    endPoint;
    constructor(startPoint, endPoint) {
        this.startPoint = startPoint;
        this.endPoint = endPoint;
    }
    draw(context, options = {}) {
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
    equal(segment) {
        return (this.startPoint.equal(segment.startPoint) && this.endPoint.equal(segment.endPoint))
            || (this.endPoint.equal(segment.startPoint) && this.startPoint.equal(segment.endPoint));
    }
    containPoint(point) {
        return this.startPoint.equal(point) || this.endPoint.equal(point);
    }
    pointsEqual() {
        return this.startPoint.equal(this.endPoint);
    }
    pointsOverlap() {
        return this.startPoint.getRenderer().overlap(this.endPoint.getRenderer());
    }
}
