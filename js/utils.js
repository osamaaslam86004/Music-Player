// utils.js
const MyNamespace = {

    alertInfoFunction: function (message) {
        console.log("Alert message function called with message:", message);
        let alert = document.getElementById('alert_info');
        alert.querySelector('#alert-info-strong').textContent = message;
        // alert.innerHTML = message;
        alert.style.display = 'block';
    },

    closeAlert: function (event) {
        event.preventDefault();
        let alert = document.getElementById('alert_info');
        alert.style.display = 'none';
    },
};


