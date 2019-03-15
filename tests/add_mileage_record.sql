DO
$$
DECLARE
    ret_var JSON;
BEGIN
    DELETE FROM features where feature_id >= 822926;

    SELECT ng_rest.add_feature('ng_adventuresyndicate',
						  json_build_object('attributes', json_build_object('feature_type', 'distance_record', 'org_name', 'school foo', 'distance', 1000, 'org_id', 'ORG01', 'org_rider', 'Dave Barter'))) into ret_var;

    RAISE NOTICE '%',ret_var;
END;
$$ LANGUAGE PLPGSQL;