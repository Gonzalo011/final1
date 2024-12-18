// src/api.js
// const API_URL = 'http://localhost:5000/api/movies';

// export const getMovies = async () => {
//   const response = await fetch(API_URL);
//   return await response.json();
// };

// export const getMovieById = async (id) => {
//   const response = await fetch(`${API_URL}/${id}`);  // Corrección de plantilla literal
//   return await response.json();
// };

// export const createMovie = async (movie) => {
//   const response = await fetch(API_URL, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(movie),
//   });
//   return await response.json();
// };

// export const updateMovie = async (id, movie) => {
//   const response = await fetch(`${API_URL}/${id}`, {  // Corrección de plantilla literal
//     method: 'PUT',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(movie),
//   });
//   return await response.json();
// };

const API_URL = 'http://localhost:5000/api/movies';

export const getMovies = async () => {
  const response = await fetch(API_URL);
  return await response.json(); // Obtiene todas las películas
};

export const getMovieById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);
  return await response.json(); // Obtiene una película por ID
};

// Crear una nueva película
export const createMovie = async (movie) => {
  const formData = new FormData();

  // Agregar todos los campos de la película a FormData
  formData.append('title', movie.title);
  formData.append('year', movie.year);
  formData.append('genre', movie.genre);
  formData.append('description', movie.description);

  // Añadir la imagen si está presente
  if (movie.image) {
    formData.append('image', movie.image);  // Suponiendo que 'image' es un archivo
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    body: formData, // Sin encabezado Content-Type
  });
  return await response.json();
};

export const updateMovie = async (id, movie) => {
  const formData = new FormData();

  formData.append('title', movie.title);
  formData.append('year', movie.year);
  formData.append('genre', movie.genre);
  formData.append('description', movie.description);

  if (movie.image) {
    formData.append('image', movie.image);
  }

  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    body: formData,
  });
  return await response.json();
};
