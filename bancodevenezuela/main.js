(function () {
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.querySelector(".main-nav");
  var track = document.querySelector(".slides");
  var slides = Array.prototype.slice.call(document.querySelectorAll(".slide"));
  var dots = Array.prototype.slice.call(document.querySelectorAll(".dots button"));
  var index = 0;
  var timer = 0;

  function setExpanded(button, open) {
    if (button) button.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function closeMenus(except) {
    var opened = document.querySelectorAll(".nav-item.open, .banca.open");
    Array.prototype.forEach.call(opened, function (el) {
      if (el === except) return;
      el.classList.remove("open");
      setExpanded(el.querySelector("button"), false);
    });
  }

  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    setExpanded(toggle, open);
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  });

  Array.prototype.forEach.call(document.querySelectorAll(".nav-link, .banca-btn"), function (btn) {
    btn.addEventListener("click", function (event) {
      event.stopPropagation();
      var item = btn.parentElement;
      var willOpen = !item.classList.contains("open");
      closeMenus(item);
      item.classList.toggle("open", willOpen);
      setExpanded(btn, willOpen);
    });
  });

  document.addEventListener("click", function (event) {
    if (!event.target.closest(".nav-item") && !event.target.closest(".banca")) closeMenus();
  });

  Array.prototype.forEach.call(nav.querySelectorAll("a"), function (link) {
    link.addEventListener("click", function () {
      nav.classList.remove("open");
      setExpanded(toggle, false);
      toggle.setAttribute("aria-label", "Abrir menú");
      closeMenus();
    });
  });

  function go(next) {
    index = (next + slides.length) % slides.length;
    track.style.transform = "translateX(-" + index * 100 + "%)";
    dots.forEach(function (dot, dotIndex) {
      if (dotIndex === index) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
  }

  function stop() {
    window.clearInterval(timer);
  }

  function start() {
    stop();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    timer = window.setInterval(function () { go(index + 1); }, 6500);
  }

  document.querySelector(".slider-btn.prev").addEventListener("click", function () {
    go(index - 1);
    start();
  });
  document.querySelector(".slider-btn.next").addEventListener("click", function () {
    go(index + 1);
    start();
  });
  dots.forEach(function (dot, dotIndex) {
    dot.addEventListener("click", function () {
      go(dotIndex);
      start();
    });
  });

  var hero = document.querySelector(".hero");
  hero.addEventListener("mouseenter", stop);
  hero.addEventListener("mouseleave", start);
  start();

  var gTrack = document.querySelector(".galeria-track");
  var cards = Array.prototype.slice.call(document.querySelectorAll(".vid"));
  var gIndex = 0;

  function perView() {
    if (window.innerWidth < 760) return 1;
    if (window.innerWidth < 1100) return 2;
    return 3;
  }

  function galGo(next) {
    var max = Math.max(0, cards.length - perView());
    gIndex = Math.min(Math.max(0, next), max);
    var width = cards[0].getBoundingClientRect().width + 16;
    gTrack.style.transform = "translateX(-" + gIndex * width + "px)";
  }

  document.querySelector(".gal-prev").addEventListener("click", function () { galGo(gIndex - 1); });
  document.querySelector(".gal-next").addEventListener("click", function () { galGo(gIndex + 1); });
  window.addEventListener("resize", function () { galGo(gIndex); });

  var modal = document.querySelector(".modal");
  var modalImg = document.querySelector("#modal-img");
  var modalTitle = document.querySelector("#modal-title");
  var modalText = document.querySelector("#modal-text");
  var lastFocus = null;

  function openModal(data) {
    lastFocus = document.activeElement;
    modalImg.src = data.img || "";
    modalImg.alt = data.title || "";
    modalTitle.textContent = data.title || "";
    modalText.textContent = data.text || "";
    modal.hidden = false;
    document.body.classList.add("lock");
    modal.querySelector(".modal-close").focus();
  }

  function closeModal() {
    if (modal.hidden) return;
    modal.hidden = true;
    modalImg.src = "";
    document.body.classList.remove("lock");
    if (lastFocus) lastFocus.focus();
  }

  Array.prototype.forEach.call(document.querySelectorAll("[data-modal]"), function (el) {
    el.addEventListener("click", function () { openModal(el.dataset); });
  });

  modal.querySelector(".modal-close").addEventListener("click", closeModal);
  modal.addEventListener("click", function (event) {
    if (event.target === modal) closeModal();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeModal();
    if (!modal.hidden) return;
    if (event.key === "ArrowRight" && document.activeElement === document.body) go(index + 1);
    if (event.key === "ArrowLeft" && document.activeElement === document.body) go(index - 1);
  });
})();
