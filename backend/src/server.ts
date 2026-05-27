import app from "./app";
import prisma from "./prisma/client";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // check database connection
    await prisma.$connect();

    console.log("Database connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
}

startServer();