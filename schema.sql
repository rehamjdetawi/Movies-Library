DROP TABLE IF EXISTS favMovie;

CREATE TABLE IF NOT EXISTS favMovie (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    poster_path VARCHAR(255),
    overview VARCHAR(10000),
    release_date VARCHAR(10000)
);