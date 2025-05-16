import express from 'express';
import cors from 'cors';
import codesRouter from './routes/codes.routes';
import { db } from './services/db.service';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

//Inicialización asíncrona
const startServer = async () => {
  try {
    await db.init();
    console.log('Database initialized successfully');
    
    //Rutas
    app.use('/codigos', codesRouter);

    //Manejo de errores
    app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error('Error:', err);
      res.status(500).json({ error: 'Internal server error' });
    });

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
};

startServer();

export default app;