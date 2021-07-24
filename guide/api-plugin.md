# API плагинов

Плагины Vite расширяют хорошо проработанный интерфейс плагинов Rollup, добавляя туда неколько своих параметров. В результаты вы можете написать плагин Vite, который будет работать как во время разработки, так и во время сборки.

**Мы рекомендуем сначала пройтись по [документации плагинов Rollup](https://rollupjs.org/guide/en/#plugin-development), прежде чем читать разделы ниже.**

## Соглашения

Если плагин не использует хуки Vite и его можно реализовать как [совместимый плагин Rollup](#rollup-plugin-compatibility), то рекомендуется использовать [соглашение именования плагинов Rollup](https://rollupjs.org/guide/en/#conventions).

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

Пользователи будут добавлять плагины в `devDependencies` своего проекта и настраивать их с помощью параметра `plugins`.

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
Обычно плагин Vite/Rollup создается как фабричная функция, которая возвращает фактический объект плагина. Функция может принимать параметры, позволяющие пользователям настраивать поведение плагина.
:::

### Импортирование виртуального файла

```js
export default function myPlugin() {
  const virtualFileId = '@my-virtual-file'

  return {
    name: 'my-plugin', // обязательное поле, будет показываться в ошибках
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
          map: null // по возможности предоставлять source map
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

Следующие хуки вызываются для каждого нового запрошенного модуля:

- [`resolveId`](https://rollupjs.org/guide/en/#resolveid)
- [`load`](https://rollupjs.org/guide/en/#load)
- [`transform`](https://rollupjs.org/guide/en/#transform)

Следующие хуки вызываются, когда сервер отключается:

- [`buildEnd`](https://rollupjs.org/guide/en/#buildend)
- [`closeBundle`](https://rollupjs.org/guide/en/#closebundle)

Стоит заметить, что хук [`moduleParsed`](https://rollupjs.org/guide/en/#moduleparsed) **не вызывается** во время разработки, потому что Vite старается не парсить полное AST ради улучшенной производительности.

[Хуки генерации вывода](https://rollupjs.org/guide/en/#output-generation-hooks) (за исключением `closeBundle`) **не вызываются** во время разработки. Можно сделать аналогию, будто сервер Vite вызывает только `rollup.rollup()`, без вызова `bundle.generate()`.

## Специфичные для Vite хуки

Плагины Vite также могут предоставлять хуки, предназначенные только для Vite. Такие хуки будут проигнорированы Rollup.

### `config`

- **Тип:** `(config: UserConfig, env: { mode: string, command: string }) => UserConfig | null | void`
- **Вид:** `синхронный`, `последовательный`

  Изменяет конфигурацию Vite до его полного определения. Хук получает сырую конфигурацию пользователя (параметры CLI объеденины с файлом конфигурации), а также текущие переменные окружения, позволяя использовать `mode` и `command`. Хук может вернуть частичный объект конфигурации, который будет объединен с существующим, либо напрямую изменять конфигурацию (если стандартное объединение не позволяет достичь желаемого результата).

  **Пример**

  ```js
  // возвращает частичную конфигурацию (рекомендуемый способ)
  const partialConfigPlugin = () => ({
    name: 'return-partial',
    config: () => ({
      alias: {
        foo: 'bar'
      }
    })
  })

  // изменяет конфигурацию напрямую
  // (используйте только если объединение не сработает)
  const mutateConfigPlugin = () => ({
    name: 'mutate-config',
    config(config, { command }) {
      if (command === 'build') {
        config.root = __dirname
      }
    }
  })
  ```

  ::: warning Примечание
  Пользовательские плагины определяются до вызова этого хука, поэтому добавление плагинов внутри хука `config` ни к чему не приведет.
  :::

### `configResolved`

- **Тип:** `(config: ResolvedConfig) => void | Promise<void>`
- **Вид:** `асинхронный`, `параллельный`

  Вызывается после определения конфигурации Vite. Используйте этот хук, чтобы читать и хранить конечную конфигурацию. Он также полезен, когда плагину нужно сделать что-то в зависимости от вызванной команды.

  **Привет:**

  ```js
  const examplePlugin = () => {
    let config

    return {
      name: 'read-config',

      configResolved(resolvedConfig) {
        // хранение конфигурации
        config = resolvedConfig
      },

      // использование конфигурации в других хуках
      transform(code, id) {
        if (config.command === 'serve') {
          // serve: сервер разработки вызвал плагин
        } else {
          // build: Rollup вызвал плагин
        }
      }
    }
  }
  ```

### `configureServer`

- **Тип:** `(server: ViteDevServer) => (() => void) | void | Promise<(() => void) | void>`
- **Вид:** `асинхронный`, `последовательный`
- **См. также:** [ViteDevServer](./api-javascript#vitedevserver)

  Хук для настройки сервера разработки. Самый частый пример использования - это добавление своих промежуточных слоев во внутреннее приложение [connect](https://github.com/senchalabs/connect):

  ```js
  const myPlugin = () => ({
    name: 'configure-server',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // своя обработка запроса...
      })
    }
  })
  ```

  **Внедрение конечных промежуточных слоев**

  Хук `configureServer` вызывается до того, как устанавливаются внутренние промежуточные слои, поэтому по-умолчанию такие слои плагинов вызываются раньше внутренних. Если вы хотите вставить промежуточный слой **после** внутренних, то можно вернуть из хука `configureServer` функцию, которая вызовется после того, как внутренние слои будут установлены:

  ```js
  const myPlugin = () => ({
    name: 'configure-server',
    configureServer(server) {
      // возвращается конечных хук, который вызывается после
      // установки внутренних слоев
      return () => {
        server.middlewares.use((req, res, next) => {
          // своя логика обработки запроса...
        })
      }
    }
  })
  ```

  **Хранение доступа к серверу**

  Иногда внутри других хуков плагина нужно получить доступ к экземпляру сервера (например, получить сервер веб-сокетов, вотчер файловой системы или граф модулей). Внутри этого хука можно сохранить экземпляр сервера для его последующего использования в других хуках:

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
          // использования сервера...
        }
      }
    }
  }
  ```

  Учтите, что `configureServer` не вызывается во время сборки для production, поэтому нужно убедиться, что другие ваши хуки проверяет наличие сервера.

