// Light/dark mode. Follows the system setting until you click the
// toggle; after that your choice is remembered in this browser.
(function () {
  var root = document.documentElement;
  var media = window.matchMedia("(prefers-color-scheme: dark)");

  function saved() {
    try { return localStorage.getItem("theme"); } catch (e) { return null; }
  }

  function current() {
    return saved() || (media.matches ? "dark" : "light");
  }

  // Runs in <head> so the page never flashes the wrong theme.
  if (saved()) root.setAttribute("data-theme", saved());

  document.addEventListener("DOMContentLoaded", function () {
    var nav = document.querySelector("header nav");
    if (!nav) return;

    var button = document.createElement("button");
    button.className = "theme-toggle";
    button.type = "button";

    function update() {
      var dark = current() === "dark";
      button.textContent = dark ? "☀" : "☾"; // sun or moon
      button.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
      button.title = button.getAttribute("aria-label");
    }

    button.addEventListener("click", function () {
      var next = current() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      update();
    });

    media.addEventListener("change", update);
    nav.appendChild(button);
    update();
  });
})();
