"use strict";

/**
 * @module library.resources.files.BMResourceFile
 */

/**
 * @class BMResourceFile
 * @extends BaseNode
 * @classdesc Represents a resource file with methods for loading and managing file data.
 */
(class BMResourceFile extends BaseNode {

    /**
     * @description Initializes the prototype slots for the BMResourceFile class.
     */
    initPrototypeSlots () {
        /**
         * @property {String} path - Path from _index.json entry
         */
        {
            const slot = this.newSlot("path", ".");
            slot.setSlotType("String");
        }

        /**
         * @property {String} resourceHash - Hash from _index.json entry
         */
        {
            const slot = this.newSlot("resourceHash", null);
            slot.setSlotType("String");
        }

        /**
         * @property {Number} resourceSize - Size from _index.json entry
         */
        {
            const slot = this.newSlot("resourceSize", null);
            slot.setSlotType("Number");
        }

        /**
         * @property {Object} data - Raw data of the resource
         */
        {
            const slot = this.newSlot("data", null);
            slot.setSlotType("Object");
        }

        /**
         * @property {Object} value - The value decoded from the data, e.g., value = JSON.parse(data)
         */
        {
            const slot = this.newSlot("value", null);
            slot.setSlotType("Object");
        }

        /**
         * @property {Error} error - Error object if any error occurs during processing
         */
        {
            const slot = this.newSlot("error", null);
            slot.setSlotType("Error");
        }

        /**
         * @property {Promise} promiseForLoad - Holds promise used for reading from URL request or indexedDB
         */
        {
            const slot = this.newSlot("promiseForLoad", null); 
            slot.setDescription("holds promise used for reading from URL request or indexedDB");
            slot.setSlotType("Promise");
        }

        /**
         * @property {Boolean} isLoading - Indicates if the resource is currently loading
         */
        {
            const slot = this.newSlot("isLoading", false);
            slot.setSlotType("Boolean");
        }

        /**
         * @property {Boolean} isLoaded - Indicates if the resource has been loaded
         */
        {
             const slot = this.newSlot("isLoaded", false);
             slot.setSlotType("Boolean");
        }

        /**
         * @property {String} loadState - Represents the current load state of the resource
         */
        {
            const slot = this.newSlot("loadState", null);
            slot.setSlotType("String");
        }
    }

    /**
     * @description Initializes the prototype properties.
     */
    initPrototype () {
        this.setTitle("File");
        this.setNoteIsSubnodeCount(true);
        this.setIsDebugging(true);
    }

    /**
     * @description Initializes the BMResourceFile instance.
     * @returns {BMResourceFile} The initialized instance.
     */
    init () {
        super.init();
        this.setPromiseForLoad(Promise.clone());
        return this;
    }

    /**
     * @description Gets the name of the resource file.
     * @returns {String} The file name.
     */
    name () {
        return this.path().lastPathComponent();
    }

    /**
     * @description Gets the title of the resource file.
     * @returns {String} The file name as the title.
     */
    title () {
        return this.name();
    }

    /**
     * @description Gets the file extension of the resource file.
     * @returns {String} The file extension.
     */
    pathExtension () {
        return this.path().pathExtension();
    }

    /**
     * @description Sets up subnodes for the resource file.
     * @returns {BMResourceFile} The current instance.
     */
    setupSubnodes () {
        return this;
    }

    /**
     * @description Checks if the resource file has data.
     * @returns {Boolean} True if data is present, false otherwise.
     */
    hasData () {
        return this.data() !== null;
    }

    /**
     * @description Gets the URL resource for the file.
     * @returns {UrlResource} The URL resource object.
     */
    urlResource () {
        return UrlResource.with(this.path());
    }

    /**
     * @description Loads the resource file asynchronously.
     * @returns {Promise<BMResourceFile>} A promise that resolves with the current instance after loading.
     */
    async promiseLoad () {
        const url = this.urlResource();
        url.setResourceHash(this.resourceHash());
        const r = await url.promiseLoad();
        this._data = r.data();
        this.promiseForLoad().callResolveFunc();
        this.setValue(await this.asyncValueFromData());
        return this;
    }

    /**
     * @description Gets a promise that resolves with the file data.
     * @returns {Promise<Object>} A promise that resolves with the file data.
     */
    async dataPromise () {
        if (!this.hasData()) {
            await this.promiseLoad();
        }
        return this.data();
    }

    /**
     * @description Gets the list of file extensions to precache.
     * @returns {String[]} An array of file extensions to precache.
     */
    precacheExtensions () {
        return ["json", "txt", "ttf", "woff", "woff2"];
    }

    /**
     * @description Precaches the resource file if appropriate based on its extension.
     * @returns {Promise<BMResourceFile>} A promise that resolves with the current instance after precaching.
     */
    async prechacheWhereAppropriate () {
        if (this.precacheExtensions().includes(this.pathExtension())) {
            await this.promiseLoad();
        }
        return this;
    }

    /**
     * @description Asynchronously gets the value from the file data.
     * @returns {Promise<*>} A promise that resolves with the parsed value from the file data.
     */
    async asyncValueFromData () {
        try {
            const ext = this.pathExtension();
            const data = this.data();
            if (ext === "json") {
                const jsonString = data.asString();
                return JSON.parse(jsonString);
            } else if (["js", "css", "txt"].includes(ext)) {
                const textString = data.asString();
                return textString;
            }
            return this.data();
        } catch (error) {
            console.error(this.type() + ".asyncValueFromData() error loading value from data for " + this.path() + " : " + error.message);
            debugger;
            throw error;
        }
    }

}.initThisClass());