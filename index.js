$(".navDropdown").on('click',function(){
    var isExpanded = $("#dropdownMaps").attr("aria-expanded");
    // console.log('aria-expanded is'+isExpanded);
    
    // the false and true is lagging the click so the logic is reversed
    if (isExpanded === "false") {
        $(this).children('span.hoverLabel').addClass('hidden')
    } else if (isExpanded === "true") {
        $(this).children('span.hoverLabel').removeClass('hidden')
    } else {
    console.log("The aria-expanded attribute is not explicitly set.");
    }
})
