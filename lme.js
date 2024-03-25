// global constant for image tag 
const lmeImg = document.querySelector('#lmePlot');
const lmeImgDownload = document.querySelector('#lmePlotDownload');
const lmeAni = document.querySelector('#lmeAnimeIFrame');
let errorLMEPlot = 0;

// add the plotMode radio button
let radioButtons = document.getElementsByName('plotMode');
showPickRadio();
let pickRadio = 'single';

// add the tsMode radio button
let radioButtonsTS = document.getElementsByName('tsMode');
showPickRadioTS();
let pickRadioTS = 'lmeTS';

// add event listener on radios to assign radio flag (pickRadio)
$('#singlePlot').on("click", function () {
    $(this).prop('checked',true);
    showPickRadio();     // just for console log
    pickRadio = 'single';
    $("#singlePlotInterface").removeClass("hidden");
    $("#comparePlotInterface").addClass("hidden");
    $("#compareDatasetInterface").addClass("hidden");
    $(".timeseriesInterfaceGroup").addClass("hidden");
    $("#animationInterface").addClass("hidden");
    $("#lmeAnime").addClass("hidden");
    $("#lmePlot").removeClass("hidden");
    if (errorLMEPlot == 1) {
        $("div.working").addClass("hidden");
        $("div.error").removeClass("hidden");
        $("#lmePlotDownload").addClass("hidden");
        $("#lmeDataDownload").addClass("hidden");
        $("#lmePlot").addClass("hidden");
    };
});
$('#comparePlot').on("click", function () {
    $(this).prop('checked',true);
    showPickRadio();
    pickRadio = 'compare';
    $("#singlePlotInterface").addClass("hidden");
    $("#comparePlotInterface").removeClass("hidden");
    $("#compareDatasetInterface").addClass("hidden");
    $(".timeseriesInterfaceGroup").addClass("hidden");
    $("#animationInterface").addClass("hidden");
    $("#lmeAnime").addClass("hidden");
    $("#lmePlot").removeClass("hidden");
    if (errorLMEPlot == 1) {
        $("div.working").addClass("hidden");
        $("div.error").removeClass("hidden");
        $("#lmePlotDownload").addClass("hidden");
        $("#lmeDataDownload").addClass("hidden");
        $("#lmePlot").addClass("hidden");
    };
});
$('#compareDataset').on("click", function () {
    $(this).prop('checked',true);
    showPickRadio();
    pickRadio = 'compareData';
    $("#singlePlotInterface").addClass("hidden");
    $("#comparePlotInterface").addClass("hidden");
    $("#compareDatasetInterface").removeClass("hidden");
    $(".timeseriesInterfaceGroup").addClass("hidden");
    $("#animationInterface").addClass("hidden");
    $("#lmeAnime").addClass("hidden");
    $("#lmePlot").removeClass("hidden");
    if (errorLMEPlot == 1) {
        $("div.working").addClass("hidden");
        $("div.error").removeClass("hidden");
        $("#lmePlotDownload").addClass("hidden");
        $("#lmeDataDownload").addClass("hidden");
        $("#lmePlot").addClass("hidden");
    };
});
$('#timeSeries').on("click", function () {
    $(this).prop('checked',true);
    showPickRadio();
    pickRadio = 'timeSeries';
    $("#singlePlotInterface").addClass("hidden");
    $("#comparePlotInterface").addClass("hidden");
    $("#compareDatasetInterface").addClass("hidden");
    $(".timeseriesInterfaceGroup").removeClass("hidden");
    $("#animationInterface").addClass("hidden");
    $("#lmeAnime").addClass("hidden");
    $("#lmePlot").removeClass("hidden");
    if (errorLMEPlot == 1) {
        $("div.working").addClass("hidden");
        $("div.error").removeClass("hidden");
        $("#lmePlotDownload").addClass("hidden");
        $("#lmeDataDownload").addClass("hidden");
        $("#lmePlot").addClass("hidden");
    };
});
$('#animation').on("click", function () {
    $(this).prop('checked',true);
    showPickRadio();
    pickRadio = 'animation';
    $("#singlePlotInterface").addClass("hidden");
    $("#comparePlotInterface").addClass("hidden");
    $("#compareDatasetInterface").addClass("hidden");
    $(".timeseriesInterfaceGroup").addClass("hidden");
    $("#animationInterface").removeClass("hidden");
    $("#lmeAnime").removeClass("hidden");
    $("#lmePlot").addClass("hidden");
    iframeButtonClick();
    if (errorLMEPlot == 1) {
        $("div.error").addClass("hidden");
    };
});

// for time series radios
$('#singlePTTS').on("click", function () {
    $(this).prop('checked',true);
    showPickRadioTS();
    pickRadioTS = 'singlePTTS';
    $("#lmeAWTS").addClass("hidden");
    $(".PTTS").removeClass("hidden");
});
$('#lmeTS').on("click", function () {
    $(this).prop('checked',true);
    showPickRadioTS();
    pickRadioTS = 'lmeTS';
    $("#lmeAWTS").removeClass("hidden");
    $(".PTTS").addClass("hidden");
});


// add the dataset options
createDatasetOpt('datasetType');
createDatasetOpt('datasetType1');
createDatasetOpt('datasetTypeD1');
createDatasetOpt('datasetTypeD2');
createDatasetTSOpt('datasetTypeTS1');
createDatasetOpt('datasetTypeAM');

// add the LME options
createLMEOpt('lmeNum');
createLMEOpt('lmeNum1');
createLMEOpt('lmeNumD');
createLMEOpt('lmeNumTS');
createLMEOpt('lmeNumAM');

// add the year options 
createYearOpt('year',2002);  // default syear value for noaa star
createYearOpt('year1',2002); // default syear value for noaa star
createYearOpt('year2',2002); // default syear value for noaa star
createYearOpt('yearD1',2002); // default syear value for noaa star
createYearOpt('yearD2',2002); // default syear value for noaa star
// const today = new Date();
// const latestYear = today.getFullYear();
createYearOpt('syear',2002); // default syear value for noaa star
createYearOpt('fyear',2002); // default fyear value for noaa star
createYearOpt('yearAM',2002); // default syear value for noaa star

// add the month options 
createMonthOpt('month', 1);  // default smonth value all month (for latestImage dropdown update to work)
createMonthOpt('month1', 9); // default smonth value for noaa star
createMonthOpt('month2', 9); // default smonth value for noaa star
createMonthOpt('monthD1', 9);// default smonth value for noaa star
createMonthOpt('monthD2', 9);// default smonth value for noaa star
createMonthOpt('monthAM',1); // default smonth value all month (for latestAnimation dropdown update to work)

