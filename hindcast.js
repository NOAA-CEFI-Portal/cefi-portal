import { treeData, treeDataBasic, populateDropdown } from './data_access.js';
import { useTreeData, useTreeDataBasic } from './forecast_live.js';


// setup local global variable (data structure and filenaming structure)
var region;
var subdomain;
var experiment_type;
var output_frequency;
var grid_type;
var release;
var data_category;
var variable_name;
var variable;
var statValue;
var depthValue;
var blockValue;


// setup local global variable for basic (data structure and filenaming structure)
var region_basic;
var subdomain_basic;
var experiment_type_basic;
var output_frequency_basic;
var grid_type_basic;
var release_basic;
var variable_name_basic;
var variable_basic;

function setDefaultAdvanceOptions() {
    region;
    subdomain;
    experiment_type = 'hindcast';
    output_frequency;
    grid_type = 'regrid';
    release = {
        'northwest_atlantic':'r20230520',
        'northeast_pacific':'r20250509'
    };     // showing options provided in the json file
    data_category;
    variable_name;
    variable;
};

function getCurrentAdvanceOptions() {
    region = document.getElementById('regMOMCobalt').value;
    subdomain = document.getElementById('subregMOMCobalt').value;
    experiment_type = 'hindcast';
    output_frequency = document.getElementById('freqMOMCobalt').value;
    grid_type = 'regrid';
    release = {
        'northwest_atlantic':'r20230520',
        'northeast_pacific':'r20250509'
    };     // showing options provided in the json file
    data_category = document.getElementById('dataCatMOMCobalt').value;
    variable_name = document.getElementById('varMOMCobalt').value;
    console.log(treeData)
    let options = treeData[region][subdomain][experiment_type][output_frequency][grid_type][release[region]][data_category][variable_name];
    variable = Object.keys(options)[0];
    // depth option change
    $("#depthMOMCobalt").empty();
    $("#blockMOMCobalt").empty();
    updateDepthAndBlockOptions(region, output_frequency, variable);
};

function setDefaultBasicOptions() {
    region_basic;
    subdomain_basic = 'full_domain';
    experiment_type_basic = 'hindcast';
    output_frequency_basic;
    grid_type_basic = 'regrid';
    release_basic = {
        'northwest_atlantic':'latest',
        'northeast_pacific':'latest'
    };     // showing options provided in the json file
    variable_name_basic;
    variable_basic;

};

function getCurrentBasicOptions() {
    region_basic = document.getElementById('regMOMCobalt_basic').value;
    subdomain_basic = 'full_domain';
    experiment_type_basic = 'hindcast';
    output_frequency_basic = document.getElementById('freqMOMCobalt_basic').value;
    grid_type_basic = 'regrid';
    release_basic = {
        'northwest_atlantic':'latest',
        'northeast_pacific':'latest'
    };     // showing options provided in the json file
    variable_name_basic = document.getElementById('varMOMCobalt_basic').value;
    let options = treeDataBasic[region_basic][subdomain_basic][experiment_type_basic][output_frequency_basic][grid_type_basic][release_basic[region_basic]][variable_name_basic];
    variable_basic = Object.keys(options)[0];
    // depth option change
    $("#depthMOMCobalt").empty();
    $("#blockMOMCobalt").empty();
    updateDepthAndBlockOptions(region_basic, output_frequency_basic, variable_basic);
};



var indexJson;


$(document).ready(function(){
  setDefaultBasicOptions();
  setDefaultAdvanceOptions();
  // Show/hide tables of basic and advanced forecast_live options
  $("input[type='radio'].radioBasicOptHcast").change(function(){
    if ($("#radioBasicHcast").is(":checked")) {
      $('.trAdvanceInputHcast').addClass('hidden');
      $('.trBasicInputHcast').removeClass('hidden');
      setDefaultBasicOptions();
      getCurrentBasicOptions();
      syncAdvanceFromBasic();
    } else if ($("#radioAdvanceHcast").is(":checked")) {
      $('.trBasicInputHcast').addClass('hidden');
      $('.trAdvanceInputHcast').removeClass('hidden');
      setDefaultAdvanceOptions();
      getCurrentAdvanceOptions();
    }
  });
});



// Createing the data tree dropdowns
// Get dropdown elements
const level1 = document.getElementById('regMOMCobalt');
const level2 = document.getElementById('subregMOMCobalt');
const level4 = document.getElementById('freqMOMCobalt');
const level7 = document.getElementById('dataCatMOMCobalt');
const level8 = document.getElementById('varMOMCobalt');


// Createing the BASIC data tree dropdowns
// Get dropdown elements
const level1Basic = document.getElementById('regMOMCobalt_basic');
const level4Basic = document.getElementById('freqMOMCobalt_basic');
const level8Basic = document.getElementById('varMOMCobalt_basic');

/**
 * Set a dropdown to a specific value, trigger change event, and wait for options to populate.
 * @param {HTMLSelectElement} htmlElementObj - The html dropdown element.
 * @param {string} optionVal - The value to set as selected.
 */
export async function setDropdownValue(htmlElementObj, optionVal, delay = 100) {
    for (let i = 0; i < htmlElementObj.options.length; i++) {
        if (htmlElementObj.options[i].value === optionVal) {
            htmlElementObj.selectedIndex = i;
            // console.log(htmlElementObj.options[i].value, htmlElementObj.selectedIndex)
            htmlElementObj.dispatchEvent(new Event('change'));
            break;
        }
    }
    // Wait for the dropdown to populate its dependent options
    await new Promise(resolve => setTimeout(resolve, delay));
}

// Usage in setDefaultDropdowns:
async function setDefaultDropdowns() {
    if (level1.options.length > 0) {
        await setDropdownValue(level1, 'northwest_atlantic');
        // console.log('Set level1 to northwest_atlantic');
        if (level2.options.length > 0) {
            await setDropdownValue(level2, 'full_domain');
            // console.log('Set level2 to full_domain');
            if (level4.options.length > 0) {
                await setDropdownValue(level4, 'monthly');
                // console.log('Set level4 to monthly');
                if (level7.options.length > 0) {
                    await setDropdownValue(level7, 'ocean_monthly (Monthly ocean variables)');
                    // console.log('Set level7 to ocean_monthly (Monthly ocean variables)');
                    if (level8.options.length > 0) {
                        await setDropdownValue(level8, 'tos (Sea Surface Temperature)');
                        // console.log('Set level8 to tos (Sea Surface Temperature)');
                    } else {
                        console.log('level8 options not ready');
                    }
                } else {
                    console.log('level7 options not ready');
                }
            } else {
                console.log('level4 options not ready');
            }
        } else {
            console.log('level2 options not ready');
        }
    } else {
        console.log('level1 options not ready');
    }
}


// set default values for the basic data query dropdowns
async function setDefaultDropdownsBasic() {
  if (level1Basic.options.length > 0) {
    await setDropdownValue(level1Basic, 'northwest_atlantic');
  }
  if (level4Basic.options.length > 0) {
    await setDropdownValue(level4Basic, 'monthly');
  }
  if (level8Basic.options.length > 0) {
    await setDropdownValue(level8Basic, 'Sea Surface Temperature (tos)');
  }
}

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


// Call the fetch function and initialize dropdowns after data is loaded
try {
    // Call the fetch function and wait for the data to be loaded
    await useTreeDataBasic();
  
    // Populate the first dropdown after data is loaded
    populateDropdown(level1Basic, treeDataBasic);
  } catch (error) {
    console.error('Error fetching treeDataBasic:', error);
}
// console.log('should be after the fetchDataTreeJson function');

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
level2.addEventListener('change', async function () {
    subdomain = level2.value;
    let options = treeData[region][subdomain][experiment_type];
    populateDropdown(level4, options);
    populateDropdown(level7, null);
    populateDropdown(level8, null);

    try {
        // Use await to fetch the index JSON
        indexJson = await fetchIndexOptionHindVis(region, subdomain, experiment_type);
        // Only when the JSON file of an index exists
        if (indexJson) {
            // Create index options (under index dashboard)
            let indexOptionList = indexJson.varname;
            let indexNameOptionList = indexJson.longname;
            let indexFileLocationList = indexJson.file;
            createDropdownOptions('indexMOMCobaltTS', indexNameOptionList, indexFileLocationList);
            plotIndexes();
        }
    } catch (error) {
        console.error('Error fetching index JSON:', error);
    }
});

// output frequency
level4.addEventListener('change', function () {
    output_frequency = level4.value;
    let options = treeData[region][subdomain][experiment_type][output_frequency][grid_type][release[region]];
    populateDropdown(level7, options);
    populateDropdown(level8, null);

    // time slider change
    if (isDefaultSetting === false) {
        if (output_frequency === 'daily'){
            [yearValues, rangeValues] = generateDailyDateList();
            timeSlider.attr("min", 0);
            timeSlider.attr("max", rangeValues.length - 1);
            const foundIndex = rangeValues.indexOf(dateFolium+"-01");
            timeSlider.val(foundIndex);
            dateFolium = rangeValues[timeSlider.val()];
        } else if (output_frequency === 'monthly'){
            [yearValues, rangeValues] = generateDateList();
            timeSlider.attr("min", 0);
            timeSlider.attr("max", rangeValues.length - 1);
            const foundIndex = rangeValues.indexOf(dateFolium.slice(0, -3));
            timeSlider.val(foundIndex);
            dateFolium = rangeValues[timeSlider.val()];
        };

        tValue.text(dateFolium);
    };

    // change depth and block options for the new freq
    // need to fetch the backend data for the depth options
    updateDepthAndBlockOptions(region, output_frequency, variable)

    // change depth2 and block2 options for the new freq
    // need to fetch the backend data for the depth options
    // updateDepthAndBlockOptions(regValue, freqValue, var2Value, 'depthMOMCobaltTS2', 'blockMOMCobaltTS2')
});

// data category
level7.addEventListener('change', function () {
    data_category = level7.value;
    let options = treeData[region][subdomain][experiment_type][output_frequency][grid_type][release[region]][data_category];
    populateDropdown(level8, options);
});

// variable
level8.addEventListener('change', function () {
    variable_name = level8.value;
    let options = treeData[region][subdomain][experiment_type][output_frequency][grid_type][release[region]][data_category][variable_name];
    variable = Object.keys(options)[0];

    // depth option change
    $("#depthMOMCobalt").empty();
    $("#blockMOMCobalt").empty();
    updateDepthAndBlockOptions(region, output_frequency, variable);
});


// Event listeners for dynamic updates on BASIC data query
// region
level1Basic.addEventListener('change', async function () {
    region_basic = level1Basic.value;
    let options = null;
    options = treeDataBasic[region_basic][subdomain_basic][experiment_type_basic];
    populateDropdown(level4Basic, options);
    populateDropdown(level8Basic, null);

    try {
        // Use await to fetch the index JSON
        indexJson = await fetchIndexOptionHindVis(region_basic, subdomain_basic, experiment_type_basic);
        // Only when the JSON file of an index exists
        if (indexJson) {
            // Create index options (under index dashboard)
            let indexOptionList = indexJson.varname;
            let indexNameOptionList = indexJson.longname;
            let indexFileLocationList = indexJson.file;
            createDropdownOptions('indexMOMCobaltTS', indexNameOptionList, indexFileLocationList);
            plotIndexes();
        }
    } catch (error) {
        console.error('Error fetching index JSON:', error);
    };

});

// outFreq
level4Basic.addEventListener('change', function () {
    output_frequency_basic = level4Basic.value;
    let options = null;
    options = treeDataBasic[region_basic][subdomain_basic][experiment_type_basic][output_frequency_basic][grid_type_basic][release_basic[region_basic]];
    populateDropdown(level8Basic, options);

    // time slider change
    if (isDefaultSetting === false) {
        if (output_frequency_basic === 'daily'){
            [yearValues, rangeValues] = generateDailyDateList();
            timeSlider.attr("min", 0);
            timeSlider.attr("max", rangeValues.length - 1);
            const foundIndex = rangeValues.indexOf(dateFolium+"-01");
            timeSlider.val(foundIndex);
            dateFolium = rangeValues[timeSlider.val()];
        } else if (output_frequency_basic === 'monthly'){
            [yearValues, rangeValues] = generateDateList();
            timeSlider.attr("min", 0);
            timeSlider.attr("max", rangeValues.length - 1);
            const foundIndex = rangeValues.indexOf(dateFolium.slice(0, -3));
            timeSlider.val(foundIndex);
            dateFolium = rangeValues[timeSlider.val()];
        };

        tValue.text(dateFolium);
    };

    // change depth and block options for the new freq
    // need to fetch the backend data for the depth options
    $("#depthMOMCobaltFcastLive").empty();
    $("#blockMOMCobaltFcastLive").empty();
    updateDepthAndBlockOptions(region_basic, output_frequency_basic, variable_basic)
});

// variable
level8Basic.addEventListener('change', function () {
  variable_name_basic = level8Basic.value;
  let options = null;
  options =
      treeDataBasic[region_basic][subdomain_basic][experiment_type_basic][output_frequency_basic][grid_type_basic][release_basic[region_basic]][variable_name_basic];
  // console.log('options:', options);
  // console.log('parent level:', treeDataBasic[selectedValue1]);
  

  variable_basic = Object.keys(options)[0];
//   console.log('Selected basic variable:', variable_basic);

  // depth option change
  $("#depthMOMCobalt").empty();
  $("#blockMOMCobalt").empty();
  updateDepthAndBlockOptions(region_basic, output_frequency_basic, variable_basic);

});

function syncAdvanceFromBasic() {
    region = region_basic;
    subdomain = subdomain_basic;
    experiment_type = experiment_type_basic;
    output_frequency = output_frequency_basic;
    grid_type = grid_type_basic;
    release = release_basic;
    variable_name = variable_name_basic;
    variable = variable_basic;
};

// Make sure the basic variables value are syncs to the advance variables when in basic mode
// Live sync: only update advanced values if in basic mode 
// This is because all the plotting functions are using the advanced values!!!
$('#regMOMCobalt_basic, #freqMOMCobalt_basic, #varMOMCobalt_basic').on('change', function () {
    if ($('input[name="basicOptionsHcast"]:checked').val() === 'basic') {
        syncAdvanceFromBasic();
        // console.log("basic value transfer to advance value")
    }
});


// make sure the treeData is fetched (top level await)
// Call the fetch function and initialize dropdowns after data is loaded
let isDefaultSetting = false;
try {
    // Set default dropdown values
    isDefaultSetting = true;
    await setDefaultDropdowns();
    isDefaultSetting = false;

  } catch (error) {
    console.error('Error setting default options :', error);
}


// Call the fetch function and initialize dropdowns after data is loaded
try {
    // Set default dropdown values
    isDefaultSetting = true;
    await setDefaultDropdownsBasic();
    isDefaultSetting = false;

  } catch (error) {
    console.error('Error setting default Basic options :', error);
}

// global constant for object ID
const momCobaltMap = $('#momCobaltIFrame');
const momCobaltBtn = $("#momCobaltBtn");
// const clearFigOptBtn = $("#clearFigOptBtn")
const timeSlider = $("#timeRange");
const tValue = $(".timeValue");
const containerTick = $(".ticks");

// global info for leaflet maps
var mapData = {}   // parsed html output
var locationData;
var polygonData;
var dateFolium;


// global info for time slider
var yearValues = [];
var rangeValues = [];

var var2Value;


// Initial region options (for all region options)
initialize()
// Initial variable options (all dropdown options)



/////////////// event listener ///////////

// // add the initial time options 
// createMomCobaltIniOpt(dataCobaltID);

$(window).resize(function() {
    tickSpaceChange();
});



// // event listen for freq change => slider, depth & bottom options
// $("#freqMOMCobalt").on("change", function(){
    
//     // time slider change
//     if (output_frequency === 'daily'){
//         [yearValues, rangeValues] = generateDailyDateList();
//         timeSlider.attr("min", 0);
//         timeSlider.attr("max", rangeValues.length - 1);
//         const foundIndex = rangeValues.indexOf(dateFolium+"-01");
//         timeSlider.val(foundIndex);
//         dateFolium = rangeValues[timeSlider.val()];
//     } else if (region, output_frequency, variable === 'monthly'){
//         [yearValues, rangeValues] = generateDateList();
//         timeSlider.attr("min", 0);
//         timeSlider.attr("max", rangeValues.length - 1);
//         const foundIndex = rangeValues.indexOf(dateFolium.slice(0, -3));
//         timeSlider.val(foundIndex);
//         dateFolium = rangeValues[timeSlider.val()];
//     };

