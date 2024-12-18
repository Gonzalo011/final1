import { pool } from '../db.js';
import fs from 'fs';
import path from 'path';

// Obtener todas las películas
export const getMovies = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM movies');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las películas", error });
  }
};

// Obtener una película por ID
export const getMovieById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM movies WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "Película no encontrada" });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la película", error });
  }
};

// Crear una nueva película
export const createMovie = async (req, res) => {
  const { title, year, genre, description } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null; // Cambiar la ruta
  console.log('Archivo subido:', req.file);
  console.log('Ruta generada:', imagePath);
  
  if (!title || !imagePath || !year || !genre) {
    return res.status(400).json({ message: "Título, imagen, año y género son requeridos" });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO movies (title, year, genre, description, image) VALUES (?, ?, ?, ?, ?)',
      [title, year, genre, description, imagePath]
    );
    res.status(201).json({ id: result.insertId, title, year, genre, description, image: imagePath });
  } catch (error) {
    res.status(500).json({ message: "Error al crear la película", error });
  }
};

// Actualizar una película
export const updateMovie = async (req, res) => {
  const { title, year, genre, description } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null; // Cambiar la ruta


  try {
    // Si hay una imagen nueva, obtén la ruta de la imagen actual para eliminarla
    let currentImagePath = null;
    if (imagePath) {
      const [rows] = await pool.query('SELECT image FROM movies WHERE id = ?', [req.params.id]);
      if (rows.length > 0) {
        currentImagePath = rows[0].image;
      }
    }

    const [result] = await pool.query(
      'UPDATE movies SET title = ?, year = ?, genre = ?, description = ?, image = COALESCE(?, image) WHERE id = ?',
      [title, year, genre, description, imagePath, req.params.id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "Película no encontrada" });

    // Si hay una imagen nueva y existe una imagen anterior, elimínala del servidor
    if (imagePath && currentImagePath) {
      fs.unlink(currentImagePath, (err) => {
        if (err) console.error(`Error al eliminar la imagen anterior: ${err.message}`);
      });
    }

    res.json({ id: req.params.id, title, year, genre, description, image: imagePath || currentImagePath });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la película", error });
  }
};

// Eliminar una película
export const deleteMovie = async (req, res) => {
  try {
    // Obtén la ruta de la imagen antes de eliminar el registro
    const [rows] = await pool.query('SELECT image FROM movies WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "Película no encontrada" });

    const imagePath = rows[0].image;

    // Elimina el registro de la base de datos
    const [result] = await pool.query('DELETE FROM movies WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Película no encontrada" });

    // Elimina la imagen asociada si existe
    if (imagePath) {
      fs.unlink(imagePath, (err) => {
        if (err) console.error(`Error al eliminar la imagen: ${err.message}`);
      });
    }

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la película", error });
  }
};
