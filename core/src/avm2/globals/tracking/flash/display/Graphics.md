This is the tracking document for **flash.display.Graphics** in AVM2. We will check off each item of progress as appropriate, and fill in any relevant or missing information as we continue development of Ruffle.
# Legend

Each checkbox is independent of another. It's entirely possible for something to be tested but not exist yet, or for us to believe that it's completely functional but we haven't made enough tests to prove it.
## "Property Exists"

This means the item exists, but may not necessarily be fully implemented.
## "Has Test Coverage"

This means that we believe that we have a good test coverage of this item, regardless of if those tests pass. It's okay to have tests available but not implement the item yet.
## "Completely Functional"

This means we believe that the item is completely implemented, and no more work needs to be done towards making it functional.
# flash.display.Graphics
## Methods
### beginBitmapFill(bitmap:BitmapData, matrix:Matrix = null, repeat:Boolean = true, smooth:Boolean = false):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### beginFill(color:uint, alpha:Number = 1.0):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### beginGradientFill(type:String, colors:Array, alphas:Array, ratios:Array, matrix:Matrix = null, spreadMethod:String = "pad", interpolationMethod:String = "rgb", focalPointRatio:Number = 0):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### beginShaderFill(shader:Shader, matrix:Matrix = null):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### clear():void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### copyFrom(sourceGraphics:Graphics):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### cubicCurveTo(controlX1:Number, controlY1:Number, controlX2:Number, controlY2:Number, anchorX:Number, anchorY:Number):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### curveTo(controlX:Number, controlY:Number, anchorX:Number, anchorY:Number):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### drawCircle(x:Number, y:Number, radius:Number):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### drawEllipse(x:Number, y:Number, width:Number, height:Number):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### drawGraphicsData(graphicsData:Vector.<IGraphicsData>):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### drawPath(commands:Vector.<int>, data:Vector.<Number>, winding:String = "evenOdd"):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### drawRect(x:Number, y:Number, width:Number, height:Number):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### drawRoundRect(x:Number, y:Number, width:Number, height:Number, ellipseWidth:Number, ellipseHeight:Number = NaN):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### drawTriangles(vertices:Vector.<Number>, indices:Vector.<int> = null, uvtData:Vector.<Number> = null, culling:String = "none"):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### endFill():void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### lineBitmapStyle(bitmap:BitmapData, matrix:Matrix = null, repeat:Boolean = true, smooth:Boolean = false):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### lineGradientStyle(type:String, colors:Array, alphas:Array, ratios:Array, matrix:Matrix = null, spreadMethod:String = "pad", interpolationMethod:String = "rgb", focalPointRatio:Number = 0):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### lineShaderStyle(shader:Shader, matrix:Matrix = null):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### lineStyle(thickness:Number = NaN, color:uint = 0, alpha:Number = 1.0, pixelHinting:Boolean = false, scaleMode:String = "normal", caps:String = null, joints:String = null, miterLimit:Number = 3):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### lineTo(x:Number, y:Number):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### moveTo(x:Number, y:Number):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### readGraphicsData(recurse:Boolean = true):Vector.<IGraphicsData>

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional