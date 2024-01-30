import { Point } from "../math/primitives/point.js";
import { ShapeRendererOptions } from "./shapeRendererOptions.js";
import { Shape } from "./shape.js";

export class Circle extends Shape {
  selectedFillStyle = '#999485';
  selectedStrokeStyle = '#c79304';
  selectedThickness = 2;

  constructor(
    private point: Point,
    public readonly radius: number = 7) {
    super();
  }


  render(context: CanvasRenderingContext2D, options: ShapeRendererOptions = {}): void {
    context.beginPath();
    context.arc(this.point.x, this.point.y, this.radius, 0, 2 * Math.PI);

    let { fillColor = "black", strokeColor = "grey", lineThickness = 2, dashes = [] } = options;
    if (this.point.selected) {
      dashes = [5, 5];
      strokeColor = "yellow"
      lineThickness = 5;
    }

    context.lineWidth = lineThickness;
    context.strokeStyle = strokeColor;
    context.fillStyle = fillColor;
    context.setLineDash(dashes)

    context.stroke();
    context.fill();
  }

  overlap(anotherCircle: Circle): boolean {
    const distanceBetweenCenters = this.point.distanceFrom(anotherCircle.point);
    const sumOfRadii = this.radius + anotherCircle.radius;
    return distanceBetweenCenters < sumOfRadii;
  }


  calculateArea(): number {
    return 2 * Math.PI * this.radius ** 2;
  }


}

