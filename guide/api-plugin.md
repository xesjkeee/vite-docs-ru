# API для плагинов

Плагины Vite расширяют хорошо проработанный интерфейс плагинов Rollup, добавляя туда пару своих опций. В результаты вы можете написать плагин Vite, который будет работать как во время разработки, так и во время сборки.

**Мы рекомендуем сначала пройтись по [документации плагинов Rollup](https://rollupjs.org/guide/en/#plugin-development), прежде чем читать разделы ниже.**

## Конвенции

Если плагин не использует хуки Vite и его можно реализовать как [совместимый плагин Rollup](#rollup-plugin-compatibility), то рекомендуется использовать [конвенцию именования плагинов Rollup](https://rollupjs.org/guide/en/#conventions).

- Плагины Rollup должны иметь четкое название с префиксом `rollup-plugin-`.
- В package.json должны быть ключевые слова `rollup-plugin` и `vite-plugin`.

Благодаря этому плагин можно использовать в проектах, которые используют только Rollup или WMR

Для плагинов Vite

- Плагины Vite должны иметь четкое название с префиксом `vite-plugin-`.
- В package.json должно быть ключевое слово `vite-plugin`.
- В документации плагина должен быть раздел, описывающий, почему данный плагин можно использовать только с Vite (например, он использует специфичные для Vite хуки)

Если ваш плагин будет работать только с каким-то фреймворков, то название фреймворка должно быть частью префикса

- префикс `vite-plugin-vue-` для плагинов Vue
- префикс `vite-plugin-react-` для плагинов React
- префикс `vite-plugin-svelte-` для плагинов Svelte

## Настройки плагинов

Пользователи будут добавлять плагин в `devDependencies` своего проекта и настраивать их с помощью опции `plugins`.

```js
// vite.config.js
import vitePlugin from 'vite-plugin-feature'
import rollupPlugin from 'rollup-plugin-feature'

export default {
  plugins: [vitePlugin(), rollupPlugin()]
}
```

Плагины, возвращающие `falsy`-значения, будут проигнорированы. Так можно легко активировать или деактировать плагины.

`plugins` также могут включать несколько плагинов в качестве одного элемента. Это удобно для реализации какого-нибудь сложного функционала с использованием несколько плагинов (например, интеграция с фреймворком). Vite автоматически сделает его плоским.

```js
// framework-plugin
import frameworkRefresh from 'vite-plugin-framework-refresh'
import frameworkDevtools from 'vite-plugin-framework-devtools'

export default function framework(config) {
  return [frameworkRefresh(config), frameworkDevTools(config)]
}
```

```js
// vite.config.js
import framework from 'vite-plugin-framework'

export default {
  plugins: [framework()]
}
```

## Простые примеры

:::tip ПРИМЕЧАНИЕ
Существует конвенция выкладывать плагины Vite/Rollup в виде функции, которая возвращает объект плагина. Такая функция может получать настройки, которые позволяют пользователю управлять поведением плагина.
:::

### Импортирование виртуального файла

```js
export default function myPlugin() {
  const virtualFileId = '@my-virtual-file'

  return {
    name: 'my-plugin', // обязательное поле, будет показываться в ошиках
    resolveId(id) {
      if (id === virtualFileId) {
        return virtualFileId
      }
    },
    load(id) {
      if (id === virtualFileId) {
        return `export const msg = "из виртуального файла"`
      }
    }
  }
}
```

Этот плагин позволяет импортировать файл в JavaScript:

```js
import { msg } from '@my-virtual-file'

console.log(msg)
```

### Преобразование нестандартных типов файла

```js
const fileRegex = /\.(my-file-ext)$/

export default function myPlugin() {
  return {
    name: 'transform-file',

    transform(src, id) {
      if (fileRegex.test(id)) {
        return {
          code: compileFileToJS(src),
          map: null // если возможно, стоит предоставить source map
        }
      }
    }
  }
}
```

## Универсальные хуки

Во время разработки сервер Vite создает контейнер плагина, который вызывает [хуки сборки Rollup](https://rollupjs.org/guide/en/#build-hooks) по той же логике, как это делает сам Rollup:

Следующие хуки вызываются один раз, когда сервер стартует:

- [`options`](https://rollupjs.org/guide/en/#options)
- [`buildStart`](https://rollupjs.org/guide/en/#buildstart)

Следующие хуки вызываются для каждого нового скачанного модуля:

- [`resolveId`](https://rollupjs.org/guide/en/#resolveid)
- [`load`](https://rollupjs.org/guide/en/#load)
- [`transform`](https://rollupjs.org/guide/en/#transform)

Следующие хуки вызываются, когда сервер отключается:

- [`buildEnd`](https://rollupjs.org/guide/en/#buildend)
- [`closeBundle`](https://rollupjs.org/guide/en/#closebundle)

Стоит заметить, что хук [`moduleParsed`](https://rollupjs.org/guide/en/#moduleparsed) **не вызывается** во время разработки, потому что Vite старается не парсить полное AST ради улучшенной производительности.

[Хуки генерации вывода](https://rollupjs.org/guide/en/#output-generation-hooks) (за исключение `closeBundle`) **не вызываются** во время разработки. Можно сделать аналогию, будто сервер Vite вызывает только `rollup.rollup()`, без вызова `bundle.generate()`.

## Vite Specific Hooks

Vite plugins can also provide hooks that serve Vite-specific purposes. These hooks are ignored by Rollup.

### `config`

- **Type:** `(config: UserConfig, env: { mode: string, command: string }) => UserConfig | null | void`
- **Kind:** `sync`, `sequential`

  Modify Vite config before it's resolved. The hook receives the raw user config (CLI options merged with config file) and the current config env which exposes the `mode` and `command` being used. It can return a partial config object that will be deeply merged into existing config, or directly mutate the config (if the default merging cannot achieve the desired result).

  **Example**

  ```js
  // return partial config (recommended)
  const partialConfigPlugin = () => ({
    name: 'return-partial',
    config: () => ({
      alias: {
        foo: 'bar'
      }
    })
  })

  // mutate the config directly (use only when merging doesn't work)
  const mutateConfigPlugin = () => ({
    name: 'mutate-config',
    config(config, { command }) {
      if (command === 'build') {
        config.root = __dirname
      }
    }
  })
  ```

  ::: warning Note
  User plugins are resolved before running this hook so injecting other plugins inside the `config` hook will have no effect.
  :::

### `configResolved`

- **Type:** `(config: ResolvedConfig) => void | Promise<void>`
- **Kind:** `async`, `parallel`

  Called after the Vite config is resolved. Use this hook to read and store the final resolved config. It is also useful when the plugin needs to do something different based the command is being run.

  **Example:**

  ```js
  const examplePlugin = () => {
    let config

    return {
      name: 'read-config',

      configResolved(resolvedConfig) {
        // store the resolved config
        config = resolvedConfig
      },

      // use stored config in other hooks
      transform(code, id) {
        if (config.command === 'serve') {
          // serve: plugin invoked by dev server
        } else {
          // build: plugin invoked by Rollup
        }
      }
    }
  }
  ```

### `configureServer`

- **Type:** `(server: ViteDevServer) => (() => void) | void | Promise<(() => void) | void>`
- **Kind:** `async`, `sequential`
- **See also:** [ViteDevServer](./api-javascript#vitedevserver)

  Hook for configuring the dev server. The most common use case is adding custom middlewares to the internal [connect](https://github.com/senchalabs/connect) app:

  ```js
  const myPlugin = () => ({
    name: 'configure-server',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // custom handle request...
      })
    }
  })
  ```

  **Injecting Post Middleware**

  The `configureServer` hook is called before internal middlewares are installed, so the custom middlewares will run before internal middlewares by default. If you want to inject a middleware **after** internal middlewares, you can return a function from `configureServer`, which will be called after internal middlewares are installed:

  ```js
  const myPlugin = () => ({
    name: 'configure-server',
    configureServer(server) {
      // return a post hook that is called after internal middlewares are
      // installed
      return () => {
        server.middlewares.use((req, res, next) => {
          // custom handle request...
        })
      }
    }
  })
  ```

  **Storing Server Access**

  In some cases, other plugin hooks may need access to the dev server instance (e.g. accessing the web socket server, the file system watcher, or the module graph). This hook can also be used to store the server instance for access in other hooks:

  ```js
  const myPlugin = () => {
    let server
    return {
      name: 'configure-server',
      configureServer(_server) {
        server = _server
      },
      transform(code, id) {
        if (server) {
          // use server...
        }
      }
    }
  }
  ```

  Note `configureServer` is not called when running the production build so your other hooks need to guard against its absence.

### `transformIndexHtml`

- **Type:** `IndexHtmlTransformHook | { enforce?: 'pre' | 'post' transform: IndexHtmlTransformHook }`
- **Kind:** `async`, `sequential`

  Dedicated hook for transforming `index.html`. The hook receives the current HTML string and a transform context. The context exposes the [`ViteDevServer`](./api-javascript#vitedevserver) instance during dev, and exposes the Rollup output bundle during build.

  The hook can be async and can return one of the following:

  - Transformed HTML string
  - An array of tag descriptor objects (`{ tag, attrs, children }`) to inject to the existing HTML. Each tag can also specify where it should be injected to (default is prepending to `<head>`)
  - An object containing both as `{ html, tags }`

  **Basic Example**

  ```js
  const htmlPlugin = () => {
    return {
      name: 'html-transform',
      transformIndexHtml(html) {
        return html.replace(
          /<title>(.*?)<\/title>/,
          `<title>Title replaced!</title>`
        )
      }
    }
  }
  ```

  **Full Hook Signature:**

  ```ts
  type IndexHtmlTransformHook = (
    html: string,
    ctx: {
      path: string
      filename: string
      server?: ViteDevServer
      bundle?: import('rollup').OutputBundle
      chunk?: import('rollup').OutputChunk
    }
  ) =>
    | IndexHtmlTransformResult
    | void
    | Promise<IndexHtmlTransformResult | void>

  type IndexHtmlTransformResult =
    | string
    | HtmlTagDescriptor[]
    | {
        html: string
        tags: HtmlTagDescriptor[]
      }

  interface HtmlTagDescriptor {
    tag: string
    attrs?: Record<string, string | boolean>
    children?: string | HtmlTagDescriptor[]
    /**
     * default: 'head-prepend'
     */
    injectTo?: 'head' | 'body' | 'head-prepend' | 'body-prepend'
  }
  ```

### `handleHotUpdate`

- **Type:** `(ctx: HmrContext) => Array<ModuleNode> | void | Promise<Array<ModuleNode> | void>`

  Perform custom HMR update handling. The hook receives a context object with the following signature:

  ```ts
  interface HmrContext {
    file: string
    timestamp: number
    modules: Array<ModuleNode>
    read: () => string | Promise<string>
    server: ViteDevServer
  }
  ```

  - `modules` is an array of modules that are affected by the changed file. It's an array because a single file may map to multiple served modules (e.g. Vue SFCs).

  - `read` is an async read function that returns the content of the file. This is provided because on some systems, the file change callback may fire too fast before the editor finishes updating the file and direct `fs.readFile` will return empty content. The read function passed in normalizes this behavior.

  The hook can choose to:

  - Filter and narrow down the affected module list so that the HMR is more accurate.

  - Return an empty array and perform complete custom HMR handling by sending custom events to the client:

    ```js
    handleHotUpdate({ server }) {
      server.ws.send({
        type: 'custom',
        event: 'special-update',
        data: {}
      })
      return []
    }
    ```

    Client code should register corresponding handler using the [HMR API](./api-hmr) (this could be injected by the same plugin's `transform` hook):

    ```js
    if (import.meta.hot) {
      import.meta.hot.on('special-update', (data) => {
        // perform custom update
      })
    }
    ```

## Порядок плагина

Плагин Vite может дополнительно указать свойство `enforce` (как в webpack loaders) для настройки порядка вызова. Значение `enforce` может быть или `"pre"`, или `"post"`. Плагины будут вызываться в следующем порядке:

- Alias
- Пользовательские плагины с `enforce: 'pre'`
- Внутренние плагины Vite
- Пользовательские плагины без значения `enforce`
- Плагины сборки Vite
- Пользовательские плагины с `enforce: 'post'`
- Плагины Vite, выполняемые после сборки (minify, manifest, reporting)

## Применение в определенных условиях

По-умолчанию, плагины запускаются и на `serve`, и на `build`. Но если плагин должен примениться только на одной из стадий, используйте свойство `apply`, чтобы ограничить вызов во время `'build'` или `'serve'`:

```js
function myPlugin() {
  return {
    name: 'build-only',
    apply: 'build' // или 'serve'
  }
}
```

## Совместимость плагинов Rollup

Большинство плагинов Rollup будут работать как плагины Vite (например, `@rollup/plugin-alias` или `@rollup/plugin-json`), но не все, т.к. хуки некоторых плагинов не имеют смысла в контексте несобираемого сервера разработки.

В целом, пока плагин Rollup соответствует следующим критериям, он должен работать как плагин Vite:

- Он не использует хук [`moduleParsed`](https://rollupjs.org/guide/en/#moduleparsed).
- Он не имеет сильной связи между хуками фаз сборки и вывода.

Если плагин Rollup имеет смысл только на фазе сорки, то его лучше указать через `build.rollupOptions.plugins`.

Вы также можете расширить существующий плагин Rollup свойствами плагина Vite:

```js
// vite.config.js
import example from 'rollup-plugin-example'

export default {
  plugins: [
    {
      ...example(),
      enforce: 'post',
      apply: 'build'
    }
  ]
}
```

Посмотрите список поддерживаемых официальных плагинов Rollup с инструкциями, как их использовать, на [Vite Rollup Plugins](https://vite-rollup-plugins.patak.dev).

## Path normalization

Vite normalizes paths while resolving ids to use POSIX separators ( / ) while preserving the volume in Windows. On the other hand, Rollup keeps resolved paths untouched by default, so resolved ids have win32 separators ( \\ ) in Windows. However, Rollup plugins use a [`normalizePath` utility function](https://github.com/rollup/plugins/tree/master/packages/pluginutils#normalizepath) from `@rollup/pluginutils` internally, which converts separators to POSIX before performing comparisons. This means that when these plugins are used in Vite, the `include` and `exclude` config pattern and other similar paths against resolved ids comparisons work correctly.

So, for Vite plugins, when comparing paths against resolved ids it is important to first normalize the paths to use POSIX separators. An equivalent `normalizePath` utility function is exported from the `vite` module.

```js
import { normalizePath } from 'vite'

normalizePath('foo\\bar') // 'foo/bar'
normalizePath('foo/bar') // 'foo/bar'
```
