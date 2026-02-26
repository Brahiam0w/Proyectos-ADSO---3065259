const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Crea las carpetas si no existen (evita errores al arrancar)
const crearDirectorios = () => {
  const dirs = ['uploads', 'uploads/productos', 'uploads/usuarios', 'uploads/categorias'];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Carpeta creada: ${dir}`);
    }
  });
};
crearDirectorios();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Decidimos la carpeta según el campo del formulario
    const carpetas = {
      'imagen_producto': 'uploads/productos',
      'avatar_usuario': 'uploads/usuarios',
      'imagen_icono': 'uploads/categorias'
    };
    const carpeta = carpetas[file.fieldname] || 'uploads/productos';
    cb(null, carpeta);
  },

  filename: (req, file, cb) => {
    // Nombre único: timestamp + número aleatorio + extensión original
    // Ejemplo: 1703123456789-842935123.jpg
    const extension = path.extname(file.originalname).toLowerCase();
    const nombreUnico = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
    cb(null, nombreUnico);
  }
});

const fileFilter = (req, file, cb) => {
  const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (tiposPermitidos.includes(file.mimetype)) {
    cb(null, true); // Aceptar
  } else {
    cb(new Error(`Tipo de archivo no permitido: ${file.mimetype}. Solo JPG, PNG, WEBP`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB por defecto
    files: 5 // Máximo 5 archivos a la vez
  }
});

// Función auxiliar para construir la URL pública de una imagen
const construirImagenUrl = (req, filename, carpeta = 'productos') => {
  if (!filename) return null;
  const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
  return `${baseUrl}/uploads/${carpeta}/${filename}`;
};

module.exports = {
  subirImagenProducto: upload.single('imagen_producto'),
  subirAvatarUsuario: upload.single('avatar_usuario'),
  subirImagenCategoria: upload.single('imagen_icono'),
  subirMultiplesImagenes: upload.array('imagenes', 5),
  construirImagenUrl
};
