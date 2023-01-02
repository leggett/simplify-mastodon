// UTILITIES

// Shorthand for getting first matching element; returns Node
const get = (selector, parent = "") => {
  if (parent === "") {
    return document.querySelector(selector);
  } else if (parent instanceof Node) {
    return parent.querySelector(selector);
  } else if (parent instanceof String) {
    return document.querySelector(`${parent} ${selector}`);
  } else {
    error("get() called with undefined parent.", selector, parent);
    return false;
  }
};

// Shorthand for getting elements; returns NodeList
const gets = (selector, parent = "") => {
  if (parent === "") {
    return document.querySelectorAll(selector);
  } else if (parent instanceof Node) {
    return parent.querySelectorAll(selector);
  } else if (parent instanceof String) {
    return document.querySelector(`${parent} ${selector}`);
  } else {
    error("gets() called with undefined parent.", selector, parent);
    return false;
  }
};

// Shorthand for getting number of elements given a provided selector
const count = (selector, parent = "") => {
  if (parent === "") {
    return document.querySelectorAll(selector).length;
  } else if (parent instanceof Node) {
    return parent.querySelectorAll(selector).length;
  } else if (typeof parent === "string") {
    return document.querySelectorAll(`${parent} ${selector}`).length;
  } else {
    error("count() called with undefined parent.", selector, parent);
    return false;
  }
};

// Shorthand for seeing if an element exists
const exists = (selector, parent = "") => {
  if (parent === "") {
    // return document.querySelectorAll(selector).length > 0;
    return (
      document.body?.contains(document.querySelector(selector)) ||
      document.querySelector(selector) !== null
    );
  } else if (parent instanceof Node) {
    return (
      document.body?.contains(parent.querySelector(selector)) ||
      parent.querySelector(selector) !== null
    );
  } else if (typeof parent === "string") {
    return (
      document.body?.contains(
        document.querySelector(`${parent} ${selector}`)
      ) || document.querySelector(`${parent} ${selector}`) !== null
    );
  } else {
    error("exists() called with undefined parent.", selector, parent);
    return null;
  }
};

const getStyle = (element, property) => {
  // Get the computed style of an element
  try {
    let computedStyle = "";
    if (element instanceof Node) {
      computedStyle = getComputedStyle(element).getPropertyValue(property);
    } else {
      computedStyle = getComputedStyle(get(element)).getPropertyValue(property);
    }
    return computedStyle;
  } catch (error) {
    report("getStyle error", error);
    return false;
  }
};

// Give me the attribute on a specific element
const attribute = (selector, attribute) => {
  const elements = gets(selector);
  [...elements].forEach((el, i) => {
    console.log(i, el.getAttribute(attribute));
  });
};

// Simulate clicking on an element
const clickOn = (element) => {
  return new Promise((resolve, reject) => {
    let el = element;
    if (typeof element === "string") {
      el = get(element);
    }

    if (!el) reject("clickOn: could not find element");

    const dispatchMouseEvent = function (target, type) {
      const event = new MouseEvent(type, {
        view: window,
        bubbles: true,
        cancelable: true,
      });
      target.dispatchEvent(event);
    };
    dispatchMouseEvent(el, "mouseover");
    dispatchMouseEvent(el, "mousedown");
    dispatchMouseEvent(el, "click");
    dispatchMouseEvent(el, "mouseup");
    dispatchMouseEvent(el, "mouseout");
    console.log("Just clicked on", el);
    resolve("resolved");
  });
};

// Log what was clicked on
const clicks = () => {
  console.log("Listening for clicks");
  window.addEventListener("click", (e) => {
    console.log(e.target);
  });
};

// Make and return element(s) for appending to the DOM
const make = (selector, ...args) => {
  const attrs =
    typeof args[0] === "object" && !(args[0] instanceof HTMLElement)
      ? args.shift()
      : {};

  let classes = selector.split(".");
  if (classes.length > 0) selector = classes.shift();
  if (classes.length) attrs.className = classes.join(" ");

  let id = selector.split("#");
  if (id.length > 0) selector = id.shift();
  if (id.length) attrs.id = id[0];

  const node = document.createElement(selector.length > 0 ? selector : "div");
  for (let prop in attrs) {
    if (attrs.hasOwnProperty(prop) && attrs[prop] != undefined) {
      if (prop.indexOf("data-") == 0) {
        let dataProp = prop.substring(5).replace(/-([a-z])/g, function (g) {
          return g[1].toUpperCase();
        });
        node.dataset[dataProp] = attrs[prop];
      } else {
        node[prop] = attrs[prop];
      }
    }
  }

  const append = (child) => {
    if (Array.isArray(child)) return child.forEach(append);
    if (typeof child == "string") child = document.createTextNode(child);
    if (child) node.appendChild(child);
  };
  args.forEach(append);
  return node;
};

window.addEventListener(
  "keydown",
  async (e) => {
    let composing =
      e.target.isContentEditable ||
      e.target.tagName === "INPUT" ||
      e.target.tagName === "TEXTAREA";

    let altKeyOnly = e.altKey && !e.shiftKey && !e.metaKey && !e.ctrlKey;

    if (altKeyOnly && e.code === "KeyS") {
      e.preventDefault();
      console.log("You pressed Option+S");
      document.documentElement.classList.toggle("simplify");
      return;
    }

    if (composing) return;

    // Test different combinations of modifier keys
    let noModifierKey = !e.altKey && !e.shiftKey && !e.metaKey && !e.ctrlKey;
    // let shiftKeyOk = !e.altKey && !e.metaKey && !e.ctrlKey;

    // E for satElite
    // if (noModifierKey && e.key === "e") {
    //   return;
    // }
  },
  false
);

let html;

const minimizeCompose = () => {
  const compose = get(".compose-form");
  if (compose) {
    compose.classList.add("hidden");
    compose.addEventListener("click", (e) => {
      e.target.classList.remove("hidden");
    });

    get(".compose-form__publish")?.addEventListener("click", (e) => {
      if (e.target.nodeName !== "BUTTON") {
        get(".reply-indicator__cancel button")?.click();
      }
      get(".compose-form")?.classList.add("hidden");
    });
    console.log("Compose hidden");
  }
};

const showFullNav = () => {
  document.documentElement.classList.remove("lessNavItems");
};
const initShowFullNav = () => {
  const navSpacers = gets(".navigation-panel .flex-spacer:not(.SOFC)");
  navSpacers.forEach((navSpacer) => {
    navSpacer.addEventListener("click", showFullNav);
    navSpacer.classList.add("SOFC");
    console.log("Nav spacer listener added", navSpacer);
  });
};

// Detect theme
const detectTheme = () => {
  const [r, g, b] = getComputedStyle(document.body)
    .backgroundColor.replace("rgb(", "")
    .replace(")", "")
    .split(", ");
  const avgColor = (parseInt(r) + parseInt(g) + parseInt(b)) / 3;

  if (avgColor > 200) {
    document.body.classList.add("forceLightTheme");
  }

  if (avgColor < 100) {
    document.body.classList.add("forceDarkTheme");
  }
};

// Scrolling monitor to hide title bar
let lastScrollPos = 0;
let titleBarHeight = 78;
let titleBarHidden = false;
const checkScrollPos = () => {
  const cachedTitleBarHeight = titleBarHeight;

  // Update the title bar height
  titleBarHeight = exists(
    ".tabs-bar__wrapper .column-header__collapsible__extra"
  )
    ? 218
    : 78;

  // Exanding the filter menu triggers a scrolling event; ignore it
  if (cachedTitleBarHeight !== titleBarHeight) return;

  const currentScrollPos = titleBarHidden
    ? parseInt(document.documentElement.scrollTop)
    : parseInt(document.documentElement.scrollTop) - titleBarHeight;

  if (currentScrollPos < lastScrollPos - 50) {
    // console.log("Scrolling up", currentScrollPos, lastScrollPos);
    document.documentElement.classList.remove("scrolled");
    titleBarHidden = false;
    lastScrollPos = currentScrollPos;
  } else if (currentScrollPos > lastScrollPos + 100) {
    // console.log("Scrolling down", currentScrollPos, lastScrollPos);
    if (currentScrollPos > 100) {
      document.documentElement.classList.add("scrolled");
      titleBarHidden = true;
    }
    lastScrollPos = currentScrollPos;
  }
  // else {
  //   console.log("Scrolling else", currentScrollPos, lastScrollPos);
  // }
};

const init = () => {
  // html = document.documentElement;
  // document.documentElement.classList.add("simplify", "lessNavItems");
  // console.log("Simplify Mastodon v1.6 loaded");

  detectTheme();
  minimizeCompose();
  initShowFullNav();
  window.addEventListener("scroll", checkScrollPos, { passive: true });

  // Disable Simplify in multiple columns mode
  if (document.body.classList.contains("layout-multiple-columns")) {
    document.documentElement.classList.remove("simplify");
  }

  // Check if signed out
  if (exists("a[href='/auth/sign_in']")) {
    document.documentElement.classList.add("signedOut");
  }

  titleBarHeight = get(".tabs-bar__wrapper")?.scrollHeight || 78;
};

console.log("Simplify Mastodon v1.6 loaded");
document.documentElement.classList.add("simplify", "lessNavItems");
window.addEventListener("load", init);
