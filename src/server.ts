// // import express, { Express } from "express";
// // import { PrismaClient } from "@prisma/client";
// // import cors from "cors";
// // import cookieParser from "cookie-parser";
// // import cluster from "cluster";
// // import os from "os";

// // import { PORT } from "./env_variable";
// // import rootRoute from "./routers/rootRouter";
// // import { errorMiddleware } from "./middlewares/errors";

// // const app: Express = express();

// // export const prismaClient = new PrismaClient({
// //   log: ["query"],
// // });

// // app.use(
// //   cors({
// //     // origin: 'http://localhost:3000', // Replace with your frontend URL
// //     // methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
// //     //   allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
// //     origin: true,
// //     credentials: true,
// //   })
// // );
// // app.use(cookieParser());
// // app.use(express.json());
// // app.use(express.urlencoded({ extended: true }));

// // app.use("/api", rootRoute);
// // app.use(errorMiddleware);

// // // app.listen(PORT, () => {
// // //   console.log(`Server Running on Port : ${PORT}`);
// // // });

// // if (cluster.isPrimary) {
// //   const numCPUs = os.cpus().length; // Get the number of CPU cores

// //   // Fork workers for each CPU core
// //   for (let i = 0; i < numCPUs; i++) {
// //     cluster.fork();
// //   }

// //   cluster.on("exit", (worker, code, signal) => {
// //     console.log(
// //       `Worker ${worker.process.pid} died with code: ${code}, signal: ${signal}`
// //     );
// //   });
// // } else {
// //   // This is executed in worker processes
// //   app.listen(PORT, () => {
// //     console.log(`Worker ${process.pid} running on port: ${PORT}`);
// //   });
// // }

// ---------------------------------------------------------------------------- //

// import express, { Express } from "express";
// import { PrismaClient } from "@prisma/client";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import cluster from "cluster";
// import os from "os";

// import { PORT } from "./env_variable";
// import rootRoute from "./routers/rootRouter";
// import { errorMiddleware } from "./middlewares/errors";

// const app: Express = express();

// export const prismaClient = new PrismaClient({
//   log: ["query"],
// });

// app.use(
//   cors({
//     origin: true,
//     credentials: true,
//   })
// );
// app.use(cookieParser());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use("/api", rootRoute);
// app.use(errorMiddleware);

// // Error handling for uncaught exceptions
// process.on("uncaughtException", (err) => {
//   console.error(`Uncaught Exception: ${err.message}`);
//   console.error(`Shutting down the server due to Uncaught Exception`);
//   process.exit(1);
// });

// // Server creation and clustering
// if (cluster.isPrimary) {
//   const numCPUs = os.cpus().length;

//   // Fork workers for each CPU core
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }

//   cluster.on("exit", (worker, code, signal) => {
//     console.log(
//       `Worker ${worker.process.pid} died with code: ${code}, signal: ${signal}`
//     );
//   });
// } else {
//   // This is executed in worker processes
//   const server = app.listen(PORT, () => {
//     console.log(`Worker ${process.pid} running on port: ${PORT}`);
//   });

//   // Error handling for unhandled promise rejections
//   process.on("unhandledRejection", (err: Error) => {
//     console.error(`Unhandled Rejection: ${err.message}`);
//     console.error(
//       `Shutting down the server due to Unhandled Promise Rejection`
//     );

//     server.close(() => {
//       process.exit(1);
//     });
//   });
// }

import { Server } from "http"; // Import Server type
import cluster from "cluster";
import os from "os";

import { setupGracefulShutdown } from "./shutdownHandler"; // Import the shutdown handler
import { PORT } from "./env_variable";
import app from "./app";

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
  for (let i = 0; i < numCPUs; i++) {
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
