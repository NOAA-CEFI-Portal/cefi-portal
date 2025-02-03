$(window).on("message", function (event) {
    var mapData = event.originalEvent.data;
    var messageType = mapData.type;
    // Check the origin of the message
    // Use the received variable in the iframe's script
    if (event.originalEvent.origin === window.location.origin) {
        
        // map update
        if (messageType === "mapData") {
            // console.log(mapData)
            // [[5.272542476654053, -98.4422607421875], [58.1607551574707, -36.079986572265625]], NWA
            // [[10.809035301208496, 156.9248046875], [80.71794891357422, 254.971923828125]], NEP


            console.log(mapData)
            // Check if the layer is defined before removing it
            if (image_overlay_cbd11cdbf58403fe3f6ba6fec69f8218) {
                // remove the old layer
                map_7079a36f74c16e1ce2ab21c4f811b35d.removeLayer(image_overlay_cbd11cdbf58403fe3f6ba6fec69f8218)
            }
            // overlap with the new layer
            image_overlay_cbd11cdbf58403fe3f6ba6fec69f8218 = L.imageOverlay(
                mapData.image,
                mapData.image_bound,
                {"opacity": 1, "zindex": 1}
            ).addTo(map_7079a36f74c16e1ce2ab21c4f811b35d);


            // recenter the map
            map_7079a36f74c16e1ce2ab21c4f811b35d.setView(mapData.map_center, 3);
            // // reassign CRS
            // map_7079a36f74c16e1ce2ab21c4f811b35d.options.crs = mapData.map_crs; // Replace 'newCRS' with the desired CRS

            // remove legend
            $(".legend").remove();        
            color_map_b13917af52926c4458f13c8955e429d1 = {};
            // overlap new legend
            color_map_b13917af52926c4458f13c8955e429d1.color = d3.scale.threshold()
                .domain(mapData.domain1)
                .range(mapData.range);
            color_map_b13917af52926c4458f13c8955e429d1.x = d3.scale.linear()
                    .domain(mapData.domain2)
                    .range([0, 450 - 50]);
        
            color_map_b13917af52926c4458f13c8955e429d1.legend = L.control({position: 'bottomleft'});
            color_map_b13917af52926c4458f13c8955e429d1.legend.onAdd = function (map) {var div = L.DomUtil.create('div', 'legend'); return div};
            color_map_b13917af52926c4458f13c8955e429d1.legend.addTo(map_7079a36f74c16e1ce2ab21c4f811b35d);
        
            color_map_b13917af52926c4458f13c8955e429d1.xAxis = d3.svg.axis()
                .scale(color_map_b13917af52926c4458f13c8955e429d1.x)
                .orient("top")
                .tickSize(1)
                .tickValues(mapData.tick);

            color_map_b13917af52926c4458f13c8955e429d1.svg = d3.select(".legend.leaflet-control").append("svg")
                .attr("id", 'legend')
                .attr("width", 450)
                .attr("height", 60);
        
            color_map_b13917af52926c4458f13c8955e429d1.g = color_map_b13917af52926c4458f13c8955e429d1.svg.append("g")
                .attr("class", "key")
                .attr("transform", "translate(25,16)");
        
            color_map_b13917af52926c4458f13c8955e429d1.g.selectAll("rect")
                .data(color_map_b13917af52926c4458f13c8955e429d1.color.range().map(function(d, i) {
                return {
                    x0: i ? color_map_b13917af52926c4458f13c8955e429d1.x(color_map_b13917af52926c4458f13c8955e429d1.color.domain()[i - 1]) : color_map_b13917af52926c4458f13c8955e429d1.x.range()[0],
                    x1: i < color_map_b13917af52926c4458f13c8955e429d1.color.domain().length ? color_map_b13917af52926c4458f13c8955e429d1.x(color_map_b13917af52926c4458f13c8955e429d1.color.domain()[i]) : color_map_b13917af52926c4458f13c8955e429d1.x.range()[1],
                    z: d
                };
                }))
            .enter().append("rect")
                .attr("height", 40 - 30)
                .attr("x", function(d) { return d.x0; })
                .attr("width", function(d) { return d.x1 - d.x0; })
                .style("fill", function(d) { return d.z; });
        
            color_map_b13917af52926c4458f13c8955e429d1.g.call(color_map_b13917af52926c4458f13c8955e429d1.xAxis).append("text")
                .attr("class", "caption")
                .attr("y", 30)
                .text(mapData.label);
        };

        // marker update for values
        if (messageType === "varValData") {
            varVal = mapData.var
            new_mark.bindPopup(`<b>Lat:</b> ${lat}<br /><b>Lon:</b> ${lng}<br /><b>Value:</b> ${varVal}`);
            // console.log(varVal)
            // console.log(mapData)

        };
        // marker update for forecast values
        if (messageType === "varValFcastData") {
            varVal = mapData.var
            new_mark.bindPopup(`<b>Lat:</b> ${lat}<br /><b>Lon:</b> ${lng}<br /><b>Forecast Value:</b> ${varVal}`);
            // console.log(varVal)
            // console.log(mapData)

        };
        // marker resetting
        if (messageType === "removeMarker") {
            if (new_mark) {
                map_7079a36f74c16e1ce2ab21c4f811b35d.removeLayer(new_mark);
            }
        };
    };
});


// function readJsonFile(filePath) {
//     fetch(filePath)
//       .then(response => {
//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         return response.json();
//       })
//       .then(data => {
//         // Handle the JSON data
//         lme_json = data
//         console.log('Json file loaded')
//       })
//       .catch(error => {
//         // Handle errors
//         console.error('Error:', error);
//       });
//   }




