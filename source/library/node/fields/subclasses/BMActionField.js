"use strict";

/*

    BMActionField
    
    An abstraction of a UI visible action that can be performed on an object.
    the value is the action method name, the target is the field owner.

*/

(class BMActionField extends BMField {
    
    static availableAsNodePrimitive () {
        return true
    }
    
    initPrototypeSlots () {
        this.overrideSlot("title", null).setShouldStoreSlot(true).setCanInspect(true).setSlotType("String").setLabel("Title")

        this.newSlot("methodName", null).setShouldStoreSlot(true)
        this.newSlot("info", null).setShouldStoreSlot(true)
        //this.newSlot("isEnabled", true).setShouldStoreSlot(true)
        this.newSlot("isEditable", false).setShouldStoreSlot(true)
        //this.newSlot("target", null)
    }

    initPrototype () {
        this.setShouldStore(true)
        this.setNodeTileIsSelectable(true)
        this.setNodeCanInspect(true)
        this.setKeyIsVisible(false)
        this.setValueIsVisible(false)
    }

    init () {
        super.init()
    }

    finalInit () {
        super.finalInit()
        this.initPrototype()
    }

    setTitle (s) {
        super.setTitle(s)
        return this
    }
    
    summary () {
        return ""
    }

    target () {
        const t = this._target;
        return t ? t : this.parentNode()
    }

    canDoAction () {
        const t = this.target()
        const m = this.methodName()
        return t && t[m]
    }

    doAction () {
        if (this.canDoAction()) {
            const func = this.target()[this.methodName()]
            
            if (Type.isFunction(func)) {
                func.call(this.target(), this)
            } else {
                //this.setValueError("no method with this name")
                console.warn("no method with this name")
            }
        } else {
            this.debugLog(" can't perform action ", this.methodName(), " on ", this.target())
        }
	    
	    return this
    }
    
}.initThisClass());