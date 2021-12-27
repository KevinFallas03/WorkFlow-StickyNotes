-- USE inclusive_whiteboard;

-- ****************************** --
--            TABLES              --
-- ****************************** --

CREATE SCHEMA IF NOT EXISTS `inclusive_whiteboard1` ;

CREATE TABLE IF NOT EXISTS inclusive_whiteboard.users (
  id_user INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	user VARCHAR(50) NOT NULL,
	password VARCHAR(200) NOT NULL
)AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS inclusive_whiteboard.workflows (
	id_workflow INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	id_user INT(11) NOT NULL,
	workflow_name VARCHAR(30) NOT NULL,
	workflow_description VARCHAR(255) NOT NULL,
	creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT FOREIGN KEY fk_workflows_users (id_user) REFERENCES users (id_user)
)AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS inclusive_whiteboard.sticky_notes (
	id_sticky_note INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	id_user INT(11) DEFAULT NULL,
	id_workflow INT(11) DEFAULT NULL,
	status INT(1) NOT NULL,
	description VARCHAR(255) DEFAULT NULL,
	color VARCHAR(7) DEFAULT NULL,
	CONSTRAINT FOREIGN KEY fk_stickynotes_users (id_user) REFERENCES users (id_user),
	CONSTRAINT FOREIGN KEY fk_stickynotes_workflow (id_workflow) REFERENCES workflows (id_workflow)
)AUTO_INCREMENT=1;




