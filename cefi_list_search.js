function drawTableRows() {
    for (const item of items) {
        let newItem = "<div class='row item' ";
        newItem += "data-ctype='" + item['ctype'] + "' ";
        newItem += "data-cvar='" + item['cvar'] + "' ";
        newItem += "data-crange='" + item['crange'] + "' ";
        newItem += "data-ctime='" + item['ctime'] + "' ";
        newItem += "data-cdata='" + item['cdata'] + "' ";
        newItem += "data-ctopics='" + item['ctopics'] + "' ";
        newItem += "data-cregions='" + item['cregions'] + "' ";
        newItem += "data-cproduct='" + item['cproduct'] + "' ";	    
        newItem += "data-cplatforms='" + item['cplatforms'] + "' ";
        newItem += "data-corgs='" + item['corgs'] + "' ";	    	    
        newItem += ">";
        newItem += "<div class='col-sm-10'>";
        newItem += "<a class='title' href='" + item['url'] + "'>" + item['title'] + "</a>";
        newItem += "<br>" + item['desc'];
        newItem += "</div>";
        newItem += "<div class='col-sm-2'>";
        newItem += "<a href='" + item['url'] + "'><img alt='click thumbnail' src='" + item['thumbnail'] + "'></a>";
        newItem += "</div>";
        newItem += "</div>";
        $("#dataTable").append(newItem);
    }
}

function createTextFilter(elementID, label, width) {
    let newInput = '<div class="col-md-' + width + '">'
    newInput += '<label class="filterLabel">' + label + ':</label>';
    newInput += '<input class="filterInput form-control" id="' + elementID + '" placeholder="Filters in title/description">';
    newInput += '</div>';
    $("#searchCriteria").append(newInput);
}

function createSelect(elementID, options, label, width) {
    let newSelect = '<div class="col-md-' + width + '">'
    newSelect += '<label class="filterLabel">' + label + ':</label><br>';
    newSelect += '<select class="filterSelect form-control" id="' + elementID + '">';

    for (let index = 0, len = options.length; index < len; ++index) {
        if (Array.isArray(options[index])) {
            newSelect += "<option value='" + index + "' data-sort='" + options[index][0] + "'>" + options[index][1] + "</option>";
        } else {
            if (options[index]) {
                newSelect += "<option value='" + index + "'>" + options[index] + "</option>";
            }
        }
    }

    newSelect += '</select></div>';
    $("#searchCriteria").append(newSelect);
    
    sortSelect(elementID);
    
    // // create optgroup for variable dropdown (testing block from Chia-Wei)
    // if (elementID === 'cvar') {
    //     var groupAtm = "<optgroup label='Atmospheric'>"
    //     var groupOcn = "<optgroup label='Oceanic'>"

    //     for (let ii = 0; ii < options.length; ++ii) {
    //         var valueNum = Number($('#cvar')[0][ii].value)
    //         if (options[valueNum][2] === 'atm') {
    //             groupAtm += "<option value='" + valueNum + "'>" + options[valueNum][1] + "</option>";
    //         } else if (options[valueNum][2] === 'ocn') {
    //             groupOcn += "<option value='" + valueNum + "'>" + options[valueNum][1] + "</option>";
    //         }
    //     }

    //     groupAtm += "</optgroup'>"
    //     groupOcn += "</optgroup'>"
    //     group = groupAtm + groupOcn

    //     $('#cvar')[0].innerHTML = group;
    // }
    // // testing block finish

    $("#" + elementID).prop("selectedIndex", 0);


}

function sortSelect(elementID) {
    var wrapper = $("#" + elementID);

    wrapper.find('option').sort(function(a, b) {
        return +$(a).data('sort') - +$(b).data('sort');
    })
    .appendTo(wrapper);
}


function searchSymm(inputText) {
    let match = [];    // description list
    let allSymm = [];  // store for all sym list

    // loop through all item in the SymmLists (list of dictionary)
    $.each(jsonCommonSymm.SymmLists, function(index, item) {
        allSymm = [];   // clear allSymm when starting a new symmlist is needed
        // loop through all symms in a dictionary
        $.each(item.symm, function(i, symmItem) {
            // if one symm is found to match included in inputText
            // if (inputText.toLowerCase().includes(symmItem)) {
            //     // if (symmItem.toLowerCase().includes(inputText)) {
            //         console.log(symmItem);
            //         console.log(inputText);
            //         match.push(item.description);
            //         console.log(match);
            //         return false; // Exit the inner loop when a match is found
            //     // }
            // }
            // console.log(symmItem.toLowerCase().indexOf(inputText.toLowerCase()))
            if (symmItem.toLowerCase().indexOf(inputText.toLowerCase())!==-1) {
                match.push(item.description);
                return false; // Exit the inner loop when a match is found
            }
        });

        // loop through all symms in a dictionary and store all symms in allSymm
        $.each(item.symm, function(i, symmItem) {
            allSymm.push(symmItem.toUpperCase());
        });
        
        // check if match found
        if (match.length > 0) {
            // exist the loop of SymmLists if one match has been found
            return false; // Exit the inner loop when a match is found
        } else {
            // clear allSymm when no match is found in the all the symms
            allSymm = [];
        };
    });
    // always add the inputText to allSymm
    //   if no symms found only inputText is in allSymm
    //   if symms is found all symms in the dictionary will be included in the allSymm alongside the inputText
    allSymm.push(inputText)

    return allSymm
}


function searchSelected() {

    $('.row.item').show();

    $('.filterInput').each(function() {
        let searchValue = $(this).val().toUpperCase();
        if (searchValue.length > 0) {
            let allSymm = searchSymm(searchValue);
            console.log(allSymm)
            $('.row.item').each(function () {
                let dataVal = $(this).text();
                let indexSum = 0
                for (var i = 0; i < allSymm.length; i++) {
                    let index = dataVal.toUpperCase().indexOf(allSymm[i])
                    indexSum += index
                }
                if (indexSum == -1*allSymm.length) {
                    $(this).hide();
                }
                // if (dataVal.toUpperCase().indexOf(searchValue) < 0) {
                //     $(this).hide();
                // }
            });
        }
    });

    $('select.filterSelect').each(function () {
        let searchOption = $(this).attr('id');
        let searchValue = $(this).find('option:selected').val();

        if (searchValue > 0) {
            $('.row.item').each(function () {
                let dataVal = $(this).data(searchOption);
                let parts = String(dataVal).split(",");
                if (!parts.includes(searchValue)) {
                    $(this).hide();
                }
            });
        }
    });
}


// function to read json
function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

var jsonCommonSymm; // Global declare a variable
$.ajax({
    url: 'cefi_list_search_commonSym.json',
    dataType: 'json',
    success: function (data) {
        jsonCommonSymm = data; // Assign the parsed JSON data to the variable
    },
    error: function (error) {
        console.error('There was a problem with the request:', error);
    }
});




// $('#cefi_list_search').on('shown.bs.tab', function (e) {
$(document).ready(function () {
        readTextFile("cefi_list.json", function(text){
            datajson = JSON.parse(text);
            items = datajson.lists;

            drawTableRows();
            createTextFilter('textFilter', 'Text Filter', 5);
            // createSelect('ctype', ctypes, 'Type of Analysis', 5);
            createSelect('cdata', cdata, 'Dataset', 5);
            createSelect('cvar', cvars, 'Variable', 3);
            createSelect('ctime', ctime, 'Time Scale', 2);
            // createSelect('crange', crange, 'Time Range', 2);
            createSelect('cproduct', cproduct, 'Product Type', 2);
            createSelect('ctopics', ctopics, 'Topics', 2);
            createSelect('cplatforms', cplatforms, 'Observing Platform', 2);
            createSelect('cregions', cregions, 'Regions', 2);
            createSelect('corgs', corgs, 'Organizations', 2);					

            // Event binding for tab shown event
            $('a[href="#cefi_list_search"]').on('shown.bs.tab', function (e) {
            // $('#cefi_list_search').on('shown.bs.tab', function (e) {
                $('input.filterInput').keyup(searchSelected);
                $('select.filterSelect').change(searchSelected);
            });

            // Check if the tab is opened directly
            if ($("#cefi_list_searchTab").hasClass("active")) {
                $('input.filterInput').keyup(searchSelected);
                $('select.filterSelect').change(searchSelected);
            };
        });

        $('#toggleCheckBox').on('change', function() {
            if (this.checked) {
                $("a").attr("target", "_blank");
                console.log('checked add target')
                // Your code for when the checkbox is checked asynchronously
            } else {
                $("a").attr("target", "_self");
                console.log('unchecked change target')
                // Your code for when the checkbox is unchecked asynchronously
            }
        });
});
// });

