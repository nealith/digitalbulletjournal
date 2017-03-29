BEGIN TRANSACTION

INSERT INTO Data(topic_none_id)
INSERT INTO DataModel(
    (SELECT MAX(id)
    FROM Data,Topics,Logs
    WHERE Data.topic_id = Topics.id
    AND Topics.log_id = Logs.id
    AND Topics.title = 'none'
    AND Logs.title = 'log_title';)
      ,"Tâche");

INSERT INTO Data(topic_none_id)
INSERT INTO DataTexts (
    (SELECT MAX(id)
    FROM Data,Topics,Logs
    WHERE Data.topic_id = Topics.id
    AND Topics.log_id = Logs.id
    AND Topics.title = 'none'
    AND Logs.title = 'log_title';)
      ,"À faire");

INSERT INTO Data(topic_none_id)
INSERT INTO DataTexts (
    (SELECT MAX(id)
    FROM Data,Topics,Logs
    WHERE Data.topic_id = Topics.id
    AND Topics.log_id = Logs.id
    AND Topics.title = 'none'
    AND Logs.title = 'log_title';)
      ,"Planifiée");

INSERT INTO Data(topic_none_id)
INSERT INTO DataTexts (
    (SELECT MAX(id)
    FROM Data,Topics,Logs
    WHERE Data.topic_id = Topics.id
    AND Topics.log_id = Logs.id
    AND Topics.title = 'none'
    AND Logs.title = 'log_title';)
      ,"Reportée");

INSERT INTO Data(topic_none_id)
INSERT INTO DataTexts (
    (SELECT MAX(id)
    FROM Data,Topics,Logs
    WHERE Data.topic_id = Topics.id
    AND Topics.log_id = Logs.id
    AND Topics.title = 'none'
    AND Logs.title = 'log_title';)
      ,"Faite");

INSERT INTO Data(topic_none_id)
INSERT INTO DataTexts (
    (SELECT MAX(id)
    FROM Data,Topics,Logs
    WHERE Data.topic_id = Topics.id
    AND Topics.log_id = Logs.id
    AND Topics.title = 'none'
    AND Logs.title = 'log_title';)
      ,"Annulée");

INSERT INTO Data(topic_none_id)
INSERT INTO DataBoolean (TRUE);



END TRANSACTION
