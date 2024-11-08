import { Server } from "http";

export function setupGracefulShutdown(server: Server) {
  const gracefulShutdown = (signal: string) => {
    console.log(`Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
      console.log("Closed all connections. Exiting process.");
      process.exit(0);
    });

    // Force shutdown if it takes too long
    setTimeout(() => {
      console.error("Shutdown took too long. Forcing shutdown...");
      process.exit(1);
    }, 10000); // 10-second timeout
  };

  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
}
