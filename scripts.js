// UTILITIES

const get = (selector, parent = "") => {
  if (parent === "") {
    return document.querySelector(selector);
  } else {
    return parent.querySelector(selector);
  }
};

const gets = (selector, parent = "") => {
  if (parent === "") {
    return document.querySelectorAll(selector);
  } else {
    return parent.querySelectorAll(selector);
  }
};

const count = (selector, parent = "") => {
  if (parent === "") {
    return document.querySelectorAll(selector).length;
  } else {
    return parent.querySelectorAll(selector).length;
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
      html.classList.toggle("simplify");
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

const init = () => {
  html = document.documentElement;
  html.classList.add("simplify");
  console.log("Simplify Mastodon v1.0 loaded");
};

window.addEventListener("load", init);
