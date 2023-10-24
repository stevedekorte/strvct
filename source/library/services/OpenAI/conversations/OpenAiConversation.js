"use strict";

/* 
    OpenAiConversation

*/

(class OpenAiConversation extends Conversation {
  initPrototypeSlots() {

    {
      const slot = this.newSlot("tokenBuffer", 400); // Buffer to ensure approximation doesn't exceed limit
    }

    {
      const slot = this.newSlot("tokenCount", 0); // sum of tokens of all messages
    }

    {
      const slot = this.newSlot("maxTokenCount", 8000); // max allowed by model
    }

    {
      const slot = this.newSlot("initialMessagesCount", 3); // Number of initial messages to always keep
    }

    {
      const slot = this.newSlot("model", null); 
    }

  }

  init() {
    super.init();
    this.setSubnodeClasses([OpenAiMessage])
  }

  finalInit () {
    super.finalInit()
  }

  // -------- 

  service () {
    return this.conversations().service()
  }

  conversations () {
    return this.parentNode()
  }

  // -------- ///////////////////////

  updateTokenCount () {
    const count = this.subnodes().sum(message => message.tokenCount())
    this.setTokenCount(count)
    return this
  }

  trimConversation() {
    // todo - implement
    return this;
  }

  selectedModel () {
    return "gpt-4";
  }

  // --- overrides ---

  initNewMessage (aMessage) {
    aMessage.setRole("user")
    return aMessage
  }

  // -- managing tokens ---

  checkTokenCount () {
    this.updateTokenCount()
    const tc = this.tokenCount()
    console.log("token count: ", tc)
    if (tc > this.maxTokenCount() * 0.9) {
      this.compactTokens()
    }
  }

  compactTokens () {
    const m = this.messages().last()
    m.sendSummaryMessage()
  }

  // --- chat actions ---

  onChatInput (chatInputNode) {
    const v = chatInputNode.value()
    if (v) {
      const m = this.newMessage()
      m.setContent(v)
      m.sendInConversation()
      this.scheduleMethod("clearInput", 2) 
      this.footerNode().setValueIsEditable(false)
      return m
    }
    return null
  }

  clearInput () {
    this.footerNode().setValue("")
  }

}.initThisClass());
