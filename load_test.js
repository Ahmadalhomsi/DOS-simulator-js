const { Worker, isMainThread, workerData, parentPort } = require('worker_threads');
const axios = require('axios');

if (isMainThread) {
  const threads = 4; // Number of threads
  const requestsPerSecond = 100; // Total desired RPS across all threads
  const testDurationSeconds = 10; // Duration of the test in seconds
  const url = "http://your-server-url.com/api-endpoint"; // Replace with your server's endpoint

  const requestsPerThread = Math.floor(requestsPerSecond / threads);

  console.log(`Starting load test: ${requestsPerSecond} RPS, ${testDurationSeconds} seconds, ${threads} threads`);

  let completedThreads = 0;

  for (let i = 0; i < threads; i++) {
    const worker = new Worker(__filename, {
      workerData: { url, requestsPerSecond: requestsPerThread, testDurationSeconds },
    });

    worker.on('message', (message) => {
      if (message === 'done') {
        completedThreads++;
        if (completedThreads === threads) {
          console.log('Load test completed.');
        }
      }
    });
  }
} else {
  const { url, requestsPerSecond, testDurationSeconds } = workerData;
  let requestCount = 0;

  const sendRequest = async () => {
    try {
      const res = await axios.get(url);
      requestCount++;
      console.log(res.status);
    } catch (error) {
      console.error("Request failed:", error.message);
    }
  };

  const interval = setInterval(() => {
    for (let i = 0; i < requestsPerSecond; i++) {
      sendRequest();
    }
  }, 1000);

  setTimeout(() => {
    clearInterval(interval);
    console.log(`Thread completed: ${requestCount} requests`);
    parentPort.postMessage('done');
  }, testDurationSeconds * 1000);
}
