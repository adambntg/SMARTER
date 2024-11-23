document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();
    const messageDiv = document.getElementById("message");

    if (response.ok) {
      messageDiv.innerHTML = "<p>Login successful! Redirecting...</p>";
      messageDiv.style.color = "green";

      // Redirect ke landing.html setelah 1 detik
      setTimeout(() => {
        window.location.href = "landing.html";
      }, 1000);
    } else {
      messageDiv.innerHTML = `<p>Error: ${result.message}</p>`;
      messageDiv.style.color = "red";
    }
  });
