This is the tracking document for **flash.desktop.Clipboard** in AVM2. We will check off each item of progress as appropriate, and fill in any relevant or missing information as we continue development of Ruffle.
# Legend

Each checkbox is independent of another. It's entirely possible for something to be tested but not exist yet, or for us to believe that it's completely functional but we haven't made enough tests to prove it.
## "Property Exists"

This means the item exists, but may not necessarily be fully implemented.
## "Has Test Coverage"

This means that we believe that we have a good test coverage of this item, regardless of if those tests pass. It's okay to have tests available but not implement the item yet.
## "Completely Functional"

This means we believe that the item is completely implemented, and no more work needs to be done towards making it functional.
# flash.desktop.Clipboard
## Properties
### formats : Array

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### generalClipboard : Clipboard

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


###     : supportsFilePromise

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


## Methods
### Clipboard()

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### clear():void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### clearData(format:String):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### getData(format:String, transferMode:String = "originalPreferred"):Object

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### hasFormat(format:String):Boolean

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### setData(format:String, data:Object, serializable:Boolean = true):Boolean

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### setDataHandler(format:String, handler:Function, serializable:Boolean = true):Boolean

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional