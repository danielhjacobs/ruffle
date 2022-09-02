This is the tracking document for **flash.net.NetGroup** in AVM2. We will check off each item of progress as appropriate, and fill in any relevant or missing information as we continue development of Ruffle.
# Legend

Each checkbox is independent of another. It's entirely possible for something to be tested but not exist yet, or for us to believe that it's completely functional but we haven't made enough tests to prove it.
## "Property Exists"

This means the item exists, but may not necessarily be fully implemented.
## "Has Test Coverage"

This means that we believe that we have a good test coverage of this item, regardless of if those tests pass. It's okay to have tests available but not implement the item yet.
## "Completely Functional"

This means we believe that the item is completely implemented, and no more work needs to be done towards making it functional.
# flash.net.NetGroup
## Properties
### estimatedMemberCount : Number

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### info : NetGroupInfo

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### localCoverageFrom : String

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### localCoverageTo : String

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### neighborCount : Number

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### receiveMode : String

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### replicationStrategy : String

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


## Methods
### NetGroup(connection:NetConnection, groupspec:String)

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### addHaveObjects(startIndex:Number, endIndex:Number):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### addMemberHint(peerID:String):Boolean

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### addNeighbor(peerID:String):Boolean

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### addWantObjects(startIndex:Number, endIndex:Number):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### close():void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### convertPeerIDToGroupAddress(peerID:String):String

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### denyRequestedObject(requestID:int):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### post(message:Object):String

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### removeHaveObjects(startIndex:Number, endIndex:Number):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### removeWantObjects(startIndex:Number, endIndex:Number):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### sendToAllNeighbors(message:Object):String

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### sendToNearest(message:Object, groupAddress:String):String

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### sendToNeighbor(message:Object, sendMode:String):String

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


### writeRequestedObject(requestID:int, object:Object):void

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional


## Events
### netStatus

* [ ] Property Exists

* [ ] Has Test Coverage

* [ ] Completely Functional