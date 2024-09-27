// global constant for object ID
const momCobaltMapFcastMHW = $('#momCobaltIFrameFcastMHW');
const dashDropDownID = 'analysisMOMCobaltFcastMHW'
const dashNavPillID = 'dashNavForecastMHW'
const dashContentID = 'dashContentForecastMHW'

// global info
var mapDataFcastMHW = {};   // parsed html output
var locationDataFcastMHW;   // lcoation info from the mom_folium

// Initial initYear options (using forecast.js function)
window.createMomCobaltInitYearOpt('iniYearMOMCobaltFcastMHW');
// Initial initMonth options (using forecast.js function)
window.createMomCobaltInitMonthOpt('iniMonthMOMCobaltFcastMHW');


// global variable for initial time 
let iniYearMHW = $("#iniYearMOMCobaltFcastMHW").val();
let iniMonthMHW = $("#iniMonthMOMCobaltFcastMHW").find("option:selected").text();

// global time slider related variables
const timeSliderFcastMHW = $("#timeRangeFcastMHW");
// forecast time title
const tValueFcastMHW = $(".timeValueFcastMHW");
// initial time title
const initTValueFcastMHW = $(".initTimeValueFcastMHW");

// default initial time
initTValueFcastMHW.text(iniMonthMHW +' '+ iniYearMHW)
// default tick lead time
const containerTickFcast = $(".ticksFcast");

// find default time tick info (using forecast.js function)
var leadMonthListMHW, leadIndexMHW;
[leadIndexMHW, leadMonthListMHW] = window.generateFcastLeadMonth(
    iYear = parseInt($("#iniYearMOMCobaltFcastMHW").val()),
    iMonth = parseInt($("#iniMonthMOMCobaltFcastMHW").val())
);

// set default time slider info
timeSliderFcastMHW.attr("min", 0);
timeSliderFcastMHW.attr("max", leadIndexMHW.length - 1);
timeSliderFcastMHW.val(0);

// set default forecast time title
var leadFoliumFcastMHW = leadMonthListMHW[timeSliderFcastMHW.val()];   // global
tValueFcastMHW.text(leadFoliumFcastMHW);

// screen size specific adjustment (using forecast.js function)
window.tickSpaceChangeFcast(leadMonthListMHW)

// Initial stat options (using historical.js function)
window.createMomCobaltOpt_singleID('statMOMCobaltFcastMHW',momCobaltStatsFcastMHW)

// setup colorbar option (using historical.js function)
window.createMomCobaltCbarOpt('cbarOptsFcastMHW','inferno');

// initialize the plotly
window.initializePlotly('mhwForecast')

/////////////////  event listener  ////////////////
// screen size adjustment trigger by window resizing
$(window).resize(function() {
    window.tickSpaceChangeFcast(leadMonthListMHW);
});

// add event listener on figure all clear button
$("#tMHWButtonMinusOne").on("click", function () {
    changeLeadTimeStep(-1);
});
$("#tMHWButtonPlusOne").on("click", function () {
    changeLeadTimeStep(1);
});

// add event listener on figure all clear button
$("#clearFigOptBtnFcastMHW").on("click", function () {
    $("input.figOpt").val('');
});

// add event listener on create map button
$("#momCobaltBtnFcastMHW").on("click", function () {

    // update map
    replaceFoliumForecastMHW()

    // update initial time
    iniYearMHW = $("#iniYearMOMCobaltFcastMHW").val();
    iniMonthMHW = $("#iniMonthMOMCobaltFcastMHW").find("option:selected").text();
    initTValueFcastMHW.text(iniMonthMHW +' '+ iniYearMHW)

    // update tick lead time reassign global variables
    var newleadIndex, newleadMonthList;
    [newleadIndex, newleadMonthList] = window.generateFcastLeadMonth(
        iYear = parseInt($("#iniYearMOMCobaltFcastMHW").val()),
        iMonth = parseInt($("#iniMonthMOMCobaltFcastMHW").val())
        );
    leadIndexMHW = newleadIndex
    leadMonthListMHW = newleadMonthList

    // update forecast time title
    leadFoliumFcastMHW = leadMonthListMHW[timeSliderFcastMHW.val()];   // global
    tValueFcastMHW.text(leadFoliumFcastMHW);

    // remove marker on the leaflet map when ever there is figure update (resetting)
    var removeMarker = {
        type: 'removeMarker'
    };
    momCobaltMapFcastMHW[0].contentWindow.postMessage(removeMarker, "*")
    
});

// event listener for updating the figure (when mouse up the slider handle)
timeSliderFcastMHW.on("mouseup", function() {
    // set forecast time (title is set when mouse move)
    leadFoliumFcastMHW = leadMonthListMHW[$(this).val()];

    // update map
    replaceFoliumForecastMHW()
    
    // remove marker on the leaflet map when ever there is figure update (resetting)
    var removeMarker = {
        type: 'removeMarker'
    };
    momCobaltMapFcastMHW[0].contentWindow.postMessage(removeMarker, "*")
});

// event listener for updating the slider value when sliding
timeSliderFcastMHW.on("input", function() {
    // update forecast time title
    leadFoliumFcastMHW = leadMonthListMHW[$(this).val()];
    tValueFcastMHW.text(leadFoliumFcastMHW);
});


// event listen for analyses dashboard dropdown change
$("#"+dashDropDownID).on("change", function(){
    // Related ID name 
    //    dropdown option ID = xxxVal
    //    content ID = xxx
    //    navpil ID = xxxPill
    // get the dropdown option ID name
    var selectedValue = $('#'+dashDropDownID+' :selected').val();
    // change the active navpil
    $("#"+dashNavPillID+" > ul.nav-pills > li.nav-item").removeClass("active"); 
    $("#"+selectedValue.slice(0, -3)+'Pill').addClass("active");
    // change the active navpil content
    $("#"+dashContentID+" div.tab-pane").removeClass("active"); 
    $("#"+selectedValue.slice(0, -3)).addClass("active");
})

// event listener for navpil being clicked
$("#"+dashNavPillID+" > ul.nav-pills > li.nav-item > .nav-link").on('click',function(){
    let hrefID = $(this).attr('href')
    let hrefIDText = hrefID.slice(1)
    // reuse changeDashSelect (historical.js) 
    window.changeDashSelect(dashDropDownID,hrefIDText+'Val')
}); 

// event listener for the "message" event when map location click
$(window).on("message", receiveMessageFcastMHW);


/////////////////////// function section /////////////////////
// function for advancing/recede to the next option in the list
//   used directly in html page button with attribute onclick
function changeLeadTimeStep(timeStep) {
    var nextTime = parseInt(timeSliderFcastMHW.val())+timeStep;
    timeSliderFcastMHW.val(nextTime);
    leadFoliumFcastMHW = leadMonthListMHW[timeSliderFcastMHW.val()];
    tValueFcastMHW.text(leadFoliumFcastMHW);
    replaceFoliumForecastMHW();
};


// function for replace folium overlap info (image and colorbar)
let statMapFcastMHW;
let statMapFcastNameMHW;
function replaceFoliumForecastMHW() {
    showLoadingSpinner("loading-spinner-map-Fcastmhw");
    statMapFcastMHW = $("#statMOMCobaltFcastMHW").val();
    statMapFcastNameMHW = $('#statMOMCobaltFcastMHW').find('option:selected').text()
    let cbar = $("#cbarOptsFcastMHW")
    let maxval = $("#maxvalFcastMHW");
    let minval = $("#minvalFcastMHW");
    let nlevel = $("#nlevelFcastMHW");

    var ajaxGet = "/cgi-bin/cefi_portal/mom_folium_fcast_mhw.py"
        +"?region="+$("#regMOMCobaltFcastMHW").val()
        +"&iniyear="+$("#iniYearMOMCobaltFcastMHW").val()
        +"&inimonth="+$("#iniMonthMOMCobaltFcastMHW").val()
        +"&lead="+timeSliderFcastMHW.val()
        +"&stat="+statMapFcastMHW
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
            return response.json();
        })
        .then(jsonData => {
            // Process the response data here
            mapDataFcastMHW = {
                type: 'mapData',   // used in hindcast_mom.js for type check
                image: jsonData.image,
                domain1: jsonData.domain1,
                domain2: jsonData.domain2,
                range: jsonData.range,
                tick: jsonData.tick,
                label: jsonData.label
            };
            // console.log(mapDataFcastMHW)
            momCobaltMapFcastMHW[0].contentWindow.postMessage(mapDataFcastMHW, "*")

            hideLoadingSpinner("loading-spinner-map-Fcastmhw");
        })
        .catch(error => {
            // Handle errors here
            console.error('Processing mhw forecast folium map error:', error);
        });

    // momCobaltMap.attr("src", ajaxGet)
};

// function for retrieving lon lat from iframe leaflet
//   getting the lon lat from iframe and send to 
//   server to get
//   1. value of the marker on the shading
var varDataFcastMHW = null
function receiveMessageFcastMHW(event) {
    // Access the data sent from the iframe
    if (event.originalEvent.origin === window.location.origin) {
        // console.log(event.originalEvent)
        if (event.originalEvent.data.type === 'locationData') {
            locationDataFcastMHW = event.originalEvent.data;    
            // displaying the variable value on iframe marker
            const promisevarValFcast = new Promise((resolve, reject) => {
                getvarValFcastMHW(locationDataFcastMHW)  // function return promise obj from fetch
                    .then(varDataFcastMHW => {
                        // send the value back to iframe
                        var dataJson = {
                            type: 'varValFcastData',
                            var: varDataFcastMHW
                        };
                        momCobaltMapFcastMHW[0].contentWindow.postMessage(dataJson, "*")
                        resolve();
                    })
                    .catch(error => {
                        console.error('Error in promisevarValFcast:', error);
                        reject(error);
                    });
            });

            // display forecast spread plotly
            // plotTSFcast(locationDataFcastMHW)
            
        }

        // console.log("Received data from iframe:", locationDataFcastMHW);
        // console.log(event.originalEvent.origin);
    };
};

// function to get variable value based on locationData and dataFolium
function getvarValFcastMHW(infoLonLat) {
    var ajaxGet = "/cgi-bin/cefi_portal/mom_extract_variableValue_fcast_mhw.py"
        +"?region="+$("#regMOMCobaltFcastMHW").val()
        +"&stat="+statMapFcastMHW
        +"&lon="+infoLonLat.longitude
        +"&lat="+infoLonLat.latitude
        +"&iniyear="+$("#iniYearMOMCobaltFcastMHW").val()
        +"&inimonth="+$("#iniMonthMOMCobaltFcastMHW").val()
        +"&lead="+timeSliderFcastMHW.val()
    
    console.log('https://webtest.psd.esrl.noaa.gov/'+ajaxGet)

    const ajaxGetPromise = fetch(ajaxGet)
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
            console.error('Fetch MHW value error:', error);
        });


    return ajaxGetPromise
};

// // function for setting up promises in Forecast TS spread(execute order for async)
// //  1. input lon lat location 
// //  2. Fetch forecast TSs (setup promise)
// //  3. create plotly object on webpage (execute when promise resolved)
// function plotTSFcastMHW(infoLonLat) {
//     showLoadingSpinner("loading-spinner-fcastmhw-spread");
//     getTSFcastsMHW(infoLonLat)     // the function return a promise obj from fetch
//         .then((jsonData)=>{
//             plotlyForecastSpread(jsonData)
//             plotlyForecastBox(jsonData)
//             hideLoadingSpinner("loading-spinner-fcastmhw-spread");
//         })
//         .catch((error)=>{
//             console.error(error);
//         })
// };

// // function to fetch all forecast spread based on locationData
// //  response in the json format (testing)
// function getTSFcasts(infoLonLat) {
//     var ajaxGet = "/cgi-bin/cefi_portal/mom_extract_timeseries_fcast.py"
//         +"?variable="+varFoliumMapFcastMHW
//         +"&region="+$("#regMOMCobaltFcast").val()
//         +"&stat="+statMapFcastMHW
//         +"&depth="+depthMapFcast
//         +"&lon="+infoLonLat.longitude
//         +"&lat="+infoLonLat.latitude
//         +"&iniyear="+$("#iniYearMOMCobaltFcast").val()
//         +"&inimonth="+$("#iniMonthMOMCobaltFcast").val()
    
//     console.log('https://webtest.psd.esrl.noaa.gov/'+ajaxGet)

//     ajaxGetPromise = fetch(ajaxGet)
//         .then(response => {
//             if (!response.ok) {
//             throw new Error('Network response was not ok');
//             }
//             return response.json();
//         })
//         .catch(error => {
//             // Handle errors here
//             console.error('Fetch time series error:', error);
//         });

//     return ajaxGetPromise
// };

// // function for creating the plotly forecast spread time series
// function plotlyForecastSpread(jsonData) {
//     var yformat = decimal_format(jsonData.mean);

//     var trace1Color = "rgba(113, 29, 176, 0.7)";
//     var trace = {
//         x: leadMonthListMHW,
//         y: jsonData.mean,
//         type: 'scatter',
//         mode: 'lines+markers',
//         marker: { size: 5 },
//         line: { 
//             shape: 'linear',
//             color: trace1Color,
//             width: 3 
//         },
//         // name: statMap+' time series',
//         name: varnameFcast
//     };

//     var data = [trace];

//     var trace2Color = "rgba(113, 29, 176, 0.1)";
//     for (var i=1; i<=10; i++) {
//         var key = 'ens'+i
//         var trace_ens = {
//             x: leadMonthListMHW,
//             y: jsonData[key],
//             type: 'scatter',
//             mode: 'lines+markers',
//             marker: { size: 2 },
//             line: { 
//                 shape: 'linear',
//                 color: trace2Color },
//             // name: statMap+' time series',
//             name: key
//         };
//         data.push(trace_ens)
//     }
    

//     var layout = {
//         hovermode: 'closest',
//         showlegend: false,
//         title:
//         varnameFcast +' <br>' +
//             ' @ (lat:'+parseFloat(jsonData.lat).toFixed(2)+'N,'+
//                 'lon:'+parseFloat(jsonData.lon).toFixed(2)+'E)',
//         //   autosize: true,
//         annotations: [{
//             x: 0,
//             y: 0,
//             xref: 'paper',
//             yref: 'paper',
//             text: 'Source: NOAA CEFI data portal',
//             showarrow: false
//          }],
//         //  width: 550,
//         //  height: 400,
//          margin: {
//             l: 80,
//             r: 80,
//             b: 80,
//             t: 100,
//             // pad: 4
//           },
//         xaxis: {
//             title: 'Lead time'
//         },
//         yaxis: {
//             title: {
//                 text: statMapFcastNameMHW + ' (' + jsonData.units + ')',
//                 standoff: 10,
//                 font: { color: trace1Color }
//             },
//             tickfont: { color: trace1Color },
//             tickformat: yformat,
//             tickmode: 'auto'
//         },
//         modebar: {
//             remove: ["autoScale2d", "autoscale", "zoom", "zoom2d", ]
//         },
//         dragmode: "select"
//         // responsive: true
//     };

//     Plotly.newPlot('plotly-fcast-spread', data, layout);
// };

// // function for creating the plotly forecast ensemble range time series
// function plotlyForecastRange(jsonData) {
//     var yformat = decimal_format(jsonData.spread);

//     var trace1Color = "rgba(113, 29, 176, 0.7)";
//     var trace = {
//         x: leadMonthListMHW,
//         y: jsonData.spread,
//         type: 'scatter',
//         mode: 'lines+markers',
//         marker: { size: 5 },
//         line: { 
//             shape: 'linear',
//             color: trace1Color,
//             width: 3 
//         },
//         // name: statMap+' time series',
//         name: varnameFcast
//     };

//     var data = [trace];

//     var layout = {
//         hovermode: 'closest',
//         showlegend: false,
//         title:
//         varnameFcast +' <br>' +
//             ' @ (lat:'+parseFloat(jsonData.lat).toFixed(2)+'N,'+
//                 'lon:'+parseFloat(jsonData.lon).toFixed(2)+'E)',
//         //   autosize: true,
//         annotations: [{
//             x: 0,
//             y: 0,
//             xref: 'paper',
//             yref: 'paper',
//             text: 'Source: NOAA CEFI data portal',
//             showarrow: false
//          }],
//         //  width: 1000,
//         //  height: 400,
//          margin: {
//             l: 80,
//             r: 80,
//             b: 80,
//             t: 100,
//             // pad: 4
//           },
//         xaxis: {
//             title: 'Lead time'
//         },
//         yaxis: {
//             title: {
//                 text: statMapFcastNameMHW + ' (' + jsonData.units + ')',
//                 standoff: 10,
//                 font: { color: trace1Color }
//             },
//             tickfont: { color: trace1Color },
//             tickformat: yformat,
//             tickmode: 'auto'
//         },
//         modebar: {
//             remove: ["autoScale2d", "autoscale", "zoom", "zoom2d", ]
//         },
//         dragmode: "select"
//         // responsive: true
//     };
//     var config = {responsive: true}
//     Plotly.newPlot('plotly-fcast-spread', data, layout,config);
// };

// // function for creating the plotly time series box plot
// function plotlyForecastBox(jsonData) {
//     var yformat = decimal_format(jsonData.mean);
//     var trace1Color = "rgba(113, 29, 176, 0.8)";
//     var xData = leadMonthListMHW;
//     var yData = [];
//     for (var l=0; l<=11; l++) {
//         var ens = []
//         for (var i=1; i<=10; i++) {
//             var key = 'ens'+i
//             ens.push(jsonData[key][l]);
//         }
//         yData.push(ens);
//     };

//     var data = [];

//     for ( var i = 0; i < xData.length; i ++ ) {
//         var result = {
//             type: 'box',
//             y: yData[i],
//             name: xData[i],
//             boxpoints: false,
//             // jitter: 0.3,
//             // pointpos: -1.8,
//             type: 'box',
//             boxmean: 'sd',
//             // boxpoints: 'all',
//             // jitter: 0.5,
//             whiskerwidth: 1,
//             // fillcolor: none,
//             marker: {
//                 size: 1,
//                 color: trace1Color 
//             },
//             line: {
//                 width: 1,
//                 color: trace1Color 
//             }
//         };
//         data.push(result);
//     };

//     layout = {
//         hovermode: 'closest',
//         showlegend: false,
//         title: 'Ensemble spread at each lead',
//         annotations: [{
//             x: 0,
//             y: 0,
//             xref: 'paper',
//             yref: 'paper',
//             text: 'Source: NOAA CEFI data portal',
//             showarrow: false
//          }],
//         //  width: 530,
//         //  height: 400,
//          margin: {
//             l: 80,
//             r: 80,
//             b: 80,
//             t: 100,
//             // pad: 4
//           },
//         xaxis: {
//             title: 'Lead time'
//         },
//         yaxis: {
//             title: {
//                 text: statMapFcastNameMHW + ' (' + jsonData.units + ')',
//                 standoff: 10,
//                 font: { color: trace1Color }
//             },
//             tickfont: { color: trace1Color },
//             tickformat: yformat,
//             tickmode: 'auto'
//         },
//         modebar: {
//             remove: ["autoScale2d", "autoscale", "zoom", "zoom2d", ]
//         },
//         dragmode: "select"
//         // responsive: true
//     };
//     var config = {responsive: true}

//     Plotly.newPlot('plotly-fcast-box', data, layout,config);

// };

// // function for deciding the y tick numerical format
// function decimal_format(numArray) {
//     var format = '.2f';
//     var maxVal = Math.max(...numArray);
//     var minVal = Math.min(...numArray);
//     var diff = Math.abs(maxVal-minVal);
//     if (diff< 0.01) {
//         format = '.2e';
//     }
//     return format
// };

///////// information function start /////////

function momCobaltStatsFcastMHW() {
    stats_list = [
        'MHW probability (90th)',
        'MHW magnitude'
    ]
    stats_value = [
        'mhw_prob90',
        'ssta_avg'
    ]
    return [stats_list, stats_value];
};
