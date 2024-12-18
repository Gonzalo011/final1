import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
} from '../controllers/movie.controllers.js';

const router = express.Router();

// Configuración de almacenamiento de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.resolve('uploads'); // Ruta para almacenar las imágenes
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath); // Define la carpeta de destino
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Mantiene la extensión original
  },
});

const upload = multer({ storage });

// Rutas CRUD con manejo de imágenes
router.get('/', getMovies);          // Obtener todas las películas
router.get('/:id', getMovieById);    // Obtener una película por ID
router.post('/', upload.single('image'), createMovie); // Crear película con imagen
router.put('/:id', upload.single('image'), updateMovie); // Actualizar película con imagen
router.delete('/:id', deleteMovie); // Eliminar una película

export default router;


