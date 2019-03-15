import Queueable from "@nautoguide/ourthings/Queueable";

class Loop extends Queueable {
    multi(pid,json) {
        let templateHTML = '<div class="list-test">';
        let htmlCache = document.querySelector(json.template).innerHTML;
        window.memory.leaderboardRankings = [];
        for(let data of json.data) {
            console.log(data);
            /* Data object:
            * date: "11/03/2019 21:03"
            * distance_km: "2.00"
            * distance_miles: "1.24"
            * org_name: "Organisation 1"
            * position: "2"
            */

            window.memory.leaderboardRankings.push(data);
            templateHTML +=
                '<div class="list-item">' +
                '  <span>#' + data.position +  '</span>' +
                '  <div class="list-secondary">' +
                '    <span style="font-size:1.3em">' + data.org_name +  '</span>' +
                '    <span style="font-size:0.8em;color:#666">' + data.distance_miles +  ' Miles</span>' +
                '  </div>' +
                '</div>';
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
}

export default Loop;