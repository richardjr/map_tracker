DELETE FROM ng_adventuresyndicate.json_store;

INSERT INTO ng_adventuresyndicate.json_store(json_data)
VALUES(jsonb_build_object('org_id', 'ST01', 'org_name', 'Adventure Syndicate')),
(jsonb_build_object('org_id', 'ORG01', 'org_name', 'Organisation 1', 'category', 'School'));