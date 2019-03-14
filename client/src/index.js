import { Queue } from '@nautoguide/ourthings';
import Api from '@nautoguide/ourthings/Queueable/Api';
import Templates from '@nautoguide/ourthings/Queueable/Templates';
import Elements from '@nautoguide/ourthings/Queueable/Elements';
import Openlayers from '@nautoguide/ourthings/Queueable/Openlayers';
import Internals from '@nautoguide/ourthings/Queueable/Internals';
import Loop from './Loop';

let queue;
queue = new Queue({
    api: Api,
    templates: Templates,
    elements: Elements,
    openlayers: Openlayers,
    internals: Internals,
    loop: Loop,
});
window.queue=queue;

import { reportStyle } from './Styles/reportStyle';
import { schoolStyle } from './Styles/schoolStyle';
window.styles = {
    reportStyle,
    schoolStyle
};