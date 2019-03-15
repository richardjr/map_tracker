import {Circle, Fill, Stroke, Style} from 'ol/style.js';
export function schoolStyle(feature, resolution) {
    return [
        new Style({

            fill: new Fill({
                color: [247,182,67,0.8]
            }),
            stroke: new Stroke({
                color: [25, 53, 186, 1],
                width: 3,
            })
        })
    ]
}