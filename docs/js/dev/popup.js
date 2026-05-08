const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./slider.min.js","./swiper.min.js"])))=>i.map(i=>d[i]);
import { h as bodyLock, f as bodyUnlock, b as bodyLockStatus, i as gotoBlock } from "./common.min.js";
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) return;
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) processPreload(link);
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") continue;
      for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
    }
  }).observe(document, {
    childList: true,
    subtree: true
  });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep) return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const scriptRel = "modulepreload";
const assetsURL = function(dep, importerUrl) {
  return new URL(dep, importerUrl).href;
};
const seen = {};
const __vitePreload = function preload(baseModule, deps, importerUrl) {
  let promise = Promise.resolve();
  if (deps && deps.length > 0) {
    let allSettled = function(promises$2) {
      return Promise.all(promises$2.map((p) => Promise.resolve(p).then((value$1) => ({
        status: "fulfilled",
        value: value$1
      }), (reason) => ({
        status: "rejected",
        reason
      }))));
    };
    const links = document.getElementsByTagName("link");
    const cspNonceMeta = document.querySelector("meta[property=csp-nonce]");
    const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
    promise = allSettled(deps.map((dep) => {
      dep = assetsURL(dep, importerUrl);
      if (dep in seen) return;
      seen[dep] = true;
      const isCss = dep.endsWith(".css");
      const cssSelector = isCss ? '[rel="stylesheet"]' : "";
      if (!!importerUrl) for (let i$1 = links.length - 1; i$1 >= 0; i$1--) {
        const link$1 = links[i$1];
        if (link$1.href === dep && (!isCss || link$1.rel === "stylesheet")) return;
      }
      else if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) return;
      const link = document.createElement("link");
      link.rel = isCss ? "stylesheet" : scriptRel;
      if (!isCss) link.as = "script";
      link.crossOrigin = "";
      link.href = dep;
      if (cspNonce) link.setAttribute("nonce", cspNonce);
      document.head.appendChild(link);
      if (isCss) return new Promise((res, rej) => {
        link.addEventListener("load", res);
        link.addEventListener("error", () => rej(/* @__PURE__ */ new Error(`Unable to preload CSS for ${dep}`)));
      });
    }));
  }
  function handlePreloadError(err$2) {
    const e$1 = new Event("vite:preloadError", { cancelable: true });
    e$1.payload = err$2;
    window.dispatchEvent(e$1);
    if (!e$1.defaultPrevented) throw err$2;
  }
  return promise.then((res) => {
    for (const item of res || []) {
      if (item.status !== "rejected") continue;
      handlePreloadError(item.reason);
    }
    return baseModule().catch(handlePreloadError);
  });
};
if (document.querySelector("[data-fls-slider]")) {
  window.addEventListener("load", async () => {
    const sliderModule = await __vitePreload(() => import("./slider.min.js"), true ? __vite__mapDeps([0,1]) : void 0, import.meta.url);
    sliderModule.initSliders?.();
    sliderModule.initSliderFilters?.();
  });
}
class Popup {
  constructor(options) {
    let config = {
      logging: true,
      init: true,
      //Для кнопок
      attributeOpenButton: "data-fls-popup-link",
      // Атрибут для кнопки, яка викликає попап
      attributeCloseButton: "data-fls-popup-close",
      // Атрибут для кнопки, що закриває попап
      // Для сторонніх об'єктів
      fixElementSelector: "[data-fls-lp]",
      // Атрибут для елементів із лівим паддингом (які fixed)
      // Для об'єкту попапа
      attributeMain: "data-fls-popup",
      youtubeAttribute: "data-fls-popup-youtube",
      // Атрибут для коду youtube
      youtubePlaceAttribute: "data-fls-popup-youtube-place",
      // Атрибут для вставки ролика youtube
      setAutoplayYoutube: true,
      // Зміна класів
      classes: {
        popup: "popup",
        // popupWrapper: 'popup__wrapper',
        popupContent: "data-fls-popup-body",
        popupActive: "data-fls-popup-active",
        // Додається для попапа, коли він відкривається
        bodyActive: "data-fls-popup-open"
        // Додається для боді, коли попап відкритий
      },
      focusCatch: true,
      // Фокус усередині попапа зациклений
      closeEsc: true,
      // Закриття ESC
      bodyLock: true,
      // Блокування скролла
      hashSettings: {
        // location: true, // Хеш в адресному рядку
        // goHash: true, // Перехід по наявності в адресному рядку
        location: true,
        // Хеш в адресному рядку
        goHash: true
        // Перехід по наявності в адресному рядку
      },
      on: {
        // Події
        beforeOpen: function() {
        },
        afterOpen: function() {
        },
        beforeClose: function() {
        },
        afterClose: function() {
        }
      }
    };
    this.youTubeCode;
    this.isOpen = false;
    this.targetOpen = {
      selector: false,
      element: false
    };
    this.previousOpen = {
      selector: false,
      element: false
    };
    this.lastClosed = {
      selector: false,
      element: false
    };
    this._dataValue = false;
    this.hash = false;
    this._reopen = false;
    this._selectorOpen = false;
    this.lastFocusEl = false;
    this._focusEl = [
      "a[href]",
      'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
      "button:not([disabled]):not([aria-hidden])",
      "select:not([disabled]):not([aria-hidden])",
      "textarea:not([disabled]):not([aria-hidden])",
      "area[href]",
      "iframe",
      "object",
      "embed",
      "[contenteditable]",
      '[tabindex]:not([tabindex^="-"])'
    ];
    this.options = {
      ...config,
      ...options,
      classes: {
        ...config.classes,
        ...options?.classes
      },
      hashSettings: {
        ...config.hashSettings,
        ...options?.hashSettings
      },
      on: {
        ...config.on,
        ...options?.on
      }
    };
    this.bodyLock = false;
    this.options.init ? this.initPopups() : null;
  }
  initPopups() {
    this.buildPopup();
    this.eventsPopup();
  }
  buildPopup() {
  }
  eventsPopup() {
    document.addEventListener("click", (function(e) {
      const buttonOpen = e.target.closest(`[${this.options.attributeOpenButton}]`);
      if (buttonOpen) {
        e.preventDefault();
        this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton) ? buttonOpen.getAttribute(this.options.attributeOpenButton) : "error";
        if (this._dataValue !== "error") {
          if (!this.isOpen) this.lastFocusEl = buttonOpen;
          this.targetOpen.selector = `${this._dataValue}`;
          this._selectorOpen = true;
          this.open();
          return;
        }
        return;
      }
      const buttonClose = e.target.closest(`[${this.options.attributeCloseButton}]`);
      if (buttonClose || !e.target.closest(`[${this.options.classes.popupContent}]`) && this.isOpen) {
        e.preventDefault();
        this.close();
        return;
      }
    }).bind(this));
    document.addEventListener("keydown", (function(e) {
      if (this.options.closeEsc && e.which == 27 && e.code === "Escape" && this.isOpen) {
        e.preventDefault();
        this.close();
        return;
      }
      if (this.options.focusCatch && e.which == 9 && this.isOpen) {
        this._focusCatch(e);
        return;
      }
    }).bind(this));
    if (this.options.hashSettings.goHash) {
      window.addEventListener("hashchange", (function() {
        if (window.location.hash) {
          this._openToHash();
        } else {
          this.close(this.targetOpen.selector);
        }
      }).bind(this));
      if (window.location.hash) {
        this._openToHash();
      }
    }
  }
  open(selectorValue) {
    if (bodyLockStatus) {
      this.bodyLock = document.documentElement.hasAttribute("data-fls-scrolllock") && !this.isOpen ? true : false;
      if (selectorValue && typeof selectorValue === "string" && selectorValue.trim() !== "") {
        this.targetOpen.selector = selectorValue;
        this._selectorOpen = true;
      }
      if (this.isOpen) {
        this._reopen = true;
        this.close();
      }
      if (!this._selectorOpen) this.targetOpen.selector = this.lastClosed.selector;
      if (!this._reopen) this.previousActiveElement = document.activeElement;
      this.targetOpen.element = document.querySelector(`[${this.options.attributeMain}=${this.targetOpen.selector}]`);
      if (this.targetOpen.element) {
        if (this.options.hashSettings.location) {
          this._getHash();
          this._setHash();
        }
        this.options.on.beforeOpen(this);
        document.dispatchEvent(new CustomEvent("beforePopupOpen", {
          detail: {
            popup: this
          }
        }));
        this.targetOpen.element.setAttribute(this.options.classes.popupActive, "");
        document.documentElement.setAttribute(this.options.classes.bodyActive, "");
        if (!this._reopen) {
          !this.bodyLock ? bodyLock() : null;
        } else this._reopen = false;
        this.targetOpen.element.setAttribute("aria-hidden", "false");
        this.previousOpen.selector = this.targetOpen.selector;
        this.previousOpen.element = this.targetOpen.element;
        this._selectorOpen = false;
        this.isOpen = true;
        setTimeout(() => {
          this._focusTrap();
        }, 50);
        this.options.on.afterOpen(this);
        document.dispatchEvent(new CustomEvent("afterPopupOpen", {
          detail: {
            popup: this
          }
        }));
      }
    }
  }
  close(selectorValue) {
    if (selectorValue && typeof selectorValue === "string" && selectorValue.trim() !== "") {
      this.previousOpen.selector = selectorValue;
    }
    if (!this.isOpen || !bodyLockStatus) {
      return;
    }
    this.options.on.beforeClose(this);
    document.dispatchEvent(new CustomEvent("beforePopupClose", {
      detail: {
        popup: this
      }
    }));
    this.previousOpen.element.removeAttribute(this.options.classes.popupActive);
    this.previousOpen.element.setAttribute("aria-hidden", "true");
    if (!this._reopen) {
      document.documentElement.removeAttribute(this.options.classes.bodyActive);
      !this.bodyLock ? bodyUnlock() : null;
      this.isOpen = false;
    }
    this._removeHash();
    if (this._selectorOpen) {
      this.lastClosed.selector = this.previousOpen.selector;
      this.lastClosed.element = this.previousOpen.element;
    }
    this.options.on.afterClose(this);
    document.dispatchEvent(new CustomEvent("afterPopupClose", {
      detail: {
        popup: this
      }
    }));
    setTimeout(() => {
      this._focusTrap();
    }, 50);
  }
  // Отримання хешу 
  _getHash() {
    if (this.options.hashSettings.location) {
      this.hash = `#${this.targetOpen.selector}`;
    }
  }
  _openToHash() {
    let classInHash = window.location.hash.replace("#", "");
    document.querySelector(`[${this.options.attributeOpenButton}="${classInHash}"]`);
    if (classInHash) this.open(classInHash);
  }
  // Встановлення хеша
  _setHash() {
    history.pushState("", "", this.hash);
  }
  _removeHash() {
    history.pushState("", "", window.location.href.split("#")[0]);
  }
  _focusCatch(e) {
    const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
    const focusArray = Array.prototype.slice.call(focusable);
    const focusedIndex = focusArray.indexOf(document.activeElement);
    if (e.shiftKey && focusedIndex === 0) {
      focusArray[focusArray.length - 1].focus();
      e.preventDefault();
    }
    if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
      focusArray[0].focus();
      e.preventDefault();
    }
  }
  _focusTrap() {
    const focusable = this.previousOpen.element.querySelectorAll(this._focusEl);
    if (!this.isOpen && this.lastFocusEl) {
      this.lastFocusEl.focus();
    } else {
      focusable[0].focus();
    }
  }
}
document.querySelector("[data-fls-popup]") ? window.addEventListener("load", () => window.flsPopup = new Popup({})) : null;
let formValidate = {
  getErrors(form) {
    let error = 0;
    let formRequiredItems = form.querySelectorAll("[required]");
    if (formRequiredItems.length) {
      formRequiredItems.forEach((formRequiredItem) => {
        if ((formRequiredItem.offsetParent !== null || formRequiredItem.tagName === "SELECT") && !formRequiredItem.disabled) {
          error += this.validateInput(formRequiredItem);
        }
      });
    }
    return error;
  },
  validateInput(formRequiredItem) {
    let error = 0;
    if (formRequiredItem.type === "radio") {
      const form = formRequiredItem.closest("form");
      if (!form) return 0;
      const groupName = formRequiredItem.name;
      const safeName = window.CSS && CSS.escape ? CSS.escape(groupName) : groupName.replace(/"/g, '\\"');
      const group = form.querySelectorAll(`input[type="radio"][name="${safeName}"]`);
      const checked = form.querySelector(`input[type="radio"][name="${safeName}"]:checked`);
      if (!checked) {
        group.forEach((r) => {
          this.addError(r);
          this.removeSuccess(r);
        });
        error++;
      } else {
        group.forEach((r) => {
          this.removeError(r);
          this.addSuccess(r);
        });
      }
      return error;
    }
    if (formRequiredItem.type === "email") {
      formRequiredItem.value = formRequiredItem.value.replace(" ", "");
      if (this.emailTest(formRequiredItem)) {
        this.addError(formRequiredItem);
        this.removeSuccess(formRequiredItem);
        error++;
      } else {
        this.removeError(formRequiredItem);
        this.addSuccess(formRequiredItem);
      }
    } else if (formRequiredItem.hasAttribute("data-fls-iti")) {
      if (this.phoneItiTest(formRequiredItem)) {
        this.addError(formRequiredItem);
        this.removeSuccess(formRequiredItem);
        error++;
      } else {
        this.removeError(formRequiredItem);
        this.addSuccess(formRequiredItem);
      }
    } else if (formRequiredItem.type === "checkbox" && !formRequiredItem.checked) {
      this.addError(formRequiredItem);
      this.removeSuccess(formRequiredItem);
      error++;
    } else {
      if (!formRequiredItem.value.trim()) {
        this.addError(formRequiredItem);
        this.removeSuccess(formRequiredItem);
        error++;
      } else {
        this.removeError(formRequiredItem);
        this.addSuccess(formRequiredItem);
      }
    }
    return error;
  },
  rememberItiOriginalParent(formRequiredItem) {
    if (!formRequiredItem || !formRequiredItem.hasAttribute("data-fls-iti")) return null;
    if (!formRequiredItem._itiOriginalParent || formRequiredItem._itiOriginalParent.classList?.contains("iti")) {
      const parent = formRequiredItem.parentElement;
      formRequiredItem._itiOriginalParent = parent?.classList.contains("iti") ? parent.parentElement : parent;
    }
    return formRequiredItem._itiOriginalParent;
  },
  getItiOriginalParent(formRequiredItem) {
    if (!formRequiredItem || !formRequiredItem.hasAttribute("data-fls-iti")) return null;
    return this.rememberItiOriginalParent(formRequiredItem);
  },
  lockItiFocus(formRequiredItem) {
    const originalItiParent = this.getItiOriginalParent(formRequiredItem);
    if (!originalItiParent) return;
    formRequiredItem._itiFocusLocked = true;
    formRequiredItem.dataset.flsItiFocusLocked = "true";
    formRequiredItem.classList.add("--form-focus");
    originalItiParent.classList.add("--form-focus");
  },
  isItiFocusLocked(formRequiredItem) {
    return !!(formRequiredItem && formRequiredItem.hasAttribute("data-fls-iti") && (formRequiredItem._itiFocusLocked || formRequiredItem.dataset.flsItiFocusLocked === "true"));
  },
  restoreItiFocusLocks(scope = document) {
    const inputs = scope.matches?.("[data-fls-iti]") ? [scope] : scope.querySelectorAll("[data-fls-iti]");
    inputs.forEach((input) => {
      if (this.isItiFocusLocked(input) || input.dataset.flsItiReady === "true") {
        this.lockItiFocus(input);
      }
    });
  },
  getStateWrappers(formRequiredItem) {
    const wrappers = [];
    const originalItiParent = this.getItiOriginalParent(formRequiredItem);
    if (originalItiParent) {
      wrappers.push(originalItiParent);
    }
    if (formRequiredItem.parentElement && !wrappers.includes(formRequiredItem.parentElement)) {
      wrappers.push(formRequiredItem.parentElement);
    }
    const iti = formRequiredItem.closest(".iti");
    if (iti) {
      if (!wrappers.includes(iti)) {
        wrappers.push(iti);
      }
      if (iti.parentElement && !wrappers.includes(iti.parentElement)) {
        wrappers.push(iti.parentElement);
      }
    }
    return wrappers;
  },
  addFocus(formRequiredItem) {
    if (formRequiredItem.hasAttribute("data-fls-iti")) {
      this.lockItiFocus(formRequiredItem);
    }
    formRequiredItem.classList.add("--form-focus");
    const wrappers = this.getStateWrappers(formRequiredItem);
    wrappers.forEach((wrapper) => wrapper.classList.add("--form-focus"));
  },
  addError(formRequiredItem) {
    formRequiredItem.classList.add("--form-error");
    const wrappers = this.getStateWrappers(formRequiredItem);
    wrappers.forEach((wrapper) => wrapper.classList.add("--form-error"));
    const selectBody = formRequiredItem.closest(".estimate-select");
    if (selectBody) {
      selectBody.classList.add("--form-error");
    }
    let errorContainer = formRequiredItem.parentElement;
    const iti = formRequiredItem.closest(".iti");
    if (iti && iti.parentElement) {
      errorContainer = iti.parentElement;
    }
    const inputError = errorContainer.querySelector("[data-fls-form-error]");
    if (inputError) errorContainer.removeChild(inputError);
    if (formRequiredItem.dataset.flsFormErrtext) {
      errorContainer.insertAdjacentHTML("beforeend", `<div data-fls-form-error>${formRequiredItem.dataset.flsFormErrtext}</div>`);
    }
  },
  removeError(formRequiredItem) {
    formRequiredItem.classList.remove("--form-error");
    const wrappers = this.getStateWrappers(formRequiredItem);
    wrappers.forEach((wrapper) => wrapper.classList.remove("--form-error"));
    const selectBody = formRequiredItem.closest(".estimate-select");
    if (selectBody) {
      selectBody.classList.remove("--form-error");
    }
    let errorContainer = formRequiredItem.parentElement;
    const iti = formRequiredItem.closest(".iti");
    if (iti && iti.parentElement) {
      errorContainer = iti.parentElement;
    }
    const inputError = errorContainer.querySelector("[data-fls-form-error]");
    if (inputError) {
      errorContainer.removeChild(inputError);
    }
  },
  addSuccess(formRequiredItem) {
    formRequiredItem.classList.add("--form-success");
    const wrappers = this.getStateWrappers(formRequiredItem);
    wrappers.forEach((wrapper) => wrapper.classList.add("--form-success"));
  },
  removeSuccess(formRequiredItem) {
    formRequiredItem.classList.remove("--form-success");
    const wrappers = this.getStateWrappers(formRequiredItem);
    wrappers.forEach((wrapper) => wrapper.classList.remove("--form-success"));
  },
  removeFocus(formRequiredItem) {
    if (this.isItiFocusLocked(formRequiredItem)) {
      this.lockItiFocus(formRequiredItem);
      return;
    }
    formRequiredItem.classList.remove("--form-focus");
    const wrappers = this.getStateWrappers(formRequiredItem);
    wrappers.forEach((wrapper) => wrapper.classList.remove("--form-focus"));
  },
  formClean(form) {
    form.reset();
    setTimeout(() => {
      let inputs = form.querySelectorAll("input,textarea");
      for (let index = 0; index < inputs.length; index++) {
        const el = inputs[index];
        formValidate.removeFocus(el);
        formValidate.removeSuccess(el);
        formValidate.removeError(el);
        if (el.hasAttribute("data-fls-iti")) {
          const itiParent = formValidate.getItiOriginalParent(el);
          if (el.dataset.flsItiReady === "true" && itiParent) {
            itiParent.classList.add("--form-focus");
          }
        }
        el.classList.remove("--input-fill");
        const wrappers = formValidate.getStateWrappers(el);
        wrappers.forEach((wrapper) => wrapper.classList.remove("--input-fill"));
      }
      let checkboxes = form.querySelectorAll('input[type="checkbox"]');
      if (checkboxes.length) {
        checkboxes.forEach((checkbox) => {
          if (!checkbox.hasAttribute("data-default-checked")) {
            checkbox.checked = false;
          }
        });
      }
      if (window["flsSelect"]) {
        let selects = form.querySelectorAll("select[data-fls-select]");
        if (selects.length) {
          selects.forEach((select) => {
            window["flsSelect"].selectBuild(select);
          });
        }
      }
      let fileBlocks = form.querySelectorAll(".form-file");
      if (fileBlocks.length) {
        fileBlocks.forEach((block) => {
          let input = block.querySelector(".form-file__input");
          let textFile = block.querySelector(".form-file__file-name");
          input.value = "";
          block.classList.remove("--file-added");
          textFile.textContent = "";
        });
      }
      let briefUploads = form.querySelectorAll("[data-brief-upload]");
      if (briefUploads.length) {
        briefUploads.forEach((block) => {
          const input = block.querySelector(".brief-upload__input");
          const list = block.querySelector("[data-upload-list]");
          const error = block.querySelector("[data-upload-error]");
          input.value = "";
          if (error) error.classList.remove("--show");
          if (list) list.innerHTML = "";
          block._filesArray = [];
        });
      }
    }, 0);
  },
  emailTest(formRequiredItem) {
    return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(formRequiredItem.value);
  },
  phoneItiTest(formRequiredItem) {
    if (!formRequiredItem || !formRequiredItem.hasAttribute("data-fls-iti")) return false;
    if (!formRequiredItem._iti) return !formRequiredItem.value.trim();
    const value = formRequiredItem.value.trim();
    if (!value) return true;
    if (typeof formRequiredItem._iti.isValidNumber !== "function") return true;
    return !formRequiredItem._iti.isValidNumber();
  }
};
let itiAssetsPromise = null;
function loadIntlTelAssets() {
  if (itiAssetsPromise) return itiAssetsPromise;
  itiAssetsPromise = new Promise((resolve, reject) => {
    const existingCss = document.querySelector("link[data-fls-iti-css]");
    if (!existingCss) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://cdn.jsdelivr.net/npm/intl-tel-input@25.12.1/build/css/intlTelInput.css";
      link.setAttribute("data-fls-iti-css", "");
      document.head.appendChild(link);
    }
    if (window.intlTelInput) {
      resolve(window.intlTelInput);
      return;
    }
    const existingScript = document.querySelector("script[data-fls-iti-js]");
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(window.intlTelInput), { once: true });
      existingScript.addEventListener("error", reject, { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/intl-tel-input@25.12.1/build/js/intlTelInput.min.js";
    script.async = true;
    script.setAttribute("data-fls-iti-js", "");
    script.onload = () => resolve(window.intlTelInput);
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return itiAssetsPromise;
}
function rememberItiOriginalParents(scope = document) {
  const inputs = scope.matches?.("[data-fls-iti]") ? [scope] : scope.querySelectorAll("[data-fls-iti]");
  inputs.forEach((input) => {
    formValidate.rememberItiOriginalParent(input);
  });
}
function addFocusToOriginalParent(scope) {
  const inputs = scope.matches?.("[data-fls-iti]") ? [scope] : scope.querySelectorAll("[data-fls-iti]");
  inputs.forEach((input) => {
    formValidate.addFocus(input);
  });
}
function restoreItiFocusLocks() {
  setTimeout(() => formValidate.restoreItiFocusLocks(), 0);
}
function initSingleIti(input, intlTelInput) {
  if (!input || input.dataset.flsItiReady === "true") return;
  if (!document.documentElement.contains(input)) return;
  formValidate.rememberItiOriginalParent(input);
  const itiInstance = intlTelInput(input, {
    loadUtils: () => __vitePreload(() => import("https://cdn.jsdelivr.net/npm/intl-tel-input@25.12.1/build/js/utils.js"), true ? [] : void 0, import.meta.url),
    initialCountry: "auto",
    strictMode: true,
    // formatAsYouType: true,
    nationalMode: true,
    // autoPlaceholder: 'polite',
    separateDialCode: true,
    useFullscreenPopup: false,
    geoIpLookup: (callback) => {
      fetch("https://ipapi.co/json/").then((res) => res.json()).then((data) => callback((data && data.country_code ? data.country_code : "gb").toLowerCase())).catch(() => callback("gb"));
    }
  });
  input._iti = itiInstance;
  input.dataset.flsItiReady = "true";
  formValidate.lockItiFocus(input);
  const applyItiFocusState = () => {
    formValidate.addFocus(input);
  };
  input.addEventListener("focus", applyItiFocusState);
  input.addEventListener("pointerdown", applyItiFocusState, { passive: true });
  const itiWrapper = input.closest(".iti");
  if (itiWrapper) {
    itiWrapper.addEventListener("pointerdown", applyItiFocusState, { passive: true });
  }
  input.addEventListener("countrychange", () => {
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });
}
async function initItiInScope(scope) {
  const inputs = scope.querySelectorAll('[data-fls-iti]:not([data-fls-iti-ready="true"])');
  if (!inputs.length) return;
  const intlTelInput = await loadIntlTelAssets();
  inputs.forEach((input) => initSingleIti(input, intlTelInput));
}
function initLazyIti() {
  rememberItiOriginalParents();
  if (!document.querySelector("[data-fls-iti]")) return;
  const tryInitFromTarget = async (target) => {
    if (!target?.closest) return;
    const form = target.closest("form");
    if (form && form.querySelector("[data-fls-iti]")) {
      rememberItiOriginalParents(form);
      addFocusToOriginalParent(form);
      await initItiInScope(form);
      return;
    }
    const input = target.closest("[data-fls-iti]") || target.closest(".iti")?.querySelector("[data-fls-iti]");
    if (input) {
      const scope = input.closest("form") || input.parentElement || document;
      rememberItiOriginalParents(scope);
      addFocusToOriginalParent(scope);
      await initItiInScope(scope);
    }
  };
  document.addEventListener("focusin", (e) => {
    tryInitFromTarget(e.target);
    restoreItiFocusLocks();
  }, { capture: true });
  document.addEventListener("pointerdown", (e) => {
    tryInitFromTarget(e.target);
    restoreItiFocusLocks();
  }, { passive: true, capture: true });
  document.addEventListener("click", () => {
    restoreItiFocusLocks();
  }, { passive: true, capture: true });
  document.addEventListener("focusout", () => {
    restoreItiFocusLocks();
  }, { capture: true });
}
function syncItiValuesBeforeSubmit(form) {
  if (!form) return;
  const itiInputs = form.querySelectorAll('[data-fls-iti][data-fls-iti-ready="true"]');
  itiInputs.forEach((input) => {
    if (!input._iti) return;
    const value = input._iti.getNumber();
    if (value) {
      input.value = value;
    }
  });
}
const BRIEF_DB_NAME = "briefUploadsDB";
const BRIEF_DB_VERSION = 1;
const BRIEF_STORE_NAME = "files";
function openBriefDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(BRIEF_DB_NAME, BRIEF_DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(BRIEF_STORE_NAME)) {
        db.createObjectStore(BRIEF_STORE_NAME);
      }
    };
    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
}
function saveBriefFiles(key, files) {
  return openBriefDB().then((db) => {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(BRIEF_STORE_NAME, "readwrite");
      const store = tx.objectStore(BRIEF_STORE_NAME);
      store.put(files, key);
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        reject(tx.error);
      };
    });
  });
}
function loadBriefFiles(key) {
  return openBriefDB().then((db) => {
    return new Promise((resolve) => {
      const tx = db.transaction(BRIEF_STORE_NAME, "readonly");
      const store = tx.objectStore(BRIEF_STORE_NAME);
      const request = store.get(key);
      request.onsuccess = () => {
        resolve(request.result || []);
      };
      request.onerror = () => {
        resolve([]);
      };
      tx.oncomplete = () => {
        db.close();
      };
    });
  });
}
function clearBriefFiles(key) {
  return openBriefDB().then((db) => {
    return new Promise((resolve) => {
      const tx = db.transaction(BRIEF_STORE_NAME, "readwrite");
      const store = tx.objectStore(BRIEF_STORE_NAME);
      store.delete(key);
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        resolve();
      };
    });
  });
}
function formInit() {
  function formSubmit() {
    const forms = document.forms;
    if (forms.length) {
      for (const form of forms) {
        !form.hasAttribute("data-fls-form-novalidate") ? form.setAttribute("novalidate", true) : null;
        form.addEventListener("submit", function(e) {
          const form2 = e.target;
          formSubmitAction(form2, e);
        });
        form.addEventListener("reset", function(e) {
          const form2 = e.target;
          formValidate.formClean(form2);
        });
      }
    }
    async function formSubmitAction(form, e) {
      const error = formValidate.getErrors(form);
      if (error === 0) {
        if (form.dataset.flsForm === "ajax") {
          e.preventDefault();
          syncItiValuesBeforeSubmit(form);
          const formAction = form.getAttribute("action") ? form.getAttribute("action").trim() : "#";
          const formMethod = form.getAttribute("method") ? form.getAttribute("method").trim() : "GET";
          const formData = new FormData(form);
          const uploadBlocksAjax = document.querySelectorAll("[data-brief-upload]");
          uploadBlocksAjax.forEach((block) => {
            const files = block._filesArray || [];
            const input = block.querySelector(".brief-upload__input");
            if (!files.length || !input?.name) return;
            files.forEach((file) => {
              formData.append(input.name, file);
            });
          });
          form.classList.add("--sending");
          const response = await fetch(formAction, {
            method: formMethod,
            body: formData
          });
          if (response.ok) {
            let responseResult = await response.json();
            form.classList.remove("--sending");
            formSent(form, responseResult);
          } else {
            form.classList.remove("--sending");
          }
        } else if (form.dataset.flsForm === "dev") {
          e.preventDefault();
          syncItiValuesBeforeSubmit(form);
          formSent(form);
        }
      } else {
        e.preventDefault();
        if (form.querySelector(".--form-error") && form.hasAttribute("data-fls-form-gotoerr")) {
          const formGoToErrorClass = form.dataset.flsFormGotoerr ? form.dataset.flsFormGotoerr : ".--form-error";
          gotoBlock(formGoToErrorClass);
        }
      }
    }
    function formSent(form, responseResult = ``) {
      document.dispatchEvent(new CustomEvent("formSent", {
        detail: {
          form
        }
      }));
      form.classList.add("--sent");
      setTimeout(() => {
        form.classList.remove("--sent");
      }, 1e4);
      form.classList.remove("--filled-form");
      if (form.dataset.form === "brief") {
        localStorage.removeItem("briefFormState");
        const uploadBlocks2 = document.querySelectorAll("[data-brief-upload]");
        uploadBlocks2.forEach((block) => {
          const input = block.querySelector(".brief-upload__input");
          if (input?.name) {
            clearBriefFiles(input.name);
          }
        });
      }
      formValidate.formClean(form);
      if (form.dataset.form === "brief") {
        const popupBrief = document.querySelector("[data-brief-msg]");
        if (popupBrief) {
          const html = document.documentElement;
          popupBrief.classList.add("--brief-sent");
          popupBrief.setAttribute("aria-hidden", "false");
          html.classList.add("--brief-sent");
          bodyLock();
        }
      }
    }
  }
  function formFieldsInit() {
    document.body.addEventListener("focusin", function(e) {
      const targetElement = e.target;
      if (targetElement.tagName === "INPUT" || targetElement.tagName === "TEXTAREA") {
        if (!targetElement.hasAttribute("data-fls-form-nofocus")) {
          formValidate.addFocus(targetElement);
        }
        targetElement.hasAttribute("data-fls-form-validatenow") ? formValidate.removeError(targetElement) : null;
      }
    });
    document.body.addEventListener("focusout", function(e) {
      const targetElement = e.target;
      if (targetElement.tagName === "INPUT" || targetElement.tagName === "TEXTAREA") {
        if (!targetElement.hasAttribute("data-fls-form-nofocus")) {
          formValidate.removeFocus(targetElement);
        }
        targetElement.hasAttribute("data-fls-form-validatenow") ? formValidate.validateInput(targetElement) : null;
      }
    });
    document.body.addEventListener("input", function(e) {
      const target = e.target;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        if (target.value.trim() !== "") {
          target.classList.add("--input-fill");
          formValidate.getStateWrappers(target).forEach((wrapper) => wrapper.classList.add("--input-fill"));
        } else {
          target.classList.remove("--input-fill");
          formValidate.getStateWrappers(target).forEach((wrapper) => wrapper.classList.remove("--input-fill"));
        }
      }
    });
    document.body.addEventListener("change", function(e) {
      const target = e.target;
      if (!target || target.tagName !== "INPUT") return;
      if (target.type === "radio" || target.type === "checkbox") {
        formValidate.validateInput(target);
      }
    });
  }
  function formRequiredFilledInit() {
    const forms = document.querySelectorAll("[data-fls-form]");
    if (!forms.length) return;
    forms.forEach((form) => {
      const requiredItems = form.querySelectorAll("[required]");
      if (!requiredItems.length) return;
      const checkFormFilled = () => {
        let isFilled = true;
        requiredItems.forEach((item) => {
          if (!isFilled) return;
          if (item.type === "radio") {
            const radioGroup = form.querySelectorAll(`input[type="radio"][name="${item.name}"]`);
            const isRadioChecked = Array.from(radioGroup).some((radio) => radio.checked);
            if (!isRadioChecked) isFilled = false;
            return;
          }
          if (item.type === "checkbox") {
            if (!item.checked) isFilled = false;
            return;
          }
          if (item.type === "file") {
            if (!item.files || !item.files.length) isFilled = false;
            return;
          }
          if (item.value.trim() === "") {
            isFilled = false;
          }
        });
        form.classList.toggle("--filled-form", isFilled);
      };
      form.addEventListener("input", checkFormFilled);
      form.addEventListener("change", checkFormFilled);
      form.addEventListener("reset", () => {
        setTimeout(() => {
          form.classList.remove("--filled-form");
        }, 0);
      });
      checkFormFilled();
    });
  }
  const fileBlocks = document.querySelectorAll(".form-file");
  if (fileBlocks.length) {
    fileBlocks.forEach((fileBlock) => {
      const input = fileBlock.querySelector(".form-file__input");
      const btn = fileBlock.querySelector(".form-file__btn");
      fileBlock.querySelector(".form-file__text");
      const textFile = fileBlock.querySelector(".form-file__file-name");
      if (!input || !btn || !textFile) return;
      btn.addEventListener("click", () => {
        input.click();
      });
      input.addEventListener("change", () => {
        if (input.files && input.files.length > 0) {
          const fileName = input.files[0].name;
          fileBlock.classList.add("--file-added");
          textFile.textContent = fileName;
        } else {
          fileBlock.classList.remove("--file-added");
          textFile.textContent = "";
        }
      });
    });
  }
  const uploadBlocks = document.querySelectorAll("[data-brief-upload]");
  if (uploadBlocks.length) {
    const MAX_SIZE = 10 * 1024 * 1024;
    uploadBlocks.forEach((block) => {
      block._filesArray = [];
      const input = block.querySelector(".brief-upload__input");
      const btn = block.querySelector("[data-upload-btn]");
      const list = block.querySelector("[data-upload-list]");
      const error = block.querySelector("[data-upload-error]");
      let filesArray = block._filesArray;
      if (input?.name) {
        loadBriefFiles(input.name).then((savedFiles) => {
          if (!savedFiles || !savedFiles.length) return;
          block._filesArray = savedFiles;
          filesArray = block._filesArray;
          renderList();
        });
      }
      btn.addEventListener("click", () => input.click());
      input.addEventListener("change", async () => {
        const chosenFiles = Array.from(input.files);
        const currentSize = filesArray.reduce((t, f) => t + f.size, 0);
        const chosenSize = chosenFiles.reduce((t, f) => t + f.size, 0);
        if (currentSize + chosenSize > MAX_SIZE) {
          error.classList.add("--show");
          input.value = "";
          return;
        }
        error.classList.remove("--show");
        filesArray.push(...chosenFiles);
        input.value = "";
        await saveBriefFiles(input.name, filesArray);
        renderList();
      });
      function renderList() {
        list.innerHTML = "";
        filesArray.forEach((file, index) => {
          const item = document.createElement("div");
          item.className = "brief-upload__file";
          item.innerHTML = `
						${file.name}
						<button type="button" data-remove-index="${index}" aria-label="remove">×</button>
					`;
          list.appendChild(item);
        });
      }
      list.addEventListener("click", async (e) => {
        const btn2 = e.target.closest("[data-remove-index]");
        if (!btn2) return;
        const index = +btn2.dataset.removeIndex;
        filesArray.splice(index, 1);
        await saveBriefFiles(input.name, filesArray);
        error.classList.remove("--show");
        renderList();
      });
    });
  }
  formSubmit();
  formFieldsInit();
  formRequiredFilledInit();
  initLazyIti();
}
document.querySelector("[data-fls-form]") ? window.addEventListener("load", formInit) : null;
function initTicker() {
  const tickers = document.querySelectorAll("[data-fls-ticker]");
  if (!tickers.length) return;
  tickers.forEach((ticker) => {
    const originalTrack = ticker.firstElementChild;
    if (!originalTrack) return;
    const speedAttr = Number.parseFloat(ticker.getAttribute("data-ticker-speed") || "80");
    const speed = Number.isFinite(speedAttr) && speedAttr > 0 ? speedAttr : 80;
    const direction = ticker.getAttribute("data-ticker-dir") === "rtl" ? "rtl" : "ltr";
    let cloneTrack = ticker.querySelector("[data-ticker-clone]");
    if (!cloneTrack) {
      cloneTrack = originalTrack.cloneNode(true);
      cloneTrack.setAttribute("data-ticker-clone", "");
      cloneTrack.setAttribute("aria-hidden", "true");
      ticker.appendChild(cloneTrack);
    }
    const applyState = () => {
      const trackWidth = originalTrack.scrollWidth;
      if (!trackWidth) return;
      ticker.style.setProperty("--ticker-distance", `${trackWidth}px`);
      ticker.style.setProperty("--ticker-duration", `${speed}s`);
      ticker.setAttribute("data-ticker-ready", "");
      [originalTrack, cloneTrack].forEach((track) => {
        track.style.animationName = direction === "rtl" ? "ticker-scroll" : "ticker-scroll-reverse";
        track.style.animationDuration = `${speed}s`;
        track.style.animationTimingFunction = "linear";
        track.style.animationIterationCount = "infinite";
      });
    };
    applyState();
    if (ticker._tickerResizeObserver || ticker._tickerResizeFallback) return;
    if ("ResizeObserver" in window) {
      const resizeObserver = new ResizeObserver(applyState);
      resizeObserver.observe(originalTrack);
      ticker._tickerResizeObserver = resizeObserver;
    } else {
      const onResize = () => applyState();
      window.addEventListener("resize", onResize, { passive: true });
      ticker._tickerResizeFallback = onResize;
    }
    window.addEventListener("load", applyState, { once: true });
  });
}
initTicker();
