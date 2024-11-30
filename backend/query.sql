-- DROP TABLE device;

CREATE TABLE device (owner TEXT, auth_token TEXT UNIQUE);

DROP TABLE history

CREATE TABLE history (auth_token TEXT UNIQUE, volume_usage FLOAT, uptime INT);