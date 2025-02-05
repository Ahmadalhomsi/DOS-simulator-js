const { Worker, isMainThread, workerData } = require('worker_threads');
const axios = require('axios');

if (isMainThread) {
  const threads = 4; // Number of threads
  const requestsPerSecond = 100; // Total desired RPS across all threads
  const url = "https://www.erzincanilahiyatdernegi.org/"; // Replace with your server's endpoint

  const requestsPerThread = Math.floor(requestsPerSecond / threads);
  
  console.log(`Starting load test with ${threads} threads and ${requestsPerSecond} RPS`);
  
  for (let i = 0; i < threads; i++) {
    new Worker(__filename, {
      workerData: { url, requestsPerSecond: requestsPerThread },
    });
  }
} else {
  const { url, requestsPerSecond } = workerData;
  let requestCount = 0;

  const sendRequest = async () => {
    try {
      await axios.get(url);
      requestCount++;
    } catch (error) {
      console.error("Request failed:", error.message);
    }
  };

  setInterval(() => {
    console.log(`Thread sent ${requestCount} requests`);
    requestCount = 0;
  }, 1000);

  setInterval(() => {
    for (let i = 0; i < requestsPerSecond; i++) {
      sendRequest();
    }
  }, 1000);
}
