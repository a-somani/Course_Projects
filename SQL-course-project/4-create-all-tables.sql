DROP TABLE events;

CREATE TABLE cities (
    name VARCHAR(200) PRIMARY KEY
);

CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    title VARCHAR(300),
    street VARCHAR(300) NOT NULL,
    house_number VARCHAR(20) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    city_name VARCHAR(200) REFERENCES cities ON DELETE RESTRICT ON UPDATE CASCADE 
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(300) NOT NULL,
    last_name VARCHAR(300) NOT NULL,
    birthdate DATE NOT NULL,
    email VARCHAR(300) NOT NULL
);

CREATE TABLE organizers (
    password VARCHAR(500) NOT NULL,
    user_id INT PRIMARY KEY REFERENCES users ON DELETE CASCADE
);

CREATE TABLE tags (
    name VARCHAR(100) PRIMARY KEY
);

CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(300) NOT NULL CHECK (LENGTH(name) > 5),
    date_planned TIMESTAMP NOT NULL,
    image VARCHAR(300),
    description TEXT NOT NULL,
    max_participants INT CHECK (max_participants > 0),
    min_age INT CHECK (min_age > 0),
    location_id INT REFERENCES locations ON DELETE CASCADE,
    organizer_id INT REFERENCES organizers ON DELETE CASCADE
);

CREATE TABLE events_users (
    event_id INT REFERENCES events ON DELETE CASCADE,
    user_id INT REFERENCES users ON DELETE CASCADE,
    PRIMARY KEY (event_id, user_id) 
);

CREATE TABLE events_tags (
    event_id INT REFERENCES events ON DELETE CASCADE,
    tag_name VARCHAR(100) REFERENCES tags ON DELETE CASCADE,
    PRIMARY KEY (event_id, tag_name) 
);