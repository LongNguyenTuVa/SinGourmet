// app.js

$(document).ready(function() {
    // Fetch data from the server and display it
    function fetchData() {
        $.ajax({
            url: '../php/api.php?api=1',
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                const display = $('#dataDisplay');
                if (Array.isArray(response) && response.length > 0) {
                    display.html('<ul>' + response.map(item =>
                        `<li>${item.name} - ${item.description} - ${item.ingredients} - ${item.owner}</li>`
                    ).join('') + '</ul>');
                } else if (response.message) {
                    display.html(`<p>${response.message}</p>`);
                } else {
                    display.html('<p>No data available</p>');
                }
            },
            error: function(xhr, status, error) {
                console.error('Error fetching data:', error);
                $('#dataDisplay').html('<p>Error fetching data. Please try again later.</p>');
            }
        });
    }

    // Handle form submission
    $('#dataForm').submit(function(event) {
        event.preventDefault();
        const formData = $(this).serialize();
        $.ajax({
            url: '../php/api.php?api=1',
            type: 'POST',
            data: formData,
            success: function(response) {
                if (response.message) {
                    alert(response.message);
                } else if (response.error) {
                    alert(response.error);
                }
                fetchData(); // Fetch data again to show the updated list
            },
            error: function(xhr, status, error) {
                console.error('Error submitting data:', error);
            }
        });
    });

    // Initial data fetch
    fetchData();
});