//     tValue.text(dateFolium);

//     // change depth and block options for the new freq
//     // need to fetch the backend data for the depth options
//     updateDepthAndBlockOptions(region, output_frequency, variable)

//     // change depth2 and block2 options for the new freq
//     // need to fetch the backend data for the depth options
//     // updateDepthAndBlockOptions(regValue, freqValue, var2Value, 'depthMOMCobaltTS2', 'blockMOMCobaltTS2')
// });



// // event listen for variable2 change => depth2 & bottom2 options
// $("#varMOMCobaltTS2").on("change", function(){

//     // varValue update
//     var2Value = $('#varMOMCobaltTS2').val();

//     // change depth2 and block2 options for the new freq
//     // need to fetch the backend data for the depth options
//     updateDepthAndBlockOptions(region, output_frequency, variable, 'depthMOMCobaltTS2', 'blockMOMCobaltTS2')

//     // plot ts2 
//     plotTSs(locationData);
// });

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

// event listener for slider change => figure & date
timeSlider.on("mouseup", function() {
    $("div.mapHindcast > div.workingTop").removeClass("hidden");
    $("div.mapHindcast > div.errorTop").addClass("hidden");
    $("div.mapHindcast > div.whiteTop").addClass("hidden");
    dateFolium = rangeValues[$(this).val()];
    replaceFolium()
});

// event listener for slider change => Update the current slider value
timeSlider.on("input", function() {
    dateFolium = rangeValues[$(this).val()];
    tValue.text(dateFolium);
});


// event listener for clicking create map button
momCobaltBtn.on("click", function () {
    $("div.mapHindcast > div.workingTop").removeClass("hidden");
    $("div.mapHindcast > div.errorTop").addClass("hidden");
    $("div.mapHindcast > div.whiteTop").addClass("hidden");
    replaceFolium()
    $("#tsView > div.workingTop").removeClass("hidden");
    $("#tsView > div.errorTop").addClass("hidden");
    $("#tsView > div.whiteTop").addClass("hidden");
    hideLoadingSpinner("loading-spinner-ts");
    // $('#varMOMCobaltTS2').val('');
    // $("#depthMOMCobaltTS2").val('');
});

// // event listener for clicking clear figure options
// clearFigOptBtn.on("click", function () {
//     $("input.figOpt").val('');
// });


// // add event listener on reset time series select in plotly
// $("#clearTSselectBtn").on("click", function () {
//     if (locationData !== undefined && locationData !== null) {
//         if (varFoliumMap !== undefined && varFoliumMap !== null) {
//             if ($('#varMOMCobaltTS2').val() !== undefined && $('#varMOMCobaltTS2').val() !== null) {
//                 plotTSs(locationData)
//             } else {
//                 plotTS1(locationData);
//             }
//         }
//     }
// });

// // add event listener on reset time series select in plotly
// $("#clearTS2Btn").on("click", function () {
//     $('#varMOMCobaltTS2').val('');
//     $('#depthMOMCobaltTS2').val('');
//     if (locationData !== undefined && locationData !== null) {
//         if (varFoliumMap !== undefined && varFoliumMap !== null) {
//             plotTS1(locationData);
//         }
//     }
// });


// event listener for the "message" event (location click) => send to leaflet js
$(window).on("message", receiveMessage);


// // add event listener on adding 2nd time series in plotly
// $('#varMOMCobaltTS2').on("change", function () {

//     // depth option change
//     $("#depthMOMCobaltTS2").empty();
//     createMomCobaltDepthOpt($("#varMOMCobaltTS2").val(),"depthMOMCobaltTS2");

//     // var2Value
//     varind2 = varnamelist2[1].indexOf($("#varMOMCobaltTS2").val())
//     var2Value = varnamelist2[0][varind2]

//     if (locationData !== undefined && locationData !== null) {
//         if (varFoliumMap !== undefined && varFoliumMap !== null) {
//             if ($('#varMOMCobaltTS2').val() !== undefined && $('#varMOMCobaltTS2').val() !== null) {
//                 plotTSs(locationData)
//             } else {
//                 plotTS1(locationData);
//             }
//         }
//     }
// });

// // add event listener on selecting depth for 3d 2nd variable
// $('#depthMOMCobaltTS2').on("change", function () {
//     if (locationData !== undefined && locationData !== null) {
//         if (varFoliumMap !== undefined && varFoliumMap !== null) {
//             if ($('#varMOMCobaltTS2').val() !== undefined && $('#varMOMCobaltTS2').val() !== null) {
//                 plotTSs(locationData)
//             } else {
//                 plotTS1(locationData);
//             }
//         }
//     }
// });

// add event listener on selecting depth for 3d 2nd variable
$('#indexMOMCobaltTS').on("change", function () {
    plotIndexes()
});

// time step function
$(document).ready(function() {
    // Add click event listeners using jQuery
    $('#time-prev').on('click', function() {
        changeTimeStep(-1);
    });

    $('#time-next').on('click', function() {
        changeTimeStep(1);
    });
});

///////// functional function start /////////
// function for advancing/recede to the next option in the list
//   used directly in html page button with attribute onclick
function changeTimeStep(timeStep) {
    var nextTime = parseInt(timeSlider.val())+timeStep;
    timeSlider.val(nextTime);
    $("div.mapHindcast > div.workingTop").removeClass("hidden");
    $("div.mapHindcast > div.errorTop").addClass("hidden");
    $("div.mapHindcast > div.whiteTop").addClass("hidden");
    dateFolium = rangeValues[timeSlider.val()];
    tValue.text(dateFolium);
    replaceFolium();
}

// functions for timeline tick 
function generateTick(tickList) {
    $("div.ticks span").remove();
    // console.log(tickList.length)
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

/**
 * Truncate a string to a specified length and add ellipsis if it exceeds that length.
 * @param {string} str - The string to truncate.
 * @param {number} maxLength - The maximum length of the truncated string.
 * @returns {string} - The truncated string with ellipsis if it exceeds the maximum length.
 */
export function truncateString(str, maxLength) {
    if (str.length > maxLength) {
        return str.substring(0, maxLength - 3) + '...';
    } else {
        return str;
    }
}

function updateDepthAndBlockOptions(regValue, freqValue, varValue, depthID='depthMOMCobalt', blockID='blockMOMCobalt') {
    // Change depth and block options for the new freq
    // Need to fetch the backend data for the depth options
    fetchVariableDepthBotOptions(
        regValue, 'full_domain', 'hindcast', freqValue, 'regrid', varValue
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
            // console.log(jsonData.bottom);
            // Create the single layer options
            createDropdownOptions(blockID, ['not applicable'], ['not_applicable']);
        } else {
            // Create the depth options
            let bottomlist = jsonData.bottom;
            createDropdownOptions(blockID, bottomlist, bottomlist);
            const bottomElement = document.getElementById(blockID);
            const lastValue = String(bottomlist[bottomlist.length - 1]);
            // Set the last option as default when the list is not empty
            setDropdownValue(bottomElement, lastValue); // set the first option as default
        }

        depthValue = $('#'+depthID).val(); // initial depth value
        blockValue = $('#'+blockID).val(); // initial block value

    }).catch(error => {
        console.error('Error in fetching depth options:', error);
    });

}

// initialize the region freq variable optios
async function initialize() {

    // Default time slider related variables
    [yearValues, rangeValues] = generateDateList(); // initial monthly time slider
    timeSlider.attr("min", 0);
    timeSlider.attr("max", rangeValues.length - 1);
    timeSlider.val(rangeValues.length - 1);
    dateFolium = rangeValues[timeSlider.val()];
    tValue.text(dateFolium);
    // change slider size based on window size at initial loading
    tickSpaceChange();

    // Initial stat options
    createGeneralOption('statMOMCobalt',momCobaltStats)
    statValue = $('#statMOMCobalt').val(); // initial stats value

    // Initial depth options based on variable
    // fetch the backend data for the depth, block options
    updateDepthAndBlockOptions(region, output_frequency, variable)

    // create colorbar options
    createMomCobaltCbarOpt('cbarOpts','RdBu_r')

    // // var2Value update
    // var2Value = $('#varMOMCobaltTS2').val();

    // // change depth2 and block2 options for the new freq
    // // need to fetch the backend data for the depth options
    // updateDepthAndBlockOptions(regValue, freqValue, var2Value, 'depthMOMCobaltTS2', 'blockMOMCobaltTS2')

    // create initial plotly object place holder
    asyncInitializePlotlyResize('all')

    // create index plotly
    initializePlotly('indexes');

}

// function to get the option list in the json files
export async function createGeneralOption(selectID, optionListFunc) {
    // fetch list
    let [optionList,valueList] = optionListFunc();
    // create dropdown options
    createDropdownOptions(selectID,optionList,valueList);
}

// function for create option 
export function optionList(listname,listval) {
    let df = document.createDocumentFragment(); // create a document fragment to hold the options created later
    for (let i = 0; i < listname.length; i++) { // loop
        let option = document.createElement('option'); // create the option element
        option.value = listval[i]; // set the value property
        // truncate the string if it is too long
        let truncName = truncateString(listname[i], 40)
        option.appendChild(document.createTextNode(truncName)); // set the textContent in a safe way.
        df.appendChild(option); // append the option to the document fragment
    }
    return df;
};


// function for create option
export function createDropdownOptions(selectID,showList,valueList) {
    let elm = document.getElementById(selectID); 

    // Remove all existing options
    while (elm.firstChild) {
        elm.removeChild(elm.firstChild);
    }

    let df = optionList(showList,valueList);
    elm.appendChild(df);
};

// // asyn function to get the option list in the json files
// export async function createFreqVarIndexOption(regname) {
//     // fetch hindcast json specific to region
//     var region;
//     var subdomain;
//     var expType = 'hindcast';
//     if (regname === 'northwest_atlantic'){
//         region = 'northwest_atlantic';
//         subdomain = 'full_domain';
//     } else if (regname === 'northeast_pacific'){
//         region = 'northeast_pacific';
//         subdomain = 'full_domain';
//     };
//     // get frequeuncy json
//     let dataAccessJson = await fetchDataOptionVis(region,subdomain,expType);
//     // get variable json
//     let variableJson = await fetchVarOptionVis(region,subdomain,expType);
//     // get index json
//     let indexJson = await fetchIndexOptionHindVis(region,subdomain,expType);

//     // create frequency options
//     let freqList = dataAccessJson.output_frequency;
//     createDropdownOptions('freqMOMCobalt',freqList,freqList);

//     // create variable options
//     let varOptionList = variableJson.var_options;
//     let varValueList = variableJson.var_values;
//     let combinedList = varOptionList.map((option, index) => `${option} - (${varValueList[index]})`);
//     createDropdownOptions('varMOMCobalt',combinedList,varValueList);
    
//     // only when the json file of a index exist
//     if (indexJson) {
//         // create index options (under index dashboard)
//         let indexOptionList = indexJson.varname;
//         let indexNameOptionList = indexJson.longname;
//         let indexFileLocationList = indexJson.file;
//         createDropdownOptions('indexMOMCobaltTS',indexNameOptionList,indexFileLocationList);
//         plotIndexes();
//     }
    
//     // // create 2nd variable options
//     // let var2OptionList = variableJson.var_options;
//     // let var2ValueList = variableJson.var_values;
//     // createDropdownOptions('varMOMCobaltTS2',var2OptionList,var2ValueList);

// }

// // async fetching the data_access_json cefi_data_option
// export async function fetchDataOptionVis(reg,subDom,expType) {
//     try {
//       const response = await fetch(
//         'data_option_json/cefi_data_options.Projects.CEFI.regional_mom6.cefi_portal.'+
//         reg+
//         '.'+
//         subDom+
//         '.'+
//         expType+
//         '.json'
//       );
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       const data = await response.json();  // JSON data 
//       // console.log('JSON data:', data);
//       return data;
//     } catch (error) {
//       console.error('There was a problem when async fetchDataOption:', error);
//     }
// }

// // async fetching the data_access_json cefi_var_option
// export async function fetchVarOptionVis(reg,subDom,expType) {
//     try {
//       const response = await fetch(
//         'data_option_json/cefi_var_options.Projects.CEFI.regional_mom6.cefi_portal.'+
//         reg+
//         '.'+
//         subDom+
//         '.'+
//         expType+
//         '.json'
//       );
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       const data = await response.json();  // JSON data 
//       // console.log('JSON data:', data);
//       return data;
//     } catch (error) {
//       console.error('There was a problem when async fetchVarOption:', error);
//     }
// }

// async fetching the Index related json in cefi_data_option (currently only for hindcast)
async function fetchIndexOptionHindVis(reg,subDom,expType) {
    try {
      const response = await fetch(
        'data_option_json/cefi_index_options.Projects.CEFI.regional_mom6.cefi_derivative.'+
        reg+
        '.'+
        subDom+
        '.'+
        expType+
        '.json'
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();  // JSON data 
      // console.log('JSON data:', data);
      return data;
    } catch (error) {
      $('#indexMOMCobaltTS').empty();
      initializePlotly('indexes');
      console.error('There was a problem when async fetchIndexOption:', error);
    }
}

// async functions for fetching variable and experiment specific option from backend
export async function fetchVariableDepthBotOptions(reg,subDom,expType,outFreq,gridType,variable) {
    var ajaxGet = "/cgi-bin/cefi_portal/vistab_create_variable_depth_bot_options.py"
    +"?region="+reg
    +"&subdomain="+subDom
    +"&experiment_type="+expType
    +"&output_frequency="+outFreq
    +"&grid_type="+gridType
    +"&variable="+variable;
  
    console.log('https://webtest.psd.esrl.noaa.gov/'+ajaxGet)
  
    return fetch(ajaxGet)
        .then(response => {
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .catch(error => {
            // Handle errors here
            console.error('Fetch json failed when creating variable depth bottom options:', error);
        });
  }

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

// function for create option for colorbar
export function createMomCobaltCbarOpt(cbarOptID='cbarOpts',defaultCbar='RdBu_r') {
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

// function for option change due to nav pill change at the bottom
function changeDashSelect(dashDropDownID,optionVal) {
    // change pick option
    $('#' + dashDropDownID).val(optionVal).change();
}

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

// intialize the plotly plot
// Initial dashboard plot
export function asyncInitializePlotlyResize(flag) {
    // make sure the plotly object is created then resize
    return initializePlotly(flag)
        .then(() => {
            window.dispatchEvent(new Event('resize'));
        })
        .catch(error => {
            console.error('Error in async plotly initialization:', error);
        });
}

export function initializePlotly(flag) {
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
        autosize: true,
        width: 500,
        height: 400,
        xaxis: { title: 'Date' },
        yaxis: { title: 'Variable' },
        hovermode: 'closest',
        showlegend: false,
        // responsive: true
    };

    var layoutBox = {
        title: 
        'Box plot',
        autosize: true,
        // width: 1000,
        // height: 400,
        hovermode: 'closest',
        showlegend: false,
        // responsive: true
    };

    var layoutHist = {
        title: 
        'Histogram',
        autosize: true,
        // width: 1000,
        // height: 400,
        hovermode: 'closest',
        showlegend: false,
        // responsive: true
    };

    var layoutProf = {
        title: 
        'Profile',
        autosize: true,
        // width: 1000,
        // height: 400,
        hovermode: 'closest',
        showlegend: false,
        // responsive: true
    };

    var layoutIndex = {
        title: 
        'Index not available',
        autosize: true,
        width: 1000,
        height: 400,
        hovermode: 'closest',
        showlegend: false,
        // responsive: true
    };

    var layout2 = {
        title: 
        'Draw polyline on map',
        autosize: true,
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
        autosize: true,
        width: 500,
        height: 400,
        xaxis: { title: 'Date' },
        yaxis: { title: 'Variable' },
        hovermode: 'closest',
        showlegend: false,
        responsive: true
    };

    var config = {responsive: true}

    if (flag ==='all'){
        Plotly.newPlot('plotly-time-series', [trace], layoutTS,config);
        // Plotly.newPlot('plotly-box-plot', [trace], layoutBox,config);
        // Plotly.newPlot('plotly-histogram', [trace], layoutHist,config);
        Plotly.newPlot('plotly-vertical-prof', [trace], layoutProf,config);
        // Plotly.newPlot('plotly-vertical-s', [trace], layoutProf,config);
        // Plotly.newPlot('plotly-transect', [trace], layout2,config);
        Plotly.newPlot('plotly-index', [trace], layoutIndex,config);
    } else if (flag ==='vertical') {
        Plotly.newPlot('plotly-vertical-prof', [trace], layoutProf,config);
        // Plotly.newPlot('plotly-vertical-s', [trace], layoutProf,config);
    } else if (flag ==='indexes') {
        Plotly.newPlot('plotly-index', [trace], layoutIndex,config);
    } else if (flag ==='tseries') {
        Plotly.newPlot('plotly-time-series', [trace], layoutTS,config);
    } else if (flag ==='transect') {
        // Plotly.newPlot('plotly-transect', [trace], layout2,config);
    } else if (flag ==='forecast') {
        Plotly.newPlot('plotly-fcast-spread', [trace], layoutFcst, config);
        Plotly.newPlot('plotly-fcast-box', [trace], layoutFcst, config);
    } else if (flag ==='mhwForecast') {
        Plotly.newPlot('plotly-fcastmhw-prob', [trace], layoutTS,config);
        Plotly.newPlot('plotly-fcastmhw-mag', [trace], layoutTS,config);
    } else if (flag ==='forecastLive') {
        Plotly.newPlot('plotly-fcast-live-spread', [trace], layoutFcst, config);
        Plotly.newPlot('plotly-fcast-live-box', [trace], layoutFcst, config);
    };

    return new Promise(resolve => {
        // console.log('Initial Plotly created');
        resolve();
    });
};




// // function for create option with subgroup
// function optionSubgroupList(listname,listval,listsubgroup) {
//     let df = document.createDocumentFragment(); // create a document fragment to hold the options created later
    
//     // object subgroup
//     const monthlyGroup = document.createElement('optgroup');
//     monthlyGroup.label = 'Monthly variables';
//     const dailyGroup = document.createElement('optgroup');
//     dailyGroup.label = 'Daily variables';
//     const monthlyIndexGroup = document.createElement('optgroup');
//     monthlyIndexGroup.label = 'Monthly indexes';
//     const annualIndexGroup = document.createElement('optgroup');
//     annualIndexGroup.label = 'Annual indexes';
//     var mvflag = false
//     var dvflag = false
//     var miflag = false
//     var aiflag = false

//     for (let i = 0; i < listname.length; i++) {
//         let option = document.createElement('option'); // create the option element
//         option.value = listval[i]; // set the value property
//         option.appendChild(document.createTextNode(listname[i])); // set the textContent in a safe way.
//         if (listsubgroup[i].indexOf("monthly")!==-1){
//             monthlyGroup.appendChild(option);
//             mvflag = true
//         } else if (listsubgroup[i].indexOf("daily")!==-1){
//             dailyGroup.appendChild(option);
//             dvflag = true
//         } else if (listsubgroup[i].indexOf("mon_index")!==-1){
//             monthlyIndexGroup.appendChild(option);
//             miflag = true
//         } else if (listsubgroup[i].indexOf("ann_index")!==-1){
//             annualIndexGroup.appendChild(option);
//             aiflag = true
//         }
//     }
     
//     // append the subgroup in the desired order
//     if (aiflag) {
//         df.appendChild(annualIndexGroup);
//     }
//     if (mvflag) {
//         df.appendChild(monthlyGroup);
//     }  
//     // df.appendChild(monthlyGroup); // append the option to the document fragment
//     if (miflag) {
//         df.appendChild(monthlyIndexGroup);
//     }
//     // df.appendChild(dailyGroup);
//     if (dvflag) {
//         df.appendChild(dailyGroup);
//     }
//     return df;
// };

// // function for create option for general options (single ID)
// function createMomCobaltOpt_singleID(selectID,optionListFunc) {
//     let elm = document.getElementById(selectID);
//     let optlist = optionListFunc();
//     df = optionList(optlist[0],optlist[1]);
//     elm.appendChild(df);
// };

// // function for create option for general options
// function createMomCobaltOpt(selectClass,optionListFunc) {
//     let elms = document.getElementsByClassName(selectClass);
//     let optlist = optionListFunc();
//     df = optionList(optlist[0],optlist[1]);
//     // loop through all region dropdown with the selectClassName
//     for(let i = 0; i < elms.length; i++) {
//         let clonedf = df.cloneNode(true); // Clone the child element
//         elms[i].appendChild(clonedf); // Append the cloned child to the current element
//     }
// };


// // function for create option for variables (optimized for different purposes)
// function createMomCobaltVarOpt(dataCobaltID,selectID) {
//     let elm = document.getElementById(selectID); 
//     let varlist = momCobaltVars();
//     if (dataCobaltID == "MOMCobalt") {
//         // for hindcast run var
//         varlist = momCobaltVars();
//     } else if (dataCobaltID == "MOMCobalt+Index") {
//         // for second time series comp
//         varlist = momCobaltVars();
//         indexlist = indexes();
//         varlist[0] = varlist[0].concat(indexlist[0]);
//         varlist[1] = varlist[1].concat(indexlist[1]);
//         varlist[2] = varlist[2].concat(indexlist[2]);
//     } else if (dataCobaltID == "onlyIndexes") {
//         // for index
//         indexlist = indexes("onlyIndex");
//         varlist[0] = indexlist[0];
//         varlist[1] = indexlist[1];
//         varlist[2] = indexlist[2];
//     };
//     // df = optionList(varlist[0],varlist[1]);
//     df = optionSubgroupList(varlist[0],varlist[1],varlist[2]);
//     elm.appendChild(df); // append the document fragment to the DOM. this is the better way rather than setting innerHTML a bunch of times (or even once with a long string)
// };




// Display loading spinner
export function showLoadingSpinner(divID) {
    // console.log('spin')
    $("#"+divID).css("display", "block");
}

// Hide loading spinner
export function hideLoadingSpinner(divID) {
    // console.log('stop spin')
    $("#"+divID).css("display", "none");
}

// function for replace folium overlap info (image and colorbar)
//  reason of seperate from the other global variable
//  this make sure the variable that is plotted on the map sync
//  with the "Plotly time series"
let varFoliumMap;
let regFoliumMap;
let freqFoliumMap;
let statFoliumMap;
let depthFoliumMap;
function replaceFolium() {
    showLoadingSpinner("loading-spinner-map");
    varFoliumMap = variable;
    // regFoliumMap = $("#regMOMCobalt").val();
    // freqFoliumMap = $("#freqMOMCobalt").val();
    // statFoliumMap = $("#statMOMCobalt").val();
    // depthFoliumMap = $("#depthMOMCobalt").val();
    regFoliumMap = region;
    freqFoliumMap = output_frequency;
    statFoliumMap = $("#statMOMCobalt").val();
    depthFoliumMap = $("#depthMOMCobalt").val();
    let block = $("#blockMOMCobalt").val();


    // variables only used on the Folium map
    //  initiated every time when the create map is triggered 
    let cbar = $("#cbarOpts").val();
    let maxval = $("#maxval").val();
    let minval = $("#minval").val();
    let nlevel = $("#nlevel").val();

    var ajaxGet = "/cgi-bin/cefi_portal/vistab_mom_folium.py"
        +"?variable="+varFoliumMap
        +"&region="+regFoliumMap
        +"&output_frequency="+freqFoliumMap
        +"&subdomain=full_domain"
        +"&experiment_type=hindcast"
        +"&grid_type=regrid"
        +"&date="+dateFolium
        +"&stat="+statFoliumMap
        +"&depth="+depthFoliumMap
        +"&block="+block
        +"&cbar="+cbar
        +"&maxval="+maxval
        +"&minval="+minval
        +"&nlevel="+nlevel
    console.log('https://webtest.psd.esrl.noaa.gov/'+ajaxGet)

    fetch(ajaxGet) // Replace with the URL you want to request
        .then(response => {
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(jsonData => {
            // Process the response data here
            // console.log(jsonData);
            mapData = {
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

            // console.log(mapData)
            momCobaltMap[0].contentWindow.postMessage(mapData, "*")

            // get same point time series when points and variable are defined/clicked
            if (locationData !== undefined && locationData !== null) {
                console.log(locationData)
                if (varFoliumMap !== undefined && varFoliumMap !== null) {
                    plotTS1(locationData);
                    plotVertProfs(locationData);
                    // if ($('#varMOMCobaltTS2').val() !== undefined && $('#varMOMCobaltTS2').val() !== null) {
                    //     plotTSs(locationData);
                    // } else {
                    //     plotTS1(locationData);
                    // }
                }
                // //// current function only allowed in monthly data
                // if (dateFolium.length === 7){
                //     plotVertProfs(locationData);
                // } else {
                //     // initialize plotly
                //     initializePlotly('vertical');
                // }
            }
            // get same polyline transect when polyline and variable are defined
            if (polygonData !== undefined && polygonData !== null) {
                if (varFoliumMap !== undefined && varFoliumMap !== null) {
                    plotTransect(polygonData);
                    //// current function only allowed in monthly data
                    // if (dateFolium.length === 7){
                        // plotTransect(polygonData);
                    // } else {
                    //     // initialize plotly
                    //     initializePlotly('transect');
                    // }
                }
            }

            $("div.mapHindcast > div.workingTop").addClass("hidden");
            $("div.mapHindcast > div.errorTop").addClass("hidden");
            $("div.mapHindcast > div.whiteTop").removeClass("hidden");
            hideLoadingSpinner("loading-spinner-map");
        })
        .catch(error => {
            // Handle errors here
            $("div.mapHindcast > div.workingTop").addClass("hidden");
            $("div.mapHindcast > div.errorTop").removeClass("hidden");
            $("div.mapHindcast > div.whiteTop").addClass("hidden");
            hideLoadingSpinner("loading-spinner-map");
            $("#tsView > div.workingTop").addClass("hidden");
            $("#tsView > div.errorTop").removeClass("hidden");
            $("#tsView > div.whiteTop").addClass("hidden");
            hideLoadingSpinner("loading-spinner-ts");
            console.error('Fetch folium map error:', error);

        });

    // momCobaltMap.attr("src", ajaxGet)
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
        if (var2TS) {
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
        // } else {
        //     getIndex('#varMOMCobaltTS2')
        //     .then(parsedTS => {
        //         // console.log(parsedTS);
        //         resolve(parsedTS);
        //     })
        //     .catch(error => {
        //         // Handle errors here
        //         console.error('Error in create PromiseTS2 for indexes:', error);
        //         reject(error); 
        //     });
        }
       
    });

    Promise.all([promiseTS1,promiseTS2])
        .then(([firstTS,secondTS]) => {
            console.log(firstTS.tsValues)
            plotlyTS(firstTS.tsDates,firstTS.tsValues,firstTS.lonValues,firstTS.latValues,firstTS.tsUnit,firstTS.yformat)
            plotlyBox(firstTS.tsValues,firstTS.yformat)
            plotlyHist(firstTS.tsValues,firstTS.tsUnit,firstTS.yformat)
            return new Promise((resolve) => {
                resolve([firstTS,secondTS])
            });
        })
        .then(([firstTS,secondTS])=>{
            if (var2TS) {
                // plotting the variable time series
                plotlyTSadd(secondTS.tsDates,secondTS.tsValues,secondTS.lonValues,secondTS.latValues,secondTS.tsUnit,secondTS.yformat)
                plotlyBoxadd(secondTS.tsValues,secondTS.yformat)
                plotlyHistadd(secondTS.tsValues,secondTS.tsUnit,secondTS.yformat) 
            // } else {
            //     // plotting the first index (make it always the first one as observed value)
            //     plotlyTSadd(secondTS.tsDates[0],secondTS.tsValues[0],firstTS.lonValues,firstTS.latValues,secondTS.tsUnit[0],secondTS.yformat[0])
            //     plotlyBoxadd(secondTS.tsValues[0],secondTS.yformat[0])
            //     plotlyHistadd(secondTS.tsValues[0],secondTS.tsUnit[0],secondTS.yformat[0]) 
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
    $("#tsView > div.workingTop").removeClass("hidden");
    $("#tsView > div.errorTop").addClass("hidden");
    $("#tsView > div.whiteTop").addClass("hidden");
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
            $("#tsView > div.workingTop").addClass("hidden");
            $("#tsView > div.errorTop").addClass("hidden");
            $("#tsView > div.whiteTop").removeClass("hidden");
            hideLoadingSpinner("loading-spinner-ts");
        })
        .catch((error)=>{
            // Handle errors here
            $("#tsView > div.workingTop").addClass("hidden");
            $("#tsView > div.errorTop").removeClass("hidden");
            $("#tsView > div.whiteTop").addClass("hidden");
            hideLoadingSpinner("loading-spinner-ts");
            console.error(error);
        })
};

// function for plotting first TS with Promise for data fetch complete
function plotVertProfs(infoLonLat) {
    showLoadingSpinner("loading-spinner-vprof");
    $("#profileView > div.workingTop").removeClass("hidden");
    $("#profileView > div.errorTop").addClass("hidden");
    $("#profileView > div.whiteTop").addClass("hidden");
    const promiseVP = new Promise((resolve, reject) => {
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

    promiseVP
        .then((parsedVP)=>{
            plotlyVP(parsedVP.depth,parsedVP.data,parsedVP.lon,parsedVP.lat,parsedVP.unit,parsedVP.xformat,"plotly-vertical-prof",parsedVP.varname,"rgba(113, 29, 176, 0.7)")
            // plotlyVP(parsedVP.sDepth,parsedVP.sValues,parsedVP.slonValues,parsedVP.slatValues,parsedVP.sUnit,parsedVP.sformat,"plotly-vertical-s","Salinity","rgb(239, 64, 64)")
            $("#profileView > div.workingTop").addClass("hidden");
            $("#profileView > div.errorTop").addClass("hidden");
            $("#profileView > div.whiteTop").removeClass("hidden");
            hideLoadingSpinner("loading-spinner-vprof");
        })
        .catch((error)=>{
            $("#profileView > div.workingTop").addClass("hidden");
            $("#profileView > div.errorTop").removeClass("hidden");
            $("#profileView > div.whiteTop").addClass("hidden");
            hideLoadingSpinner("loading-spinner-vprof");
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
            plotlyTransectLine("plotly-transect",parsedTran)
            // if (varValue.includes('(3D)')) {
            //     plotlyContour("plotly-transect",parsedTran)
            // } else {
            //     plotlyTransectLine("plotly-transect",parsedTran)
            // }
            hideLoadingSpinner("loading-spinner-tsect");
        })
        .catch((error)=>{
            console.error(error);
        })
};

// function for plotting first TS with Promise for data fetch complete
function plotIndexes() {
    showLoadingSpinner("loading-spinner-index");
    const indexName = $('#indexMOMCobaltTS option:selected').text();
    const indexFileLocation = $('#indexMOMCobaltTS').val();
    const promiseIndex = new Promise((resolve, reject) => {
        getIndex(indexFileLocation)
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
            // get number of ts in one index file
            var numberOfIndexes = parsedIndex.tsValues.length
            // plot all index
            var i = 0 ;
            plotlyIndex(parsedIndex.tsDates[i],parsedIndex.tsValues[i],parsedIndex.tsUnits[i],parsedIndex.yformat[i],parsedIndex.tsVarname[i],indexName)
            for (let i = 1; i < numberOfIndexes; i++) {
                plotlyIndexAdd(parsedIndex.tsDates[i],parsedIndex.tsValues[i],parsedIndex.tsVarname[i])
            }
            hideLoadingSpinner("loading-spinner-index");
        })
        .catch((error)=>{
            console.error(error);
        })
};


// function for retrieving lon lat from iframe leaflet
// var varVal;
function receiveMessage(event) {
    // Access the data sent from the iframe
    if (event.originalEvent.origin === window.location.origin) {
        // console.log(event.originalEvent)

        if (event.originalEvent.data.type === 'locationData') {
            locationData = event.originalEvent.data;
            
            if (varFoliumMap !== undefined && varFoliumMap !== null) {
                
                plotTS1(locationData);
                plotVertProfs(locationData);
                // // plotting the plotly ts
                // if ($('#varMOMCobaltTS2').val() !== undefined && $('#varMOMCobaltTS2').val() !== null) {
                //     plotTSs(locationData)
                // } else {
                //     plotTS1(locationData);
                // }
                // // plotting the plotly vertical profile (only in monthly setting)
                // if (dateFolium.length === 7){
                //     plotVertProfs(locationData)
                // }

                // grabbing the location variable value 
                const promiseVarVal = new Promise((resolve, reject) => {
                    getVarVal(locationData)
                        .then(pasrsePoint => {
                            var pointValue = pasrsePoint.pointValue
                            // send the value back to iframe
                            var varValData = {
                                type: 'varValData',
                                var: pointValue
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

// function to get variable value based on locationData and dataFolium
function getVarVal(infoLonLat) {
    var ajaxGet = "/cgi-bin/cefi_portal/vistab_mom_folium_extract_value.py"
        +"?variable="+varFoliumMap
        +"&region="+regFoliumMap
        +"&output_frequency="+freqFoliumMap
        +"&subdomain=full_domain"
        +"&experiment_type=hindcast"
        +"&grid_type=regrid"
        +"&stat="+statFoliumMap
        +"&depth="+depthFoliumMap
        +"&lon="+infoLonLat.longitude
        +"&lat="+infoLonLat.latitude
        +"&date="+dateFolium
    
    console.log('https://webtest.psd.esrl.noaa.gov/'+ajaxGet)

    return fetch(ajaxGet)
        .then(response => {
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(jsonData => {
            var lonValues = jsonData.lon
            var latValues = jsonData.lat
            var pointValue = jsonData.data
            var pointUnit = jsonData.unit
            var pointVarname = jsonData.varname

            var parsedValue = {
                pointValue:pointValue,
                lonValues:lonValues,
                latValues:latValues,
                pointUnit:pointUnit,
                pointVarname:pointVarname,
            }

            return parsedValue

        })
        .catch(error => {
            // Handle errors here
            console.error('Fetch variable value error:', error);
        });
}


// Define fetchWithTimeout function
async function fetchWithTimeout(resource, options = {}, timeout = 30000) { // Set timeout to 30 seconds
    const { signal, ...restOptions } = options;

    // Create a new AbortController instance
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(resource, {
            ...restOptions,
            signal: signal || controller.signal,
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Fetch request timed out');
        }
        throw error;
    }
}

// function to get transect based on polygonData
//  the transect only change 
//   1. when the map is created
//   2. polygon line is changed
function getTransect(infoLine) {

    var ajaxGet = "/cgi-bin/cefi_portal/vistab_mom_folium_extract_transect.py"
    +"?variable="+varFoliumMap
    +"&region="+regFoliumMap
    +"&output_frequency="+freqFoliumMap
    +"&subdomain=full_domain"
    +"&experiment_type=hindcast"
    +"&grid_type=regrid"
    +"&stat="+statFoliumMap
    +"&date="+dateFolium
    +"&jsonstring="+infoLine.polygon

    console.log('https://webtest.psd.esrl.noaa.gov/'+ajaxGet)

    return fetchWithTimeout(ajaxGet, {}, 90000)
        .then(response => {
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(jsonData => {

            var tranDepth = jsonData.depth;
            var tranLoc = jsonData.loc;
            var tranValues = jsonData.data;
            var tranLonLat = jsonData.location;
            var tranUnit = jsonData.unit;
        
            
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

    var ajaxGet = "/cgi-bin/cefi_portal/vistab_mom_folium_extract_profile.py"
        +"?variable="+varFoliumMap
        +"&region="+regFoliumMap
        +"&output_frequency="+freqFoliumMap
        +"&subdomain=full_domain"
        +"&experiment_type=hindcast"
        +"&grid_type=regrid"
        +"&date="+dateFolium
        +"&lon="+infoLonLat.longitude
        +"&lat="+infoLonLat.latitude
        +"&stat="+statFoliumMap
        +"&depth="+depthFoliumMap
        
    console.log('https://webtest.psd.esrl.noaa.gov/'+ajaxGet)

    return fetch(ajaxGet)
        .then(response => {
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(jsonData => {
            // Process the response data here
            var depth = jsonData.depth;
            var data = jsonData.data;
            var lon = jsonData.lon;
            var lat = jsonData.lat;
            var unit = jsonData.unit;
            var varname = jsonData.varname;


            var xformat = '.2f';
            var maxVal = Math.max(...data);
            var minVal = Math.min(...data);
            var diff = Math.abs(maxVal-minVal);

            if (diff< 0.01) {
                xformat = '.2e';
            }
            
            var parsedVP = {
                depth:depth,
                data:data,
                lon:lon,
                lat:lat,
                unit:unit,
                xformat:xformat,
                varname:varname
            }

            return parsedVP

        })
        .catch(error => {
            // Handle errors here
            console.error('Fetch vertical profile error:', error);
        });
}


// function getMockDate(freqString) {
//     // making mockDate imitating the file date frequency for 2nd time series
//     //  this is required due to the multiple file for same varValue with 
//     //  different frequency in the backend.
//     var mockDate;
//     if (freqString.toLowerCase().includes('da')){
//         mockDate = 'YYYY-MM-DD';
//     } else if (freqString.toLowerCase().includes('mon')){
//         mockDate = 'YYYY-MM';
//     } else if (freqString.toLowerCase().includes('ann')){
//         mockDate = 'YYYY';
//     }
//     return mockDate
// }        

// function to get time series based on locationData
//  the time series only change 
//   1. when the map is created
//   2. when the map is changed
//   3. only use the variable from created map
//      not the option changed result
var var2TS;
var depth2TS;
function getTimeSeries(infoLonLat,addTS) {
    // showLoadingSpinner();
    if (addTS) {
        var2TS = $('#varMOMCobaltTS2').val();
        depth2TS = $('#depthMOMCobaltTS2').val();
        var ajaxGet = "/cgi-bin/cefi_portal/vistab_mom_folium_extract_ts.py"
        +"?variable="+var2TS
        +"&region="+regFoliumMap
        +"&output_frequency="+freqFoliumMap
        +"&subdomain=full_domain"
        +"&experiment_type=hindcast"
        +"&grid_type=regrid"
        +"&stat="+statFoliumMap
        +"&depth="+depth2TS
        +"&lon="+infoLonLat.longitude
        +"&lat="+infoLonLat.latitude
    } else {
        var ajaxGet = "/cgi-bin/cefi_portal/vistab_mom_folium_extract_ts.py"
        +"?variable="+varFoliumMap
        +"&region="+regFoliumMap
        +"&output_frequency="+freqFoliumMap
        +"&subdomain=full_domain"
        +"&experiment_type=hindcast"
        +"&grid_type=regrid"
        +"&stat="+statFoliumMap
        +"&depth="+depthFoliumMap
        +"&lon="+infoLonLat.longitude
        +"&lat="+infoLonLat.latitude
    }
    
    console.log('https://webtest.psd.esrl.noaa.gov/'+ajaxGet)

    return fetch(ajaxGet)
        .then(response => {
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(jsonData => {
            var lonValues = jsonData.lon
            var latValues = jsonData.lat
            var tsDates = jsonData.dates
            var tsValues = jsonData.data
            var tsUnit = jsonData.unit
            var tsVarname = jsonData.varname

            // // Process the response data here
            // var lines = data.split('\n');

            // var tsDates = lines[0].split(',');
            // var tsValues = JSON.parse(lines[1]);
            // var lonValues = lines[2];
            // var latValues = lines[3];
            // var tsUnit = lines[4];

            var yformat = '.2f';
            var maxVal = Math.max(...tsValues);
            var minVal = Math.min(...tsValues);
            var diff = Math.abs(maxVal-minVal);
            if (diff< 0.01) {
                yformat = '.2e';
            }
            
            var parsedTS = {
                tsDates:tsDates, 
                tsValues:tsValues,
                lonValues:lonValues,
                latValues:latValues,
                tsUnit:tsUnit,
                tsVarname:tsVarname,
                yformat:yformat
            }

            return parsedTS

        })
        .catch(error => {
            // Handle errors here
            console.error('Fetch time series error:', error);
        });
}


function getIndex(fileLocation) {
    var ajaxGet = "/cgi-bin/cefi_portal/vistab_mom_extract_index.py"
        +"?file="+fileLocation

    console.log('https://webtest.psd.esrl.noaa.gov/'+ajaxGet)

    return fetch(ajaxGet)
        .then(response => {
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(jsonData => {
            var tsDates = jsonData.dates
            var tsValues = jsonData.data
            var tsVarname = jsonData.varname
            var tsUnits = jsonData.unit

            // // Process the response data here
            // var lines = data.split('\n');

            // var tsDates = lines[0].split(',');
            // var tsValues = JSON.parse(lines[1]);
            // var lonValues = lines[2];
            // var latValues = lines[3];
            // var tsUnit = lines[4];

            var yformat = '.2f';
            var maxVal = Math.max(...tsValues);
            var minVal = Math.min(...tsValues);
            var diff = Math.abs(maxVal-minVal);
            if (diff< 0.01) {
                yformat = '.2e';
            }
            
            var parsedTS = {
                tsDates:tsDates, 
                tsValues:tsValues,
                tsVarname:tsVarname,
                tsUnits:tsUnits,
                yformat:yformat
            }

            return parsedTS
        })
        .catch(error => {
            // Handle errors here
            console.error('Fetch indexes error:', error);
        });
};


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
    //             text: var2Value + '(' + tsUnit + ')',
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
        // name: statFoliumMap+' time series',
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
         width: 1000,
         height: 400,
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
        // name: statFoliumMap+' time series',
        name: variable
    };

    var data = [trace];

    var layout = {
        hovermode: 'closest',
        showlegend: false,
        title:
            variable +' '+ statFoliumMap +
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
                text: variable + '(' + parsedTran.tranUnit + ')',
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

// // function for creating the plotly contour transect
// function plotlyContour(plotlyID,parsedTran) {

//     // Define custom hovertemplate
//     // var array1D = parsedTran.tranLonLat;
//     // var array2D = new Array(parsedTran.tranDepth.length).fill(array1D);
//     // const customdata = array2D;
//     // console.log(customdata)

//     var trace = {
//         z: parsedTran.tranValues,
//         y: parsedTran.tranDepth,
//         x: parsedTran.tranLoc,
//         type: 'contour',
//         hovertemplate: `
//         ModelPoint# (from PolyLine start): %{x} <br>
//         Depth: %{y} <br>
//         Value: %{z} <extra></extra>
//         `,
//         colorscale: 'Viridis'
//     };

//     // // Set custom x-axis labels
//     // trace.xaxis = {
//     //     tickvals: parsedTran.tranLoc, // Corresponding to the index of customXLabels
//     //     ticktext: customValues,
//     // };

//     var layout = {
//         hovermode: 'closest',
//         showlegend: false,
//         title:"Vertical Transect Along PolyLine",
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
//         yaxis: {
//             title: 'Depth (m)',
//             autorange: 'reversed'
//         },
//         xaxis: {
//             title: {
//                 text: "Point# (from line start)",
//                 standoff: 10
//             },
//             tickmode: 'auto',
//             // type: 'category'
//         },
//         // modebar: {
//         //     remove: ["autoScale2d", "autoscale", "zoom", "zoom2d", ]
//         // },
//         // dragmode: "select"
//         // responsive: true
//     };
//     var config = {responsive: true}
//     Plotly.newPlot(plotlyID, [trace], layout,config);

// };


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
            vpname +' '+ statFoliumMap +
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
        name: var2Value,
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
                text: var2Value + '(' + tsUnit + ')',
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
        // name: statFoliumMap+' time series',
        name: variable
    };

    var data = [trace];

    var layout = {
        hovermode: 'closest',
        showlegend: false,
        title:
            variable +' '+ statFoliumMap +'<br>'+
            '(lat:'+parseFloat(latValues).toFixed(2)+'N,'+
            'lon:'+parseFloat(lonValues).toFixed(2)+'E)',
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
            title: 'Date'
        },
        yaxis: {
            title: {
                text: variable + '(' + tsUnit + ')',
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
        name: var2Value,
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
        name: variable,
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
        name: var2Value,
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
                // text: variable + '(' + tsUnit + ')',
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
        name: variable,
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
                // text: variable + '(' + tsUnit + ')',
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
        "Northwest Atlantic",
        "Northeast Pacific"
    ];
    let var_values = [
        "northwest_atlantic",
        "northeast_pacific"
    ];
    return [var_options, var_values];
}


// // functions for options lists (Manual entering)
// function momCobaltVars() {
//     let var_options = [
//         "Sea surface temperature",
//         "Bottom temperature",
//         "Sea surface salinity",
//         "Sea surface height",
//         "Mix layer depth",
//         "Potential temperature (3D)",
//         "Salinity (3D)",
//         "Sea ice concentration",
//         "Chlorophyll (Phytoplankton)",
//         "Dissolved Inorganic Carbon",
//         "Alkalinity",
//         "Carbonate Ion",
//         "Solubility for Aragonite",
//         "NO3",
//         "PO4",
//         "Mesozooplankton (0-200m)",
//         "Bottom oxygen",
//         "Bottom salinity",
//         "Bottom temperature",
//         "Sea surface temperature",
//         "Sea surface salinity",
//         "Sea surface height",
//         "Sea surface velocity (U)",
//         "Sea surface velocity (V)"
//     ];
//     let var_values = [
//         "tos",
//         "tob",
//         "sos",
//         "ssh",
//         "MLD_003",
//         "thetao",
//         "so",
//         "siconc",
//         "chlos",
//         "dissicos",
//         "talkos",
//         "sfc_co3_ion",
//         "sfc_co3_sol_arag",
//         "sfc_no3",
//         "sfc_po4",
//         "mesozoo_200",
//         "btm_o2",
//         "sob",
//         "tob",
//         "tos",
//         "sos",
//         "ssh",
//         "ssu_rotate",
//         "ssv_rotate" 
//     ];
//     let var_freqs = [
//         "monthly",
//         "monthly",
//         "monthly",
//         "monthly",
//         "monthly",
//         "monthly",
//         "monthly",
//         "monthly",
//         "monthly",
//         "monthly",
//         "monthly",
//         "monthly",
//         "monthly",
//         "monthly",
//         "monthly",
//         "monthly",
//         "daily",
//         "daily",
//         "daily",
//         "daily",
//         "daily",
//         "daily",
//         "daily",
//         "daily"
//     ];

//     return [var_options, var_values, var_freqs];
// }

// function momCobaltDepth() {
//     let depth = [
//         2.5, 7.5, 12.5, 17.5, 22.5, 27.5, 32.5, 37.5, 42.5, 47.5, 55, 65, 75,
//     85, 95, 105, 115, 125, 135, 145, 162.5, 187.5, 212.5, 237.5, 262.5,
//     287.5, 325, 375, 425, 475, 550, 650, 750, 850, 950, 1050, 1150, 1250,
//     1350, 1450, 1625, 1875, 2125, 2375, 2750, 3250, 3750, 4250, 4750, 5250,
//     5750, 6250
//     ]
//     return depth
// }

// function momCobalt3D() {
//     list_3d = [
//         'thetao',
//         'so'
//     ]
//     return list_3d
// }

// function momCobaltBottom() {
//     list_bottom = [
//         'tob',
//         'btm_o2',
//         'sob'
//     ]
//     return list_bottom
// }

function momCobaltStats() {
    var statsOptionList = [
        'mean',
        'anomaly'
    ];
    var statsValueList = [
        'mean',
        'anomaly'
    ]
    return [statsOptionList, statsValueList]
}

function colorbarOpt() {
    var colorOpt = [
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
    ];
    var exc_list = [
        'flag', 'flag_r','prism', 'prism_r','cividis', 'cividis_r', 'coolwarm', 'coolwarm_r', 'copper', 'copper_r', 'magma', 'magma_r', 'seismic', 'seismic_r','viridis', 'viridis_r'
    ];
    return colorOpt
}
