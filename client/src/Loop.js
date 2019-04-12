import Queueable from "@nautoguide/ourthings/Queueable";
window.highlighted = '';

class Loop extends Queueable {
    multi(pid,json) {
        let templateHTML = '<div id="leader-list" class="list-test">';
        window.memory.leaderboardRankings = [];
        let dataList = json.data;

        if(dataList.length > 0) {
            dataList.sort((a, b) => {
                if (Number(a.distance_miles) < Number(b.distance_miles)) return 1;
                if (Number(a.distance_miles) > Number(b.distance_miles)) return -1;
                return 0;
            });
        } else {
            dataList = [];
        }

        let i = 1;
        for(let data of dataList) {
            /* Data object:
            * date: "11/03/2019 21:03"
            * distance_km: "2.00"
            * distance_miles: "1.24"
            * org_name: "Organisation 1"
            * position: "2"
            */

            window.memory.leaderboardRankings.push(data);
            templateHTML +=
                '<div class="list-item ' + (window.highlighted === data.org_name ? 'highlighted' : '') + '" ' +
                    '@mapbox.paintQueryFeatures({"name": "schoolPoints", "paint": { "type": "circle-color", "value": ["' + data.org_name + '", "#367d18"]}}); ' +
                    '-loop.highlight({"name": "' + data.org_name + '"});' +
                '>' +
                '  <span class="list-item-icon position-' + i + '">#' + i +  '</span>' +
                '  <div class="list-secondary">' +
                '    <span class="list-item-title">' + data.org_name +  '</span>' +
                '    <span class="list-item-secondary">' + data.distance_miles +  ' Miles</span>' +
                '  </div>' +
                '</div>';
            i++;
        }

        templateHTML += '</div>';

        let commands = [];
        let parsedTemplate = this.queue.templateVars(templateHTML);
        parsedTemplate = this.queue.templateParse(parsedTemplate, commands);

        let targetDom = document.querySelector(json.targetId);
        this.queue.renderToDom(targetDom, parsedTemplate, this.queue.DEFINE.RENDER_INSERT);
        this.queue.commandsBind(commands);

        this.finished(pid, this.queue.DEFINE.FIN_OK);
    }

    highlight(pid, json) {
        const list = document.querySelector('#leader-list');
        window.highlighted = json.name;

        for(const child of list.children) {
            if (child.querySelector('.list-item-title').innerHTML === json.name) {
                child.className = 'list-item highlighted'
            } else {
                child.className = 'list-item'
            }
        }

        this.finished(pid, this.queue.DEFINE.FIN_OK);
    }
}

export default Loop;