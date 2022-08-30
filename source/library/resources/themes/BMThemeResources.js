"use strict";

/*

    BMThemeResources

    hierarchy:

        BMThemeResources -> Theme -> ThemeClass -> ThemeState -> ThemeAttribute
        global           -> "Dark" -> "Field"   -> "active"   -> "opacity" : "0.5"

    Example use by views:

        BMThemeResources.shared().currentTheme().classNamed("x").attributeNamed("y").value()

    We'd like to implement some form  of inheritance system.
    Example:

    The ThemeClass "FieldValue" has a "unselected" ThemeState, but no "active" ThemeState, 
    so we default to the "unselected" ThemeState.

    Should ThemeClass implement a defaultSubnode() method for failed lookups?
    Should it ask subnodes isDefault()? 


*/

(class BMThemeResources extends BMStorableNode {
    
    static initClass () {
        this.setIsSingleton(true)
		return this
    }

    static initPrototypeSlots () {
    }

    init () {
        super.init()
        this.setTitle("Themes")

        this.setShouldStore(true)
        this.setShouldStoreSubnodes(true)

        this.setNoteIsSubnodeCount(true)
        this.addAction("add")
        this.setSubnodeClasses([BMTheme, BMDefaultTheme])
        this.setNodeCanReorderSubnodes(true)

        //this.setSubnodes([BMDefaultTheme.clone()]) // hack
    }

    activeTheme () {
        return this.subnodes().first()
    }

    defaultThemeClass () {
        return this.activeTheme().subnodes().first()
    }
    
}.initThisClass());
