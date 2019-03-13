import Queueable from "@nautoguide/ourthings/Queueable";

class Loop extends Queueable {
    multi(pid,json) {
        let templateHTML = '<div class="list-test">';
        let htmlCache = document.querySelector(json.template).innerHTML;
        for(let data of json.data) {
            templateHTML += htmlCache;
        }

        templateHTML += '</div>';

        let commands = [];
        let parsedTemplate = this.queue.templateVars(templateHTML);
        parsedTemplate = this.queue.templateParse(parsedTemplate, commands);
        console.log(parsedTemplate);

        let targetDom = document.querySelector(json.targetId);
        this.queue.renderToDom(targetDom, parsedTemplate, this.queue.DEFINE.RENDER_INSERT);
        this.queue.commandsBind(commands);

        this.finished(pid, this.queue.DEFINE.FIN_OK);
    }
}

export default Loop;