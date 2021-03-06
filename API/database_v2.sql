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
    id VARCHAR(64) NOT NULL,
    password VARCHAR(64) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    nick_name VARCHAR(50),
    creation_date TIMESTAMP NOT NULL, --DEFAULT CURRENT_TIMESTAMP
    e_mail VARCHAR(50) UNIQUE,
    CONSTRAINT users_pk PRIMARY KEY (id)
);


-- List of every created Logs

DROP TABLE IF EXISTS `Logs`;
CREATE TABLE Logs(
    id VARCHAR(64) NOT NULL,
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
    user VARCHAR(64) NOT NULL,
    log VARCHAR(64) NOT NULL,
    writting_rights BOOLEAN NOT NULL,
    admin_rights BOOLEAN NOT NULL,
    adding_date TIMESTAMP NOT NULL, --DEFAULT CURRENT_TIMESTAMP
    CONSTRAINT logs_users_pk PRIMARY KEY (log,user),
    CONSTRAINT logs_user_id_fk FOREIGN KEY (user) REFERENCES Users(id),
    CONSTRAINT logs_log_id_fk FOREIGN KEY (log) REFERENCES Logs(id)
);

DROP TABLE IF EXISTS `Topics`;
CREATE TABLE Topics(
    id VARCHAR(64) NOT NULL,
    title VARCHAR(64) NOT NULL,
    log SERIAL NOT NULL,
    creation_date TIMESTAMP NOT NULL, --DEFAULT CURRENT_TIMESTAMP
    CONSTRAINT topic_pk PRIMARY KEY (id),
    CONSTRAINT topic_fk FOREIGN KEY (log) REFERENCES Logs(id)
);


-- Different type of Data stored in a log

DROP TABLE IF EXISTS `Data`;
CREATE TABLE Data(
    id VARCHAR(64) NOT NULL,
    topic SERIAL NOT NULL,
    user VARCHAR(64) NOT NULL,
    type VARCHAR(10) NOT NULL,
    log_datetime TIMESTAMP NOT NULL, --DEFAULT CURRENT_TIMESTAMP
    CONSTRAINT data_pk PRIMARY KEY (id),
    CONSTRAINT data_fk FOREIGN KEY (topic) REFERENCES Topics(id)
    CONSTRAINT data_fk2 FOREIGN KEY (user) REFERENCES Users(id)

);

-- Value of type : Text,Date,Boolean,Number,Compound,Model

-- Every data_tables are children of Data

DROP TABLE IF EXISTS `DataTexts`;
CREATE TABLE DataTexts(
    id VARCHAR(64) NOT NULL,
    value VARCHAR(1000) NOT NULL,
    CONSTRAINT datatexts_pk PRIMARY KEY (id),
    CONSTRAINT datatexts_fk FOREIGN KEY (id) REFERENCES Data(id)
);

-- Every data_tables are children of Data

DROP TABLE IF EXISTS `DataDates`;
CREATE TABLE DataDates(
    id VARCHAR(64) NOT NULL,
    value DATE NOT NULL,
    CONSTRAINT datatexts_pk PRIMARY KEY (id),
    CONSTRAINT datatexts_fk FOREIGN KEY (id) REFERENCES Data(id)
);

-- Every data_boolean are children of Data

DROP TABLE IF EXISTS `DataBooleans`;
CREATE TABLE DataBooleans(
    id VARCHAR(64) NOT NULL,
    value BOOLEAN NOT NULL,
    CONSTRAINT databoolean_pk PRIMARY KEY (id),
    CONSTRAINT databoolean_fk FOREIGN KEY (id) REFERENCES Data(id)
);

-- Every data_numbers are children of Data

DROP TABLE IF EXISTS `DataNumbers`;
CREATE TABLE DataNumbers(
    id VARCHAR(64) NOT NULL,
    value NUMERIC NOT NULL,
    CONSTRAINT datanumbers_pk PRIMARY KEY (id),
    CONSTRAINT datanumbers_fk FOREIGN KEY (id) REFERENCES Data(id)
);

-- Données composées

DROP TABLE IF EXISTS `DataCompounds`;
CREATE TABLE DataCompounds(
    id VARCHAR(64) NOT NULL,
    model VARCHAR(64),
    CONSTRAINT datacomplexe_pk PRIMARY KEY (id),
    CONSTRAINT datacomplexe_fk FOREIGN KEY (id) REFERENCES Data(id)
    CONSTRAINT datacomplexe_fk2 FOREIGN KEY (model) REFERENCES DataModels(id)
);

DROP TABLE IF EXISTS `DataModels`;
CREATE TABLE DataModels(
    id VARCHAR(64) NOT NULL,
    CONSTRAINT datamodel_pk PRIMARY KEY (id),
    CONSTRAINT datamodel_fk FOREIGN KEY (id) REFERENCES Data(id)
);

DROP TABLE IF EXISTS `Compounds_Data`;
CREATE TABLE Compounds_Data(
    label VARCHAR(64) NOT NULL,
    parent VARCHAR(64) NOT NULL,
    data VARCHAR(64) NOT NULL,
    CONSTRAINT compounddata_pk PRIMARY KEY (label,parent),
    CONSTRAINT compounddata_fk FOREIGN KEY (parent) REFERENCES DataCompound(id),
    CONSTRAINT compounddata_fk2 FOREIGN KEY (data) REFERENCES Data(id)
);

DROP TABLE IF EXISTS `Models_Data`;
CREATE TABLE Models_Data(
    label VARCHAR(64) NOT NULL,
    parent VARCHAR(64) NOT NULL,
    data VARCHAR(64) NULL,
    CONSTRAINT modeldata_fk2 FOREIGN KEY (data) REFERENCES Data(id)
    CONSTRAINT modeldata_fk FOREIGN KEY (parent) REFERENCES DataCompound(id),
    CONSTRAINT modeldata_pk UNIQUE (label,parent,data)
);

INSERT INTO Users (id,password,first_name,last_name,nick_name,creation_date,e_mail)
VALUES ("root","root","root","root","root",0,"root");

INSERT INTO Logs (id,title,owner,creation_date,privacy)
VALUES ("root_log","root_log","root",0,1);

INSERT INTO Topics (id,title,log,creation_date)
VALUES ("root_topic","root_topic","root_log",0);

INSERT INTO Data (id,log_datetime,topic,user,type)
VALUES ("Text",0,"root_topic","root","None");

INSERT INTO Data (id,log_datetime,topic,user,type)
VALUES ("Date",0,"root_topic","root","None");

INSERT INTO Data (id,log_datetime,topic,user,type)
VALUES ("Boolean",0,"root_topic","root","None");

INSERT INTO Data (id,log_datetime,topic,user,type)
VALUES ("Number",0,"root_topic","root","None");

INSERT INTO Data (id,log_datetime,topic,user,type)
VALUES ("Compound",0,"root_topic","root","None");

INSERT INTO Data (id,log_datetime,topic,user,type)
VALUES ("Model",0,"root_topic","root","None");
