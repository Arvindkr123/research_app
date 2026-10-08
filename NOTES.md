# Project Documentation: Company Research App

This document outlines the engineering decisions, architecture, and implementation details of the Company Research App. This project was designed to demonstrate a production-ready full-stack architecture, migrating from a local prototype to a cloud-scalable solution.

## 🚀 Project Overview
The Company Research App is a professional intelligence tool that performs deep-dive analysis on companies. It automates the process of gathering real-time web data and using Large Language Models (LLMs) to synthesize Value Propositions, Audience Analysis, Monetization Strategies, and Competitive Landscapes.

## 🏗️ Technical Architecture

### 1. Backend (Node.js & Express)
To move from a prototype to a production-ready system, I implemented a **Layered Architecture** (Controller-Service-Repository pattern). This ensures a clear separation of concerns:

- **Routes**: Define the API surface and handle request routing.
- **Controllers**: Handle HTTP request/response logic, input validation, and call the appropriate services.
- **Services**: Contain the core business logic. This is where the AI orchestration and data processing reside.
- **Models/Repositories**: Interface with the database (MongoDB) for persisting research results.
- **Middleware**: Centralized error handling to ensure the API always returns consistent, helpful error responses.

### 2. Frontend (Next.js & TypeScript)
The frontend is built with a modular, component-based architecture to ensure maintainability and a high-quality UX:

- **Custom Hooks (`useResearch`)**: Encapsulates all research logic, state management (loading, error, results), and API communication, keeping the UI components lean.
- **Modular Components**: Specialized components for results (`ResearchResultCard`), library management (`LibraryCard`), and layout (`Navbar`).
- **TypeScript**: Strict typing for `ResearchResult` and `ResearchType` to prevent runtime errors and improve developer experience.
- **UI/UX Design**: 
  - **Sticky Layout**: Implemented a professional workspace where the search area and navigation are fixed, while the results and library columns scroll independently.
  - **Responsive Design**: Fully optimized for mobile and desktop using Tailwind CSS.
  - **User Feedback**: Integrated `react-hot-toast` for real-time notifications on saving or deleting research.

## 🛠️ Engineering Decisions & Challenges

### 🧠 LLM Migration (Ollama $\rightarrow$ Groq)
**Challenge**: Initially used local Ollama models, but encountered severe system lag and timeouts due to hardware constraints (8GB RAM).
**Solution**: Migrated the AI engine to the **Groq Cloud API** using the `llama-3.1-8b-instant` model.
**Impact**: Reduced response latency from minutes to seconds and eliminated system crashes, ensuring a stable experience.

### 🌐 Real-time Data Retrieval
**Decision**: Integrated the **Tavily API** for specialized AI-web searching. Unlike standard search engines, Tavily returns cleaned, LLM-ready content, which significantly improved the accuracy of the company analysis.

### 🎨 UX Optimization
**Challenge**: The "Library" and "Results" sections caused the entire page to scroll, which felt like a basic website rather than a professional app.
**Solution**: Implemented a `h-screen overflow-hidden` wrapper with internal `overflow-y-auto` columns. This creates a "Dashboard" feel where the user can explore their library without losing sight of their current research.

## 🎯 Requirements Fulfilled
- [x] Deep analysis of Value Prop, Audience, and Monetization.
- [x] Competitor analysis and landscape mapping.
- [x] Production-grade backend architecture.
- [x] Modular, TypeScript-based frontend.
- [x] Cloud-based AI integration for performance.
- [x] Persistent storage for a Research Library.
- [x] Professional UI with sticky layouts and notifications.

## 🛠️ Tech Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, React Hot Toast.
- **Backend**: Node.js, Express, MongoDB.
- **AI/Data**: Groq Cloud API (Llama 3.1), Tavily API.
