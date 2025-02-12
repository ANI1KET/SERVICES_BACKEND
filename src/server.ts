import os from "os";
import { Server } from "http";
import cluster from "cluster";

import app from "./app";
import { PORT } from "./env_variable";
import { setupGracefulShutdown } from "./utils/shutdownHandler";

// Error handling for uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error(`Uncaught Exception: ${err.message}`);
  console.error(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});

const ListenOnDifferentPort = () => {
  // This is executed in worker processes // All worker listening on same port
  const workerId = cluster.worker?.id || 0; // Get worker ID (1-based)
  const port = (Number(PORT) || 6000) + workerId; // Adjust base PORT as needed and convert PORT to a number and add workerId

  const server: Server = app.listen(port, () => {
    console.log(`Worker ${process.pid} running on port: ${port}`);
  });

  // Setup graceful shutdown in the worker process
  setupGracefulShutdown(server);

  // Error handling for unhandled promise rejections
  process.on("unhandledRejection", (err: Error) => {
    console.error(`Unhandled Rejection: ${err.message}`);
    console.error(
      `Shutting down the server due to Unhandled Promise Rejection`
    );

    server.close(() => {
      process.exit(1);
    });
  });
};

const ListenOnSamePort = () => {
  // This is executed in worker processes // All worker listening on same port
  const server: Server = app.listen(PORT, () => {
    console.log(`Worker ${process.pid} running on port: ${PORT}`);
  });

  // Setup graceful shutdown in the worker process
  setupGracefulShutdown(server);

  // Error handling for unhandled promise rejections
  process.on("unhandledRejection", (err: Error) => {
    console.error(`Unhandled Rejection: ${err.message}`);
    console.error(
      `Shutting down the server due to Unhandled Promise Rejection`
    );

    server.close(() => {
      process.exit(1);
    });
  });
};

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;

  // Fork workers for each CPU core
  // for (let i = 0; i < numCPUs; i++) {
  for (let i = 0; i < 1; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(
      `Worker ${worker.process.pid} died with code: ${code}, signal: ${signal}`
    );
    cluster.fork(); // Optionally restart worker if it dies unexpectedly
  });
} else {
  // ListenOnDifferentPort();
  ListenOnSamePort();
}
