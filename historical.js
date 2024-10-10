// global constant for object ID
const momCobaltMap = $('#momCobaltIFrame');
const momCobaltBtn = $("#momCobaltBtn");
const clearFigOptBtn = $("#clearFigOptBtn")
var mapData = {}   // parsed html output
// var image_data = ''    // png encoding

// global info
var locationData;
var polygonData;

// monthly and daily list for creating the time slider
let freq_list = momCobaltVars();
let monthly_list = [];
let daily_list = [];
for (let i = 0; i < freq_list[2].length; i++) { 
    if (freq_list[2][i] === "monthly") {
        monthly_list.push(freq_list[1][i])
    } else if (freq_list[2][i] === "daily") {
        daily_list.push(freq_list[1][i])
    }
}


// Default time slider related variables
const timeSlider = $("#timeRange");
const tValue = $(".timeValue");
const containerTick = $(".ticks");
var yearValues, rangeValues;
[yearValues, rangeValues] = generateDateList();
timeSlider.attr("min", 0);
timeSlider.attr("max", rangeValues.length - 1);
timeSlider.val(rangeValues.length - 1);
var dateFolium = rangeValues[timeSlider.val()];   // global
tValue.text(dateFolium);
tickSpaceChange();

// Initial region options (for all region options)
createMomCobaltOpt('reg-mom-cobalt',momCobaltRegs);

// Initial variable options based on dataset
createMomCobaltVarOpt('MOMCobalt','varMOMCobalt');

// Initial stat options
createMomCobaltStatOpt();

// Initial depth options based on variable
createMomCobaltDepthOpt('tos','depthMOMCobalt');

// Initial depth block options based on variable
createMomCobaltDepthBlockOpt('tos');

// setup colorbar option
createMomCobaltCbarOpt();

// Initial variable options based on dataset for second TS
createMomCobaltVarOpt('MOMCobalt+Index','varMOMCobaltTS2');
$('#varMOMCobaltTS2').val('');

// Initial depth options based on dataset for second TS
createMomCobaltDepthOpt('tos','depthMOMCobaltTS2');
$('#depthMOMCobaltTS2').val('');

// Initial variable options based on dataset for second TS
createMomCobaltVarOpt('onlyIndexes','indexMOMCobaltTS');

// initialize plotly
$(document).ready(function() {
    asyncInitializePlotlyResize('all')
});
// initializePlotly('all');

// plot index
plotIndexes();



/// setup the variable for variable options in the page
let varnamelist = momCobaltVars();
let varind = varnamelist[1].indexOf($("#varMOMCobalt").val())
let varname = varnamelist[0][varind]

let varnamelist2 = momCobaltVars();
let indexlist2 = indexes();
varnamelist2[0] = varnamelist2[0].concat(indexlist2[0]);
varnamelist2[1] = varnamelist2[1].concat(indexlist2[1]);
let varind2 = varnamelist2[1].indexOf($("#varMOMCobaltTS2").val())
let varname2 = varnamelist2[0][varind2]





/////////////// event listener ///////////

// // add the initial time options 
// createMomCobaltIniOpt(dataCobaltID);

$(window).resize(function() {
    tickSpaceChange();
});


// event listen for variable change
$("#varMOMCobalt").on("change", function(){

    // varname
    varind = varnamelist[1].indexOf($("#varMOMCobalt").val())
    varname = varnamelist[0][varind]

    // depth option change
    $("#depthMOMCobalt").empty();
    createMomCobaltDepthOpt($("#varMOMCobalt").val(),"depthMOMCobalt");
    $("#blockMOMCobalt").empty();
    createMomCobaltDepthBlockOpt($("#varMOMCobalt").val());


    // time slider change
    var selectVarIndex = $("#varMOMCobalt").prop('selectedIndex');
    if (freq_list[2][selectVarIndex] === 'daily'){
        // change if dateFolium is origianly in monthly format
        if (dateFolium.length === 7){
            [yearValues, rangeValues] = generateDailyDateList();
            timeSlider.attr("min", 0);
            timeSlider.attr("max", rangeValues.length - 1);
            const foundIndex = rangeValues.indexOf(dateFolium+"-01");
            timeSlider.val(foundIndex);
            dateFolium = rangeValues[timeSlider.val()];
        }
    } else if (freq_list[2][selectVarIndex] === 'monthly'){
        // change if dateFolium is origianly in daily format
        if (dateFolium.length === 10){
            [yearValues, rangeValues] = generateDateList();
            timeSlider.attr("min", 0);
            timeSlider.attr("max", rangeValues.length - 1);
            const foundIndex = rangeValues.indexOf(dateFolium.slice(0, -3));
            timeSlider.val(foundIndex);
            dateFolium = rangeValues[timeSlider.val()];
        }
    };
    
    // console.log(dateFolium)
    // if (monthly_list.indexOf($(this).val()) === -1) {
    //     if (dateFolium.length === 7){
    //         [yearValues, rangeValues] = generateDailyDateList();
    //         timeSlider.attr("min", 0);
    //         timeSlider.attr("max", rangeValues.length - 1);
    //         const foundIndex = rangeValues.indexOf(dateFolium+"-01");
    //         timeSlider.val(foundIndex);
    //         dateFolium = rangeValues[timeSlider.val()];
    //     }
    // } else if (daily_list.indexOf($(this).val()) === -1) {
    //     if (dateFolium.length === 10){
    //         [yearValues, rangeValues] = generateDateList();
    //         timeSlider.attr("min", 0);
    //         timeSlider.attr("max", rangeValues.length - 1);
    //         const foundIndex = rangeValues.indexOf(dateFolium.slice(0, -3));
    //         timeSlider.val(foundIndex);
    //         dateFolium = rangeValues[timeSlider.val()];
    //     }
    // }
    // console.log(dateFolium)
    tValue.text(dateFolium);
});

// event listen for analyses dashboard dropdown change with nav pil
$("#analysisMOMCobalt").on("change", function(){
    // Related ID name 
    //    dropdown option ID = xxxVal
    //    content ID = xxx
    //    navpil ID = xxxPill
    // get the dropdown option ID name
    var selectedValue = $('#analysisMOMCobalt :selected').val();
    // change the active navpil
    $("#dashNavHistrun > ul.nav-pills > li.nav-item").removeClass("active"); 
    $("#"+selectedValue.slice(0, -3)+'Pill').addClass("active");
    // change the active navtab
    $("#dashNavHistrun > ul.nav-tabs > li.nav-item").removeClass("active");
    $("#"+selectedValue.slice(0, -3)+'Tab').addClass("active");
    // change the active navpil content
    $("#dashContentHistrun div.tab-pane").removeClass("active"); 
    $("#"+selectedValue.slice(0, -3)).addClass("active");
    // Manually trigger a resize event for triggering plotly resizing 
    window.dispatchEvent(new Event('resize'));
    
})

// event listener for navpil being clicked
$("#dashNavHistrun > ul.nav-pills > li.nav-item > .nav-link").on('click',function(){
    let hrefID = $(this).attr('href');
    let hrefIDText = hrefID.slice(1);
    changeDashSelect('analysisMOMCobalt',hrefIDText+'Val');
    window.dispatchEvent(new Event('resize'));
}); 

// event listener for navtab being clicked
$("#dashNavHistrun > ul.nav-tabs > li.nav-item > .nav-link").on('click',function(){
    let hrefID = $(this).attr('href');
    let hrefIDText = hrefID.slice(1);
    changeDashSelect('analysisMOMCobalt',hrefIDText+'Val');
    window.dispatchEvent(new Event('resize'));
});

// // event listener for clicking the minitab
// $('input[name="analysestabs"]').click(function() {
//     // Check which radio button is clicked
//     if ($(this).is(':checked')) {
//         var selectedID = $(this).attr('id');
//         changeSelectOpt(selectedID.slice(0, -3),'analysisMOMCobalt','view')
//         // console.log('Selected option id:', $(this).attr('id'));
//     }
// });


// Update the figure (when mouse up the slider handle)
timeSlider.on("mouseup", function() {
    $("div.workingTop").removeClass("hidden");
    $("div.errorTop").addClass("hidden");
    $("div.whiteTop").addClass("hidden");
    dateFolium = rangeValues[$(this).val()];
    // fetchDataAndPost(dateFolium)
    replaceFolium()
});

// Update the current slider value (each time you drag the slider handle)
timeSlider.on("input", function() {
    dateFolium = rangeValues[$(this).val()];
    tValue.text(dateFolium);
});


// add event listener on create map button
momCobaltBtn.on("click", function () {
    // $("div.workingTop").removeClass("hidden");
    // $("div.errorTop").addClass("hidden");
    // $("div.whiteTop").addClass("hidden");
    replaceFolium()
    // $('#varMOMCobaltTS2').val('');
    // $("#depthMOMCobaltTS2").val('');
});

// add event listener on figure all clear button
clearFigOptBtn.on("click", function () {
    $("input.figOpt").val('');
});



// add event listener on reset time series select in plotly
$("#clearTSselectBtn").on("click", function () {
    if (locationData !== undefined && locationData !== null) {
        if (varFoliumMap !== undefined && varFoliumMap !== null) {
            if ($('#varMOMCobaltTS2').val() !== undefined && $('#varMOMCobaltTS2').val() !== null) {
                plotTSs(locationData)
            } else {
                plotTS1(locationData);
            }
        }
    }
});

// add event listener on reset time series select in plotly
$("#clearTS2Btn").on("click", function () {
    $('#varMOMCobaltTS2').val('');
    $('#depthMOMCobaltTS2').val('');
    if (locationData !== undefined && locationData !== null) {
        if (varFoliumMap !== undefined && varFoliumMap !== null) {
            plotTS1(locationData);
        }
    }
});


