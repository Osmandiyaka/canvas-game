export class Shape {
    id;
    constructor() {
        this.id = Date.now().toString(36) + Math.random().toString(36).substring(2);
    }
}
