--This report pulls the data required to create the leaderboard

DELETE FROM ng_adventuresyndicate.reports WHERE report_name = 'leaderboard';


INSERT INTO ng_adventuresyndicate.reports(report_name, report_query, report_attributes)
VALUES(
'leaderboard',
$SQL$

    SELECT  json_agg(
    	json_build_object(	'position', 		attributes->>'position',
    						'org_name', 		attributes->>'org_name',
    						'distance_miles', 	attributes->>'distance_miles',
    						'distance_km',		attributes->>'distance_km',
    						'date', 			to_char((attributes->>'dateTime')::TIMESTAMP, 'DD/MM/YYYY HH24:MM'),
    						'category', 		COALESCE(attributes->>'category', 'school')

    					))

   FROM ng_adventuresyndicate.tracker_points
   WHERE WHERE_CLAUSE

$SQL$,
    json_build_object('user_type', json_build_array('registered','administrator','public'))
);