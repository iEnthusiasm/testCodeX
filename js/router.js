(() => {
  const LAST_PAGE_KEY = 'random_router_last_page_id';

  function loadConfigFromStaticScript() {
    const config = window.RANDOM_PAGES_CONFIG;
    if (!config || !Array.isArray(config.pages)) {
      throw new Error('未找到页面配置，请检查 config/pages.js。');
    }
    return config;
  }

  function parseQueryPageId() {
    const url = new URL(window.location.href);
    return url.searchParams.get('page');
  }

  function sanitizePages(config) {
    return config.pages
      .filter((page) => page && page.enabled && page.path && page.id)
      .map((page) => ({
        ...page,
        weight: Number.isFinite(Number(page.weight)) && Number(page.weight) > 0
          ? Number(page.weight)
          : 1,
      }));
  }

  function weightedPick(pages) {
    const totalWeight = pages.reduce((sum, page) => sum + page.weight, 0);
    let threshold = Math.random() * totalWeight;

    for (const page of pages) {
      threshold -= page.weight;
      if (threshold < 0) return page;
    }

    return pages[pages.length - 1];
  }

  function pickWithoutImmediateRepeat(pages) {
    if (pages.length === 1) return pages[0];

    const lastId = localStorage.getItem(LAST_PAGE_KEY);
    const filtered = pages.filter((page) => page.id !== lastId);
    const candidatePool = filtered.length ? filtered : pages;
    return weightedPick(candidatePool);
  }

  function redirectTo(page) {
    localStorage.setItem(LAST_PAGE_KEY, page.id);
    window.location.href = page.path;
  }

  function showError(message) {
    document.body.innerHTML = `
      <main style="font-family: sans-serif; max-width: 680px; margin: 4rem auto; padding: 1rem;">
        <h1>页面加载失败</h1>
        <p>${message}</p>
      </main>
    `;
  }

  function init() {
    try {
      const config = loadConfigFromStaticScript();
      const pages = sanitizePages(config);

      if (!pages.length) {
        throw new Error('没有可用页面，请检查 config/pages.js。');
      }

      const forcedId = parseQueryPageId();
      if (forcedId) {
        const forcedPage = pages.find((page) => page.id === forcedId);
        if (forcedPage) {
          redirectTo(forcedPage);
          return;
        }
      }

      const selected = pickWithoutImmediateRepeat(pages);
      redirectTo(selected);
    } catch (error) {
      console.error(error);
      showError(error instanceof Error ? error.message : '未知错误');
    }
  }

  init();
})();
