import express from 'express';
import movieRoutes from '../backend/routes/movie.routes.js';
import cors from 'cors';
import path from 'path'; 

const app = express();

// Habilita CORS para permitir solicitudes desde diferentes dominios
app.use(cors());

// Analiza el cuerpo de las solicitudes como JSON
app.use(express.json());

// Define la ruta base para las películas
app.use('/api/movies', movieRoutes);

// Servir archivos estáticos desde la carpeta 'uploads'
app.use('/uploads', express.static(path.resolve('uploads')));
console.log('Carpeta estática "uploads":', path.resolve('uploads'));

export default app;
