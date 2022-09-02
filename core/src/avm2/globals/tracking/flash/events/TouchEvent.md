This is the tracking document for **flash.events.TouchEvent** in AVM2. We will check off each item of progress as appropriate, and fill in any relevant or missing information as we continue development of Ruffle.
# Legend

Each checkbox is independent of another. It's entirely possible for something to be tested but not exist yet, or for us to believe that it's completely functional but we haven't made enough tests to prove it.
## "Property Exists"

This means the item exists, but may not necessarily be fully implemented.
## "Has Test Coverage"

This means that we believe that we have a good test coverage of this item, regardless of if those tests pass. It's okay to have tests available but not implement the item yet.
## "Completely Functional"

This means we believe that the item is completely implemented, and no more work needs to be done towards making it functional.
# flash.events.TouchEvent
## Properties
### altKey : Boolean

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### commandKey : Boolean

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### controlKey : Boolean

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### ctrlKey : Boolean

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### isPrimaryTouchPoint : Boolean

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### isRelatedObjectInaccessible : Boolean

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


###     : isTouchPointCanceled

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### localX : Number

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### localY : Number

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### pressure : Number

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### relatedObject : InteractiveObject

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### shiftKey : Boolean

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### sizeX : Number

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### sizeY : Number

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### stageX : Number

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### stageY : Number

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


###     : timestamp

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


###     : touchIntent

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### touchPointID : int

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


## Methods
### TouchEvent(type:String, bubbles:Boolean = true, cancelable:Boolean = false, touchPointID:int = 0, isPrimaryTouchPoint:Boolean = false, localX:Number = NaN, localY:Number = NaN, sizeX:Number = NaN, sizeY:Number = NaN, pressure:Number = NaN, relatedObject:InteractiveObject = null, ctrlKey:Boolean = false, altKey:Boolean = false, shiftKey:Boolean = false, commandKey:Boolean = false, controlKey:Boolean = false, timestamp:Number = NaN, touchIntent:String, samples:ByteArray = null, isTouchPointCanceled:Boolean = false)

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### clone():Event

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


###     getSamples(buffer:ByteArray, append:Boolean = false):uint

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


###     isToolButtonDown(index:int):Boolean

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### toString():String

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### updateAfterEvent():void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


## Constants
###     : PROXIMITY_BEGIN

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


###     : PROXIMITY_END

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


###     : PROXIMITY_MOVE

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


###     : PROXIMITY_OUT

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


###     : PROXIMITY_OVER

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


###     : PROXIMITY_ROLL_OUT

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


###     : PROXIMITY_ROLL_OVER

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### TOUCH_BEGIN : String

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### TOUCH_END : String

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### TOUCH_MOVE : String

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### TOUCH_OUT : String

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### TOUCH_OVER : String

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### TOUCH_ROLL_OUT : String

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### TOUCH_ROLL_OVER : String

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### TOUCH_TAP : String

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional