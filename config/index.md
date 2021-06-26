# Конфигурация Vite

## Файл конфигурации

### Определение файла конфигурации

При запуске `vite` из командной строки, Vite автоматически попытается определить файл конфигурации с названием `vite.config.js` в [корне проекта](/guide/#index-html-и-корень-проекта).

Самая базовая конфигурация выглядит следующи образом:

```js
// vite.config.js
export default {
  // параметры конфигурации
}
```

Vite поддерживает синтаксис ES-модулей в файле конфигурации даже если проект не использует нативный Node ESM через `type: "module"`. В таком случае файл будет автоматически обработан перед загрузкой.

Вы также можете указать файл конфигурации с помощью опции CLI `--config` (определяется относительно `cwd`):

```bash
vite --config my-config.js
```

### Intellisense в файле конфигурации

Т.к. Vite идет с типизацией TypeScript, вы можете использовать Intellisense вашей IDE с помощью подсказок jsdoc:


```js
/**
 * @type {import('vite').UserConfig}
 */
const config = {
  // ...
}

export default config
```

Или вы можете использовать хелпер `defineConfig`, который предоставляет intellisense без необходимости использовать аннотации jsdoc:

```js
import { defineConfig } from 'vite'

export default defineConfig({
  // ...
})
```

Vite также поддерживает файлы конфигурации с TypeScript. Вы можете использовать `vite.config.ts` вместе с хелпером `defineConfig`.

### Условная конфигурация

Если конфигурация должна изменяться в зависимости от команды (`serve` или `build`) или [режима](/guide/env-and-mode), то можно экспортировать функцию:

```js
export default ({ command, mode }) => {
  if (command === 'serve') {
    return {
      // конфигурация для serve
    }
  } else {
    return {
      // конфигурация для build
    }
  }
}
```

### Асинхронная конфигурация

Если для настройки нужно вызвать асинхронную функцию, то файл конфигурации может экспортировать асинхронную функцию:

```js
export default async ({ command, mode }) => {
  const data = await asyncFunction()
  return {
    // конфигурация
  }
}
```

## Общие параметры

### root

- **Тип:** `string`
- **По-умолчанию:** `process.cwd()`

  Директория корня проекта (где лежит `index.html`). Может быть абсолютным путем или относительным файлу конфигурации.

  См. [корень проекта](/guide/#index-html-и-корень-проекта) для большей информации.

### base

- **Тип:** `string`
- **По-умолчанию:** `/`

  Публичный базовый путь, по которому отдается сайт в режиме разработки или production. Допустимые значения:

  - Абсолютный URL, например, `/foo/`
  - Полный URL, например, `https://foo.com/`
  - Пустая строка или `./` (при встроенном развертывании)

  См. [публичный базовый путь](/guide/build#пубnичный-базовый-путь) для большей информации.

### mode

- **Тип:** `string`
- **По-умолчанию:** `'development'` для serve, `'production'` для build

  Это свойство перезаписывает режим для обеих команд: `serve` и `build`! Это значение также можно перезаписать с помощью опции командной строки `--mode`.

  См. [Переменные окружения и режимы](/guide/env-and-mode) для большей информации.

### define

- **Тип:** `Record<string, string>`

  Определяет замену глобальных констант. Определяемые здесь значения будут заданы как глобальные во время разработки, но будут статически заменены во время сборки.

  - Начиная с `2.0.0-beta.70`, строковые значения используются как необработанные выражения, поэтому при определении строковой константы её нужно явно обернуть в кавычки (например, с помощью `JSON.stringify`).

  - Замена производится только если подходящее значение обёрнуто в границы слова (`\b`).

  Из-за того, что этот функционал реализован как прямая замена текста без какого-либо синтаксического анализа, мы рекомендуем использовать `define` только для КОНСТАНТ.

  Например, хорошим примером будут `process.env.FOO` и `__APP_VERSION__`. Но `process` или `global` лучше не вставлять в этот параметр. Вместо этого лучше использовать полифил или shim.

### plugins

- **Тип:** ` (Plugin | Plugin[])[]`

  Массив плагинов для использования внутри приложения. Плагины, которые возвращают `falsy`-значения, игнорируются. Массив плагинов сглаживается в плоский массив. См. [API для плагинов](/guide/api-plugin) для более подробной информации по плагинам Vite.

### publicDir

- **Тип:** `string`
- **По-умолчанию:** `"public"`

  Директория, которая отдает статические ресурсы. Файлы из этой директории отдаются по пути `/` во время разработки и копируются в корень `outDir` во время сборки, но абсолютно всегда отдаются такими, какие есть, - без каких-либо трансформаций. Значение может быть абсолютным путем файловой системы или относительным к корню проекта.

  См. [директорию `public`](/guide/assets#директория-public) для более подробной информации.

### cacheDir

- **Тип:** `string`
- **По-умолчанию:** `"node_modules/.vite"`

  Директория, в которую сохраняются кешированные файлы. В этой директории хранятся пре-собранные зависимости и другие кешированные файлы, сгенерированные Vite, которые улучшают производительность. Вы можете использовать флаг `--force` или вручную удалить директорию, чтобы пересоздать закешированные файлы. Значение может быть абсолютным путем файловой системы или относительным к корню проекта.

### resolve.alias

- **Тип:**
  `Record<string, string> | Array<{ find: string | RegExp, replacement: string }>`

  Будет передано в плагин `@rollup/plugin-alias` как [опция "entries"](https://github.com/rollup/plugins/tree/master/packages/alias#entries). Может быть либо объектом, либо массивом в формате `{ find, replacement }`.

  Создавая алиас, всегда используйте абсолютные пути. Относительные алиасы будут использованы "как есть" и не будут преобразованы в пути файловой системы.

  Более продвинутые замены путей можно достичь с помощью [плагинов](/guide/api-plugin).

### resolve.dedupe

- **Тип:** `string[]`

  Если в вашем приложении есть несколько копий одной и той же зависимости (скорее всего, из-за поднятия или связанных пакетов в монорепозитории), используйте эту опцию, чтобы Vite всегда определял перечисленные зависимости к одной копии (из корня проекта).

### resolve.conditions

- **Type:** `string[]`

  Additional allowed conditions when resolving [Conditional Exports](https://nodejs.org/api/packages.html#packages_conditional_exports) from a package.

  A package with conditional exports may have the following `exports` field in its `package.json`:

  ```json
  {
    "exports": {
      ".": {
        "import": "./index.esm.js",
        "require": "./index.cjs.js"
      }
    }
  }
  ```

  Here, `import` and `require` are "conditions". Conditions can be nested and should be specified from most specific to least specific.

  Vite has a list of "allowed conditions" and will match the first condition that is in the allowed list. The default allowed conditions are: `import`, `module`, `browser`, `default`, and `production/development` based on current mode. The `resolve.conditions` config option allows specifying additional allowed conditions.

### resolve.mainFields

- **Type:** `string[]`
- **Default:** `['module', 'jsnext:main', 'jsnext']`

  List of fields in `package.json` to try when resolving a package's entry point. Note this takes lower precedence than conditional exports resolved from the `exports` field: if an entry point is successfully resolved from `exports`, the main field will be ignored.

### resolve.extensions

- **Type:** `string[]`
- **Default:** `['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']`

  List of file extensions to try for imports that omit extensions. Note it is **NOT** recommended to omit extensions for custom import types (e.g. `.vue`) since it can interfere with IDE and type support.

### css.modules

- **Type:**

  ```ts
  interface CSSModulesOptions {
    scopeBehaviour?: 'global' | 'local'
    globalModulePaths?: string[]
    generateScopedName?:
      | string
      | ((name: string, filename: string, css: string) => string)
    hashPrefix?: string
    /**
     * default: 'camelCaseOnly'
     */
    localsConvention?: 'camelCase' | 'camelCaseOnly' | 'dashes' | 'dashesOnly'
  }
  ```

  Configure CSS modules behavior. The options are passed on to [postcss-modules](https://github.com/css-modules/postcss-modules).

### css.postcss

- **Type:** `string | (postcss.ProcessOptions & { plugins?: postcss.Plugin[] })`

  Inline PostCSS config (expects the same format as `postcss.config.js`), or a custom path to search PostCSS config from (default is project root). The search is done using [postcss-load-config](https://github.com/postcss/postcss-load-config).

  Note if an inline config is provided, Vite will not search for other PostCSS config sources.

### css.preprocessorOptions

- **Type:** `Record<string, object>`

  Specify options to pass to CSS pre-processors. Example:

  ```js
  export default {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `$injectedColor: orange;`
        }
      }
    }
  }
  ```

### json.namedExports

- **Type:** `boolean`
- **Default:** `true`

  Whether to support named imports from `.json` files.

### json.stringify

- **Type:** `boolean`
- **Default:** `false`

  If set to `true`, imported JSON will be transformed into `export default JSON.parse("...")` which is significantly more performant than Object literals, especially when the JSON file is large.

  Enabling this disables named imports.

### esbuild

- **Type:** `ESBuildOptions | false`

  `ESBuildOptions` extends [ESbuild's own transform options](https://esbuild.github.io/api/#transform-api). The most common use case is customizing JSX:

  ```js
  export default {
    esbuild: {
      jsxFactory: 'h',
      jsxFragment: 'Fragment'
    }
  }
  ```

  By default, ESBuild is applied to `ts`, `jsx` and `tsx` files. You can customize this with `esbuild.include` and `esbuild.exclude`, both of which expects type of `string | RegExp | (string | RegExp)[]`.

  In addition, you can also use `esbuild.jsxInject` to automatically inject JSX helper imports for every file transformed by ESBuild:

  ```js
  export default {
    esbuild: {
      jsxInject: `import React from 'react'`
    }
  }
  ```

  Set to `false` to disable ESbuild transforms.

### assetsInclude

- **Type:** `string | RegExp | (string | RegExp)[]`
- **Related:** [Обработка статических ресурсов](/guide/assets)

  Specify additional file types to be treated as static assets so that:

  - They will be excluded from the plugin transform pipeline when referenced from HTML or directly requested over `fetch` or XHR.

  - Importing them from JS will return their resolved URL string (this can be overwritten if you have a `enforce: 'pre'` plugin to handle the asset type differently).

  The built-in asset type list can be found [here](https://github.com/vitejs/vite/blob/main/packages/vite/src/node/constants.ts).

### logLevel

- **Type:** `'info' | 'warn' | 'error' | 'silent'`

  Adjust console output verbosity. Default is `'info'`.

### clearScreen

- **Type:** `boolean`
- **Default:** `true`

  Set to `false` to prevent Vite from clearing the terminal screen when logging certain messages. Via command line, use `--clearScreen false`.

### envDir

- **Type:** `string`
- **Default:** `root`

  The directory from which `.env` files are loaded. Can be an absolute path, or a path relative to the project root.

  See [here](/guide/env-and-mode#env-files) for more about environment files.

## Server Options

### server.host

- **Type:** `string`
- **Default:** `'127.0.0.1'`

  Specify which IP addresses the server should listen on.
  Set this to `0.0.0.0` to listen on all addresses, including LAN and public addresses.

  This can be set via the CLI using `--host 0.0.0.0` or `--host`.

### server.port

- **Type:** `number`

  Specify server port. Note if the port is already being used, Vite will automatically try the next available port so this may not be the actual port the server ends up listening on.

### server.strictPort

- **Type:** `boolean`

  Set to `true` to exit if port is already in use, instead of automatically try the next available port.

### server.https

- **Type:** `boolean | https.ServerOptions`

  Enable TLS + HTTP/2. Note this downgrades to TLS only when the [`server.proxy` option](#server-proxy) is also used.

  The value can also be an [options object](https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener) passed to `https.createServer()`.

### server.open

- **Type:** `boolean | string`

  Automatically open the app in the browser on server start. When the value is a string, it will be used as the URL's pathname.

  **Example:**

  ```js
  export default {
    server: {
      open: '/docs/index.html'
    }
  }
  ```

### server.proxy

- **Type:** `Record<string, string | ProxyOptions>`

  Configure custom proxy rules for the dev server. Expects an object of `{ key: options }` pairs. If the key starts with `^`, it will be interpreted as a `RegExp`.

  Uses [`http-proxy`](https://github.com/http-party/node-http-proxy). Full options [here](https://github.com/http-party/node-http-proxy#options).

  **Example:**

  ```js
  export default {
    server: {
      proxy: {
        // string shorthand
        '/foo': 'http://localhost:4567/foo',
        // with options
        '/api': {
          target: 'http://jsonplaceholder.typicode.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
        // with RegEx
        '^/fallback/.*': {
          target: 'http://jsonplaceholder.typicode.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/fallback/, '')
        }
      }
    }
  }
  ```

### server.cors

- **Type:** `boolean | CorsOptions`

  Configure CORS for the dev server. This is enabled by default and allows any origin. Pass an [options object](https://github.com/expressjs/cors) to fine tune the behavior or `false` to disable.

### server.force

- **Type:** `boolean`
- **Related:** [Dependency Pre-Bundling](/guide/dep-pre-bundling)

  Set to `true` to force dependency pre-bundling.

### server.hmr

- **Type:** `boolean | { protocol?: string, host?: string, port?: number, path?: string, timeout?: number, overlay?: boolean, clientPort?: number, server?: Server }`

  Disable or configure HMR connection (in cases where the HMR websocket must use a different address from the http server).

  Set `server.hmr.overlay` to `false` to disable the server error overlay.

  `clientPort` is an advanced option that overrides the port only on the client side, allowing you to serve the websocket on a different port than the client code looks for it on. Useful if you're using an SSL proxy in front of your dev server.

  When using `server.middlewareMode` and `server.https`, setting `server.hmr.server` to your HTTPS server will process HMR secure connection requests through your server. This can be helpful when using self-signed certificates.


### server.watch

- **Type:** `object`

  File system watcher options to pass on to [chokidar](https://github.com/paulmillr/chokidar#api).

### server.middlewareMode

- **Type:** `'ssr' | 'html'`

  Create Vite server in middleware mode. (without a HTTP server)

  - `'ssr'` will disable Vite's own HTML serving logic so that you should serve `index.html` manually.
  - `'html'` will enable Vite's own HTML serving logic.

- **Related:** [SSR - Setting Up the Dev Server](/guide/ssr#setting-up-the-dev-server)

- **Example:**
```js
const express = require('express')
const { createServer: createViteServer } = require('vite')

async function createServer() {
  const app = express()

  // Create vite server in middleware mode.
  const vite = await createViteServer({
    server: { middlewareMode: 'ssr' }
  })
  // Use vite's connect instance as middleware
  app.use(vite.middlewares)

  app.use('*', async (req, res) => {
    // If `middlewareMode` is `'ssr'`, should serve `index.html` here.
    // If `middlewareMode` is `'html'`, there is no need to serve `index.html`
    // because Vite will do that.
  })
}

createServer()
```

### server.fsServe.strict

- **Experimental**
- **Type:** `boolean`
- **Default:** `false` (will change to `true` in future versions)

  Restrict serving files outside of workspace root.

### server.fsServe.root

- **Experimental**
- **Type:** `string`

  Restrict files that could be served via `/@fs/`. When `server.fsServe.strict` is set to `true`, accessing files outside this directory will result in a 403.

  Vite will search for the root of the potential workspace and use it as default. A valid workspace met the following conditions, otherwise will fallback to the [project root](/guide/#index-html-and-project-root).

  - contains `workspaces` field in `package.json`
  - contains one of the following file
    - `pnpm-workspace.yaml`

  Accepts a path to specify the custom workspace root. Could be a absolute path or a path relative to [project root](/guide/#index-html-and-project-root). For example

  ```js
  export default {
    server: {
      fsServe: {
        // Allow serving files from one level up to the project root
        root: '..'
      }
    }
  }
  ```

## Build Options

### build.target

- **Type:** `string`
- **Default:** `'modules'`
- **Related:** [Browser Compatibility](/guide/build#browser-compatibility)

  Browser compatibility target for the final bundle. The default value is a Vite special value, `'modules'`, which targets [browsers with native ES module support](https://caniuse.com/es6-module).

  Another special value is 'esnext' - which only performs minimal transpiling (for minification compat) and assumes native dynamic imports support.

  The transform is performed with esbuild and the value should be a valid [esbuild target option](https://esbuild.github.io/api/#target). Custom targets can either be a ES version (e.g. `es2015`), a browser with version (e.g. `chrome58`), or an array of multiple target strings.

  Note the build will fail if the code contains features that cannot be safely transpiled by esbuild. See [esbuild docs](https://esbuild.github.io/content-types/#javascript) for more details.

### build.polyfillDynamicImport

- **Type:** `boolean`
- **Default:** `false`

  Whether to automatically inject [dynamic import polyfill](https://github.com/GoogleChromeLabs/dynamic-import-polyfill).

  If set to true, the polyfill is auto injected into the proxy module of each `index.html` entry. If the build is configured to use a non-html custom entry via `build.rollupOptions.input`, then it is necessary to manually import the polyfill in your custom entry:

  ```js
  import 'vite/dynamic-import-polyfill'
  ```

  When using [`@vitejs/plugin-legacy`](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy), the plugin sets this option to `true` automatically.

  Note: the polyfill does **not** apply to [Library Mode](/guide/build#library-mode). If you need to support browsers without native dynamic import, you should probably avoid using it in your library.

### build.outDir

- **Type:** `string`
- **Default:** `dist`

  Specify the output directory (relative to [project root](/guide/#index-html-and-project-root)).

### build.assetsDir

- **Type:** `string`
- **Default:** `assets`

  Specify the directory to nest generated assets under (relative to `build.outDir`).

### build.assetsInlineLimit

- **Type:** `number`
- **Default:** `4096` (4kb)

  Imported or referenced assets that are smaller than this threshold will be inlined as base64 URLs to avoid extra http requests. Set to `0` to disable inlining altogether.

  ::: tip Note
  If you specify `build.lib`, `build.assetsInlineLimit` will be ignored and assets will always be inlined, regardless of file size.
  :::

### build.cssCodeSplit

- **Type:** `boolean`
- **Default:** `true`

  Enable/disable CSS code splitting. When enabled, CSS imported in async chunks will be inlined into the async chunk itself and inserted when the chunk is loaded.

  If disabled, all CSS in the entire project will be extracted into a single CSS file.

### build.sourcemap

- **Type:** `boolean | 'inline'`
- **Default:** `false`

  Generate production source maps.

### build.rollupOptions

- **Type:** [`RollupOptions`](https://rollupjs.org/guide/en/#big-list-of-options)

  Directly customize the underlying Rollup bundle. This is the same as options that can be exported from a Rollup config file and will be merged with Vite's internal Rollup options. See [Rollup options docs](https://rollupjs.org/guide/en/#big-list-of-options) for more details.

### build.commonjsOptions

- **Type:** [`RollupCommonJSOptions`](https://github.com/rollup/plugins/tree/master/packages/commonjs#options)

  Options to pass on to [@rollup/plugin-commonjs](https://github.com/rollup/plugins/tree/master/packages/commonjs).

### build.lib

- **Type:** `{ entry: string, name?: string, formats?: ('es' | 'cjs' | 'umd' | 'iife')[], fileName?: string }`
- **Related:** [Library Mode](/guide/build#library-mode)

  Build as a library. `entry` is required since the library cannot use HTML as entry. `name` is the exposed global variable and is required when `formats` includes `'umd'` or `'iife'`. Default `formats` are `['es', 'umd']`. `fileName` is the name of the package file output, default `fileName` is the name option of package.json

### build.manifest

- **Type:** `boolean`
- **Default:** `false`
- **Related:** [Backend Integration](/guide/backend-integration)

  When set to `true`, the build will also generate a `manifest.json` file that contains mapping of non-hashed asset filenames to their hashed versions, which can then be used by a server framework to render the correct asset links.

### build.minify

- **Type:** `boolean | 'terser' | 'esbuild'`
- **Default:** `'terser'`

  Set to `false` to disable minification, or specify the minifier to use. The default is [Terser](https://github.com/terser/terser) which is slower but produces smaller bundles in most cases. Esbuild minification is significantly faster, but will result in slightly larger bundles.

### build.terserOptions

- **Type:** `TerserOptions`

  Additional [minify options](https://terser.org/docs/api-reference#minify-options) to pass on to Terser.

### build.cleanCssOptions

- **Type:** `CleanCSS.Options`

  Constructor options to pass on to [clean-css](https://github.com/jakubpawlowicz/clean-css#constructor-options).

### build.write

- **Type:** `boolean`
- **Default:** `true`

  Set to `false` to disable writing the bundle to disk. This is mostly used in [programmatic `build()` calls](/guide/api-javascript#build) where further post processing of the bundle is needed before writing to disk.

### build.emptyOutDir

- **Type:** `boolean`
- **Default:** `true` if `outDir` is inside `root`

  By default, Vite will empty the `outDir` on build if it is inside project root. It will emit a warning if `outDir` is outside of root to avoid accidentially removing important files. You can explicitly set this option to suppress the warning. This is also available via command line as `--emptyOutDir`.

### build.brotliSize

- **Type:** `boolean`
- **Default:** `true`

  Enable/disable brotli-compressed size reporting. Compressing large output files can be slow, so disabling this may increase build performance for large projects.

### build.chunkSizeWarningLimit

- **Type:** `number`
- **Default:** `500`

  Limit for chunk size warnings (in kbs).

### build.watch

- **Type:** [`WatcherOptions`](https://rollupjs.org/guide/en/#watch-options)`| null`
- **Default:** `null`

  Set to `{}` to enable rollup watcher. This is mostly used in cases that involve build-only plugins or integrations processes.

## Dep Optimization Options

- **Related:** [Dependency Pre-Bundling](/guide/dep-pre-bundling)

### optimizeDeps.entries

- **Type:** `string | string[]`

  By default, Vite will crawl your index.html to detect dependencies that need to be pre-bundled. If build.rollupOptions.input is specified, Vite will crawl those entry points instead.

  If neither of these fit your needs, you can specify custom entries using this option - the value should be a [fast-glob pattern](https://github.com/mrmlnc/fast-glob#basic-syntax) or array of patterns that are relative from vite project root. This will overwrite default entries inference.

### optimizeDeps.exclude

- **Type:** `string[]`

  Dependencies to exclude from pre-bundling.

### optimizeDeps.include

- **Type:** `string[]`

  By default, linked packages not inside `node_modules` are not pre-bundled. Use this option to force a linked package to be pre-bundled.

### optimizeDeps.keepNames

- **Type:** `boolean`
- **Default:** `false`

  The bundler sometimes needs to rename symbols to avoid collisions.
  Set this to `true` to keep the `name` property on functions and classes.
  See [`keepNames`](https://esbuild.github.io/api/#keep-names).

## SSR Options

:::warning Experimental
SSR options may be adjusted in minor releases.
:::

- **Related:** [SSR Externals](/guide/ssr#ssr-externals)

### ssr.external

- **Type:** `string[]`

  Force externalize dependencies for SSR.

### ssr.noExternal

- **Type:** `string[]`

  Prevent listed dependencies from being externalized for SSR.

### ssr.target

- **Type:** `'node' | 'webworker'`
- **Default:** `node`

  Build target for the SSR server.
