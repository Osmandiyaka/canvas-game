import { Point } from "./point.js";
import { ShapeRendererOptions } from "../../shapes/shapeRendererOptions.js";

export abstract class PointRenderer {
    constructor(point: Point) {
    }

    abstract render(context: CanvasRenderingContext2D,options:ShapeRendererOptions): void;

}