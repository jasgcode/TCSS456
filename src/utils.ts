import { db } from './db'

import type { IConversation, MessageProps } from './components/types';


export async function startNewConversation(
  initialMessages: MessageProps[],
  title = "New Conversation"
): Promise<number | undefined> {
  try {
    const newConversation: Omit<IConversation, 'id'> = { // id is auto-generated
      title: title,
      timestamp: Date.now(),
      messages: initialMessages
    };
    // Dexie's add() method will return the ID of the newly added item.
    const id = await db.conversations.add(newConversation as IConversation);
    console.log(`Conversation started with ID: ${id}`);
    return id;
  } catch (error) {
    console.error("Failed to start new conversation:", error);
    // Handle or rethrow error as appropriate for your app
    return undefined;
  }
}

// Retrieve singular conversation by ID
export async function getConversationById(id: number): Promise<IConversation | undefined> {
  try {
    const conversation = await db.conversations.get(id);
    if (conversation) {
      console.log("Retrieved conversation:", conversation);
      return conversation;
    } else {
      console.log("Conversation not found for ID:", id);
      return undefined;
    }
  } catch (error) {
    console.error(`Failed to retrieve conversation with ID ${id}:`, error);
    return undefined;
  }
}

// Retrieve all conversations in database, sorted by recency
export async function getAllConversations(): Promise<IConversation[]> {
  try {
    const allConversations = await db.conversations
      .orderBy('timestamp')
      .reverse() 
      .toArray();
    console.log("All conversations retrieved:", allConversations.length);
    return allConversations;
  } catch (error) {
    console.error("Failed to retrieve all conversations:", error);
    return []; // Return an empty array on error
  }
}

export async function addMessageFetchResponse(
  conversationId: number,
  userMessage: MessageProps
): Promise<boolean> {
  try {
    let success = await db.transaction('rw', db.conversations, async() => {
      const conversation = await db.conversations.get(conversationId);
      if (conversation){
        
        if (!conversation.messages) {
            conversation.messages = [];
        }
        conversation.messages.push(userMessage); // Changed from conversation.message
        conversation.timestamp = Date.now();
        await db.conversations.put(conversation);
        return true
        }
        return false
    });
    if (!success) {
      console.error(`Conversation ${conversationId} not found for adding user message.`);
      return false;
    }
    console.log(`User Message added to conversation ${conversationId} locally.`)
    const currentConversation = await getConversationById(conversationId);
    let historyForBackend: { role: string; content: string }[] = [];
    if (!currentConversation){
      console.error(`Conversation ${conversationId} not found after adding user message`);
      return false;
    }

    if (currentConversation && currentConversation.messages) {
        // Send all messages except the very last one if it's the one we just added.
        historyForBackend = currentConversation.messages
            .filter(msg => msg.role === 'user' || msg.role === 'model') // Filter for relevant roles
            .map(msg => ({ role: msg.role, content: msg.content }))
            .slice(0, -1); 
    }

    // Only sending the last message, can send more information later
    const payload = {
      message: userMessage.content,
      conversationId: conversationId,
      history: historyForBackend
    }
    const backendUrl='http://localhost:8000/api/v1/chat/';
    console.log("Sending to backend: ", payload)
    
    const response = await fetch(backendUrl,{
      method: 'POST',
      headers:{
        'Content-Type' : 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if(!response.ok){
      const errorData = await response.json().catch(() => ({detail: "Unknown Error From Backend"}));
      console.error(`Backend Error: ${response.status} ${response.statusText}`, errorData)
      // Error message to chat
      const errorMessage: MessageProps = {
        role: 'model',
        content: `Error: Could not get response from assistant. Status: ${response.status}`,
        timestamp: Date.now(),

      };
      await addModelMessageToConversation(conversationId, errorMessage);
      return false
    }
    const llmResponseData = await response.json();
    console.log("Received From backend:", llmResponseData);
    const llmMessage: MessageProps = {
      role: 'model', 
      content: llmResponseData.response, // Assuming backend returns { "response": "..." }
      timestamp: Date.now(),
    }
    success = await db.transaction('rw', db.conversations, async () =>{
      const conversation = await db.conversations.get(conversationId);
      if(conversation){
        // Ensure 'messages' is the correct property name as per IConversation
        if (!conversation.messages) { // Initialize if undefined
            conversation.messages = [];
        }
        conversation.messages.push(llmMessage); // Changed from conversation.message
        conversation.timestamp = Date.now();
        await db.conversations.put(conversation);
        return true;
      }
      return false;
    });

    if (success) {
      console.log(`LLM Reponse added to conversation ${conversationId} locally.`);
      return true;
    } else {
      console.error(`Conversation ${conversationId} not found for adding to LLM response.`);
      return false;
    }

  } catch (error) {
    console.error(`Failed to add message and get LLM resposne for conversation ${conversationId}:`, error);
    const errorMessage:MessageProps = {
      role: 'model',
      content: 'Error: An unexpected error occurred while communicating with the assistant.',
      timestamp: Date.now(),
    };
    await addModelMessageToConversation(conversationId, errorMessage);
    return false;
  }
}

export async function addModelMessageToConversation(
  conversationId:number,
  modelMessage: MessageProps
): Promise<boolean> {
  try{
    const updatedCount = await db.conversations
    .where({id:conversationId})
    .modify((conversation:IConversation) =>{
      conversation.messages.push(modelMessage);
    });
    if(updatedCount) {
      console.log(`System message added to conversation ${conversationId}`);
      return true;
    } else {
      console.error(`Conversation ${conversationId} not found for adding system message.`);
      return false;
    }
  } catch (error) {
    console.error(`Failed to add system message to conversation ${conversationId}:`, error);
    return false;
  }
}

export async function deleteConversation(id: number): Promise<boolean> {
  try {
    await db.conversations.delete(id);
    console.log(`Conversation with ID ${id} deleted successfully.`);
    return true;
  } catch (error) {
    console.error(`Failed to delete conversation with ID ${id}:`, error);
    return false;
  }
}