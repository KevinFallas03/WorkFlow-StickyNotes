-- USE inclusive_whiteboard;

-- ****************************** --
--            TABLES              --
-- ****************************** --
CREATE TABLE IF NOT EXISTS inclusive_whiteboard.users (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	user VARCHAR(50) NOT NULL,
	password VARCHAR(200) NOT NULL
) AUTO_INCREMENT=1;


-- ALTER TABLE inclusive_whiteboard.users AUTO_INCREMENT=1;
-- INSERT INTO inclusive_whiteboard.users (user, password) VALUES ("kevin", "1234");
-- INSERT INTO inclusive_whiteboard.users (user, password) VALUES ("andres", "1234");
-- SELECT id, user FROM inclusive_whiteboard.users;

CREATE TABLE IF NOT EXISTS inclusive_whiteboard.workflows (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	user_id INT NOT NULL,
	name VARCHAR(30) NOT NULL,
	description VARCHAR(255) NOT NULL,
	creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT FOREIGN KEY fk_workflows_users (user_id) REFERENCES users (id)
) AUTO_INCREMENT=1;

-- INSERT INTO inclusive_whiteboard.workflows (user_id, name, description) VALUES (1, "Tabla 1", "Proyectos verano");
-- INSERT INTO inclusive_whiteboard.workflows (user_id, name, description) VALUES (1, "Tabla 2", "Proyectos semestre 1 2022");
-- INSERT INTO inclusive_whiteboard.workflows (user_id, name, description) VALUES (2, "1234", "Semestre 1 2019");

-- SELECT id, user_id, name, description, creation_date FROM inclusive_whiteboard.workflows WHERE user_id = 2;

CREATE TABLE IF NOT EXISTS inclusive_whiteboard.sticky_notes (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	user_id INT DEFAULT NULL,
	workflow_id INT DEFAULT NULL,
	status VARCHAR(50) NOT NULL,
	description VARCHAR(255) DEFAULT NULL,
	color VARCHAR(7) DEFAULT NULL,
	CONSTRAINT FOREIGN KEY fk_stickynotes_users (user_id) REFERENCES users (id),
	CONSTRAINT FOREIGN KEY fk_stickynotes_workflow (workflow_id) REFERENCES workflows (id)
) AUTO_INCREMENT=1 ;
  
-- INSERT INTO inclusive_whiteboard.sticky_notes (
-- 	user_id,
-- 	workflow_id,
-- 	status,
-- 	description,
-- 	color
-- ) VALUES (1, 1, "In progress", "Texto sticky note", "#4676a3");

  