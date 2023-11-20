// Ensure the document is fully loaded before executing the code
$(document).ready(function() {
    // Attach a click event listener to the entire document
    $(document).on("click", function(event) {
        // Check if the clicked element is not within the specified dropdowns
        if (!$(event.target).closest('#myDropdown, #dropdown-menu').length) {
            // If not, hide the dropdown menu
            $("#myDropdown").hide();
        }
    });

    // Attach a click event listener to the dropdown menu
    $("#dropdown-menu").on("click", function(event) {
        // Prevent the click event from propagating up the DOM to avoid triggering the document click event
        event.stopPropagation();
        // Call the menuFunction when dropdown-menu is clicked
        menuFunction();
    });

    // Define the menuFunction
    function menuFunction() {
        // Select the #myDropdown element
        var dropdown = $("#myDropdown");
        // Get the current display style of the #myDropdown
        var displayStyle = dropdown.css("display");

        // Toggle the display style between "flex" and "none"
        if (displayStyle === "none") {
            dropdown.css("display", "flex");
        } else {
            dropdown.css("display", "none");
        }
    }
});