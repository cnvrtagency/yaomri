(function () {
  'use strict';

  var DESKTOP_QUERY = '(min-width: 1025px)';
  var TRIGGER_SELECTOR = '[data-menu-nav] > .t4s-menu-item > a';
  var ROOT_SELECTOR = '#yo-desktop-side-mega';
  var initialized = false;

  function initSideMega() {
    var root = document.querySelector(ROOT_SELECTOR);
    if (!root || initialized) return;

    initialized = true;

    var mediaQuery = window.matchMedia(DESKTOP_QUERY);
    var panel = root.querySelector('.yo-desktop-side-mega__panel');
    var closeButtons = root.querySelectorAll('[data-yo-side-mega-close]');
    var openBehavior = root.getAttribute('data-open-behavior') || 'hover';
    var closeTimer = null;
    var activeTrigger = null;

    function isDesktop() {
      return mediaQuery.matches;
    }

    function setTriggerAttributes() {
      document.querySelectorAll(TRIGGER_SELECTOR).forEach(function (trigger) {
        trigger.setAttribute('data-yo-side-mega-trigger', '');
        trigger.setAttribute('aria-haspopup', 'dialog');
        trigger.setAttribute('aria-controls', 'yo-desktop-side-mega');
      });
    }

    function clearCloseTimer() {
      if (!closeTimer) return;
      window.clearTimeout(closeTimer);
      closeTimer = null;
    }

    function open(trigger) {
      if (!isDesktop()) return;
      clearCloseTimer();
      activeTrigger = trigger || activeTrigger;
      root.classList.add('is-open');
      document.documentElement.classList.add('yo-side-mega-is-open');
      root.setAttribute('aria-hidden', 'false');
      if (activeTrigger) {
        activeTrigger.setAttribute('aria-expanded', 'true');
      }
    }

    function close() {
      clearCloseTimer();
      root.classList.remove('is-open');
      document.documentElement.classList.remove('yo-side-mega-is-open');
      root.setAttribute('aria-hidden', 'true');
      if (activeTrigger) {
        activeTrigger.setAttribute('aria-expanded', 'false');
      }
      activeTrigger = null;
    }

    function scheduleClose() {
      clearCloseTimer();
      closeTimer = window.setTimeout(close, 180);
    }

    function wireTriggers() {
      document.querySelectorAll(TRIGGER_SELECTOR).forEach(function (trigger) {
        if (trigger.dataset.yoSideMegaBound === 'true') return;

        trigger.dataset.yoSideMegaBound = 'true';
        trigger.setAttribute('data-yo-side-mega-trigger', '');
        trigger.setAttribute('aria-haspopup', 'dialog');
        trigger.setAttribute('aria-controls', 'yo-desktop-side-mega');
        trigger.setAttribute('aria-expanded', 'false');

        trigger.addEventListener('mouseenter', function () {
          if (openBehavior !== 'hover') return;
          open(trigger);
        });

        trigger.addEventListener('focusin', function () {
          if (openBehavior !== 'hover') return;
          open(trigger);
        });

        trigger.addEventListener('click', function (event) {
          if (openBehavior !== 'click' || !isDesktop()) return;
          if (!root.classList.contains('is-open') || activeTrigger !== trigger) {
            event.preventDefault();
            open(trigger);
          }
        });
      });
    }

    root.addEventListener('mouseenter', clearCloseTimer);
    root.addEventListener('mouseleave', function () {
      if (openBehavior === 'hover') scheduleClose();
    });

    document.addEventListener('mouseover', function (event) {
      if (openBehavior !== 'hover' || !root.classList.contains('is-open')) return;
      if (root.contains(event.target) || event.target.closest('[data-yo-side-mega-trigger]')) return;
      scheduleClose();
    });

    document.addEventListener('click', function (event) {
      if (!root.classList.contains('is-open')) return;
      if (root.contains(event.target) || event.target.closest('[data-yo-side-mega-trigger]')) return;
      if (event.target.closest('[data-drawer-options]')) close();
    });

    closeButtons.forEach(function (button) {
      button.addEventListener('click', close);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape' || !root.classList.contains('is-open')) return;
      var triggerToFocus = activeTrigger;
      close();
      if (triggerToFocus) triggerToFocus.focus();
    });

    function handleViewportChange() {
      if (!isDesktop()) close();
    }

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleViewportChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleViewportChange);
    }

    if (panel) {
      panel.addEventListener('focusout', function (event) {
        if (openBehavior !== 'hover') return;
        if (event.relatedTarget && root.contains(event.relatedTarget)) return;
        scheduleClose();
      });
    }

    setTriggerAttributes();
    wireTriggers();

    document.addEventListener('shopify:section:load', function () {
      setTriggerAttributes();
      wireTriggers();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSideMega);
  } else {
    initSideMega();
  }
})();
