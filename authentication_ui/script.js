function register() {

    let username = document.getElementById("Username").value;
    let password = document.getElementById("Password").value;


    let rule = /^(?=.*\d).{8,}$/;

    if (!rule.test(username)) {
        alert("Username must be at least 8 characters and contain a number.");
        return;
    }

    if (!rule.test(password)) {
        alert("Password must be at least 8 characters and contain a number.");
        return;
    }

    alert("You are now registered!"); 

    window.location.href = "index.html"; 
}