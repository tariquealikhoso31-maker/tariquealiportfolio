// Tarique Ali — portfolio scripts
// Kept small on purpose: menu, theme, photo fallback, project filter, contact form.

document.addEventListener("DOMContentLoaded", function () {

  // ----- mobile menu -----
  var menuBtn = document.querySelector(".menu-btn");
  var navLinks = document.querySelector(".nav-links");
  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open);
      menuBtn.textContent = open ? "✕" : "☰";
    });
  }

  // ----- highlight current page in nav -----
  var page = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(function (a) {
    if (a.getAttribute("href") === page) a.classList.add("active");
  });

  // ----- light / dark theme (remembered) -----
  var themeBtn = document.querySelector(".theme-btn");
  var saved = null;
  try { saved = localStorage.getItem("ta-theme"); } catch (e) {}
  if (saved === "dark") document.documentElement.setAttribute("data-theme", "dark");
  updateThemeIcon();

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var dark = document.documentElement.getAttribute("data-theme") === "dark";
      if (dark) document.documentElement.removeAttribute("data-theme");
      else document.documentElement.setAttribute("data-theme", "dark");
      try { localStorage.setItem("ta-theme", dark ? "light" : "dark"); } catch (e) {}
      updateThemeIcon();
    });
  }
  function updateThemeIcon() {
    if (!themeBtn) return;
    var dark = document.documentElement.getAttribute("data-theme") === "dark";
    themeBtn.textContent = dark ? "☀" : "☾";
    themeBtn.title = dark ? "Light mode" : "Dark mode";
  }

  // ----- profile photo: show initials if images/profile.jpg is missing -----
  document.querySelectorAll(".photo img").forEach(function (img) {
    function fail() { img.parentElement.classList.add("no-img"); }
    img.addEventListener("error", fail);
    if (img.complete && img.naturalWidth === 0) fail();
  });

  // ----- footer year -----
  document.querySelectorAll(".year").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // ----- fade sections in as you scroll -----
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("seen"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("seen"); });
  }

  // ----- project filter -----
  var filterBtns = document.querySelectorAll(".filters button");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      var f = btn.dataset.filter;
      document.querySelectorAll(".project").forEach(function (p) {
        var show = f === "all" || p.dataset.type.indexOf(f) !== -1;
        p.classList.toggle("hide", !show);
      });
    });
  });

  // ----- contact form -----
  // There is no server, so the form checks the fields and then opens
  // the visitor's email app with the message already written.
  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var subject = form.subject.value.trim();
      var message = form.message.value.trim();
      var ok = true;

      setErr("name", name.length < 2 ? "Please write your name." : "");
      setErr("email", !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "This email doesn't look right." : "");
      setErr("message", message.length < 10 ? "A few more words please (10+ characters)." : "");

      function setErr(field, text) {
        document.getElementById("err-" + field).textContent = text;
        if (text) ok = false;
      }
      if (!ok) return;

      var body = message + "\n\n— " + name + " (" + email + ")";
      var link = "mailto:shehziikhosa367@gmail.com" +
        "?subject=" + encodeURIComponent(subject || "Hello from your portfolio") +
        "&body=" + encodeURIComponent(body);

      window.location.href = link;
      document.getElementById("form-msg").textContent =
        "Thanks " + name + "! Your email app should open now — just press send.";
      form.reset();
    });
  }
});
