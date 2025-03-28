CREATE TABLE user_favorite_movie (
    id SERIAL PRIMARY KEY,
    userId VARCHAR(255) NOT NULL,
    movieId INTEGER NOT NULL,
    genres VARCHAR(255),
    imdbId INTEGER,
    posterUrl TEXT,
    title VARCHAR(500),
    tmdbId INTEGER,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);