(function () {
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".menu-toggle");
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".tab"));
  var megas = {
    personas: document.querySelector("#menu-personas"),
    empresas: document.querySelector("#menu-empresas")
  };
  var track = document.querySelector(".slides");
  var slides = Array.prototype.slice.call(document.querySelectorAll(".slide"));
  var dots = Array.prototype.slice.call(document.querySelectorAll(".dots button"));
  var index = 0;
  var timer = 0;
  var modal = document.querySelector(".modal");
  var lastFocus = null;

  var catalog = [
    ["agencia sucursal ubicar cajero", "agencias", "Agencias operativas"],
    ["pos punto venta afiliado comercio nativa", "empresas", "Afiliado comercial y POS"],
    ["tarjeta descuento visa mastercard", "tarjetas", "Tarjetas y descuentos"],
    ["innova emprendimiento", "creditos", "Banesco Innova y créditos"],
    ["todoticket alimentacion", "servicios", "Todoticket y servicios"],
    ["limite pagomovil tasa cambio divisa", "tasas", "Tasas y límites"],
    ["cuenta ahorro verde pension", "cuentas", "Cuentas y planes"],
    ["credito credimujer carro agricola", "creditos", "Créditos"],
    ["app movil banescOnline pago", "digital", "Banca digital"],
    ["empleo trabajo vacante", "empleos", "Empleos"],
    ["libro biblioteca", "biblioteca", "Biblioteca Digital"],
    ["seguridad clave viaje", "seguridad", "Seguridad"],
    ["ayuda contacto reclamo defensor", "ayuda", "Contáctanos"],
    ["empresa nomina fideicomiso", "empresas", "Empresas"],
    ["privada premio", "privada", "Banca Privada"],
    ["banca linea clave ingreso", "banca", "Banca en Línea"]
  ];

  function showView(id) {
    var next = document.querySelector("#view-" + id);
    if (!next) return;
    Array.prototype.forEach.call(document.querySelectorAll(".view"), function (view) {
      view.hidden = view !== next;
      view.classList.toggle("active", view === next);
    });
    var tab = next.getAttribute("data-tab");
    tabs.forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-menu") === tab);
    });
    closeMenus();
    header.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
    window.scrollTo(0, 0);
    if (id === "home") {
      var field = document.querySelector("#q");
      if (document.activeElement && document.activeElement.id === "open-search") field.focus();
    }
  }

  function closeMenus(except) {
    Object.keys(megas).forEach(function (key) {
      var open = key === except;
      megas[key].hidden = !open;
      var btn = document.querySelector('.tab[data-menu="' + key + '"]');
      if (btn) btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  toggle.addEventListener("click", function () {
    var open = header.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    if (!open) closeMenus();
  });

  tabs.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var key = btn.getAttribute("data-menu");
      var willOpen = megas[key].hidden;
      closeMenus(willOpen ? key : null);
      if (window.innerWidth <= 980) header.classList.add("nav-open");
    });
  });

  var country = document.querySelector(".country-wrap");
  document.querySelector(".country-btn").addEventListener("click", function (event) {
    event.stopPropagation();
    var open = country.classList.toggle("open");
    event.currentTarget.setAttribute("aria-expanded", open ? "true" : "false");
  });

  document.addEventListener("click", function (event) {
    if (!event.target.closest(".country-wrap")) {
      country.classList.remove("open");
    }
    if (!event.target.closest(".site-header")) closeMenus();
  });

  document.querySelector(".promo-x").addEventListener("click", function () {
    document.querySelector(".promo-bar").hidden = true;
  });

  document.addEventListener("click", function (event) {
    var trigger = event.target.closest("[data-view]");
    if (!trigger) return;
    event.preventDefault();
    showView(trigger.getAttribute("data-view"));
  });

  document.querySelector("#open-search").addEventListener("click", function () {
    showView("home");
    document.querySelector("#q").focus();
  });

  function go(next) {
    index = (next + slides.length) % slides.length;
    track.style.transform = "translateX(-" + (index * 100) + "%)";
    hero.setAttribute("data-theme", slides[index].classList.contains("slide-dani") ? "light" : "dark");
    dots.forEach(function (dot, dotIndex) {
      if (dotIndex === index) dot.setAttribute("aria-current", "true");
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
  dots.forEach(function (dot, dotIndex) {
    dot.addEventListener("click", function () { go(dotIndex); start(); });
  });
  var hero = document.querySelector(".hero");
  go(0);
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
  modal.addEventListener("click", function (event) {
    if (event.target === modal) closeModal();
  });

  var results = document.querySelector("#results");
  var query = document.querySelector("#q");

  function search(value) {
    var text = value.trim().toLowerCase();
    results.innerHTML = "";
    if (text.length < 2) {
      results.hidden = true;
      return;
    }
    var found = catalog.filter(function (item) {
      return item[0].indexOf(text) !== -1 || item[2].toLowerCase().indexOf(text) !== -1;
    }).slice(0, 6);
    if (!found.length) {
      results.hidden = false;
      results.innerHTML = "<p class=\"bubble bot\">No hay una sección con esas palabras. Prueba con cuenta, tarjeta, crédito o agencia.</p>";
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

  var panel = document.querySelector(".dani-panel");
  var log = document.querySelector("#dani-log");
  var launcher = document.querySelector(".dani-launcher");

  function say(text, who) {
    var bubble = document.createElement("div");
    bubble.className = "bubble " + who;
    bubble.textContent = text;
    log.appendChild(bubble);
    log.scrollTop = log.scrollHeight;
  }

  function openDani() {
    panel.hidden = false;
    launcher.setAttribute("aria-expanded", "true");
    if (!log.childElementCount) {
      say("Hola, soy Dani. Pregúntame por cuentas, tarjetas, créditos, PagoMóvil o agencias.", "bot");
    }
    document.querySelector("#dani-q").focus();
  }

  function reply(text) {
    var q = text.toLowerCase();
    if (q.indexOf("credito") !== -1 || q.indexOf("crédito") !== -1 || q.indexOf("carro") !== -1) {
      return "Puedes ver ExtraCrédito, CrédiMujer, CrediCarro, microcréditos y el crédito agrícola en la sección Créditos. La tasa del día no está en esta maqueta.";
    }
    if (q.indexOf("cuenta") !== -1) return "En Cuentas y Planes están la Cuenta Verde, ahorro, corriente, pensionados y Mi Primer Plan.";
    if (q.indexOf("tarjeta") !== -1) return "Hay crédito Visa y MasterCard, débito Maestro y descuentos al pagar. Ábrelas en Tarjetas.";
    if (q.indexOf("pago") !== -1) return "PagoMóvil, BanescoMóvil y BanescOnline están en Banca Digital. Los límites del día se consultan en el tablero oficial.";
    if (q.indexOf("agencia") !== -1 || q.indexOf("ubic") !== -1) return "Preparé zonas de ejemplo: Caracas, Miranda, Zulia, Carabobo, Lara y Anzoátegui. Las direcciones reales están en el sitio oficial.";
    if (q.indexOf("hola") !== -1 || q.indexOf("dani") !== -1) return "Aquí estoy. Cuéntame qué producto quieres mostrar.";
    return "Puedo orientarte dentro de esta maqueta. Prueba con crédito, cuenta, tarjeta o agencia.";
  }

  launcher.addEventListener("click", openDani);
  document.querySelector("#open-dani-hero").addEventListener("click", openDani);
  document.querySelector("#open-dani-foot").addEventListener("click", openDani);
  document.querySelector(".dani-close").addEventListener("click", function () {
    panel.hidden = true;
    launcher.setAttribute("aria-expanded", "false");
    launcher.focus();
  });
  document.querySelector("#dani-form").addEventListener("submit", function (event) {
    event.preventDefault();
    var field = document.querySelector("#dani-q");
    var text = field.value.trim();
    if (!text) return;
    say(text, "me");
    field.value = "";
    window.setTimeout(function () { say(reply(text), "bot"); }, 280);
  });

  document.querySelector("#login-form").addEventListener("submit", function (event) {
    event.preventDefault();
    event.currentTarget.reset();
  });

  document.querySelector("#contact-form").addEventListener("submit", function (event) {
    event.preventDefault();
    document.querySelector("#contact-note").hidden = false;
    event.currentTarget.reset();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeModal();
      closeMenus();
      panel.hidden = true;
      country.classList.remove("open");
    }
  });

  if (location.hash) {
    var id = location.hash.replace("#", "");
    if (document.querySelector("#view-" + id)) showView(id);
  }
})();
