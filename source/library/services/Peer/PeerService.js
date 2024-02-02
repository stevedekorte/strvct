"use strict";

/* 
    PeerService

*/

(class PeerService extends BMSummaryNode {
  
  static initClass () {
    this.setIsSingleton(true)
    return this
  }

  initPrototypeSlots () {

    {
      const slot = this.newSlot("servers", null)
      slot.setFinalInitProto(RzSigServers)
      slot.setShouldStoreSlot(true);
      slot.setIsSubnode(true);
    }

    this.setShouldStore(true);
    this.setShouldStoreSubnodes(false);
  }

  init () {
    super.init();
  }

  finalInit () {
    super.finalInit()
    this.setTitle("WebRTC");
    this.setSubtitle("peer-to-peer networking");
  }

  defaultSignalServer () {
    return this.servers().subnodes().first();
  }

}.initThisClass());
