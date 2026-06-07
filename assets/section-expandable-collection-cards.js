(function () {
  var sectionSelector = '[data-expandable-collections]';
  var cardSelector = '[data-expandable-card]';
  var toggleSelector = '[data-expandable-toggle]';
  var mobileQuery = window.matchMedia('(max-width: 767px)');
  var reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var instances = new WeakMap();

  function toBool(value) {
    return value === true || value === 'true';
  }

  function toInt(value, fallback) {
    var parsed = parseInt(value, 10);
    return isNaN(parsed) ? fallback : parsed;
  }

  function getMotionMultiplier() {
    var raw = window.getComputedStyle(document.documentElement).getPropertyValue('--motion-speed-multiplier');
    var parsed = parseFloat(raw);
    return isNaN(parsed) || parsed <= 0 ? 1 : parsed;
  }

  function ExpandableCollections(section) {
    this.section = section;
    this.cards = Array.prototype.slice.call(section.querySelectorAll(cardSelector));
    this.behaviour = section.dataset.desktopBehaviour || 'hover';
    this.allowMultiple = toBool(section.dataset.allowMultiple);
    this.motionEnabled = toBool(section.dataset.motionEnabled) && !reducedMotionQuery.matches;
    this.autoplayMotionEnabled = toBool(section.dataset.autoplayMotionEnabled) && this.motionEnabled;
    this.autoRotate = toBool(section.dataset.autoRotate) && this.autoplayMotionEnabled;
    this.pauseOnHover = toBool(section.dataset.pauseOnHover);
    this.autoRotateDelay = Math.max(toInt(section.dataset.autoRotateDelay, 5000), 1000);
    this.transitionSpeed = this.motionEnabled ? Math.max(Math.round(toInt(section.dataset.transitionSpeed, 450) / getMotionMultiplier()), 0) : 0;
    this.defaultActive = toInt(section.dataset.defaultActive, 1);
    this.mobileDefaultOpen = toInt(section.dataset.mobileDefaultOpen, 1);
    this.rotationTimer = null;
    this.isPaused = false;

    this.handleClick = this.handleClick.bind(this);
    this.handleCardClick = this.handleCardClick.bind(this);
    this.handlePointerEnter = this.handlePointerEnter.bind(this);
    this.handleSectionEnter = this.handleSectionEnter.bind(this);
    this.handleSectionLeave = this.handleSectionLeave.bind(this);
    this.handleMediaChange = this.handleMediaChange.bind(this);
    this.handleBlockSelect = this.handleBlockSelect.bind(this);

    this.init();
  }

  ExpandableCollections.prototype.init = function () {
    this.cards.forEach(function (card, index) {
      var toggle = card.querySelector(toggleSelector);
      card.dataset.cardIndex = card.dataset.cardIndex || String(index + 1);

      if (toggle) {
        toggle.addEventListener('click', this.handleClick);
      }

      card.addEventListener('click', this.handleCardClick);
      card.addEventListener('mouseenter', this.handlePointerEnter);
    }, this);

    this.section.addEventListener('mouseenter', this.handleSectionEnter);
    this.section.addEventListener('mouseleave', this.handleSectionLeave);
    this.section.addEventListener('shopify:block:select', this.handleBlockSelect);

    if (mobileQuery.addEventListener) {
      mobileQuery.addEventListener('change', this.handleMediaChange);
    } else if (mobileQuery.addListener) {
      mobileQuery.addListener(this.handleMediaChange);
    }

    this.resetForViewport();
  };

  ExpandableCollections.prototype.destroy = function () {
    this.stopRotation();

    this.cards.forEach(function (card) {
      var toggle = card.querySelector(toggleSelector);

      this.clearContentTimer(card);
      card.classList.remove('is-content-visible');

      if (toggle) {
        toggle.removeEventListener('click', this.handleClick);
        toggle.removeAttribute('tabindex');
      }

      card.removeEventListener('mouseenter', this.handlePointerEnter);
      card.removeEventListener('click', this.handleCardClick);
    }, this);

    this.section.removeEventListener('mouseenter', this.handleSectionEnter);
    this.section.removeEventListener('mouseleave', this.handleSectionLeave);
    this.section.removeEventListener('shopify:block:select', this.handleBlockSelect);

    if (mobileQuery.removeEventListener) {
      mobileQuery.removeEventListener('change', this.handleMediaChange);
    } else if (mobileQuery.removeListener) {
      mobileQuery.removeListener(this.handleMediaChange);
    }
  };

  ExpandableCollections.prototype.handleMediaChange = function () {
    this.resetForViewport();
  };

  ExpandableCollections.prototype.handleClick = function (event) {
    event.stopPropagation();

    var card = event.currentTarget.closest(cardSelector);

    if (!card) {
      return;
    }

    if (mobileQuery.matches) {
      this.toggleMobileCard(card);
      return;
    }

    if (this.behaviour === 'click') {
      this.activateDesktopCard(card);
    }
  };

  ExpandableCollections.prototype.handleCardClick = function (event) {
    var card = event.currentTarget;

    if (event.target.closest('a')) {
      return;
    }

    if (event.target.closest(toggleSelector)) {
      return;
    }

    if (mobileQuery.matches) {
      this.toggleMobileCard(card);
      return;
    }

    if (this.behaviour === 'click') {
      this.activateDesktopCard(card);
    }
  };

  ExpandableCollections.prototype.handlePointerEnter = function (event) {
    if (mobileQuery.matches || this.behaviour !== 'hover') {
      return;
    }

    this.activateDesktopCard(event.currentTarget);
  };

  ExpandableCollections.prototype.handleSectionEnter = function () {
    if (this.pauseOnHover) {
      this.isPaused = true;
    }
  };

  ExpandableCollections.prototype.handleSectionLeave = function () {
    if (this.pauseOnHover) {
      this.isPaused = false;
    }
  };

  ExpandableCollections.prototype.handleBlockSelect = function (event) {
    var blockId = event.detail && event.detail.blockId;

    if (!blockId) {
      return;
    }

    for (var i = 0; i < this.cards.length; i += 1) {
      if (this.cards[i].dataset.blockId === blockId) {
        var targetCard = this.cards[i];

        if (mobileQuery.matches) {
          if (!this.allowMultiple) {
            this.cards.forEach(function (card) {
              this.setCardState(card, card === targetCard, false);
            }, this);
          } else {
            this.setCardState(targetCard, true, false);
          }
        } else {
          this.activateDesktopCard(targetCard);
        }
        break;
      }
    }
  };

  ExpandableCollections.prototype.resetForViewport = function () {
    this.stopRotation();

    if (mobileQuery.matches) {
      this.setMobileInitialState();
      return;
    }

    this.setDesktopInitialState();
    this.startRotation();
  };

  ExpandableCollections.prototype.setDesktopInitialState = function () {
    if (this.behaviour === 'equal') {
      this.cards.forEach(function (card) {
        this.setCardState(card, true, true);
      }, this);
      return;
    }

    var activeCard = this.getCardByIndex(this.defaultActive) || this.cards[0];

    this.cards.forEach(function (card) {
      this.setCardState(card, card === activeCard, false);
    }, this);
  };

  ExpandableCollections.prototype.setMobileInitialState = function () {
    var openCard = this.getCardByIndex(this.mobileDefaultOpen);

    this.cards.forEach(function (card) {
      this.setCardState(card, card === openCard, false);
    }, this);
  };

  ExpandableCollections.prototype.activateDesktopCard = function (activeCard) {
    if (this.behaviour === 'equal') {
      return;
    }

    if (activeCard.classList.contains('is-active')) {
      return;
    }

    this.cards.forEach(function (card) {
      this.setCardState(card, card === activeCard, false);
    }, this);
  };

  ExpandableCollections.prototype.toggleMobileCard = function (targetCard) {
    var willOpen = !targetCard.classList.contains('is-active');

    if (!this.allowMultiple && willOpen) {
      this.cards.forEach(function (card) {
        this.setCardState(card, card === targetCard, false);
      }, this);
      return;
    }

    this.setCardState(targetCard, willOpen, false);
  };

  ExpandableCollections.prototype.setCardState = function (card, isOpen, isEqualMode) {
    var toggle = card.querySelector(toggleSelector);

    this.clearContentTimer(card);
    card.classList.remove('is-content-visible');
    card.classList.toggle('is-active', isOpen);

    if (toggle) {
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

      if (isEqualMode && !mobileQuery.matches) {
        toggle.setAttribute('tabindex', '-1');
      } else {
        toggle.removeAttribute('tabindex');
      }
    }

    if (isOpen) {
      this.scheduleContentReveal(card, isEqualMode);
    }
  };

  ExpandableCollections.prototype.clearContentTimer = function (card) {
    if (card._expandableCollectionsContentTimer) {
      window.clearTimeout(card._expandableCollectionsContentTimer);
      card._expandableCollectionsContentTimer = null;
    }
  };

  ExpandableCollections.prototype.scheduleContentReveal = function (card, isEqualMode) {
    var delay = reducedMotionQuery.matches || isEqualMode ? 0 : this.transitionSpeed;

    if (delay <= 1) {
      card.classList.add('is-content-visible');
      return;
    }

    card._expandableCollectionsContentTimer = window.setTimeout(function () {
      card._expandableCollectionsContentTimer = null;

      if (card.classList.contains('is-active')) {
        card.classList.add('is-content-visible');
      }
    }, delay);
  };

  ExpandableCollections.prototype.getCardByIndex = function (index) {
    if (index < 1) {
      return null;
    }

    for (var i = 0; i < this.cards.length; i += 1) {
      if (toInt(this.cards[i].dataset.cardIndex, 0) === index) {
        return this.cards[i];
      }
    }

    return null;
  };

  ExpandableCollections.prototype.startRotation = function () {
    if (!this.autoRotate || this.behaviour === 'equal' || reducedMotionQuery.matches || this.cards.length < 2) {
      return;
    }

    this.rotationTimer = window.setInterval(function () {
      if (this.isPaused) {
        return;
      }

      var currentIndex = -1;

      for (var i = 0; i < this.cards.length; i += 1) {
        if (this.cards[i].classList.contains('is-active')) {
          currentIndex = i;
          break;
        }
      }

      var nextIndex = currentIndex + 1 >= this.cards.length ? 0 : currentIndex + 1;

      this.activateDesktopCard(this.cards[nextIndex]);
    }.bind(this), this.autoRotateDelay);
  };

  ExpandableCollections.prototype.stopRotation = function () {
    if (this.rotationTimer) {
      window.clearInterval(this.rotationTimer);
      this.rotationTimer = null;
    }
  };

  function initSection(section) {
    if (!section || instances.has(section)) {
      return;
    }

    instances.set(section, new ExpandableCollections(section));
  }

  function initSections(root) {
    var scope = root || document;
    Array.prototype.slice.call(scope.querySelectorAll(sectionSelector)).forEach(initSection);
  }

  function destroySection(section) {
    var instance = instances.get(section);

    if (!instance) {
      return;
    }

    instance.destroy();
    instances.delete(section);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initSections(document);
    });
  } else {
    initSections(document);
  }

  document.addEventListener('shopify:section:load', function (event) {
    initSections(event.target);
  });

  document.addEventListener('shopify:section:unload', function (event) {
    Array.prototype.slice.call(event.target.querySelectorAll(sectionSelector)).forEach(destroySection);
  });
})();
