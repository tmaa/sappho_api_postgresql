CREATE TABLE account (
	id TEXT PRIMARY KEY, 
	name varchar(50) NOT null,
	date_of_birth date NOT null,
	gender varchar(5) NOT null,
	email varchar(255) UNIQUE NOT null,
	phone varchar(25) UNIQUE NOT null,
	details TEXT,
	created_at timestamp NOT NULL DEFAULT NOW(),
	the_geom geometry NOT null
);

CREATE TABLE preference (
	id serial PRIMARY KEY, 
	interested_in varchar(10) NOT NULL,
	minimum_age int NOT NULL DEFAULT 18,
	maximum_age int NOT NULL DEFAULT 99,
	maximum_distance int NOT NULL DEFAULT 25,
	account_id TEXT NOT NULL UNIQUE,
	FOREIGN KEY (account_id) REFERENCES account(id) ON DELETE CASCADE ON UPDATE CASCADE 
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

CREATE TABLE interaction (
	id serial PRIMARY KEY ,
	account_id TEXT NOT NULL,
	target_account_id TEXT NOT NULL,
	liked boolean NOT NULL,
	FOREIGN KEY (account_id) REFERENCES account(id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (target_account_id) REFERENCES account(id) ON DELETE CASCADE ON UPDATE CASCADE
)

CREATE TABLE photos (
	id int PRIMARY KEY,
  link TEXT,
	caption varchar(25), --can display caption about photo
  account_id TEXT,
  FOREIGN KEY (account_id) REFERENCES accounts(id)
)

--SELECT updategeometrysrid('public', 'accounts', 'coordinates', 4326) 

SELECT * FROM accounts u 
WHERE ST_DWithin(coordinates, 'SRID=4326;POINT(-77.10779070854186 38.88199679713891)', 255 * 1609.34, true)
AND NOT id='v45rs' 

--INSERT INTO accounts (id, first_name, coordinates, height)
--VALUES ('v45rs', 'Evelyn', st_makepoint(-77.10779070854186, 38.88199679713891), 4326)

UPDATE accounts 
SET coordinates = 'POINT(-34.895637 28.510540)' --(longitude, lat)
WHERE id = 're5tf' 

SELECT * 
FROM preference p
RIGHT JOIN accounts u ON u.gender = p.gender 
WHERE p.account_id = 'jX36hxgcr4VC20Htf6FYLao0FM03' AND u.id != 'jX36hxgcr4VC20Htf6FYLao0FM03'


      const allGenders = `
          SELECT * FROM (
            SELECT *, date_part('year', AGE(NOW(), u.date_of_birth)) AS age 
            FROM accounts u
            WHERE u.id != $1
            AND date_part('year', AGE(NOW(), u.date_of_birth)) BETWEEN $2 AND $3
            AND ST_DWithin(the_geom, 'SRID=4326;POINT(${location.coordinates[0]} ${location.coordinates[1]})', $4 * 1609.34, true)
            ORDER BY random()
            LIMIT 50
          ) AS sel
          ORDER BY random()`


--shows all the people account has liked
	-- SELECT *
	-- FROM likes l
	-- RIGHT JOIN accounts u ON u.id = l.target_account_id
	-- 	WHERE u.id != $1
	-- 	AND (account_id = $1 AND target_account_id = u.id)
	-- 	AND date_part('year', AGE(NOW(), u.date_of_birth)) BETWEEN $2 AND $3
	-- 	AND ST_DWithin(the_geom, 'SRID=4326;POINT(${location.coordinates[0]} ${location.coordinates[1]})', $4 * 1609.34, true)
	-- 	LIMIT 50`