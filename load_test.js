const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const axios = require('axios');

// Function for making load requests
async function sendRequest(url, requestCount) {
  try {
    for (let i = 0; i < requestCount; i++) {
      await axios.get(url);
      console.log(`Request ${i + 1} sent successfully.`);
    }
  } catch (error) {
    console.error("Request failed:", error.message);
  }
}

if (isMainThread) {
  const threads = 4; // Number of threads to spawn
  const requestsPerThread = 100; // Number of requests per thread
  const url = "http://your-server-url.com/api-endpoint"; // Replace with your Next.js server URL

  console.log(`Spawning ${threads} threads...`);

  for (let i = 0; i < threads; i++) {
    new Worker(__filename, { workerData: { url, requestsPerThread } });
  }
} else {
  sendRequest(workerData.url, workerData.requestsPerThread)
    .then(() => parentPort.postMessage("Thread completed."));
}
