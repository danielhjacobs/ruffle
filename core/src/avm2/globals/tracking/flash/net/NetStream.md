This is the tracking document for **flash.net.NetStream** in AVM2. We will check off each item of progress as appropriate, and fill in any relevant or missing information as we continue development of Ruffle.
# Legend

Each checkbox is independent of another. It's entirely possible for something to be tested but not exist yet, or for us to believe that it's completely functional but we haven't made enough tests to prove it.
## "Property Exists"

This means the item exists, but may not necessarily be fully implemented.
## "Has Test Coverage"

This means that we believe that we have a good test coverage of this item, regardless of if those tests pass. It's okay to have tests available but not implement the item yet.
## "Completely Functional"

This means we believe that the item is completely implemented, and no more work needs to be done towards making it functional.
# flash.net.NetStream
## Properties
### audioReliable : Boolean

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### audioSampleAccess : Boolean

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### backBufferLength : Number

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### backBufferTime : Number

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### bufferLength : Number

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### bufferTime : Number

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### bufferTimeMax : Number

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### bytesLoaded : uint

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### bytesTotal : uint

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### checkPolicyFile : Boolean

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### client : Object

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### currentFPS : Number

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### dataReliable : Boolean

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### farID : String

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### farNonce : String

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### inBufferSeek : Boolean

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### info : NetStreamInfo

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### liveDelay : Number

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### maxPauseBufferTime : Number

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### multicastAvailabilitySendToAll : Boolean

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### multicastAvailabilityUpdatePeriod : Number

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### multicastFetchPeriod : Number

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### multicastInfo : NetStreamMulticastInfo

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### multicastPushNeighborLimit : Number

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### multicastRelayMarginDuration : Number

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### multicastWindowDuration : Number

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### nearNonce : String

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### objectEncoding : uint

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### peerStreams : Array

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### soundTransform : flash.media:SoundTransform

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### time : Number

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### useHardwareDecoder : Boolean

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### useJitterBuffer : Boolean

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### videoReliable : Boolean

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### videoSampleAccess : Boolean

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### videoStreamSettings : VideoStreamSettings

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


## Methods
### NetStream(connection:NetConnection, peerID:String = "connectToFMS")

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### appendBytes(bytes:ByteArray):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### appendBytesAction(netStreamAppendBytesAction:String):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### attach(connection:NetConnection):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### attachAudio(microphone:Microphone):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### attachCamera(theCamera:Camera, snapshotMilliseconds:int = -1):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### close():void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### dispose():void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### onPeerConnect(subscriber:NetStream):Boolean

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### pause():void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### play(... arguments):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### play2(param:NetStreamPlayOptions):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### preloadEmbeddedData(param:NetStreamPlayOptions):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### publish(name:String = null, type:String = null):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### receiveAudio(flag:Boolean):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### receiveVideo(flag:Boolean):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### receiveVideoFPS(FPS:Number):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### resetDRMVouchers():void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### resume():void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### seek(offset:Number):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### send(handlerName:String, ... arguments):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### setDRMAuthenticationCredentials(userName:String, password:String, type:String):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### step(frames:int):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### togglePause():void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


## Events
### asyncError

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### drmAuthenticate

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### drmError

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### drmStatus

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### ioError

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### mediaTypeData

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### netStatus

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### onCuePoint

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### onDRMContentData

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### onImageData

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### onMetaData

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### onPlayStatus

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### onSeekPoint

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### onTextData

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### onXMPData

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### status

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


## Constants
### CONNECT_TO_FMS : String

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### DIRECT_CONNECTIONS : String

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional