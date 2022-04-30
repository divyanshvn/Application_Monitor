DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS checks;
DROP TABLE IF EXISTS alerts;

CREATE TABLE users (
    user_id INT,
    name TEXT,
    email TEXT,
    password TEXT,
    Primary key(user_id)
);

CREATE TABLE checks (
    user_id INT,
    system TEXT,
    process TEXT,
    metric TEXT,
    threshold INT,
    last_update TEXT,
    Primary key(user_id,process,metric)
);

CREATE TABLE alerts (
    id INT,
    user_id INT,
    alert TEXT,
    system TEXT,
    Primary key(id)
);