This is the tracking document for **flash.display3D.Context3D** in AVM2. We will check off each item of progress as appropriate, and fill in any relevant or missing information as we continue development of Ruffle.
# Legend

Each checkbox is independent of another. It's entirely possible for something to be tested but not exist yet, or for us to believe that it's completely functional but we haven't made enough tests to prove it.
## "Property Exists"

This means the item exists, but may not necessarily be fully implemented.
## "Has Test Coverage"

This means that we believe that we have a good test coverage of this item, regardless of if those tests pass. It's okay to have tests available but not implement the item yet.
## "Completely Functional"

This means we believe that the item is completely implemented, and no more work needs to be done towards making it functional.
# flash.display3D.Context3D
## Properties
### backBufferHeight : int

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### backBufferWidth : int

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### driverInfo : String

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### enableErrorChecking : Boolean

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### maxBackBufferHeight : int

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### maxBackBufferWidth : int

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### profile : String

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### supportsVideoTexture : Boolean

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### totalGPUMemory : Number

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


## Methods
### clear(red:Number = 0.0, green:Number = 0.0, blue:Number = 0.0, alpha:Number = 1.0, depth:Number = 1.0, stencil:uint = 0, mask:uint = 0xffffffff):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### configureBackBuffer(width:int, height:int, antiAlias:int, enableDepthAndStencil:Boolean = true, wantsBestResolution:Boolean = false, wantsBestResolutionOnBrowserZoom:Boolean = false):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### createCubeTexture(size:int, format:String, optimizeForRenderToTexture:Boolean, streamingLevels:int = 0):flash.display3D.textures:CubeTexture

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### createIndexBuffer(numIndices:int, bufferUsage:String = "staticDraw"):IndexBuffer3D

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### createProgram():Program3D

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### createRectangleTexture(width:int, height:int, format:String, optimizeForRenderToTexture:Boolean):flash.display3D.textures:RectangleTexture

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### createTexture(width:int, height:int, format:String, optimizeForRenderToTexture:Boolean, streamingLevels:int = 0):flash.display3D.textures:Texture

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### createVertexBuffer(numVertices:int, data32PerVertex:int, bufferUsage:String = "staticDraw"):VertexBuffer3D

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


###     createVertexBufferForInstances(numVertices:int, data32PerVertex:int, instancesPerElement:int, bufferUsage:String = "staticDraw"):VertexBuffer3D

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### createVideoTexture():flash.display3D.textures:VideoTexture

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### dispose(recreate:Boolean = true):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


###     drawToBitmapData(destination:BitmapData, srcRect:Rectangle = null, destPoint:Point = null):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### drawTriangles(indexBuffer:IndexBuffer3D, firstIndex:int = 0, numTriangles:int = -1):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


###     drawTrianglesInstanced(indexBuffer:IndexBuffer3D, numInstances:int, firstIndex:int = 0, numTriangles:int = -1):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### present():void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### setBlendFactors(sourceFactor:String, destinationFactor:String):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### setColorMask(red:Boolean, green:Boolean, blue:Boolean, alpha:Boolean):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### setCulling(triangleFaceToCull:String):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### setDepthTest(depthMask:Boolean, passCompareMode:String):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


###     setFillMode(fillMode:String):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### setProgram(program:Program3D):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### setProgramConstantsFromByteArray(programType:String, firstRegister:int, numRegisters:int, data:ByteArray, byteArrayOffset:uint):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### setProgramConstantsFromMatrix(programType:String, firstRegister:int, matrix:Matrix3D, transposedMatrix:Boolean = false):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### setProgramConstantsFromVector(programType:String, firstRegister:int, data:Vector.<Number>, numRegisters:int = -1):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### setRenderToBackBuffer():void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### setRenderToTexture(texture:flash.display3D.textures:TextureBase, enableDepthAndStencil:Boolean = false, antiAlias:int = 0, surfaceSelector:int = 0, colorOutputIndex:int = 0):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### setSamplerStateAt(sampler:int, wrap:String, filter:String, mipfilter:String):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### setScissorRectangle(rectangle:Rectangle):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### setStencilActions(triangleFace:String = "frontAndBack", compareMode:String = "always", actionOnBothPass:String = "keep", actionOnDepthFail:String = "keep", actionOnDepthPassStencilFail:String = "keep"):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### setStencilReferenceValue(referenceValue:uint, readMask:uint = 255, writeMask:uint = 255):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### setTextureAt(sampler:int, texture:flash.display3D.textures:TextureBase):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### setVertexBufferAt(index:int, buffer:VertexBuffer3D, bufferOffset:int = 0, format:String = "float4"):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional