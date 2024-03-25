datastore_name = 'cefi_portal'
$( function() {

    // remember the last tab used.
    
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            //show selected tab / active
            dataStore.setItem( datastore_name, $(e.target).attr('href')  );
            // console.log("active:" + $(e.target).attr('href'))
        });
    
        //  Define friendly data store name
        var dataStore = window.sessionStorage;
        var oldIndex = -1;
        //  Start magic!
        try {
            // getter: Fetch previous value
            oldIndex = dataStore.getItem(datastore_name);
            // console.log("magic:" + oldIndex);
        } catch(e) {
            // console.log(e);
        }
    
        var hash = location.hash;
        if (hash && hash != '#') {
            // console.log(hash)
            var found_site = "";	
                $('a[data-toggle="tab"]').each(function () {
                    if(hash == $(this)[0]['hash']) {
                        found_site = $(this)[0]['hash'];
                    }
                });
                if(found_site) {
                    $("a[href='"+ found_site + "']").tab("show");	
                }
        } else {
            if ( null === oldIndex) {
                $("a[href='#overview']").tab("show");
            } else {
                $("a[href='" + oldIndex + "']").tab("show");
            }
        }

});

