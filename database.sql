/******************************************************

                .::SLQ code::.

            @author Romain RINGENBACH
            @author Anthony LOHOU

            @date 8/03/2017

            This database represents a digital bullet.


******************************************************/

-- List of application's Users

CREATE TABLE Users(
    id SERIAL PRIMARY KEY,
    password TEXT NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    nickname VARCHAR(50),
    creation_date DATE NOT NULL,
    e_mail TEXT NOT NULL
);

-- List of every created Logs

CREATE TABLE Logs(
    id SERIAL PRIMARY KEY,
    creation_date DATE NOT NULL,
    owner INT NOT NULL,
    privacy BOOLEAN NOT NULL,
    title TEXT NOT NULL,
    CONSTRAINT logs_owners_fk FOREIGN KEY (owner) REFERENCES Users(id)
);

-- Relation User-Logs, manage rigths of Users

CREATE TABLE Logs_Users(
    id_user INT NOT NULL,
    id_log INT NOT NULL,
    writting_rights BOOLEAN NOT NULL,
    adding_date DATE NOT NULL,
    CONSTRAINT logs_users_pk PRIMARY KEY (id_log,id_user),
    CONSTRAINT logs_user_id_fk FOREIGN KEY (id_user) REFERENCES Users(id),
    CONSTRAINT logs_log_id_fk FOREIGN KEY (id_log) REFERENCES Logs(id)
);



-- Different type of Data stored in a log

CREATE TABLE Data(
    id SERIAL NOT NULL,
    log_id INT NOT NULL,
    date DATE NOT NULL,
    CONSTRAINT data_pk PRIMARY KEY (id,log_id),
    CONSTRAINT data_fk FOREIGN KEY (log_id) REFERENCES Logs(id)
);

-- Every data_tables are children of Data

CREATE TABLE DataTexts(
    id INTEGER NOT NULL,
    text TEXT NOT NULL,
    CONSTRAINT datatexts_pk PRIMARY KEY (id),
    CONSTRAINT datatexts_fk FOREIGN KEY (id) REFERENCES Data(id)
);


CREATE TABLE DataBoolean(
    id INTEGER NOT NULL,
    value BOOLEAN NOT NULL,
    CONSTRAINT databoolean_pk PRIMARY KEY (id),
    CONSTRAINT databoolean_fk FOREIGN KEY (id) REFERENCES Data(id)
);

CREATE TABLE DataNumbers(
    id INTEGER NOT NULL,
    value NUMERIC NOT NULL,
    CONSTRAINT datanumbers_pk PRIMARY KEY (id),
    CONSTRAINT datanumbers_fk FOREIGN KEY (id) REFERENCES Data(id)
);

-- Data links

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

CREATE TABLE TypeLinks(
    no SERIAL NOT NULL PRIMARY KEY,
    label TEXT NOT NULL,
);

CREATE TABLE ContentTypeLinks(
    no SERIAL NOT NULL PRIMARY KEY,
    label TEXT NOT NULL,
);

-- Données complexes

CREATE TABLE DataComplexe(
    id INTEGER NOT NULL,
    name TEXT NOT NULL,
    model_id INTEGER NULL,
    CONSTRAINT datacomplexe_pk PRIMARY KEY (id),
    CONSTRAINT datacomplexe_fk FOREIGN KEY (id) REFERENCES Data(id),
    CONSTRAINT datacomplexe_fk2 FOREIGN KEY (model_id) REFERENCES DataModel(id)
);

CREATE TABLE DataModel(
    id INTEGER NOT NULL,
    name TEXT NOT NULL,
    CONSTRAINT datamodel_pk PRIMARY KEY (id),
    CONSTRAINT datamodel_fk FOREIGN KEY (id) REFERENCES Data(id)
);

CREATE TABLE Complexe_Data(
    label TEXT NOT NULL,
    parent INTEGER NOT NULL,
    CONSTRAINT complexedata_pk PRIMARY KEY (label,parent),
    CONSTRAINT complexedata_fk FOREIGN KEY (parent) REFERENCES DataComplexe(id),
    data INTEGER NOT NULL,
    CONSTRAINT complexedata_fk2 FOREIGN KEY (data) REFERENCES Data(id)
);

CREATE TABLE Model_Data(
    label TEXT NOT NULL,
    parent INTEGER NOT NULL,
    data INTEGER NULL,
    CONSTRAINT modeldata_fk2 FOREIGN KEY (data) REFERENCES Data(id)
    CONSTRAINT modeldata_fk FOREIGN KEY (parent) REFERENCES DataComplexe(id),
    CONSTRAINT modeldata_pk UNIQUE (label,parent,data),
);
