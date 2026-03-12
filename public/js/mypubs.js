
var brewDisplay = $('.brewery-template');

function deletebrewert() {

    var brewid = $(this).attr('data-index');
    //alert(brewid);
  

    var breurl = `/api/breweries/${brewid}`

    fetch(breurl, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })
        .then(function (response) {
            if (response.ok) {
                document.location.replace('/api/breweries');
            } else {
                alert('Failed to delete brewery');
            }
        });

}

brewDisplay.on('click', '.btn-delete-brewery', deletebrewert);
