import { Graph } from "./graph.js";
import { Point } from "./math/primitives/point.js";
import { Segment } from "./math/primitives/segment.js";

export class Application {
    private readonly graph: Graph;

    constructor(canvas: HTMLCanvasElement) {
        this.graph = new Graph(canvas, [], []);
    }

    run(): void {
        this.drawGraph();
    }

    private drawGraph() {
        this.graph.draw();
        requestAnimationFrame(() => this.drawGraph());
    }

    public addRandomPoint(canvasWidth: number, canvasHeight: number) {
        const x = Math.random() * canvasWidth;
        const y = Math.random() * canvasHeight;
        this.graph.tryAddPoint(new Point(x, y));
    }
}