import { Shape } from "./shape.js";
export class Circle extends Shape {
    point;
    radius;
    selectedFillStyle = '#999485';
    selectedStrokeStyle = '#c79304';
    selectedThickness = 2;
    constructor(point, radius = 7) {
        super();
        this.point = point;
        this.radius = radius;
    }
    render(context, options = {}) {
        context.beginPath();
        context.arc(this.point.x, this.point.y, this.radius, 0, 2 * Math.PI);
        let { fillColor = "black", strokeColor = "grey", lineThickness = 2, dashes = [] } = options;
        if (this.point.selected) {
            dashes = [5, 5];
            strokeColor = "yellow";
            lineThickness = 5;
        }
        context.lineWidth = lineThickness;
        context.strokeStyle = strokeColor;
        context.fillStyle = fillColor;
        context.setLineDash(dashes);
        context.stroke();
        context.fill();
    }
    overlap(anotherCircle) {
        const distanceBetweenCenters = this.point.distanceFrom(anotherCircle.point);
        const sumOfRadii = this.radius + anotherCircle.radius;
        return distanceBetweenCenters < sumOfRadii;
    }
    calculateArea() {
        return 2 * Math.PI * this.radius ** 2;
    }
}
