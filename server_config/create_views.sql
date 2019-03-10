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
SELECT attributes || jsonb_build_object('feature_type', 'spot_tracker_point') as attributes,
       ST_PointN(wkb_geometry, -1) as wkb_geometry,
        (SELECT feature_type_id FROM ng_adventuresyndicate.feature_type WHERE feature_type='spot_tracker_point') as feature_type_id,
	    0 as layer
FROM ng_adventuresyndicate.tracker_line_strings;