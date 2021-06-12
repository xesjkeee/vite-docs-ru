# Публикация статического сайта

Следующие руководства основаны на некоторых предположениях:

- Вы используете расположение вывода сборки по умолчанию (`dist`). Это местоположение [можно изменить с помощью `build.outDir`](https://vitejs.dev/config/#build-outdir), в этом случае вы можете экстраполировать инструкции из этих руководств.
- Вы используете npm. Вы можете использовать эквивалентные команды для запуска скриптов, если вы используете Yarn или другие пакетные менеджеры.
- Vite устанавливлен как локальная dev-зависимость в вашем проекте, и у вас настроены следующие npm скрипты:

```json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

Важно отметить, что `vite preview` предназначен для предварительного локального просмотра сборки и не должен использоваться в качестве production сервера.

::: tip ПРИМЕЧАНИЕ
Эти руководства содержат инструкции по статическому развертыванию вашего Vite сайта. Vite также имеет экспериментальную поддержку рендеринга на стороне сервера. SSR относится к front-end фреймворкам, которые поддерживают запуск того же приложения в Node.js, его предварительный рендеринг в HTML и, наконец, гидратацию на клиенте. Прочтите [Руководство по SSR](./ssr), чтобы подробнее узнать об этой функции. С другой стороны, если вы ищете интеграцию с традиционными серверными фреймворками, ознакомьтесь с [Backend Integration guide](./backend-integration).
:::

## Сборка приложения

Вы можете запустить команду `npm run build`, чтобы собрать приложение.

```bash
$ npm run build
```

По умолчанию вывод сборки будет помещен в `dist`. Вы можете опубликовать эту `dist` папку на любой вашей предпочтительной платформе.

### Локальное тестирование приложения

Собрав приложение, вы можете протестировать его локально, выполнив команду `npm run preview`.

```bash
$ npm run build
$ npm run preview
```

Команда `preview` загрузит локальный статический веб-сервер, который будет отдавать файлы из `dist` на http://localhost:5000. Это простой способ проверить, нормально ли выглядит production сборка в вашей локальной среде.

Вы можете настроить порт сервера, передав флаг `--port` в качестве аргумента.

```json
{
  "scripts": {
    "preview": "vite preview --port 8080"
  }
}
```

Теперь `preview` команда запустит сервер на http://localhost:8080.

## GitHub Pages

1. Установите правильный `base` в `vite.config.js`.

   Если вы публикуете на `https://<USERNAME>.github.io/`, вы можете не указывать `base`, так как по умолчанию он равен `'/'`.

   Если вы публикуете на `https://<USERNAME>.github.io/<REPO>/`, и, например, ваш репозиторий находится на `https://github.com/<USERNAME>/<REPO>`, то установите `base` равный `'/<REPO>/'`.

2. Внутри вашего проекта создайте `deploy.sh` со следующим содержимым (с выделенными строками без комментариев) и запустите его для публикации:

   ```bash{13,20,23}
   #!/usr/bin/env sh

   # прерывание при ошибках
   set -e

   # сборка
   npm run build

   # переход к каталогу со сборкой
   cd dist

   # если вы публикуете на личный домен
   # echo 'www.example.com' > CNAME

   git init
   git add -A
   git commit -m 'deploy'

   # если вы публикуете на https://<USERNAME>.github.io
   # git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

   # если вы публикуете на https://<USERNAME>.github.io/<REPO>
   # git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages

   cd -
   ```

::: tip
Вы также можете запустить приведенный выше скрипт в настройках CI, чтобы включить автоматическую публикацию при каждом пуше.
:::

### GitHub Pages и Travis CI

1. Установите правильный `base` в `vite.config.js`.

   Если вы публикуете на `https://<USERNAME or GROUP>.github.io/`, вы можете не указывать `base`, так как по умолчанию он равен `'/'`.

   Если вы публикуете на `https://<USERNAME or GROUP>.github.io/<REPO>/`, и, например, ваш репозиторий находится на `https://github.com/<USERNAME>/<REPO>`, то установите `base` равный `'/<REPO>/'`.

2. Создайте файл с именем `.travis.yml` в корне вашего проекта.

3. Запустите `npm install` локально и закоммитьте сгенерированный lockfile (`package-lock.json`).

4. Используйте шаблон развертывания GitHub Pages и следуйте [документации Travis CI](https://docs.travis-ci.com/user/deployment/pages/).

   ```yaml
   language: node_js
   node_js:
     - lts/*
   install:
     - npm ci
   script:
     - npm run build
   deploy:
     provider: pages
     skip_cleanup: true
     local_dir: dist
     # Токен, сгенерированный на GitHub, позволяющий Travis пушить код в ваш репозиторий.
     # Установите на странице настроек Travis вашего репозитория как secure переменную.
     github_token: $GITHUB_TOKEN
     keep_history: true
     on:
       branch: master
   ```

## GitLab Pages и GitLab CI

1. Установите правильный `base` в `vite.config.js`.

   If you are deploying to `https://<USERNAME or GROUP>.gitlab.io/`, you can omit `base` as it defaults to `'/'`.

   If you are deploying to `https://<USERNAME or GROUP>.gitlab.io/<REPO>/`, for example your repository is at `https://gitlab.com/<USERNAME>/<REPO>`, then set `base` to `'/<REPO>/'`.

2. Set `build.outDir` in `vite.config.js` to `public`.

3. Create a file called `.gitlab-ci.yml` in the root of your project with the content below. This will build and deploy your site whenever you make changes to your content:

   ```yaml
   image: node:10.22.0
   pages:
     cache:
       paths:
         - node_modules/
     script:
       - npm install
       - npm run build
     artifacts:
       paths:
         - public
     only:
       - master
   ```

## Netlify

1. On [Netlify](https://netlify.com), setup up a new project from GitHub with the following settings:

   - **Build Command:** `vite build` or `npm run build`
   - **Publish directory:** `dist`

2. Hit the deploy button.

## Google Firebase

1. Make sure you have [firebase-tools](https://www.npmjs.com/package/firebase-tools) installed.

2. Create `firebase.json` and `.firebaserc` at the root of your project with the following content:

   `firebase.json`:

   ```json
   {
     "hosting": {
       "public": "dist",
       "ignore": []
     }
   }
   ```

   `.firebaserc`:

   ```js
   {
    "projects": {
      "default": "<YOUR_FIREBASE_ID>"
    }
   }
   ```

3. After running `npm run build`, deploy using the command `firebase deploy`.

## Surge

1. First install [surge](https://www.npmjs.com/package/surge), if you haven’t already.

2. Run `npm run build`.

3. Deploy to surge by typing `surge dist`.

You can also deploy to a [custom domain](http://surge.sh/help/adding-a-custom-domain) by adding `surge dist yourdomain.com`.

## Heroku

1. Install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli).

2. Create a Heroku account by [signing up](https://signup.heroku.com).

3. Run `heroku login` and fill in your Heroku credentials:

   ```bash
   $ heroku login
   ```

4. Create a file called `static.json` in the root of your project with the below content:

   `static.json`:

   ```json
   {
     "root": "./dist"
   }
   ```

   This is the configuration of your site; read more at [heroku-buildpack-static](https://github.com/heroku/heroku-buildpack-static).

5. Set up your Heroku git remote:

   ```bash
   # version change
   $ git init
   $ git add .
   $ git commit -m "My site ready for deployment."

   # creates a new app with a specified name
   $ heroku apps:create example

   # set buildpack for static sites
   $ heroku buildpacks:set https://github.com/heroku/heroku-buildpack-static.git
   ```

6. Deploy your site:

   ```bash
   # publish site
   $ git push heroku master

   # opens a browser to view the Dashboard version of Heroku CI
   $ heroku open
   ```

## Vercel

To deploy your Vite app with a [Vercel for Git](https://vercel.com/docs/git), make sure it has been pushed to a Git repository.

Go to https://vercel.com/import/git and import the project into Vercel using your Git of choice (GitHub, GitLab or BitBucket). Follow the wizard to select the project root with the project's `package.json` and override the build step using `npm run build` and the output dir to be `./dist`

![Override Vercel Configuration](../images/vercel-configuration.png)

After your project has been imported, all subsequent pushes to branches will generate Preview Deployments, and all changes made to the Production Branch (commonly "main") will result in a Production Deployment.

Once deployed, you will get a URL to see your app live, such as the following: https://vite.vercel.app

## Azure Static Web Apps

You can quickly deploy your Vite app with Microsoft Azure [Static Web Apps](https://aka.ms/staticwebapps) service. You need:

- An Azure account and a subscription key. You can create a [free Azure account here](https://azure.microsoft.com/free).
- Your app code pushed to [GitHub](https://github.com).
- The [SWA Extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps) in [Visual Studio Code](https://code.visualstudio.com). 

Install the extension in VS Code and navigate to your app root. Open the Static Web Apps extension, sign in to Azure, and click the '+' sign to create a new Static Web App. You will be prompted to designate which subscription key to use. 

Follow the wizard started by the extension to give your app a name, choose a framework preset, and designate the app root (usually `/`) and built file location `/dist`. The wizard will run and will create a GitHub action in your repo in a `.github` folder. 

The action will work to deploy your app (watch its progress in your repo's Actions tab) and, when successfully completed, you can view your app in the address provided in the extension's progress window by clicking the 'Browse Website' button that appears when the GitHub action has run.   
