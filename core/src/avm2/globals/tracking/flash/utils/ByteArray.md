This is the tracking document for **flash.utils.ByteArray** in AVM2. We will check off each item of progress as appropriate, and fill in any relevant or missing information as we continue development of Ruffle.
# Legend

Each checkbox is independent of another. It's entirely possible for something to be tested but not exist yet, or for us to believe that it's completely functional but we haven't made enough tests to prove it.
## "Property Exists"

This means the item exists, but may not necessarily be fully implemented.
## "Has Test Coverage"

This means that we believe that we have a good test coverage of this item, regardless of if those tests pass. It's okay to have tests available but not implement the item yet.
## "Completely Functional"

This means we believe that the item is completely implemented, and no more work needs to be done towards making it functional.
# flash.utils.ByteArray
## Properties
### bytesAvailable : uint

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### defaultObjectEncoding : uint

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### endian : String

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### length : uint

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### objectEncoding : uint

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### position : uint

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### shareable : Boolean

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


## Methods
### ByteArray()

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### atomicCompareAndSwapIntAt(byteIndex:int, expectedValue:int, newValue:int):int

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### atomicCompareAndSwapLength(expectedLength:int, newLength:int):int

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### clear():void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### compress(algorithm:String):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### deflate():void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### inflate():void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### readBoolean():Boolean

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### readByte():int

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### readBytes(bytes:ByteArray, offset:uint = 0, length:uint = 0):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### readDouble():Number

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### readFloat():Number

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### readInt():int

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### readMultiByte(length:uint, charSet:String):String

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### readObject():*

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### readShort():int

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### readUnsignedByte():uint

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### readUnsignedInt():uint

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### readUnsignedShort():uint

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### readUTF():String

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### readUTFBytes(length:uint):String

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### toJSON(k:String):*

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### toString():String

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### uncompress(algorithm:String):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### writeBoolean(value:Boolean):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### writeByte(value:int):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### writeBytes(bytes:ByteArray, offset:uint = 0, length:uint = 0):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### writeDouble(value:Number):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### writeFloat(value:Number):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### writeInt(value:int):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### writeMultiByte(value:String, charSet:String):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### writeObject(object:*):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### writeShort(value:int):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### writeUnsignedInt(value:uint):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### writeUTF(value:String):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### writeUTFBytes(value:String):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional