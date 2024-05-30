"use strict";

/*

    BMThemeFolder

*/

(class BMThemeClassChildren extends BMThemeFolder {
    
    initPrototypeSlots () {
    }

    init () {
        super.init()
        this.setShouldStore(true)
        this.setShouldStoreSubnodes(true) 
        this.setNodeCanEditTitle(true)
        this.setTitle("children")
        this.setCanDelete(true)
        this.setNodeCanAddSubnode(true)
        this.setSubnodeClasses([BMThemeClass])
        this.setNodeCanReorderSubnodes(true)
    }

    themeClassNamed (name) {
        return this.subnodes().detect(sn => sn.title() === name)
    }

}.initThisClass());
