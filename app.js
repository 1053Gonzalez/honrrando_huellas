//invocamos a express 
require('dotenv').config();
const express = require('express');
const db = require('./database/db');
const path = require('path');
const app = express();
const port = 3000;


//setemos urlencode para capturar los datos de formulari
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


//Invocamos a dotenv
const dotenv = require('dotenv');
dotenv.config({ path: './env/.env' });
console.log("Variables de entorno cargadas:", process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_DATABASE);

//el directorio public
//app.use('/resources',express.static(path.join(__dirname,)));
//app.use(express.static(path.join(__dirname, 'public')));
//app.use('/resources', express.static(__dirname + 'public'));
app.use('/resources', express.static(path.join(__dirname, 'public')));



//motor de plantillas
app.set('view engine', 'ejs');

// invocamos a bcryptjs para encriptar contraseñas
const bcryptjs = require('bcryptjs');

//Variables de sesion
const sesion = require('express-session');
app.use(sesion({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

// Página de bienvenida
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.get('/', (req, res) => {
  res.render('welcome');
});


//Clientes

app.get('/usuario', (req, res) => {
  db.query('SELECT * FROM cliente', (err, results) => {
    if (err) throw err;
    res.render('usuarios', { clientes: results });
  });
});

// Mostrar formulario de registro de cliente - usuario
app.post('/registrarusuario', (req, res) => {
  const { id_usuario, nombre1, nombre2, apellido1, apellido2, direccion, movil, email, fecha_nacimiento, nombre_usuario, password, repita_password, id_perfil } = req.body;

  // Validar que las contraseñas coincidan
  if (password !== repita_password) {
    return res.send("Las contraseñas no coinciden. Por favor, inténtelo de nuevo.");
  }

  // Insertar en la tabla usuario sin proporcionar id_usuario
  db.query('INSERT INTO usuario (id_usuario, nombre_usuario, password, id_perfil) VALUES (?, ?, ?, ?)', [id_usuario, nombre_usuario, password, id_perfil], (err, result) => {
    if (err) throw err;

    const newClient = { id_usuario, nombre1, nombre2, apellido1, apellido2, direccion, movil, email, fecha_nacimiento };
    console.log('Arreglo de newClient', newClient);
    // Insertar en la tabla cliente
    db.query('INSERT INTO cliente SET ?', newClient, (err) => {
      if (err) throw err;
      res.redirect('/usuario');
    });
  });
});


// Obtener todos los usuarios
app.get('/usuario', (req, res) => {
  db.query('SELECT * FROM cliente', (err, results) => {
    if (err) {
      console.error('Error al realizar la consulta a la base de datos:', err);
      return res.status(500).send('Error interno del servidor');
    }
    console.log('Resultados de la consulta a la base de datos:', results);
    res.render('usuarios', { clientes: results });  // Cambié 'usuario' por 'usuarios' y 'users' por 'clientes'
  });
});


// Obtener un usuario para editar
app.get('/editar-usuario/:id', (req, res) => {
  const id_usuario = req.params.id;

  console.log('id usuario', id_usuario);
  db.query('SELECT * FROM cliente WHERE id_usuario = ?', [id_usuario], (err, result) => {
    if (err) {
      console.error('Error al realizar la consulta a la base de datos:', err);
      return res.status(500).send('Error interno del servidor');
    }

    if (result.length === 0) {
      return res.status(404).send('Cliente no encontrado');
    }

    res.render('editarusuario', { cliente: result[0] });
  });
});


// Actualizar un usuario en la base de datos
app.post('/editarusuario/:id', (req, res) => {
  const id_usuario = req.params.id;
  const { nombre1, nombre2, apellido1, apellido2, direccion, movil, email, fecha_nacimiento } = req.body;

  const updatedUser = { nombre1, nombre2, apellido1, apellido2, direccion, movil, email, fecha_nacimiento };
  console.log('Datos recibidos para la actualización:', updatedUser);

  db.query('UPDATE cliente SET ? WHERE id_usuario = ?', [updatedUser, id_usuario], (err) => {
    if (err) {
      console.error('Error al actualizar el usuario en la base de datos:', err);
      return res.status(500).send('Error interno del servidor');
    }

    res.redirect('/usuario');
  });
});


// Mostrar formulario de registro de usuario
app.get('/registrarusuario', (req, res) => {
  res.render('registrarusuario');
});


// Renderizar la página de edición con los detalles del usuario seleccionado
 app.get('/edit/:id', (req, res) => {
   const id_usuario = req.params.id;
   db.query('SELECT * FROM clientes WHERE id = ?', [id_usuario], (err, result) => {
     if (err) throw err;
     res.render('edit', { nombre_usuario: result[0] });
   });
 });


// Eliminar un usuario de las tablas cliente y usuario
app.get('/eliminarusuario/:id', (req, res) => {
  const id_usuario = req.params.id;

  // Eliminar de la tabla cliente
  db.query('DELETE FROM cliente WHERE id_usuario = ?', [id_usuario], (err, resultCliente) => {
    if (err) {
      console.error('Error al eliminar el usuario de la tabla cliente:', err);
      return res.status(500).send('Error interno del servidor');
    }

    // Eliminar de la tabla usuario
    db.query('DELETE FROM usuario WHERE id_usuario = ?', [id_usuario], (err, resultUsuario) => {
      if (err) {
        console.error('Error al eliminar el usuario de la tabla usuario:', err);
        return res.status(500).send('Error interno del servidor');
      }

      res.redirect('/usuario');
    });
  });
});

//Apartado para la gestion de mascotas 
// Renderizar la página de registro de mascotas
app.get('/registrarmascota', (req, res) => {
  res.render('registrarmascotas');
});

// Registrar una nueva mascota
app.post('/registrarmascota', (req, res) => {
  const { id_usuario, nombre, fechaNacimiento, especie, genero, raza, color } = req.body;
  const newPet = { id_usuario, raza, nombre, fecha_nacimiento: fechaNacimiento, especie, genero, color };

  console.log('Datos de la nueva mascota:', newPet);

  db.query('INSERT INTO mascota SET ?', newPet, (err) => {
    if (err) {
      console.error('Error al registrar la mascota:', err);
      return res.status(500).send('Error interno del servidor');
    }
    res.redirect('/'); // Redirige a la página de usuarios
  });
});

// Mostrar el listado de mascotas/
app.get('/mascotas', (req, res) => {
  db.query('SELECT * FROM mascota', (err, results) => {
    if (err) {
      console.error('Error al realizar la consulta a la base de datos:', err);
      return res.status(500).send('Error interno del servidor');
    }
    res.render('mascotas', { mascotas: results });
  });
});

// Agrega una ruta para mostrar el formulario de edición de mascotas
app.get('/editmascota/:nombre/:id_usuario', (req, res) => {
  const nombre = req.params.nombre;
  const id_usuario = req.params.id_usuario;

  console.log('Nombre y ID de usuario recibidos:', nombre, " Documento del padre: ", id_usuario);

  // Obtén los detalles de la mascota por su nombre e ID de usuario desde la base de datos
  db.query('SELECT * FROM mascota WHERE nombre = ? AND id_usuario = ?', [nombre, id_usuario], (err, result) => {
    if (err) {
      console.error('Error al obtener detalles de la mascota:', err);
      return res.status(500).send('Error interno del servidor');
    }

    const mascota = result[0];

    // Renderiza el formulario de edición con los detalles de la mascota
    res.render('editmascota', { mascota });
  });
});

app.post('/editmascota/:nombre/:id_usuario', (req, res) => {
  const nombre = req.params.nombre;
  const id_usuario = req.params.id_usuario;
  const { fecha_nacimiento, especie, genero, raza, color } = req.body;

  const updatedPet = { fecha_nacimiento, especie, genero, raza, color };

  // Actualiza los detalles de la mascota en la base de datos
  db.query('UPDATE mascota SET ? WHERE nombre = ? AND id_usuario = ?', [updatedPet, nombre, id_usuario], (err) => {
    if (err) {
      console.error('Error al actualizar la mascota en la base de datos:', err);
      return res.status(500).send('Error interno del servidor');
    }

    res.redirect('/mascotas'); // Redirige al listado de mascotas después de la edición
  });
});


// Eliminar una mascota
app.get('/deletemascota/:nombre/:id_usuario', (req, res) => {
  const nombre = req.params.nombre;
  const id_usuario = req.params.id_usuario;
  
  console.log('Intentando eliminar mascota con nombre:', nombre, 'y ID de usuario:', id_usuario);

  // Realiza la eliminación de la mascota en la base de datos
  db.query('DELETE FROM mascota WHERE nombre = ? AND id_usuario = ?', [nombre, id_usuario], (err) => {
    if (err) {
      console.error('Error al eliminar la mascota en la base de datos:', err);
      return res.status(500).send('Error interno del servidor');
    }

    console.log('Mascota eliminada con éxito.');

    res.redirect('/mascotas'); // Redirige al listado de mascotas después de la eliminación
  });
});