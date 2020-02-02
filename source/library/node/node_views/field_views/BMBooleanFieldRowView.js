"use strict"

/*

    BMBooleanFieldRowView

*/

window.BMBooleanFieldRowView = class BMBooleanFieldRowView extends BMFieldRowView {
    
    initPrototype () {

    }

    init () {
        super.init()
        
        this.turnOffUserSelect()
        this.keyView().setTransition("color 0.3s")

        this.keyView().setDisplay("inline-block")
        this.valueView().setDisplay("inline-block")
        this.keyView().setMarginLeft(6)

        //this.keyView().setMarginTop(-1)
        this.keyView().setPaddingBottomPx(1)
        //this.valueView().setMarginTop(15)

        this.contentView().debugBorders()
        //this.contentView().setFlexDirection("column")
        this.titlesSection().setFlexDirection("row").makeSubviewsReverseOrdered()
        //this.titlesSection().subviews().forEach(sv => sv.setAlignItems("center"))
        this.titlesSection().subviews().forEach(sv => sv.flexCenterContent())
        //this.keyView().parentView().swapSubviews(this.keyView(), this.valueView())
        return this
    }

    createValueView () {
        return BooleanView.clone()
    }
	
    booleanView () {
        return this.valueView()
    }

    syncFromNode () {
        super.syncFromNode()
        this.booleanView().updateAppearance()
        return this
    }
    
}.initThisClass()
