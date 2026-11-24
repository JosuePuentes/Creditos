(function (global) {
  var KEY = "creditos_admin_session";
  var SUPER_ADMIN = {
    usuario: "superadmin",
    clave: "Cr3ditos#Admin26"
  };

  var TEST_ACCOUNTS = [
    {
      banco: "Login Admin",
      usuario: "superadmin",
      clave: "Cr3ditos#Admin26",
      nota: "Super admin de este módulo"
    },
    {
      banco: "Banco de Venezuela · BDVenlínea",
      usuario: "demo.bdv",
      clave: "PruebaBDV26",
      nota: "Usuario de demostración"
    },
    {
      banco: "Banesco · BanescOnline",
      usuario: "demo.banesco",
      clave: "PruebaBan26",
      nota: "Usuario de demostración"
    },
    {
      banco: "Mercantil · Mercantil en Línea",
      usuario: "demo.mercantil",
      clave: "PruebaMer26",
      nota: "Usuario de demostración"
    }
  ];

  function login(usuario, clave) {
    if (usuario === SUPER_ADMIN.usuario && clave === SUPER_ADMIN.clave) {
      sessionStorage.setItem(KEY, JSON.stringify({
        usuario: SUPER_ADMIN.usuario,
        rol: "superadmin",
        at: Date.now()
      }));
      return true;
    }
    return false;
  }

  function logout() {
    sessionStorage.removeItem(KEY);
  }

  function isLoggedIn() {
    try {
      var raw = sessionStorage.getItem(KEY);
      if (!raw) return false;
      var data = JSON.parse(raw);
      return !!(data && data.usuario === SUPER_ADMIN.usuario && data.rol === "superadmin");
    } catch (error) {
      return false;
    }
  }

  function currentUser() {
    try {
      return JSON.parse(sessionStorage.getItem(KEY) || "null");
    } catch (error) {
      return null;
    }
  }

  function testAccounts() {
    return TEST_ACCOUNTS.slice();
  }

  global.CreditosAuth = {
    login: login,
    logout: logout,
    isLoggedIn: isLoggedIn,
    currentUser: currentUser,
    testAccounts: testAccounts
  };
})(window);
