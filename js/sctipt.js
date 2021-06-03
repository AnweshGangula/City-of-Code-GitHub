window.onload = function () {
    // Trigger button click(Update_Text()) on hitting Enter in input field
    var input_field = document.getElementById("user_input");

    // Execute a function when the user releases a key on the keyboard
    input_field.addEventListener("keyup", function (event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.key === "Enter") {
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click
            document.getElementById("submit_button").click();
        }
    });
}