### `transformIndexHtml`

- **Тип:** `IndexHtmlTransformHook | { enforce?: 'pre' | 'post', transform: IndexHtmlTransformHook }`
- **Вид:** `асинхронный`, `последовательный`

  Отдельный хук для преобразования `index.html`. Хук получает текущий HTML в виде строки и контекст. Из контекста можно получить экземпляр [`ViteDevServer`](./api-javascript#vitedevserver) во время разработки, и результирующий бандл Rollup во время сборки.

  Хук может быть асинхронным, а также может вернуть одно из:

  - Преобразованную строку HTML
  - Массив тэгов в виде объекта (`{ tag, attrs, children }`), который надо вставить в текущий HTML. Каждый тэг также может указать, куда его нужно вставлять (по-умолчанию, в начало `<head>`).
  - Объект, содержащий оба, в формате `{ html, tags }`

  **Базовый пример**

  ```js
  const htmlPlugin = () => {
    return {
      name: 'html-transform',
      transformIndexHtml(html) {
        return html.replace(
          /<title>(.*?)<\/title>/,
          `<title>Заголовок заменён!</title>`
        )
      }
    }
  }
  ```

  **Полная сигнатура хука:**

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
     * по-умолчанию: 'head-prepend'
     */
    injectTo?: 'head' | 'body' | 'head-prepend' | 'body-prepend'
  }
  ```

### `handleHotUpdate`

- **Тип:** `(ctx: HmrContext) => Array<ModuleNode> | void | Promise<Array<ModuleNode> | void>`

  Выполняет заданную функцию обновления HRM. Данный хук получает объект контекста со следующей сигнатурой:

  ```ts
  interface HmrContext {
    file: string
    timestamp: number
    modules: Array<ModuleNode>
    read: () => string | Promise<string>
    server: ViteDevServer
  }
  ```

  - `modules` - это массив модулей, затронутых изменением файла. Это массив, потому что один файл может быть представлен в виде нескольких модулей (например, Vue SFC).

  - `read` - это аснхронная функция чтения, которая возвращает содержимое файла. Эта функция предоставляется, потому что на некоторых системах файл может измениться слишком быстро, и прямой вызов `fs.readFile` вернет пустоту. Данная функция чтения нормализует такое поведение.

  Данный хук может:

  - Отфильтровать и сузить список затронутых модулей, чтобы HMR был более точным.

  - Вернуть пустой массив и выполнить полностью свою функцию HRM, отправляя события на клиент:

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

    Клиентский код должен содержать соответствующий обработчик с использованием [HMR API](./api-hmr) (который, к слову, можно вставить с помощью хука `transform`):

    ```js
    if (import.meta.hot) {
      import.meta.hot.on('special-update', (data) => {
        // выполнить свои обновления
      })
    }
    ```

## Порядок вызова плагина

Плагин Vite может дополнительно указать свойство `enforce` (как в webpack loaders) для настройки порядка вызова. Значение `enforce` может быть `"pre"` или `"post"`. Плагины будут вызываться в следующем порядке:

- Alias
- Пользовательские плагины с `enforce: 'pre'`
- Внутренние плагины Vite
- Пользовательские плагины без значения `enforce`
- Плагины сборки Vite
- Пользовательские плагины с `enforce: 'post'`
- Плагины Vite, выполняемые после сборки (minify, manifest, reporting)

## Применение в определенных условиях

По-умолчанию, плагины запускаются на `serve` и на `build`. Но если плагин должен примениться только на одной из стадий, используйте свойство `apply`, чтобы ограничить вызов во время `'build'` или `'serve'`:

```js
function myPlugin() {
  return {
    name: 'build-only',
    apply: 'build' // или 'serve'
  }
}
```

## Совместимость плагинов Rollup

Большинство плагинов Rollup будут работать как плагины Vite (например, `@rollup/plugin-alias` или `@rollup/plugin-json`), но не все, т.к. хуки некоторых плагинов не имеют смысла в контексте несобранного сервера разработки.

В целом, пока плагин Rollup соответствует следующим критериям, он должен работать как плагин Vite:

- Он не использует хук [`moduleParsed`](https://rollupjs.org/guide/en/#moduleparsed).
- Он не имеет сильной связи между хуками фаз сборки и вывода.

Если плагин Rollup имеет смысл только на фазе сборки, то его лучше указать через `build.rollupOptions.plugins`.

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

## Нормализация путей

Определяя id, Vite нормализует пути, используя разделитель POSIX ( / ), сохраняя название раздела на Windows. С другой стороны, Rollup не изменяет пути, поэтому на Windows id будут иметь разделитель win32 ( \\ ). Однако плагины Rollup используют [внутренную функцию `normalizePath`](https://github.com/rollup/plugins/tree/master/packages/pluginutils#normalizepath) из пакета `@rollup/pluginutils`, которая конвертирует резделители в POSIX прежде чем сравнивать их. Поэтому при использовании этих плагинов внутри Vite, поля конфигурации `include` и `exlude` (и другие, связанные с путями) будут работает правильно.

Из-за этого плагины Vite при сравнении путей должны сначала нормализовать их с использованием разделителя POSIX. Аналогичная функция `normalizePath` экспортируется из модуля `vite`.

```js
import { normalizePath } from 'vite'

normalizePath('foo\\bar') // 'foo/bar'
normalizePath('foo/bar') // 'foo/bar'
```
