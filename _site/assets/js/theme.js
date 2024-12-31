document.addEventListener("DOMContentLoaded", function () {
    const isDark = localStorage.getItem("darkTheme") === "true";
    if (isDark) {
        document.querySelector("body").classList.add("dark-theme");
        document.getElementById("theme-toggle").innerHTML = "☀️ Light";
    }
});

function toggleTheme() {
    const body = document.querySelector("body");
    const button = document.getElementById("theme-toggle");
    const isDark = body.classList.toggle("dark-theme");

    button.innerHTML = isDark ? "☀️ Light" : "🌙 Dark'"
    localStorage.setItem("darkTheme", isDark);
}
