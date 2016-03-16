var LIGHT_ATTRIBUTE = "m-light"; 
var HOOK_COLOR_ATTRIBUTE = "m-hook-color";
var HOOK_COLOR_BG_ATTRIBUTE = "m-hook-color-bg";
var HOOK_BG_ATTRIBUTE = "m-hook-bg";
var COLOR_DEFINE_ATTRIBUTE = "m-color";
var BG_DEFINE_ATTRIBUTE = "m-bg";

var COLOR_ACTUAL_ATTRIBUTE = "m-actual-color";
var BG_ACTUAL_ATTRIBUTE = "m-actual-bg";

var DEFAULT_COLOR = "black-500";
var DEFAULT_BG = "white-500";

function runColors(wrapper) {
  var all = wrapper.querySelectorAll("["+HOOK_COLOR_ATTRIBUTE+"],["+HOOK_COLOR_BG_ATTRIBUTE+"]");
  for(var i = 0; i < all.length; i++) {
    var parent = all[i];
    
    var isColor = false;
    var isBg = false;
    do {
      isColor = parent.hasAttribute(COLOR_DEFINE_ATTRIBUTE)
      isBg = parent.hasAttribute(BG_DEFINE_ATTRIBUTE);
    }
    while(!(isColor || isBg) && (parent = parent.parentElement));
    
    var initial = all[i];
    if(isColor) {
      var attribute = DEFAULT_COLOR;
      if(parent) {
        attribute = parent.getAttribute(COLOR_DEFINE_ATTRIBUTE);
      }
      if(initial.hasAttribute(HOOK_COLOR_ATTRIBUTE)) {
        initial.setAttribute(COLOR_ACTUAL_ATTRIBUTE, attribute);
      } else {
        initial.setAttribute(COLOR_ACTUAL_ATTRIBUTE, false);
      }
      if(initial.hasAttribute(HOOK_COLOR_BG_ATTRIBUTE)) {
        initial.setAttribute(BG_ACTUAL_ATTRIBUTE, attribute);
      } else {
        initial.setAttribute(BG_ACTUAL_ATTRIBUTE, false);
      }
      initial.setAttribute(LIGHT_ATTRIBUTE, false);
    } else {
      var attribute = DEFAULT_BG;
      if(parent) {
        attribute = parent.getAttribute(BG_DEFINE_ATTRIBUTE);
      }
      initial.setAttribute(LIGHT_ATTRIBUTE, window.colors.colors[attribute].light);
    }
  }
}

function runBg(wrapper) {
  var allbg = wrapper.querySelectorAll("["+HOOK_BG_ATTRIBUTE+"]");
  for(var i = 0; i < allbg.length; i++) {
    var parent = allbg[i];
    while(!parent.hasAttribute(BG_DEFINE_ATTRIBUTE) && (parent = parent.parentElement));
    
    var initial = allbg[i];
    var attribute = DEFAULT_BG;
    if(parent) {
      attribute = parent.getAttribute(BG_DEFINE_ATTRIBUTE);
    }
    initial.setAttribute(BG_ACTUAL_ATTRIBUTE, attribute);
  }
}


function benchmark() {
  var start = performance.now();
  var count = 10000;
  for(var i = 0; i < count; i++) {
    runColors(document);
    runBg(document);
  }
  alert((performance.now() - start) / count + "ms per operation, total: " + (performance.now() - start));
}

function applyForRandom(attributeName) {
  var keys = Object.keys(window.colors.colors);
  var allbg = document.querySelectorAll("["+attributeName+"='random']");
  for(var i = 0; i < allbg.length; i++) {
    var parent = allbg[i];
    parent.setAttribute(attributeName, keys[Math.floor(Math.random() * keys.length)]);
  }
}
applyForRandom(BG_DEFINE_ATTRIBUTE);
applyForRandom(COLOR_DEFINE_ATTRIBUTE);

window.generateColors = function(element) {
  var start = performance.now();
  if(!element) {
    element = document;
  } else if (element.parentNode) {
    element = element.parentNode;
  }
  runColors(element);
  runBg(element);
  var end = performance.now();
  console.log("Applying colors took: " + (end - start).toFixed(2) + "ms");
};
window.generateColors(document);
