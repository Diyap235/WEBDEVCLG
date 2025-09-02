document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const email = document.querySelector("input[type='email']").value.trim();
  const password = document.querySelector("input[type='password']").value.trim();

  if (email === "" || password === "") {
    alert("Please fill in all fields.");
  } else {
    alert("Login successful!");
    // Add real login logic here or redirect
  }
});


