import { Point } from "./math/primitives/point.js";
import { Segment } from "./math/primitives/segment.js";
import { Circle } from "./shapes/circle.js";
export class Graph {
    points;
    segments;
    context;
    mouseStartPoint = null;
    canvas;
    draggerbleIndicator = null;
    segmentIndicator = null;
    circleRadius = 15;
    selectedPoint = null;
    moveResult = false;
    isMouseDown = false;
    isMouseMoving = false;
    constructor(canvas, points = [], segments = []) {
        this.points = points;
        this.segments = segments;
        this.canvas = canvas;
        canvas.setAttribute('tabindex', '0');
        canvas.focus();
        this.context = canvas.getContext('2d');
        this.addEventsToCanvas(canvas);
        this.points.push(new Point(this.canvas.width / 2, this.canvas.height / 2));
    }
    addEventsToCanvas(canvas) {
        canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
        canvas.addEventListener('dblclick', this.onDblClick.bind(this));
        canvas.addEventListener('keydown', this.onKeyPress.bind(this));
    }
    tryAddSegment(segment) {
        if (this.containsSegment(segment))
            return false;
        if (segment.pointsEqual())
            return false;
        if (segment.pointsOverlap())
            return false;
        this.segments.push(segment);
        return false;
    }
    tryRemoveSegment(segment) {
        const index = this.segments.findIndex((seg) => seg.equal(segment));
        if (index == -1)
            return false;
        this.segments.splice(index, 1);
        return true;
    }
    containsSegment(segment) {
        return (this.segments.some(x => x.equal(segment)));
    }
    tryAddPoint(point) {
        const hasValidStartPoint = this.mouseStartPoint;
        if (!this.containsPoint(point) && this.isDragging() && hasValidStartPoint) {
            this.points.push(point);
            return true;
        }
        return false;
    }
    tryRemovePoint(point) {
        if (this.containsPoint(point)) {
            this.points.splice(this.points.indexOf(point), 1);
            return true;
        }
        return false;
    }
    containsPoint(point) {
        const isWithin = this.points.some(x => x.getRenderer().overlap(point.getRenderer()));
        return isWithin;
    }
    overlapAnotherPoint(point) {
        return this.points.find(x => x.getRenderer().overlap(point.getRenderer()) && !x.equal(point));
    }
    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.points.forEach(point => point.render(this.context, new Circle(point, this.circleRadius)));
        this.segments.forEach(seg => seg.draw(this.context));
        if (this.segmentIndicator && this.isMouseDown)
            this.segmentIndicator.draw(this.context, { strokeColor: "#54585e", dashes: [5, 5] });
    }
    closestPoint(point) {
        let minDistance = Number.MAX_SAFE_INTEGER;
        let closest = null;
        for (let index = 0; index < this.points.length; index++) {
            const pt = this.points[index];
            if (pt.distanceFrom(point) < minDistance) {
                closest = pt;
                minDistance = pt.distanceFrom(point);
            }
        }
        return closest;
    }
    deSelectAll() {
        this.points.forEach(point => point.selected = false);
    }
    onDblClick(evt) {
        const point = new Point(evt.offsetX, evt.offsetY);
        const closest = this.closestPoint(point);
        if (closest && closest.getRenderer().overlap(point.getRenderer())) {
            this.deSelectAll();
            closest.selected = true;
            this.selectedPoint = closest;
        }
    }
    onMouseDown(evt) {
        this.isMouseDown = true;
        this.isMouseMoving = false;
        const point = new Point(evt.offsetX, evt.offsetY);
        const overlapedPoint = this.overlapAnotherPoint(point);
        if (overlapedPoint)
            this.mouseStartPoint = overlapedPoint;
    }
    onMouseUp(evt) {
        const endPoint = new Point(evt.offsetX, evt.offsetY);
        if (this.mouseStartPoint && !this.selectedPoint)
            this.tryAddSegment(new Segment(this.mouseStartPoint, endPoint));
        if (this.isMouseDown)
            this.tryAddPoint(endPoint);
        if (this.selectedPoint) {
            if (this.overlapAnotherPoint(this.selectedPoint)) {
                this.selectedPoint.revertMove();
            }
            else {
                this.selectedPoint.completeMove();
            }
        }
        this.reset();
    }
    onMouseMove(evt) {
        this.isMouseMoving = true;
        const point = new Point(evt.offsetX, evt.offsetY);
        this.draggerbleIndicator = this.points.find(x => x.getRenderer().overlap(point.getRenderer())) || null;
        if (this.draggerbleIndicator)
            this.changeCursor('grabbing');
        else
            this.changeCursor('default');
        if (this.selectedPoint)
            this.draggerbleIndicator = null;
        if (this.isMouseDown && this.mouseStartPoint) {
            const closestPoint = this.closestPoint(this.mouseStartPoint);
            if (closestPoint)
                this.segmentIndicator = new Segment(closestPoint, point);
        }
        if (this.selectedPoint && this.isMouseDown) {
            this.selectedPoint.tryMoveTo(point);
            if (this.overlapAnotherPoint(point))
                this.changeCursor('not-allowed');
        }
    }
    onKeyPress(evt) {
        switch (evt.key) {
            case "Backspace":
                this.removePoint();
                break;
            case "ArrowUp":
            case "ArrowDown":
            case "ArrowRight":
            case "ArrowLeft":
                this.moveSelectedPoint(evt.key);
                break;
        }
    }
    moveSelectedPoint(direction) {
        if (!this.selectedPoint) {
            return;
        }
        const delta = 5;
        switch (direction) {
            case "ArrowUp":
                this.selectedPoint.moveTop(delta);
                break;
            case "ArrowDown":
                this.selectedPoint.moveBottom(delta);
                break;
            case "ArrowLeft":
                this.selectedPoint.moveLeft(delta);
                break;
            case "ArrowRight":
                this.selectedPoint.moveRight(delta);
                break;
        }
    }
    removePoint() {
        if (this.selectedPoint) {
            const wasRemove = this.tryRemovePoint(this.selectedPoint);
            if (wasRemove) {
                this.removeSegmentsToApoint(this.selectedPoint);
            }
        }
    }
    reset() {
        this.draggerbleIndicator = null;
        this.mouseStartPoint = null;
        this.isMouseDown = false;
        this.selectedPoint = null;
        this.isMouseMoving = false;
        this.deSelectAll();
        this.changeCursor('default');
    }
    tryMovePoint(from, to) {
        const overlapedPoint = this.overlapAnotherPoint(to);
        if (!overlapedPoint) {
            from.tryMoveTo(to);
            return true;
        }
        return false;
    }
    changeCursor(cursor) {
        document.body.style.cursor = cursor;
    }
    isDragging() {
        return this.isMouseDown && this.isMouseMoving;
    }
    removeSegmentsToApoint(point) {
        const segmentsToRemove = this.getAllSegementToPoint(point);
        segmentsToRemove.forEach(seg => this.tryRemoveSegment(seg));
    }
    getAllSegementToPoint(point) {
        return this.segments.filter(x => x.containPoint(point));
    }
}
