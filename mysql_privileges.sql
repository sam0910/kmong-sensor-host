CREATE USER 'root'@'%' IDENTIFIED BY 'thermal1215@R';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'thermal1215@R';
ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'thermal1215@R';
FLUSH PRIVILEGES;
QUIT