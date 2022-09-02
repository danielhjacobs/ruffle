This is the tracking document for **flash.display.BitmapData** in AVM2. We will check off each item of progress as appropriate, and fill in any relevant or missing information as we continue development of Ruffle.
# Legend

Each checkbox is independent of another. It's entirely possible for something to be tested but not exist yet, or for us to believe that it's completely functional but we haven't made enough tests to prove it.
## "Property Exists"

This means the item exists, but may not necessarily be fully implemented.
## "Has Test Coverage"

This means that we believe that we have a good test coverage of this item, regardless of if those tests pass. It's okay to have tests available but not implement the item yet.
## "Completely Functional"

This means we believe that the item is completely implemented, and no more work needs to be done towards making it functional.
# flash.display.BitmapData
## Properties
### height : int

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### rect : Rectangle

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### transparent : Boolean

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### width : int

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


## Methods
### BitmapData(width:int, height:int, transparent:Boolean = true, fillColor:uint = 0xFFFFFFFF)

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### applyFilter(sourceBitmapData:BitmapData, sourceRect:Rectangle, destPoint:Point, filter:BitmapFilter):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### clone():BitmapData

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### colorTransform(rect:Rectangle, colorTransform:flash.geom:ColorTransform):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### compare(otherBitmapData:BitmapData):Object

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### copyChannel(sourceBitmapData:BitmapData, sourceRect:Rectangle, destPoint:Point, sourceChannel:uint, destChannel:uint):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### copyPixels(sourceBitmapData:BitmapData, sourceRect:Rectangle, destPoint:Point, alphaBitmapData:BitmapData = null, alphaPoint:Point = null, mergeAlpha:Boolean = false):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### copyPixelsToByteArray(rect:Rectangle, data:ByteArray):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### dispose():void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### draw(source:IBitmapDrawable, matrix:Matrix = null, colorTransform:flash.geom:ColorTransform = null, blendMode:String = null, clipRect:Rectangle = null, smoothing:Boolean = false):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### drawWithQuality(source:IBitmapDrawable, matrix:Matrix = null, colorTransform:flash.geom:ColorTransform = null, blendMode:String = null, clipRect:Rectangle = null, smoothing:Boolean = false, quality:String = null):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### encode(rect:Rectangle, compressor:Object, byteArray:ByteArray = null):ByteArray

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### fillRect(rect:Rectangle, color:uint):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### floodFill(x:int, y:int, color:uint):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### generateFilterRect(sourceRect:Rectangle, filter:BitmapFilter):Rectangle

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### getColorBoundsRect(mask:uint, color:uint, findColor:Boolean = true):Rectangle

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### getPixel(x:int, y:int):uint

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### getPixel32(x:int, y:int):uint

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### getPixels(rect:Rectangle):ByteArray

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### getVector(rect:Rectangle):Vector.<uint>

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### histogram(hRect:Rectangle = null):Vector.<Vector.<Number>>

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### hitTest(firstPoint:Point, firstAlphaThreshold:uint, secondObject:Object, secondBitmapDataPoint:Point = null, secondAlphaThreshold:uint = 1):Boolean

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### lock():void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### merge(sourceBitmapData:BitmapData, sourceRect:Rectangle, destPoint:Point, redMultiplier:uint, greenMultiplier:uint, blueMultiplier:uint, alphaMultiplier:uint):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### noise(randomSeed:int, low:uint = 0, high:uint = 255, channelOptions:uint = 7, grayScale:Boolean = false):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### paletteMap(sourceBitmapData:BitmapData, sourceRect:Rectangle, destPoint:Point, redArray:Array = null, greenArray:Array = null, blueArray:Array = null, alphaArray:Array = null):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### perlinNoise(baseX:Number, baseY:Number, numOctaves:uint, randomSeed:int, stitch:Boolean, fractalNoise:Boolean, channelOptions:uint = 7, grayScale:Boolean = false, offsets:Array = null):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### pixelDissolve(sourceBitmapData:BitmapData, sourceRect:Rectangle, destPoint:Point, randomSeed:int = 0, numPixels:int = 0, fillColor:uint = 0):int

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### scroll(x:int, y:int):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### setPixel(x:int, y:int, color:uint):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### setPixel32(x:int, y:int, color:uint):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### setPixels(rect:Rectangle, inputByteArray:ByteArray):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### setVector(rect:Rectangle, inputVector:Vector.<uint>):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### threshold(sourceBitmapData:BitmapData, sourceRect:Rectangle, destPoint:Point, operation:String, threshold:uint, color:uint = 0, mask:uint = 0xFFFFFFFF, copySource:Boolean = false):uint

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### unlock(changeRect:Rectangle = null):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional