(function() {
  const ROOT_SELECTOR = '[data-yo-mobile-drawer-search]';
  const MIN_QUERY_LENGTH = 2;
  const DEBOUNCE_MS = 220;

  function hideResults(root) {
    const panel = root.querySelector('[data-yo-mobile-drawer-search-results]');
    const suggestions = root.querySelector('[data-yo-mobile-drawer-suggestions]');
    const title = root.querySelector('[data-yo-mobile-drawer-results-title]');
    const content = root.querySelector('[data-yo-mobile-drawer-results-content]');
    const footer = root.querySelector('[data-yo-mobile-drawer-results-footer]');
    if (!panel || !suggestions || !title || !content || !footer) return;
    panel.hidden = true;
    suggestions.innerHTML = '';
    title.innerHTML = '';
    title.hidden = true;
    content.innerHTML = '';
    footer.innerHTML = '';
    footer.hidden = true;
  }

  function renderResults(root, doc) {
    const panel = root.querySelector('[data-yo-mobile-drawer-search-results]');
    const suggestions = root.querySelector('[data-yo-mobile-drawer-suggestions]');
    const title = root.querySelector('[data-yo-mobile-drawer-results-title]');
    const content = root.querySelector('[data-yo-mobile-drawer-results-content]');
    const footer = root.querySelector('[data-yo-mobile-drawer-results-footer]');
    if (!panel || !suggestions || !title || !content || !footer) return;

    const nextSuggestions = doc.querySelector('[data-listsuggest-search]');
    const nextTitle = doc.querySelector('[data-title-search]');
    const nextContent = doc.querySelector('[data-results-search]');
    const nextFooter = doc.querySelector('[data-viewAll-search]');

    suggestions.innerHTML = nextSuggestions ? nextSuggestions.innerHTML : '';
    title.innerHTML = nextTitle ? nextTitle.innerHTML : '';
    title.hidden = !nextTitle || !nextTitle.textContent.trim();
    content.innerHTML = nextContent ? nextContent.innerHTML : '';
    footer.innerHTML = nextFooter ? nextFooter.innerHTML : '';
    footer.hidden = !nextFooter || !nextFooter.textContent.trim();

    panel.hidden = !(suggestions.innerHTML.trim() || content.innerHTML.trim() || footer.innerHTML.trim());
  }

  function initSearch(root) {
    if (!root || root.dataset.yoMobileDrawerSearchInit === 'true') return;
    root.dataset.yoMobileDrawerSearchInit = 'true';

    const endpoint = root.getAttribute('data-predictive-url');
    const input = root.querySelector('.yo-mobile-drawer__search-input');
    if (!endpoint || !input) return;

    let debounceTimer = null;
    let controller = null;
    let lastQuery = '';

    async function requestResults(query) {
      if (controller) controller.abort();
      controller = new AbortController();
      lastQuery = query;

      try {
        const response = await fetch(endpoint + encodeURIComponent(query), {
          signal: controller.signal,
          headers: { 'X-Requested-With': 'XMLHttpRequest' }
        });
        if (!response.ok) return;
        const html = await response.text();
        if (input.value.trim() !== lastQuery) return;
        const doc = new DOMParser().parseFromString(html, 'text/html');
        renderResults(root, doc);
      } catch (error) {
        if (error && error.name === 'AbortError') return;
      }
    }

    input.addEventListener('input', function() {
      const query = input.value.trim();
      clearTimeout(debounceTimer);
      if (query.length < MIN_QUERY_LENGTH) {
        lastQuery = '';
        hideResults(root);
        return;
      }
      debounceTimer = setTimeout(function() {
        requestResults(query);
      }, DEBOUNCE_MS);
    });

    input.addEventListener('focus', function() {
      const panel = root.querySelector('[data-yo-mobile-drawer-search-results]');
      if (panel && panel.innerHTML.trim() !== '' && input.value.trim().length >= MIN_QUERY_LENGTH) {
        panel.hidden = false;
      }
    });

    input.addEventListener('keydown', function(event) {
      if (event.key === 'Escape') hideResults(root);
    });

    document.addEventListener('click', function(event) {
      if (!root.contains(event.target)) hideResults(root);
    });
  }

  function boot() {
    document.querySelectorAll(ROOT_SELECTOR).forEach(initSearch);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  document.addEventListener('shopify:section:load', boot);
  document.addEventListener('shopify:section:select', boot);
})();
