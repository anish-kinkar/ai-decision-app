# AI Decision Simulator — What-if Engine

An AI-powered decision simulation platform for startup founders, product managers, and business teams. 
The app allows users to enter business decisions (e.g., "What happens if we increase pricing by 20%?") and the system simulates possible outcomes, risks, trade-offs, and recommends the best path forward.

## Features

- **Multi-Agent AI Workflow**: Uses 5 distinct logical "agents" (Business Context, Scenario Simulation, Risk Analyst, Recommendation, Executive Summary) to break down decisions instead of relying on a single prompt.
- **Numerical Simulation**: Calculates estimated impacts on MRR, churn, and conversion rates.
- **Premium SaaS UI**: Clean dark-mode interface built without external CSS frameworks, utilizing CSS Modules and modern aesthetic principles.
- **Interactive Dashboards**: Visualizes financial impacts using `recharts` and generates a structured Risk Matrix.
- **Local Persistence**: Saves your simulation history locally for quick retrieval.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Recharts, Lucide Icons, CSS Modules.
- **Backend**: Next.js API Routes (Node.js).
- **AI Orchestration**: Built to integrate with LLM APIs (OpenAI/Anthropic).

## Setup Instructions

1. **Prerequisites**: Ensure you have Node.js 18+ installed on your system.
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Environment Variables**:
   Copy the `.env.example` file to `.env` and configure your API key.
   *(Note: The app is designed to run in a mock mode if the API key is not provided, allowing you to test the UI and workflows immediately).*
   ```bash
   cp .env.example .env
   ```
4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
5. **Access the Application**:
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Architecture & Engineering Details

- **Modular Components**: Highly reusable UI components (`Card`, `Button`, `Input`, `Select`) strictly using CSS Modules for scoped styling.
- **Agent Orchestration (`/api/simulate`)**: Demonstrates a pattern for chaining LLM calls. The output of one agent serves as the context for the next, enforcing mathematical consistency and logical risk analysis.
- **Structured JSON Outputs**: The API enforces strict schema returns, which the frontend parses to render the interactive dashboard and Recharts data.

## License
MIT
