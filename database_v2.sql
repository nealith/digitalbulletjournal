/******************************************************

                .::SLQ code::.

            @author Romain RINGENBACH
            @author Anthony LOHOU

            @date 29/03/2017

            This database represents users and theirs logs.


******************************************************/


-- List of application's Users
DROP TABLE IF EXISTS `Users`;
CREATE TABLE Users(
    id SERIAL AUTO_INCREMENT,
    password VARCHAR(64) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    nick_name VARCHAR(50),
    creation_date TIMESTAMP NOT NULL, --DEFAULT CURRENT_TIMESTAMP
    e_mail VARCHAR(50) UNIQUE,
    CONSTRAINT users_pk PRIMARY KEY (id),
);


-- List of every created Logs

DROP TABLE IF EXISTS `Logs`;
CREATE TABLE Logs(
    id SERIAL AUTO_INCREMENT,
    creation_date TIMESTAMP NOT NULL, --DEFAULT CURRENT_TIMESTAMP
    owner VARCHAR(64) NOT NULL,
    privacy BOOLEAN NOT NULL,
    title VARCHAR(50) NOT NULL,
    CONSTRAINT logs_pk PRIMARY KEY (id),
    CONSTRAINT logs_owners_fk FOREIGN KEY (owner) REFERENCES Users(e_mail)
);


-- Relation User-Logs, manage rigths of Users

DROP TABLE IF EXISTS `Logs_Users`;
CREATE TABLE Logs_Users(
    user SERIAL NOT NULL,
    log SERIAL NOT NULL,
    writting_rights BOOLEAN NOT NULL,
    admin_rights BOOLEAN NOT NULL,
    adding_date TIMESTAMP NOT NULL, --DEFAULT CURRENT_TIMESTAMP
    CONSTRAINT logs_users_pk PRIMARY KEY (id_log,id_user),
    CONSTRAINT logs_user_id_fk FOREIGN KEY (id_user) REFERENCES Users(id),
    CONSTRAINT logs_log_id_fk FOREIGN KEY (id_log) REFERENCES Logs(id)
);

DROP TABLE IF EXISTS `Topics`;
CREATE TABLE Topics(
    id SERIAL AUTO_INCREMENT,
    title VARCHAR(64) NOT NULL
    log_id SERIAL NOT NULL,
    CONSTRAINT topic_pk PRIMARY KEY (id),
    CONSTRAINT topic_fk FOREIGN KEY (log_id) REFERENCES Logs(id)
);


-- Different type of Data stored in a log

DROP TABLE IF EXISTS `Data`;
CREATE TABLE Data(
    id VARCHAR(64),
    topic SERIAL NOT NULL,
    user VARCHAR(64) NOT NULL,
    log_datetime TIMESTAMP NOT NULL, --DEFAULT CURRENT_TIMESTAMP
    CONSTRAINT data_pk PRIMARY KEY (id),
    CONSTRAINT data_fk FOREIGN KEY (topic_id) REFERENCES Topics(id)
);


-- Every data_tables are children of Data

DROP TABLE IF EXISTS `DataTexts`;
CREATE TABLE DataTexts(
    id SERIAL,
    text VARCHAR(1000) NOT NULL,
    CONSTRAINT datatexts_pk PRIMARY KEY (id),
    CONSTRAINT datatexts_fk FOREIGN KEY (id) REFERENCES Data(id)
);

-- Every data_tables are children of Data

DROP TABLE IF EXISTS `DataDate`;
CREATE TABLE DataDate(
    id SERIAL,
    date DATE NOT NULL,
    CONSTRAINT datatexts_pk PRIMARY KEY (id),
    CONSTRAINT datatexts_fk FOREIGN KEY (id) REFERENCES Data(id)
);

-- Every data_boolean are children of Data

DROP TABLE IF EXISTS `DataBoolean`;
CREATE TABLE DataBoolean(
    id SERIAL,
    value BOOLEAN NOT NULL,
    CONSTRAINT databoolean_pk PRIMARY KEY (id),
    CONSTRAINT databoolean_fk FOREIGN KEY (id) REFERENCES Data(id)
);

-- Every data_numbers are children of Data

DROP TABLE IF EXISTS `DataNumbers`;
CREATE TABLE DataNumbers(
    id SERIAL,
    value NUMERIC NOT NULL,
    CONSTRAINT datanumbers_pk PRIMARY KEY (id),
    CONSTRAINT datanumbers_fk FOREIGN KEY (id) REFERENCES Data(id)
);


-- Every data_links are children of Data

DROP TABLE IF EXISTS `DataLinks`;
CREATE TABLE DataLinks(
    id SERIAL,
    url VARCHAR(64) NOT NULL,
    type INTEGER NOT NULL,
    contentType INTEGER NOT NULL,
    CONSTRAINT datalinks_pk PRIMARY KEY (id),
    CONSTRAINT datalinks_fk FOREIGN KEY (id) REFERENCES Data(id),
    CONSTRAINT datalinks_fk FOREIGN KEY (type) REFERENCES TypeLinks(no),
    CONSTRAINT datalinks_fk FOREIGN KEY (contentType) REFERENCES ContentTypeLinks(no)
);

DROP TABLE IF EXISTS `TypeLinks`;
CREATE TABLE TypeLinks(
    no INTEGER NOT NULL PRIMARY KEY,
    label VARCHAR(64) NOT NULL,
);

DROP TABLE IF EXISTS `ContentTypeLinks`;
CREATE TABLE ContentTypeLinks(
    no INTEGER NOT NULL PRIMARY KEY,
    label VARCHAR(64) NOT NULL,
);

-- Données complexes

DROP TABLE IF EXISTS `DataComplexe`;
CREATE TABLE DataComplexe(
    id SERIAL,
    name VARCHAR(64) NOT NULL,
    CONSTRAINT datacomplexe_pk PRIMARY KEY (id),
    CONSTRAINT datacomplexe_fk FOREIGN KEY (id) REFERENCES Data(id)
);

DROP TABLE IF EXISTS `DataModel`;
CREATE TABLE DataModel(
    id SERIAL,
    name VARCHAR(64) NOT NULL,
    CONSTRAINT datamodel_pk PRIMARY KEY (id),
    CONSTRAINT datamodel_fk FOREIGN KEY (id) REFERENCES Data(id)
);

DROP TABLE IF EXISTS `Complexe_Data`;
CREATE TABLE Complexe_Data(
    label VARCHAR(64) NOT NULL,
    parent INTEGER NOT NULL,
    CONSTRAINT complexedata_pk PRIMARY KEY (label,parent),
    CONSTRAINT complexedata_fk FOREIGN KEY (parent) REFERENCES DataComplexe(id),
    data INTEGER NOT NULL,
    CONSTRAINT complexedata_fk2 FOREIGN KEY (data) REFERENCES Data(id)
);

DROP TABLE IF EXISTS `Model_Data`;
CREATE TABLE Model_Data(
    label VARCHAR(64) NOT NULL,
    parent INTEGER NOT NULL,
    data INTEGER NULL,
    CONSTRAINT modeldata_fk2 FOREIGN KEY (data) REFERENCES Data(id)
    CONSTRAINT modeldata_fk FOREIGN KEY (parent) REFERENCES DataComplexe(id),
    CONSTRAINT modeldata_pk UNIQUE (label,parent,data),
);
