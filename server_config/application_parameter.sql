DELETE FROM ng_adventuresyndicate.application_parameter;

INSERT INTO ng_adventuresyndicate.application_parameter(name,json)
VALUES('active_route', json_build_object('route_name', 'Adventure Syndicate LEJOG'));