// add the day options 
createDayOpt('day',31);
createDayOpt('day1',31);
createDayOpt('day2',31);
createDayOpt('dayD1',31);
createDayOpt('dayD2',31);
createDayOpt('dayAM',31);

// default image and options
latestImage();
latestAnimation();

// hide the loading signal when image finish loading
$('#lmePlot').on("load", function () {
    $("div.working").addClass("hidden");
    $("div.error").addClass("hidden");
    $("#lmePlot").removeClass("hidden");
    $("#lmePlotDownload").removeClass("hidden");
    // if (pickRadio == 'timeSeries') {
    //     $("#lmeDataDownload").removeClass("hidden");
    // }
    errorLMEPlot = 0;
});

// hide the loading signal and add the error signal when image not exist
$('#lmePlot').on("error", function () {
    console.log('No available data.');
    $("div.working").addClass("hidden");
    $("div.error").removeClass("hidden");
    $("#lmePlotDownload").addClass("hidden");
    $("#lmeDataDownload").addClass("hidden");
    $(this).removeAttr("src");
    $(this).addClass("hidden");
    errorLMEPlot = 1;
});

// hide the loading signal and play Ani when Anime finish loading (the first time)
$( window ).on( "load", function() {
    if (pickRadio == 'animation') {
        $("div.working").addClass("hidden");
        $("div.error").addClass("hidden");
        $("#lmeAnime").removeClass("hidden");
        $("#lmePlotDownload").addClass("hidden");
        $("#lmePlot").addClass("hidden");
        iframeButtonClick();
    }
});
// hide the loading signal and play Ani when Anime finish loading (after option changes )
$('#lmeAnimeIFrame').on("load", function () {
    if (pickRadio == 'animation') {
        $("div.working").addClass("hidden");
        $("div.error").addClass("hidden");
        $("#lmeAnime").removeClass("hidden");
        $("#lmePlotDownload").addClass("hidden");
        $("#lmePlot").addClass("hidden");
        iframeButtonClick();
    }
});

// event listener for the plot button that update image
$('#btn').on("click", updateImage);
$('#compareBtn').on("click", updateCompareImage);
$('#compareDBtn').on("click", updateCompareDataset);
$('#timeSeriesBtn').on("click", updateTimeseries);
$('#heatmapBtn').on("click", updateHeatmap);
$('#animeBtn').on("click", updateAnimation);

// event listener for year option due to dataset selection
$('#datasetType').on("change", {yearID : 'year'},updateYearOptAll);
$('#datasetType1').on("change", {yearID : 'year1'},updateYearOptAll);
$('#datasetType1').on("change", {yearID : 'year2'},updateYearOptAll);
$('#datasetTypeD1').on("change", {yearID : 'yearD1'},updateYearOptAll);
$('#datasetTypeD2').on("change", {yearID : 'yearD2'},updateYearOptAll);
$('#datasetTypeTS1').on("change", {yearID : 'syear'},updateTSYearOptAll);
$('#datasetTypeTS1').on("change", {yearID : 'fyear'},updateTSYearOptAll);
$('#datasetTypeAM').on("change", {yearID : 'yearAM'},updateYearOptAll);

// event listener for month option due to dataset selection
$('.dataInitMon').on("change",{dataID:'datasetType',yearID:'year',monthID:'month'}, updateMonthOptAll);
$('.dataInitMon1').on("change",{dataID:'datasetType1',yearID:'year1',monthID:'month1'}, updateMonthOptAll);
$('.dataInitMon2').on("change",{dataID:'datasetType1',yearID:'year2',monthID:'month2'}, updateMonthOptAll);
$('.dataInitMonD1').on("change",{dataID:'datasetTypeD1',yearID:'yearD1',monthID:'monthD1'}, updateMonthOptAll);
$('.dataInitMonD2').on("change",{dataID:'datasetTypeD2',yearID:'yearD2',monthID:'monthD2'}, updateMonthOptAll);
$('.dataInitMonAM').on("change",{dataID:'datasetTypeAM',yearID:'yearAM',monthID:'monthAM'}, updateMonthOptAll);

// event listener for day option due to month/year selection
$('.calenderChange').on("change",{yearID:'year',monthID:'month',dayID:'day'}, updateDayOptAll);
$('.calenderChange1').on("change",{yearID:'year1',monthID:'month1',dayID:'day1'}, updateDayOptAll);
$('.calenderChange2').on("change",{yearID:'year2',monthID:'month2',dayID:'day2'}, updateDayOptAll);
$('.calenderChangeD1').on("change",{yearID:'yearD1',monthID:'monthD1',dayID:'dayD1'}, updateDayOptAll);
$('.calenderChangeD2').on("change",{yearID:'yearD2',monthID:'monthD2',dayID:'dayD2'}, updateDayOptAll);
$('.calenderChangeAM').on("change",{yearID:'yearAM',monthID:'monthAM',dayID:'dayAM'}, updateDayOptAll);

// event listener for frequency option 
$('#tFreq').on("change", function () {
    let tSelect = document.getElementById("tFreq").value;
    if (tSelect === 'monthly') {
        $("#dayRow").addClass("hidden");
        $("#90PercThres").removeClass("hidden");
        $("#95PercThres").removeClass("hidden");
        $("#99PercThres").removeClass("hidden");
        $("#90MHW").removeClass("hidden");
        $("#95MHW").removeClass("hidden");
        $("#99MHW").removeClass("hidden");
    } else if (tSelect === 'daily') {
        $("#dayRow").removeClass("hidden");
        $("#90PercThres").addClass("hidden");
        $("#95PercThres").addClass("hidden");
        $("#99PercThres").addClass("hidden");
        $("#90MHW").addClass("hidden");
        $("#95MHW").addClass("hidden");
        $("#99MHW").addClass("hidden");
        if ($("#stat").val() === '90perc' || $("#stat").val() === '95perc' || $("#stat").val() === '99perc' || $("#stat").val() === '90mhw' || $("#stat").val() === '95mhw' || $("#stat").val() === '99mhw') {
           $("#stat").val('absolute'); 
        }
        // console.log($("#stat").val())
        
    }
});
$('#tFreq1').on("change", function () {
    let tSelect = document.getElementById("tFreq1").value;
    if (tSelect === 'monthly') {
        $("#day1Row").addClass("hidden");
    } else if (tSelect === 'daily') {
        $("#day1Row").removeClass("hidden");
    }
});
$('#tFreq2').on("change", function () {
    let tSelect = document.getElementById("tFreq2").value;
    if (tSelect === 'monthly') {
        $("#day2Row").addClass("hidden");
    } else if (tSelect === 'daily') {
        $("#day2Row").removeClass("hidden");
    }
});
$('#tFreqD1').on("change", function () {
    let tSelect = document.getElementById("tFreqD1").value;
    if (tSelect === 'monthly') {
        $("#dayD1Row").addClass("hidden");
    } else if (tSelect === 'daily') {
        $("#dayD1Row").removeClass("hidden");
    }
});
$('#tFreqD2').on("change", function () {
    let tSelect = document.getElementById("tFreqD2").value;
    if (tSelect === 'monthly') {
        $("#dayD2Row").addClass("hidden");
    } else if (tSelect === 'daily') {
        $("#dayD2Row").removeClass("hidden");
    }
});

// event listener for statistic option 
$('#stat').on("change", function () {
    let statSelect = document.getElementById("stat").value;
    if (statSelect === 'climatology') {
        $("#yearRow").addClass("hidden");
    } else {
        $("#yearRow").removeClass("hidden");
    }
});
$('#stat').on("change", function () {
    let statSelect = document.getElementById("stat").value;
    if (statSelect.includes('perc')) {
        $("#yearRow").addClass("hidden");
    } else {
        $("#yearRow").removeClass("hidden");
    }
});
$('#stat1').on("change", function () {
    let statSelect = document.getElementById("stat1").value;
    if (statSelect === 'climatology') {
        $("#year1Row").addClass("hidden");
    } else {
        $("#year1Row").removeClass("hidden");
    }
});
$('#stat2').on("change", function () {
    let statSelect = document.getElementById("stat2").value;
    if (statSelect === 'climatology') {
        $("#year2Row").addClass("hidden");
    } else {
        $("#year2Row").removeClass("hidden");
    }
});



//execute code after DOM is ready
function iframeButtonClick() {
    //find iframe
    let iframe = $('#lmeAnimeIFrame');
    //find button inside iframe
    let button = iframe.contents().find('.anim-buttons > button:nth-child(6)');
    //trigger button click
    button.trigger("click");
};

// function for different plotting mode
function showPickRadio() {
    for(i = 0; i < radioButtons.length; i++) {
        if(radioButtons[i].checked){
            //console.log(radioButtons[i].value);
        }
    }
}
function showPickRadioTS() {
    for(i = 0; i < radioButtonsTS.length; i++) {
        if(radioButtonsTS[i].checked){
            //console.log(radioButtonsTS[i].value);
        }
    }
}

// functions for change event on different option
function updateTSYearOptAll(event) {
    // store original picked year
    let yearID = event.data.yearID;
    let selectYear = document.getElementById(yearID);
    for (var i=0; i<selectYear.options.length; i++) {
        let option = selectYear.options[i];
        if (option.selected == true) {
            yearOrig = option.value;
            //console.log('Original picked year '+yearOrig);
        } 
    }
    // read the dataset and syear array
    let datasetSelect = $(this).val();
    //console.log('Dataset change to '+datasetSelect);
    let datasets = datasetNames(); // store dataset names
    let syears = datasetTSSyears(); // store dataset start years
    //console.log('Dataset name '+datasets[datasetSelect-1]);
    syear = syears[datasetSelect-1];
    //console.log('Syear at '+syear);
    $("#"+yearID).empty();
    createYearOpt(yearID,syear);
    // update to original picked year
    let selectYearNew = document.getElementById(yearID);
    for (var i=0; i<selectYearNew.options.length; i++) {
        let option = selectYearNew.options[i];
        if (option.value == yearOrig) {
            option.selected = true;
        } 
    }
};

function updateYearOptAll(event) {
    // store original picked year
    let yearID = event.data.yearID;
    let selectYear = document.getElementById(yearID);
    for (var i=0; i<selectYear.options.length; i++) {
        let option = selectYear.options[i];
        if (option.selected == true) {
            yearOrig = option.value;
            //console.log('Original picked year '+yearOrig);
        } 
    }
    // read the dataset and syear array
    let datasetSelect = $(this).val();
    //console.log('Dataset change to '+datasetSelect);
    let datasets = datasetNames(); // store dataset names
    let syears = datasetSyears(); // store dataset start years
    //console.log('Dataset name '+datasets[datasetSelect-1]);
    syear = syears[datasetSelect-1];
    //console.log('Syear at '+syear);
    $("#"+yearID).empty();
    createYearOpt(yearID,syear);
    // update to original picked year
    let selectYearNew = document.getElementById(yearID);
    for (var i=0; i<selectYearNew.options.length; i++) {
        let option = selectYearNew.options[i];
        if (option.value == yearOrig) {
            option.selected = true;
        } 
    }
};

function updateMonthOptAll(event) {
    //console.log('updateMonthOptAll triggered');
    let dataID = event.data.dataID;
    let yearID = event.data.yearID;
    let monthID = event.data.monthID;

    // store original picked month
    let selectMonth = document.getElementById(monthID);
    for (var i=0; i<selectMonth.options.length; i++) {
        let option = selectMonth.options[i];
        if (option.selected == true) {
            monthOrig = option.value;
            //console.log('Original picked month '+monthOrig);
        } 
    }
    
    // read the dataset and smonth array
    let datasetSelect = document.getElementById(dataID).value;
    let yearSelect = document.getElementById(yearID).value;
    let datasets = datasetNames(); // store dataset names
    let syears = datasetSyears(); // store dataset start years
    let smonths = datasetSmonths(); // store dataset start months
    syear = syears[datasetSelect-1];
    smonth = smonths[datasetSelect-1];

    // if the year option is set to the initial year of the dataset month switch to smonth
    // else the month is set to original month
    if (yearSelect == syear) {
        //console.log('Dataset '+datasets[datasetSelect-1]+' with year change to '+syear);
        //console.log('Smonth at '+smonth);
        $("#"+monthID).empty();
        createMonthOpt(monthID,smonth);
    } else {
        $("#"+monthID).empty();
        createMonthOpt(monthID,1); 
        // update to original picked year
        let selectMonthNew = document.getElementById(monthID);
        for (var i=0; i<selectMonthNew.options.length; i++) {
            let option = selectMonthNew.options[i];
            if (option.value == monthOrig) {
                option.selected = true;
            }; 
        };
    };
};


function updateDayOptAll(event) {
    let yearID = event.data.yearID;
    let monthID = event.data.monthID;
    let dayID = event.data.dayID;

    let monthSelect = document.getElementById(monthID).value;
    let yearSelect = document.getElementById(yearID).value;
    //console.log('year change to '+yearSelect);
    //console.log('month change to '+monthSelect);
    const month30Day = ['4','6','9','11'];
    const month28Day = '2';
    if (month30Day.includes(monthSelect)) {
        $("#"+dayID).empty();
        createDayOpt(dayID,30);
    } else if (month28Day == monthSelect) {
        if (yearSelect%4 == 0) {
            $("#"+dayID).empty();
            createDayOpt(dayID,29);
        }
        else {
            $("#"+dayID).empty();
            createDayOpt(dayID,28);
        }
    } else {
        $("#"+dayID).empty();
        createDayOpt(dayID,31);
    }
};



