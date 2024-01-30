import { ShapeRendererOptions } from "./shapeRendererOptions.js";

export abstract class Shape{
  protected id:string;

  constructor(){
    this.id=Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  abstract render(context: CanvasRenderingContext2D, options: ShapeRendererOptions):void;
  abstract calculateArea():number;

}