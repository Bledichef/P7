-- SQLite
CREATE TABLE Users (
  id int(11) NOT NULL,
  firstname varchar(255) NOT NULL,
  lastname varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  password varchar(255) NOT NULL,
  job varchar(255) DEFAULT NULL,
  isadmin tinyint(1) NOT NULL DEFAULT 0,
  createdAt datetime NOT NULL,
  updatedAt datetime NOT NULL
) ;