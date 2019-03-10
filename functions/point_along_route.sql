CREATE OR REPLACE FUNCTION ng_adventuresyndicate.point_along_route(route_name TEXT, distance NUMERIC) RETURNS GEOMETRY AS
$$
DECLARE
    geometry_var GEOMETRY;
BEGIN

    --distance must be in metres
    SELECT ST_LineMerge(wkb_geometry) INTO geometry_var
    FROM ng_adventuresyndicate.features
    WHERE attributes @> jsonb_build_object('route_name', route_name)
    LIMIT 1;

    --If we have gone to far just give end of line
    IF distance > ST_LENGTH(geometry_var::GEOGRAPHY) THEN
        RETURN ST_PointN(geometry_var, -1);
    END IF;

    RETURN  ST_LineInterpolatePoint(geometry_var, distance/ST_LENGTH(geometry_var::GEOGRAPHY));

EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'ERROR %', SQLERRM;
    RETURN NULL;
END;
$$ LANGUAGE PLPGSQL;