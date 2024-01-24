"use strict";

/* 
    HomeAssistantState

    {
      "entity_id": "media_player.homepod_tv_left",
      "state": "standby",
      "attributes": {
        "volume_level": 0.35,
        "media_content_id": "a626811e-62c9-4ca9-8bcc-8f2676b21890",
        "media_content_type": "video",
        "media_duration": 1530,
        "media_position": 1407,
        "media_title": "The Bear | S1 E5 - Sheridan",
        "app_id": "com.apple.tvairplayd",
        "app_name": "Hulu",
        "entity_picture": "/api/media_player_proxy/media_player.homepod_tv_left?token=139d6797cc4da521aa19c39e2fab71091823014b8016e6bb77632b120ec773fb&cache=6A00EEDC-8E75-4454-90B2-3A0F3DBDE0B1",
        "friendly_name": "HomePod TV Left",
        "supported_features": 448439
      },
      "last_changed": "2024-01-20T06:02:33.356314+00:00",
      "last_updated": "2024-01-23T07:12:10.065147+00:00",
      "context": {
        "id": "01HMTJK1AHNKQ25DKQKWZ056Z2",
        "parent_id": null,
        "user_id": null
      }
    }

*/

(class HomeAssistantState extends HomeAssistantObject {

  initPrototypeSlots() {

    {
      const slot = this.newSlot("entity", null);
    }

    /*
    {
      const slot = this.newSlot("scanAction", null);
      //slot.setInspectorPath("Character");
      slot.setLabel("Scan");
      slot.setSyncsToView(true);
      slot.setDuplicateOp("duplicate");
      slot.setSlotType("Action");
      slot.setIsSubnodeField(true);
      slot.setCanInspect(true)
      slot.setActionMethodName("scan");
    }
    */

    this.setShouldStore(true);
    this.setShouldStoreSubnodes(false);
  }

  init() {
    super.init();
  }

  /*
  subtitle () {
    return "Entity";
  }
  */
  
  finalInit () {
    super.finalInit();
  }

/*
  scanActionInfo () {
    return {
        isEnabled: this.hasValidUrl(),
        //title: this.title(),
        subtitle: this.hasValidUrl() ? null : "Invalid Host URL",
        isVisible: true
    }
  }
  */

  subtitle () {
    return "state";
  }

  id () {
    return this.haJson().context.id; // is this correct?
  }

  entityId () {
    return this.haJson().entity_id;
  }

  findEntity () {
    const entity = this.homeAssistant().entityWithId(this.entityId());
    return entity;
  }

  completeSetup () {
    const json = this.haJson();
    const name = json.attributes.friendly_name;
    this.setTitle(name);
    this.setSubtitle(json.entity_id);
    
    this.setEntity(this.findEntity());
    return this;
  }

}).initThisClass();
