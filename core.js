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
        xhr.setRequestHeader("Content-Type", "text/html; charset=UTF-8");
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

        document.getElementById("setup-add-sensor-wnd").style.visibility = "visible";

        //Create a list of sensors and readings
        var tree = document.getElementById("sensor-tree");
        tree.innerHTML = "";
        for (let si = 0; si < data.hwinfo.sensors.length; si++) {
            var dom_li = document.createElement("li");
            dom_li.insertAdjacentHTML("beforeend","<div class=\"caret\">"+data.hwinfo.sensors[si].sensorNameUser+"</div>");
            var dom_ul_top = document.createElement("ul")
            dom_ul_top.classList.toggle("nested");
            for (let ri = 0; ri < data.hwinfo.readings.length; ri++) {
                if(data.hwinfo.readings[ri].sensorIndex == data.hwinfo.sensors[si].entryIndex) {
                    var dom_ul_li = document.createElement("li");
                    dom_ul_li.insertAdjacentHTML("beforeend","<div>"+data.hwinfo.readings[ri].labelUser+" | unit: "+data.hwinfo.readings[ri].unit+"</div>")
                    dom_ul_top.appendChild(dom_ul_li);
                }
                dom_li.appendChild(dom_ul_top);
            }
            tree.appendChild(dom_li);
        }

        //Collapse
        var toggler = document.getElementsByClassName("caret");
        for (var i = 0; i < toggler.length; i++) {
            toggler[i].addEventListener("click", function() {
                this.parentElement.querySelector(".nested").classList.toggle("active");
                this.classList.toggle("caret-down");
            });
        } 
    })
    .catch(function (err) {
        console.error('Augh, there was an error!', err.statusText);
    });
}

var close_add_sensor_btn_click = function() {
    document.getElementById("setup-add-sensor-wnd").style.visibility = "hidden";
}

var add_sensor_btn_click = function() {
    get_sensors();
}

window.addEventListener("DOMContentLoaded", (event) => {

});