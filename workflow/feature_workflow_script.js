CREATE OR REPLACE FUNCTION ng_adventuresyndicate.feature_workflow(schema_param TEXT, payload_param JSON) RETURNS JSON AS
$$

plv8.elog(NOTICE, 'ADVENTURE SYNDICATE FEATURE WORKFLOW ' + JSON.stringify(payload_param));


/** When an organisation adds a mileage we create a new marker point along the route line so you can see a virtual journey and history **/

/**
 * TODO we need to check for a valid code
 * TODO move route name into a parameter so this can become generic
 * **/

var active_route = plv8.execute("SELECT json->>'route_name' as route_name FROM ng_adventuresyndicate.application_parameter WHERE name = 'active_route'")[0].route_name;

plv8.elog(NOTICE, 'ACTIVE ROUTE '+ active_route);

/** Check they are a valid ORG **/

var org_check = plv8.execute("SELECT json_data FROM json_store WHERE json_data @> jsonb_build_object('org_id', upper($1)) LIMIT 1", [payload_param.new.attributes.org_id])[0];

if(org_check.json_data === undefined) {

    return {error : 'unrecognised org_id', org_id : payload_param.new.attributes.org_};
}


if(payload_param.operation === 'INSERT' && payload_param.feature_type.feature_type === 'distance_record') {

    plv8.elog(NOTICE, 'NEW DISTANCE RECORD FOR ORG ID ' + payload_param.new.attributes.org_id);

    /** First find their last mileage record **/

    var last_distance = plv8.execute("SELECT attributes::JSON as attributes FROM features WHERE attributes @> jsonb_build_object('feature_type', 'spot_tracker_point', 'org_id', $1) ORDER BY feature_id DESC LIMIT 1", [org_check.json_data.org_id])[0];

    var point,new_distance;

    /** This must be the first record **/
    if(last_distance === undefined) {
        plv8.elog(NOTICE, 'FIRST DISTANCE RECORD');
        new_distance = payload_param.new.attributes.distance;
        point = plv8.execute("SELECT ST_ASEWKT(ng_adventuresyndicate.point_along_route($1, $2::NUMERIC)) as ewkt",
                              [active_route, payload_param.new.attributes.distance])[0];
    } else {
        /** Add new distance onto the last one **/
        plv8.elog(NOTICE, 'CONTINUED DISTANCE RECORD');
        new_distance  = last_distance.attributes.distance + payload_param.new.attributes.distance;
        point = plv8.execute("SELECT ST_ASEWKT(ng_adventuresyndicate.point_along_route($1, $2::NUMERIC)) as ewkt",
                              [active_route, new_distance])[0];
    }


    /** Create a new feature  which will be picked up by the views **/
    var feature = plv8.execute("SELECT ng_rest.add_feature('ng_adventuresyndicate', $1::JSON) as ret",[
        {
            geometry: point.ewkt,
            attributes: {
                feature_type: 'spot_tracker_point',
                distance: new_distance,
                messengerName: org_check.json_data.org_name,
                org_name: org_check.json_data.org_name,
                org_id: org_check.json_data.org_id,
                category: org_check.json_data.category,
                point_type : 'derived',
                org_rider : payload_param.new.attributes.org_rider !== undefined ? payload_param.new.attributes.org_rider : org_check.json_data.org_name + ' total'
            }
        }
    ]);

    return feature;
}

/** When a SPOT tracker marker is added we calculate distance along route and add to marker **/

if(payload_param.operation === 'INSERT' && payload_param.feature_type.feature_type === 'spot_tracker_point' && payload_param.new.attributes.distance === undefined) {

    var distance  = plv8.execute("SELECT ng_adventuresyndicate.distance_along_route($1,$2::GEOMETRY) as metres", [active_route, payload_param.new.wkb_geometry])[0];

    plv8.elog(NOTICE, JSON.stringify(distance));

    if(distance.metres !== undefined) {

        var update = plv8.execute("UPDATE features SET attributes = attributes || jsonb_build_object('distance', $1, 'org_name', $2 ) WHERE feature_id = $3", [distance.metres, org_check.json_data.org_name, payload_param.new.feature_id]);
    }

    return update;

}

$$ LANGUAGE PLV8;