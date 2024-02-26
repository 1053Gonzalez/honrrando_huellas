##creacion de la base de datos

CREATE DATABASE `honrando_huella` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci */;

##creacion de las tablas:
CREATE TABLE `admin` (
  `id_usuario` int(11) NOT NULL,
  `nombre1` varchar(20) DEFAULT NULL,
  `nombre2` varchar(20) DEFAULT NULL,
  `apellido1` varchar(20) DEFAULT NULL,
  `apellido2` varchar(20) DEFAULT NULL,
  `fecha_registro` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_usuario`),
  KEY `fk_Admin_Usuario1_idx` (`id_usuario`),
  CONSTRAINT `fk_Admin_Usuario1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE `afiliaciones` (
  `id_afiliacion` int(11) NOT NULL AUTO_INCREMENT,
  `id_Pedido` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_final` date DEFAULT NULL,
  PRIMARY KEY (`id_afiliacion`,`id_Pedido`,`id_usuario`),
  KEY `fk_Afiliaciones_Ped_Afiliacion1_idx` (`id_Pedido`),
  KEY `fk_Afiliaciones_Admin1_idx` (`id_usuario`),
  CONSTRAINT `fk_Afiliaciones_Admin1` FOREIGN KEY (`id_usuario`) REFERENCES `admin` (`id_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_Afiliaciones_Ped_Afiliacion1` FOREIGN KEY (`id_Pedido`) REFERENCES `ped_afiliacion` (`id_Pedido`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE `cliente` (
  `id_usuario` int(11) NOT NULL,
  `nombre1` varchar(20) NOT NULL,
  `nombre2` varchar(20) DEFAULT NULL,
  `apellido1` varchar(20) NOT NULL,
  `apellido2` varchar(20) DEFAULT NULL,
  `direccion` varchar(45) DEFAULT NULL,
  `movil` varchar(11) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_usuario`),
  KEY `fk_Cliente_Usuario1_idx` (`id_usuario`),
  CONSTRAINT `fk_Cliente_Usuario1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE `mascota` (
  `idMascota` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `raza` varchar(45) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `especie` varchar(45) NOT NULL,
  `genero` varchar(45) NOT NULL,
  `color` varchar(45) NOT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`idMascota`,`id_usuario`),
  KEY `fk_Mascota_Cliente1_idx` (`id_usuario`),
  CONSTRAINT `fk_Mascota_Cliente1` FOREIGN KEY (`id_usuario`) REFERENCES `cliente` (`id_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE `ped_afiliacion` (
  `id_Pedido` int(11) NOT NULL AUTO_INCREMENT,
  `id_plan` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_mascota` int(11) NOT NULL,
  `fecha_registro` timestamp NULL DEFAULT current_timestamp(),
  `procesado` tinyint(4) DEFAULT 0,
  `estado` tinyint(4) DEFAULT NULL,
  `texto` text DEFAULT NULL,
  PRIMARY KEY (`id_Pedido`,`id_usuario`,`id_mascota`,`id_plan`),
  KEY `fk_Ped_Afiliacion_Plan_Exequial1_idx` (`id_plan`),
  KEY `fk_Ped_Afiliacion_Mascota1_idx` (`id_mascota`),
  KEY `fk_Ped_Afiliacion_Cliente1_idx` (`id_usuario`),
  CONSTRAINT `fk_Ped_Afiliacion_Cliente1` FOREIGN KEY (`id_usuario`) REFERENCES `cliente` (`id_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_Ped_Afiliacion_Mascota1` FOREIGN KEY (`id_mascota`) REFERENCES `mascota` (`idMascota`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_Ped_Afiliacion_Plan_Exequial1` FOREIGN KEY (`id_plan`) REFERENCES `plan_exequial` (`id_plan`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE `perfil` (
  `id_perfil` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_perfil` varchar(50) NOT NULL,
  PRIMARY KEY (`id_perfil`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE `plan_exequial` (
  `id_plan` int(11) NOT NULL AUTO_INCREMENT,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `nombre_plan` varchar(50) NOT NULL,
  `valor` decimal(10,0) NOT NULL,
  `texto` text DEFAULT NULL,
  `vigencia_year` int(11) NOT NULL,
  `activo` tinyint(4) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_plan`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE `pqrsf` (
  `id_PQRSF` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `fecha_registro` timestamp NULL DEFAULT current_timestamp(),
  `tipo` char(1) NOT NULL,
  `texto` text NOT NULL,
  PRIMARY KEY (`id_PQRSF`,`id_usuario`),
  KEY `fk_PQRSF_Cliente1_idx` (`id_usuario`),
  CONSTRAINT `fk_PQRSF_Cliente1` FOREIGN KEY (`id_usuario`) REFERENCES `cliente` (`id_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL,
  `id_perfil` int(11) NOT NULL,
  `nombre_usuario` varchar(45) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_usuario`,`id_perfil`),
  KEY `fk_Usuario_Perfil_idx` (`id_perfil`),
  CONSTRAINT `fk_Usuario_Perfil` FOREIGN KEY (`id_perfil`) REFERENCES `perfil` (`id_perfil`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
