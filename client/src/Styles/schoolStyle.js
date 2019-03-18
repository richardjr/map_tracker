import {Circle, Fill, Stroke, Style} from 'ol/style.js';
export function schoolStyle(feature, resolution) {
    return [
        new Style({
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
        })
    ]
}