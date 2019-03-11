DO
$$
DECLARE
    ret_var JSON;
BEGIN
    SELECT ng_rest.add_feature('ng_adventuresyndicate',
						  json_build_object('attributes', json_build_object('feature_type', 'distance_record', 'org_name', 'school foo', 'distance', 1000))) into ret_var;

    RAISE NOTICE '%',ret_var;
END;
$$ LANGUAGE PLPGSQL;