$(document).on("click", function(event) {
    if (!$(event.target).closest('#myDropdown, #dropdown-menu').length) {
        $("#myDropdown").hide();
    }
});

$("#dropdown-menu").on("click", function(event) {
    event.stopPropagation();
    menuFunction();
});

function menuFunction() {
    var dropdown = $("#myDropdown");
    var displayStyle = dropdown.css("display");

    if (displayStyle === "none") {
        dropdown.css("display", "flex");
    } else {
        dropdown.css("display", "none");
    }
}