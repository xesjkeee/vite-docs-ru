// @ts-check

/**
 * @type {import('vitepress').UserConfig}
 */
module.exports = {
  title: 'Vite',
  description: 'Frontend инструмент нового поколения',
  head: [['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }]],
  themeConfig: {
    repo: 'vitejs/vite',
    logo: '/logo.svg',
    docsDir: 'docs',
    docsBranch: 'main',
    editLinks: true,
    editLinkText: 'Редактировать страницу',

    algolia: {
      apiKey: 'b573aa848fd57fb47d693b531297403c',
      indexName: 'vitejs',
      searchParameters: {
        facetFilters: ['tags:en']
      }
    },

    carbonAds: {
      carbon: 'CEBIEK3N',
      placement: 'vitejsdev'
    },

    nav: [
      { text: 'Руководство', link: '/guide/' },
      { text: 'Конфигурация', link: '/config/' },
      { text: 'Плагины', link: '/plugins/' },
      {
        text: 'Ссылки',
        items: [
          {
            text: 'Twitter',
            link: 'https://twitter.com/vite_js'
          },
          {
            text: 'Discord Chat',
            link: 'https://chat.vitejs.dev'
          },
          {
            text: 'Awesome Vite',
            link: 'https://github.com/vitejs/awesome-vite'
          },
          {
            text: 'DEV Community',
            link: 'https://dev.to/t/vite'
          },
          {
            text: 'Rollup Plugins Compat',
            link: 'https://vite-rollup-plugins.patak.dev/'
          },
          {
            text: 'Changelog',
            link: 'https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md'
          }
        ]
      },
      {
        text: 'Языки',
        items: [
          {
            text: 'English',
            link: 'https://vitejs.dev'
          },
          {
            text: '简体中文',
            link: 'https://cn.vitejs.dev'
          }
        ]
      }
    ],

    sidebar: {
      '/config/': 'auto',
      '/plugins': 'auto',
      // catch-all fallback
      '/': [
        {
          text: 'Руководство',
          children: [
            {
              text: 'Почему Vite',
              link: '/guide/why'
            },
            {
              text: 'Руководство',
              link: '/guide/'
            },
            {
              text: 'Возможности',
              link: '/guide/features'
            },
            {
              text: 'Использование плагинов',
              link: '/guide/using-plugins'
            },
            {
              text: 'Предварительная сборка зависимостей',
              link: '/guide/dep-pre-bundling'
            },
            {
              text: 'Обработка статических ресурсов',
              link: '/guide/assets'
            },
            {
              text: 'Сборка для production',
              link: '/guide/build'
            },
            {
              text: 'Публикация статического сайта',
              link: '/guide/static-deploy'
            },
            {
              text: 'Env переменные и режимы',
              link: '/guide/env-and-mode'
            },
            {
              text: 'Server-Side Rendering (SSR)',
              link: '/guide/ssr'
            },
            {
              text: 'Backend Integration',
              link: '/guide/backend-integration'
            },
            {
              text: 'Сравнения',
              link: '/guide/comparisons'
            },
            {
              text: 'Миграция с v1',
              link: '/guide/migration'
            }
          ]
        },
        {
          text: 'API',
          children: [
            {
              text: 'API для плагинов',
              link: '/guide/api-plugin'
            },
            {
              text: 'HMR API',
              link: '/guide/api-hmr'
            },
            {
              text: 'JavaScript API',
              link: '/guide/api-javascript'
            },
            {
              text: 'Конфигурация',
              link: '/config/'
            }
          ]
        }
      ]
    }
  }
}
