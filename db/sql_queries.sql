CREATE TABLE users (
	id varchar(255) PRIMARY KEY, 
	name varchar(50) NOT null,
	date_of_birth date NOT null,
	gender varchar(5) NOT null,
	email varchar(255) UNIQUE NOT null,
	phone varchar(25) UNIQUE NOT null,
	details TEXT,
	created_at timestamp NOT NULL DEFAULT NOW(),
	the_geom geometry NOT null
);

CREATE TABLE preferences (
	id serial PRIMARY KEY, 
	gender varchar(25) NOT NULL,
	minimum_age int NOT NULL DEFAULT 18,
	maximum_age int NOT NULL DEFAULT 99,
	maximum_distance int NOT NULL DEFAULT 25,
	user_id varchar(255) NOT NULL,
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE 
);

CREATE TABLE gender (
	id varchar(5) PRIMARY KEY, 
	name varchar(25) NOT NULL
);

INSERT INTO gender (id, name)
VALUES ('m', 'Man'),
		('w', 'Woman'),
		('tm', 'Trans Man'),
		('tw', 'Trans Woman'),
		('nb', 'Non-binary');


CREATE TABLE photos (
	id int PRIMARY KEY,
  link TEXT,
	caption varchar(25), --can display caption about photo
  user_id TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
)

--SELECT updategeometrysrid('public', 'users', 'coordinates', 4326) 

SELECT * FROM users u 
WHERE ST_DWithin(coordinates, 'SRID=4326;POINT(-77.10779070854186 38.88199679713891)', 255 * 1609.34, true)
AND NOT id='v45rs' 

--INSERT INTO users (id, first_name, coordinates, height)
--VALUES ('v45rs', 'Evelyn', st_makepoint(-77.10779070854186, 38.88199679713891), 4326)

UPDATE users 
SET coordinates = 'POINT(-34.895637 28.510540)' --(longitude, lat)
WHERE id = 're5tf' 