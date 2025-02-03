// $(document).ready(function(){
//     $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
//       var target = $(e.target).attr("href"); // activated tab
//       $('#cefiPortalTabs > li').removeClass('active');
//       $('#cefiPortalTabs a[href="' + target + '"]').parent().addClass('active');
//     });
//   });

var defaultRegion = 'northwest_atlantic';

$(document).ready(function() {
    // Listen for changes in the radio buttons
    $('input[name="regionOptions"]').change(function() {
        // Get the ID of the selected label
        var labelId = $(this).next('label').attr('for');
        console.log('Portal default region :', labelId);
        // change all regions to the radio options
        // chooseDefaultRegion('reg-mom-cobalt',labelId)
    });
});

// slow animate transition to CEFI detail info
$(document).ready(function(){
    $("#detailCEFIButton").click(function() {
        $('html, body').animate({
            scrollTop: $("#detailCEFI").offset().top
        }, 1000);
    });
});

// function for create option for general options
function chooseDefaultRegion(selectClass,defaultValue) {
    let elms = document.getElementsByClassName(selectClass);
    // loop through all region dropdown with the selectClassName
    for(let i = 0; i < elms.length; i++) {
        // Set the default option based on the option value
        elms[i].value = defaultValue
    }
};




