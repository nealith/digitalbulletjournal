/******************************************************

                .::SLQ code::.

            @author Romain RINGENBACH
            @author Anthony LOHOU

            @date 8/03/2017

            This database represents users and theirs logs.


******************************************************/


-- List of application's Users
DROP TABLE IF EXISTS `Users`;
CREATE TABLE Users(
    id SERIAL,
    password TEXT NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    nickname VARCHAR(50),
    creation_date DATE NOT NULL,
    e_mail TEXT NOT NULL
    CONSTRAINT users_pk PRIMARY KEY (id),
);


-- List of every created Logs

DROP TABLE IF EXISTS `Logs`;
CREATE TABLE Logs(
    id SERIAL,
    creation_date DATE NOT NULL,
    owner SERIAL NOT NULL,
    privacy BOOLEAN NOT NULL,
    title TEXT NOT NULL,
    CONSTRAINT logs_pk PRIMARY KEY (id),
    CONSTRAINT logs_owners_fk FOREIGN KEY (owner) REFERENCES Users(id)
);


-- Relation User-Logs, manage rigths of Users

DROP TABLE IF EXISTS `Logs_Users`;
CREATE TABLE Logs_Users(
    id_user SERIAL NOT NULL,
    id_log SERIAL NOT NULL,
    writting_rights BOOLEAN NOT NULL,
    adding_date DATE NOT NULL,
    CONSTRAINT logs_users_pk PRIMARY KEY (id_log,id_user),
    CONSTRAINT logs_user_id_fk FOREIGN KEY (id_user) REFERENCES Users(id),
    CONSTRAINT logs_log_id_fk FOREIGN KEY (id_log) REFERENCES Logs(id)
);

DROP TABLE IF EXISTS `Topics`;
CREATE TABLE Topics(
    id SERIAL,
    title TEXT NOT NULL
    log_id SERIAL NOT NULL,
    CONSTRAINT topic_pk PRIMARY KEY (id),
    CONSTRAINT topic_fk FOREIGN KEY (log_id) REFERENCES Logs(id)
);


-- Different type of Data stored in a log

DROP TABLE IF EXISTS `Data`;
CREATE TABLE Data(
    id SERIAL,
    topic_id SERIAL NOT NULL,
    log_date DATE NOT NULL,
    CONSTRAINT data_pk PRIMARY KEY (id),
    CONSTRAINT data_fk FOREIGN KEY (topic_id) REFERENCES Topics(id)
);


-- Every data_tables are children of Data

DROP TABLE IF EXISTS `DataTexts`;
CREATE TABLE DataTexts(
    id SERIAL NOT NULL,
    text TEXT NOT NULL,
    CONSTRAINT datatexts_pk PRIMARY KEY (id),
    CONSTRAINT datatexts_fk FOREIGN KEY (id) REFERENCES Data(id)
);

-- Every data_tables are children of Data

DROP TABLE IF EXISTS `DataDate`;
CREATE TABLE DataDate(
    id SERIAL NOT NULL,
    date DATE NOT NULL,
    CONSTRAINT datatexts_pk PRIMARY KEY (id),
    CONSTRAINT datatexts_fk FOREIGN KEY (id) REFERENCES Data(id)
);

DROP TABLE IF EXISTS `DataBoolean`;
CREATE TABLE DataBoolean(
    id SERIAL NOT NULL,
    value BOOLEAN NOT NULL,
    CONSTRAINT databoolean_pk PRIMARY KEY (id),
    CONSTRAINT databoolean_fk FOREIGN KEY (id) REFERENCES Data(id)
);

DROP TABLE IF EXISTS `DataNumbers`;
CREATE TABLE DataNumbers(
    id SERIAL NOT NULL,
    value NUMERIC NOT NULL,
    CONSTRAINT datanumbers_pk PRIMARY KEY (id),
    CONSTRAINT datanumbers_fk FOREIGN KEY (id) REFERENCES Data(id)
);


-- Data links

DROP TABLE IF EXISTS `DataLinks`;
CREATE TABLE DataLinks(
    id INTEGER NOT NULL,
    url TEXT NOT NULL,
    type INTEGER NOT NULL,
    contentType INTEGER NOT NULL,
    CONSTRAINT datalinks_pk PRIMARY KEY (id),
    CONSTRAINT datalinks_fk FOREIGN KEY (id) REFERENCES Data(id),
    CONSTRAINT datalinks_fk FOREIGN KEY (type) REFERENCES TypeLinks(no),
    CONSTRAINT datalinks_fk FOREIGN KEY (contentType) REFERENCES ContentTypeLinks(no)
);

DROP TABLE IF EXISTS `TypeLinks`;
CREATE TABLE TypeLinks(
    no SERIAL NOT NULL PRIMARY KEY,
    label TEXT NOT NULL,
);

DROP TABLE IF EXISTS `ContentTypeLinks`;
CREATE TABLE ContentTypeLinks(
    no SERIAL NOT NULL PRIMARY KEY,
    label TEXT NOT NULL,
);

-- Données complexes

DROP TABLE IF EXISTS `DataComplexe`;
CREATE TABLE DataComplexe(
    id INTEGER NOT NULL,
    name TEXT NOT NULL,
    CONSTRAINT datacomplexe_pk PRIMARY KEY (id),
    CONSTRAINT datacomplexe_fk FOREIGN KEY (id) REFERENCES Data(id)
);

DROP TABLE IF EXISTS `DataModel`;
CREATE TABLE DataModel(
    id INTEGER NOT NULL,
    name TEXT NOT NULL,
    CONSTRAINT datamodel_pk PRIMARY KEY (id),
    CONSTRAINT datamodel_fk FOREIGN KEY (id) REFERENCES Data(id)
);

DROP TABLE IF EXISTS `Complexe_Data`;
CREATE TABLE Complexe_Data(
    label TEXT NOT NULL,
    parent INTEGER NOT NULL,
    CONSTRAINT complexedata_pk PRIMARY KEY (label,parent),
    CONSTRAINT complexedata_fk FOREIGN KEY (parent) REFERENCES DataComplexe(id),
    data INTEGER NOT NULL,
    CONSTRAINT complexedata_fk2 FOREIGN KEY (data) REFERENCES Data(id)
);

DROP TABLE IF EXISTS `Model_Data`;
CREATE TABLE Model_Data(
    label TEXT NOT NULL,
    parent INTEGER NOT NULL,
    data INTEGER NULL,
    CONSTRAINT modeldata_fk2 FOREIGN KEY (data) REFERENCES Data(id)
    CONSTRAINT modeldata_fk FOREIGN KEY (parent) REFERENCES DataComplexe(id),
    CONSTRAINT modeldata_pk UNIQUE (label,parent,data),
);
