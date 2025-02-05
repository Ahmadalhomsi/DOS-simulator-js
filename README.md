# Server Load Tester JS

Server Load Tester JS is a tool for testing the load capacity of your server. It simulates multiple users accessing your server to help you understand its performance under stress.

## Features

- Simulate multiple users
- Customizable request parameters
- Detailed performance reports
- Easy to use

## Installation

To install the dependencies, run:

```bash
npm install
```

## Usage

To start the load test, run:

```bash
node loadTester.js
```
## Configuration

You can customize the test parameters by editing these variables.

```javascript

  const threads = 4; // Number of threads
  const requestsPerSecond = 100; // Total desired RPS across all threads
  const testDurationSeconds = 10; // Duration of the test in seconds
  const url = "http://your-server-url.com/api-endpoint"; // Replace with your server's endpoint

```
