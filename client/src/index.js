import { Queue } from '@nautoguide/ourthings';
import Templates from '@nautoguide/ourthings/Queueable/Templates';
import Elements from '@nautoguide/ourthings/Queueable/Elements';
import Openlayers from '@nautoguide/ourthings/Queueable/Openlayers';
import Internals from '@nautoguide/ourthings/Queueable/Internals';

let queue;
queue = new Queue({
    templates: Templates,
    elements: Elements,
    openlayers: Openlayers,
    internals: Internals,
});
window.queue=queue;