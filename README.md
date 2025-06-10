# Catálogo Tienda Online

Este proyecto es una aplicación web de catálogo de productos con autenticación, gestión de usuarios y productos, desarrollada con el framework Laravel para el backend y un frontend con HTML, CSS (Tailwind) y JavaScript.

## Descripción

- **Backend (Laravel):** Proporciona una API para la gestión de productos, usuarios, autenticación y pedidos. Incluye migraciones, seeders y middleware para roles de usuario (administrador/cliente).
- **Frontend:** Aplicación que consume la API para mostrar productos, detalles, login y contacto.

## Tecnologías utilizadas

- **Backend:**  
  - [Laravel 11](https://laravel.com/)
  - PHP 8.2+
  - MySQL
- **Frontend:**  
  - HTML5, CSS3 ([Tailwind CSS](https://tailwindcss.com/))
  - JavaScript

## Estructura del proyecto

```
catalogo-laravel/
  catalogo-laravel/   # Código fuente del backend Laravel
PROYECTO_TIENDA/      # Frontend estático (HTML, JS, CSS)
```

## Pasos para clonar y ejecutar el proyecto (GitHub)

### 1. Clonar el repositorio

```sh
git clone <URL_DEL_REPOSITORIO>
cd catalogo-laravel/catalogo-laravel
```

### 2. Instalar dependencias de Laravel

```sh
composer install
npm install
```

### 3. Configurar variables de entorno

Copia el archivo `.env.example` a `.env` y configura según tus necesidades:

```sh
cp .env.example .env
php artisan key:generate
```


### 4. Ejecutar migraciones y seeders

```sh
php artisan migrate --seed
```

Esto creará las tablas y poblará la base de datos con datos de ejemplo.

### 5. Iniciar el servidor de desarrollo

```sh
php artisan serve
```

- La API estará disponible en `http://127.0.0.1:8000/api`.

### 6. Probar el frontend

Abre otro terminal y navega a la carpeta del frontend:

```sh
cd ../../PROYECTO_TIENDA
```

Abre `index.html` en tu navegador. El frontend consumirá la API de Laravel.

---

## Credenciales de prueba

- **Admin:**  
  - Usuario: `admin@tienda.com`  
  - Contraseña: `admin123`
- **Cliente:**  
  - Usuario: `cliente@tienda.com`  
  - Contraseña: `cliente123`

---

## Notas

- Se debe tener PHP, Composer y Node.js instalados.
---
