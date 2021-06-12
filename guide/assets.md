# Обработка статических ресурсов

- Related: [Public Base Path](./build#public-base-path)
- Related: [`assetsInclude` config option](/config/#assetsinclude)

## Импорт ресурса как URL

Импорт статического ресурса вернет зарезолвленный публичный URL-адрес до места его хранения:

```js
import imgUrl from './img.png'
document.getElementById('hero-img').src = imgUrl
```

Например, `imgUrl` будет `/img.png` во время разработки и станет `/assets/img.2d8efhg.png` в production сборке.

Поведение аналогично `file-loader` плагину webpack. Разница в том, что импорт может осуществляться с использованием абсолютных публичных путей (на основе корня проекта во время разработки), либо с использованием относительных путей.

- `url()` в CSS обрабатываются таким же образом.

- При использовании Vue плагина ссылки на ресурсы в Vue SFC шаблонах автоматически преобразуются в импорт.

- Стандартные типы файлов изображений, мультимедиа и шрифтов автоматически определяются как ресурсы. Вы можете расширить внутренний список, используя [параметр `assetsInclude`](/config/#assetsinclude).

- Ресурсы, на которые есть ссылки, включаются как часть графа ресурсов сборки, получают хешированные имена файлов и могут обрабатываться плагинами для оптимизации.

- Ресурсы, размер которых меньше, чем [параметр `assetsInlineLimit`](/config/#build-assetsinlinelimit) (в байтах), будут встроены в виде base64 адресов.

### Явный импорт URL

Ресурсы, которые не включены во внутренний список или в `assetsInclude`, могут быть явно импортированы как URL-адрес с `?url` суффиксом. Это полезно, например, для импорта [Houdini Paint Worklets](https://houdini.how/usage).

```js
import workletURL from 'extra-scalloped-border/worklet.js?url'
CSS.paintWorklet.addModule(workletURL)
```

### Импорт ресурса как строки

Ресурсы могут быть импортированы в виде строк с использованием `?raw` суффикса.

```js
import shaderString from './shader.glsl?raw'
```

### Импорт скрипта в качестве воркера

Scripts can be imported as web workers with the `?worker` or `?sharedworker` suffix.

Скрипты могут быть импортированы как веб-воркеры с `?worker` или `?sharedworker` суффиксом.

```js
// Отдельный чанк в production сборке
import Worker from './shader.js?worker'
const worker = new Worker()
```

```js
// sharedworker
import SharedWorker from './shader.js?sharedworker'
const sharedWorker = new SharedWorker()
```

```js
// Встраивается как base64 строка
import InlineWorker from './shader.js?worker&inline'
```

Посмотрите [раздел Web Worker](./features.md#web-workers) для получения более подробной информации.

## `public` директория

Если у вас есть ресурсы, которые:

- Никогда не упоминается в исходном коде (например, `robots.txt`)
- Должны сохранить одно и то же имя файла (без хеширования)
- ...или вы просто не хотите сначала импортировать ресурс, чтобы получить его URL

Вы можете поместить ресурс в специальный каталог `public` в корне вашего проекта. Ресурсы в этом каталоге будут обслуживаться по корневому пути `/` во время разработки и копироваться в корень каталога dist как есть.

По умолчанию используется каталог `<root>/public`, но его можно настроить с помощью [`publicDir` параметра](/config/#publicdir).

Обратите внимание, что:

- Вы всегда должны ссылаться на `public` ресурсы, используя абсолютный root путь - например, на `public/icon.png` следует ссылаться в исходном коде как `/icon.png`.
- Ресурсы в `public` не могут быть импортированы из JavaScript.
