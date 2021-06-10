# Руководство

## Обзор возможностей

Vite (французское слово "быстро", произносится как `/vit/`) - это инструмент сборки, который призван обеспечить более быструю и экономичную разработку современных веб-проектов. Он состоит из двух основных частей:

- Сервер разработки, который предоставляет [расширенные возможности](./features) по сравнению с [нативными ES модулями](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), например чрезвычайно быстрая [Горячая замена модулей (HMR)](./features#hot-module-replacement).

- Команда сборки, которая собирает ваш код с помощью [Rollup](https://rollupjs.org), предварительно настроенным для вывода высокооптимизированных статических ресурсов для продакшна.

Vite поставляется с разумными настройками по умолчанию из коробки, но также обладает широкими возможностями расширения с помощью [API плагинов](./api-plugin) и [JavaScript API](./api-javascript) с полной поддержкой типизации.

Вы можете узнать больше о причинах этого проекта на странице [Почему Vite](./why).

## Поддержка браузеров

- По умолчанию сборка нацелена на браузеры, которые поддерживают как [нативные ESM через теги script](https://caniuse.com/es6-module), так и [нативные ESM динамические импорты](https://caniuse.com/es6-module-dynamic-import). Устаревшие браузеры могут поддерживаться через официальный [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) - смотрите раздел [Сборка для продакшна](./build) для получения более подробной информации.

## Скаффолдинг вашего первого Vite-проекта

::: tip Примечание о совместимости
Vite требуется [Node.js](https://nodejs.org/en/) версии >=12.0.0.
:::

Через NPM:

```bash
$ npm init @vitejs/app
```

Через Yarn:

```bash
$ yarn create @vitejs/app
```

После просто следуйте подсказкам!

Вы также можете напрямую указать имя проекта и шаблон, который хотите использовать, с помощью дополнительных параметров командной строки. Например, чтобы сформировать проект Vite + Vue, запустите:

```bash
# npm 6.x
npm init @vitejs/app my-vue-app --template vue

# npm 7+, требуется дополнительное двойное тире:
npm init @vitejs/app my-vue-app -- --template vue

# yarn
yarn create @vitejs/app my-vue-app --template vue
```

Поддерживаемые пресеты шаблонов включают:

- `vanilla`
- `vanilla-ts`
- `vue`
- `vue-ts`
- `react`
- `react-ts`
- `preact`
- `preact-ts`
- `lit-element`
- `lit-element-ts`
- `svelte`
- `svelte-ts`

Смотрите [@vitejs/create-app](https://github.com/vitejs/vite/tree/main/packages/create-app) для получения дополнительных сведений о каждом шаблоне.

## Шаблоны сообщества

@vitejs/create-app is a tool to quickly start a project from a basic template for popular frameworks. Check out Awesome Vite for [community maintained templates](https://github.com/vitejs/awesome-vite#templates) that include other tools or target different frameworks. You can use a tool like [degit](https://github.com/Rich-Harris/degit) to scaffold your project with one of the templates.

```bash
npx degit user/project my-project
cd my-project

npm install
npm run dev
```

If the project uses `main` as the default branch, suffix the project repo with `#main`

```bash
npx degit user/project#main my-project
```

## `index.html` and Project Root

One thing you may have noticed is that in a Vite project, `index.html` is front-and-central instead of being tucked away inside `public`. This is intentional: during development Vite is a server, and `index.html` is the entry point to your application.

Vite treats `index.html` as source code and part of the module graph. It resolves `<script type="module" src="...">` that references your JavaScript source code. Even inline `<script type="module">` and CSS referenced via `<link href>` also enjoy Vite-specific features. In addition, URLs inside `index.html` are automatically rebased so there's no need for special `%PUBLIC_URL%` placeholders.

Similar to static http servers, Vite has the concept of a "root directory" which your files are served from. You will see it referenced as `<root>` throughout the rest of the docs. Absolute URLs in your source code will be resolved using the project root as base, so you can write code as if you are working with a normal static file server (except way more powerful!). Vite is also capable of handling dependencies that resolve to out-of-root file system locations, which makes it usable even in a monorepo-based setup.

Vite also supports [multi-page apps](./build#multi-page-app) with multiple `.html` entry points.

#### Specifying Alternative Root

Running `vite` starts the dev server using the current working directory as root. You can specify an alternative root with `vite serve some/sub/dir`.

## Command Line Interface

In a project where Vite is installed, you can use the `vite` binary in your npm scripts, or run it directly with `npx vite`. Here is the default npm scripts in a scaffolded Vite project:

```json
{
  "scripts": {
    "dev": "vite", // start dev server
    "build": "vite build", // build for production
    "serve": "vite preview" // locally preview production build
  }
}
```

You can specify additional CLI options like `--port` or `--https`. For a full list of CLI options, run `npx vite --help` in your project.

## Using Unreleased Commits

If you can't wait for a new release to test the latest features, you will need to clone the [vite repo](https://github.com/vitejs/vite) to your local machine and then build and link it yourself ([Yarn 1.x](https://classic.yarnpkg.com/lang/en/) is required):

```bash
git clone https://github.com/vitejs/vite.git
cd vite
yarn
cd packages/vite
yarn build
yarn link
```

Then go to your vite based project and run `yarn link vite`. Now restart the development server (`yarn dev`) to ride on the bleeding edge!

## Community

If you have questions or need help, reach out to the community at [Discord](https://discord.gg/4cmKdMfpU5) and [GitHub Discussions](https://github.com/vitejs/vite/discussions).