// add event listener for the "message" event using jQuery (location click)
$(window).on("message", receiveMessage);


// add event listener on adding 2nd time series in plotly
$('#varMOMCobaltTS2').on("change", function () {

    // depth option change
    $("#depthMOMCobaltTS2").empty();
    createMomCobaltDepthOpt($("#varMOMCobaltTS2").val(),"depthMOMCobaltTS2");

    // varname2
    varind2 = varnamelist2[1].indexOf($("#varMOMCobaltTS2").val())
    varname2 = varnamelist2[0][varind2]

    if (locationData !== undefined && locationData !== null) {
        if (varFoliumMap !== undefined && varFoliumMap !== null) {
            if ($('#varMOMCobaltTS2').val() !== undefined && $('#varMOMCobaltTS2').val() !== null) {
                plotTSs(locationData)
            } else {
                plotTS1(locationData);
            }
        }
    }
});

// add event listener on selecting depth for 3d 2nd variable
$('#depthMOMCobaltTS2').on("change", function () {
    if (locationData !== undefined && locationData !== null) {
        if (varFoliumMap !== undefined && varFoliumMap !== null) {
            if ($('#varMOMCobaltTS2').val() !== undefined && $('#varMOMCobaltTS2').val() !== null) {
                plotTSs(locationData)
            } else {
                plotTS1(locationData);
            }
        }
    }
});

// add event listener on selecting depth for 3d 2nd variable
$('#indexMOMCobaltTS').on("change", function () {
    plotIndexes()
});


///////// functional function start /////////
// intialize the plotly plot
// Initial dashboard plot
function asyncInitializePlotlyResize(flag) {
    return initializePlotly(flag)
        .then(() => {
            window.dispatchEvent(new Event('resize'));
        })
        .catch(error => {
            console.error('Error in async plotly initialization:', error);
        });
}

function initializePlotly(flag) {
    var trace = {
        x: "",
        y: "",
        type: 'scatter',
        mode: 'lines+markers',
        marker: { size: 8 },
        line: { shape: 'linear' },
        name: ""
    };
  
    var layoutTS = {
        title: 
        'Click on map for time series',
        //   autosize: true,
        // width: 1000,
        // height: 400,
        xaxis: { title: 'Date' },
        yaxis: { title: 'Variable' },
        hovermode: 'closest',
        showlegend: false,
        // responsive: true
    };

    var layoutBox = {
        title: 
        'Box plot',
        //   autosize: true,
        // width: 1000,
        // height: 400,
        hovermode: 'closest',
        showlegend: false,
        // responsive: true
    };

    var layoutHist = {
        title: 
        'Histogram',
        //   autosize: true,
        // width: 1000,
        // height: 400,
        hovermode: 'closest',
        showlegend: false,
        // responsive: true
    };

    var layoutProf = {
        title: 
        'Profile',
        //   autosize: true,
        // width: 1000,
        // height: 400,
        hovermode: 'closest',
        showlegend: false,
        // responsive: true
    };

    var layout2 = {
        title: 
        'Draw polyline on map',
        //   autosize: true,
        // width: 1000,
        // height: 400,
        xaxis: { title: 'Date' },
        yaxis: { title: 'Variable' },
        hovermode: 'closest',
        showlegend: false,
        // responsive: true
    };

    var layoutFcst = {
        title: 
        'Create Forecast Map first<br>& pick point on the shaded area',
        //   autosize: true,
        // width: 1000,
        // height: 400,
        xaxis: { title: 'Date' },
        yaxis: { title: 'Variable' },
        hovermode: 'closest',
        showlegend: false,
        // responsive: true
    };

    var config = {responsive: true}

    if (flag ==='all'){
        Plotly.newPlot('plotly-time-series', [trace], layoutTS,config);
        // Plotly.newPlot('plotly-box-plot', [trace], layoutBox,config);
        // Plotly.newPlot('plotly-histogram', [trace], layoutHist,config);
        Plotly.newPlot('plotly-vertical-t', [trace], layoutProf,config);
        Plotly.newPlot('plotly-vertical-s', [trace], layoutProf,config);
        Plotly.newPlot('plotly-transect', [trace], layout2,config);
        // Plotly.newPlot('plotly-index', [trace], layout3)
    } else if (flag ==='vertical') {
        Plotly.newPlot('plotly-vertical-t', [trace], layoutProf,config);
        Plotly.newPlot('plotly-vertical-s', [trace], layoutProf,config);
    } else if (flag ==='tseries') {
        Plotly.newPlot('plotly-time-series', [trace], layoutTS,config);
    } else if (flag ==='transect') {
        Plotly.newPlot('plotly-transect', [trace], layout2,config);
    } else if (flag ==='forecast') {
        Plotly.newPlot('plotly-fcast-spread', [trace], layoutFcst, config);
        Plotly.newPlot('plotly-fcast-box', [trace], layoutFcst, config);
    } else if (flag ==='mhwForecast') {
        Plotly.newPlot('plotly-fcastmhw-prob', [trace], layoutTS,config);
        Plotly.newPlot('plotly-fcastmhw-mag', [trace], layoutTS,config);
    }

    return new Promise(resolve => {
        console.log('Initial Plotly created');
        resolve();
    });
};

// //function for option change due to button/view change at the bottom
// function changeSelectOpt(divId,optionID,tabContentClass) {
//     showDiv(divId,tabContentClass);
//     // change pick option
//     $('#' + optionID).val(divId + 'Val').change();
// }

// function for option change due to nav pill change at the bottom
function changeDashSelect(dashDropDownID,optionVal) {
    // change pick option
    $('#' + dashDropDownID).val(optionVal).change();
}

// // function for mini navbar in a bootstrap page
// function showDiv(divId,tabContentClass) {
//     // Hide all divs
//     $('.'+tabContentClass).addClass("hidden")

//     // Show the selected div
//     $('#' + divId).removeClass("hidden");

//     // // Show click button 
//     // showClick(divId+'Btn');
// }

// // function for minitab in a bootstrap page
// function showClick(buttonId) {
//     // Hide all divs
//     $('.tablink').removeClass("clicked")

//     // Show the selected div
//     $('#' + buttonId).addClass("clicked");
// }


// function for changing the tick mark of time slider
function tickSpaceChange() {
    if ($(window).width() < 600) {
        var result = [];
        for (var i = 3; i < yearValues.length; i += 5) {
          result.push(yearValues[i]);
        }
        generateTick(result);
    } else if ($(window).width() < 1200) {
        var result = [];
        for (var i = 2; i < yearValues.length; i += 2) {
          result.push(yearValues[i]);
        }
        generateTick(result);
    } else {
        generateTick(yearValues); 
    };
};

// function for create option 
function optionList(listname,listval) {
    let df = document.createDocumentFragment(); // create a document fragment to hold the options created later
    for (let i = 0; i < listname.length; i++) { // loop
        let option = document.createElement('option'); // create the option element
        option.value = listval[i]; // set the value property
        option.appendChild(document.createTextNode(listname[i])); // set the textContent in a safe way.
        df.appendChild(option); // append the option to the document fragment
    }
    return df;
};

// function for create option with subgroup
function optionSubgroupList(listname,listval,listsubgroup) {
    let df = document.createDocumentFragment(); // create a document fragment to hold the options created later
    
    // object subgroup
    const monthlyGroup = document.createElement('optgroup');
    monthlyGroup.label = 'Monthly variables';
    const dailyGroup = document.createElement('optgroup');
    dailyGroup.label = 'Daily variables';
    const monthlyIndexGroup = document.createElement('optgroup');
    monthlyIndexGroup.label = 'Monthly indexes';
    const annualIndexGroup = document.createElement('optgroup');
    annualIndexGroup.label = 'Annual indexes';
    var mvflag = false
    var dvflag = false
    var miflag = false
    var aiflag = false

    for (let i = 0; i < listname.length; i++) {
        let option = document.createElement('option'); // create the option element
        option.value = listval[i]; // set the value property
        option.appendChild(document.createTextNode(listname[i])); // set the textContent in a safe way.
        if (listsubgroup[i].indexOf("monthly")!==-1){
            monthlyGroup.appendChild(option);
            mvflag = true
        } else if (listsubgroup[i].indexOf("daily")!==-1){
            dailyGroup.appendChild(option);
            dvflag = true
        } else if (listsubgroup[i].indexOf("mon_index")!==-1){
            monthlyIndexGroup.appendChild(option);
            miflag = true
        } else if (listsubgroup[i].indexOf("ann_index")!==-1){
            annualIndexGroup.appendChild(option);
            aiflag = true
        }
    }
     
    // append the subgroup in the desired order
    if (aiflag) {
        df.appendChild(annualIndexGroup);
    }
    if (mvflag) {
        df.appendChild(monthlyGroup);
    }  
    // df.appendChild(monthlyGroup); // append the option to the document fragment
    if (miflag) {
        df.appendChild(monthlyIndexGroup);
    }
    // df.appendChild(dailyGroup);
    if (dvflag) {
        df.appendChild(dailyGroup);
    }
    return df;
};

// function for create option for general options (single ID)
function createMomCobaltOpt_singleID(selectID,optionListFunc) {
    let elm = document.getElementById(selectID);
    let optlist = optionListFunc();
    df = optionList(optlist[0],optlist[1]);
    elm.appendChild(df);
};

// function for create option for general options
function createMomCobaltOpt(selectClass,optionListFunc) {
    let elms = document.getElementsByClassName(selectClass);
    let optlist = optionListFunc();
    df = optionList(optlist[0],optlist[1]);
    // loop through all region dropdown with the selectClassName
    for(let i = 0; i < elms.length; i++) {
        let clonedf = df.cloneNode(true); // Clone the child element
        elms[i].appendChild(clonedf); // Append the cloned child to the current element
    }
};


// function for create option for variables (optimized for different purposes)
function createMomCobaltVarOpt(dataCobaltID,selectID) {
    let elm = document.getElementById(selectID); 
    let varlist = momCobaltVars();
    if (dataCobaltID == "MOMCobalt") {
        // for historical run var
        varlist = momCobaltVars();
    } else if (dataCobaltID == "MOMCobalt+Index") {
        // for second time series comp
        varlist = momCobaltVars();
        indexlist = indexes();
        varlist[0] = varlist[0].concat(indexlist[0]);
        varlist[1] = varlist[1].concat(indexlist[1]);
        varlist[2] = varlist[2].concat(indexlist[2]);
    } else if (dataCobaltID == "onlyIndexes") {
        // for index
        indexlist = indexes("onlyIndex");
        varlist[0] = indexlist[0];
        varlist[1] = indexlist[1];
        varlist[2] = indexlist[2];
    };
    // df = optionList(varlist[0],varlist[1]);
    df = optionSubgroupList(varlist[0],varlist[1],varlist[2]);
    elm.appendChild(df); // append the document fragment to the DOM. this is the better way rather than setting innerHTML a bunch of times (or even once with a long string)
};

// function for create option for statistics
function createMomCobaltStatOpt() {
    let elm = document.getElementById('statMOMCobalt');
    let list_stat = momCobaltStats()    
    let df = optionList(list_stat,list_stat);
    elm.appendChild(df);
};

// function for create option for depth
function createMomCobaltDepthOpt(variable,selectID) {
    let elm = document.getElementById(selectID);
    let list_3d = momCobalt3D()
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
function createMomCobaltDepthBlockOpt(variable,blockOptID='blockMOMCobalt') {
    let elm = document.getElementById(blockOptID);
    let list_bottom = momCobaltBottom()
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

// function for create option for depth
function createMomCobaltCbarOpt(cbarOptID='cbarOpts',defaultCbar='RdBu_r') {
    let elm = document.getElementById(cbarOptID);
    let list_cbar = colorbarOpt()    
    let df = optionList(list_cbar,list_cbar);

    return new Promise((resolve) => {
        elm.appendChild(df); // append the document fragment to the DOM. this is the better way rather than setting innerHTML a bunch of times (or even once with a long string)
        elm.selectedIndex = list_cbar.indexOf(defaultCbar);
        // console.log("Async work completed!");
        resolve(); // Resolve the promise when done
    });

};


// function for replace folium overlap info (image and colorbar)
let varFoliumMap;
let statMap;
let depthMap;
function replaceFolium() {
    showLoadingSpinner("loading-spinner-map");
    varFoliumMap = $("#varMOMCobalt").val();
    statMap = $("#statMOMCobalt").val();
    depthMap = $("#depthMOMCobalt").val();
    let block = $("#blockMOMCobalt");
    let cbar = $("#cbarOpts")
    let maxval = $("#maxval");
    let minval = $("#minval");
    let nlevel = $("#nlevel");

    var ajaxGet = "/cgi-bin/cefi_portal/mom_folium.py"
        +"?variable="+varFoliumMap
        +"&region="+$("#regMOMCobalt").val()
        +"&date="+dateFolium
        +"&stat="+statMap
        +"&depth="+depthMap
        +"&block="+block.val()
        +"&cbar="+cbar.val()
        +"&maxval="+maxval.val()
        +"&minval="+minval.val()
        +"&nlevel="+nlevel.val()
    console.log('https://webtest.psd.esrl.noaa.gov/'+ajaxGet)

    fetch(ajaxGet) // Replace with the URL you want to request
        .then(response => {
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            // Process the response data here
            // console.log(data)

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

            mapData = {
                type: 'mapData',
                image: image,
                domain1: domainArray1,
                domain2: domainArray2,
                range: rangeArray,
                tick: tickValArray,
                label: textVal
            };
            // console.log(mapData)
            momCobaltMap[0].contentWindow.postMessage(mapData, "*")

            // get same point time series when points and variable are defined
            if (locationData !== undefined && locationData !== null) {
                if (varFoliumMap !== undefined && varFoliumMap !== null) {
                    if ($('#varMOMCobaltTS2').val() !== undefined && $('#varMOMCobaltTS2').val() !== null) {
                        plotTSs(locationData)
                    } else {
                        plotTS1(locationData);
                    }
                }
                //// current function only allowed in monthly data
                if (dateFolium.length === 7){
                    plotVertProfs(locationData);
                } else {
                    // initialize plotly
                    initializePlotly('vertical');
                }
            }
            // get same polyline transect when polyline and variable are defined
            if (polygonData !== undefined && polygonData !== null) {
                if (varFoliumMap !== undefined && varFoliumMap !== null) {
                    //// current function only allowed in monthly data
                    if (dateFolium.length === 7){
                        plotTransect(polygonData);
                    } else {
                        // initialize plotly
                        initializePlotly('transect');
                    }
                }
            }

            // if (document.getElementById('plotly-time-series').data.length===1) {

            // momCobaltMap[0].contentWindow.postMessage(data, "*")
            // momCobaltMap.attr("srcdoc", data)
            $("div.workingTop").addClass("hidden");
            $("div.errorTop").addClass("hidden");
            $("div.whiteTop").removeClass("hidden");
            hideLoadingSpinner("loading-spinner-map");
        })
        .catch(error => {
            // Handle errors here
            console.error('Fetch folium map error:', error);
            $("div.workingTop").addClass("hidden");
            $("div.errorTop").removeClass("hidden");
            $("div.whiteTop").addClass("hidden");
        });

    // momCobaltMap.attr("src", ajaxGet)
}

// function for decomposing the html code
function text2Array(string) {
    var stringRegex = /\[.*\]/;
    var array = string.match(stringRegex);
    array = JSON.parse(array);

    return array;
}

// function for decomposing the html code
function extractText(string) {
    var stringRegex =/\.text\("([^"]+)"\)/;
    var text = string.match(stringRegex);

    return text[1];
}

// function for plotting 2 TS with Promise to make sure the plotting order
function plotTSs(infoLonLat) {
    showLoadingSpinner("loading-spinner-ts");
    const promiseTS1 = new Promise((resolve, reject) => {
        getTimeSeries(infoLonLat, false)
            .then(parsedTS => {
                // console.log(parsedTS);
                resolve(parsedTS);
            })
            .catch(error => {
                // Handle errors here
                console.error('Error in create PromiseTS1:', error);
                reject(error);
            });
    });
    const promiseTS2 = new Promise((resolve, reject) => {
        if (indexes()[1].indexOf($("#varMOMCobaltTS2").val()) === -1) {
            getTimeSeries(infoLonLat, true)
            .then(parsedTS => {
                // console.log(parsedTS);
                resolve(parsedTS);
            })
            .catch(error => {
                // Handle errors here
                console.error('Error in create PromiseTS2:', error);
                reject(error); 
            });
        } else {
            getIndex('#varMOMCobaltTS2')
            .then(parsedTS => {
                // console.log(parsedTS);
                resolve(parsedTS);
            })
            .catch(error => {
                // Handle errors here
                console.error('Error in create PromiseTS2 for indexes:', error);
                reject(error); 
            });
        }
       
    });

    Promise.all([promiseTS1,promiseTS2])
        .then(([firstTS,secondTS]) => {
            plotlyTS(firstTS.tsDates,firstTS.tsValues,firstTS.lonValues,firstTS.latValues,firstTS.tsUnit,firstTS.yformat)
            plotlyBox(firstTS.tsValues,firstTS.yformat)
            plotlyHist(firstTS.tsValues,firstTS.tsUnit,firstTS.yformat)
            return new Promise((resolve) => {
                resolve([firstTS,secondTS])
            });
        })
        .then(([firstTS,secondTS])=>{
            if (indexes()[1].indexOf($("#varMOMCobaltTS2").val()) === -1) {
                // plotting the variable time series
                plotlyTSadd(secondTS.tsDates,secondTS.tsValues,secondTS.lonValues,secondTS.latValues,secondTS.tsUnit,secondTS.yformat)
                plotlyBoxadd(secondTS.tsValues,secondTS.yformat)
                plotlyHistadd(secondTS.tsValues,secondTS.tsUnit,secondTS.yformat) 
            } else {
                // plotting the first index (make it always the first one as observed value)
                plotlyTSadd(secondTS.tsDates[0],secondTS.tsValues[0],firstTS.lonValues,firstTS.latValues,secondTS.tsUnit[0],secondTS.yformat[0])
                plotlyBoxadd(secondTS.tsValues[0],secondTS.yformat[0])
                plotlyHistadd(secondTS.tsValues[0],secondTS.tsUnit[0],secondTS.yformat[0]) 
            }
            hideLoadingSpinner("loading-spinner-ts");
        })
        .catch((error)=>{
            console.error(error);
        })
};

// function for plotting first TS with Promise for data fetch complete
function plotTS1(infoLonLat) {
    showLoadingSpinner("loading-spinner-ts");
    const promiseTS = new Promise((resolve, reject) => {
        getTimeSeries(infoLonLat, false)
            .then(parsedTS => {
                // console.log(parsedTS);
                resolve(parsedTS);
            })
            .catch(error => {
                // Handle errors here
                console.error('Error in createPromiseForTimeSeries:', error);
                reject(error);
            });
    });

    promiseTS
        .then((firstTS)=>{
            plotlyTS(firstTS.tsDates,firstTS.tsValues,firstTS.lonValues,firstTS.latValues,firstTS.tsUnit,firstTS.yformat)
            plotlyBox(firstTS.tsValues,firstTS.yformat)
            plotlyHist(firstTS.tsValues,firstTS.tsUnit,firstTS.yformat)
            hideLoadingSpinner("loading-spinner-ts");
        })
        .catch((error)=>{
            console.error(error);
        })
};

// function for plotting first TS with Promise for data fetch complete
function plotVertProfs(infoLonLat) {
    showLoadingSpinner("loading-spinner-vprof");
    const promiseVPs = new Promise((resolve, reject) => {
        getVerticalProfile(infoLonLat)
            .then(parsedVP => {
                // console.log(parsedTS);
                resolve(parsedVP);
            })
            .catch(error => {
                // Handle errors here
                console.error('Error in createPromiseForVerticalProfile:', error);
                reject(error);
            });
    });

    promiseVPs
        .then((parsedVP)=>{
            plotlyVP(parsedVP.tDepth,parsedVP.tValues,parsedVP.tlonValues,parsedVP.tlatValues,parsedVP.tUnit,parsedVP.tformat,"plotly-vertical-t","Potential Temperature","rgba(113, 29, 176, 0.7)")
            plotlyVP(parsedVP.sDepth,parsedVP.sValues,parsedVP.slonValues,parsedVP.slatValues,parsedVP.sUnit,parsedVP.sformat,"plotly-vertical-s","Salinity","rgb(239, 64, 64)")
            hideLoadingSpinner("loading-spinner-vprof");
        })
        .catch((error)=>{
            console.error(error);
        })
};


// function for plotting first TS with Promise for data fetch complete
function plotTransect(infoLine) {
    showLoadingSpinner("loading-spinner-tsect");
    const promiseTran = new Promise((resolve, reject) => {
        getTransect(infoLine)
            .then(parsedTran => {
                resolve(parsedTran);
            })
            .catch(error => {
                // Handle errors here
                console.error('Error in createPromiseForTransect:', error);
                reject(error);
            });
    });

    promiseTran
        .then((parsedTran)=>{
            if (varname.includes('(3D)')) {
                plotlyContour("plotly-transect",parsedTran)
            } else {
                plotlyTransectLine("plotly-transect",parsedTran)
            }
            hideLoadingSpinner("loading-spinner-tsect");
        })
        .catch((error)=>{
            console.error(error);
        })
};

// function for plotting first TS with Promise for data fetch complete
function plotIndexes() {
    showLoadingSpinner("loading-spinner-index");
    const indexName = $('#indexMOMCobaltTS').val();
    const promiseIndex = new Promise((resolve, reject) => {
        getIndex('#indexMOMCobaltTS')
            .then(parsedIndex => {
                // console.log(parsedTS);
                resolve(parsedIndex);
            })
            .catch(error => {
                // Handle errors here
                console.error('Error in createPromiseForIndexes:', error);
                reject(error);
            });
    });

    promiseIndex
        .then((parsedIndex)=>{
            numberOfIndexes = parsedIndex.tsDates.length
            var i = 0 ;
            plotlyIndex(parsedIndex.tsDates[i],parsedIndex.tsValues[i],parsedIndex.tsUnit[i],parsedIndex.yformat[i],parsedIndex.tsName[i],indexName)
            for (let i = 1; i < numberOfIndexes; i++) {
                plotlyIndexAdd(parsedIndex.tsDates[i],parsedIndex.tsValues[i],parsedIndex.tsName[i])
            }
            hideLoadingSpinner("loading-spinner-index");
        })
        .catch((error)=>{
            console.error(error);
        })
};


// function for retrieving lon lat from iframe leaflet
var varVal = null
function receiveMessage(event) {
    // Access the data sent from the iframe
    if (event.originalEvent.origin === window.location.origin) {
        // console.log(event.originalEvent)

        if (event.originalEvent.data.type === 'locationData') {
            locationData = event.originalEvent.data;
            
            if (varFoliumMap !== undefined && varFoliumMap !== null) {
                // plotting the plotly ts
                if ($('#varMOMCobaltTS2').val() !== undefined && $('#varMOMCobaltTS2').val() !== null) {
                    plotTSs(locationData)
                } else {
                    plotTS1(locationData);
                }
                // plotting the plotly vertical profile (only in monthly setting)
                if (dateFolium.length === 7){
                    plotVertProfs(locationData)
                }

                // grabbing the location variable value 
                const promiseVarVal = new Promise((resolve, reject) => {
                    getVarVal(locationData)
                        .then(value => {
                            varVal = value
                            // send the value back to iframe
                            varValData = {
                                type: 'varValData',
                                var: varVal
                            };
                            // console.log(mapData)
                            momCobaltMap[0].contentWindow.postMessage(varValData, "*")
                            // resolve(varVal);
                        })
                        .catch(error => {
                            // Handle errors here
                            console.error('Error in createPromiseForVarVal:', error);
                            reject(error);
                        });
                });
            }
        } else if (event.originalEvent.data.type === 'polygonData') {
            polygonData = event.originalEvent.data;
            if (varFoliumMap !== undefined && varFoliumMap !== null) {
                plotTransect(polygonData)
            }           
        }
        


            
        // console.log("Received data from iframe:", locationData);
        // console.log(event.originalEvent.origin);
    };
};

// Display loading spinner
function showLoadingSpinner(divID) {
    // console.log('spin')
    $("#"+divID).css("display", "block");
}

// Hide loading spinner
function hideLoadingSpinner(divID) {
    // console.log('stop spin')
    $("#"+divID).css("display", "none");
}

// function to get variable value based on locationData and dataFolium
function getVarVal(infoLonLat) {
    var ajaxGet = "/cgi-bin/cefi_portal/mom_extract_variableValue.py"
        +"?variable="+varFoliumMap
        +"&region="+$("#regMOMCobalt").val()
        +"&stat="+statMap
        +"&depth="+depthMap
        +"&lon="+infoLonLat.longitude
        +"&lat="+infoLonLat.latitude
        +"&date="+dateFolium
    
    console.log('https://webtest.psd.esrl.noaa.gov/'+ajaxGet)

    return fetch(ajaxGet)
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
}


// function to get transect based on polygonData
//  the transect only change 
//   1. when the map is created
//   2. polygon line is changed
function getTransect(infoLine) {

    var ajaxGet = "/cgi-bin/cefi_portal/mom_extract_transect.py"
    +"?variable="+varFoliumMap
    +"&region="+$("#regMOMCobalt").val()
    +"&stat="+statMap
    +"&date="+dateFolium
    +"&jsonstring="+infoLine.polygon

    console.log('https://webtest.psd.esrl.noaa.gov/'+ajaxGet)

    return fetch(ajaxGet)
        .then(response => {
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            // Process the response data here
            var lines = data.split('\n');

            var tranDepth = JSON.parse(lines[0]);
            var tranLoc = JSON.parse(lines[1]);
            var tranValues = JSON.parse(lines[2].replace(/'/g, ' '));
            var tranLonLat = lines[4];
            // console.log(tranValues)
            
            // var tlonValues = lines[2];
            // var tlatValues = lines[3];
            var tranUnit = lines[3];

            // var tranformat = '.2f';
            // var maxVal = Math.max(...tranValues);
            // console.log(maxVal)
            // var minVal = Math.min(...tranValues);
            // console.log(minVal)
            // var diff = Math.abs(maxVal-minVal);


            // if (diff< 0.01) {
            //     format = '.2e';
            // }
        
            
            var parsedTran = {
                tranLoc:tranLoc,
                tranDepth:tranDepth, 
                tranValues:tranValues,
                tranUnit:tranUnit,
                tranLonLat:tranLonLat
            }

            return parsedTran

        })
        .catch(error => {
            // Handle errors here
            console.error('Fetch transect error:', error);
        });
}



// function to get vertical profile based on locationData
//  the vertical profile only change 
//   1. when the map is created
//   2. clicked location is changed
function getVerticalProfile(infoLonLat) {

    var ajaxGet = "/cgi-bin/cefi_portal/mom_extract_verticalprofile.py"
    +"?stat="+statMap
    +"&region="+$("#regMOMCobalt").val()
    +"&date="+dateFolium
    +"&lon="+infoLonLat.longitude
    +"&lat="+infoLonLat.latitude
    
    console.log('https://webtest.psd.esrl.noaa.gov/'+ajaxGet)

    return fetch(ajaxGet)
        .then(response => {
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            // Process the response data here
            var lines = data.split('\n');

            var tDepth = JSON.parse(lines[0]);
            var tValues = JSON.parse(lines[1]);
            var tlonValues = lines[2];
            var tlatValues = lines[3];
            var tUnit = lines[4];

            var sDepth = JSON.parse(lines[5]);
            var sValues = JSON.parse(lines[6]);
            var slonValues = lines[7];
            var slatValues = lines[8];
            var sUnit = lines[9];

            var tformat = '.2f';
            var tmaxVal = Math.max(...tValues);
            var tminVal = Math.min(...tValues);
            var tdiff = Math.abs(tmaxVal-tminVal);

            var sformat = '.2f'
            var smaxVal = Math.max(...sValues);
            var sminVal = Math.min(...sValues);
            var sdiff = Math.abs(smaxVal-sminVal);

            if (tdiff< 0.01) {
                tformat = '.2e';
            }
        
            if (sdiff< 0.01) {
                sformat = '.2e';
            }
            
            var parsedVP = {
                tDepth:tDepth, 
                tValues:tValues,
                tlonValues:tlonValues,
                tlatValues:tlatValues,
                tUnit:tUnit,
                tformat:tformat,
                sDepth:sDepth, 
                sValues:sValues,
                slonValues:slonValues,
                slatValues:slatValues,
                sUnit:sUnit,
                sformat:sformat
            }

            return parsedVP

        })
        .catch(error => {
            // Handle errors here
            console.error('Fetch vertical profile error:', error);
        });
}


function getMockDate(freqString) {
    // making mockDate imitating the file date frequency for 2nd time series
    //  this is required due to the multiple file for same varname with 
    //  different frequency in the backend.
    var mockDate;
    if (freqString.toLowerCase().includes('da')){
        mockDate = 'YYYY-MM-DD';
    } else if (freqString.toLowerCase().includes('mon')){
        mockDate = 'YYYY-MM';
    } else if (freqString.toLowerCase().includes('ann')){
        mockDate = 'YYYY';
    }
    return mockDate
}        

// function to get time series based on locationData
//  the time series only change 
//   1. when the map is created
//   2. when the map is changed
//   3. only use the variable from created map
//      not the option changed result
function getTimeSeries(infoLonLat,addTS) {
    // showLoadingSpinner();
    if (addTS) {
        // find data frequency and create mock date for TS2
        var selectVar2Index = $("#varMOMCobaltTS2").prop('selectedIndex');
        var varlist = momCobaltVars();
        var indexlist = indexes();
        var freqlist = varlist[2].concat(indexlist[2]); // for data freqnecy
        var freqString = freqlist[selectVar2Index];
        var mockDate = getMockDate(freqString)

        var var2TS = $('#varMOMCobaltTS2').val();
        var depth2TS = $('#depthMOMCobaltTS2').val();
        var ajaxGet = "/cgi-bin/cefi_portal/mom_extract_timeseries.py"
        +"?variable="+var2TS
        +"&region="+$("#regMOMCobalt").val()
        +"&date="+mockDate
        +"&stat="+statMap
        +"&depth="+depth2TS
        +"&lon="+infoLonLat.longitude
        +"&lat="+infoLonLat.latitude
    } else {
        var ajaxGet = "/cgi-bin/cefi_portal/mom_extract_timeseries.py"
        +"?variable="+varFoliumMap
        +"&region="+$("#regMOMCobalt").val()
        +"&date="+dateFolium
        +"&stat="+statMap
        +"&depth="+depthMap
        +"&lon="+infoLonLat.longitude
        +"&lat="+infoLonLat.latitude
    }
    
    console.log('https://webtest.psd.esrl.noaa.gov/'+ajaxGet)

    return fetch(ajaxGet)
        .then(response => {
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            // Process the response data here
            var lines = data.split('\n');

            var tsDates = lines[0].split(',');
            var tsValues = JSON.parse(lines[1]);
            var lonValues = lines[2];
            var latValues = lines[3];
            var tsUnit = lines[4];

            var yformat = '.2f';
            var maxVal = Math.max(...tsValues);
            var minVal = Math.min(...tsValues);
            var diff = Math.abs(maxVal-minVal);
            if (diff< 0.01) {
                yformat = '.2e';
            }
            
            var parsedTS = {tsDates:tsDates, 
                tsValues:tsValues,
                lonValues:lonValues,
                latValues:latValues,
                tsUnit:tsUnit,
                yformat:yformat}

            return parsedTS

        })
        .catch(error => {
            // Handle errors here
            console.error('Fetch time series error:', error);
        });
}


function getIndex(indexID) {
    var var2TS = $(indexID).val();
    var ajaxGet = "/cgi-bin/cefi_portal/mom_get_index.py"
        +"?variable="+var2TS
        +"&region="+$("#regMOMCobalt").val()

    // console.log('https://webtest.psd.esrl.noaa.gov/'+ajaxGet)

    return fetch(ajaxGet)
        .then(response => {
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            // Process the response data here
            var lines = data.split('\n');
            var num_ts = lines[0]

            var tsDates = new Array();
            var tsValues = new Array();
            var tsUnit = new Array();
            var tsName = new Array();
            var yformat = new Array();
            const numInfo = 4
            for (let i = 0; i < num_ts; i++) {
                tsDates.push(lines[1+i*numInfo].split(','));
                tsValues.push(JSON.parse(lines[2+i*numInfo]));
                tsUnit.push(lines[3+i*numInfo]);
                tsName.push(lines[4+i*numInfo]);
                yformat.push('.2f');
            }
            
            // var tsDates = lines[0].split(',');
            // var tsValues = JSON.parse(lines[1]);
            // var tsUnit = lines[2];

            // var yformat = '.2f';
            // var maxVal = Math.max(...tsValues);
            // var minVal = Math.min(...tsValues);
            // var diff = Math.abs(maxVal-minVal);
            // if (diff< 0.01) {
            //     yformat = '.2e';
            // }
            
            var parsedTS = {
                tsDates:tsDates, 
                tsValues:tsValues,
                tsUnit:tsUnit,
                tsName:tsName,
                yformat:yformat}

            return parsedTS

        })
        .catch(error => {
            // Handle errors here
            console.error('Fetch time series error:', error);
        });
}


// function for adding time series to the existing plotly time series plot
function plotlyIndexAdd(tsDates,tsValues,tsName) {
    // var trace2Color = "rgb(246, 153, 92)"
    // console.log('addTS')

    var trace = {
        x: tsDates,
        y: tsValues,
        type: 'scatter',
        mode: 'lines+markers',
        marker: { size: 2 },
        // line: { shape: 'linear',color: trace2Color },
        name: tsName,
    };

    Plotly.addTraces('plotly-index', trace);

    // var arr1 = document.getElementById('plotly-time-series').data[0].y
    // var arr2 = document.getElementById('plotly-time-series').data[1].y
    // var corr = calculateCorrelation(arr1, arr2)

    // if (corr==='None') {
    //     corrText = 'None';
    // } else {
    //     corrText = corr.toFixed(2);
    // }

    // var layout = {
    //     yaxis2: {
    //         overlaying: 'y',
    //         side: 'right',
    //         title: {
    //             text: varname2 + '(' + tsUnit + ')',
    //             standoff: 10,
    //             font: { color: trace2Color }
    //         },
    //         tickfont: { color: trace2Color }, 
    //         tickformat: yformat,
    //         tickmode: 'auto'
    //     },
    //     title:
    //         'Correlation: '+ corrText +
    //         ' @ (lon:'+parseFloat(lonValues).toFixed(2)+'E,'+
    //             'lat:'+parseFloat(latValues).toFixed(2)+'N)',
    // };

    // Plotly.update('plotly-index', {}, layout);

};

// function for creating the plotly time series
function plotlyIndex(tsDates,tsValues,tsUnit,yformat,tsName,indexName) {
    var trace1Color = "rgba(81, 130, 155, 1)"
    // console.log('oriTS')
    var trace = {
        x: tsDates,
        y: tsValues,
        type: 'scatter',
        mode: 'lines+markers',
        marker: { size: 2 },
        line: { shape: 'linear',color: trace1Color },
        // name: statMap+' time series',
        name: tsName
    };

    var data = [trace];

    var layout = {
        hovermode: 'closest',
        showlegend: true,
        title: indexName,
        legend: {x: 0, y: 1.1},
        // autosize: true,
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
            title: 'Date'
        },
        yaxis: {
            title: {
                text: indexName + '(' + tsUnit + ')',
                standoff: 10,
                // font: { color: trace1Color }
            },
            // tickfont: { color: trace1Color },
            tickformat: yformat,
            tickmode: 'auto'
        },
        modebar: {
            remove: ["autoScale2d", "autoscale" ]
        },
        dragmode: "select"
        // responsive: true
    };
    var config = {responsive: true}
    Plotly.newPlot('plotly-index', data, layout, config);

};


// function for creating the plotly Transect line at the surface
function plotlyTransectLine(plotlyID,parsedTran) {

    var yformat = '.2f';
    var maxVal = Math.max(...parsedTran.tranValues[0]);
    var minVal = Math.min(...parsedTran.tranValues[0]);
    var diff = Math.abs(maxVal-minVal);
    if (diff< 0.01) {
        yformat = '.2e';
    }

    var trace1Color = "rgba(113, 29, 176, 0.7)"
    var trace = {
        x: parsedTran.tranLonLat,
        y: parsedTran.tranValues[0],
        type: 'scatter',
        mode: 'lines+markers',
        marker: { size: 2 },
        line: { shape: 'linear',color: trace1Color },
        // name: statMap+' time series',
        name: varname
    };

    var data = [trace];

    var layout = {
        hovermode: 'closest',
        showlegend: false,
        title:
            varname +' '+ statMap +
            '<br> along the PolyLine',
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
            title: {
                text: "Point# (from line start)",
                standoff: 10
            },
            tickmode: 'auto',
        },
        yaxis: {
            title: {
                text: varname + '(' + parsedTran.tranUnit + ')',
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
        dragmode: "zoom"
        // responsive: true
    };
    var config = {responsive: true}
    Plotly.newPlot(plotlyID, data, layout, config);
};

// function for creating the plotly contour transect
function plotlyContour(plotlyID,parsedTran) {

    // Define custom hovertemplate
    // var array1D = parsedTran.tranLonLat;
    // var array2D = new Array(parsedTran.tranDepth.length).fill(array1D);
    // const customdata = array2D;
    // console.log(customdata)

    var trace = {
        z: parsedTran.tranValues,
        y: parsedTran.tranDepth,
        x: parsedTran.tranLoc,
        type: 'contour',
        hovertemplate: `
        ModelPoint# (from PolyLine start): %{x} <br>
        Depth: %{y} <br>
        Value: %{z} <extra></extra>
        `,
        colorscale: 'Viridis'
    };

    // // Set custom x-axis labels
    // trace.xaxis = {
    //     tickvals: parsedTran.tranLoc, // Corresponding to the index of customXLabels
    //     ticktext: customValues,
    // };

    var layout = {
        hovermode: 'closest',
        showlegend: false,
        title:"Vertical Transect Along PolyLine",
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
        yaxis: {
            title: 'Depth (m)',
            autorange: 'reversed'
        },
        xaxis: {
            title: {
                text: "Point# (from line start)",
                standoff: 10
            },
            tickmode: 'auto',
            // type: 'category'
        },
        // modebar: {
        //     remove: ["autoScale2d", "autoscale", "zoom", "zoom2d", ]
        // },
        // dragmode: "select"
        // responsive: true
    };
    var config = {responsive: true}
    Plotly.newPlot(plotlyID, [trace], layout,config);

};



// function for creating the plotly vertical profile
function plotlyVP(varDepth,varValues,lonValues,latValues,varUnit,varformat,plotlyID,vpname,trace1Color) {
    var trace = {
        x: varValues,
        y: varDepth,
        type: 'scatter',
        mode: 'lines+markers',
        marker: { size: 2 },
        line: { shape: 'linear',color: trace1Color },
        name: vpname
    };

    var data = [trace];

    var layout = {
        hovermode: 'closest',
        showlegend: false,
        title:
            vpname +' '+ statMap +
            '<br> @ (lat:'+parseFloat(latValues).toFixed(2)+'N,'+
                'lon:'+parseFloat(lonValues).toFixed(2)+'E)',
        //   autosize: true,
        annotations: [{
            x: 0,
            y: 0,
            xref: 'paper',
            yref: 'paper',
            text: 'Source: NOAA CEFI data portal',
            showarrow: false
         }],
        //  width: 500,
        //  height: 400,
         margin: {
            l: 80,
            r: 80,
            b: 80,
            t: 100,
            // pad: 4
          },
        yaxis: {
            title: 'Depth (m)',
            autorange: 'reversed'
        },
        xaxis: {
            title: {
                text: vpname + '(' + varUnit + ')',
                standoff: 10,
                font: { color: trace1Color }
            },
            tickfont: { color: trace1Color },
            tickformat: varformat,
            tickmode: 'auto'
        },
        modebar: {
            remove: ["autoScale2d", "autoscale", "zoom", "zoom2d", ]
        },
        // dragmode: "select"
        // responsive: true
    };
    var config = {responsive: true}

    Plotly.newPlot(plotlyID, data, layout, config);

    // document.getElementById('plotly-time-series').on('plotly_selected', function(eventData) {
    //     // console.log(eventData.points)
    //     var selectTSValue1 = []
    //     for (let i = 0; i < eventData.points.length; i++) {
    //         if (eventData.points[i].curveNumber === 0) {
    //             selectTSValue1.push(eventData.points[i].y)
    //         } 
    //     }
    //     // console.log(selectTSValue)
    //     plotlyBox(selectTSValue1,yformat)
    //     plotlyHist(selectTSValue1,tsUnit,yformat)

    // });
};


// function for adding time series to the existing plotly time series plot
function plotlyTSadd(tsDates,tsValues,lonValues,latValues,tsUnit,yformat) {
    var trace2Color = "rgb(239, 64, 64)"
    // console.log('addTS')

    if (document.getElementById('plotly-time-series').data.length===2) {
        Plotly.deleteTraces(document.getElementById('plotly-time-series'), 1);
    }

    var trace = {
        x: tsDates,
        y: tsValues,
        type: 'scatter',
        mode: 'lines+markers',
        marker: { size: 2 },
        line: { shape: 'linear',color: trace2Color },
        name: varname2,
        yaxis: 'y2'
    };

    Plotly.addTraces('plotly-time-series', trace);

    var arr1 = document.getElementById('plotly-time-series').data[0].y
    var arr2 = document.getElementById('plotly-time-series').data[1].y
    var corr = calculateCorrelation(arr1, arr2)

    if (corr==='None') {
        corrText = 'None';
    } else {
        corrText = corr.toFixed(2);
    }

    var layout = {
        yaxis2: {
            overlaying: 'y',
            side: 'right',
            title: {
                text: varname2 + '(' + tsUnit + ')',
                standoff: 10,
                font: { color: trace2Color }
            },
            tickfont: { color: trace2Color }, 
            tickformat: yformat,
            tickmode: 'auto'
        },
        title:
            'Correlation: '+ corrText +
            ' @ (lat:'+parseFloat(latValues).toFixed(2)+'N,'+
                'lon:'+parseFloat(lonValues).toFixed(2)+'E)',
    };

    Plotly.update('plotly-time-series', {}, layout);

    document.getElementById('plotly-time-series').on('plotly_selected', function(eventData) {
        // console.log(eventData.points)
        var selectTSValue2 = []
        for (let i = 0; i < eventData.points.length; i++) {
            if (eventData.points[i].curveNumber === 1) {
                selectTSValue2.push(eventData.points[i].y)
            } 
        }

        plotlyBoxadd(selectTSValue2,yformat)
        plotlyHistadd(selectTSValue2,tsUnit,yformat)
        
    });

};

// function for creating the plotly time series
function plotlyTS(tsDates,tsValues,lonValues,latValues,tsUnit,yformat) {
    var trace1Color = "rgba(113, 29, 176, 0.7)"
    // console.log('oriTS')
    var trace = {
        x: tsDates,
        y: tsValues,
        type: 'scatter',
        mode: 'lines+markers',
        marker: { size: 2 },
        line: { shape: 'linear',color: trace1Color },
        // name: statMap+' time series',
        name: varname
    };

    var data = [trace];

    var layout = {
        hovermode: 'closest',
        showlegend: false,
        title:
            varname +' '+ statMap +'<br>'+
            '(lat:'+parseFloat(latValues).toFixed(2)+'N,'+
            'lon:'+parseFloat(lonValues).toFixed(2)+'E)',
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
            title: 'Date'
        },
        yaxis: {
            title: {
                text: varname + '(' + tsUnit + ')',
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

    Plotly.newPlot('plotly-time-series', data, layout,config);

    document.getElementById('plotly-time-series').on('plotly_selected', function(eventData) {
        // console.log(eventData.points)
        var selectTSValue1 = []
        for (let i = 0; i < eventData.points.length; i++) {
            if (eventData.points[i].curveNumber === 0) {
                selectTSValue1.push(eventData.points[i].y)
            } 
        }
        // console.log(selectTSValue)
        plotlyBox(selectTSValue1,yformat)
        plotlyHist(selectTSValue1,tsUnit,yformat)

    });
};

// function to add trace to existing plotly box plot
function plotlyBoxadd(tsValues,yformat) {
    var trace2Color = "rgb(239, 64, 64)"

    if (document.getElementById('plotly-box-plot').data.length===2) {
        Plotly.deleteTraces(document.getElementById('plotly-box-plot'), 1);
    }

    var trace2 = {
        y: tsValues,
        yaxis: 'y2',
        name: varname2,
        boxpoints: false,
        // jitter: 0.3,
        // pointpos: -1.8,
        type: 'box',
        boxmean: 'sd',
        marker: {
            color: trace2Color,
            outliercolor: 'rgba(219, 64, 82, 0.6)',
            line: {
              outliercolor: 'rgba(219, 64, 82, 1.0)',
              outlierwidth: 2
            }
        },
        hoverinfo: 'y'
    };

    Plotly.addTraces('plotly-box-plot', trace2);

    var layout2 = {
        yaxis2: {
            overlaying: 'y',
            side: 'right',
            tickformat: yformat,
            tickmode: 'auto',
            tickfont: { color: trace2Color }, 
            title: {
                // standoff: 10,
                font: { color: trace2Color }
            }
        }
    };
    Plotly.update('plotly-box-plot', {}, layout2);

};

// function to plot plotly box plot
function plotlyBox(tsValues,yformat) {
    var trace1Color = "rgba(113, 29, 176, 0.7)"

    var trace1 = {
        y: tsValues,
        name: varname,
        boxpoints: false,
        // jitter: 0.3,
        // pointpos: -1.8,
        type: 'box',
        boxmean: 'sd',
        marker: {
            color: trace1Color,
            outliercolor: 'rgba(219, 64, 82, 0.6)',
            line: {
              outliercolor: 'rgba(219, 64, 82, 1.0)',
              outlierwidth: 2
            }
        },
        hoverinfo: 'y'
    };

    var data1 = [trace1];

    var layout1 = {
        hovermode: 'closest',
        showlegend: false,
        showxaxis: false,
        title: 'Box Plot',
        yaxis: {
            tickformat: yformat,
            tickmode: 'auto',
            tickfont: { color: trace1Color },
            title: {
                // standoff: 10,
                font: { color: trace1Color }
            }
        },
        xaxis: {
            visible: false
        },
        // responsive: true,
        margin: {
            l: 50,
            r: 50,
            b: 80,
            t: 100,
            // pad: 4
          },
        width: 250,
        height: 400,
        modebar: {
            remove: ["autoScale2d", "autoscale", "zoom", "zoom2d", ]
        },
        dragmode: "pan"
    };

    Plotly.newPlot('plotly-box-plot', data1, layout1);

};


// function to plot plotly histogram
function plotlyHistadd(tsValues,tsUnit,yformat) {
    var trace2Color = "rgba(239, 64, 64, 0.7)"
    var trace2 = {
        y: tsValues,
        yaxis: 'y2',
        name: varname2,
        autobinx: true, 
        histnorm: "count", 
        marker: {
          color: "rgba(255, 255, 255, 0)", 
           line: {
            color:  trace2Color, 
            width: 4
          }
        },  
        // opacity: 0.5, 
        type: "histogram", 
        // xbins: {
        //   end: 2.8, 
        //   size: 0.06, 
        //   start: .5
        // },
    };
    Plotly.addTraces('plotly-histogram', trace2);

    var layout2 = {
        hovermode: 'closest',
        showlegend: false,
        // responsive: true,
        title: 'Histogram',
        yaxis2: {
            overlaying: 'y',
            side: 'right',
            title: {
                // text: varname + '(' + tsUnit + ')',
                font: { color: trace2Color }
            },
            tickfont: { color: trace2Color }, 
            tickformat: yformat,
            tickmode: 'auto'
        },
    };
    Plotly.update('plotly-histogram', {}, layout2);

};


// function to plot plotly histogram
function plotlyHist(tsValues,tsUnit,yformat) {
    // var trace1Color = "rgb(239, 64, 64)"
    var trace1Color = "rgba(113, 29, 176, 0.7)"
    var trace1 = {
        y: tsValues,
        name: varname,
        autobinx: true, 
        histnorm: "count", 
        marker: {
        //   color: "rgba(255, 167, 50, 0.7)", 
           color: trace1Color,
           line: {
            // color:  "rgba(255, 167, 50, 1)", 
            color: trace1Color,
            width: 1
          }
        },  
        // opacity: 0.5, 
        type: "histogram", 
        // xbins: {
        //   end: 2.8, 
        //   size: 0.06, 
        //   start: .5
        // },
    };

    var data1 = [trace1];

    var layout1 = {
        hovermode: 'closest',
        showlegend: false,
        // responsive: true,
        title: 'Histogram',
        yaxis: {
            title: {
                // text: varname + '(' + tsUnit + ')',
                font: { color: trace1Color }
            },
            tickformat: yformat,
            tickmode: 'auto',
            tickfont: { color: trace1Color }
        },
        xaxis: {
            title: 'Count'
        },
        width: 250,
        height: 400,
        margin: {
            l: 50,
            r: 50,
            b: 80,
            t: 100,
            // pad: 4
          },
        modebar: {
            remove: ["autoScale2d", "autoscale", "zoom", "zoom2d", "select", "select2d", "lasso", "lasso2d",]
        },
        dragmode: "pan"
    };
   
    Plotly.newPlot('plotly-histogram', data1, layout1);

};


// function for calculating the correlation in plotly TS plot
function calculateCorrelation(arr1, arr2) {
    if (arr1.length !== arr2.length) {
      console.log('Arrays must have the same length');
      return 'None'
    }
  
    const n = arr1.length;
  
    // Calculate means
    const meanArr1 = arr1.reduce((acc, val) => acc + val, 0) / n;
    const meanArr2 = arr2.reduce((acc, val) => acc + val, 0) / n;
  
    // Calculate covariance and standard deviations
    let covariance = 0;
    let stdDevArr1 = 0;
    let stdDevArr2 = 0;
  
    for (let i = 0; i < n; i++) {
      covariance += (arr1[i] - meanArr1) * (arr2[i] - meanArr2);
      stdDevArr1 += Math.pow(arr1[i] - meanArr1, 2);
      stdDevArr2 += Math.pow(arr2[i] - meanArr2, 2);
    }
  
    covariance /= n;
    stdDevArr1 = Math.sqrt(stdDevArr1 / n);
    stdDevArr2 = Math.sqrt(stdDevArr2 / n);
  
    // Calculate correlation coefficient
    const correlation = covariance / (stdDevArr1 * stdDevArr2);
  
    return correlation;
  }


// functions for timeline tick 
function generateTick(tickList) {
    $("div.ticks span").remove();
    for (let i = 0; i < tickList.length; i++) {
        // Create a new <span> element
        const span = $("<span></span>");
    
        // Set some content or attributes for the <span>
        span.text(`${tickList[i]}`);
        span.addClass("tickYear"); 
    
        // Append the <span> to the containerTick <div>
        containerTick.append(span);
    };
};


// functions for generating year and date list for timeslider (monthly)
function generateDateList(startYear = 1993, endYear = 2019) {
    var dateList = [];
    var yearList = [];

    for (var year = startYear; year <= endYear; year++) {
        yearList.push(year)
        for (var month = 1; month <= 12; month++) {
            var monthStr = month < 10 ? "0" + month : month;
            dateList.push(year + "-" + monthStr);
        }
    }

    return [yearList, dateList];
}

// functions for generating year and date list for timeslider (daily)
function generateDailyDateList(startYear = 1993, endYear = 2019) {
    var dateList = [];
    var yearList = [];

    for (var year = startYear; year <= endYear; year++) {
        yearList.push(year);

        for (var month = 1; month <= 12; month++) {
            var daysInMonth = new Date(year, month, 0).getDate(); // Get the number of days in the month

            for (var day = 1; day <= daysInMonth; day++) {
                dateList.push(`${year}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`);
            }
        }
    }

    return [yearList, dateList];
}



// function for advancing/recede to the next option in the list
//   used directly in html page button with attribute onclick
function changeTimeStep(timeStep) {
    var nextTime = parseInt(timeSlider.val())+timeStep;
    timeSlider.val(nextTime);
    // $("div.workingTop").removeClass("hidden");
    // $("div.errorTop").addClass("hidden");
    // $("div.whiteTop").addClass("hidden");
    dateFolium = rangeValues[timeSlider.val()];
    tValue.text(dateFolium);
    replaceFolium();
}




///////// information function start /////////
// functions for options lists (Manual entering)
function indexes(dashFlag='timeSeries') {
    let var_options
    if (dashFlag === 'timeSeries'){
        var_options = [
            "Northern Atlantic Oscillation (Obs)",
            "Cold Pool Index (Obs)",
            "NE Channel Labrador Slope Water (Obs)",
            "NE Channel Scotian Shelf Water (Obs)",
            "NE Channel Warm Slope Water (Obs)"
        ];
    } else if (dashFlag === 'onlyIndex') {
        var_options = [
            "Northern Atlantic Oscillation",
            "Cold Pool Index",
            "NE Channel Labrador Slope Water",
            "NE Channel Scotian Shelf Water",
            "NE Channel Warm Slope Water"
        ];
    };
    
    let var_values = [
        "NAO",
        "CPI",
        "LSW",
        "SSW",
        "WSW"
    ];
    let var_freqs = [
        "mon_index",
        "ann_index",
        "ann_index",
        "ann_index",
        "ann_index"
    ];

    return [var_options, var_values, var_freqs];
}


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


// functions for options lists (Manual entering)
function momCobaltVars() {
    let var_options = [
        "Sea surface temperature",
        "Bottom temperature",
        "Sea surface salinity",
        "Sea surface height",
        "Mix layer depth",
        "Potential temperature (3D)",
        "Salinity (3D)",
        "Sea ice concentration",
        "Chlorophyll (Phytoplankton)",
        "Dissolved Inorganic Carbon",
        "Alkalinity",
        "Carbonate Ion",
        "Solubility for Aragonite",
        "NO3",
        "PO4",
        "Mesozooplankton (0-200m)",
        "Bottom oxygen",
        "Bottom salinity",
        "Bottom temperature",
        "Sea surface temperature",
        "Sea surface salinity",
        "Sea surface height",
        "Sea surface velocity (U)",
        "Sea surface velocity (V)"
    ];
    let var_values = [
        "tos",
        "tob",
        "sos",
        "ssh",
        "MLD_003",
        "thetao",
        "so",
        "siconc",
        "chlos",
        "dissicos",
        "talkos",
        "sfc_co3_ion",
        "sfc_co3_sol_arag",
        "sfc_no3",
        "sfc_po4",
        "mesozoo_200",
        "btm_o2",
        "sob",
        "tob",
        "tos",
        "sos",
        "ssh",
        "ssu_rotate",
        "ssv_rotate" 
    ];
    let var_freqs = [
        "monthly",
        "monthly",
        "monthly",
        "monthly",
        "monthly",
        "monthly",
        "monthly",
        "monthly",
        "monthly",
        "monthly",
        "monthly",
        "monthly",
        "monthly",
        "monthly",
        "monthly",
        "monthly",
        "daily",
        "daily",
        "daily",
        "daily",
        "daily",
        "daily",
        "daily",
        "daily"
    ];

    return [var_options, var_values, var_freqs];
}

function momCobaltDepth() {
    let depth = [
        2.5, 7.5, 12.5, 17.5, 22.5, 27.5, 32.5, 37.5, 42.5, 47.5, 55, 65, 75,
    85, 95, 105, 115, 125, 135, 145, 162.5, 187.5, 212.5, 237.5, 262.5,
    287.5, 325, 375, 425, 475, 550, 650, 750, 850, 950, 1050, 1150, 1250,
    1350, 1450, 1625, 1875, 2125, 2375, 2750, 3250, 3750, 4250, 4750, 5250,
    5750, 6250
    ]
    return depth
}

function momCobalt3D() {
    list_3d = [
        'thetao',
        'so'
    ]
    return list_3d
}

function momCobaltBottom() {
    list_bottom = [
        'tob',
        'btm_o2',
        'sob'
    ]
    return list_bottom
}

function momCobaltStats() {
    stats_list = [
        'mean',
        'anomaly'
    ]
    return stats_list
}

function colorbarOpt() {
    colorOpt = [
        'Accent', 'Accent_r', 'Blues', 'Blues_r', 'BrBG', 'BrBG_r', 'BuGn', 'BuGn_r', 
        'BuPu', 'BuPu_r', 'CMRmap', 'CMRmap_r', 'Dark2', 'Dark2_r', 'GnBu', 'GnBu_r', 
        'Greens', 'Greens_r', 'Greys', 'Greys_r', 'OrRd', 'OrRd_r', 'Oranges', 'Oranges_r', 
        'PRGn', 'PRGn_r', 'Paired', 'Paired_r', 'Pastel1', 'Pastel1_r', 'Pastel2', 'Pastel2_r',
        'PiYG', 'PiYG_r', 'PuBu', 'PuBuGn', 'PuBuGn_r', 'PuBu_r', 'PuOr', 'PuOr_r', 'PuRd', 'PuRd_r',
        'Purples', 'Purples_r', 'RdBu', 'RdBu_r', 'RdGy', 'RdGy_r', 'RdPu', 'RdPu_r', 'RdYlBu', 
        'RdYlBu_r', 'RdYlGn', 'RdYlGn_r', 'Reds', 'Reds_r', 'Set1', 'Set1_r', 'Set2', 'Set2_r', 
        'Set3', 'Set3_r', 'Spectral', 'Spectral_r', 'Wistia', 'Wistia_r', 'YlGn', 'YlGnBu', 'YlGnBu_r', 
        'YlGn_r', 'YlOrBr', 'YlOrBr_r', 'YlOrRd', 'YlOrRd_r', 'afmhot', 'afmhot_r', 'autumn', 'autumn_r', 
        'binary', 'binary_r', 'bone', 'bone_r', 'brg', 'brg_r', 'bwr', 'bwr_r', 
        'cool', 'cool_r',  'cubehelix', 'cubehelix_r', 
         'gist_earth', 'gist_earth_r', 'gist_gray', 'gist_gray_r', 'gist_heat', 
        'gist_heat_r', 'gist_ncar', 'gist_ncar_r', 'gist_rainbow', 'gist_rainbow_r', 'gist_stern', 
        'gist_stern_r', 'gist_yarg', 'gist_yarg_r', 'gnuplot', 'gnuplot2', 'gnuplot2_r', 'gnuplot_r', 
        'gray', 'gray_r', 'hot', 'hot_r', 'hsv', 'hsv_r', 'inferno', 'inferno_r', 'jet', 'jet_r', 
        'nipy_spectral', 'nipy_spectral_r', 'ocean', 'ocean_r', 'pink', 'pink_r', 
        'plasma', 'plasma_r',  'rainbow', 'rainbow_r',  
        'spring', 'spring_r', 'summer', 'summer_r', 'tab10', 'tab10_r', 'tab20', 'tab20_r', 'tab20b', 
        'tab20b_r', 'tab20c', 'tab20c_r', 'terrain', 'terrain_r', 'turbo', 'turbo_r', 'twilight', 
        'twilight_r', 'twilight_shifted', 'twilight_shifted_r', 'winter', 'winter_r'
    ]
    exc_list = [
        'flag', 'flag_r','prism', 'prism_r','cividis', 'cividis_r', 'coolwarm', 'coolwarm_r', 'copper', 'copper_r', 'magma', 'magma_r', 'seismic', 'seismic_r','viridis', 'viridis_r'
    ]
    return colorOpt
}





// // functions for options lists (Manual entering)
// function momCobaltInfo() {
//     var dateOpt = generateDateList()
//     let models = {
//         "MOMCobalt":{
//             "model":"regional MOM6",
//             "time":dateOpt
//         }
//     };
//     return models;
// };

// function createMomCobaltIniOpt(dataCobaltID) {
//     let elm = document.getElementById('dateMOMCobalt'); // get the select
//     let info = momCobaltInfo();
//     let dataname = dataCobaltID;
//     let iniOption = info[dataname]['time'];
//     df = optionList(iniOption,iniOption);
//     elm.appendChild(df); // append the document fragment to the DOM. this is the better way rather than setting innerHTML a bunch of times (or even once with a long string)
//     // assign last option to be the picked options by default
//     lastIndex = elm.options.length - 1;
//     pickedOption = elm.options[lastIndex];
//     pickedOption.selected = true;
// };


// function createFolium() {
//     let varFolium = $("#varMOMCobalt");
//     let dateFolium = $("#dateMOMCobalt");
//     let maxval = $("#maxval");
//     let minval = $("#minval");
//     let nlevel = $("#nlevel");

//     var ajaxGet = "/cgi-bin/cefi_portal/mom_folium.py"
//         +"?variable="+varFolium.val()
//         +"&date="+dateFolium.val()
//         +"&maxval="+maxval.val()
//         +"&minval="+minval.val()
//         +"&nlevel="+nlevel.val()

//     fetch(ajaxGet) // Replace with the URL you want to request
//         .then(response => {
//             if (!response.ok) {
//             throw new Error('Network response was not ok');
//             }
//             return response.text();
//         })
//         .then(data => {
//             // Process the response data here
//             momCobaltMap.attr("srcdoc", data)
//             $("div.workingTop").addClass("hidden");
//             $("div.errorTop").addClass("hidden");
//             $("div.whiteTop").removeClass("hidden");
//         })
//         .catch(error => {
//             // Handle errors here
//             console.error('Fetch error:', error);
//             $("div.workingTop").addClass("hidden");
//             $("div.errorTop").removeClass("hidden");
//             $("div.whiteTop").addClass("hidden");
//         });

//     // momCobaltMap.attr("src", ajaxGet)
// }



// // function to trigger ajax get to server cgi script
// function fetchDataAndPost(dateFolium) {
//     let varFolium = $("#varMOMCobalt");
//     let maxval = $("#maxval");
//     let minval = $("#minval");
//     let nlevel = $("#nlevel");

//     console.log(varFolium.val())
//     console.log(dateFolium)
//     var ajaxGet = "/cgi-bin/cefi_portal/mom_folium_png.py"
//                 +"?variable="+varFolium.val()
//                 +"&date="+dateFolium
//                 +"&maxval="+maxval.val()
//                 +"&minval="+minval.val()
//                 +"&nlevel="+nlevel.val()

//     var xhr = new XMLHttpRequest();
//     xhr.open('GET', ajaxGet, true);
//     $("div.workingTop").removeClass("hidden");
//     $("div.whiteTop").addClass("hidden");
//     xhr.onreadystatechange = function() {
//         if (xhr.readyState === 4 && xhr.status === 200) {
//             image_data = xhr.responseText
//             // console.log(image_data);  // Use the data in your JavaScript code
//             // momCobaltMap[0].contentWindow.postMessage(image_data, "*")
//             // replacing image
//             var regex1 = /^\s*"data:image\/png;base64,[^,\n]*,\n/gm;
//             var newHTML = momCobaltMap.attr('srcdoc').replace(regex1, '"'+image_data+'",\n');

//             momCobaltMap.attr("srcdoc", newHTML)
//             $("div.workingTop").addClass("hidden");
//             $("div.whiteTop").removeClass("hidden");
//             $("div.errorTop").addClass("hidden");
//         } else if (xhr.status === 200) {
//             $("div.errorTop").addClass("hidden");
//         }else {
//             console.log(xhr.readyState);
//             console.log(xhr.status);
//             $("div.workingTop").addClass("hidden");
//             $("div.whiteTop").addClass("hidden");
//             $("div.errorTop").removeClass("hidden");
//         }
//     };
//     xhr.send();
// }

// // function for replace folium colorbar
// function replaceFoliumCbar() {
//     let cbar = $("#cbarOpts")

//     var ajaxGet = "/cgi-bin/cefi_portal/mom_folium_cbar.py"
//         +"?cbar="+cbar.val()

//     console.log('https://webtest.psd.esrl.noaa.gov/'+ajaxGet)

//     fetch(ajaxGet) // Replace with the URL you want to request
//         .then(response => {
//             if (!response.ok) {
//             throw new Error('Network response was not ok');
//             }
//             return response.text();
//         })
//         .then(data => {
//             // Process the response data here
//             console.log(data)

//             //replace colorbar
//             var regexDom = /^\s*\.domain\([^)]*\)\n/gm;
//             var matchDoms = data.match(regexDom);
//             var domainArray1 = text2Array(matchDoms[0]);
//             var domainArray2 = text2Array(matchDoms[1]);
//             var regexRange = /^\s*\.range\([^)]*\);\n/gm;
//             var matchRanges = data.match(regexRange);
//             var rangeArray = text2Array(matchRanges[0].replace(/'/g, '"'));

//             //replace tickmark
//             var regexTickVal = /^\s*\.tickValues\([^)]*\);\n/gm;
//             var matchTickVal = data.match(regexTickVal);
//             var tickValArray = text2Array(matchTickVal[0]);

//             //replace colorbar label
//             var regexCLabel = /^\s*\.text\([^)]*\);\n/gm;
//             var matchCLabel = data.match(regexCLabel);
//             var textVal = extractText(matchCLabel[0]);

//             cbarData = {
//                 domain1: domainArray1,
//                 domain2: domainArray2,
//                 range: rangeArray,
//                 tick: tickValArray,
//                 label: textVal
//             };

//             // console.log(cbarData)
//             momCobaltMap[0].contentWindow.postMessage({ type: 'cbarData', data: cbarData }, "*")

//             $("div.workingTop").addClass("hidden");
//             $("div.errorTop").addClass("hidden");
//             $("div.whiteTop").removeClass("hidden");
//         })
//         .catch(error => {
//             // Handle errors here
//             console.error('Fetch error:', error);
//             $("div.workingTop").addClass("hidden");
//             $("div.errorTop").removeClass("hidden");
//             $("div.whiteTop").addClass("hidden");
//         });

//     // momCobaltMap.attr("src", ajaxGet)
// }
