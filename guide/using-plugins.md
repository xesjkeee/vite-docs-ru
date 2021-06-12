# Использование плагинов

Vite может быть расширен с помощью плагинов, которые основаны на хорошо разработанном интерфейсе плагинов Rollup с несколькими дополнительными опциями, специфичными для Vite. Это означает, что пользователи Vite могут полагаться на развитую экосистему подключаемых модулей Rollup, а также при необходимости расширять функциональность сервера разработки и SSR.

## Добавление плагина

Чтобы использовать плагин, его необходимо добавить в `devDependencies` проекта и добавить в массив `plugins` в файле конфигурации `vite.config.js`. Например, для поддержки устаревших браузеров можно использовать официальный [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy):

```
$ npm i -D @vitejs/plugin-legacy
```

```js
// vite.config.js
import legacy from '@vitejs/plugin-legacy'

export default {
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ]
}
```

`plugins` также принимают пресеты, включая несколько плагинов как один элемент. Это полезно для сложных функций (например, интеграции с фреймворком), которые реализованы с использованием нескольких плагинов. Массив будет внутренне плоским.

Ложные плагины будут игнорироваться, что позволяет легко активировать или деактивировать плагины.

## Поиск плагинов

:::tip ПРИМЕЧАНИЕ
Vite стремится предоставить готовую поддержку распространенных шаблонов веб-разработки. Перед поиском для Vite или совместимого с Rollup плагинов ознакомьтесь с [возможностями Vite](../guide/features.md). Много случаев, когда в проекте требуется Rollup плагин, который уже описан в Vite.
:::

Загляните на страницу [Плагины](../plugins) для получения информации об официальных плагинах. Плагины сообщества перечислены в [awesome-vite](https://github.com/vitejs/awesome-vite#plugins). Чтобы узнать о совместимых Rollup плагинов, ознакомьтесь с [Vite Rollup Plugins](https://vite-rollup-plugins.patak.dev) для получения списка плагинов с инструкциями по использованию или на странице [Совместимость Rollup плагинов](../guide/api-plugin#rollup-plugin-compatibility), если его там нет.

Вы также можете найти плагины, соответствующие [рекомендуемым соглашениям](./api-plugin.md#conventions), используя [npm поиск для vite-plugin](https://www.npmjs.com/search?q=vite-plugin&ranking=popularity) для плагинов Vite или [npm поиск для rollup-plugin](https://www.npmjs.com/search?q=rollup-plugin&ranking=popularity) / [npm поиск для vite-plugin](https://www.npmjs.com/search?q=vite-plugin&ranking=popularity) для Rollup плагинов.

## Обеспечение порядка плагинов

Для совместимости с некоторыми Rollup плагинами может потребоваться принудительно установить порядок или применить их только во время сборки. Это должна быть особенность реализации Vite плагинов. Вы можете принудительно установить порядок плагина с помощью модификатора `enforce`:

- `pre`: вызывать плагин перед главными плагинами Vite
- default: вызывать плагин после главных плагинов Vite
- `post`: вызывать плагин после плагинов сборки Vite

```js
// vite.config.js
import image from '@rollup/plugin-image'

export default {
  plugins: [
    {
      ...image(),
      enforce: 'pre'
    }
  ]
}
```

Check out [Plugins API Guide](./api-plugin.md#plugin-ordering) for detailed information, and look out for the `enforce` label and usage instructions for popular plugins in the [Vite Rollup Plugins](https://vite-rollup-plugins.patak.dev) compatibility listing.

Ознакомьтесь с [Руководством по API плагинов](./api-plugin.md#plugin-ordering) для получения подробной информации и обратите внимание на метку `enforce` и инструкции по использованию для популярных плагинов в списке совместимости [Vite Rollup Plugins](https://vite-rollup-plugins.patak.dev).

## Условное приложение

По умолчанию плагины вызываются как для обслуживания, так и для сборки. В случаях, когда плагин необходимо условно применять только во время обслуживания или сборки, используйте свойство `apply`, чтобы вызывать их только во время `'build'` или `'serve'`:

```js
// vite.config.js
import typescript2 from 'rollup-plugin-typescript2'

export default {
  plugins: [
    {
      ...typescript2(),
      apply: 'build'
    }
  ]
}
```

## Создание плагинов

Ознакомьтесь с документацией [Руководство по API плагинов](./api-plugin.md) для создания плагинов.