# Usa una imagen base de Node.js 22
FROM node:22-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos necesarios para instalar dependencias
COPY package.json package-lock.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos de la aplicación
COPY . .

# Expone el puerto 5173 (el puerto por defecto de Vite)
EXPOSE 5173

# Comando para iniciar la aplicación
CMD ["npm", "run", "dev", "--", "--host"]