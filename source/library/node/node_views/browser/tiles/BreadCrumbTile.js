"use strict";

/*
    
    BreadCrumbTile
    
*/

(class BreadCrumbTile extends Tile {
    
    initPrototype () {
        this.newSlot("path", null)
        this.newSlot("separatorString", "/")
        this.newSlot("onStackViewPathChangeObs", null)
    }

    init () {
        super.init()
        this.setOnStackViewPathChangeObs(BMNotificationCenter.shared().newObservation().setName("onStackViewPathChange").setObserver(this))
        this.contentView().setPaddingLeft("1.5em") // TitledTile.titleLeftPadding()
        this.setWidth("100%")
        //this.updateSubviews()
        this.setIsSelectable(true)
        this.setIsRegisteredForDocumentResize(true)
        //this.setBorder("1px dashed rgba(255, 255, 0, .1)")
        return this
    }

    makeOrientationDown () { // this is a special case where the item is full width
        super.makeOrientationDown()
        this.setMinAndMaxWidth(null)
        this.setWidth("100%")
        return this
    }

    topStackView () {
        return this.parentView() ? this.parentView().stackView().topStackView() : null
    }

    targetStackView () {
        const nc = this.column().nextColumn()
        if (nc) {
            //debugger;
            const sv = nc.stackView()
            return sv
        }
        return null
    }

    watchTopStackView () {
        const obs = this.onStackViewPathChangeObs()
        if (!obs.isWatching()) {
            const target = this.topStackView()
            if (target) {
                obs.setTarget(target)
                obs.watch()
            } else {
                //debugger;
                obs.stopWatching()
            }
        }
    }
  
    pathNodes () {
        if (this.targetStackView()) {
            const nodes = this.targetStackView().selectedNodePathArray()
            return nodes
        }
        return []
    }

    syncPathToStack () {
        this.scheduleMethod("setupPathViews")
    }

    setHeight (v) {
        if (v === "100%") {
            debugger;
        }
        return super.setHeight(v)
    }

    // --- events ---

    didUpdateSlotParentView (oldValue, newValue) {  // hook this to do the initial setup
        super.didUpdateSlotParentView(oldValue, newValue)
        if (this.parentView()) {
            this.watchTopStackView()
            this.syncPathToStack()
        }
        return this
    }

    /*
    onTapComplete (aGesture) {
        console.log(this.type() + " onTapComplete")
        //debugger;
        return super.onTapComplete(aGesture)
    }
    */

    onStackViewPathChange (aNote) {
        //debugger;
        this.syncPathToStack()
    }

    onClickPathComponent (aPathComponentView) {
        const nodePathArray = aPathComponentView.info()
        if (nodePathArray.length === 0) {
            debugger;
        }
        console.log("select path: " + nodePathArray.map(n => n.title()).join("/"))
        this.stackView().selectNodePathArray(nodePathArray)
        this.setupPathViews() // needed or does the StackView send a note?
        return this
    }

    onDocumentResize (event) {
        this.updateCompaction()
        return this
    }

    onClickBackButton (backButton) {
        const crumb = this.lastHiddenCrumb()
        if (crumb) {
            crumb.sendActionToTarget()
        }
    }

    lastHiddenCrumb () {
        return this.subviews().reversed().detect(sv => sv._isCrumb && sv.isDisplayHidden())
    }
    
    // --- path component views --- 

    newUnpaddedButton () {
        const v = ButtonView.clone()
        v.setDisplay("inline-block")
        v.setHeightPercentage(100)
        v.setWidth("fit-content")
        v.setPaddingLeft("0em")
        v.setPaddingRight("0em")
        v.titleView().setPaddingLeft("0em")
        v.titleView().setPaddingRight("0em")
        //v.setBorder("1px dashed rgba(255, 255, 255, .1)")
        //v.debugTypeId = function () { return "crumbView" }
        return v

    }

    buttonForName (aName) {
        const v = this.newUnpaddedButton()
        v.setTitle(aName)
        v.setTarget(this)
        v.setAction("onClickPathComponent")
        v._isCrumb = true
        return v
    }

    newBackButton () {
        const v = this.newUnpaddedButton()
        //v.setTitle("&lt;")
        v.setTitle("&#8592;")
        v.titleView().setPaddingLeft("0em")
        v.titleView().setPaddingRight("0.5em")
        v.setTarget(this)
        v.setAction("onClickBackButton")
        return v
    }

    newSeparatorView () {
        const v = this.newUnpaddedButton()
        v.titleView().setPaddingLeft("0.5em")
        v.titleView().setPaddingRight("0.5em")
        v.setTitle(this.separatorString())
        return v
    }

    crumbViewForNode (node, i, pathNodes) {
        const name = node.title()
        const crumb = this.buttonForName(name)
        const crumbNodePath = this.pathNodes().slice(0, i+1) // not efficient to get pathNodes
        crumb.setInfo(crumbNodePath)
        return crumb
    }

    newPathComponentViews () {
        const pathNodes = this.pathNodes()
        const views = pathNodes.map((node, i, pathNodes) => this.crumbViewForNode(node, i, pathNodes))
        return views
    }

    setupPathViews () {
        const views = this.newPathComponentViews()
        const separatedViews = views.joinWithFunc((view, index) => this.newSeparatorView())
        separatedViews.unshift(this.newBackButton())
        this.contentView().removeAllSubviews()
        this.contentView().addSubviews(separatedViews)
        this.updateCompaction()
    }

    widthOfViews (views) {
        return views.sum(v => v.calcCssWidth())
    }

    // --- 

    sumOfPathWidths () {
        return this.subviews().sum(view => { 
            const w = view.display() === "none" ? 0 : view.calcCssWidth()
            if (Type.isNaN(w)) { debugger; }
            return w
        })
    }

    updateCompaction () {
        const padding = 20
        const maxWidth =  this.frameInDocument().width()
        //console.log("maxWidth: ", maxWidth)
        const views = this.contentView().subviews()
        views.forEach(view => view.unhideDisplay())

        let didHide = false // to track if we need back button
        for (let i = 1; i < views.length -1; i++) {
            const view = views[i]
            const sum = this.sumOfPathWidths() + padding
            //console.log("sum: ", this.sumOfPathWidths())
            const isSeparator = view.title() === "/"
            if (isSeparator && views[i-1].isDisplayHidden()) {
                view.hideDisplay()
            }
            if (sum > maxWidth) {
                view.hideDisplay()
                didHide = true
            } else {
                break;
            }
        }

        if (!didHide) {
            // if we hid anything, we need a back button
            const backButton = views.first()
            backButton.hideDisplay()
        }
    }

    // ---

    desiredWidth () {
        return Number.MAX_VALUE
    }

}.initThisClass());