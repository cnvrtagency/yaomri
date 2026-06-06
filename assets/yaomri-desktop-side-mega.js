(function () {
  'use strict';

  var DESKTOP_QUERY = '(min-width: 1025px)';
  var TRIGGER_SELECTOR = '[data-menu-nav] > .t4s-menu-item > a';
  var ROOT_SELECTOR = '#yo-desktop-side-mega';
  var HEADER_SELECTOR = '#shopify-section-announcement-bar, #shopify-section-top-bar, .t4s-section-header, .t4s-header__wrapper';
  var initialized = false;

  function initSideMega() {
    var root = document.querySelector(ROOT_SELECTOR);
    if (!root || initialized) return;

    initialized = true;

    var mediaQuery = window.matchMedia(DESKTOP_QUERY);
    var panel = root.querySelector('.yo-desktop-side-mega__panel');
    var closeButtons = root.querySelectorAll('[data-yo-side-mega-close]');
    var menuPanels = root.querySelectorAll('[data-yo-side-mega-key]');
    var openBehavior = root.getAttribute('data-open-behavior') || 'hover';
    var useFallback = root.getAttribute('data-use-fallback') !== 'false';
    var hasFallback = Boolean(root.querySelector('[data-yo-side-mega-key="fallback"]'));
    var panelKeys = {};
    var closeTimer = null;
    var activeTrigger = null;
    var offsetFrame = null;

    menuPanels.forEach(function (menuPanel) {
      var key = menuPanel.getAttribute('data-yo-side-mega-key');
      if (key) panelKeys[key] = true;
    });

    function isDesktop() {
      return mediaQuery.matches;
    }

    function clearCloseTimer() {
      if (!closeTimer) return;
      window.clearTimeout(closeTimer);
      closeTimer = null;
    }

    function normalizeLabel(label) {
      return String(label || '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    function getTriggerKey(trigger) {
      if (!trigger) return '';
      return normalizeLabel(trigger.textContent);
    }

    function resolvePanelKey(trigger) {
      var triggerKey = getTriggerKey(trigger);
      if (triggerKey && panelKeys[triggerKey]) return triggerKey;
      if (useFallback && hasFallback) return 'fallback';
      return '';
    }

    function showPanel(key) {
      menuPanels.forEach(function (menuPanel) {
        menuPanel.classList.toggle('is-active', menuPanel.getAttribute('data-yo-side-mega-key') === key);
      });
    }

    function updateTopOffset() {
      var bottom = 0;

      document.querySelectorAll(HEADER_SELECTOR).forEach(function (element) {
        var style = window.getComputedStyle(element);
        var rect = element.getBoundingClientRect();

        if (style.display === 'none' || style.visibility === 'hidden') return;
        if (rect.width <= 0 || rect.height <= 0) return;
        if (rect.bottom <= 0 || rect.top >= window.innerHeight) return;

        bottom = Math.max(bottom, rect.bottom);
      });

      root.style.setProperty('--yo-side-mega-top-offset', Math.max(0, Math.ceil(bottom)) + 'px');
    }

    function requestTopOffsetUpdate() {
      if (offsetFrame) return;
      offsetFrame = window.requestAnimationFrame(function () {
        offsetFrame = null;
        updateTopOffset();
      });
    }

    function open(trigger, panelKey) {
      if (!isDesktop()) return;
      var resolvedPanelKey = panelKey || resolvePanelKey(trigger);
      if (!resolvedPanelKey) return;

      clearCloseTimer();
      updateTopOffset();
      if (activeTrigger && activeTrigger !== trigger) activeTrigger.setAttribute('aria-expanded', 'false');
      activeTrigger = trigger || activeTrigger;
      showPanel(resolvedPanelKey);
      root.classList.add('is-open');
      document.documentElement.classList.add('yo-side-mega-is-open');
      root.setAttribute('aria-hidden', 'false');
      if (activeTrigger) activeTrigger.setAttribute('aria-expanded', 'true');
    }

    function close() {
      clearCloseTimer();
      root.classList.remove('is-open');
      document.documentElement.classList.remove('yo-side-mega-is-open');
      root.setAttribute('aria-hidden', 'true');
      if (activeTrigger) activeTrigger.setAttribute('aria-expanded', 'false');
      activeTrigger = null;
    }

    function scheduleClose() {
      clearCloseTimer();
      closeTimer = window.setTimeout(close, 180);
    }

    function wireTriggers() {
      document.querySelectorAll(TRIGGER_SELECTOR).forEach(function (trigger) {
        if (trigger.dataset.yoSideMegaBound === 'true') return;
        if (!resolvePanelKey(trigger)) return;

        trigger.dataset.yoSideMegaBound = 'true';
        trigger.setAttribute('data-yo-side-mega-trigger', '');
        trigger.setAttribute('aria-haspopup', 'dialog');
        trigger.setAttribute('aria-controls', 'yo-desktop-side-mega');
        trigger.setAttribute('aria-expanded', 'false');

        trigger.addEventListener('mouseenter', function () {
          if (openBehavior !== 'hover') return;
          var panelKey = resolvePanelKey(trigger);
          if (!panelKey) return;
          open(trigger, panelKey);
        });

        trigger.addEventListener('focusin', function () {
          if (openBehavior !== 'hover') return;
          var panelKey = resolvePanelKey(trigger);
          if (!panelKey) return;
          open(trigger, panelKey);
        });

        trigger.addEventListener('click', function (event) {
          if (openBehavior !== 'click' || !isDesktop()) return;
          var panelKey = resolvePanelKey(trigger);
          if (!panelKey) return;
          if (!root.classList.contains('is-open') || activeTrigger !== trigger) {
            event.preventDefault();
            open(trigger, panelKey);
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

    closeButtons.forEach(function (button) {
      button.addEventListener('click', close);
    });

    document.addEventListener('click', function (event) {
      if (!root.classList.contains('is-open')) return;
      if (root.contains(event.target) || event.target.closest('[data-yo-side-mega-trigger]')) return;
      if (event.target.closest('[data-drawer-options]')) close();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape' || !root.classList.contains('is-open')) return;
      var triggerToFocus = activeTrigger;
      close();
      if (triggerToFocus) triggerToFocus.focus();
    });

    function handleViewportChange() {
      if (!isDesktop()) close();
      requestTopOffsetUpdate();
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

    window.addEventListener('resize', requestTopOffsetUpdate);
    window.addEventListener('scroll', requestTopOffsetUpdate, { passive: true });

    updateTopOffset();
    wireTriggers();

    document.addEventListener('shopify:section:load', wireTriggers);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSideMega);
  } else {
    initSideMega();
  }
})();
