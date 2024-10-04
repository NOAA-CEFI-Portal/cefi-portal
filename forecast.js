// global constant for object ID
const momCobaltMapFcast = $('#momCobaltIFrameFcast');
const momCobaltBtnFcast = $("#momCobaltBtnFcast");
const clearFigOptBtnFcast = $("#clearFigOptBtnFcast")


// global info
var mapDataFcast = {}   // parsed html output
var locationDataFcast;
var polygonDataFcast;


// Initial variable options based on dataset
createMomCobaltVarOptFcast('MOMCobaltFcast','varMOMCobaltFcast');
// global variable for model variable name, index, and abbreviation
let varnamelistFcast = momCobaltVarsFcast();
let varindFcast = varnamelistFcast[1].indexOf($("#varMOMCobaltFcast").val())
let varnameFcast = varnamelistFcast[0][varindFcast]
let varValueFcast = varnamelistFcast[1][varindFcast]

// Initial initYear options
createMomCobaltInitYearOpt('iniYearMOMCobaltFcast');
// Initial initMonth options
createMomCobaltInitMonthOpt('iniMonthMOMCobaltFcast');
// global variable for initial time 
let iniYear = $("#iniYearMOMCobaltFcast").val();
let iniMonth = $("#iniMonthMOMCobaltFcast").find("option:selected").text();

// global time slider related variables
const timeSliderFcast = $("#timeRangeFcast");
const tValueFcast = $(".timeValueFcast");
const initTValueFcast = $(".initTimeValueFcast");
// default initial time
initTValueFcast.text(iniMonth +' '+ iniYear)
// default tick lead time
const containerTickFcast = $(".ticksFcast");
var leadMonthList, leadIndex;
[leadIndex, leadMonthList] = generateFcastLeadMonth(
    iYear = parseInt($("#iniYearMOMCobaltFcast").val()),
    iMonth = parseInt($("#iniMonthMOMCobaltFcast").val())
);
timeSliderFcast.attr("min", 0);
timeSliderFcast.attr("max", leadIndex.length - 1);
timeSliderFcast.val(0);
var leadFoliumFcast = leadMonthList[timeSliderFcast.val()];   // global
tValueFcast.text(leadFoliumFcast);
tickSpaceChangeFcast(leadMonthList)

// Initial stat options
createMomCobaltStatOptFcast();

// Initial depth options
createMomCobaltDepthOptFcast(varValueFcast,'depthMOMCobaltFcast');

// Initial depth block options
createMomCobaltDepthBlockOptFcast(varValueFcast,'blockMOMCobaltFcast')

// setup colorbar option
createMomCobaltCbarOpt('cbarOptsFcast');

// initialize plotly
$(document).ready(function() {
    window.asyncInitializePlotlyResize('forecast')
});

/////////////////  event listener  ////////////////
$(window).resize(function() {
    tickSpaceChangeFcast(leadMonthList);
});

// add event listener on figure all clear button
clearFigOptBtnFcast.on("click", function () {
    $("input.figOpt").val('');
});

// add event listener on create map button
momCobaltBtnFcast.on("click", function () {

    // update map
    replaceFoliumForecast()
    // update initial time
    iniYear = $("#iniYearMOMCobaltFcast").val();
    iniMonth = $("#iniMonthMOMCobaltFcast").find("option:selected").text();
    initTValueFcast.text(iniMonth +' '+ iniYear)
    // update tick lead time
    var newleadIndex, newleadMonthList;
    [newleadIndex, newleadMonthList] = generateFcastLeadMonth(
        iYear = parseInt($("#iniYearMOMCobaltFcast").val()),
        iMonth = parseInt($("#iniMonthMOMCobaltFcast").val())
        );

    // reassign global variables
    leadIndex = newleadIndex
    leadMonthList = newleadMonthList

    leadFoliumFcast = leadMonthList[timeSliderFcast.val()];   // global
    tValueFcast.text(leadFoliumFcast);

    // remove marker (resetting)
    var removeMarker = {
        type: 'removeMarker'
    };
    momCobaltMapFcast[0].contentWindow.postMessage(removeMarker, "*")
    
});

// Update the figure (when mouse up the slider handle)
timeSliderFcast.on("mouseup", function() {
    leadFoliumFcast = leadMonthList[$(this).val()];
    // fetchDataAndPost(dateFolium)
    replaceFoliumForecast()
    // remove marker
    var removeMarker = {
        type: 'removeMarker'
    };
    momCobaltMapFcast[0].contentWindow.postMessage(removeMarker, "*")
});

// Update the current slider value (each time you drag the slider handle)
timeSliderFcast.on("input", function() {
    leadFoliumFcast = leadMonthList[$(this).val()];
    tValueFcast.text(leadFoliumFcast);
});

// event listen for variable change
$("#varMOMCobaltFcast").on("change", function(){
    // varname
    varindFcast = varnamelistFcast[1].indexOf($("#varMOMCobaltFcast").val())
    varnameFcast = varnamelistFcast[0][varindFcast]
    varValueFcast = varnamelistFcast[1][varindFcast]

    // depth option change
    $("#depthMOMCobaltFcast").empty();
    createMomCobaltDepthOptFcast(varValueFcast,"depthMOMCobaltFcast");
    $("#blockMOMCobaltFcast").empty();
    createMomCobaltDepthBlockOptFcast(varValueFcast,'blockMOMCobaltFcast');

});


// event listen for analyses change
$("#analysisMOMCobaltFcast").on("change", function(){
    var selectedValue = $('#analysisMOMCobaltFcast :selected').val();
    // $('#'+selectedValue.slice(0, -3)+'Tab').prop('checked', true);
    // showDiv(selectedValue.slice(0, -3),'view');
    $("#dashNavForecast > ul.nav-pills > li.nav-item").removeClass("active"); 
    $("#"+selectedValue.slice(0, -3)+'Pill').addClass("active");
    $("#dashContentForecast div.tab-pane").removeClass("active"); 
    $("#"+selectedValue.slice(0, -3)).addClass("active");
})



// add event listener for the "message" event using jQuery (location click)
$(window).on("message", receiveMessageFcast);

// // event listener for clicking the minitab
// $('input[name="fcastAnalysestabs"]').on('click', function() {
//     console.log('Selected option id:', $(this).attr('id'));
//     // Check which radio button is clicked
//     if ($(this).is(':checked')) {
//         var selectedID = $(this).attr('id');
//         changeSelectOpt(selectedID.slice(0, -3),'analysisMOMCobaltFcast','viewFcast')
//         // console.log('Selected option id:', $(this).attr('id'));
//     }
// });



/////////////////////// function section /////////////////////
// function for changing the tick mark of time slider
function tickSpaceChangeFcast(list) {
    if ($(window).width() < 600) {
        var result = [];
        for (var i = 3; i < list.length; i += 5) {
          result.push(i);
        }
        generateTickFcast(result);
    } else if ($(window).width() < 1200) {
        var result = [];
        for (var i = 2; i < list.length; i += 2) {
          result.push(i);
        }
        generateTickFcast(result);
    } else {
        var result = [];
        for (var i = 0; i < list.length; i++) {
          result.push(i);
        }
        generateTickFcast(result); 
    };
};

// functions for timeline tick 
function generateTickFcast(tickList) {
    $("div.ticksFcast span").remove();
    for (let i = 0; i < tickList.length; i++) {
        // Create a new <span> element
        const span = $("<span></span>");
    
        // Set some content or attributes for the <span>
        // span.text(`${tickList[i]}`+' (lead = '+i+')');
        var leadtime = tickList[i]+0.5
        span.text('lead = '+leadtime);
        span.addClass("tickLeadTime"); 
    
        // Append the <span> to the containerTick <div>
        containerTickFcast.append(span);
    };
};

// function for create option for variables
function createMomCobaltVarOptFcast(dataCobaltID,selectID) {
    let elm = document.getElementById(selectID); 
    var varlist;
    if (dataCobaltID == "MOMCobaltFcast") {
        varlist = momCobaltVarsFcast();
    }

    df = optionSubgroupList(varlist[0],varlist[1],varlist[2]);
    elm.appendChild(df); // append the document fragment to the DOM. this is the better way rather than setting innerHTML a bunch of times (or even once with a long string)
};

// function for create option for initial Year
function createMomCobaltInitYearOpt(selectTagID) {
    let elm = document.getElementById(selectTagID);
    let listInitYear = momCobaltInitYear()    
    let df = optionList(listInitYear,listInitYear);
    elm.appendChild(df);
    $('#'+selectTagID).val(listInitYear.slice(-1))
};

// function for create option for initial Month
function createMomCobaltInitMonthOpt(selectTagID) {
    let elm = document.getElementById(selectTagID);
    let [listInitMonth, listInitMonthStr] = momCobaltInitMonth()    
    let df = optionList(listInitMonthStr,listInitMonth);
    elm.appendChild(df);
};

// function for create option for statistics
function createMomCobaltStatOptFcast() {
    let elm = document.getElementById('statMOMCobaltFcast');
    let [stats_list, stats_value] = momCobaltStatsFcast()    
    let df = optionList(stats_list,stats_value);
    elm.appendChild(df);
};

// function for create option for depth
function createMomCobaltDepthOptFcast(variable,selectID) {
    let elm = document.getElementById(selectID);
    let list_3d = momCobalt3DFcast()
    const found = list_3d.some(element => element === variable);
    if (found) {
        let depthlist = momCobaltDepth();
        let df = optionList(depthlist,depthlist);
        elm.appendChild(df);
    } else {
        let df = document.createDocumentFragment();
        let option = document.createElement('option');
        option.value = 'single_layer';
        option.appendChild(document.createTextNode('single layer'));
        df.appendChild(option); 
        elm.appendChild(df);
    }
};

// function for create option for bottom depth block
function createMomCobaltDepthBlockOptFcast(variable,selectID) {
    let elm = document.getElementById(selectID);
    let list_bottom = momCobaltBottomFcast();

    const found = list_bottom.some(element => element === variable);
    if (found) {
        let depthlist = momCobaltDepth();
        let df = optionList(depthlist,depthlist);
        elm.appendChild(df); 
        elm.options[0].disabled = true;
        elm.selectedIndex = depthlist.indexOf(6250);
    } else {
        let df = document.createDocumentFragment();
        let option = document.createElement('option');
        option.value = 'not_applicable';
        option.appendChild(document.createTextNode('not applicable'));
        df.appendChild(option); 
        elm.appendChild(df);
    }
};

// functions for generating year and date list for timeslider (monthly)
function generateFcastLeadMonth(iYear = 1993, iMonth = 3) {

    const leadIndex = Array.from(Array(12).keys());
    const nlead = leadIndex.length-1
    var leadMonth = [];

    for (var month = iMonth; month <= iMonth+nlead; month++) {
        if (month<=12) {
            var monthStr = month < 10 ? "0" + month : month;
            leadMonth.push(iYear + "-" + monthStr);
        } else {
            newMonth = month-12
            var monthStr = newMonth < 10 ? "0" + newMonth : newMonth;
            leadMonth.push(iYear+1 + "-" + monthStr);
        }
    }

    return [leadIndex, leadMonth];
};

// function for advancing/recede to the next option in the list
//   used directly in html page button with attribute onclick
function changeLeadTimeStep(timeStep) {
    var nextTime = parseInt(timeSliderFcast.val())+timeStep;
    timeSliderFcast.val(nextTime);
    leadFoliumFcast = leadMonthList[timeSliderFcast.val()];
    tValueFcast.text(leadFoliumFcast);
    replaceFoliumForecast();
};


// function for replace folium overlap info (image and colorbar)
let varFoliumMapFcast;
let statMapFcast;
let statMapFcastName;
let depthMapFcast;
function replaceFoliumForecast() {
    showLoadingSpinner("loading-spinner-map-Fcast");
    varFoliumMapFcast = varValueFcast;
    statMapFcast = $("#statMOMCobaltFcast").val();
    statMapFcastName = $('#statMOMCobaltFcast').find('option:selected').text()
    depthMapFcast = $("#depthMOMCobaltFcast").val();
    let block = $("#blockMOMCobaltFcast");
    let cbar = $("#cbarOptsFcast")
    let maxval = $("#maxvalFcast");
    let minval = $("#minvalFcast");
    let nlevel = $("#nlevelFcast");

    var ajaxGet = "/cgi-bin/cefi_portal/mom_folium_fcast.py"
        +"?variable="+varFoliumMapFcast
        +"&region="+$("#regMOMCobaltFcast").val()
        +"&iniyear="+$("#iniYearMOMCobaltFcast").val()
        +"&inimonth="+$("#iniMonthMOMCobaltFcast").val()
        +"&lead="+timeSliderFcast.val()
        +"&stat="+statMapFcast
        +"&depth="+depthMapFcast
        +"&block="+block.val()
        +"&cbar="+cbar.val()
        +"&maxval="+maxval.val()
        +"&minval="+minval.val()
        +"&nlevel="+nlevel.val()
    console.log('https://webtest.psd.esrl.noaa.gov/'+ajaxGet)

    fetch(ajaxGet)
        .then(response => {
            if (!response.ok) {
            throw new Error('Network response was not ok for forecast map fetch');
            }
            return response.text();
        })
        .then(data => {
            // Process the response data here

            //replace image
            var regexImg = /^\s*"data:image\/png;base64,[^,\n]*,\n/gm;
            var matcheImg = data.match(regexImg);
            var image = matcheImg[0].match(/"([^"]+)"/)[0].slice(1,-1)
            // var image = extractText(matcheImg[0]);

            //replace colorbar
            var regexDom = /^\s*\.domain\([^)]*\)\n/gm;
            var matchDoms = data.match(regexDom);
            var domainArray1 = text2Array(matchDoms[0]);
            var domainArray2 = text2Array(matchDoms[1]);
            var regexRange = /^\s*\.range\([^)]*\);\n/gm;
            var matchRanges = data.match(regexRange);
            var rangeArray = text2Array(matchRanges[0].replace(/'/g, '"'));
            
            //replace tickmark
            var regexTickVal = /^\s*\.tickValues\([^)]*\);\n/gm;
            var matchTickVal = data.match(regexTickVal);
            var tickValArray = text2Array(matchTickVal[0]);
            
            //replace colorbar label
            var regexCLabel = /^\s*\.text\([^)]*\);\n/gm;
            var matchCLabel = data.match(regexCLabel);
            var textVal = extractText(matchCLabel[0]);

            

            mapDataFcast = {
                type: 'mapData',   // used in hindcast_mom.js for type check
                image: image,
                domain1: domainArray1,
                domain2: domainArray2,
                range: rangeArray,
                tick: tickValArray,
                label: textVal
            };
            // console.log(mapDataFcast)
            momCobaltMapFcast[0].contentWindow.postMessage(mapDataFcast, "*")

            // // get same point time series when points and variable are defined
            // if (locationDataFcast !== undefined && locationDataFcast !== null) {
            //     if (varFoliumMapFcast !== undefined && varFoliumMapFcast !== null) {
            //         if ($('#varMOMCobaltTS2').val() !== undefined && $('#varMOMCobaltTS2').val() !== null) {
            //             plotTSs(locationDataFcast)
            //         } else {
            //             plotTS1(locationDataFcast);
            //         }
            //     }
            //     plotVertProfs(locationDataFcast)
            // }
            // // get same polyline transect when polyline and variable are defined
            // if (polygonDataFcast !== undefined && polygonDataFcast !== null) {
            //     if (varFoliumMapFcast !== undefined && varFoliumMapFcast !== null) {
            //         plotTransect(polygonDataFcast)
            //     }
            // }

            hideLoadingSpinner("loading-spinner-map-Fcast");
        })
        .catch(error => {
            // Handle errors here
            console.error('Processing forecast folium map error:', error);
        });

    // momCobaltMap.attr("src", ajaxGet)
};

// function for retrieving lon lat from iframe leaflet
//   getting the lon lat from iframe and send to 
//   server to get
//   1. value of the marker on the shading
var varDataFcast = null
function receiveMessageFcast(event) {
    // Access the data sent from the iframe
    if (event.originalEvent.origin === window.location.origin) {
        // console.log(event.originalEvent)

        if (event.originalEvent.data.type === 'locationData') {
            locationDataFcast = event.originalEvent.data;

            if (varFoliumMapFcast !== undefined && varFoliumMapFcast !== null) {
                // // plotting the plotly ts
                // if ($('#varMOMCobaltTS2').val() !== undefined && $('#varMOMCobaltTS2').val() !== null) {
                //     plotTSs(locationDataFcast)
                // } else {
                //     plotTS1(locationDataFcast);
                // }
                // // plotting the plotly vertical profile
                // plotVertProfs(locationDataFcast)
                // grabbing the location variable value 
                // const promisevarValFcast = new Promise((resolve, reject) => {
                //     getvarValFcast(locationDataFcast)
                //         .then(value => {
                //             varDataFcast = value
                //             // send the value back to iframe
                //             varDataFcastJson = {
                //                 type: 'varValFcastData',
                //                 var: varDataFcast
                //             };
                //             momCobaltMapFcast[0].contentWindow.postMessage(varDataFcastJson, "*")
                //             resolve();
                //         })
                //         .catch(error => {
                //             // Handle errors here
                //             console.error('Error in createPromiseForvarValFcast:', error);
                //             reject(error);
                //         });
                // });
                
                // displaying the variable value on iframe marker
                const promisevarValFcast = new Promise((resolve, reject) => {
                    getvarValFcast(locationDataFcast)  // function return promise obj from fetch
                        .then(varDataFcast => {
                            // send the value back to iframe
                            varDataFcastJson = {
                                type: 'varValFcastData',
                                var: varDataFcast
                            };
                            momCobaltMapFcast[0].contentWindow.postMessage(varDataFcastJson, "*")
                            resolve();
                        })
                        .catch(error => {
                            console.error('Error in promisevarValFcast:', error);
                            reject(error);
                        });
                });

                // display forecast spread plotly
                plotTSFcast(locationDataFcast)
            }
        } else if (event.originalEvent.data.type === 'polygonData') {
            // polygonDataFcast = event.originalEvent.data;
            // if (varFoliumMapFcast !== undefined && varFoliumMapFcast !== null) {
            //     plotTransect(polygonDataFcast)
            // }           
        }

        // console.log("Received data from iframe:", locationDataFcast);
        // console.log(event.originalEvent.origin);
    };
};

// function to get variable value based on locationData and dataFolium
function getvarValFcast(infoLonLat) {
    var ajaxGet = "/cgi-bin/cefi_portal/mom_extract_variableValue_fcast.py"
        +"?variable="+varFoliumMapFcast
        +"&region="+$("#regMOMCobaltFcast").val()
        +"&stat="+statMapFcast
        +"&depth="+depthMapFcast
        +"&lon="+infoLonLat.longitude
        +"&lat="+infoLonLat.latitude
        +"&iniyear="+$("#iniYearMOMCobaltFcast").val()
        +"&inimonth="+$("#iniMonthMOMCobaltFcast").val()
        +"&lead="+timeSliderFcast.val()
    
    console.log('https://webtest.psd.esrl.noaa.gov/'+ajaxGet)

    ajaxGetPromise = fetch(ajaxGet)
        .then(response => {
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            // Process the response data here
            var lines = data.split('\n');

            return lines[0]

        })
        .catch(error => {
            // Handle errors here
            console.error('Fetch variable value error:', error);
        });


    return ajaxGetPromise
};

// function for setting up promises in Forecast TS spread(execute order for async)
//  1. input lon lat location 
//  2. Fetch forecast TSs (setup promise)
//  3. create plotly object on webpage (execute when promise resolved)
function plotTSFcast(infoLonLat) {
    showLoadingSpinner("loading-spinner-fcast-spread");
    getTSFcasts(infoLonLat)     // the function return a promise obj from fetch
        .then((jsonData)=>{
            let singleList = ['ens_min_max','lower_tercile','upper_tercile','middle_tercile'];
            if (singleList.includes(statMapFcast)) {
                plotlyForecastRange(jsonData)
                $('#plotly-fcast-box').empty();
            } else {
                plotlyForecastSpread(jsonData)
                plotlyForecastBox(jsonData)
            }
            
            hideLoadingSpinner("loading-spinner-fcast-spread");
        })
        .catch((error)=>{
            console.error(error);
        })
};

// function to fetch all forecast spread based on locationData
//  response in the json format (testing)
function getTSFcasts(infoLonLat) {
    var ajaxGet = "/cgi-bin/cefi_portal/mom_extract_timeseries_fcast.py"
        +"?variable="+varFoliumMapFcast
        +"&region="+$("#regMOMCobaltFcast").val()
        +"&stat="+statMapFcast
        +"&depth="+depthMapFcast
        +"&lon="+infoLonLat.longitude
        +"&lat="+infoLonLat.latitude
        +"&iniyear="+$("#iniYearMOMCobaltFcast").val()
        +"&inimonth="+$("#iniMonthMOMCobaltFcast").val()
    
    console.log('https://webtest.psd.esrl.noaa.gov/'+ajaxGet)

    ajaxGetPromise = fetch(ajaxGet)
        .then(response => {
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .catch(error => {
            // Handle errors here
            console.error('Fetch time series error:', error);
        });

    return ajaxGetPromise
};

// function for creating the plotly forecast spread time series
function plotlyForecastSpread(jsonData) {
    var yformat = decimal_format(jsonData.mean);

    var trace1Color = "rgba(113, 29, 176, 0.7)";
    var trace = {
        x: leadMonthList,
        y: jsonData.mean,
        type: 'scatter',
        mode: 'lines+markers',
        marker: { size: 5 },
        line: { 
            shape: 'linear',
            color: trace1Color,
            width: 3 
        },
        // name: statMap+' time series',
        name: varnameFcast
    };

    var data = [trace];

    var trace2Color = "rgba(113, 29, 176, 0.1)";
    for (var i=1; i<=10; i++) {
        var key = 'ens'+i
        var trace_ens = {
            x: leadMonthList,
            y: jsonData[key],
            type: 'scatter',
            mode: 'lines+markers',
            marker: { size: 2 },
            line: { 
                shape: 'linear',
                color: trace2Color },
            // name: statMap+' time series',
            name: key
        };
        data.push(trace_ens)
    }
    

    var layout = {
        hovermode: 'closest',
        showlegend: false,
        title:
        varnameFcast +' <br>' +
            ' @ (lat:'+parseFloat(jsonData.lat).toFixed(2)+'N,'+
                'lon:'+parseFloat(jsonData.lon).toFixed(2)+'E)',
        //   autosize: true,
        annotations: [{
            x: 0,
            y: 0,
            xref: 'paper',
            yref: 'paper',
            text: 'Source: NOAA CEFI data portal',
            showarrow: false
         }],
        //  width: 550,
        //  height: 400,
         margin: {
            l: 80,
            r: 80,
            b: 80,
            t: 100,
            // pad: 4
          },
        xaxis: {
            title: 'Lead time'
        },
        yaxis: {
            title: {
                text: statMapFcastName + ' (' + jsonData.units + ')',
                standoff: 10,
                font: { color: trace1Color }
            },
            tickfont: { color: trace1Color },
            tickformat: yformat,
            tickmode: 'auto'
        },
        modebar: {
            remove: ["autoScale2d", "autoscale", "zoom", "zoom2d", ]
        },
        dragmode: "select"
        // responsive: true
    };

    Plotly.newPlot('plotly-fcast-spread', data, layout);
};

// function for creating the plotly forecast ensemble range time series
function plotlyForecastRange(jsonData) {
    var yformat = decimal_format(jsonData.spread);

    var trace1Color = "rgba(113, 29, 176, 0.7)";
    var trace = {
        x: leadMonthList,
        y: jsonData.spread,
        type: 'scatter',
        mode: 'lines+markers',
        marker: { size: 5 },
        line: { 
            shape: 'linear',
            color: trace1Color,
            width: 3 
        },
        // name: statMap+' time series',
        name: varnameFcast
    };

    var data = [trace];

    var layout = {
        hovermode: 'closest',
        showlegend: false,
        title:
        varnameFcast +' <br>' +
            ' @ (lat:'+parseFloat(jsonData.lat).toFixed(2)+'N,'+
                'lon:'+parseFloat(jsonData.lon).toFixed(2)+'E)',
        //   autosize: true,
        annotations: [{
            x: 0,
            y: 0,
            xref: 'paper',
            yref: 'paper',
            text: 'Source: NOAA CEFI data portal',
            showarrow: false
         }],
        //  width: 1000,
        //  height: 400,
         margin: {
            l: 80,
            r: 80,
            b: 80,
            t: 100,
            // pad: 4
          },
        xaxis: {
            title: 'Lead time'
        },
        yaxis: {
            title: {
                text: statMapFcastName + ' (' + jsonData.units + ')',
                standoff: 10,
                font: { color: trace1Color }
            },
            tickfont: { color: trace1Color },
            tickformat: yformat,
            tickmode: 'auto'
        },
        modebar: {
            remove: ["autoScale2d", "autoscale", "zoom", "zoom2d", ]
        },
        dragmode: "select"
        // responsive: true
    };
    var config = {responsive: true}
    Plotly.newPlot('plotly-fcast-spread', data, layout,config);
};

// function for creating the plotly time series box plot
function plotlyForecastBox(jsonData) {
    var yformat = decimal_format(jsonData.mean);
    var trace1Color = "rgba(113, 29, 176, 0.8)";
    var xData = leadMonthList;
    var yData = [];
    for (var l=0; l<=11; l++) {
        var ens = []
        for (var i=1; i<=10; i++) {
            var key = 'ens'+i
            ens.push(jsonData[key][l]);
        }
        yData.push(ens);
    };

    var data = [];

    for ( var i = 0; i < xData.length; i ++ ) {
        var result = {
            type: 'box',
            y: yData[i],
            name: xData[i],
            boxpoints: false,
            // jitter: 0.3,
            // pointpos: -1.8,
            type: 'box',
            boxmean: 'sd',
            // boxpoints: 'all',
            // jitter: 0.5,
            whiskerwidth: 1,
            // fillcolor: none,
            marker: {
                size: 1,
                color: trace1Color 
            },
            line: {
                width: 1,
                color: trace1Color 
            }
        };
        data.push(result);
    };

    layout = {
        hovermode: 'closest',
        showlegend: false,
        title: 'Ensemble spread at each lead',
        annotations: [{
            x: 0,
            y: 0,
            xref: 'paper',
            yref: 'paper',
            text: 'Source: NOAA CEFI data portal',
            showarrow: false
         }],
        //  width: 530,
        //  height: 400,
         margin: {
            l: 80,
            r: 80,
            b: 80,
            t: 100,
            // pad: 4
          },
        xaxis: {
            title: 'Lead time'
        },
        yaxis: {
            title: {
                text: statMapFcastName + ' (' + jsonData.units + ')',
                standoff: 10,
                font: { color: trace1Color }
            },
            tickfont: { color: trace1Color },
            tickformat: yformat,
            tickmode: 'auto'
        },
        modebar: {
            remove: ["autoScale2d", "autoscale", "zoom", "zoom2d", ]
        },
        dragmode: "select"
        // responsive: true
    };
    var config = {responsive: true}

    Plotly.newPlot('plotly-fcast-box', data, layout,config);

};

// function for deciding the y tick numerical format
function decimal_format(numArray) {
    var format = '.2f';
    var maxVal = Math.max(...numArray);
    var minVal = Math.min(...numArray);
    var diff = Math.abs(maxVal-minVal);
    if (diff< 0.01) {
        format = '.2e';
    }
    return format
};

///////// information function start /////////

// functions for options lists (Manual entering)
function momCobaltVarsFcast() {
    let var_options = [
        "Sea surface temperature",
        "Bottom temperature"
    ];
    let var_values = [
        "tos",
        "tob"
    ];
    let var_freqs = [
        "monthly",
        "monthly"
    ];

    return [var_options, var_values, var_freqs];
};

// functions for generating year list for initial time (monthly)
function momCobaltInitYear(startYear = 1993, endYear = 2022) {
    var yearList = [];

    for (var year = startYear; year <= endYear; year++) {
        yearList.push(year)
    }

    return yearList;
};

// functions for generating month list for initial time (monthly)
function momCobaltInitMonth() {
    var monthList = [3,6,9,12];
    var monthStrList = ['March','June','September','December']
    return [monthList, monthStrList];
};

function momCobaltBottomFcast() {
    list_bottom = [
        'tob'
    ]
    return list_bottom
};

function momCobaltStatsFcast() {
    stats_list = [
        'ensemble mean',
        'ensemble mean anomaly',
        'ensemble spread',
        'lower tercile probability',
        'middle tercile probability',
        'upper tercile probability'
    ]
    stats_value = [
        'ensmean',
        'ensmean_anomaly',
        'ens_min_max',
        'lower_tercile',
        'middle_tercile',
        'upper_tercile'
    ]
    return [stats_list, stats_value];
};

function momCobalt3DFcast() {
    list_3d = [
    ]
    return list_3d
};