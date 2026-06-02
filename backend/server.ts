import * as dotenv from 'dotenv'
dotenv.config()
import { createServer } from 'http'               // ← add
import { Server } from 'socket.io'                // ← add
import app from './app.ts'
import connectDatabase from './src/config/db.ts'
import { initSocket } from './src/socket/socketHandler.ts'  // ← add

const startServer = async () => {
  try {
    await connectDatabase();

    // Wrap express with http server
    const httpServer = createServer(app);

    // Attach Socket.IO
    const io = new Server(httpServer, {
      cors: {
        origin: [
          "https://nemitsagar.dpdns.org",
          "https://allinone-6wvd.vercel.app",
          "http://localhost:5173",
          "http://localhost:3000"
        ],
        credentials: true,
      },
    });

    initSocket(io);

    // Use httpServer.listen, NOT app.listen
    httpServer.listen(process.env.PORT, () => {
      console.log(`App is listening on port: ${process.env.PORT}`);
    });

  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer();