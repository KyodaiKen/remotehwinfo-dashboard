/* HWiNFO Dashboard for Demion's remotehwinfo by KyoudaiKen */
var open_setup_wnd = function() {
    document.getElementById('setup-wnd').style.visibility = 'visible';
}

var close_setup_wnd = function() {
    document.getElementById('setup-wnd').style.visibility = 'hidden';
}

var remotehwinfo_req = function(method, url) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                    status: xhr.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: xhr.status,
                statusText: xhr.statusText
            });
        };
        xhr.send();
    });
}

//Get sensors for the sensor list when adding a new sensor
var get_sensors = function() {
    remotehwinfo_req('GET', 'json.json')
    .then(function (data) {
        data = data.replaceAll(": inf", ": \"Infinity\"");
        data = JSON.parse(data);
        console.log(data);
    })
    .catch(function (err) {
        console.error('Augh, there was an error!', err.statusText);
    });
}

var add_sensor_btn_click = function() {
    get_sensors();
}

window.addEventListener("DOMContentLoaded", (event) => {

});