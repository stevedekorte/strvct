"use strict";

/*

    BMBlacklistedPeers

    
*/

(class BMBlacklistedPeers extends BMBlacklist {
    
    initPrototype () {

    }

    init () {
        super.init()	
        this.setShouldStore(true)        
        this.setTitle("peers")
    }
	
}.initThisClass())
