---
home: true
heroImage: /logo.svg
actionText: Начать знакомство
actionLink: /guide/

altActionText: Подробнее
altActionLink: /guide/why

features:
  - title: 💡 Мгновенный запуск сервера
    details: On demand file serving over native ESM, no bundling required!
  - title: ⚡️ Молниеносный HMR
    details: Hot Module Replacement (HMR) that stays fast regardless of app size.
  - title: 🛠️ Богатые возможности
    details: Поддержка из коробки TypeScript, JSX, CSS и др.
  - title: 📦 Оптимизированная сборка
    # details: Pre-configured Rollup build with multi-page and library mode support.
    details: Предварительно настроенные Rollup сборки с поддержкой многостраничного и библиотечного режимов.
  - title: 🔩 Универсальные плагины
    details: Rollup-superset plugin interface shared between dev and build.
  - title: 🔑 Полностью типизированный API
    details: Гибкий программный API с полной типизацией TypeScript.
footer: MIT Licensed | Copyright © 2019-present Evan You & Vite Contributors
---

<div class="frontpage sponsors">
  <h2>Спонсоры</h2>
  <a v-for="{ href, src, name, id } of sponsors" :href="href" target="_blank" rel="noopener" aria-label="sponsor-img">
    <img :src="src" :alt="name" :id="`sponsor-${id}`">
  </a>
  <br>
  <a href="https://github.com/sponsors/yyx990803" target="_blank" rel="noopener">Стать спонсором на GitHub</a>
</div>

<script setup>
import sponsors from './.vitepress/theme/sponsors.json'
</script>
