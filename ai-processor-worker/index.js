// ai-processor-worker/index.js

// Placeholder for text extraction functions
async function extractTextFromImage(fileBuffer) {
  // In a real application, you would use a WASM-based OCR library
  // or call an external OCR service (e.g., Cloudflare Images with OCR capabilities)
  console.log("Extracting text from image (placeholder)");
  return "Extracted text from image: This is a placeholder for image content.";
}

async function extractTextFromPdf(fileBuffer) {
  // In a real application, you would use a WASM-based PDF parsing library
  // or call an external PDF parsing service.
  console.log("Extracting text from PDF (placeholder)");
  return "Extracted text from PDF: This is a placeholder for PDF content.";
}

export default {
  async queue(batch, env) {
    for (let message of batch.messages) {
      const { jobId, fileKeys, timeline, prompt } = message.body;

      const jobStub = env.MYBOOK_JOB_MANAGER.get(jobId);

      try {
        // Update job status: PROCESSING
        await jobStub.fetch(jobStub.url.origin + "/update-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "PROCESSING", progress: 30 }),
        });

        let allExtractedText = "";
        for (const fileKey of fileKeys) {
          const object = await env.MYBOOK_INPUT_BUCKET.get(fileKey);
          if (!object) {
            console.error(`File not found in R2: ${fileKey}`);
            continue;
          }

          const fileBuffer = await object.arrayBuffer();
          const contentType = object.httpMetadata?.contentType || "application/octet-stream";

          let extractedText = "";
          if (contentType.startsWith("image/")) {
            extractedText = await extractTextFromImage(fileBuffer);
          } else if (contentType === "application/pdf") {
            extractedText = await extractTextFromPdf(fileBuffer);
          } else if (contentType.startsWith("text/") || contentType === "application/json") {
            extractedText = new TextDecoder().decode(fileBuffer);
          } else {
            console.warn(`Unsupported file type for text extraction: ${contentType}`);
            extractedText = `[Content from unsupported file type: ${object.key}]`;
          }
          allExtractedText += `\n\n--- Content from ${object.key} ---\n${extractedText}`;

          // Securely delete input file immediately after processing
          await env.MYBOOK_INPUT_BUCKET.delete(fileKey);
          console.log(`Deleted input file: ${fileKey}`);
        }

        // Prepare prompt for Workers AI
        const fullPrompt = `Based on the following timeline and content, generate a compelling book chapter or story. Focus on incorporating details from the content and adhering to the timeline. \n\nTimeline: ${timeline}\n\nContent: ${allExtractedText}\n\nUser Prompt: ${prompt}\n\nGenerated Book:`;

        // Call Workers AI for text generation
        const aiResponse = await env.AI.run(
          "@cf/meta/llama-2-7b-chat-int8", // Example model, choose based on needs
          {
            prompt: fullPrompt,
            max_tokens: 2000, // Adjust as needed for book length
          }
        );

        const generatedBookContent = aiResponse.response;

        // Store generated book in R2
        const outputFileName = `book-${jobId}.txt`;
        const outputFileKey = `generated-books/${outputFileName}`;
        await env.MYBOOK_OUTPUT_BUCKET.put(outputFileKey, generatedBookContent, {
          httpMetadata: { contentType: "text/plain" },
          // Add a TTL for automatic deletion, e.g., 24 hours (86400 seconds)
          // expirationTtl: 86400,
        });

        // Update job status: COMPLETED
        await jobStub.fetch(jobStub.url.origin + "/update-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "COMPLETED",
            progress: 100,
            result: { outputFileKey: outputFileKey },
          }),
        });

        console.log(`Job ${jobId} completed. Book stored at ${outputFileKey}`);

      } catch (error) {
        console.error(`Error processing job ${jobId}:`, error);
        // Update job status: FAILED
        await jobStub.fetch(jobStub.url.origin + "/update-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "FAILED", error: error.message, progress: 0 }),
        });
      }
    }
  },
};