(function () {
  var rail = document.querySelector("#rail");
  var toggle = document.querySelector(".menu-toggle");
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".tab"));
  var track = document.querySelector(".slides");
  var slides = Array.prototype.slice.call(document.querySelectorAll(".slide"));
  var dots = Array.prototype.slice.call(document.querySelectorAll(".dots button"));
  var index = 0;
  var timer = 0;
  var modal = document.querySelector(".modal");
  var lastFocus = null;
  var catalog = [
    ["cuenta cedula corriente", "cuentas", "Cuenta Corriente Simplificada"],
    ["tarjeta debito mastercard contactless", "tarjetas", "Débito Mastercard"],
    ["credito vivienda", "creditos", "Crédito Social de Vivienda"],
    ["pos punto venta", "pos", "Punto de venta"],
    ["divisa exterior", "divisas", "Envío de Divisas"],
    ["pago servicio portal", "pagos", "Portal de Pagos"],
    ["linea app pago movil", "digital", "Servicios digitales"],
    ["empresa nomina", "empresas", "Empresas"],
    ["oficina cajero", "oficinas", "Oficinas y cajeros"],
    ["tasa limite", "tasas", "Tasas y límites"],
    ["seguridad fraude", "seguridad", "Ciberseguridad"],
    ["cliente hazte", "cliente", "Hazte cliente"],
    ["banca clave", "banca", "Mercantil en Línea"]
  ];

  function showView(id) {
    var next = document.querySelector("#view-" + id);
    if (!next) return;
    Array.prototype.forEach.call(document.querySelectorAll(".view"), function (view) {
      view.hidden = view !== next;
    });
    document.body.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
    window.scrollTo(0, 0);
  }

  function setTab(name) {
    tabs.forEach(function (tab) {
      tab.classList.toggle("active", tab.getAttribute("data-tab") === name);
    });
    Array.prototype.forEach.call(document.querySelectorAll(".acc"), function (acc) {
      var show = acc.getAttribute("data-panel") === name || name === "personas" && acc.getAttribute("data-panel") === "personas";
      if (name === "empresas") show = acc.getAttribute("data-panel") === "empresas";
      acc.hidden = !show;
    });
    if (name === "empresas") showView("empresas");
    if (name === "personas") showView("home");
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () { setTab(tab.getAttribute("data-tab")); });
  });

  toggle.addEventListener("click", function () {
    var open = document.body.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  });

  Array.prototype.forEach.call(document.querySelectorAll(".acc > button"), function (btn) {
    btn.addEventListener("click", function () {
      var sub = btn.nextElementSibling;
      var open = sub.hidden;
      sub.hidden = !open;
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  document.addEventListener("click", function (event) {
    var link = event.target.closest("[data-view]");
    if (!link) return;
    event.preventDefault();
    showView(link.getAttribute("data-view"));
  });

  document.querySelector("#open-search").addEventListener("click", function () {
    showView("home");
    document.querySelector("#q").focus();
  });
  document.querySelector("#access").addEventListener("click", function (event) {
    var on = document.body.classList.toggle("access");
    event.currentTarget.setAttribute("aria-pressed", on ? "true" : "false");
  });

  function go(next) {
    index = (next + slides.length) % slides.length;
    track.style.transform = "translateX(-" + (index * 100) + "%)";
    dots.forEach(function (dot, i) {
      if (i === index) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
  }
  function start() {
    window.clearInterval(timer);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    timer = window.setInterval(function () { go(index + 1); }, 7000);
  }
  document.querySelector(".slider-btn.prev").addEventListener("click", function () { go(index - 1); start(); });
  document.querySelector(".slider-btn.next").addEventListener("click", function () { go(index + 1); start(); });
  dots.forEach(function (dot, i) { dot.addEventListener("click", function () { go(i); start(); }); });
  var hero = document.querySelector(".hero");
  hero.addEventListener("mouseenter", function () { window.clearInterval(timer); });
  hero.addEventListener("mouseleave", start);
  start();

  function openModal(title, text) {
    lastFocus = document.activeElement;
    document.querySelector("#modal-title").textContent = title || "";
    document.querySelector("#modal-text").textContent = text || "";
    modal.hidden = false;
    document.body.classList.add("lock");
    modal.querySelector(".modal-close").focus();
  }
  function closeModal() {
    if (modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove("lock");
    if (lastFocus) lastFocus.focus();
  }
  document.addEventListener("click", function (event) {
    var trigger = event.target.closest("[data-modal]");
    if (!trigger) return;
    openModal(trigger.getAttribute("data-title"), trigger.getAttribute("data-text"));
  });
  modal.querySelector(".modal-close").addEventListener("click", closeModal);
  modal.addEventListener("click", function (event) { if (event.target === modal) closeModal(); });

  var results = document.querySelector("#results");
  var query = document.querySelector("#q");
  function search(value) {
    var text = value.trim().toLowerCase();
    results.innerHTML = "";
    if (text.length < 2) { results.hidden = true; return; }
    var found = catalog.filter(function (item) {
      return item[0].indexOf(text) !== -1 || item[2].toLowerCase().indexOf(text) !== -1;
    }).slice(0, 6);
    if (!found.length) {
      results.hidden = false;
      results.innerHTML = "<p class=\"msg bot\">Prueba con cuenta, tarjeta, crédito o pagos.</p>";
      return;
    }
    found.forEach(function (item) {
      var button = document.createElement("button");
      button.type = "button";
      button.textContent = item[2];
      button.addEventListener("click", function () {
        results.hidden = true;
        query.value = "";
        showView(item[1]);
      });
      results.appendChild(button);
    });
    results.hidden = false;
  }
  query.addEventListener("input", function () { search(query.value); });
  document.querySelector("#finder").addEventListener("submit", function (event) {
    event.preventDefault();
    search(query.value);
    var first = results.querySelector("button");
    if (first) first.click();
  });

  var panel = document.querySelector(".mia-panel");
  var log = document.querySelector("#mia-log");
  function say(text, who) {
    var bubble = document.createElement("div");
    bubble.className = "msg " + who;
    bubble.textContent = text;
    log.appendChild(bubble);
    log.scrollTop = log.scrollHeight;
  }
  function openMia() {
    panel.hidden = false;
    if (!log.childElementCount) say("Hola, soy MIA. Pregúntame por cuentas, tarjetas, créditos o el portal de pagos.", "bot");
    document.querySelector("#mia-q").focus();
  }
  function reply(text) {
    var q = text.toLowerCase();
    if (q.indexOf("crédit") !== -1 || q.indexOf("credit") !== -1 || q.indexOf("vivienda") !== -1) return "El Crédito Social de Vivienda está en Créditos, junto con el personal y el de emprendimiento. La tasa del día no está en esta maqueta.";
    if (q.indexOf("cuenta") !== -1 || q.indexOf("cédula") !== -1 || q.indexOf("cedula") !== -1) return "La Cuenta Corriente Simplificada se abre con la cédula. Puedes verla en Cuentas o en Hazte cliente.";
    if (q.indexOf("tarjeta") !== -1) return "La débito Mastercard Mercantil paga sin contacto. Está en Tarjetas.";
    if (q.indexOf("pago") !== -1) return "En el Portal de Pagos se pagan servicios y se informa el envío de divisas, incluso sin ser cliente.";
    if (q.indexOf("hola") !== -1 || q.indexOf("mia") !== -1) return "Aquí estoy. ¿Qué producto quieres mostrar?";
    return "Puedo orientarte dentro de la maqueta. Prueba con cuenta, tarjeta, crédito o pagos.";
  }
  document.querySelector("#open-mia").addEventListener("click", openMia);
  document.querySelector("#open-mia-foot").addEventListener("click", openMia);
  document.querySelector(".mia-close").addEventListener("click", function () { panel.hidden = true; });
  document.querySelector("#mia-form").addEventListener("submit", function (event) {
    event.preventDefault();
    var field = document.querySelector("#mia-q");
    var text = field.value.trim();
    if (!text) return;
    say(text, "me");
    field.value = "";
    window.setTimeout(function () { say(reply(text), "bot"); }, 250);
  });

  function demo(form, note) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      document.querySelector(note).hidden = false;
      form.reset();
    });
  }
  demo(document.querySelector("#login-form"), "#login-note");
  demo(document.querySelector("#contact-form"), "#contact-note");
  demo(document.querySelector("#cliente-form"), "#cliente-note");

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeModal();
      panel.hidden = true;
      document.body.classList.remove("nav-open");
    }
  });

  setTab("personas");
})();
