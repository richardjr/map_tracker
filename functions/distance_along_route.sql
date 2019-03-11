CREATE OR REPLACE FUNCTION ng_adventuresyndicate.distance_along_route(route_name TEXT, marker GEOMETRY) RETURNS NUMERIC AS
$$
DECLARE
    geometry_var GEOMETRY;
BEGIN

    --retrieve the route line
    SELECT ST_LineMerge(wkb_geometry)
    INTO geometry_var
    FROM ng_adventuresyndicate.features
    WHERE attributes @> jsonb_build_object('route_name', route_name)
    LIMIT 1;

    --returning distance in metres
    RETURN ST_Length(geometry_var::GEOGRAPHY) * ST_LineLocatePoint(geometry_var, marker);

END
$$ LANGUAGE PLPGSQL;