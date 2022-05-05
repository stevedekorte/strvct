"use strict";

/*
    
    BMImageResourcesNode 

*/  

(class BMImageResourcesNode extends BMStorableNode {
    
    initPrototype () {
    }

    init () {
        super.init()

        this.setNodeViewClassName("ImageView")
        this.setSubnodeProto("ImageNode")
        
        this.setNodeCanEditTitle(true)
        this.setNodeCanEditSubtitle(false)
        this.setNodeMinWidth(200)
        this.setTitle(null)
        this.setSubtitle(null)
        
        //this.addActions(["add"])
        //this.setCanDelete(true)

    }
    
}.initThisClass());
