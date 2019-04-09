DELETE FROM ng_adventuresyndicate.application_parameter;

INSERT INTO ng_adventuresyndicate.application_parameter(name,json)
VALUES('active_route', json_build_object('route_name', 'Adventure Syndicate LEJOG'));

DELETE FROM ng_adventuresyndicate.application_parameter WHERE name = 'table_descriptors';

INSERT INTO ng_adventuresyndicate.application_parameter(name, json) VALUES (
    'table_descriptors',
    jsonb_build_object(

        'tracker_points', jsonb_build_object(
             'attributes', 'jsonb'
        )
    )
);