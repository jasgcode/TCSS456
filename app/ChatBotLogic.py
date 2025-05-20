import torch
from llama_cpp import Llama
from typing import Optional, Dict, List
from huggingface_hub import login

huggingface_token = "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"
login(token = huggingface_token)


class ChatBot:
    def __init__(self, llm_model:str = "gemma-3-1b-it-q4_0.gguf",
                 model_repo_id="google/gemma-3-1b-it-qat-q4_0-gguf", chat_format="gemma" , 
                 device_preference: Optional[str] = None):
        # switch = {
        #     "cuda": torch.cuda.is_available(),
        #     "mps": torch.backends.mps.is_available(),
        #     "cpu": True
        # }
        # if device is None:
        #     for key, value in switch.items():
        #         if value:
        #             self.device = key
        #             break

        self.device = self._get_device(device_preference)
        self.llm = None
        self.chat_format = chat_format
        n_gpu_layers = 0
        if self.device == 'cuda' or self.device == 'mps':
            n_gpu_layers = -1
            print(f'attempting to offload model to {self.device} with n_gpu_layers={n_gpu_layers}')

        else:
            print("Using cpu u noob")
        try:
            self.llm = Llama.from_pretrained(
                repo_id=model_repo_id,
                filename=llm_model,
                chat_format=self.chat_format,
                n_gpu_layers= n_gpu_layers
                
            )
            print(f"Model {llm_model} loaded sucessfully using chat format {chat_format}.")
        except Exception as e:
            print(f"Error loading LLM model from repo {model_repo_id}, filename {llm_model}: {e}")
            print("Please ensure the model repository and filename are correct and accessible.")
            print("You might need to download the model manually or check Hugging Face Hub for availability.")
            # You might want to raise the exception or handle it more gracefully
            # depending on whether the application can run without the LLM.
            raise RuntimeError(f"Failed to load LLM: {e}")
        
    def _get_device(self, device_preference: Optional[str]) -> str:
        if device_preference:
            if device_preference == "cuda" and torch.cuda.is_available():
                print("Cuda found")
                return "cuda"
            if device_preference == "mps" and torch.backends.mps.is_available():
                print("Mps (apple silicon) found, steve jobs is proud")
                return "mps"
            print("no gpu using cpu u noob")
            return 'cpu'
        if torch.cuda.is_available():
            print("CUDA is available.")
            return "cuda"
        if torch.backends.mps.is_available():
            # Ensure MPS is available (for Apple Silicon GPUs)
            print("MPS is available (Apple Silicon GPU).")
            return "mps"
        print("No GPU detected, using CPU.")
        return "cpu"
    
    def generate_message(self, message: str, chat_history: Optional[List[Dict[str, str]]] = None) -> str:
        if not self.llm:
            print("LLM not loaded. Cant generate respone")
            return "Model not found cant do stuff lol"
        
        messages =[]
        if chat_history:
            messages.extend(chat_history)

        messages.append({"role":"user", "content": message})
        
        try:
            response = self.llm.create_chat_completion(
                messages=messages,
                temperature = 0.8,
                max_tokens= 500
            )
            if response and response["choices"] and response["choices"][0]['message'] and response['choices'][0]['message']['content']:
                assistant_message = response['choices'][0]['message']['content']
                return assistant_message.strip()
            else:
                print("Invalid or empty response from LLM: ", response)
                return "Stop giving me dumb stuff dude"
        except Exception as e:
            print(f"Error during LLM inference: {e}")
            return " error while trying to generate a response to your dumb question."

if __name__ == "__main__":
    print("Testing ChatBot class...")
    try:
        # Try with CUDA, then MPS, then CPU if specific preference fails or is not given
        bot = ChatBot() # Or "mps" or "cpu" or None for auto
        print("\nChatBot initialized. Type 'quit' to exit.")
        history = []
        while True:
            user_input = input("You: ")
            if user_input.lower() == 'quit':
                break
            assistant_response = bot.generate_message(user_input, chat_history=history)
            print(f"Bot: {assistant_response}")
            history.append({"role": "user", "content": user_input})
            history.append({"role": "model", "content": assistant_response})
            # Keep history manageable
            if len(history) > 10: # Keep last 10 messages (5 turns)
                history = history[-10:]
    except RuntimeError as e:
        print(f"Could not start ChatBot: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")


    

        
