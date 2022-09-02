This is the tracking document for **flash.system.MessageChannel** in AVM2. We will check off each item of progress as appropriate, and fill in any relevant or missing information as we continue development of Ruffle.
# Legend

Each checkbox is independent of another. It's entirely possible for something to be tested but not exist yet, or for us to believe that it's completely functional but we haven't made enough tests to prove it.
## "Property Exists"

This means the item exists, but may not necessarily be fully implemented.
## "Has Test Coverage"

This means that we believe that we have a good test coverage of this item, regardless of if those tests pass. It's okay to have tests available but not implement the item yet.
## "Completely Functional"

This means we believe that the item is completely implemented, and no more work needs to be done towards making it functional.
# flash.system.MessageChannel
## Properties
### messageAvailable : Boolean

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### state : String

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


## Methods
### addEventListener(type:String, listener:Function, useCapture:Boolean = false, priority:int = 0, useWeakReference:Boolean = false):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### close():void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### receive(blockUntilReceived:Boolean = false):*

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### removeEventListener(type:String, listener:Function, useCapture:Boolean = false):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### send(arg:*, queueLimit:int = -1):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### toString():String

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


## Events
### channelMessage

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### channelState

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional