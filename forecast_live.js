import { asyncInitializePlotlyResize } from './hindcast.js';
import { optionList,createMomCobaltCbarOpt } from './hindcast.js';
import { createDropdownOptions } from './hindcast.js';
import { showLoadingSpinner,hideLoadingSpinner } from './hindcast.js';
import { fetchVariableDepthBotOptions } from './hindcast.js';

import { fetchTreeDataPromise, fetchDataTreeJson, treeData, populateDropdown } from './data_access.js';


// async function to wait the treeData to be fetched
export async function useTreeData() {
  try {
    // Check if the promise already exists (i.e. pending or resolved)
    if (!fetchTreeDataPromise) {
      await fetchDataTreeJson(); // Trigger the fetch if it hasn't started
    } else {
      await fetchTreeDataPromise; // Wait for the existing fetch to complete
    }
    console.log('treeData loaded in other .js');
  } catch (error) {
    console.error('Error loading the treeData in  other .js:', error);
  }
}



// setup local global variable (data structure and filenaming structure)
var region;
var subdomain;
var experiment_type = 'seasonal_forecast';
var output_frequency;
var grid_type = 'regrid';
var release = 'r20250413';     // showing options provided in the json file
var data_category;
var variable_name;
var variable;
var depthValueFcast;
var blockValueFcast;


// Createing the data tree dropdowns
// Get dropdown elements
const level1 = document.getElementById('regMOMCobaltFcastLive');
const level2 = document.getElementById('subregMOMCobaltFcastLive');
const level4 = document.getElementById('freqMOMCobaltFcastLive');
const level7 = document.getElementById('dataCatMOMCobaltFcastLive');
const level8 = document.getElementById('varMOMCobaltFcastLive');


// make sure the treeData is fetched (top level await)
// Call the fetch function and initialize dropdowns after data is loaded
try {
    // Call the fetch function and wait for the data to be loaded
    await useTreeData();
  
    // Populate the first dropdown after data is loaded
    populateDropdown(level1, treeData);
  } catch (error) {
    console.error('Error fetching treeData:', error);
}

// Event listeners for dynamic updates
// region
level1.addEventListener('change', function () {
    region = level1.value;
    let options = treeData[region];
    populateDropdown(level2, options);
    populateDropdown(level4, null);
    populateDropdown(level7, null);
    populateDropdown(level8, null);
});

// subregion
level2.addEventListener('change', function () {
    subdomain = level2.value;
    let options = treeData[region][subdomain][experiment_type];
    populateDropdown(level4, options);
    populateDropdown(level7, null);
    populateDropdown(level8, null);
});

// output frequency
level4.addEventListener('change', function () {
    output_frequency = level4.value;
    let options = treeData[region][subdomain][experiment_type][output_frequency][grid_type][release];
    console.log(options)
    populateDropdown(level7, options);
    populateDropdown(level8, null);
});

// data category
level7.addEventListener('change', function () {
    data_category = level7.value;
    let options = treeData[region][subdomain][experiment_type][output_frequency][grid_type][release][data_category];
    populateDropdown(level8, options);
});

// variable
level8.addEventListener('change', function () {
    variable_name = level8.value;
    let options = treeData[region][subdomain][experiment_type][output_frequency][grid_type][release][data_category][variable_name];
    variable = Object.keys(options)[0];

    // depth option change
    $("#depthMOMCobaltFcastLive").empty();
    $("#blockMOMCobaltFcastLive").empty();
    updateDepthAndBlockOptions(region, output_frequency, variable);
});



// global constant for object ID
const momCobaltMapFcast = $('#momCobaltIFrameFcastLive');
const momCobaltBtnFcast = $("#momCobaltBtnFcastLive");
const clearFigOptBtnFcast = $("#clearFigOptBtnFcastLive")


// global info
var mapDataFcast = {}   // parsed html output
var locationDataFcast;


// Initial initYear options
createMomCobaltInitYearOpt('iniYearMOMCobaltFcastLive');
// Initial initMonth options
createMomCobaltInitMonthOpt('iniMonthMOMCobaltFcastLive');
// global variable for initial time 
let iniYear = $("#iniYearMOMCobaltFcastLive").val();
let iniMonth = $("#iniMonthMOMCobaltFcastLive").find("option:selected").text();

// global time slider related variables
const timeSliderFcast = $("#timeRangeFcastLive");
const tValueFcast = $(".timeValueFcastLive");
const initTValueFcast = $(".initTimeValueFcastLive");
// default initial time
initTValueFcast.text(iniMonth +' '+ iniYear)
// default tick lead time
const containerTickFcast = $(".ticksFcast");
var leadMonthList, leadIndex;
[leadIndex, leadMonthList] = generateFcastLeadMonth(
    parseInt($("#iniYearMOMCobaltFcastLive").val()),
    parseInt($("#iniMonthMOMCobaltFcastLive").val())
);
timeSliderFcast.attr("min", 0);
timeSliderFcast.attr("max", leadIndex.length - 1);
timeSliderFcast.val(0);
var leadFoliumFcast = leadMonthList[timeSliderFcast.val()];   // global
tValueFcast.text(leadFoliumFcast);
tickSpaceChangeFcast(leadMonthList)

// Initial stat options
createMomCobaltStatOptFcast();

// Initial depth and bottom options
updateDepthAndBlockOptions(region, output_frequency, variable);

// setup colorbar option
createMomCobaltCbarOpt('cbarOptsFcastLive');

// initialize plotly
$(document).ready(function() {
    asyncInitializePlotlyResize('forecastLive')
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
    $("div.mapForecastLive > div.workingTop").removeClass("hidden");
    $("div.mapForecastLive > div.errorTop").addClass("hidden");
    $("div.mapForecastLive > div.whiteTop").addClass("hidden");
    // update map
    replaceFoliumForecast()
    // update initial time
    iniYear = $("#iniYearMOMCobaltFcastLive").val();
    iniMonth = $("#iniMonthMOMCobaltFcastLive").find("option:selected").text();
    initTValueFcast.text(iniMonth +' '+ iniYear)
    // update tick lead time
    var newleadIndex, newleadMonthList;
    [newleadIndex, newleadMonthList] = generateFcastLeadMonth(
        parseInt($("#iniYearMOMCobaltFcastLive").val()),
        parseInt($("#iniMonthMOMCobaltFcastLive").val())
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
    $("div.mapForecastLive > div.workingTop").removeClass("hidden");
    $("div.mapForecastLive > div.errorTop").addClass("hidden");
    $("div.mapForecastLive > div.whiteTop").addClass("hidden");
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


// event listen for analyses change
$("#analysisMOMCobaltFcastLive").on("change", function(){
    var selectedValue = $('#analysisMOMCobaltFcastLive :selected').val();
    // $('#'+selectedValue.slice(0, -3)+'Tab').prop('checked', true);
    // showDiv(selectedValue.slice(0, -3),'view');
    $("#dashNavForecastLive > ul.nav-pills > li.nav-item").removeClass("active"); 
    $("#"+selectedValue.slice(0, -3)+'Pill').addClass("active");
    $("#dashNavForecastLive > ul.nav-tabs > li.nav-item").removeClass("active"); 
    $("#"+selectedValue.slice(0, -3)+'Tab').addClass("active");
    $("#dashContentForecastLive div.tab-pane").removeClass("active"); 
    $("#"+selectedValue.slice(0, -3)).addClass("active");
})


// add event listener for the "message" event using jQuery (location click)
$(window).on("message", receiveMessageFcast);

// time step function
$(document).ready(function() {
    // Add click event listeners using jQuery
    $('#lead-time-prev-forecastlive').on('click', function() {
        changeLeadTimeStep(-1);
    });

    $('#lead-time-next-forecastlive').on('click', function() {
        changeLeadTimeStep(1);
    });
});



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
    let elm = document.getElementById('statMOMCobaltFcastLive');
    let [stats_list, stats_value] = momCobaltStatsFcast()    
    let df = optionList(stats_list,stats_value);
    elm.appendChild(df);
};

// function for create option for depth and block depth
function updateDepthAndBlockOptions(regValue, freqValue, varValue, depthID='depthMOMCobaltFcastLive', blockID='blockMOMCobaltFcastLive') {
    // Change depth and block options for the new freq
    // Need to fetch the backend data for the depth options
    fetchVariableDepthBotOptions(
        regValue, subdomain, experiment_type, freqValue, grid_type, varValue
    ).then((jsonData) => {

        if (jsonData.depth === 0) {
            // Create the single layer options
            createDropdownOptions(depthID, ['single layer'], ['single_layer']);
        } else {
            // Create the depth options
            let depthlist = jsonData.depth;
            createDropdownOptions(depthID, depthlist, depthlist);
        }
        
        if (jsonData.bottom === 0) {
            console.log(jsonData.bottom);
            // Create the single layer options
            createDropdownOptions(blockID, ['not applicable'], ['not_applicable']);
        } else {
            // Create the depth options
            let bottomlist = jsonData.bottom;
            createDropdownOptions(blockID, bottomlist, bottomlist);
        }

        depthValueFcast = $('#'+depthID).val(); // initial depth value
        blockValueFcast = $('#'+blockID).val(); // initial block value

    }).catch(error => {
        console.error('Error in fetching depth options:', error);
    });

}



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
            var newMonth = month-12;
            var monthStr = newMonth < 10 ? "0" + newMonth : newMonth;
            leadMonth.push(iYear+1 + "-" + monthStr);
        }
    }

    return [leadIndex, leadMonth];
};



