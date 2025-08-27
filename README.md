# 🤖 Cyber-Learn: Your AI-Powered Cybersecurity Tutor

> 🛡️ Learn, Simulate, and Assess Cybersecurity Skills using LLMs, RAG, and Guardrails AI

---

## 📚 Table of Contents
- [🚀 Introduction](#-introduction)
- [✨ Features & Objectives](#-features--objectives)
- [🔐 Security & Privacy](#-security--privacy)
- [⚙️ Architecture & Tech Stack](#-architecture--tech-stack)
- [🌱 Future Scope](#-future-scope)
- [👥 Team & Acknowledgements](#-team--acknowledgements)

---

## 🚀 Introduction

**Cyber-Learn** is an interactive cybersecurity tutor powered by **LLMs** (OpenAI), **LangChain**, and **Guardrails AI**, designed for the ISBM Cardiff Hackathon 🏆. The platform guides learners through:

- Secure coding practices (📜 OWASP / 🔒 NIST)
- Real-world cyber attack simulations (🚨 phishing, 🧬 SQLi, 🛑 XSS)
- Code vulnerability assessments and explanations
- Personalized learning plans and memory retention

---

## ✨ Features & Objectives

| Feature | Description |
|--------|-------------|
| 🧠 AI Code Assistant | Generates and evaluates secure code |
| 🕵️ Scenario Simulator | Walks users through cyber-attack scenarios |
| 📊 Assessment Engine | Benchmarks answers using OWASP Top 10 |
| 🔍 Explainability Module | Offers references to standards and reasoning |
| 🧹 Privacy Control | Type `CLEAR_HISTORY` or click a button to erase data |

---

## 🔐 Security & Privacy

### ✅ Input Validation
- `sanitize_prompt()` removes malicious patterns (prompt injections, XSS, etc.)

### 🧱 Prompt Protection
- Rejects prompts with harmful intent using regex + Guardrails schema pre-check

### 🗂️ Data Transparency
- Chat history is stored per user, editable by typing `CLEAR_HISTORY`

### 🧽 Chat Cleanup
```bash
CLEAR_HISTORY
```
…or use the 🔴 “Clear History” button with a confirmation prompt

---

## ⚙️ Architecture & Tech Stack

```
Frontend      🧩 React + Tailwind
Backend       🐍 FastAPI
LLM           🧠 OpenAI API (gpt-4.1-mini)
Embeddings    🧬 HuggingFace MiniLM
RAG           🧠 LangChain + Chroma Vector DB
Security      🛡️ Guardrails AI + Input Sanitizers
Database      💾 MongoDB Atlas
```

---

## 🌱 Future Scope

- ⚡ CVE + MITRE ATT&CK feed integration
- 🧪 Live lab scenarios (WebGoat, Juice Shop)
- 🧾 GDPR-style “My Data” dashboard
- 🔐 JWT Role-based Access Control

---

## 👥 Team & Acknowledgements

| Name | GitHub |
|------|--------|
| Faheemuddin Sayyed | [@Faheem219](https://github.com/Faheem219) |
| Sanidhya Awasthi   | [@Islinger19](https://github.com/Islinger19) |
| Raghav Sonchhatra  | [@Rsonchhatra18](https://github.com/Rsonchhatra18) |

### 🙌 Special Thanks
- 🛠️ [Guardrails AI](https://github.com/guardrails-ai/guardrails)
- 📚 [OWASP](https://owasp.org), [NIST](https://csrc.nist.gov)
- 🧪 [SEvenLLM Benchmark](https://github.com/CSJianYang/SEevenLLM)
