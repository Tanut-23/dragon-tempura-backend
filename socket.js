import { Server } from 'socket.io';
import { Bid } from './model/Bid.js';
import { Product } from './model/Product.js'


let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: { origin: ['https://dragon-tempura-sprint2.vercel.app' ,'http://localhost:5173',] },
  });

  io.on('connection', (socket) => {
    socket.on('placeBid', async ({ productId, userId, amount }) => {
      console.log('placeBid received:', { productId, userId, amount });
      if (!productId || !userId || !amount) {
        socket.emit('bidError', { message: 'Missing productId, userId, or amount' });
        return;
      }
      try {
        const newBid = await Bid.create({
          product: productId,
          user: userId,
          amount
        });
        await Product.findByIdAndUpdate(productId, { currentBid: newBid._id });
        const populatedBid = await Bid.findById(newBid._id).populate('user', 'firstName lastName');
        io.emit('newBid', {
          productId,
          amount,
          userId,
          createdAt: newBid.createdAt,
          firstName: populatedBid.user?.firstName || "Unknown",
          lastName: populatedBid.user?.lastName || ""
        });
      } catch (err) {
        console.error('Bid creation error:', err);
        socket.emit('bidError', { message: 'Bid creation failed', detail: err.message });
      }
    });
  });

  return io;
};

export { initializeSocket, io };






// io.on('connection', (socket) => {
//   console.log(`User connected: ${socket.id}`);

//   socket.on('oneBid', (dataAuctioneer) => {
//     io.emit('shareBid', dataAuctioneer);
//   });

//   socket.on('disconnect', () => {
//     console.log(`User disconnected: ${socket.id}`);
//   });
// });