// functions creating list in different options
function createDayOpt(dayID,totaldays) {
    let elm = document.getElementById(dayID); // get the select
    let df = document.createDocumentFragment(); // create a document fragment to hold the options while we create them
    for (let i = 1; i <= totaldays; i++) { // loop
        let option = document.createElement('option'); // create the option element
        option.value = i; // set the value property
        option.appendChild(document.createTextNode(i)); // set the textContent in a safe way.
        df.appendChild(option); // append the option to the document fragment
    }
    elm.appendChild(df); // append the document fragment to the DOM. this is the better way rather than setting innerHTML a bunch of times (or even once with a long string)
};

function createMonthOpt(monthID,smonth) {
    let elm = document.getElementById(monthID); // get the select
    let df = document.createDocumentFragment(); // create a document fragment to hold the options while we create them
    let monthString = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    for (let i = smonth; i <= 12; i++) { // loop
        let option = document.createElement('option'); // create the option element
        option.value = i; // set the value property
        option.appendChild(document.createTextNode(monthString[i-1])); // set the textContent in a safe way.
        df.appendChild(option); // append the option to the document fragment
    }
    elm.appendChild(df); // append the document fragment to the DOM. this is the better way rather than setting innerHTML a bunch of times (or even once with a long string)
};

function createYearOpt(yearID,syear) {
    const today = new Date();
    const latestYear = today.getFullYear();

    let elm = document.getElementById(yearID); // get the select
    let df = document.createDocumentFragment(); // create a document fragment to hold the options while we create them
    for (let i = syear; i <= latestYear; i++) { // loop
        let option = document.createElement('option'); // create the option element
        option.value = i; // set the value property
        option.appendChild(document.createTextNode(i)); // set the textContent in a safe way.
        df.appendChild(option); // append the option to the document fragment
    }
    elm.appendChild(df); // append the document fragment to the DOM. this is the better way rather than setting innerHTML a bunch of times (or even once with a long string)
};

function createDatasetOpt(dataID) {
    let elm = document.getElementById(dataID); // get the select
    let df = document.createDocumentFragment(); // create a document fragment to hold the options while we create them
    let datasets = datasetNames(); // store dataset names
    for (let i = 0; i <= datasets.length-1; i++) { // loop
        let option = document.createElement('option'); // create the option element
        option.value = i+1; // set the value property
        option.appendChild(document.createTextNode((i+1)+". "+datasets[i])); // set the textContent in a safe way.
        df.appendChild(option); // append the option to the document fragment
    }
    elm.appendChild(df); // append the document fragment to the DOM. this is the better way rather than setting innerHTML a bunch of times (or even once with a long string)
};

function createDatasetTSOpt(dataID) {
    let elm = document.getElementById(dataID); // get the select
    let df = document.createDocumentFragment(); // create a document fragment to hold the options while we create them
    let datasets = datasetTSNames(); // store dataset names
    for (let i = 0; i <= datasets.length-1; i++) { // loop
        let option = document.createElement('option'); // create the option element
        option.value = i+1; // set the value property
        option.appendChild(document.createTextNode((i+1)+". "+datasets[i])); // set the textContent in a safe way.
        df.appendChild(option); // append the option to the document fragment
    }
    elm.appendChild(df); // append the document fragment to the DOM. this is the better way rather than setting innerHTML a bunch of times (or even once with a long string)
};

function createLMEOpt(lmeNumID) {
    let elm = document.getElementById(lmeNumID); // get the select
    let df = document.createDocumentFragment(); // create a document fragment to hold the options while we create them
    let lmes = lmeNames(); // store LME names
    for (let i = 0; i <= lmes.length-1; i++) { // loop
        let option = document.createElement('option'); // create the option element
        option.value = i+1; // set the value property
        option.appendChild(document.createTextNode((i+1)+". "+lmes[i])); // set the textContent in a safe way.
        df.appendChild(option); // append the option to the document fragment
    }
    elm.appendChild(df); // append the document fragment to the DOM. this is the better way rather than setting innerHTML a bunch of times (or even once with a long string)
};


// Functions for default action on the page
function latestImage() {
    const today = new Date();
    let yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const latestYear = yesterday.getFullYear();
    const latestMonth = yesterday.getMonth()+1;
    const latestDay = yesterday.getDate();
    const defaultTFreq = "daily";
    const defaultLmeNum = 1;
    const defaultStat = "absolute";
    const defaultDataset = 1;

    let selectDataset = document.getElementById('datasetType');
    for (var i=0; i<selectDataset.options.length; i++) {
        let option = selectDataset.options[i];
        if (option.value == defaultDataset) {
            option.selected = true;
        } 
    }

    let selectLME = document.getElementById('lmeNum');
    for (var i=0; i<selectLME.options.length; i++) {
        let option = selectLME.options[i];
        if (option.value == defaultLmeNum) {
            option.selected = true;
        } 
    }

    let selectYear = document.getElementById('year');
    for (var i=0; i<selectYear.options.length; i++) {
        let option = selectYear.options[i];
        if (option.value == latestYear) {
            option.selected = true;
        } 
    }

    let selectMonth = document.getElementById('month');
    for (var i=0; i<selectMonth.options.length; i++) {
        let option = selectMonth.options[i];
        if (option.value == latestMonth) {
            option.selected = true;
        } 
    }

    const month30Day = [4,6,9,11];
    const month28Day = 2;

    if (month30Day.includes(latestMonth)) {
        $("#day").empty();
        createDayOpt('day',30);
    } else if (month28Day == latestMonth) {
        $("#day").empty();
        createDayOpt('day',28);
    } else {
        $("#day").empty();
        createDayOpt('day',31);
    };

    let selectDay = document.getElementById('day');
    for (var i=0; i<selectDay.options.length; i++) {
        let option = selectDay.options[i];
        if (option.value == latestDay) {
            option.selected = true;
        } 
    }

    //console.log("the Default Dataset num is "+defaultDataset);
    //console.log("the Default LME num is "+defaultLmeNum);
    //console.log("the Default T frequency is "+defaultTFreq);
    //console.log("the Default stat is "+defaultStat);
    //console.log("the Default year is "+latestYear);
    //console.log("the Default month is "+latestMonth);
    //console.log("the Default day is "+latestDay);
    

    lmeImg.src = "/cgi-bin/marinehw/HighRes_coastal_static_mod.py"
                +"?lme_num="+defaultLmeNum
                +"&dataset="+defaultDataset
                +"&tFrequency="+defaultTFreq
                +"&statistic="+defaultStat
                +"&year="+latestYear
                +"&month="+latestMonth
                +"&day="+latestDay;
    lmeImgDownload.href = "/cgi-bin/marinehw/HighRes_coastal_static_mod.py"
                +"?lme_num="+defaultLmeNum
                +"&dataset="+defaultDataset
                +"&tFrequency="+defaultTFreq
                +"&statistic="+defaultStat
                +"&year="+latestYear
                +"&month="+latestMonth
                +"&day="+latestDay;
}

// Functions for button submissions
function updateImage() {
    let datasetSelect = document.getElementById("datasetType");
    let lmeNumSelect = document.getElementById("lmeNum");
    let tFreqSelect = document.getElementById("tFreq");
    let statSelect = document.getElementById("stat");
    let yearSelect = document.getElementById("year");
    let monthSelect = document.getElementById("month");
    let daySelect = document.getElementById("day");

    $("#lmePlotDownload").addClass("hidden");
    $("#lmeDataDownload").addClass("hidden");
    $("#lmeAnime").addClass("hidden");
    // lmeAni.removeAttribute("src");
    $("#lmePlot").addClass("hidden");
    // lmeImg.removeAttribute("src");
    $("div.working").removeClass("hidden");
    $("div.error").addClass("hidden")
    
    //console.log("the input Dataset num is "+datasetSelect.value);
    //console.log("the input LME num is "+lmeNumSelect.value);
    //console.log("the input T frequency is "+tFreqSelect.value);
    //console.log("the input stat is "+statSelect.value);
    //console.log("the input year is "+yearSelect.value);
    //console.log("the input month is "+monthSelect.value);
    //console.log("the input day is "+daySelect.value);
    lmeImg.src = "/cgi-bin/marinehw/HighRes_coastal_static_mod.py"
                +"?lme_num="+lmeNumSelect.value
                +"&dataset="+datasetSelect.value
                +"&tFrequency="+tFreqSelect.value
                +"&statistic="+statSelect.value
                +"&year="+yearSelect.value
                +"&month="+monthSelect.value
                +"&day="+daySelect.value;
    lmeImgDownload.href = "/cgi-bin/marinehw/HighRes_coastal_static_mod.py"
                +"?lme_num="+lmeNumSelect.value
                +"&dataset="+datasetSelect.value
                +"&tFrequency="+tFreqSelect.value
                +"&statistic="+statSelect.value
                +"&year="+yearSelect.value
                +"&month="+monthSelect.value
                +"&day="+daySelect.value;
}

function updateCompareImage() {
    let datasetSelect = document.getElementById("datasetType1");
    let lmeNumSelect = document.getElementById("lmeNum1");

    let tFreqSelect1 = document.getElementById("tFreq1");
    let statSelect1 = document.getElementById("stat1");
    let yearSelect1 = document.getElementById("year1");
    let monthSelect1 = document.getElementById("month1");
    let daySelect1 = document.getElementById("day1");

    let tFreqSelect2 = document.getElementById("tFreq2");
    let statSelect2 = document.getElementById("stat2");
    let yearSelect2 = document.getElementById("year2");
    let monthSelect2 = document.getElementById("month2");
    let daySelect2 = document.getElementById("day2");

    $("#lmePlotDownload").addClass("hidden");
    $("#lmeDataDownload").addClass("hidden");
    $("#lmeAnime").addClass("hidden");
    // lmeAni.removeAttribute("src");
    $("#lmePlot").addClass("hidden");
    // lmeImg.removeAttribute("src");
    $("div.working").removeClass("hidden");
    $("div.error").addClass("hidden")
    
    //console.log("the input dataset num is "+datasetSelect.value);
    //console.log("the input LME num is "+lmeNumSelect.value);

    //console.log("the input T frequency1 is "+tFreqSelect1.value);
    //console.log("the input stat1 is "+statSelect1.value);
    //console.log("the input year1 is "+yearSelect1.value);
    //console.log("the input month1 is "+monthSelect1.value);
    //console.log("the input day1 is "+daySelect1.value);

    //console.log("the input T frequency2 is "+tFreqSelect2.value);
    //console.log("the input stat2 is "+statSelect2.value);
    //console.log("the input year2 is "+yearSelect2.value);
    //console.log("the input month2 is "+monthSelect2.value);
    //console.log("the input day2 is "+daySelect2.value);

    lmeImg.src = "/cgi-bin/marinehw/HighRes_coastal_static_compare.py"
                +"?lme_num1="+lmeNumSelect.value
                +"&dataset1="+datasetSelect.value
                +"&tFrequency1="+tFreqSelect1.value
                +"&statistic1="+statSelect1.value
                +"&year1="+yearSelect1.value
                +"&month1="+monthSelect1.value
                +"&day1="+daySelect1.value
                +"&tFrequency2="+tFreqSelect2.value
                +"&statistic2="+statSelect2.value
                +"&year2="+yearSelect2.value
                +"&month2="+monthSelect2.value
                +"&day2="+daySelect2.value;
    lmeImgDownload.href = "/cgi-bin/marinehw/HighRes_coastal_static_compare.py"
                +"?lme_num1="+lmeNumSelect.value
                +"&dataset1="+datasetSelect.value
                +"&tFrequency1="+tFreqSelect1.value
                +"&statistic1="+statSelect1.value
                +"&year1="+yearSelect1.value
                +"&month1="+monthSelect1.value
                +"&day1="+daySelect1.value
                +"&tFrequency2="+tFreqSelect2.value
                +"&statistic2="+statSelect2.value
                +"&year2="+yearSelect2.value
                +"&month2="+monthSelect2.value
                +"&day2="+daySelect2.value;
}

function updateCompareDataset() {
    let lmeNumSelect = document.getElementById("lmeNumD");

    let datasetSelectD1 = document.getElementById("datasetTypeD1");
    let tFreqSelectD1 = document.getElementById("tFreqD1");
    let yearSelectD1 = document.getElementById("yearD1");
    let monthSelectD1 = document.getElementById("monthD1");
    let daySelectD1 = document.getElementById("dayD1");

    let datasetSelectD2 = document.getElementById("datasetTypeD2");
    let tFreqSelectD2 = document.getElementById("tFreqD2");
    let yearSelectD2 = document.getElementById("yearD2");
    let monthSelectD2 = document.getElementById("monthD2");
    let daySelectD2 = document.getElementById("dayD2");

    $("#lmePlotDownload").addClass("hidden");
    $("#lmeDataDownload").addClass("hidden");
    $("#lmeAnime").addClass("hidden");
    // lmeAni.removeAttribute("src");
    $("#lmePlot").addClass("hidden");
    // lmeImg.removeAttribute("src");
    $("div.working").removeClass("hidden");
    $("div.error").addClass("hidden")
    
    //console.log("entering dataset comparison cgi call");
    //console.log("the input LME num is "+lmeNumSelect.value);

    //console.log("the input dataset1 num is "+datasetSelectD1.value);
    //console.log("the input T frequencyD1 is "+tFreqSelectD1.value);
    //console.log("the input yearD1 is "+yearSelectD1.value);
    //console.log("the input monthD1 is "+monthSelectD1.value);
    //console.log("the input dayD1 is "+daySelectD1.value);

    ////console.log("the input dataset2 num is "+datasetSelectD2.value);
    //console.log("the input T frequencyD2 is "+tFreqSelectD2.value);
    //console.log("the input yearD2 is "+yearSelectD2.value);
    //console.log("the input monthD2 is "+monthSelectD2.value);
    //console.log("the input dayD2 is "+daySelectD2.value);

    lmeImg.src = "/cgi-bin/marinehw/HighRes_coastal_static_compare_dataset.py"
                +"?lme_numD="+lmeNumSelect.value
                +"&datasetD1="+datasetSelectD1.value
                +"&tFrequencyD1="+tFreqSelectD1.value
                +"&yearD1="+yearSelectD1.value
                +"&monthD1="+monthSelectD1.value
                +"&dayD1="+daySelectD1.value
                +"&datasetD2="+datasetSelectD2.value
                +"&tFrequencyD2="+tFreqSelectD2.value
                +"&yearD2="+yearSelectD2.value
                +"&monthD2="+monthSelectD2.value
                +"&dayD2="+daySelectD2.value;
    lmeImgDownload.href = "/cgi-bin/marinehw/HighRes_coastal_static_compare_dataset.py"
                +"?lme_numD="+lmeNumSelect.value
                +"&datasetD1="+datasetSelectD1.value
                +"&tFrequencyD1="+tFreqSelectD1.value
                +"&yearD1="+yearSelectD1.value
                +"&monthD1="+monthSelectD1.value
                +"&dayD1="+daySelectD1.value
                +"&datasetD2="+datasetSelectD2.value
                +"&tFrequencyD2="+tFreqSelectD2.value
                +"&yearD2="+yearSelectD2.value
                +"&monthD2="+monthSelectD2.value
                +"&dayD2="+daySelectD2.value;
}


function updateTimeseries() {
    let lonVal = document.getElementById("lonTS");
    let latVal = document.getElementById("latTS");
    let lmeNumSelect = document.getElementById("lmeNumTS");
    let datasetSelectTS1 = document.getElementById("datasetTypeTS1");
    // let tFreqSelectD1 = document.getElementById("tFreqD1");
    let statTS1 = document.getElementById("tStatTS1");
    let syearSelectTS1 = document.getElementById("syear");
    let fyearSelectTS1 = document.getElementById("fyear");
    let mhw = document.getElementById("threshold");

    $("#lmePlotDownload").addClass("hidden");
    $("#lmeDataDownload").addClass("hidden");
    $("#lmeAnime").addClass("hidden");
    // lmeAni.removeAttribute("src");
    $("#lmePlot").addClass("hidden");
    // lmeImg.removeAttribute("src");
    $("div.working").removeClass("hidden");
    $("div.error").addClass("hidden")
    
    //console.log("entering time series line cgi call");
    //console.log("radio pick TSmode is "+pickRadioTS);
    //console.log("the input lon is "+lonVal.value);
    //console.log("the input lat is "+latVal.value);
    //console.log("the input LME num is "+lmeNumSelect.value);
    //console.log("the input dataset num is "+datasetSelectTS1.value);
    //console.log("the input statistic is "+statTS1.value);
    //console.log("the input syear is "+syearSelectTS1.value);
    //console.log("the input fyear is "+fyearSelectTS1.value);
    //console.log("the input mhw is "+mhw.value);

    var ajaxGet = "/cgi-bin/marinehw/HighRes_coastal_static_timeseries.py"
    +"?lme_num="+lmeNumSelect.value
    +"&tsMode="+pickRadioTS
    +"&lon_TS="+lonVal.value
    +"&lat_TS="+latVal.value
    +"&dataset="+datasetSelectTS1.value
    +"&varmode="+statTS1.value
    +"&syear="+syearSelectTS1.value
    +"&fyear="+fyearSelectTS1.value
    +"&mhw_threshold="+mhw.value;

    fetch(ajaxGet) // Replace with the URL you want to request
        .then(response => {
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            return response.blob();
        })
        .then(imageBlob => {
            // Process the response image here
            const imageUrl = URL.createObjectURL(imageBlob);
            // attached to src of lmeImg
            lmeImg.src = imageUrl;
            // attached to href of lmeImgDownload
            lmeImgDownload.href = imageUrl;
            // setup data path to href of lmeDataDownload
            const sessionId = getCookie('session_id');
            lmeDataDownload.href = "/tmp/marinehw/HighRes_LME_ts_"+sessionId+".nc";
            console.log(lmeDataDownload.href);

            $("div.working").addClass("hidden");
            $("div.error").addClass("hidden");
            $("#lmePlot").removeClass("hidden");
            $("#lmePlotDownload").removeClass("hidden");
            $("#lmeDataDownload").removeClass("hidden");
            errorLMEPlot = 0;
        })
        .catch(error => {
            // Handle errors here
            console.error('Fetch error:', error);

        });


    // lmeImg.src = "/cgi-bin/marinehw/HighRes_coastal_static_timeseries.py"
    //             +"?lme_num="+lmeNumSelect.value
    //             +"&tsMode="+pickRadioTS
    //             +"&lon_TS="+lonVal.value
    //             +"&lat_TS="+latVal.value
    //             +"&dataset="+datasetSelectTS1.value
    //             +"&varmode="+statTS1.value
    //             +"&syear="+syearSelectTS1.value
    //             +"&fyear="+fyearSelectTS1.value
    //             +"&mhw_threshold="+mhw.value;
    // lmeImgDownload.href = "/cgi-bin/marinehw/HighRes_coastal_static_timeseries.py"
    //             +"?lme_num="+lmeNumSelect.value
    //             +"&tsMode="+pickRadioTS
    //             +"&lon_TS="+lonVal.value
    //             +"&lat_TS="+latVal.value
    //             +"&dataset="+datasetSelectTS1.value
    //             +"&varmode="+statTS1.value
    //             +"&syear="+syearSelectTS1.value
    //             +"&fyear="+fyearSelectTS1.value
    //             +"&mhw_threshold="+mhw.value;
    
    
}

function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName === name) {
            return decodeURIComponent(cookieValue);
        }
    }
    return null; // Cookie not found
};


function updateHeatmap() {
    let lonVal = document.getElementById("lonTS");
    let latVal = document.getElementById("latTS");
    let lmeNumSelect = document.getElementById("lmeNumTS");
    let datasetSelectTS1 = document.getElementById("datasetTypeTS1");
    // let tFreqSelectD1 = document.getElementById("tFreqD1");
    let syearSelectTS1 = document.getElementById("syear");
    let fyearSelectTS1 = document.getElementById("fyear");
    let mhw = document.getElementById("threshold");

    $("#lmePlotDownload").addClass("hidden");
    $("#lmeDataDownload").addClass("hidden");
    $("#lmeAnime").addClass("hidden");
    // lmeAni.removeAttribute("src");
    $("#lmePlot").addClass("hidden");
    // lmeImg.removeAttribute("src");
    $("div.working").removeClass("hidden");
    $("div.error").addClass("hidden")
    
    //console.log("entering time series heatmap cgi call");
    //console.log("radio pick TSmode is "+pickRadioTS);
    //console.log("the input lon is "+lonVal.value);
    //console.log("the input lat is "+latVal.value);
    //console.log("the input LME num is "+lmeNumSelect.value);
    //console.log("the input dataset num is "+datasetSelectTS1.value);
    //console.log("the input syear is "+syearSelectTS1.value);
    //console.log("the input fyear is "+fyearSelectTS1.value);
    //console.log("the input mhw is "+mhw.value);

    lmeImg.src = "/cgi-bin/marinehw/HighRes_coastal_static_timeseriesHeatMap.py"
                +"?lme_num="+lmeNumSelect.value
                +"&tsMode="+pickRadioTS
                +"&lon_TS="+lonVal.value
                +"&lat_TS="+latVal.value
                +"&dataset="+datasetSelectTS1.value
                +"&syear="+syearSelectTS1.value
                +"&fyear="+fyearSelectTS1.value
                +"&mhw_threshold="+mhw.value;

    lmeImgDownload.href = "/cgi-bin/marinehw/HighRes_coastal_static_timeseriesHeatMap.py"
                +"?lme_num="+lmeNumSelect.value
                +"&tsMode="+pickRadioTS
                +"&lon_TS="+lonVal.value
                +"&lat_TS="+latVal.value
                +"&dataset="+datasetSelectTS1.value
                +"&syear="+syearSelectTS1.value
                +"&fyear="+fyearSelectTS1.value
                +"&mhw_threshold="+mhw.value;
}

// Functions for default action on the page
function latestAnimation() {
    const today = new Date();
    let latestday = new Date();
    latestday.setDate(today.getDate() - 8);

    const latestYear = latestday.getFullYear();
    const latestMonth = latestday.getMonth()+1;
    const latestDay = latestday.getDate();
    const defaultLmeNum = 1;
    const defaultDataset = 1;

    let selectDataset = document.getElementById('datasetTypeAM');
    for (var i=0; i<selectDataset.options.length; i++) {
        let option = selectDataset.options[i];
        if (option.value == defaultDataset) {
            option.selected = true;
        } 
    }

    let selectLME = document.getElementById('lmeNumAM');
    for (var i=0; i<selectLME.options.length; i++) {
        let option = selectLME.options[i];
        if (option.value == defaultLmeNum) {
            option.selected = true;
        } 
    }

    let selectYear = document.getElementById('yearAM');
    for (var i=0; i<selectYear.options.length; i++) {
        let option = selectYear.options[i];
        if (option.value == latestYear) {
            option.selected = true;
        } 
    }

    let selectMonth = document.getElementById('monthAM');
    //console.log("the Animation testing "+selectMonth.options)
    for (var i=0; i<selectMonth.options.length; i++) {
        let option = selectMonth.options[i];
        if (option.value == latestMonth) {
            option.selected = true;
            //console.log("the Animation testing");
        } 
    }

    const month30Day = [4,6,9,11];
    const month28Day = 2;

    if (month30Day.includes(latestMonth)) {
        $("#dayAM").empty();
        createDayOpt('dayAM',30);
    } else if (month28Day == latestMonth) {
        $("#dayAM").empty();
        createDayOpt('dayAM',28);
    } else {
        $("#dayAM").empty();
        createDayOpt('dayAM',31);
    };

    let selectDay = document.getElementById('dayAM');
    for (var i=0; i<selectDay.options.length; i++) {
        let option = selectDay.options[i];
        if (option.value == latestDay) {
            option.selected = true;
        } 
    }

    //console.log("the Default Animation setting");
    //console.log("the Default Dataset num is "+defaultDataset);
    //console.log("the Default LME num is "+defaultLmeNum);
    //console.log("the Default year is "+latestYear);
    //console.log("the Default month is "+latestMonth);
    //console.log("the Default day is "+latestDay);
    

    lmeAni.src = "/cgi-bin/marinehw/HighRes_coastal_animate_test.py"
                +"?dataset="+defaultDataset
                +"&lme_num="+defaultLmeNum
                +"&year="+latestYear
                +"&month="+latestMonth
                +"&day="+latestDay;
    
    $("#lmeAnime").addClass("hidden");
}

function updateAnimation() {
    let lmeNumSelect = document.getElementById("lmeNumAM");
    let datasetSelectAM = document.getElementById("datasetTypeAM");
    // let tFreqSelectD1 = document.getElementById("tFreqD1");
    let yearSelectAM = document.getElementById("yearAM");
    let monthSelectAM = document.getElementById("monthAM");
    let daySelectAM = document.getElementById("dayAM");

    const today = new Date();
    let latestday = new Date();
    latestday.setDate(today.getDate() - 8);
    const latestYear = latestday.getFullYear();
    const latestMonth = latestday.getMonth()+1;
    const latestDay = latestday.getDate();
    let maxDate = new Date(latestYear,latestMonth-1,latestDay);
    let pickDate = new Date(yearSelectAM.value,monthSelectAM.value-1,daySelectAM.value);

    if (pickDate.setHours(0,0,0,0)<=maxDate.setHours(0,0,0,0)){
        $("#lmePlotDownload").addClass("hidden");
        $("#lmeAnime").addClass("hidden");
        // lmeAni.removeAttribute("src");
        $("#lmePlot").addClass("hidden");
        // lmeImg.removeAttribute("src");
        $("div.working").removeClass("hidden");
        $("div.error").addClass("hidden")
        // $("#lmeAnime").removeClass("hidden");
        
        //console.log("entering animation cgi call");
        //console.log("the input LME num is "+lmeNumSelect.value);
        //console.log("the input dataset num is "+datasetSelectAM.value);
        //console.log("the input year is "+yearSelectAM.value);
        //console.log("the input month is "+monthSelectAM.value);
        //console.log("the input day is "+daySelectAM.value);

        
        lmeAni.src = "/cgi-bin/marinehw/HighRes_coastal_animate_test.py"
                    +"?dataset="+datasetSelectAM.value
                    +"&lme_num="+lmeNumSelect.value
                    +"&year="+yearSelectAM.value
                    +"&month="+monthSelectAM.value
                    +"&day="+daySelectAM.value;
    } else {
        $("#lmePlotDownload").addClass("hidden");
        $("div.error").removeClass("hidden")
        $("#lmeAnime").addClass("hidden");
        //console.log("entering animation cgi call");
        //console.log("picked date >= max date");
    };

}

// function updateImageMon() {
//     let lmeNumSelect = document.getElementById("lmeNum");
//     let statSelect = document.getElementById("stat");
//     let yearSelect = document.getElementById("year");
//     let monthSelect = document.getElementById("month");

//     $("#lmePlot").removeClass("hidden");
//     lmeImg.removeAttribute("src");
//     $("div.working").removeClass("hidden");
//     $("div.error").addClass("hidden")
    
//     //console.log("the input LME num is "+lmeNumSelect.value);
//     //console.log("the input stat is "+statSelect.value);
//     //console.log("the input year is "+yearSelect.value);
//     //console.log("the input month is "+monthSelect.value);
//     lmeImg.src = "/cgi-bin/marinehw/HighRes_coastal_static_mon_mod.py"
//                 +"?lme_num="+lmeNumSelect.value
//                 +"&statistic="+statSelect.value
//                 +"&year="+yearSelect.value
//                 +"&month="+monthSelect.value;
// }

// functions for options lists (Manual entering)
function datasetNames() {
    let datasets = ["NOAA STAR (2002/09-present)"
        ,"OISSTv2 (1981/09-present)"
        ,"CMC (2016/01-present)"
   ];
    return datasets;
}

function datasetTSNames() {
    let datasets = ["NOAA STAR (2002/09-present)"
        ,"OISSTv2 (1981/09-present)"
        ,"CMC (1992/01-present)"
   ];
    return datasets;
}

function datasetSyears() {
    let syears = [2002
        ,1981
        ,2016
   ];
    return syears;
}

function datasetTSSyears() {
    let syears = [2002
        ,1981
        ,1992
   ];
    return syears;
}

function datasetSmonths() {
    let smonths = [9
        ,9
        ,1
   ];
    return smonths;
}


function lmeNames() {
    let lmes = ['E. Bering Sea', 'Gulf of Alaska', 'California Current',
    'Gulf of California', 'Gulf of Mexico',
    'S.E. U.S. Continental Shelf',
    'N.E. U.S. Continental Shelf', 'Scotian Shelf',
    'Labrador - Newfoundland', 'Insular Pacific-Hawaiian',
    'Pac. Central-American', 'Caribbean Sea',
    'Humboldt Current', 'Patagonian Shelf', 'S. Brazil Shelf',
    'E. Brazil Shelf', 'N. Brazil Shelf',
    'CA E. Arctic - W. Greenland', 'Greenland Sea',
    'Barents Sea', 'Norwegian Sea', 'North Sea', 'Baltic Sea',
    'Celtic-Biscay Shelf', 'Iberian Coastal', 'Mediterranean Sea',
    'Canary Current', 'Guinea Current', 'Benguela Current',
    'Agulhas Current', 'Somali Coastal Current', 'Arabian Sea',
    'Red Sea', 'Bay of Bengal', 'Gulf of Thailand', 'South China Sea',
    'Sulu-Celebes Sea', 'Indonesian Sea', 'N. Australian Shelf',
    'N.E. Australian Shelf', 'E. Central Australian Shelf',
    'S.E. Australian Shelf', 'S.W. Australian Shelf',
    'W. Central Australian Shelf', 'N.W. Australian Shelf',
    'New Zealand Shelf', 'East China Sea', 'Yellow Sea',
    'Kuroshio Current', 'Sea of Japan', 'Oyashio Current',
    'Sea of Okhotsk', 'W. Bering Sea',
    'N. Bering - Chukchi Seas', 'Beaufort Sea',
    'E. Siberian Sea', 'Laptev Sea', 'Kara Sea',
    'Iceland Shelf and Sea', 'Faroe Plateau', 'Antarctica',
    'Black Sea', 'Hudson Bay Complex', 'Central Arctic',
    'Aleutian Islands', 'CA Arctic - N. Greenland'];
    return lmes;
}



// function lmeNames() {
//     let lmes = ["Baltic Sea"
//         ,"Sea of Okhotsk"
//         ,"North Sea"
//         ,"Gulf of Alaska"
//         ,"Labrador-Newfoundland"
//         ,"Celtic-Biscay Shelf"
//         ,"Sea of Japan"
//         ,"Oyashio Current"
//         ,"Scotian Shelf"
//         ,"California Current"
//         ,"Black Sea"
//         ,"NE U.S. Shelf"
//         ,"Mediterranean Sea"
//         ,"Iberian Coastal"
//         ,"Kuroshio Current"
//         ,"Yellow Sea"
//         ,"Canary Current"
//         ,"East China Sea"
//         ,"SE U.S. Shelf"
//         ,"Gulf of California"
//         ,"Gulf of Mexico"
//         ,"Arabian Sea"
//         ,"Red Sea"
//         ,"Insular Pac.-Hawaiian"
//         ,"Caribbean Sea"
//         ,"South China Sea"
//         ,"Bay of Bengal"
//         ,"Pac.-American Coastal"
//         ,"Sulu-Celebes Sea"
//         ,"Gulf of Thailand"
//         ,"North Brazil Shelf"
//         ,"Guinea Current"
//         ,"Somali Coastal Current"
//         ,"Indonesian Sea"
//         ,"East Brazil Shelf"
//         ,"Humboldt Current"
//         ,"Benguela Current"
//         ,"North Australian Shelf"
//         ,"NE Australian Shelf"
//         ,"Agulhas Current"
//         ,"NW Australian Shelf"
//         ,"EC Australian Shelf"
//         ,"South Brazil Shelf"
//         ,"New Zealand Shelf"
//         ,"Patagonian Shelf"
//         ,"SE Australian Shelf"
//         ,"Antarctica"
//         ,"SW Australian Shelf"
//         ,"WC Australian Shelf"
//         ,"Faroe Plateau"
//         ,"Iceland Shelf & Sea"
//         ,"Greenland Sea"
//         ,"Norwegian Sea"
//         ,"Barents Sea"
//         ,"Kara Sea"
//         ,"Laptev Sea"
//         ,"East Siberian Sea"
//         ,"West Bering Sea"
//         ,"Aleutian Islands"
//         ,"East Bering Sea"
//         ,"Canadian-W. Greenland"
//         ,"Hudson Bay Complex"
//         ,"Beaufort Sea"
//         ,"Canadian-N. Greenland"
//         ,"Central Arctic"
//         ,"N. Bering-Chukchi"];
//     return lmes;
// }