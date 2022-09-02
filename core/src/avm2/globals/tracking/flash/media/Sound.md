This is the tracking document for **flash.media.Sound** in AVM2. We will check off each item of progress as appropriate, and fill in any relevant or missing information as we continue development of Ruffle.
# Legend

Each checkbox is independent of another. It's entirely possible for something to be tested but not exist yet, or for us to believe that it's completely functional but we haven't made enough tests to prove it.
## "Property Exists"

This means the item exists, but may not necessarily be fully implemented.
## "Has Test Coverage"

This means that we believe that we have a good test coverage of this item, regardless of if those tests pass. It's okay to have tests available but not implement the item yet.
## "Completely Functional"

This means we believe that the item is completely implemented, and no more work needs to be done towards making it functional.
# flash.media.Sound
## Properties
### bytesLoaded : uint

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### bytesTotal : int

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### id3 : ID3Info

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### isBuffering : Boolean

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### isURLInaccessible : Boolean

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### length : Number

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### url : String

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


## Methods
### Sound(stream:URLRequest = null, context:SoundLoaderContext = null)

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### close():void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### extract(target:ByteArray, length:Number, startPosition:Number = -1):Number

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### load(stream:URLRequest, context:SoundLoaderContext = null):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### loadCompressedDataFromByteArray(bytes:ByteArray, bytesLength:uint):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### loadPCMFromByteArray(bytes:ByteArray, samples:uint, format:String = "float", stereo:Boolean = true, sampleRate:Number = 44100.0):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### play(startTime:Number = 0, loops:int = 0, sndTransform:flash.media:SoundTransform = null):SoundChannel

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


## Events
### complete

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### id3

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### ioError

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### open

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### progress

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### sampleData

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional