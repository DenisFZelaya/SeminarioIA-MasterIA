Proyecto: Sistema de Recomendación Basado en IA

Este proyecto implementa un sistema de recomendación utilizando Flask como backend, PostgreSQL como base de datos y un frontend en React con Vite.

📌 Requisitos Previos

Asegúrate de tener instalados los siguientes programas antes de iniciar el proyecto:

Docker

Docker Compose

🚀 Instalación y Ejecución

1️⃣ Clonar el Repositorio

  git clone https://github.com/DenisFZelaya/SeminarioIA-MasterIA.git
  cd SeminarioIA-MasterIA

2️⃣ Levantar los Contenedores con Docker Compose

Ejecuta el siguiente comando en la raíz del proyecto:

  docker-compose up --build -d

Esto construirá las imágenes necesarias y levantará los servicios en segundo plano.

3️⃣ Servicios Disponibles

Una vez que los contenedores estén corriendo, los servicios estarán disponibles en:

Backend (Flask API): http://localhost:5000

Base de Datos (PostgreSQL): localhost:5432 (usuario: dfz, contraseña: strong-password, base de datos: db_movies)

pgAdmin: http://localhost:8081 (usuario: user-name@domain-name.com, contraseña: strong-password)

Frontend (React con Vite): http://localhost:5173

4️⃣ Verificar los Contenedores en Ejecución

Para ver los contenedores activos, usa:

  docker ps

5️⃣ Detener el Proyecto

Si necesitas detener los contenedores, ejecuta:

  docker-compose down

🛠 Desarrollo y Depuración

Acceder a un Contenedor

Si necesitas ingresar a un contenedor en ejecución, usa:

  docker exec -it <nombre_del_contenedor> sh

Ejemplo para la API:

  docker exec -it movies_api sh

Ver Logs de los Contenedores

Para inspeccionar los logs de un servicio:

  docker-compose logs -f <nombre_del_servicio>

Ejemplo para el frontend:

  docker-compose logs -f react_frontend

🎯 Notas

Asegúrate de que los puertos 5000, 5432, 8081 y 5173 no estén ocupados antes de levantar los contenedores.

Puedes modificar las variables de entorno en docker-compose.yml según tus necesidades.

Para reconstruir imágenes después de cambios en el código, usa:

  docker-compose up --build -d

📌 Autor: Denis Zelaya📌 Repositorio: GitHub