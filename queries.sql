-- Créer un utilisateur

INSERT INTO Users (id,password,first_name,last_name,nick_name,creation_date,e_mail)
VALUES (?,?,?,?,?,?,?); -- id,password,first_name,last_name,nick_name,creation_date,e_mail

-- Supprimer un utilisateur
DELETE FROM Users WHERE id=?;

-- Modifier un utilisateur
--  Changer l'e-mail

UPDATE Users SET e_mail=? WHERE id=?;

--  Changer le mot de passe

UPDATE Users SET password=? WHERE id=?;

--  Changer Nom

UPDATE Users SET last_name=? WHERE id=?;

--  Changer Prénom

UPDATE Users SET first_name=? WHERE id=?;

--  Changer surnom

UPDATE Users SET nick_name=? WHERE id=?;

-- Accèder à utilisateur

SELECT * FROM Users WHERE id=?;


-- Créer un journal

INSERT INTO Logs (id,title,owner,creation_date,privacy)
VALUES (?,?,?,?,?);

-- Supprimer un journal

DELETE FROM Logs WHERE id=?;

-- Modifier un journal
--  Changer le titre

UPDATE Logs SET title=? WHERE id=?;

--  Changer le niveau de confidencialité

UPDATE Logs SET privacy=? WHERE id=?;

-- Accèder à un journal

SELECT * FROM Logs WHERE id=?;

-- Trigger : titre unique pour l'utilisateur --> laisser à l'api

SELECT title FROM Logs WHERE owner=? AND title=?;

-- Créer un topic

INSERT INTO Topics (id,title,log)
VALUES (?,?,?);

-- Supprimer un topic

DELETE FROM Topics WHERE id=?;

-- Modifier un topic
--  Changer le titre

UPDATE Topics SET title=? WHERE id=?;

-- Accèder à un topic

SELECT * FROM Topics WHERE id=?;

-- Trigger : titre unique pour le journal --> laisser à l'api

SELECT title FROM Topics WHERE log=? AND title=?;

-- Partager un journal avec un utilisateur

INSERT INTO Logs_Users (user, log, writting_rights, admin_rights, adding_date)
VALUES (?,?,?,?,?);

-- Modifier les droits de partages
--  Changer le droit d'administration

UPDATE Logs_Users SET writting_rights=? WHERE user=? AND log=?;

--  Changer le droit d'écriture

UPDATE Logs_Users SET admin_rights=? WHERE user=? AND log=?;

-- Retirer un utilisateur d'un journal

DELETE FROM Logs_Users WHERE user=? AND log=?;

-- Accèder aux droits de partages

SELECT title FROM Topics WHERE user=? AND log=?;


-- Créer une donnée
INSERT INTO Data (id,log_datetime,topic,user)
VALUES (?,?,?,?);
-- Supprimer une donnée
DELETE FROM Data WHERE id=?;

-- Créer une donnée texte
INSERT INTO DataTexts (id,text)
VALUES (?,?);
-- Supprimer une donnée texte
DELETE FROM DataTexts WHERE id=?;
-- Modifier une donnée texte
UPDATE DataTexts SET text=? WHERE id=?;
-- Accèder à une donnée texte
SELECT * FROM DataTexts WHERE id=?;

-- Créer une donnée date
INSERT INTO DataDates (id,datetime)
VALUES (?,?);
-- Supprimer une donnée date
DELETE FROM DataDates WHERE id=?;
-- Modifier une donnée date
UPDATE DataDates SET datetime=? WHERE id=?;
-- Accèder à une donnée data
SELECT * FROM DataDates WHERE id=?;

-- Créer une donnée boolean
INSERT INTO DataBooleans (id,value)
VALUES (?,?);
-- Supprimer une donnée boolean
DELETE FROM DataBooleans WHERE id=?;
-- Modifier une donnée boolean
UPDATE DataBooleans SET value=? WHERE id=?;
-- Accèder à une donnée boolean
SELECT * FROM DataBooleans WHERE id=?;

-- Créer une donnée nombre
INSERT INTO DataNumbers (id,value)
VALUES (?,?);
-- Supprimer une donnée nombre
DELETE FROM DataNumbers WHERE id=?;
-- Modifier une donnée nombre
UPDATE DataNumbers SET value=? WHERE id=?;
-- Accèder à une donnée nombre
SELECT * FROM DataNumbers WHERE id=?;

-- Créer une donnée lien
INSERT INTO DataLinks (id,link,content_type,type)
VALUES (?,?,?,?);
-- Supprimer une donnée lien
DELETE FROM DataLinks WHERE id=?;
-- Modifier une donnée lien
UPDATE DataLinks SET link=? WHERE id=?;
UPDATE DataLinks SET content_type=? WHERE id=?;
UPDATE DataLinks SET type=? WHERE id=?;
-- Accèder à une donnée lien
SELECT * FROM DataLinks WHERE id=?;

-- Créer un type de lien
INSERT INTO TypeLinks (no,label)
VALUES (?,?);
-- Supprimer un type de lien
DELETE FROM TypeLinks WHERE no=?;

-- Créer un type de contenu
INSERT INTO ContentTypeLinks (no,label)
VALUES (?,?);
-- Supprimer un type de contenu
DELETE FROM ContentTypeLinks WHERE no=?;


-- Créer une donnée complexe
INSERT INTO DataComplexes (id,name,model_id)
VALUES (?,?,?);
-- Supprimer une donnée complexe
DELETE FROM DataComplexes WHERE id=?;
-- Modifier une donnée complexe
UPDATE DataComplexes SET name=? WHERE id=?;
-- Accèder à une donnée complexe
SELECT * FROM DataComplexes WHERE id=?;

-- Créer une donnée modèle
INSERT INTO DataModels (id,name)
VALUES (?,?);
-- Supprimer une donnée modèle
DELETE FROM DataModels WHERE id=?;
-- Modifier une donnée modèle
UPDATE DataModels SET name=? WHERE id=?;
-- Accèder à une donnée modèle
SELECT * FROM DataModels WHERE id=?;

-- Créer une relation de donnée complexe
INSERT INTO Complexes_Data (data,label,parent)
VALUES (?,?,?);
-- Supprimer une relation de donnée complexe
DELETE FROM Complexes_Data WHERE parent=? AND label=?;
-- Modifier une donnée relation de donnée complexe:
UPDATE Complexes_Data SET data=? WHERE parent=? AND label=?;
-- Accèder à l'id sous donnée
SELECT data FROM Complexes_Data WHERE parent=? AND label=?;

-- Créer une relation de donnée modèle
INSERT INTO Models_Data (data,label,parent)
VALUES (?,?,?);
-- Supprimer une relation de donnée modèle
DELETE FROM Models_Data WHERE parent=? AND label=? AND data=?;
-- Lister les id des sous donnée d'un label
SELECT data FROM Models_Data WHERE parent=? AND label=?;
