# Sassy P.A. – A Personality-Driven Chatbot

A lightweight, locally-hosted chatbot fine-tuned to deliver responses in a **sassy, passive-aggressive, and humorous tone** using NLP techniques.

---

## Team Name: Girlies

**Members:**
- Claire Nguyen  
- Mel Harvey  
- Johnny Garnica  

---
## Project Structure
```
.
├── app
│   ├── ChatBotLogic.py
│   ├── finetune_gemma_1bgguf.ipynb
│   └── Serve.py
├── Architecture_Overview.png
├── architecture.PNG
├── architectureyah.PNG
├── demo
│   └── Sassy P.A. Demo.mp4
├── eval_dataset.json
├── forge.config.ts
├── forge.env.d.ts
├── index.html
├── my_dataset.json
├── package-lock.json
├── package.json
├── project-structure.md
├── pyproject.toml
├── README.md
├── setup.sh
├── src
│   ├── App.tsx
│   ├── assets
│   │   ├── base.css
│   │   ├── chiikawa
│   │   │   ├── IMG_1149.PNG
│   │   │   ├── IMG_1150.PNG
│   │   │   ├── IMG_1151.PNG
│   │   │   ├── IMG_1152.PNG
│   │   │   ├── IMG_1153.PNG
│   │   │   ├── IMG_1154.PNG
│   │   │   └── IMG_1155.PNG
│   │   ├── chiikawa.icns
│   │   ├── chiikawa.ico
│   │   ├── chiikawa.PNG
│   │   └── main.css
│   ├── components
│   │   ├── Avatar
│   │   │   └── Robot.tsx
│   │   ├── bar
│   │   │   ├── Conversation.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── chat
│   │   │   ├── Input.tsx
│   │   │   ├── Message.tsx
│   │   │   └── UserChat.tsx
│   │   └── types.ts
│   ├── db.ts
│   ├── index.css
│   ├── main.ts
│   ├── main.tsx
│   ├── preload.ts
│   ├── renderer.ts
│   └── utils.ts
├── tsconfig.json
├── uv.lock
├── vite.main.config.ts
├── vite.preload.config.ts
└── vite.renderer.config.ts
```
---
## Introduction

**Use Case**: A sarcastic, character driven chatbot that provides humorous, passive aggressive answers perfect for users looking for a laugh or a more entertaining assistant experience.  
**Purpose**: Break away from the traditional "helpful and polite" assistant model by crafting a chatbot with *attitude*.  
**Target Users**: Fans of Character.AI,  students, and users seeking entertainment.

---

## Problem Statement & Objective

To explore how a large language model can be fine-tuned to consistently adopt a **sassy tone**, while maintaining helpfulness and coherence. We aim to answer:  
> *How can a large language model be fine-tuned or prompted to consistently adopt a passive aggressive or “sassy” tone?*

---

## Model Selection & Justification

**Model Chosen**: Gemma 1B Instruct QAT

**Why Gemma 1B?**
- Lightweight and capable of running locally on consumer hardware (e.g., M1 Macs, 8GB VRAM PCs)  
- Pre-trained for instruction-following tasks  
- Supports Quantization-Aware Training (QAT)  
- Ideal for tone customization and privacy-preserving offline deployment

---

## Dataset & Fine-Tuning Strategy

**Dataset**: A synthetic dataset of ~500 sassy conversational prompts, titled *The Sass Maker*.

**Preprocessing Steps**:
- Structured using Gemma’s `<start_of_turn>` prompt format  
- Manually reviewed for safe, appropriate sass  
- Tokenized using Gemma’s built-in tokenizer

**Training Details**:
- Framework: [Unsloth](https://github.com/unslothai/unsloth)  
- Backend: `llama-cpp-python`  
- Epochs: 30  
- Learning Rate: 2e-4  
- Optimizer: AdamW (8-bit)  
- Training Strategy: Intentional overfitting for strong tone consistency

**Challenges**:
- Maintaining sass through multiple conversation turns  
- Avoiding repetition or overly offensive phrasing  
- Adapting tone based on sensitive or emotional user input

---

## System Architecture

![System Architecture](docs/architectureyah.png)

**Pipeline Overview**:
- Input: User query via desktop UI (Electron + React.js)  
- Inference: Local LLM execution via llama-cpp  
- Output: Sassy, sarcastic, or humorous response rendered in the app  

---

## Live Demo

Watch the demo: https://www.youtube.com/watch?v=ko5JTCghk8s

To run locally:
```bash
cd app
python app.py
