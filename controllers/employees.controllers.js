import {pool} from "../db.js"

export const getEmployees = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM peliculas')
  res.json(rows)
  } catch (error) {
  return res.status(500).json({
    Mensaje: 'Ocurrio algo inesperado'
    })  
  }
}

export const getEmployee = async (req, res) => {
  try {
    const [rows] =  await pool.query('SELECT * FROM peliculas WHERE id = ?', [req.params.id])
  if (rows.length <= 0) return res.status(404).json({
    mensaje: 'No se encontro la pelicula'
  })
  res.json(rows[0])
  } catch (error) {
    return res.status(500).json({
      Mensaje:'Ocurrio algo inesperado'
    })
  }
}

export const createEmployees = async (req, res) => { 
    const {name, categoria} = req.body

    try { 
      const [rows] = await pool.query('INSERT INTO peliculas (name, categoria) VALUES (?, ?)', [name, categoria])
      res.send({
        id: rows.insertId,
        name,
        categoria, 
    })
  } catch (error) {
      return res.status(500).json({
        Mensaje:'Ocurrio algo inesperado'
    })  
  }
}


export const deleteEmployees = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM peliculas WHERE id = ?', [req.params.id])
    if (result.affectedRows <= 0) return res.status(404).json({
    Mensaje: 'Pelicula no encontrada'
  })
    res.sendStatus(204)
  } catch (error) {
    return res.status(500).json({
      Mensaje: 'Ocurrio algo inesperado'
    })   
  } 
}

export const updateEmployees = async (req, res) => {
  const {id} = req.params
  const {name, categoria} = req.body

  try {
    const [result] = await pool.query('UPDATE peliculas SET name = IFNULL(?, name), categoria = IFNULL(?, categoria) WHERE id = ?', [name, categoria, id]) 
  if (result.affectedRows === 0) return res.status(404).json({ 
    Mensaje: 'Pelicula no encontrada'
  })
  const [rows] = await pool.query('SELECT * FROM peliculas WHERE id = ?', [id] )
  console.log(result)
  res.json (rows[0])

  } catch (error) {
    return res.status(500).json({
      Mensaje:'Ocurrio algo inesperado'
    })
  }
}
