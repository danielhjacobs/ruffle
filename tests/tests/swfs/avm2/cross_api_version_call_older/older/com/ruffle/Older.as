package com.ruffle {
	import flash.display.MovieClip;
	import flash.events.Event;

	public class Older extends MovieClip {
		public function Older() {
			trace("Initialized Older with parent: " + this.parent + " Event = " + Event["WORKER_STATE"]);
            // FIXME - enable this when our error messages match Flash Player
			/*try {
				this.gotoAndPlay("badFrame");
			} catch (e) {
				trace("Caught error: " + e);
			}*/
		}
	
		public function childPublicMethod(target: Object) {
			trace("Older.childPublicMethod: Calling parentPublicMethod() on " + target);
			target.parentPublicMethod();
			trace("Older.olderPublicMethod: Called parentPublicMethod() on " + target);
		}
	
		AS3 function childAS3Method(target: Object) {
			trace("Older.childAS3Method: Calling parentAS3Method() on " + target);
			target.parentAS3Method();
			trace("Older.childAS3Method: Called parentAS3Method() on " + target);
		}
	}
}