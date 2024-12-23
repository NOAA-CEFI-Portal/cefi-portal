// setup local global variable (data structure and filenaming structure)
var region;
var subdomain;
var experiment_type;
var output_frequency;
var grid_type;
var release;
var variable;
var iyyyymm;
var ens_opt;
var scenario;

// initializing the data query dropdown options
createDataAccessAll('northwest_atlantic')

// event lister for region radio button in the variable table section
$(document).ready(function(){
    $("input[type='radio'].radioDataTable").change(function(){
      if ($("#radioNWATable").is(":checked")) {
        $('.nepTableOpt').addClass('hidden');
        $('.nwaTableOpt').removeClass('hidden');
      } else if ($("#radioNEPTable").is(":checked")) {
        $('.nwaTableOpt').addClass('hidden');
        $('.nepTableOpt').removeClass('hidden');
      }
    });
});

// event listener for region radio button in the data query
//  the regionSubdomain value determine the data_option_json
//  cefi_data_option to create the dropdown options 
$(document).ready(function(){
    $("input[type='radio'].radioDataQuery").change(function(){
        var regionSubdomain = $('input[name="dataQueryOptions"]:checked').val();
        // clear experiement type and all other options when changing radio 
        // (needed to avoid stacking more options)
        $('#expTypeDataQuery').empty();
        data_access_all_clear();
        createDataAccessAll(regionSubdomain);

    });
});


// function to reset the hidden or show dropdown options
function resetOptionVisibility(expType) {
  // turn on/off forecast/projection related options
  if (experiment_type.includes('forecast')) {
    // creating the initialDate options needed!!!!!
    $('.forecastOpt').removeClass('hidden');
    $('.projectOpt').addClass('hidden');
  } else if (experiment_type.includes('projection')) {
    $('.projectOpt').removeClass('hidden');
    $('.forecastOpt').addClass('hidden');
  } else {
    $('.projectOpt').addClass('hidden');
    $('.forecastOpt').addClass('hidden');
  };
}

// Async function that depends on createDataAccessExpType
//  !!!!!!add elseif when radio region and subdomain increase!!!!!!
async function createDataAccessAll(regSubdom) {

    // radio value decipher
    if (regSubdom === 'northwest_atlantic'){
        region = 'northwest_atlantic';
        subdomain = 'full_domain';
    } else if (regSubdom === 'northeast_pacific'){
        region = 'northeast_pacific';
        subdomain = 'full_domain';
    };
    // create experiement type options
    await createDataAccessExpType(region,subdomain);
    experiment_type = $('#expTypeDataQuery').val();

    // turn on/off forecast/projection related options
    resetOptionVisibility(experiment_type)

    // create options below experiement type and above variables
    await createDataAccessOthers(region,subdomain,experiment_type);
}


// async function for creating Experiment type options
//  !!!!!!add elseif when radio region and subdomain increase!!!!!!
async function createDataAccessExpType(reg,subDom){
    let elm = document.getElementById('expTypeDataQuery'); 
    let varJson = await fetchExperimentTypeOption(reg,subDom);
    let expTypeOptions = varJson.experiment_type;
    let df = window.optionList(expTypeOptions,expTypeOptions);
    elm.appendChild(df);

}

// async fetching the data_access_json cefi_experiment_type_option
async function fetchExperimentTypeOption(reg, subDom) {
    try {
      const response = await fetch(
        'data_option_json/cefi_experiment_type_options.Projects.CEFI.regional_mom6.cefi_portal.'+
        reg+
        '.'+
        subDom+
        '.json'
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();  // JSON data 
      // console.log('JSON data:', data);
      return data;
    } catch (error) {
      console.error('There was a problem when async fetchExperimentTypeOption:', error);
    }
};


// async function for creating other options besides variables
async function createDataAccessOthers(reg,subDom,expType){
    let dataAccessJson = await fetchDataOption(reg,subDom,expType);
    let variableJson = await fetchVarOption(reg,subDom,expType);

    // Output Frequency :
    let elm = document.getElementById('outFreqDataQuery'); 
    let avaiOptions = dataAccessJson.output_frequency;
    let df = window.optionList(avaiOptions,avaiOptions);   //hindcast.js
    elm.appendChild(df);

    // Grid Type :
    elm = document.getElementById('gridTypeDataQuery'); 
    avaiOptions = dataAccessJson.grid_type;
    df = window.optionList(avaiOptions,avaiOptions);   
    elm.appendChild(df);

    // Release :
    elm = document.getElementById('releaseDataQuery'); 
    avaiOptions = dataAccessJson.release;
    df = window.optionList(avaiOptions,avaiOptions);   
    elm.appendChild(df);

    // Variables :
    elm = document.getElementById('variableDataQuery'); 
    let valueOptions = variableJson.var_values;
    let nameOptions = variableJson.var_options;
    df = window.optionList(nameOptions,valueOptions);
    // Create the default empty option for variable that force user choose that related to a event listener
    //  need this dynamically to be recreated when empty the dropdown
    //  by other user actions
    let defaultOption = document.createElement('option');
    defaultOption.selected = true;  // Make it selected
    defaultOption.disabled = true; // Make it disabled
    defaultOption.appendChild(document.createTextNode('Select a variable')); // Set the text
    df.insertBefore(defaultOption, df.firstChild)
    // df.appendChild(defaultOption); // Append the default option to the fragment
    elm.appendChild(df);

}

// async fetching the data_access_json cefi_data_option
async function fetchDataOption(reg,subDom,expType) {
    try {
      const response = await fetch(
        'data_option_json/cefi_data_options.Projects.CEFI.regional_mom6.cefi_portal.'+
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
      console.error('There was a problem when async fetchDataOption:', error);
    }
}

// async fetching the data_access_json cefi_var_option
async function fetchVarOption(reg,subDom,expType) {
    try {
      const response = await fetch(
        'data_option_json/cefi_var_options.Projects.CEFI.regional_mom6.cefi_portal.'+
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
      console.error('There was a problem when async fetchVarOption:', error);
    }
}

// function to clear all option below experiement type
function data_access_all_clear(){

    $('#outFreqDataQuery').empty();
    $('#gridTypeDataQuery').empty();
    $('#releaseDataQuery').empty();
    $('#variableDataQuery').empty();

};

// event listener for changes in the experiment type
$('#expTypeDataQuery').on('change', function() {
    // update experiement type
    experiment_type = $(this).val();

    // clear all options below experiement type
    // (needed to avoid stacking more options)
    data_access_all_clear();

    // recreate options below experiment type due to changes
    createDataAccessOthers(region,subdomain,$(this).val());

    // turn on/off forecast/projection related options
    resetOptionVisibility(experiment_type)

});


// function to clear option below variable (experiemet specific)
function variable_below_all_clear(){

  $('#initialDateFcastDataQuery').empty();
  $('#ensOptionFcastDataQuery').empty();
  $('#forcingProjDataQuery').empty();
  $('#ensOptionProjDataQuery').empty();

};

// event listener for variable pick (need to be generic for all experiment)
//  this event listener should create and show options that narrow down 
//  to single file in different experiment
$('#variableDataQuery').on('change', function() {
  // update variable
  variable = $(this).val();

  // clear all options below experiement type
  // (needed to avoid stacking more options)
  variable_below_all_clear();

  // recreate options below experiment type due to changes
  var ens_options_fcast;
  var init_date_fcast;
  var ens_options_proj;
  var scenario_proj;
  createVariableSpecOptions()    // the function return a promise obj from fetch
    .then((jsonData)=>{
      // Check if an attribute exists
      if ('ens_options_fcast' in jsonData) {
        ens_options_fcast = jsonData.ens_options_fcast;
        // ens_options_fcast :
        let elm = document.getElementById('ensOptionFcastDataQuery'); 
        let valueOptions = ens_options_fcast;
        let nameOptions = ens_options_fcast;
        df = window.optionList(nameOptions,valueOptions);
        // // Create the default empty option for variable that force user choose that related to a event listener
        // //  need this dynamically to be recreated when empty the dropdown
        // //  by other user actions
        // let defaultOption = document.createElement('option');
        // defaultOption.selected = true;  // Make it selected
        // defaultOption.disabled = true; // Make it disabled
        // defaultOption.appendChild(document.createTextNode('Select an ensemble option')); // Set the text
        // df.insertBefore(defaultOption, df.firstChild)
        // // df.appendChild(defaultOption); // Append the default option to the fragment
        elm.appendChild(df);
      };
      if ('init_date_fcast' in jsonData) {
        init_date_fcast = jsonData.init_date_fcast;
        // init_date_fcast :
        let elm = document.getElementById('initialDateFcastDataQuery'); 
        let valueOptions = init_date_fcast;
        let nameOptions = init_date_fcast;
        df = window.optionList(nameOptions,valueOptions);
        // // Create the default empty option for variable that force user choose that related to a event listener
        // //  need this dynamically to be recreated when empty the dropdown
        // //  by other user actions
        // let defaultOption = document.createElement('option');
        // defaultOption.selected = true;  // Make it selected
        // defaultOption.disabled = true; // Make it disabled
        // defaultOption.appendChild(document.createTextNode('Select an initial date')); // Set the text
        // df.insertBefore(defaultOption, df.firstChild)
        // // df.appendChild(defaultOption); // Append the default option to the fragment
        elm.appendChild(df);
      }; 
      if ('ens_options_proj' in jsonData) {
        ens_options_proj = jsonData.ens_options_proj;
        // ens_options_proj :
        let elm = document.getElementById('ensOptionProjDataQuery'); 
        let valueOptions = ens_options_proj;
        let nameOptions = ens_options_proj;
        df = window.optionList(nameOptions,valueOptions);
        // // Create the default empty option for variable that force user choose that related to a event listener
        // //  need this dynamically to be recreated when empty the dropdown
        // //  by other user actions
        // let defaultOption = document.createElement('option');
        // defaultOption.selected = true;  // Make it selected
        // defaultOption.disabled = true; // Make it disabled
        // defaultOption.appendChild(document.createTextNode('Select an ensemble option')); // Set the text
        // df.insertBefore(defaultOption, df.firstChild)
        // // df.appendChild(defaultOption); // Append the default option to the fragment
        elm.appendChild(df);
      };
      if ('scenario_proj' in jsonData) {
        scenario_proj = jsonData.scenario_proj;
        // scenario_proj :
        let elm = document.getElementById('scenarioProjDataQuery'); 
        let valueOptions = scenario_proj;
        let nameOptions = scenario_proj;
        df = window.optionList(nameOptions,valueOptions);
        // // Create the default empty option for variable that force user choose that related to a event listener
        // //  need this dynamically to be recreated when empty the dropdown
        // //  by other user actions
        // let defaultOption = document.createElement('option');
        // defaultOption.selected = true;  // Make it selected
        // defaultOption.disabled = true; // Make it disabled
        // defaultOption.appendChild(document.createTextNode('Select a scenario')); // Set the text
        // df.insertBefore(defaultOption, df.firstChild)
        // // df.appendChild(defaultOption); // Append the default option to the fragment
        elm.appendChild(df);
      };
  });

});

// async functions for fetching variable and experiment specific option from backend
async function createVariableSpecOptions() {
  var ajaxGet = "/cgi-bin/cefi_portal/create_variable_spec_options.py"
  +"?region="+region
  +"&subdomain="+subdomain
  +"&experiment_type="+$('#expTypeDataQuery').val()
  +"&output_frequency="+$('#outFreqDataQuery').val()
  +"&grid_type="+$('#gridTypeDataQuery').val()
  +"&release="+$('#releaseDataQuery').val()
  +"&variable="+$('#variableDataQuery').val();


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
          console.error('Fetch json failed when creating variable specific options:', error);
      });
}



// event listener for data query button click
$('#genQueryButton').on('click', function() {
    generateDataQuery()     // the function return a promise obj from fetch
        .then((jsonDataQuery)=>{
            var dataInfo = jsonDataQuery.data_info;
            $('#codeBlockDataInfo').text(dataInfo);
            var http_href = jsonDataQuery.download;
            $("#downloadHttp").attr("href", http_href);  //direct download link
            var wgetCode = jsonDataQuery.wget;
            $('#codeBlockWget').text(wgetCode);
            var opendapCode = jsonDataQuery.opendap
            $('#codeBlockOpendap').text(opendapCode);
            var pythonCode = jsonDataQuery.python
            $('#codeBlockPython').text(pythonCode);
            var rCode = jsonDataQuery.r
            $('#codeBlockR').text(rCode);
            var Citation = jsonDataQuery.citation
            $('#codeBlockCite').text(Citation);
        })
});

// functions for generating data query 
async function generateDataQuery() {
    output_frequency = $('#outFreqDataQuery').val();
    grid_type = $('#gridTypeDataQuery').val();
    release = $('#releaseDataQuery').val();
    variable = $('#variableDataQuery').val();
    iyyyymm = 'i999999';
    if (experiment_type.includes('forecast')) {
      iyyyymm = $('#initialDateFcastDataQuery').val();
      ens_opt = $('#ensOptionFcastDataQuery').val();
    };
    if (experiment_type.includes('projection')) {
      scenario = $('#scenarioProjDataQuery').val();
      ens_opt = $('#ensOptionProjDataQuery').val();
    };

    var ajaxGet = "/cgi-bin/cefi_portal/generate_data_query.py"
    +"?region="+region
    +"&subdomain="+subdomain
    +"&experiment_type="+experiment_type
    +"&output_frequency="+output_frequency
    +"&grid_type="+grid_type
    +"&release="+release
    +"&variable="+variable
    +"&iyyyymm="+iyyyymm
    +"&scenario="+scenario
    +"&ens_opt="+ens_opt

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
            console.error('Fetch json data query failed:', error);
        });
}

//event listener for data query code copy
$("#copyButtonWget").click(function () {
    copyCode('codeBlockWget');
});
$("#copyButtonOpendap").click(function () {
    copyCode('codeBlockOpendap');
});
$("#copyButtonPython").click(function () {
    copyCode('codeBlockPython');
});
$("#copyButtonR").click(function () {
    copyCode('codeBlockR');
});
$("#copyButtonCite").click(function () {
    copyCode('codeBlockCite');
});



// // functions for generating data query 
// async function generateDataQuery(dataType) {
//     var region = $('#regMOMCobaltData').val();
//     var variable = $('#varMOMCobaltData').val();
//     var grid = $('#gridMOMCobalt').val();
//     var year = -99
//     var month = -99
//     if (dataType === 'forecast') {
//         year = $('#iyearMOMCobaltForecastData').val();
//         month = $('#imonthMOMCobaltForecastData').val();
//     }
//     // find data frequency and create mock date for data query variable
//     var selectVarDataIndex = $("#varMOMCobaltData").prop('selectedIndex');
//     var varFreq = groupList[selectVarDataIndex]
//     // find out mockDate using (historical.js)
//     var mockDate = window.getMockDate(varFreq)

//     var ajaxGet = "/cgi-bin/cefi_portal/mom_data_query.py"
//     +"?variable="+variable
//     +"&region="+region
//     +"&date="+mockDate
//     +"&grid="+grid
//     +"&datatype="+dataType
//     +"&year="+year
//     +"&month="+month

//     console.log('https://webtest.psd.esrl.noaa.gov/'+ajaxGet)

//     return fetch(ajaxGet)
//         .then(response => {
//             if (!response.ok) {
//             throw new Error('Network response was not ok');
//             }
//             return response.json();
//         })
//         .catch(error => {
//             // Handle errors here
//             console.error('Fetch json data query failed:', error);
//         });
// }

function copyCode(codeBlockID) {
    let code = $("#"+codeBlockID).text();
    // document.getElementById(modalID).focus();
    navigator.clipboard.writeText(code)
      .then(function() {
        console.log('Code copied to clipboard');
      })
      .catch(function(err) {
        console.error('Failed to copy text: ', err);
    });
}





// // async fetching the data access json files 
// async function fetchDataAccessJson(region, dataType) {
//   try {
//     const response = await fetch('data_option_json/data_access_' + region + '_' + dataType + '.json');
//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }
//     const data = await response.json();  // JSON data 
//     // console.log('JSON data:', data);
//     return data;
//   } catch (error) {
//     console.error('There was a problem when async fetchDataAccessJson:', error);
//   }
// }


// // async function for create option for data access after fetch complete
// // Arrays to store the results
// var valuesList = [];
// var textList = [];
// var groupList = [];
// async function createMomCobaltVarDataOpt(selectID,dataType='hist_run') {
//   let elm = document.getElementById(selectID); 
//   let regVal = $("#regMOMCobaltData").val()
//   let varJson = await fetchDataAccessJson(regVal,dataType);
//   // console.log(varJson)
//   let varlist = [
//       varJson.var_values,
//       varJson.var_options,
//       varJson.var_freqs
//   ];
//   df = window.optionSubgroupList(varlist[1],varlist[0],varlist[2]);
//   elm.appendChild(df);

//   // Loop through the select dropdown to store the reordered dropdown list
//   $("#varMOMCobaltData").children().each(function() {
//       // Check if the element is an optgroup
//       if ($(this).is('optgroup')) {
//           var groupLabel = $(this).attr('label'); // Get the optgroup label
          
//           // Now loop through each option inside the optgroup
//           $(this).children('option').each(function() {
//               var optionValue = $(this).val();   // Get the option's value
//               var optionText = $(this).text();   // Get the option's display text

//               // Store in the lists
//               valuesList.push(optionValue);
//               textList.push(optionText);
//               groupList.push(groupLabel);
//           });
//       } else if ($(this).is('option')) {
//           // Handle options outside of optgroups, if any exist
//           console.log('Error! one variable options does not have optgroup')
//       }
//   });
// };