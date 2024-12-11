// create variable dropdown options
createMomCobaltVarDataOpt('varMOMCobaltData','hist_run');  // Data Query
// default initYear options for forecast (use forecast.js)
window.createMomCobaltInitYearOpt('iyearMOMCobaltForecastData');
// default initMonth options for forecast (use forecast.js)
window.createMomCobaltInitMonthOpt('imonthMOMCobaltForecastData');


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


// event listener for changes in the modeling period
$('#periodMOMCobaltData').on('change', function() {
    // Clear out the variable dropdown
    $('#varMOMCobaltData').empty();

    // Create variable option and year month select based on period selection
    if ($('#periodMOMCobaltData').val() === 'hist_run') {
        // createMomCobaltVarOpt('MOMCobalt','varMOMCobaltData');
        createMomCobaltVarDataOpt('varMOMCobaltData','hist_run');
        $('.forecastOpt').addClass('hidden');
    } else if ($('#periodMOMCobaltData').val() === 'forecast') {
        // createMomCobaltVarOptFcast('MOMCobaltFcast','varMOMCobaltData');
        createMomCobaltVarDataOpt('varMOMCobaltData','forecast');
        $('.forecastOpt').removeClass('hidden');
    }
});

// event listener for data query button click
$('#genQueryButton').on('click', function() {
    var dataType = $('#periodMOMCobaltData').val()
    generateDataQuery(dataType)     // the function return a promise obj from fetch
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



// functions for generating data query 
async function generateDataQuery(dataType) {
    var region = $('#regMOMCobaltData').val();
    var variable = $('#varMOMCobaltData').val();
    var grid = $('#gridMOMCobalt').val();
    var year = -99
    var month = -99
    if (dataType === 'forecast') {
        year = $('#iyearMOMCobaltForecastData').val();
        month = $('#imonthMOMCobaltForecastData').val();
    }
    // find data frequency and create mock date for data query variable
    var selectVarDataIndex = $("#varMOMCobaltData").prop('selectedIndex');
    var varFreq = groupList[selectVarDataIndex]
    // find out mockDate using (historical.js)
    var mockDate = window.getMockDate(varFreq)

    var ajaxGet = "/cgi-bin/cefi_portal/mom_data_query.py"
    +"?variable="+variable
    +"&region="+region
    +"&date="+mockDate
    +"&grid="+grid
    +"&datatype="+dataType
    +"&year="+year
    +"&month="+month

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


// async fetching the data access json files 
async function fetchDataAccessJson(region, dataType) {
  try {
    const response = await fetch('data_option_json/data_access_' + region + '_' + dataType + '.json');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();  // JSON data 
    // console.log('JSON data:', data);
    return data;
  } catch (error) {
    console.error('There was a problem when async fetchDataAccessJson:', error);
  }
}


// async function for create option for data access after fetch complete
// Arrays to store the results
var valuesList = [];
var textList = [];
var groupList = [];
async function createMomCobaltVarDataOpt(selectID,dataType='hist_run') {
  let elm = document.getElementById(selectID); 
  let regVal = $("#regMOMCobaltData").val()
  let varJson = await fetchDataAccessJson(regVal,dataType);
  // console.log(varJson)
  let varlist = [
      varJson.var_values,
      varJson.var_options,
      varJson.var_freqs
  ];
  df = window.optionSubgroupList(varlist[1],varlist[0],varlist[2]);
  elm.appendChild(df);

  // Loop through the select dropdown to store the reordered dropdown list
  $("#varMOMCobaltData").children().each(function() {
      // Check if the element is an optgroup
      if ($(this).is('optgroup')) {
          var groupLabel = $(this).attr('label'); // Get the optgroup label
          
          // Now loop through each option inside the optgroup
          $(this).children('option').each(function() {
              var optionValue = $(this).val();   // Get the option's value
              var optionText = $(this).text();   // Get the option's display text

              // Store in the lists
              valuesList.push(optionValue);
              textList.push(optionText);
              groupList.push(groupLabel);
          });
      } else if ($(this).is('option')) {
          // Handle options outside of optgroups, if any exist
          console.log('Error! one variable options does not have optgroup')
      }
  });



};