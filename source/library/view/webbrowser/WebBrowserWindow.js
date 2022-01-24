"use strict";

/*

    WebBrowserWindow

    Abstraction for the main web browser window. 
    Owns a DocumentBody view.

*/

(class WebBrowserWindow extends ProtoClass {
    
    initPrototype () {
    }
    
    init () {
        //throw new Error("this class is meant to be used as singleton, for now")
        super.init()
        //this.showAgent()
        return this
    }

    documentBody () {
        return DocumentBody.shared()
    }
    
    /*  
    electronWindow () {
        if (!this._electronWindow) {
            const remote = require("electron").remote;
            this._electronWindow = remote.getCurrentWindow()
        }
        return this._electronWindow
    }
    */
	
    // attributes
    
    width () {
        return window.innerWidth
    }

    height () {
        return window.innerHeight
    }
    
    aspectRatio () {
        return this.width() / this.height()
    }
    
    setWidth (w) {
        console.warn("warning: WebBrowserWindow.setWidth() unavailable in browser")
        return this
    }
    
    setHeight (h) {
        console.warn("warning: WebBrowserWindow.setHeight() unavailable in browser")
        return this
    }
    
    show () {
        console.log("Window size " + this.width() + "x" + this.height())
    }

    showAgent () {
        console.log("navigator.userAgent = ", navigator.userAgent);
        console.log("   agentIsSafari: ", this.agentIsSafari())
        console.log("   agentIsChrome: ", this.agentIsChrome())
        console.log("  agentIsFirefox: ", this.agentIsFirefox())
        console.log("      isOnMobile: ", this.isOnMobile())
        console.log("   isTouchDevice: ", this.isTouchDevice())
    }
    
    mobileNames () {
        return ["android", "webos", "iphone", "ipad", "ipod", "blackBerry", "windows phone"]  
    }

    agent () {
        return navigator.userAgent.toLowerCase()
    }

    vendor () {
        return navigator.vendor.toLowerCase()
    }

    agentIsFirefox () {
        const agent = navigator.userAgent;
        return agent.contains("Firefox")
    }

    agentIsSafari () {
        const vendor = navigator.vendor;
        const agent = navigator.userAgent;
        
        const isSafari = !Type.isNullOrUndefined(vendor) && 
                vendor.contains("Apple") &&
                !Type.isNullOrUndefined(agent) &&
                !agent.contains("CriOS") &&
                !agent.contains("FxiOS");
        return isSafari
    }

    agentIsChrome () {
        const isChrome = Boolean(window.chrome) //&& 
        //!navigator.userAgent.contains('Brave');
        //console.log("window.chrome = ", window.chrome);
        return isChrome
    }
    
    isOnMobile () { 
        const agent = this.agent();
        const match = this.mobileNames().detect((name) => { return agent.contains(name); })
        return match !== null
    }

    isTouchDevice () {
        //return TouchScreen.shared().isSupported()

        // via https://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript
        let result = false 
        if ("ontouchstart" in window) { result = true; }        // works on most browsers 
        if (navigator.maxTouchPoints) { result = true; }       // works on IE10/11 and Surface	
        //console.log("WebBrowserWindow.isTouchDevice() = ", result)
        return result
    }

    urlHash () {
        return decodeURI(window.location.hash.substr(1)) // return string after # character
    }
    
    setUrlHash (aString) {
        if (this.urlHash() !== aString) {
            window.location.hash = encodeURI(aString)
            //console.log("window.location.hash = [" + window.location.hash + "]")
        }
        return this
    }
    
    descriptionDict () {
        const dict = {
            agent: this.agent(),
            size: this.width() + "x" + this.height(),
            isOnMobile: this.isOnMobile()
        }
        return dict
    }

    urlHostname () {
        const parser = document.createElement("a")
        parser.href = window.location.href
        let name = parser.hostname
        if (!name) {
		    name = ""
        }
        return name
    }
	
    setTitle (aName) {
        document.title = aName
        return this
    }

    title () {
        return document.title
    }
    
    activeDomView () {
        const e = document.activeElement
        if (e && e._domView) {
            return e._domView
        }
        return null
    }

}.initThisClass())


