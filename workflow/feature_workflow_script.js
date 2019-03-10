CREATE OR REPLACE FUNCTION ng_adventuresyndicate.feature_workflow(schema_param TEXT, payload_param JSON) RETURNS JSON AS
$$

plv8.elog(NOTICE, 'ADVENTURE SYNDICATE FEATURE WORKFLOW ' + JSON.stringify(payload_param));


/** When an organisation adds a mileage we create a new marker point along the route line so you can see a virtual journey and history **/

if(payload_param.operation === 'INSERT' && payload_param.feature_type.feature_type === 'distance_record') {

    plv8.elog(NOTICE, 'NEW DISTANCE RECORD');

    /** First find their last mileage record **/

    var last_distance = plv8.execute("SELECT attributes::JSON as attributes FROM features WHERE attributes @> jsonb_build_object('feature_type', 'spot_tracker_point', 'org_name', $1) ORDER BY feature_id DESC LIMIT 1", [payload_param.new.attributes.org_name])[0];

    var point,new_distance;


    /** This must be the first record **/
    if(last_distance === undefined) {
        plv8.elog(NOTICE, 'FIRST DISTANCE RECORD');
        new_distance = payload_param.new.attributes.distance;
        point = plv8.execute("SELECT ST_ASEWKT(ng_adventuresyndicate.point_along_route('Adventure Syndicate LEJOG', $1::NUMERIC)) as ewkt",
                              [payload_param.new.attributes.distance])[0];
    } else {
        /** Add new distance onto the last one **/
        plv8.elog(NOTICE, 'CONTINUED DISTANCE RECORD');
        new_distance  = last_distance.attributes.distance + payload_param.new.attributes.distance;
        point = plv8.execute("SELECT ST_ASEWKT(ng_adventuresyndicate.point_along_route('Adventure Syndicate LEJOG', $1::NUMERIC)) as ewkt",
                              [new_distance])[0];
    }


    /** Create a new feature  which will be picked up by the views **/
    var feature = plv8.execute("SELECT ng_rest.add_feature('ng_adventuresyndicate', $1::JSON) as ret",[
        {
            geometry: point.ewkt,
            attributes: {
                feature_type: 'spot_tracker_point',
                distance: new_distance,
                messengerName: payload_param.new.attributes.org_name,
                org_name: payload_param.new.attributes.org_name
            }
        }
    ]);

    return feature;
}

$$ LANGUAGE PLV8;