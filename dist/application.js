import { Graph } from "./graph.js";
import { Point } from "./math/primitives/point.js";
export class Application {
    graph;
    constructor(canvas) {
        this.graph = new Graph(canvas, [], []);
    }
    run() {
        this.drawGraph();
    }
    drawGraph() {
        this.graph.draw();
        requestAnimationFrame(() => this.drawGraph());
    }
    addRandomPoint(canvasWidth, canvasHeight) {
        const x = Math.random() * canvasWidth;
        const y = Math.random() * canvasHeight;
        this.graph.tryAddPoint(new Point(x, y));
    }
}
