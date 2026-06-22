// Système de changement de langue (FR/EN/ES/DE) sans rechargement de page.
// Dépend de window.MAIJ_TRANSLATIONS défini dans translations.js.

(function () {
  var STORAGE_KEY = "maij-lang";
  var DEFAULT_LANG = "fr";

  function getDict(lang) {
    var dicts = window.MAIJ_TRANSLATIONS || {};
    return dicts[lang] || dicts[DEFAULT_LANG] || {};
  }

  function translate(key, lang) {
    var dict = getDict(lang || getCurrentLang());
    return dict[key] !== undefined ? dict[key] : key;
  }

  function getCurrentLang() {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
  }

  function applyTranslations(lang) {
    var dict = getDict(lang);

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (dict[key] !== undefined) el.textContent = dict[key];
    });

    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-html");
      if (dict[key] !== undefined) el.innerHTML = dict[key];
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-placeholder");
      if (dict[key] !== undefined) el.setAttribute("placeholder", dict[key]);
    });

    document.querySelectorAll("[data-i18n-alt]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-alt");
      if (dict[key] !== undefined) el.setAttribute("alt", dict[key]);
    });

    document.querySelectorAll("[data-i18n-aria-label]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-aria-label");
      if (dict[key] !== undefined) el.setAttribute("aria-label", dict[key]);
    });

    var titleEl = document.querySelector("title[data-i18n-title]");
    if (titleEl) {
      var titleKey = titleEl.getAttribute("data-i18n-title");
      if (dict[titleKey] !== undefined) document.title = dict[titleKey];
    }

    var metaDesc = document.querySelector('meta[name="description"][data-i18n-content]');
    if (metaDesc) {
      var descKey = metaDesc.getAttribute("data-i18n-content");
      if (dict[descKey] !== undefined) metaDesc.setAttribute("content", dict[descKey]);
    }

    document.documentElement.setAttribute("lang", lang);
    document.querySelectorAll(".lang-select").forEach(function (select) {
      select.value = lang;
    });

    localStorage.setItem(STORAGE_KEY, lang);
  }

  document.addEventListener("DOMContentLoaded", function () {
    applyTranslations(getCurrentLang());

    document.querySelectorAll(".lang-select").forEach(function (select) {
      select.addEventListener("change", function () {
        applyTranslations(this.value);
      });
    });
  });

  // Exposé pour un usage ponctuel en JS (ex : message de confirmation du formulaire).
  window.maijT = translate;
})();