// function for advancing/recede to the next option in the list
function changeLeadTimeStep(timeStep) {
    var nextTime = parseInt(timeSliderFcast.val())+timeStep;
    timeSliderFcast.val(nextTime);
    $("div.mapForecastLive > div.workingTop").removeClass("hidden");
    $("div.mapForecastLive > div.errorTop").addClass("hidden");
    $("div.mapForecastLive > div.whiteTop").addClass("hidden");
    leadFoliumFcast = leadMonthList[timeSliderFcast.val()];
    tValueFcast.text(leadFoliumFcast);
    replaceFoliumForecast();
};


// function for replace folium overlap info (image and colorbar)
let varFoliumMapFcast;
let freqFoliumMap;
let statMapFcast;
let statMapFcastName;
let depthMapFcast;
let blockMapFcast;
function replaceFoliumForecast() {
    showLoadingSpinner("loading-spinner-map-FcastLive");
    varFoliumMapFcast = variable;
    freqFoliumMap = $("#freqMOMCobaltFcastLive").val();
    statMapFcast = $("#statMOMCobaltFcastLive").val();
    statMapFcastName = $('#statMOMCobaltFcastLive').find('option:selected').text()
    depthMapFcast = $("#depthMOMCobaltFcastLive").val();
    blockMapFcast = $("#blockMOMCobaltFcastLive").val();
    let cbar = $("#cbarOptsFcastLive");
    let maxval = $("#maxvalFcastLive");
    let minval = $("#minvalFcastLive");
    let nlevel = $("#nlevelFcastLive");

    var ajaxGet = "/cgi-bin/cefi_portal/vistab_mom_folium_forecast.py"
        +"?variable="+varFoliumMapFcast
        +"&region="+$("#regMOMCobaltFcastLive").val()
        +"&output_frequency="+freqFoliumMap
        +"&subdomain=full_domain"
        +"&experiment_type=seasonal_forecast"
        +"&grid_type=regrid"
        +"&iniyear="+$("#iniYearMOMCobaltFcastLive").val()
        +"&inimonth="+$("#iniMonthMOMCobaltFcastLive").val()
        +"&lead="+timeSliderFcast.val()
        +"&stat="+statMapFcast
        +"&depth="+depthMapFcast
        +"&block="+blockMapFcast
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
            // console.log(jsonData);
            mapDataFcast = {
                type: 'mapData',
                image: jsonData.image,
                image_bound: jsonData.image_bound,
                map_center: jsonData.map_center,
                map_crs: jsonData.map_crs,
                domain1: jsonData.domain1,
                domain2: jsonData.domain2,
                range: jsonData.range,
                tick: jsonData.tick,
                label: jsonData.label
            };
            // console.log(mapDataFcast)
            momCobaltMapFcast[0].contentWindow.postMessage(mapDataFcast, "*")

            $("div.mapForecastLive > div.workingTop").addClass("hidden");
            $("div.mapForecastLive > div.errorTop").addClass("hidden");
            $("div.mapForecastLive > div.whiteTop").removeClass("hidden");
            hideLoadingSpinner("loading-spinner-map-FcastLive");
        })
        .catch(error => {
            // Handle errors here
            $("div.mapForecastLive > div.workingTop").addClass("hidden");
            $("div.mapForecastLive > div.errorTop").removeClass("hidden");
            $("div.mapForecastLive > div.whiteTop").addClass("hidden");
            hideLoadingSpinner("loading-spinner-map-FcastLive");
            $("#fcastViewLive > div.workingTop").addClass("hidden");
            $("#fcastViewLive > div.errorTop").removeClass("hidden");
            $("#fcastViewLive > div.whiteTop").addClass("hidden");
            hideLoadingSpinner("loading-spinner-fcast-live-spread");
            console.error('Processing forecast live folium map error:', error);
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
                
                // displaying the variable value on iframe marker
                const promisevarValFcast = new Promise((resolve, reject) => {
                    getvarValFcast(locationDataFcast)  // function return promise obj from fetch
                        .then(varDataFcast => {
                            // send the value back to iframe
                            var varDataFcastJson = {
                                type: 'varValFcastData',
                                var: varDataFcast
                            };
                            momCobaltMapFcast[0].contentWindow.postMessage(varDataFcastJson, "*")
                            resolve();
                        })
                        .catch(error => {
                            console.error('Error in promisevarValFcastLive:', error);
                            reject(error);
                        });
                });

                // display forecast spread plotly
                plotTSFcast(locationDataFcast)
            }
        } 

        // console.log("Received data from iframe:", locationDataFcast);
        // console.log(event.originalEvent.origin);
    };
};

