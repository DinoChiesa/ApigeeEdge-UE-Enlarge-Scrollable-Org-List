// ==UserScript==
// @namespace   Apigee
// @name        Scroll-org-list
// @description Scroll the organization dropdown list in the Apigee Edge Administrative UI (UE version)
// @match       https://apigee.com/platform/*
// @match       https://apigee.com/organizations/*
// @match       https://apigee.com/edge
// @grant       none
// @copyright   2016 Apigee Corporation, 2019-2020 Google LLC
// @version     0.1.2
// @run-at      document-end
// @license     Apache 2.0
// ==/UserScript==

/* jshint esversion: 9 */

(function (globalScope){
  let timerControl = {},
      orgDropDiv;
  const delayAfterPageLoad = 1800,
        delayAfterElements = 1000,
        debounceInterval = 390;

  const log = function() {
          var origArguments = Array.prototype.slice.call(arguments);
          origArguments[0] = "[scroll-org-list] " + origArguments[0];
          Function.prototype.apply.apply(console.log, [console, origArguments]);
        };

  function waitForPredicate(predicate, action, controlKey) {
    controlKey = controlKey || Math.random().toString(36).substring(2,15);
    let interval = timerControl[controlKey];
    let found = predicate();

    if (found) {
      action(found);
      if (interval) {
        clearInterval (interval);
        delete timerControl[controlKey];
      }
    }
    else {
      if ( ! interval) {
        timerControl[controlKey] = setInterval ( function () {
          waitForPredicate(predicate, action, controlKey);
        }, 300);
      }
    }
  }

  function debounce(callback, interval) {
    let debounceTimeoutId;
    return function(...args) {
      if (debounceTimeoutId) { clearTimeout(debounceTimeoutId); }
      debounceTimeoutId = setTimeout(() => callback.apply(this, args), interval);
    };
  }

  function applyFilter(event) {
    log('applyfilter');
    getOrgList( div => {
      let spans = div.querySelectorAll('span.org-item');
      if (spans) {
        let filterInput = document.querySelector('input.org-list-filter-box');
        if (filterInput) {
          Array.prototype.forEach.call(spans, (span) => {
            let orgname = span.getAttribute('data-id');
            let match = orgname.indexOf(filterInput.value);
            if ( match < 0 ) {
              span.setAttribute('style', 'display:none;');
            }
            else {
              span.setAttribute('style', '');
            }
          });
        }
      }
    });
  }

  function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }

  function changeHeightAndAddFilter(div) {
    div.setAttribute("style", "max-height:688px;");
    let span = div.parentElement.previousElementSibling;
    let filterbox = document.createElement('input');
    filterbox.innerHTML = '';
    filterbox.setAttribute('type', 'text');
    filterbox.setAttribute('title', 'filter');
    filterbox.setAttribute('class', 'org-list-filter-box');
    filterbox.addEventListener('input', debounce(applyFilter, debounceInterval));
    filterbox.setAttribute('style', 'width: 230px;');
    insertAfter(span, filterbox);
  }

  function getOrgList(cb) {
    var orgdiv = document.getElementById('orgpicker-scrollable');
    if (orgdiv && cb) {
      return cb(orgdiv);
    }
    return orgdiv;
  }

  function tryFixup() {
    getOrgList(changeHeightAndAddFilter);
  }

  // ====================================================================
  // This kicks off the page fixup logic
  setTimeout(function() {
    waitForPredicate(getOrgList, function() {
      setTimeout(tryFixup, delayAfterElements);
    });
  }, delayAfterPageLoad);

}(this));
