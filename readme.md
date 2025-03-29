# 📌 SeminarioIA - MasterIA

Este proyecto implementa un sistema basado en Flask, PostgreSQL y React. La infraestructura está definida mediante `docker-compose` para facilitar el despliegue.

## 🚀 Levantar el Proyecto

Asegúrate de tener instalado **Docker** y **Docker Compose** en tu máquina.

1. Clona este repositorio:

   ```sh
   git clone https://github.com/DenisFZelaya/SeminarioIA-MasterIA.git
   cd SeminarioIA-MasterIA
   ```

2. Construye y levanta los contenedores:

   ```sh
   docker-compose up --build
   ```

3. Accede a los servicios:

   - **API Flask**: [https://proyecto-d1.site](https://proyecto-d1.site)
   - **Base de datos PostgreSQL**:
     - Host: `3.18.68.194`
     - Puerto: `5432`
     - Usuario: `dfz`
     - Base de datos: `db_movies`
   - **PgAdmin**: [http://3.18.68.194:8081](http://3.18.68.194:8081)
     - Usuario: `user-name@domain-name.com`
     - Contraseña: `strong-password`
   - **React Frontend**: [http://3.18.68.194:5173](http://3.18.68.194:5173)

## 🛠 Desarrollo

Si realizas cambios en el código fuente y deseas reconstruir los servicios:

```sh
docker-compose up --build --force-recreate
```

Para detener los contenedores sin eliminar datos:

```sh
docker-compose down
```

Si deseas eliminar los volúmenes y datos persistentes:

```sh
docker-compose down -v
```

## 📄 Estructura del Proyecto

```
/SeminarioIA-MasterIA
│── /api                  # Backend en Flask
│── /app/webapp-seminarioia  # Frontend en React (Vite)
│── docker-compose.yml     # Configuración de contenedores
│── README.md              # Documentación del proyecto
```


