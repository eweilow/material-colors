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

/*
var types = Object.keys(window.colors.typography.light);

for(var key in window.colors.cache) {
  var el = document.createElement("div");
  el.setAttribute(BG_DEFINE_ATTRIBUTE, key);
  
  var p2 = document.createElement("p");
  p2.setAttribute(BG_DEFINE_ATTRIBUTE, "white-500");
  p2.setAttribute(COLOR_DEFINE_ATTRIBUTE, (key.split("-")[0])+"-500");
  p2.setAttribute("m-hook-bg", "primary");
  p2.setAttribute("m-hook-color", "primary");
  p2.innerText = key;
  el.appendChild(p2);
  
  for(var i = 0; i < types.length; i++) {
    var p = document.createElement("p");
    p.setAttribute("m-hook-color", types[i]);
    p.setAttribute("m-hook-bg", "primary");
    p.innerText = types[i];
    
    var p3 = document.createElement("span");
    p3.setAttribute("m-hook-color-bg", types[i]);
    p.appendChild(p3);
    
    el.appendChild(p);
  }
  
  var p2 = document.createElement("p");
  p2.setAttribute(BG_DEFINE_ATTRIBUTE, "grey-100");
  p2.setAttribute(COLOR_DEFINE_ATTRIBUTE, key);
  p2.setAttribute("m-hook-color", "primary");
  p2.setAttribute("m-hook-bg", "primary");
  p2.innerText = key;
  
  var p3 = document.createElement("span");
  p3.setAttribute("m-hook-color-bg", "primary");
  p2.appendChild(p3);
  
  el.appendChild(p2);
  document.body.appendChild(el);
}

var start2 = performance.now();
generateStyle();
var end2 = performance.now();

var item = document.getElementById("time");
var start = performance.now();
runColors(document);
runBg(document);
var end = performance.now();
item.innerText = "Generating colors took " + (end - start).toFixed(2) + "ms, style took " + (end2 - start2).toFixed(2) + "ms";
*/
/*
function frame(){
  var keys = Object.keys(window.colors.cache);
  
  var allbg = document.querySelectorAll("[m-bg]:not([m-color])");
  for(var i = 0; i < allbg.length; i++) {
    var initial = allbg[i];
    
    initial.setAttribute(BG_DEFINE_ATTRIBUTE, keys[Math.floor(Math.random() * keys.length)]);
  }
  
  var allbg2 = document.querySelectorAll("[m-color]");
  for(var i = 0; i < allbg2.length; i++) {
    var initial2 = allbg2[i];
    
    initial2.setAttribute(COLOR_DEFINE_ATTRIBUTE, keys[Math.floor(Math.random() * keys.length)]);
  }
};


var observer = new MutationObserver(function(mutations) {
  var start = performance.now();
  for(var i = 0; i < mutations.length; i++) {
    if(mutations[i].type === "attributes") {
      if(mutations[i].attributeName === COLOR_DEFINE_ATTRIBUTE) {
        runColors(mutations[i].target);
      } else if(mutations[i].attributeName === BG_DEFINE_ATTRIBUTE) {
        runBg(mutations[i].target);
      }
    }
    
  }
  var end = performance.now();
  item.innerText = "Generating colors took " + (end - start) + "ms";
}); 
// configuration of the observer:
var config = { attributes: true, childList: true, subtree: true, attributeFilter: [BG_DEFINE_ATTRIBUTE, COLOR_DEFINE_ATTRIBUTE] };
observer.observe(document.body, config);


frame();

setInterval(frame, 1000);
*/