
"use strict";

/*

    BMInbox

*/

getGlobalThis().BMInbox = class BMInbox extends BMStorableNode {
    
    initPrototype () {

    }

    init () {
        super.init()
 		this.setShouldStore(true)
 		this.setShouldStoreSubnodes(false)
        this.setNoteIsSubnodeCount(true)
        this.setTitle("inbox")
    }
    
}.initThisClass()