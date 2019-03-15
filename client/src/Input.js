import Queueable from "@nautoguide/ourthings/Queueable";

class Input extends Queueable {
    onchange(pid, json, event) {
        if(json.hasOwnProperty('memoryGroup')) {
            const memoryCache = window.memory[json.memoryGroup] ? window.memory[json.memoryGroup].value : {};
            memoryCache[json.memoryName] = event.target.value;
            this.queue.setMemory(json.memoryGroup, memoryCache, 'Session');
        } else {
            this.queue.setMemory(json.memoryName, event.target.value, 'Session');
        }

        this.finished(pid, this.queue.DEFINE.FIN_OK);
    }

    submitMileage(pid, json) {
        console.log('Submitting');
        window.memory.mileageForm.distance *= 1609.344;
        const values = [
            {
                value: window.memory.mileageForm.schoolID,
                conditions: {
                    comparisonType: 'exists'
                },
            },
            {
                value: window.memory.mileageForm.riderName,
                conditions: {
                    comparisonType: 'exists',
                },
            },
            {
                value: window.memory.mileageForm.distance,
                conditions: {
                    comparisonType: 'number',
                }
            }
        ];

        let valid = true;
        for(let check of values) {
            if(!this.checkValidity(check.value, check.conditions)) {
                valid = false;
                break;
            }
        }

        if (valid) {
            this.queue.execute(json.name, json.json);
        }

        this.finished(pid, this.queue.DEFINE.FIN_OK);
    }

    checkValidity(value, json) {
        let valid = false;

        switch (json.comparisonType) {
            case 'type':
                valid = typeof value === json.type;
                break;
            case 'value':
                if(json.condition === '==') {
                    valid = value === json.value;
                } else {
                    valid = value === json.value;
                }
                break;
            case 'exists':
                valid = value !== '';
                break;
            case 'number':
                valid = isNaN(Number(value));
                break;
        }

        return valid;
    }
}

export default Input;