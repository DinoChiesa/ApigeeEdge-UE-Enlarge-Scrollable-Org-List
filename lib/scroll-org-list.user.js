// ==UserScript==
// @namespace   Apigee
// @name        Scroll-org-list
// @description Scroll the organization dropdown list in the Apigee Edge Administrative UI (UE version)
// @match       https://apigee.com/platform/*
// @match       https://apigee.com/organizations/*
// @match       https://apigee.com/edge
// @require     https://gist.githubusercontent.com/mjblay/18d34d861e981b7785e407c3b443b99b/raw/debc0e6d4d537ac228d1d71f44b1162979a5278c/waitForKeyElements.js
// @grant       none
// @copyright   2016 Apigee Corporation, 2019 Google LLC
// @version     0.1.1
// @run-at      document-end
// @license     Apache 2.0
// ==/UserScript==

(function (globalScope){
  var orgDropDiv;
  var delayAfterPageLoad = 1800;
  var delayAfterElements = 1000;

  function mylog(){
    Function.prototype.apply.apply(console.log, [console, arguments]);
  }

  // function getElementsByTagAndClass(root, tag, clazz) {
  //   var nodes = root.getElementsByClassName(clazz);
  //   if (tag) {
  //     var tagUpper = tag.toUpperCase();
  //     nodes = Array.prototype.filter.call(nodes, function(testElement){
  //       return testElement.nodeName.toUpperCase() === tagUpper;
  //     });
  //   }
  //   return nodes;
  // }

  function getOrgList(cb) {
    var orgdiv = document.getElementById('orgpicker-scrollable');
    if (orgdiv) {
      cb(orgdiv);
    }
  }

  function changeHeight(elt){
      elt.setAttribute("style", "max-height:688px;");
  }

  function tryFixup() {
    mylog('Apigee orgpicker fixup running: ' + window.location.href);
    getOrgList(changeHeight);
  }

  // ====================================================================
  // This kicks off the page fixup logic
  setTimeout(function() {
    waitForKeyElements ("#orgpicker #orgpicker-scrollable", function() {
      setTimeout(tryFixup, delayAfterElements);
    });
  }, delayAfterPageLoad);

}(this));
