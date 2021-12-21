import '../App.css';
import React, { Component, useEffect, useState } from "react";

const Guest = () => {

    var [array, setArray] = useState(new Array(5))
    let prevHeight = window.innerHeight;
    let prevWidth = window.innerWidth;

    useEffect(() => {
        var neurons = { 1: ['1.1', '1.2'], 2: ['2.1', '2.2'], 3: ['3.1', '3.2'] }
        setArray(neurons);
    },[])

    useEffect(()=>{
        updateLines();
    })



    const getOffset = (el) => {
        var rect = el.getBoundingClientRect();
        return {
            left: rect.left + window.pageXOffset,
            top: rect.top + window.pageYOffset,
            width: rect.width || el.offsetWidth,
            height: rect.height || el.offsetHeight
        };
    }
    var htmlCollector = "";

    const connect = (div1, div2, color, thickness) => {
        var off1 = getOffset(div1);
        var off2 = getOffset(div2);
        // bottom right
        var x1 = off1.left + off1.width / 2;
        var y1 = off1.top + off1.height / 2;
        // top right
        var x2 = off2.left + off2.width / 2;
        var y2 = off2.top + off2.height / 2;
        // distance
        var length = Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)));
        // center
        var cx = ((x1 + x2) / 2) - (length / 2);
        var cy = ((y1 + y2) / 2) - (thickness / 2);
        // angle
        var angle = Math.atan2((y1 - y2), (x1 - x2)) * (180 / Math.PI);
        // make hr
        var htmlLine = "<div id=\""+div1.id+"_"+div2.id+"\" style='padding:0px; margin:0px; height:" + thickness + "px; background-color:" + color + "; line-height:1px; position:absolute; left:" + cx + "px; top:" + cy + "px; width:" + length + "px; -moz-transform:rotate(" + angle + "deg); -webkit-transform:rotate(" + angle + "deg); -o-transform:rotate(" + angle + "deg); -ms-transform:rotate(" + angle + "deg); transform:rotate(" + angle + "deg);'></div>";
        //
        //alert(htmlLine);
        htmlCollector += htmlLine;
    }
    var isUpdating = false;
    const updateLines = () => {
        isUpdating = true;
        htmlCollector = "";
        Object.keys(array).forEach(key => {
            {
                array[key].forEach(neuron => {
                    let currentN = document.getElementById(neuron);
                    let nextLayer = parseInt((neuron.split(".")[0])) + 1;
                    if (nextLayer > Object.keys(array).length) {
                        //console.log("nextLayer is out of bounds, must be the end");
                        return;
                    }
                    if (nextLayer === 2) {
                        //console.log("This is the start");
                    }
                    array[nextLayer].forEach(oppNeuron => {
                        console.log("strings ", neuron, oppNeuron)
                        let oppN = document.getElementById(oppNeuron);
                        connect(currentN, oppN, "rgb(54, 149, 54)", 2);
                    })

                })
            }
        });
        isUpdating = false;
        // document.body.innerHTML += htmlCollector;
        htmlCollector = "<div id=\"supersecretlines\">" + htmlCollector + "</div>"
        var lineCode = document.getElementById("supersecretlines");
        if (lineCode) {
            lineCode.parentNode.removeChild(lineCode);
        }
        document.body.insertAdjacentHTML('beforeend', htmlCollector)
    }


    const onResize = () => {
        //resized -> lines need to be recalculated
        console.log(isUpdating);
        if (isUpdating) return;
        isUpdating = true;
        updateLines();
    }

    window.onresize = () => {
        if (prevHeight !== window.innerHeight || prevWidth !== window.innerWidth) {
            prevHeight = window.innerHeight;
            prevWidth = window.innerWidth;
            // document.body.innerHTML = clean;
            onResize();
        }
    }

    const onFire = (id) => {
        var firingElement = document.getElementById(id);
        firingElement.className += " firing";
        setTimeout(() => firingElement.className = firingElement.className.replace(" firing", ""), 1600)
    }

    const fireTestPath = (start, path) => {
        console.log("testing pathing")
        if (start >= path.length) {
            return;
        }
        onFire(path[start]);
        if(start + 1 < path.length){
            var line = path[start]+"_"+path[start+1];
            console.log("line",line)
            onFire(line)
        }
        start++;
        setTimeout(() => {
            console.log(start);
            fireTestPath(start, path);
        }, 800)
        //path.forEach(x => onFire(x))
    }
    const loadLayers = () => {
        var res = Object.keys(array).map(key => {
            return <div className='layer' style={{ height: '90%', minWidth: '50px' }}>L{key}
                {array[key].map(neuron => {
                    return <div className='neuron' id={neuron}>{neuron}</div>
                })}
            </div>
        })
        return res;
    }

    return (
        <>
            <h1 style={{ height: '5vh', fontSize: 10 }}>Wirefire - feed forward network visualizer</h1>
            <div style={{ width: "100vw", display: 'flex', alignItems: 'center', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', height: '90vh', background: '#140152' }}>
                <div className='container left' style={{}}>input <a onClick={() => fireTestPath(0, ["1.1", "2.2", "3.1"])}>FireTest</a></div>
                {
                    loadLayers()
                }
                <div className='container right' style={{ minWidth: '100px', textAlign: 'right' }}>end</div>
            </div>
            <div className='footer'>iznogoud</div>
        </>
    );
}

export default Guest;
