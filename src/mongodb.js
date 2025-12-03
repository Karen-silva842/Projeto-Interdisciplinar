const mongoose = require('mongoose');

const connectMongoDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/central_compras';

    await mongoose.connect(mongoURI); // <- AGORA SEM WARNINGS

    console.log('MongoDB conectado com sucesso!');

    mongoose.connection.on('error', (err) => {
      console.error('Erro na conexão MongoDB:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB desconectado');
    });

  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectMongoDB;
