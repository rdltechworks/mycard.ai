// worker/index.js

// Durable Object for managing job state
export class BookJobManager {
  constructor(state, env) {
    this.state = state;
    this.env = env;
    this.storage = this.state.storage;
  }

  async fetch(request) {
    const url = new URL(request.url);

    switch (url.pathname) {
      case "/status":
        return this.handleStatus(request);
      case "/update-status":
        return this.handleUpdateStatus(request);
      default:
        return new Response("Not found", { status: 404 });
    }
  }

  async handleStatus(request) {
    const status = await this.storage.get("status") || "PENDING";
    const result = await this.storage.get("result") || null;
    const error = await this.storage.get("error") || null;
    const progress = await this.storage.get("progress") || 0;

    return new Response(JSON.stringify({ status, result, error, progress }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  async handleUpdateStatus(request) {
    const { status, result, error, progress } = await request.json();
    if (status) await this.storage.put("status", status);
    if (result) await this.storage.put("result", result);
    if (error) await this.storage.put("error", error);
    if (progress !== undefined) await this.storage.put("progress", progress);

    return new Response("Status updated", { status: 200 });
  }
}

// Main Worker logic
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle API requests
    if (url.pathname.startsWith("/api/")) {
      const apiPath = url.pathname.substring(5); // Remove /api/

      switch (apiPath) {
        case "generate-book":
          return this.handleGenerateBook(request, env, ctx);
        case "status":
          return this.handleGetStatus(request, env);
        case "download":
          return this.handleDownloadBook(request, env);
        default:
          return new Response("API endpoint not found", { status: 404 });
      }
    }

    // Serve static assets
    try {
      return await env.ASSETS.fetch(request);
    } catch (error) {
      console.error("Error serving static assets:", error);
      return new Response("Error serving static content.", { status: 500 });
    }
  },

  async handleGenerateBook(request, env, ctx) {
    const formData = await request.formData();
    const files = formData.getAll("files");
    const timeline = formData.get("timeline");
    const prompt = formData.get("prompt");

    if (!files || files.length === 0 || !timeline || !prompt) {
      return new Response("Missing required fields: files, timeline, or prompt", { status: 400 });
    }

    const jobId = env.MYBOOK_JOB_MANAGER.newUniqueId().toString();
    const jobStub = env.MYBOOK_JOB_MANAGER.get(jobId);

    // Store initial job status in Durable Object
    await jobStub.fetch(jobStub.url.origin + "/update-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "UPLOADING_FILES", progress: 10 }),
    });

    const fileKeys = [];
    for (const file of files) {
      const fileKey = `raw-input/${jobId}/${file.name}`;
      await env.MYBOOK_INPUT_BUCKET.put(fileKey, file.stream());
      fileKeys.push(fileKey);
    }

    // Enqueue job for AI processing
    await env.MYBOOK_JOB_QUEUE.send({
      jobId: jobId,
      fileKeys: fileKeys,
      timeline: timeline,
      prompt: prompt,
    });

    // Update job status in Durable Object
    await jobStub.fetch(jobStub.url.origin + "/update-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "QUEUED", progress: 20 }),
    });

    return new Response(JSON.stringify({ jobId, status: "QUEUED" }), {
      headers: { "Content-Type": "application/json" },
      status: 202, // Accepted
    });
  },

  async handleGetStatus(request, env) {
    const url = new URL(request.url);
    const jobId = url.searchParams.get("jobId");

    if (!jobId) {
      return new Response("Missing jobId parameter", { status: 400 });
    }

    const jobStub = env.MYBOOK_JOB_MANAGER.get(jobId);
    const response = await jobStub.fetch(jobStub.url.origin + "/status");
    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  },

  async handleDownloadBook(request, env) {
    const url = new URL(request.url);
    const jobId = url.searchParams.get("jobId");

    if (!jobId) {
      return new Response("Missing jobId parameter", { status: 400 });
    }

    const jobStub = env.MYBOOK_JOB_MANAGER.get(jobId);
    const jobStatusResponse = await jobStub.fetch(jobStub.url.origin + "/status");
    const jobData = await jobStatusResponse.json();

    if (jobData.status !== "COMPLETED" || !jobData.result || !jobData.result.outputFileKey) {
      return new Response("Book not ready or job failed", { status: 404 });
    }

    const outputFileKey = jobData.result.outputFileKey;
    const object = await env.MYBOOK_OUTPUT_BUCKET.get(outputFileKey);

    if (!object) {
      return new Response("Book file not found", { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("Content-Type", "text/plain"); // Assuming plain text book for now
    headers.set("ETag", object.httpEtag);

    return new Response(object.body, { headers });
  },
};