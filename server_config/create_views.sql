--VIEWS FOR MAP DISPLAYS

DROP VIEW IF EXISTS ng_adventuresyndicate.tracker_line_strings;

CREATE VIEW ng_adventuresyndicate.tracker_line_strings AS
SELECT jsonb_build_object(
                            'km_length',    ROUND((ST_Length(wkb_geometry::geography)/1000)::NUMERIC,2),
                            'name',         spot_tracker_name,
                            'feature_type', 'spot_tracker_line'
                        ) as attributes,
	    wkb_geometry,
	    (SELECT feature_type_id FROM ng_adventuresyndicate.feature_type WHERE feature_type='spot_tracker_line') as feature_type_id,
	    0 as layer

FROM
(
SELECT attributes->>'messengerName' as spot_tracker_name,
	   ST_MakeLine(wkb_geometry ORDER BY attributes->>'message_id') as wkb_geometry
FROM ng_adventuresyndicate.features
GROUP BY attributes->>'messengerName'
) FOO;


DROP VIEW IF EXISTS ng_adventuresyndicate.tracker_points;

CREATE VIEW ng_adventuresyndicate.tracker_points AS
SELECT
	feature_id,
	wkb_geometry,
	attributes || jsonb_build_object('position', ROW_NUMBER() OVER ()) as attributes,
	layer,
	feature_type_id,
	creation_date,
	acl
FROM (
SELECT distinct on(attributes->>'org_name') feature_id,
       wkb_geometry,
	   creation_date,
       attributes || jsonb_build_object( 'dateTime', creation_date, 'distance_km', ROUND((attributes->>'distance')::NUMERIC/1000, 2), 'distance_miles', ROUND((attributes->>'distance')::NUMERIC * 0.000621371, 2)) as attributes,
       layer,
	   feature_type_id,
	   acl
FROM ng_adventuresyndicate.features
WHERE feature_type_id = (SELECT feature_type_id FROM ng_adventuresyndicate.feature_type WHERE feature_type = 'spot_tracker_point')
AND (attributes->>'distance') IS NOT NULL
ORDER BY attributes->>'org_name', (attributes->>'distance')::NUMERIC DESC
) FOO ORDER BY attributes->>'distance_km' DESC;



DROP VIEW IF EXISTS ng_adventuresyndicate.route;
CREATE VIEW ng_adventuresyndicate.route AS
SELECT  feature_id,
        wkb_geometry,
        attributes
        layer
FROM ng_adventuresyndicate.features
WHERE attributes @> jsonb_build_object('route_name',(SELECT json->>'route_name' FROM ng_adventuresyndicate.application_parameter WHERE name = 'active_route'));