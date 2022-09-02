This is the tracking document for **flash.text.TextSnapshot** in AVM2. We will check off each item of progress as appropriate, and fill in any relevant or missing information as we continue development of Ruffle.
# Legend

Each checkbox is independent of another. It's entirely possible for something to be tested but not exist yet, or for us to believe that it's completely functional but we haven't made enough tests to prove it.
## "Property Exists"

This means the item exists, but may not necessarily be fully implemented.
## "Has Test Coverage"

This means that we believe that we have a good test coverage of this item, regardless of if those tests pass. It's okay to have tests available but not implement the item yet.
## "Completely Functional"

This means we believe that the item is completely implemented, and no more work needs to be done towards making it functional.
# flash.text.TextSnapshot
## Properties
### charCount : int

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


## Methods
### findText(beginIndex:int, textToFind:String, caseSensitive:Boolean):int

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### getSelected(beginIndex:int, endIndex:int):Boolean

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### getSelectedText(includeLineEndings:Boolean = false):String

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### getText(beginIndex:int, endIndex:int, includeLineEndings:Boolean = false):String

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### getTextRunInfo(beginIndex:int, endIndex:int):Array

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### hitTestTextNearPos(x:Number, y:Number, maxDistance:Number = 0):Number

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### setSelectColor(hexColor:uint = 0xFFFF00):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### setSelected(beginIndex:int, endIndex:int, select:Boolean):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional