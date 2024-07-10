// Listen for newscard clicking
$('div.newsContainerDiv > a[href^="#"]').on('click', function (e) {
    e.preventDefault();
    
    // Get the target tab's ID from the href attribute
    var targetTabId = $(this).attr('href');
    console.log(targetTabId)

    $('li').removeClass('active');
    $('a[href="' + targetTabId + '"]').parent().addClass('active')

    // This prevents the page from scrolling down to where it was previously.
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    // This is needed if the user scrolls down during page load and you want to make sure the page is scrolled to the top once it's fully loaded. This has Cross-browser support.
    window.scrollTo(0,0);

});


$(document).ready(function() {
    $('a[data-toggle="tab"]').on('show.bs.tab', function(e) {
        const activeTabId = $(e.target).attr('href');
        localStorage.setItem('activeTab', activeTabId);
    });

    var activeTabStore = localStorage.getItem('activeTab');
    if (activeTabStore) {
        $(activeTabStore).tab('show');
    }
});

// old code that will have the hash in the url but somehow casuing the page to scroll down automatcally
// $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
//     var target = $(e.target).attr("href") // activated tab
//     window.location.hash = $(e.target).attr('href');
//     // console.log(target);
// });



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




