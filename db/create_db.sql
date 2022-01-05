-- USE inclusive_whiteboard;

-- ****************************** --
--            TABLES              --
-- ****************************** --
CREATE TABLE IF NOT EXISTS inclusive_whiteboard.users (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	user VARCHAR(50) NOT NULL,
	password VARCHAR(200) NOT NULL
) AUTO_INCREMENT=1;


CREATE TABLE IF NOT EXISTS inclusive_whiteboard.workflows (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	user_id INT NOT NULL,
	name VARCHAR(30) NOT NULL,
	description VARCHAR(255) NOT NULL,
	creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT FOREIGN KEY fk_workflows_users (user_id) REFERENCES users (id)
) AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS inclusive_whiteboard.sticky_notes (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	user_id INT DEFAULT NULL,
	workflow_id INT DEFAULT NULL,
	status_id VARCHAR(50) NOT NULL,
	html_code VARCHAR(1000) DEFAULT NULL,
    description VARCHAR(255) DEFAULT NULL,
	CONSTRAINT FOREIGN KEY fk_stickynotes_users (user_id) REFERENCES users (id),
	CONSTRAINT FOREIGN KEY fk_stickynotes_workflow (workflow_id) REFERENCES workflows (id)
) AUTO_INCREMENT=1 ;


---- DUMMY USUARIOS 
-- ALTER TABLE inclusive_whiteboard.users AUTO_INCREMENT=1; -- reinicia los ids de usuarios
-- INSERT INTO inclusive_whiteboard.users (user, password) VALUES ("kevin", md5('12345'));
-- INSERT INTO inclusive_whiteboard.users (user, password) VALUES ("madri", md5('12345'));
-- INSERT INTO inclusive_whiteboard.users (user, password) VALUES ("eduardo", md5('12345'));
-- SELECT id, user FROM inclusive_whiteboard.users;

---- DUMMY WORKFLOWS
-- INSERT INTO inclusive_whiteboard.workflows (user_id, name, description) VALUES (1, "Tabla 1", "Proyectos verano");
-- INSERT INTO inclusive_whiteboard.workflows (user_id, name, description) VALUES (1, "Tabla 2", "Proyectos semestre 1 2022");
-- INSERT INTO inclusive_whiteboard.workflows (user_id, name, description) VALUES (1, "Tabla 3", "Proyectos semestre 1 2022");
-- INSERT INTO inclusive_whiteboard.workflows (user_id, name, description) VALUES (1, "Tabla 4", "Proyectos semestre 1 2022");
-- INSERT INTO inclusive_whiteboard.workflows (user_id, name, description) VALUES (1, "Tabla 5", "Proyectos semestre 1 2022");
-- INSERT INTO inclusive_whiteboard.workflows (user_id, name, description) VALUES (1, "Tabla 6", "Proyectos semestre 1 2022");
-- INSERT INTO inclusive_whiteboard.workflows (user_id, name, description) VALUES (1, "Tabla 7", "Proyectos semestre 1 2022");
-- INSERT INTO inclusive_whiteboard.workflows (user_id, name, description) VALUES (1, "Tabla 8", "Proyectos semestre 1 2022");
-- INSERT INTO inclusive_whiteboard.workflows (user_id, name, description) VALUES (1, "Tabla 9", "Proyectos semestre 1 2022");
-- INSERT INTO inclusive_whiteboard.workflows (user_id, name, description) VALUES (1, "Tabla 10", "Proyectos semestre 1 2022");
-- INSERT INTO inclusive_whiteboard.workflows (user_id, name, description) VALUES (1, "Tabla 11", "Proyectos semestre 1 2022");
-- INSERT INTO inclusive_whiteboard.workflows (user_id, name, description) VALUES (1, "Tabla 12", "Proyectos semestre 1 2022");
-- INSERT INTO inclusive_whiteboard.workflows (user_id, name, description) VALUES (2, "WhiteBoard 0", "Semestre 1 2019 - Madri");
-- INSERT INTO inclusive_whiteboard.workflows (user_id, name, description) VALUES (2, "WhiteBoard 1", "Semestre 1 2019 - Madri");
-- INSERT INTO inclusive_whiteboard.workflows (user_id, name, description) VALUES (2, "WhiteBoard 2", "Semestre 2 2019 - Madri");
-- INSERT INTO inclusive_whiteboard.workflows (user_id, name, description) VALUES (3, "WhiteBoard 1", "Semestre 1 2019 - Madri");

-- DUMMY STICKY NOTES
-- INSERT INTO inclusive_whiteboard.sticky_notes (
-- 	user_id,
-- 	workflow_id,
-- 	status,
-- 	description,
-- 	color
-- ) VALUES (1, 1, "In progress", "Texto sticky note", "#4676a3");

  