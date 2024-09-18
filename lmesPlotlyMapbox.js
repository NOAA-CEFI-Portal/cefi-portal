// Using fetch() to read the JSON file
fetch('lms_choropleth_mapbox.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); // Parse the JSON
  })
  .then(dataJson => {
    // create the plotly plot
    lmesPlotlyMapbox(dataJson);

    // auto-click the reset button to make the mapbox plot show normal view
    var inputElement = document.querySelector('a[data-title="Reset view"]')
    // first wait for 1 sec for plotly plot in modal to finish and assign the element
    setTimeout(()=> {
        inputElement = document.querySelector('a[data-title="Reset view"]')
    }
    ,1000);
    // reset button is clicked once the modal open (sufficient time out is necessary)
    $('#lmeButton').on("click", function () {
        setTimeout(()=> {
            inputElement.click()
        }
        ,500);
    });
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });

// plot the plotly figure
function lmesPlotlyMapbox(datajson) {
    window.PLOTLYENV=window.PLOTLYENV || {};  
    if (document.getElementById("lmePlotting")) {
        Plotly.newPlot(                        
            "lmePlotting",                        
            datajson
        )
    }
}


// // read geojson and create plotly plot
// readTextFile("lms_choropleth_mapbox.json", function(text){
//     var datajson = JSON.parse(text);
//     lmesPlotlyMapbox(datajson);

//     // auto-click the reset button to make the mapbox plot show normal view
//     var inputElement = document.querySelector('a[data-title="Reset view"]')
//     // first wait for 1 sec for plotly plot in modal to finish and assign the element
//     setTimeout(()=> {
//         inputElement = document.querySelector('a[data-title="Reset view"]')
//     }
//     ,1000);
//     // reset button is clicked once the modal open (sufficient time out is necessary)
//     $('#lmeButton').on("click", function () {
//         setTimeout(()=> {
//             inputElement.click()
//         }
//         ,500);
//     });

// });

// // function to read geojson
// function readTextFile(file, callback) {
//     var rawFile = new XMLHttpRequest();
//     rawFile.overrideMimeType("application/json");
//     rawFile.open("GET", file, true);
//     rawFile.onreadystatechange = function() {
//         if (rawFile.readyState === 4 && rawFile.status == "200") {
//             callback(rawFile.responseText);
//         }
//     }
//     rawFile.send(null);
// }

