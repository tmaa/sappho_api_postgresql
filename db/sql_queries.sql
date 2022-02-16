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

CREATE TABLE match( 
	id serial PRIMARY KEY,
	account_id_1 TEXT NOT NULL,
	account_id_2 TEXT NOT NULL,
	created_at timestamp NOT NULL DEFAULT NOW(),
	FOREIGN KEY (account_id_1) REFERENCES account(id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (account_id_2) REFERENCES account(id) ON DELETE CASCADE ON UPDATE CASCADE
)

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


	select table_schema, table_name from information_schema.tables

--CREATE TABLE preference (
--	id serial PRIMARY KEY, 
--	interested_in varchar(10) NOT NULL,
--	minimum_age int NOT NULL DEFAULT 18,
--	maximum_age int NOT NULL DEFAULT 99,
--	maximum_distance int NOT NULL DEFAULT 25,
--	account_id TEXT NOT NULL UNIQUE,
--	FOREIGN KEY (account_id) REFERENCES account(id) ON DELETE CASCADE ON UPDATE CASCADE 
--);

--CREATE TABLE interaction (
--	id serial PRIMARY KEY ,
--	account_id TEXT NOT NULL,
--	target_account_id TEXT NOT NULL,
--	liked boolean NOT NULL,
--	FOREIGN KEY (account_id) REFERENCES account(id) ON DELETE CASCADE ON UPDATE CASCADE,
--	FOREIGN KEY (target_account_id) REFERENCES account(id) ON DELETE CASCADE ON UPDATE CASCADE
--)

--	AND date_part('year', AGE(NOW(), u.date_of_birth)) BETWEEN 18 AND 99
--	AND ST_DWithin(the_geom, 'SRID=4326;POINT(-77.106762 38.881699)', 25 * 1609.34, true)

--DELETE FROM account WHERE name = 'z'

--DO
--$$
--BEGIN
--	FOR i IN 1..2000 loop 
--		WITH insert1 AS (
--		INSERT INTO account(id, name, date_of_birth, gender, email, phone, the_geom, details)
--		SELECT md5(random()::TEXT), 'z', random_date_in_range ('1922-01-01', '2004-01-01'),
--		CASE 
--			WHEN floor(random() * 5 + 1) = 1 THEN 'm' 
--			WHEN floor(random() * 5 + 1) = 2 THEN 'w'
--			WHEN floor(random() * 5 + 1) = 3 THEN 'tm'
--			WHEN floor(random() * 5 + 1) = 4 THEN 'tw'
--			ELSE 'w'
--		END, md5(random()::TEXT), floor(random() * (9999999999-1111111111 + 1) + 11111111111),
--		st_makepoint(-(random()* (77-76 + 1) + 76), (random()* (39-38 + 1) + 38)), md5(random()::text) 
--		RETURNING id
--		)
--		INSERT INTO preferences (interested_in, account_id)
--		SELECT 'w', id
--		FROM insert1;	
--	END LOOP;
--END;
--$$
--;