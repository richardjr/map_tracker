import Queueable from "@nautoguide/ourthings/Queueable";

class Loop extends Queueable {
    multi(pid,json) {
        let templateHTML = '<div class="list-test">';
        let htmlCache = document.querySelector(json.template).innerHTML;
        window.memory.leaderboardRankings = [];

        let dataList = json.data;
        dataList.sort((a,b) => {
            if (Number(a.distance_miles) < Number(b.distance_miles)) return 1;
            if (Number(a.distance_miles) > Number(b.distance_miles)) return -1;
            return 0;
        });
        console.log(dataList);

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
                '<div class="list-item">' +
                '  <span class="list-item-icon position-' + data.position + '">#' + data.position +  '</span>' +
                '  <div class="list-secondary">' +
                '    <span class="list-item-title">' + data.org_name +  '</span>' +
                '    <span class="list-item-secondary">' + data.distance_miles +  ' Miles</span>' +
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