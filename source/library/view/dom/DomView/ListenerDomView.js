"use strict";

/*
    ListenerDomView

    Dealing with EventListers

*/

(class ListenerDomView extends SubviewsDomView {
    
    initPrototype () {
        this.newSlot("eventListenersMap", null)
    }

    init () {
        super.init()
        this.setEventListenersMap(new Map())
        return this
    }

    // --- event listener management ---

    removeAllListeners () {
        const map = this.eventListenersMap()
        map.forEachKV( (k, listener) => { listener.setIsListening(false) } )
        map.clear()
        return this
    }

    hasListenerNamed (className) {
        const map = this.eventListenersMap()
        return map.has(className)
    }

    listenerNamed (className) {
        const map = this.eventListenersMap()
        if (!map.has(className)) {
            const proto = Object.getClassNamed(className)
            assert(!Type.isNullOrUndefined(proto))
            const instance = proto.clone().setListenTarget(this.element()).setDelegate(this)
            map.set(className, instance)
        }
        return map.get(className)
    }

    // --- specific event listeners ---

    animationListener () {
        return this.listenerNamed("AnimationListener")
    }

    clipboardListener () {
        return this.listenerNamed("ClipboardListener")
    }

    windowListener () {
        return this.listenerNamed("WindowListener") // listen target will be the window
    }

    documentListener () {
        return this.listenerNamed("DocumentListener") // listen target will be the window
    }

    browserDragListener () {
        return this.listenerNamed("DragListener")
    }

    dropListener () {
        return this.listenerNamed("DropListener")
    }

    focusListener () {
        return this.listenerNamed("FocusListener")
    }

    mouseListener () {
        return this.listenerNamed("MouseListener")
    }

    keyboardListener () {
        return this.listenerNamed("KeyboardListener")
    }

    touchListener () {
        return this.listenerNamed("TouchListener")
    }

    transitionListener () {
        return this.listenerNamed("TransitionListener")
    }

    // --- invoking event handler methods ---

    invokeMethodNameForEvent (methodName, event) {
        //this.debugLog(".invokeMethodNameForEvent('" + methodName + "')")
        if (this[methodName]) {
            //console.log(this.typeId() + ".invokeMethodNameForEvent('" + methodName + "')")
            const continueProp = this[methodName].apply(this, [event])
            if (continueProp === false) {
                //event.preventDefault()
                event.stopPropagation()
                return false
            }
        }

        return true
    }

    // --- register window resize events ---

    isRegisteredForWindowResize () {
        return this.windowListener().isListening()
    }

    setIsRegisteredForWindowResize (aBool) {
        this.windowListener().setIsListening(aBool)
        return this
    }

    // --- handle window resize events ---

    onWindowResize (event) {
        return true
    }

    // --- register onClick events ---

    isRegisteredForClicks () {
        //return this.mouseListener().isListening()
        return this.defaultTapGesture().isListening()
    }

    setIsRegisteredForClicks (aBool) {
        //this.mouseListener().setIsListening(aBool)
        this.setHasDefaultTapGesture(aBool) // use tap gesture instead of mouse click

        if (aBool) {
            this.makeCursorPointer()
        } else {
            this.makeCursorDefault()
        }

        return this
    }


    // --- mouse events ---
    /*
        NOTE: onTap... is now used instead?
    */

    isRegisteredForMouse () {
        return this.mouseListener().isListening()
    }

    setIsRegisteredForMouse (aBool, useCapture) {
        debugger;
        this.mouseListener().setUseCapture(useCapture).setIsListening(aBool) 
        return this
    }

    onMouseMove (event) {
        return true
    }

    onMouseOver (event) {
        return true
    }

    onMouseLeave (event) {
        return true
    }

    onMouseOver (event) {
        return true
    }

    onMouseDown (event) {
        const methodName = Mouse.shared().downMethodNameForEvent(event)
        if (methodName !== "onMouseDown") {
            this.debugLog(".onMouseDown calling: ", methodName)
            this.invokeMethodNameForEvent(methodName, event)
        }
        return true
    }

    onMouseUp (event) {
        const methodName = Mouse.shared().upMethodNameForEvent(event)
        if (methodName !== "onMouseUp") {
            this.debugLog(".onMouseUp calling: ", methodName)
            this.invokeMethodNameForEvent(methodName, event)
        }
        return true
    }

    // --- keyboard events ---

    isRegisteredForKeyboard () {
        return this.keyboardListener().isListening()
    }

    setIsRegisteredForKeyboard (aBool, useCapture) {
        this.keyboardListener().setUseCapture(useCapture).setIsListening(aBool)

        const e = this.element()
        if (aBool) {
            DomView.setTabCount(DomView.tabCount() + 1)
            e.tabIndex = DomView.tabCount()  // need this in order for focus to work on BrowserColumn?
            //this.setCssAttribute("outline", "none"); // needed?
        } else {
            delete e.tabindex
        }

        return this
    }

    onKeyDown (event) {
        //BMKeyboard.shared().showEvent(event)
        // expand the method name to include combinations of meta keys (e.g. shift, function, control, option, command, etc)
        const methodName = BMKeyboard.shared().downMethodNameForEvent(event)
        //console.log(" onKeyDown ", methodName)
        const result = this.invokeMethodNameForEvent(methodName, event)

        /*
        if (event.repeat) { // should this be a different method name?
            this.forceRedisplay() // can't tell if this works without disabling color transitions on tiles
        }
        */

        return result
    }

    // --- focus and blur event handling ---

    isRegisteredForFocus () {
        return this.focusListener().isListening()
    }

    setIsRegisteredForFocus (aBool) {
        if (aBool === false && !this.hasListenerNamed("FocusListener")) { // todo: clean this up
            return
        }
        this.focusListener().setIsListening(aBool)
        return this
    }

    // --------------------------------------------------------

    onFocusIn (event) {
        return true
    }

    onFocusOut (event) {
        return true
    }

    onFocus (event) {
        //console.log(this.typeId() + " onFocus")
        this.willAcceptFirstResponder();
        // subclasses can override 
        //this.debugLog(" onFocus")
        return true
    }

    onBlur (event) {
        //console.log(this.typeId() + " onBlur")
        this.didReleaseFirstResponder();
        // subclasses can override 
        //this.debugLog(" onBlur")
        return true
    }

    // ------------

    isRegisteredForClipboard () {
        return this.clipboardListener().isListening()
    }

    setIsRegisteredForClipboard (aBool) {
        this.clipboardListener().setIsListening(aBool)
        return this
    }
        

}.initThisClass());