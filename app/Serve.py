from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
import time
import asyncio
try:
    from .ChatBotLogic import ChatBot
except ImportError:
    print("Error: chatbot_logic.py not found or ChatBot class not defined correctly.")
    # Define a dummy ChatBot if import fails, so FastAPI can still start for basic checks
    class ChatBot:
        def __init__(self, *args, **kwargs):
            print("Dummy ChatBot initialized due to import error. LLM functionality will NOT work.")
            self.llm = None
        def generate_response(self, user_message: str, chat_history: Optional[List[Dict[str, str]]] = None) -> str:
            return "ChatBot not loaded. Please check server logs."


MAX_TOKENS = None
class Message(BaseModel):
    role: str = Field(..., example="user")
    content: str = Field(..., example="Hello!")

class ChatMessageInput(BaseModel):
    message: str 
    conversation_id: Optional[str] = None 
    history: Optional[List[Message]] = []

class ChatMessageOutput(BaseModel):
    response: str
    conversation_id: Optional[str] = None
    # metadata: Optional[dict] = None # For future use possibly
    
app = FastAPI(
    title='Sassy Personal Assistant',
    description='Api for interacting with this dumb bot',
    version='0.1.0',
)
try:
    print("Initializing ChatBot...")
    chatbot_instance = ChatBot(device_preference=None) # Will find correct backend
    print("ChatBot initialized successfully.")
except RuntimeError as e:
    print(f"FATAL: Couldnt Initialize ChatBot Class: {e}")
    chatbot_instance = ChatBot()
except Exception as e:
    print("Unexpected error occured during ChatBot initialization: {e}")
    chatbot_instance = ChatBot()
    
    
origins = [
    'http://localhost:5173',
    'https://localhost:5173',  # Keep both just in case
    'http://localhost:3000',   # Common React dev server port
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/v1/chat/", response_model=ChatMessageOutput)
async def chat_with_llm(chat_input: ChatMessageInput = Body(...)):
    """
    Receives a user message and chat history, gets a response from the LLM,
    and returns the LLM's response.
    """
    if not chatbot_instance or not chatbot_instance.llm:
        raise HTTPException(status_code=503, detail="LLM service not available. Check server logs.")

    print(f"Received chat input: message='{chat_input.message}', history_length={len(chat_input.history)}")

    # Convert Pydantic `Message` objects in history to simple dicts for the ChatBot
    history_for_chatbot: List[Dict[str, str]] = []
    if chat_input.history:
        for msg in chat_input.history:
            history_for_chatbot.append({"role": msg.role, "content": msg.content})

    try:
        # Generate Response
        llm_reply = chatbot_instance.generate_message(
            message=chat_input.message,
            chat_history=history_for_chatbot
        )

        return ChatMessageOutput(
            response=llm_reply,
            conversation_id=chat_input.conversation_id
        )

    except Exception as e:
        print(f"Error in /api/v1/chat/ endpoint during LLM call: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing message with LLM: {str(e)}")

@app.get("/")
async def root():
    status = "ChatBot is loaded and ready." if chatbot_instance and chatbot_instance.llm else "ChatBot is NOT loaded. Check logs."
    return {"message": "Welcome to the LLM Chatbot API!", "chatbot_status": status}
