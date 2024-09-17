"use strict";

/**
 * Extends Object with UUID (Universally Unique Identifier) functionality.
 * @module ideal.object
 * @class Object_puuid
 * @extends Object
 */
(class Object_puuid extends Object {

    /**
     * Generates a new UUID.
     * @returns {string} A new UUID.
     */
    static newUuid () {
        const length = 10
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        const randomValues = new Uint8Array(length);
        window.crypto.getRandomValues(randomValues);
        const result = new Array(length);
    
        for (let i = 0; i < length; i++) {
            result[i] = characters[randomValues[i] % charactersLength];
        }
    
        return result.join('');
    }

    /**
     * Gets the PUUID (Persistent Universally Unique Identifier) of the object.
     * If the object doesn't have a PUUID, it generates a new one.
     * @returns {string} The PUUID of the object.
     */
    puuid () {
        if (!this.hasPuuid()) {
            this.setPuuid(Object.newUuid())
        }

        return this["_puuid"]
    }

    /**
     * Checks if the object has a PUUID.
     * @returns {boolean} True if the object has a PUUID, false otherwise.
     */
    hasPuuid () {
        return Object.prototype.hasOwnProperty.call(this, "_puuid");
    }

    /**
     * Sets the PUUID of the object.
     * @param {string} puuid - The PUUID to set.
     * @throws {Error} If the provided PUUID is null or undefined.
     * @returns {Object_puuid} This object.
     */
    setPuuid (puuid) {
        assert(!Type.isNullOrUndefined(puuid));
        if (this.hasPuuid()) {
            const oldPid = this["_puuid"];
            this.defaultStore().onObjectUpdatePid(this, oldPid, puuid);
        }
        Object.defineSlot(this, "_puuid", puuid); // so _puuid isn't enumerable
        return this;
    }

    /**
     * Gets the type-specific PUUID of the object.
     * @returns {string} The type-specific PUUID.
     */
    typePuuid () {
        const puuid = this.puuid()
        if (Type.isFunction(this.type)) {
            return this.type() + "_" + puuid
        }
        return Type.typeName(this) + "_" + puuid
    }

    /**
     * Gets the type ID of the object.
     * @returns {string} The type ID.
     */
    typeId () {
        return this.typePuuid()
    }

    /**
     * Gets a debug-friendly type ID of the object.
     * @returns {string} A debug-friendly type ID.
     */
    debugTypeId () {
        const puuid = this.puuid().substr(0,3)

        if (Type.isFunction(this.type)) {
            return this.type() + "_" + puuid
        }
        return Type.typeName(this) + "_" + puuid
    }

    /**
     * Gets the spacer used in debug type IDs.
     * @returns {string} The debug type ID spacer.
     */
    debugTypeIdSpacer () {
        return " -> "
    }

}).initThisCategory();
