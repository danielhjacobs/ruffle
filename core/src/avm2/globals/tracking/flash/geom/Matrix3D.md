This is the tracking document for **flash.geom.Matrix3D** in AVM2. We will check off each item of progress as appropriate, and fill in any relevant or missing information as we continue development of Ruffle.
# Legend

Each checkbox is independent of another. It's entirely possible for something to be tested but not exist yet, or for us to believe that it's completely functional but we haven't made enough tests to prove it.
## "Property Exists"

This means the item exists, but may not necessarily be fully implemented.
## "Has Test Coverage"

This means that we believe that we have a good test coverage of this item, regardless of if those tests pass. It's okay to have tests available but not implement the item yet.
## "Completely Functional"

This means we believe that the item is completely implemented, and no more work needs to be done towards making it functional.
# flash.geom.Matrix3D
## Properties
### determinant : Number

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### position : Vector3D

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### rawData : Vector

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


## Methods
### Matrix3D(v:Vector.<Number> = null)

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### append(lhs:Matrix3D):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### appendRotation(degrees:Number, axis:Vector3D, pivotPoint:Vector3D = null):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### appendScale(xScale:Number, yScale:Number, zScale:Number):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### appendTranslation(x:Number, y:Number, z:Number):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### clone():Matrix3D

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### copyColumnFrom(column:uint, vector3D:Vector3D):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### copyColumnTo(column:uint, vector3D:Vector3D):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### copyFrom(sourceMatrix3D:Matrix3D):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### copyRawDataFrom(vector:Vector.<Number>, index:uint = 0, transpose:Boolean = false):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### copyRawDataTo(vector:Vector.<Number>, index:uint = 0, transpose:Boolean = false):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### copyRowFrom(row:uint, vector3D:Vector3D):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### copyRowTo(row:uint, vector3D:Vector3D):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### copyToMatrix3D(dest:Matrix3D):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### decompose(orientationStyle:String = "eulerAngles"):Vector.<Vector3D>

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### deltaTransformVector(v:Vector3D):Vector3D

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### identity():void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### interpolate(thisMat:Matrix3D, toMat:Matrix3D, percent:Number):Matrix3D

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### interpolateTo(toMat:Matrix3D, percent:Number):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### invert():Boolean

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### pointAt(pos:Vector3D, at:Vector3D = null, up:Vector3D = null):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### prepend(rhs:Matrix3D):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### prependRotation(degrees:Number, axis:Vector3D, pivotPoint:Vector3D = null):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### prependScale(xScale:Number, yScale:Number, zScale:Number):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### prependTranslation(x:Number, y:Number, z:Number):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### recompose(components:Vector.<Vector3D>, orientationStyle:String = "eulerAngles"):Boolean

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### transformVector(v:Vector3D):Vector3D

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### transformVectors(vin:Vector.<Number>, vout:Vector.<Number>):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### transpose():void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional