// default historical run options
createMomCobaltVarOpt('MOMCobalt','varMOMCobaltData');  // Data Query
// default Year options for Historical run
createMomCobaltHistTimeOpt('yearMOMCobaltHistrunData',momCobaltHistYear)
// default Month options for Historical run
createMomCobaltHistTimeOpt('monthMOMCobaltHistrunData',momCobaltHistMonth)
// default initYear options for forecast
createMomCobaltInitYearOpt('iyearMOMCobaltForecastData');
// default initMonth options for forecast
createMomCobaltInitMonthOpt('imonthMOMCobaltForecastData');


// event listener for changes on the first dropdown
$('#periodMOMCobaltData').on('change', function() {
    // Clear out the variable dropdown
    $('#varMOMCobaltData').empty();

    // Create variable option and year month select based on period selection
    if ($('#periodMOMCobaltData').val() === 'hist_run') {
        createMomCobaltVarOpt('MOMCobalt','varMOMCobaltData');
        $('.forecastOpt').addClass('hidden');
        $('.histrunOpt').removeClass('hidden');
    } else if ($('#periodMOMCobaltData').val() === 'forecast') {
        createMomCobaltVarOptFcast('MOMCobaltFcast','varMOMCobaltData');
        $('.histrunOpt').addClass('hidden');
        $('.forecastOpt').removeClass('hidden');
    }
});

// event lister for radio button choice
$(document).ready(function(){
    $("input[type='radio'].radioData").change(function(){
      if ($("#radioOpendap").is(":checked")) {
        $('.wgetOpt').addClass('hidden');
        $('.opendapOpt').removeClass('hidden');
      } else if ($("#radioWget").is(":checked")) {
        $('.opendapOpt').addClass('hidden');
        $('.wgetOpt').removeClass('hidden');
      }
    });
});

// event listener for data query button click
$('#genQueryButton').on('click', function() {
    var dataType = $('#periodMOMCobaltData').val()
    generateDataQuery(dataType)     // the function return a promise obj from fetch
        .then((jsonDataQuery)=>{
            var wgetCode = jsonDataQuery.wget
            $('#codeBlockWget').text(wgetCode);
            var opendapCode = jsonDataQuery.opendap
            $('#codeBlockOpendap').text(opendapCode);
            var pythonCode = jsonDataQuery.python
            $('#codeBlockPython').text(pythonCode);
            var rCode = jsonDataQuery.r
            $('#codeBlockR').text(rCode);
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



// functions for generating data query 
function generateDataQuery(dataType) {
    var region = $(regMOMCobaltData).val();
    var variable = $(varMOMCobaltData).val();
    var grid = $(gridMOMCobalt).val();
    var year
    var month
    if (dataType === 'hist_run') {
        year = $(yearMOMCobaltHistrunData).val();
        month = $(monthMOMCobaltHistrunData).val();
    } else if (dataType === 'forecast') {
        year = $(iyearMOMCobaltForecastData).val();
        month = $(imonthMOMCobaltForecastData).val();
    }

    var ajaxGet = "/cgi-bin/cefi_portal/mom_data_query.py"
    +"?variable="+variable
    +"&region="+region
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
