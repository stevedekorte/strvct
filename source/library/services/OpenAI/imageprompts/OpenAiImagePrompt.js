"use strict";

/* 
    OpenAiImagePrompt

*/

(class OpenAiImagePrompt extends BMSummaryNode {
  initPrototypeSlots() {

    {
      const slot = this.newSlot("prompt", "");
      slot.setInspectorPath("")
      //slot.setLabel("prompt")
      slot.setShouldStoreSlot(true)
      slot.setSyncsToView(true)
      slot.setDuplicateOp("duplicate")
      slot.setSlotType("String")
      slot.setIsSubnodeField(true)
    }

    {
      const slot = this.newSlot("model", "dall-e-3");
      slot.setInspectorPath("")
      //slot.setLabel("prompt")
      slot.setShouldStoreSlot(true)
      slot.setSyncsToView(true)
      slot.setDuplicateOp("duplicate")
      slot.setSlotType("String")
      slot.setValidValues(["dall-e-3", "dall-e-2"])
      slot.setIsSubnodeField(true)
    }

    {
      const slot = this.newSlot("quality", "standard");
      slot.setInspectorPath("")
      slot.setShouldStoreSlot(true)
      slot.setSyncsToView(true)
      slot.setDuplicateOp("duplicate")
      slot.setSlotType("String")
      slot.setValidValues(["standard", "hd"])
      slot.setIsSubnodeField(true)
    }

    {
      const slot = this.newSlot("imageCount", 1);
      slot.setInspectorPath("")
      slot.setLabel("image count")
      slot.setShouldStoreSlot(true)
      slot.setSyncsToView(true)
      slot.setDuplicateOp("duplicate")
      slot.setSlotType("Number")
      slot.setValidValues([1]) // dall-e-3 only supports 1
      //slot.setIsSubnodeField(true)
    }

    {
      const slot = this.newSlot("imageSize", "1024x1024");
      slot.setInspectorPath("")
      slot.setLabel("image size")
      slot.setShouldStoreSlot(true)
      slot.setSyncsToView(true)
      slot.setDuplicateOp("duplicate")
      slot.setSlotType("String")
      slot.setValidValues(["1024x1024", "1792x1024", "1024x1792"])
      slot.setIsSubnodeField(true)
    }

    {
      const slot = this.newSlot("generateAction", null);
      slot.setInspectorPath("");
      slot.setLabel("Generate");
      //slot.setShouldStoreSlot(true)
      slot.setSyncsToView(true);
      slot.setDuplicateOp("duplicate");
      slot.setSlotType("Action");
      slot.setIsSubnodeField(true);
      slot.setActionMethodName("generate");
    }

    {
      const slot = this.newSlot("error", ""); // null or String
      slot.setInspectorPath("")
      slot.setShouldStoreSlot(false)
      slot.setSyncsToView(true)
      slot.setDuplicateOp("duplicate")
      slot.setSlotType("String")
      //slot.setIsSubnodeField(true)
      slot.setCanEditInspection(false);
    }


    {
      const slot = this.newSlot("images", null)
      slot.setFinalInitProto(OpenAiImages)
      slot.setShouldStoreSlot(true);
      slot.setIsSubnode(true);
    }


    {
      const slot = this.newSlot("status", ""); // String
      slot.setInspectorPath("")
      slot.setShouldStoreSlot(true)
      slot.setSyncsToView(true)
      slot.setDuplicateOp("duplicate")
      slot.setSlotType("String")
      slot.setIsSubnodeField(true)
      slot.setCanEditInspection(false);
    }

  }

  init() {
    super.init();
    this.setShouldStore(true);
    this.setShouldStoreSubnodes(false);
    this.setSubnodeClasses([])
    this.setCanAdd(false)
    this.setCanDelete(true)
    this.setNodeCanReorderSubnodes(false)
  }

  title () {
    const p = this.prompt()
    return p ? p : "Image Prompt";
  }

  subtitle () {
    return this.status()
  }

  finalInit() {
    super.finalInit()
    this.setCanDelete(true)
  }

  imagePrompts () {
    return this.parentNode()
  }

  service () {
    //return this.imagePrompts().service()
    return HavewordsApp.shared().services().openAiService()
  }

  // --- generate action ---

  canGenerate () {
    return this.prompt().length;
  }

  generate () {
    this.start()
  }

  generateActionInfo () {
    return {
        isEnabled: this.canGenerate(),
        //title: this.title(),
        isVisible: true
    }
  }

  // --- fetch ---

  start () {
    this.setError("")
    this.setStatus("fetching response...")

    const apiKey = this.imagePrompts().service().apiKey(); // Replace with your actual API key
    const endpoint = 'https://api.openai.com/v1/images/generations'; // DALL·E 2 API endpoint
    
    const bodyJson = {
        model: this.model(), // not sure this is valid, but it's used in the python API
        quality: this.quality(), // not sure this is valid, but it's used in the python API
        prompt: this.prompt(),
        n: this.imageCount(), 
        size: this.imageSize()
    };
    
    fetch(endpoint, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ` + apiKey,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyJson)
    })
    .then(response => {
      return response.json()
    })
    .then(resultData => {
        this.onSuccess(resultData);
    })
    .catch((error) => {
        this.onError(error);
    });
  }

  onSuccess (json) {
    /*
      json format:

      {
        created: date,
        data: [
          {
            revised_prompt: "...",
            url: "...",
        ]

    */

    if (json.error) {
      this.setStatus("ERROR: " + json.error.message)
      return
    }
    
    //this.setStatus("loading images...")
    this.setStatus("complete")

    json.data.forEach(imageDict => {
      const image = this.images().add();
      //imageResult.setCreated(json.created);
      image.setTitle("image " + this.images().subnodeCount());
      image.setRevisedPrompt(imageDict.revised_prompt);
      image.setUrl(imageDict.url);
      image.fetch();
    })

    console.log('Success:', json.data);
  }

  onError (error) {
    const s = "ERROR: " + error.message;
    console.error(s);
    this.setError(error.message);
    this.setStatus(s)
  }

}.initThisClass());
