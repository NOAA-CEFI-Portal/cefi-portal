const delay = ms => new Promise(res => setTimeout(res, ms));


$(".navDropdown").on('click',async function() {
    await delay(10); // wait 5 ms for the boostrap code to work and execute the rest

    $(".navDropdown").parent().closest('li.dropdown').each(function() {
        if ($(this).hasClass('open')) {
            $(this).children('.navDropdown').children('span.hoverLabel').addClass('hidden')
        } else {
            $(this).children('.navDropdown').children('span.hoverLabel').removeClass('hidden')
        }
    })
    
    // var dropDownMenuID = $(this).attr('id')
    // var dropDownTab = $('#'+dropDownMenuID).parent().closest('li.dropdown');

    // await delay(100); // wait 5 ms for the boostrap code to work and execute the rest

    // if (dropDownTab.hasClass('open')) {
    //     $('#'+dropDownMenuID).children('span.hoverLabel').addClass('hidden')
    //     console.log('The element has the class "open".');
    // } else {
    //     $('#'+dropDownMenuID).children('span.hoverLabel').removeClass('hidden')
    //     console.log('The element does not have the class "open".');
    // }

    // var dropDownTabs = $(".navDropdown").parent().closest('li.dropdown');

    
    // var isExpanded = $("#dropdownMaps").attr("aria-expanded");
    // // console.log('aria-expanded is'+isExpanded);
    
    // // the false and true is lagging the click so the logic is reversed
    // if (isExpanded === "true") {
    //     $(this).children('span.hoverLabel').addClass('hidden')
    // } else if (isExpanded === "false") {
    //     $(this).children('span.hoverLabel').removeClass('hidden')
    // } else {
    // console.log("The aria-expanded attribute is not explicitly set.");
    // }
})
