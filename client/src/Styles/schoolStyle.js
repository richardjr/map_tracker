import {Circle, Fill, Stroke, Style} from 'ol/style.js';

const styleCache = {
    default: new Style({
        image: new Circle({
            radius: 5,
            fill: new Fill({
                color: [87, 124, 213, 1],
            }),
            stroke: new Stroke({
                color: [25, 53, 186, 1],
                width: 3,
            }),
        }),
    }),
    'Adventure Syndicate': new Style({
        image: new Circle({
            radius: 5,
            fill: new Fill({
                color: [213, 124, 52, 1],
            }),
            stroke: new Stroke({
                color: [186, 53, 25, 1],
                width: 2,
            }),
        }),
    }),
};

export function schoolStyle(feature, resolution) {
    const name = feature.get('org_name');

    if (!name || name !== 'Adventure Syndicate') {
        return [styleCache.default];
    } else {
        return [styleCache[name]]
    }
}
