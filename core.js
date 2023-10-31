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
var pick_sensor = function(callback) {
    remotehwinfo_req('GET', 'json.json')
    .then(function (data) {
        data = data.replaceAll(": inf", ": \"Infinity\"");
        data = data.replaceAll(": \"Â°C\"", ": \"°C\"");
        data = JSON.parse(data);
        console.log(data);

        document.getElementById("setup-add-sensor-wnd").style.visibility = "visible";

        //Create a list of sensors and readings
        var tree = document.getElementById("sensor-tree");
        tree.innerHTML = "";
        for (let provider in data) {
            var dom_li_provider = document.createElement("li");
            dom_li_provider.insertAdjacentHTML("beforeend","<div class=\"caret\">"+provider+"</div>");
            var dom_ul_provider = document.createElement("ul");
            dom_ul_provider.classList.toggle("nested");
            for (let si = 0; si < data[provider].sensors.length; si++) {
                var dom_li = document.createElement("li");
                dom_li.insertAdjacentHTML("beforeend","<div class=\"caret\">"+data[provider].sensors[si].sensorNameUser+"</div>");
                var dom_ul_top = document.createElement("ul")
                dom_ul_top.classList.toggle("nested");
                for (let ri = 0; ri < data[provider].readings.length; ri++) {
                    if(data[provider].readings[ri].sensorIndex == data[provider].sensors[si].entryIndex) {
                        var dom_ul_li = document.createElement("li");
                        var label = "";
                        if(data[provider].readings[ri].unit == "Yes/No") {
                            var val;
                            switch (data[provider].readings[ri].value) {
                                case 0:
                                    val = "No";
                                    break;
                                case 1:
                                    val = "Yes";
                            }
                            label = "<div>"+data[provider].readings[ri].labelUser+" ("+val+")</div>";
                        } else {
                            label = "<div>"+data[provider].readings[ri].labelUser+" ("+data[provider].readings[ri].value.toLocaleString('en-US')+data[provider].readings[ri].unit+")</div>";
                        }
                        dom_ul_li.setAttribute("kyo-sensor-path", provider+'/'+data[provider].sensors[si].sensorNameOriginal+'/'+data[provider].readings[ri].labelOriginal);
                        dom_ul_li.setAttribute("class", "sensor");
                        dom_ul_li.insertAdjacentHTML("beforeend",label);
                        dom_ul_top.appendChild(dom_ul_li);
                    }
                    dom_li.appendChild(dom_ul_top);
                }
                dom_ul_provider.appendChild(dom_li);
                dom_li_provider.appendChild(dom_ul_provider);
                tree.appendChild(dom_li_provider);
            }
        }

        //Events
        var toggler = document.getElementsByClassName("caret");
        for (var i = 0; i < toggler.length; i++) {
            toggler[i].addEventListener("click", function() {
                this.parentElement.querySelector(".nested").classList.toggle("active");
                this.classList.toggle("caret-down");
            });
        }

        var sensors = document.getElementsByClassName("sensor");
        for (var ii = 0; ii < sensors.length; ii++) {
            sensors[ii].addEventListener("click", function() {
                tree.innerHTML = "";
                document.getElementById("setup-add-sensor-wnd").style.visibility = "hidden";
                callback(this.getAttribute("kyo-sensor-path"));
            });
        }
    })
    .catch(function (err) {
        console.error('Augh, there was an error!', err.statusText);
    });
}

var close_add_sensor_btn_click = function() {
    document.getElementById("sensor-tree").innerHTML = "";
    document.getElementById("setup-add-sensor-wnd").style.visibility = "hidden";
}

var add_sensor_btn_click = function() {
    pick_sensor(function(sensorpath) {
        alert(sensorpath);
    });
}

var add_calced_btn_click = function() {
    pick_sensor(function(sensorpath) {
        pick_sensor(function(sensorpath1) {
            alert(sensorpath + ", " + sensorpath1);
        });
    });
}

window.addEventListener("DOMContentLoaded", (event) => {

});