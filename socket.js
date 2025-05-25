import { Server } from 'socket.io';
import { Bid } from './model/Bid.js';
import { Product } from './model/Product.js';

let io;

function isValidBid({ productId, userId, amount }) {
  return Boolean(productId && userId && amount);
}

function emitBidError(socket, message, detail = '') {
  socket.emit('bidError', { message, detail });
}

async function handlePlaceBid(socket, { productId, userId, amount }) {
  if (!isValidBid({ productId, userId, amount })) {
    emitBidError(socket, 'Missing productId, userId, or amount');
    return;
  }

  if (amount <= 0) {
    emitBidError(socket, 'Bid amount must be greater than 0');
    return;
  }

  const highestBid = await Bid.findOne({ product: productId }).sort({ amount: -1 });
  if (highestBid && amount <= highestBid.amount) {
    emitBidError(socket, `Bid amount must be higher than current bid ($${highestBid.amount})`);
    return;
  }

  try {
    const newBid = await Bid.create({ product: productId, user: userId, amount });

    await Product.findByIdAndUpdate(productId, { currentBid: newBid._id });
    const populatedBid = await Bid.findById(newBid._id).populate('user', 'firstName lastName');
    const { firstName = '', lastName = '' } = populatedBid.user || {};

    io.emit('newBid', {
      productId,
      amount,
      userId,
      createdAt: newBid.createdAt,
      firstName,
      lastName
    });
  } catch (err) {
    console.error('Bid creation error:', err);
    emitBidError(socket, 'Bid creation failed', err.message);
  }
}

function initializeSocket(server) {
  io = new Server(server, {
    cors: { origin: ['https://dragon-tempura-sprint2.vercel.app', 'http://localhost:5173'] },
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    socket.on('placeBid', (data) => handlePlaceBid(socket, data));
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
}

export { initializeSocket, io };



// io.on('connection', (socket) => {
//   console.log(`User connected: ${socket.id}`);

//   socket.on('placeBid', (dataAuction) => {
//     io.emit('newBid', dataAuction);
//   });

//   socket.on('disconnect', () => {
//     console.log(`User disconnected: ${socket.id}`);
//   });
// });