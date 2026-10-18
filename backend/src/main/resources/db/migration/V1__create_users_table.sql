CREATE TABLE users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    name          VARCHAR(120) NOT NULL,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(100) NOT NULL,
    created_at    TIMESTAMP    NOT NULL
);
