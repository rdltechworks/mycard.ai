# Scriptorium

![Scriptorium Logo Placeholder](public/assets/scriptorium_logo.png)

## Project Overview

**Scriptorium** is a cutting-edge application developed by RDL Techworks, designed to transform personal digital memories (files, photos, documents) into beautifully crafted, AI-generated digital books. Our core business model focuses on providing a unique service that allows users to immortalize their experiences in a narrative format, with an integrated option for high-quality physical printing.

This project represents a significant opportunity for RDL Techworks to enter the personalized content creation market, leveraging advanced AI and a robust, scalable cloud infrastructure.

## Business Value Proposition

*   **Monetization:** Each generated book is offered at a competitive price point (e.g., $1.00 CAD for a digital copy), ensuring high-volume sales potential and strong profit margins due to the highly efficient, automated generation process.
*   **Scalability:** Built on Cloudflare's global network, Scriptorium can effortlessly scale to meet fluctuating user demand, ensuring consistent performance and availability.
*   **Reliability:** The serverless architecture with Durable Objects and Queues guarantees job persistence and fault tolerance, minimizing data loss and ensuring successful book delivery.
*   **Privacy-Centric:** A core design principle is the secure and ephemeral handling of user data, building trust and ensuring compliance with privacy standards.
*   **Innovation:** Leverages state-of-the-art AI (Cloudflare Workers AI) for content generation, positioning RDL Techworks at the forefront of personalized digital product offerings.

## Technical Architecture

Scriptorium employs a fully serverless, cloud-native architecture, primarily utilizing the Cloudflare ecosystem for maximum efficiency, scalability, and cost-effectiveness.

*   **Frontend (React.js):**
    *   A modern Single-Page Application (SPA) built with React.js and bundled using `esbuild` for optimal performance.
    *   Provides an intuitive user interface for file uploads, context input (timeline, prompt), and real-time job status tracking.
    *   **Deployment:** Hosted as static assets on **Cloudflare Pages**, benefiting from global CDN delivery and automatic CI/CD.

*   **Cloudflare Worker (Main API Gateway & Orchestrator - `mybookai`):**
    *   Serves as the primary API endpoint for the frontend.
    *   Handles initial user requests, including file uploads (streaming directly to R2).
    *   Orchestrates the book generation workflow by interacting with Durable Objects and dispatching tasks to Queues.
    *   Manages job status queries and serves the final generated book content.

*   **Cloudflare Durable Object (Job State Manager - `BookJobManager`):**
    *   A dedicated Durable Object instance is created for each book generation job.
    *   Persistently stores and manages the job's state (e.g., `PENDING`, `PROCESSING`, `COMPLETED`, `FAILED`), references to input/output files in R2, and progress updates.
    *   Ensures strong consistency and coordination across distributed Workers.

*   **Cloudflare Worker (AI Processing & Data Extraction - `mybookai-ai-processor`):**
    *   A specialized Worker designed for computationally intensive tasks.
    *   **Triggered by:** Consumes messages from **Cloudflare Queues**.
    *   **Data Handling:** Reads raw input files from **Cloudflare R2**, performs text extraction (OCR for images, text parsing for PDFs/documents).
    *   **AI Inference:** Calls **Cloudflare Workers AI** to execute large language models (LLMs) for generating the book content based on processed data and user prompts.
    *   **Result Storage:** Stores the final generated book content in **Cloudflare R2**.
    *   **Status Update:** Communicates job progress and completion status back to the relevant Durable Object.

*   **Cloudflare R2 (Object Storage):**
    *   **`mybook-input-files`:** Temporary storage for user-uploaded raw files, with immediate deletion post-processing.
    *   **`mybook-output-books`:** Storage for the final generated book content, subject to a time-limited retention policy to ensure user privacy and efficient storage management.
    *   Offers highly scalable, durable, and cost-effective object storage.

*   **Cloudflare Workers AI (LLM Inference):**
    *   Provides access to a wide range of pre-trained large language models (e.g., Llama 2) for text generation, running on Cloudflare's global GPU network.
    *   Enables high-quality, low-latency AI inference without managing complex GPU infrastructure.

*   **Cloudflare Queues (Job Dispatch & Reliability):**
    *   Used for asynchronous communication between the main Worker and the AI Processing Worker.
    *   Ensures reliable job delivery, decoupling services, and providing automatic retries for transient failures.

## Privacy and Data Handling

**User data privacy is a paramount concern for Scriptorium and RDL Techworks.** Our design adheres to strict privacy-by-design principles:

*   **Ephemeral Input Data:** All user-uploaded files and intermediate processed data are **immediately and securely deleted** from **Cloudflare R2** once their content has been extracted and used for AI generation. No original input files are stored persistently.
*   **Time-Limited Output Storage:** The final generated "book" content is stored temporarily in **Cloudflare R2**. This storage is strictly time-limited (e.g., 24 hours or upon user download), ensuring that user-generated content is not retained indefinitely.
*   **No Data Retention:** Scriptorium does not retain any user-identifiable input data or generated content beyond the necessary processing and delivery window.

## Setup and Development

### Prerequisites

*   Node.js (LTS recommended)
*   `npm` or `yarn` (Node.js package manager)
*   A Cloudflare account with Workers, Pages, Durable Objects, R2, Workers AI, and Queues enabled.

### Local Development

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/scriptorium.git # Update with actual repo URL
    cd scriptorium
    ```

2.  **Frontend Setup:**
    ```bash
    npm install
    npm run dev # Starts the frontend development server with watch mode
    ```
    The frontend will be built into the `dist/` directory.

3.  **Cloudflare Configuration (`wrangler.toml`):**
    Ensure your `wrangler.toml` is correctly configured with the necessary bindings for R2 buckets, Durable Objects, and Queues. You will need to create these resources in your Cloudflare dashboard:
    *   R2 Buckets: `mybook-input-files`, `mybook-output-books`
    *   Durable Object Namespace: `MYBOOK_JOB_MANAGER` (will be created on first deploy if not exists)
    *   Queue: `mybook-job-queue`

4.  **Running Workers Locally:**
    Use `npx wrangler dev` to run your Cloudflare Workers locally. This command can simulate the Cloudflare environment and interact with your remote Cloudflare resources (R2, DO, Queues, AI).

### Deployment

1.  **Build Frontend for Production:**
    ```bash
    npm run build
    ```
    This will create optimized production assets in the `dist/` directory.

2.  **Deploy to Cloudflare:**
    ```bash
    npm run deploy
    ```
    This command uses `wrangler` to deploy your Cloudflare Workers and the static assets from `dist/` to Cloudflare Pages.

## Future Enhancements

*   Implementing a robust user authentication and payment system.
*   Exploring more advanced AI models and techniques (e.g., RAG) for improved generation quality and nuanced "tone" integration.
*   Developing a more sophisticated frontend for job tracking and user interaction.
*   Integration with Cloudflare Images for advanced image processing and OCR capabilities.