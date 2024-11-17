document.addEventListener("DOMContentLoaded", function () {
    const isDark = localStorage.getItem("darkTheme") === "true";
    if (isDark) {
        document.querySelector("body").classList.add("dark-theme");
        document.getElementById("theme-toggle").innerHTML = "☀️ Light";
    }
});