// function to get variable value based on locationData and dataFolium
function getvarValFcast(infoLonLat) {
    var ajaxGet = "/cgi-bin/cefi_portal/vistab_mom_folium_forecast_extract_value.py"
        +"?variable="+varFoliumMapFcast
        +"&region="+$("#regMOMCobaltFcastLive").val()
        +"&output_frequency="+freqFoliumMap
        +"&subdomain=full_domain"
        +"&experiment_type=seasonal_forecast"
        +"&grid_type=regrid"
        +"&stat="+statMapFcast
        +"&depth="+depthMapFcast
        +'&block='+blockMapFcast
        +"&lon="+infoLonLat.longitude
        +"&lat="+infoLonLat.latitude
        +"&iniyear="+$("#iniYearMOMCobaltFcastLive").val()
        +"&inimonth="+$("#iniMonthMOMCobaltFcastLive").val()
        +"&lead="+timeSliderFcast.val()
    
    console.log('https://webtest.psd.esrl.noaa.gov/'+ajaxGet)

    var ajaxGetPromise = fetch(ajaxGet)
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
    showLoadingSpinner("loading-spinner-fcast-live-spread");
    $("#fcastViewLive > div.workingTop").removeClass("hidden");
    $("#fcastViewLive > div.errorTop").addClass("hidden");
    $("#fcastViewLive > div.whiteTop").addClass("hidden");
    getTSFcasts(infoLonLat)     // the function return a promise obj from fetch
        .then((jsonData)=>{
            let singleList = ['ens_min_max','lower_tercile','upper_tercile','middle_tercile'];
            if (singleList.includes(statMapFcast)) {
                plotlyForecastRange(jsonData)
                $('#plotly-fcast-live-box').empty();
            } else {
                plotlyForecastSpread(jsonData)
                plotlyForecastBox(jsonData)
            }
            $("#fcastViewLive > div.workingTop").addClass("hidden");
            $("#fcastViewLive > div.errorTop").addClass("hidden");
            $("#fcastViewLive > div.whiteTop").removeClass("hidden");
            hideLoadingSpinner("loading-spinner-fcast-live-spread");
        })
        .catch((error)=>{
            $("#fcastViewLive > div.workingTop").addClass("hidden");
            $("#fcastViewLive > div.errorTop").removeClass("hidden");
            $("#fcastViewLive > div.whiteTop").addClass("hidden");
            hideLoadingSpinner("loading-spinner-fcast-live-spread");
            console.error(error);
        })
};

// function to fetch all forecast spread based on locationData
//  response in the json format (testing)
function getTSFcasts(infoLonLat) {
    var ajaxGet = "/cgi-bin/cefi_portal/vistab_mom_folium_forecast_extract_ts.py"
        +"?variable="+varFoliumMapFcast
        +"&region="+$("#regMOMCobaltFcastLive").val()
        +"&output_frequency="+freqFoliumMap
        +"&subdomain=full_domain"
        +"&experiment_type=seasonal_forecast"
        +"&grid_type=regrid"
        +"&stat="+statMapFcast
        +'&block='+blockMapFcast
        +"&depth="+depthMapFcast
        +"&lon="+infoLonLat.longitude
        +"&lat="+infoLonLat.latitude
        +"&iniyear="+$("#iniYearMOMCobaltFcastLive").val()
        +"&inimonth="+$("#iniMonthMOMCobaltFcastLive").val()
    
    console.log('https://webtest.psd.esrl.noaa.gov/'+ajaxGet)

    var ajaxGetPromise = fetch(ajaxGet)
        .then(response => {
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .catch(error => {
            // Handle errors here
            console.error('Fetch Forecast live time series error:', error);
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
        name: variable_name
    };

    var data = [trace];

    var trace2Color = "rgba(113, 29, 176, 0.1)";
    var totalEns = jsonData.total_ens_num;
    for (var i=1; i<=totalEns; i++) {
        var key = 'ens'+i
        console.log(jsonData[key])
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
        variable_name +' <br>' +
            ' @ (lat:'+parseFloat(jsonData.lat).toFixed(2)+'N,'+
                'lon:'+parseFloat(jsonData.lon).toFixed(2)+'E)',
        autosize: true,
        annotations: [{
            x: 0,
            y: 0,
            xref: 'paper',
            yref: 'paper',
            text: 'Source: NOAA CEFI data portal',
            showarrow: false
         }],
         width: 550,
         height: 400,
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
        dragmode: "select",
        responsive: true
    };

    Plotly.newPlot('plotly-fcast-live-spread', data, layout);
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
        name: variable_name
    };

    var data = [trace];

    var layout = {
        hovermode: 'closest',
        showlegend: false,
        title:
        variable_name +' <br>' +
            ' @ (lat:'+parseFloat(jsonData.lat).toFixed(2)+'N,'+
                'lon:'+parseFloat(jsonData.lon).toFixed(2)+'E)',
        autosize: true,
        annotations: [{
            x: 0,
            y: 0,
            xref: 'paper',
            yref: 'paper',
            text: 'Source: NOAA CEFI data portal',
            showarrow: false
         }],
         width: 500,
         height: 400,
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
        dragmode: "select",
        responsive: true
    };
    var config = {responsive: true}
    Plotly.newPlot('plotly-fcast-live-spread', data, layout,config);
};

// function for creating the plotly time series box plot
function plotlyForecastBox(jsonData) {
    var yformat = decimal_format(jsonData.mean);
    var trace1Color = "rgba(113, 29, 176, 0.8)";
    var xData = leadMonthList;
    var yData = [];
    var totalEns = jsonData.total_ens_num;
    var totalLead = 12;
    for (var l=0; l<=totalLead-1; l++) {
        var ens = []
        for (var i=1; i<=totalEns; i++) {
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

    var layout = {
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
         width: 530,
         height: 400,
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
        dragmode: "select",
        responsive: true
    };
    var config = {responsive: true}

    Plotly.newPlot('plotly-fcast-live-box', data, layout,config);

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

// functions for regions options lists (Manual entering)
function momCobaltRegs() {
    let var_options = [
        "Northwest Atlantic"
    ];
    let var_values = [
        "northwest_atlantic"
    ];
    return [var_options, var_values];
}


// functions for generating year list for initial time (Manual entering)
function momCobaltInitYear(startYear = 2025, endYear = 2025) {
    var yearList = [];

    for (var year = startYear; year <= endYear; year++) {
        yearList.push(year)
    }

    return yearList;
};

// functions for generating month list for initial time (Manual entering)
function momCobaltInitMonth() {
    // var monthList = [3,6,9,12];
    var monthList = [4];
    var monthStrList = ['April']
    // var monthStrList = ['March','June','September','December']
    return [monthList, monthStrList];
};

function momCobaltStatsFcast() {
    var stats_list = [
        'ensemble mean',
        'ensemble mean anomaly',
        'ensemble spread',
        'lower tercile probability',
        'middle tercile probability',
        'upper tercile probability'
    ]
    var stats_value = [
        'ensmean',
        'ensmean_anomaly',
        'ens_min_max',
        'lower_tercile',
        'middle_tercile',
        'upper_tercile'
    ]
    return [stats_list, stats_value];
};
