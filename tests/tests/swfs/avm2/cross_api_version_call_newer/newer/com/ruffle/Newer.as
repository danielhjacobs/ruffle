package com.ruffle {
	import flash.display.MovieClip;
	import flash.events.Event;

	public class Newer extends MovieClip {
		public function Newer() {
			trace("Initialized Newer with parent: " + this.parent + " Event = " + Event["WORKER_STATE"]);
            // FIXME - enable this when our error messages match Flash Player
			/*try {
				this.gotoAndPlay("badFrame");
			} catch (e) {
				trace("Caught error: " + e);
			}*/
		}
	
		public function childPublicMethod(target: Object) {
			trace("Newer.childPublicMethod: Calling parentPublicMethod() on " + target);
			target.parentPublicMethod();
			trace("Newer.childPublicMethod: Called parentPublicMethod() on " + target);
		}
	
		AS3 function childAS3Method(target: Object) {
			trace("Newer.childAS3Method: Calling parentAS3Method() on " + target);
			target.parentAS3Method();
			trace("Newer.childAS3Method: Called parentAS3Method() on " + target);
		}
	}
}