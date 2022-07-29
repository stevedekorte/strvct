"use strict";

/*

    AtomicMap
 
*/

getGlobalThis().ideal.AtomicMap = class AtomicMap extends ProtoClass {

    initPrototype () {
        this.newSlot("isInTx", false) // private method - Bool, true during a tx
        this.newSlot("map", null) // private method - Map, contains current state of map
        this.newSlot("snapshot", null) // private method - Map, contains shallow copy of map during tx, so we can revert to this if tx is cancelled
        this.newSlot("isOpen", true) // private method
        this.newSlot("changedKeys", null) // private method
        this.newSlot("keysAndValuesAreStrings", true) // private method - Bool, if true, runs assertString on all input keys and values
    }

    init () {
        super.init()
        this.setMap(new Map())
        this.setSnapshot(null)
        this.setChangedKeys(null)
        //this.setSnapshot(new Map())
    }

    open () {
        this.setIsOpen(true)
        return this
    }

    assertAccessible () {
        this.assertOpen()
    }

    assertOpen () {
        assert(this.isOpen())
    }

    asyncOpen (callback) {
        this.open()
        callback()
    }

    close () {
        this.setIsOpen(false)
        return this
    }

    begin () {
        this.debugLog(() => this.type() + " begin ---")
        this.assertAccessible()
        this.assertNotInTx()
        this.setSnapshot(this.map().shallowCopy()) 
        this.setChangedKeys(new Set())
        this.setIsInTx(true)
        return this
    }

    revert () {
        this.debugLog(() => this.type() + " revert ---")
        this.assertInTx()
        this.setSnapshot(null)
        this.setChangedKeys(new Set())
        this.setIsInTx(false)
        return this
    }

    commit () {
        this.debugLog(() => this.type() + " prepare commit ---")
        this.assertInTx()
        if (this.hasChanges()) {
            this.applyChanges()
        }
        this.setChangedKeys(new Set())
        this.setIsInTx(false)
        return this
    }

    // --- changes ---

    hasChanges () {
        return this.map().isEqual(this.snapshot())
        //return this.changes() && this.changes().size > 0
    }

    applyChanges () { // private - apply changes to snapshot
        this.setMap(this.snapshot())
        this.setSnapshot(null)
        return this
    }

    // need to make sure writes happen within a transaction

    assertInTx () { // private
	    assert(this.isInTx())
    }

    assertNotInTx () { // private
	    assert(!this.isInTx())
    }

    // reads

 
    // --- keys ---

    keysArray () {
        return this.map().keysArray()
    }

    keysSet () {
        return this.map().keysSet()
    }

    // --- values ---

    valuesArray () {
        return this.map().valuesArray()
    }

    valuesSet () {
        return this.map().valuesSet()
    }

    // ---

    has (k) {
        return this.map().has()
    }

    hasKey (k) {
        return this.map().hasKey(k)
    }

    at (k) {
        return this.map().at(k)
    }

    // writes

    set (k, v) {
        return this.atPut(k, v)
    }

    atPut (k, v) {
        if (this.keysAndValuesAreStrings()) {
            assert(Type.isString(k))
            assert(Type.isString(v))
        }

        this.assertAccessible()
        this.assertInTx()
        this.changedKeys().add(k)
        this.map().set(k, v)
        return this
    }

    removeKey (k) {
        this.changedKeys().add(k)
        if (this.keysAndValuesAreStrings()) {
            assert(Type.isString(k))
        }

        this.assertAccessible()
        this.assertInTx()
        this.map().delete(k) 
        return this
    }

    // --- enumeration ---

    forEachKV (fn) {
        this.assertNotInTx() 
        this.assertAccessible()
        this.map().forEach((v, k, self) => fn(k, v, self))
    }

    forEachK (fn) {
        this.assertNotInTx() 
        this.assertAccessible()
        this.map().forEach((v, k) => fn(k))
    }

    forEachV (fn) {
        this.assertNotInTx() 
        this.assertAccessible()
        this.map().forEach(v => fn(v))
    }

    // read extras 

    keysArray () {
        return this.map().keysArray();
    }
	
    valuesArray () {
        return this.map().valuesArray();
    }

    count () { 
        return this.map().size;
    }	

    totalBytes () {
        this.assertNotInTx()
        this.assertAccessible()
        assert(this.keysAndValuesAreStrings())
        let byteCount = 0
        this.map().ownForEachKV((k, v) => {
            byteCount += k.length + v.length
        })
        return byteCount
    }

    // test

    static selfTest () {
        const m = this.clone()

        m.begin()
        m.atPut("foo", "bar")
        m.commit()

        assert(m.count() === 1)
        assert(m.Array()[0] === "foo")

        m.begin()
        m.removeAt("foo")
        m.commit()

        assert(m.count() === 0)

        return this
    }
}.initThisClass(); //.selfTest()
