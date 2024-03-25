// Listen for newscard clicking
$('div.newsContainerDiv > a[href^="#"]').on('click', function (e) {
    e.preventDefault();
    
    // Get the target tab's ID from the href attribute
    var targetTabId = $(this).attr('href');
    console.log(targetTabId)

    $('li').removeClass('active');
    $('a[href="' + targetTabId + '"]').parent().addClass('active')

});


$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    var target = $(e.target).attr("href") // activated tab
    window.location.hash = $(e.target).attr('href');
    // console.log(target);
});




// // Parse query parameters from the URL
// var urlParams = new URLSearchParams(window.location.search);
// var targetTab = urlParams.get("tab");

// // If a valid target tab is specified in the query parameters, activate it
// if (targetTab) {
//     // $(`[data-target="${targetTab}"]`).tab("show");
//     $(targetTab).tab("show");
// }

// // Listen for click events on navigation links
// $(".nav-link[data-toggle='tab']").on("click", function () {
//     // Get the data-target attribute to identify the target tab
//     targetTab = $(this).attr("href");

//     // Update the URL query parameter
//     window.history.pushState({}, "", `?tab=${targetTab}`);
// });




