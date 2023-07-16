import { getId } from './Utils.js'

import '../css/power_status.css'

function hide(id) {
    let element = getId(id);
    element.classList.add("hidden");
}

function show(id) {
    let element = getId(id);
    element.classList.remove("hidden");
}

function message(msg_content) {
    let msg = getId('scope-message');
    if(msg_content == null) {
        hide('scope-message');
        show('scope-graph');
    } else {
        msg.innerHTML = msg_content
        show('scope-message');
        hide('scope-graph');
    }
}

let previous_state = 'Unknown';
export function update(powerState)
{
    switch(powerState.state)
    {
        case "PowerOff":
        {
            hide('usb-status-bar');
            hide('usb-status');
            hide('nscope-usb-power-fault');
            hide('nscope-usb-disconnected');
            show('nscope-usb-power-off');
            message('nScope is asleep');
            update.percentage = null;
            break;
        }
        case "PowerOn":
        {
            hide('nscope-usb-power-off');
            hide('nscope-usb-power-fault');
            hide('nscope-usb-disconnected');

            message(null);
            show('usb-status-bar');
            show('usb-status');
            var percentage = powerState.usage*100/2.5;
            update.percentage = (update.percentage || 0.0)*0.8+percentage*0.2;

            getId('nscope-power-usage').style.width = `${update.percentage}%`;

            getId('usb-status-bar').innerHTML = `${(update.percentage/100*2.5).toFixed(2)} W`;
            getId('usb-status').innerHTML = `${(update.percentage/100*2.5).toFixed(2)} W`;

            if(previous_state !== "PowerOn"){
                nscope.restartTraces(nScope);
            }
            break;
        }
        case "Shorted":
        {
            hide('usb-status-bar');
            hide('usb-status');
            hide('nscope-usb-power-off');
            hide('nscope-usb-disconnected');

            show('nscope-usb-power-fault');
            message('nScope detected a power fault');
            update.percentage = null;
            break;
        }
        case "Overcurrent":
        {
            hide('usb-status-bar');
            hide('usb-status');
            hide('nscope-usb-power-off');
            hide('nscope-usb-disconnected');

            show('nscope-usb-power-fault');
            message('nScope detected an overcurrent event');
            update.percentage = null;
            break;
        }
        default: {
            hide('usb-status-bar');
            hide('usb-status');
            hide('nscope-usb-power-off');
            hide('nscope-usb-power-fault');


            show('nscope-usb-disconnected');
            message('Cannot connect to nScope');
            update.percentage = null;
            break;
        }
    }
    previous_state = powerState.state;
}