# OmniRoute AI Gateway - Proof of Concept (POC)

**Disclaimer:** This is a **Proof of Concept (POC)** and is **NOT** the official OmniRoute repository or product. For the official project, please visit [omniroute.online](https://omniroute.online). This project was created for educational and demonstration purposes to explore AI gateway routing concepts. It does not contain any proprietary code or confidential assets.

---

## 🚀 Overview

This repository contains an interactive React-based Proof of Concept for an AI Gateway and Router. It simulates how an intelligent routing layer handles API requests across hundreds of different AI providers, managing fallbacks, optimizing costs, and providing a unified endpoint for various models (OpenAI, Anthropic, Gemini, DeepSeek, etc.).

## ✨ Key Features (Demonstrated in POC)

- **One Endpoint:** Simulates routing requests to multiple providers through a single proxy interface.
- **Auto-Fallback:** Visualizes how failing requests (e.g., rate limits, downtime) automatically cascade to backup providers with zero downtime.
- **Token Compression:** Simulates RTK + Caveman stacked compression techniques to save on API costs.
- **Free-Tier Routing:** Demonstrates prioritizing free-tier APIs before falling back to paid subscriptions.
- **MCP Compatibility:** Showcases how it could integrate with Model Context Protocol (MCP) tools.

## 🌟 Exclusive Custom Features

This POC includes 4 custom-built, interactive features that expand upon the core concepts:

1. 💰 **Interactive Cost Calculator:** Model your exact usage with draggable sliders to see real-time cost comparisons between direct API usage and optimized routing.
2. ⚔️ **Model Arena (Side-by-Side):** Send identical prompts to two different simulated models simultaneously. Compare latency, token counts, responses, and vote on the winner.
3. 🔀 **Live Routing Visualizer:** Watch the routing engine in action through an animated simulation. Choose different strategies (Priority, Cost Optimized, Lowest Latency, Round Robin, Free-First Drain) and watch requests cascade through healthy/rate-limited/circuit-open providers.
4. 🔍 **API Request Inspector:** A DevTools-style network inspector that records simulated incoming traffic. Filter requests, inspect headers, request payloads, response bodies, and token compression metadata.

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/SudiptaSanki/omniroute-poc.git
   cd omniroute-poc
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server (runs both the client and the mock proxy server concurrently):
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

## 🎨 Tech Stack

- **Frontend:** React, Vite, Tailwind CSS (with Glassmorphic design and Dark Mode support)
- **Icons:** Lucide React
- **Backend (Mock Proxy):** Node.js, Express (Simulated API endpoints)

## 📄 License

This project is open-source and available under the MIT License.

<!-- autobot:start -->
<!-- s:6c6695af t:2026-09-10T14:26:56.756Z a:schema migration b:5847 -->
<!-- autobot:end -->
