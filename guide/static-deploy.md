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

   Если вы публикуете на `https://<USERNAME or GROUP>.gitlab.io/`, вы можете не указывать `base`, так как по умолчанию он равен `'/'`.

   Если вы публикуете на `https://<USERNAME or GROUP>.gitlab.io/<REPO>/`, и, например, ваш репозиторий находится на `https://gitlab.com/<USERNAME>/<REPO>`, то установите `base` равный `'/<REPO>/'`.

2. Установите `public` в `build.outDir` вашего `vite.config.js`.

3. Создайте файл с именем `.gitlab-ci.yml` в корне вашего проекта с содержимым, указанным ниже. Это будет собирать и публиковать ваш сайт каждый раз, когда вы вносите изменения в свой контент:

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

1. На [Netlify](https://netlify.com) настройте новый проект из GitHub со следующими настройками:

   - **Команда сборки:** `vite build` или `npm run build`.
   - **Каталог публикации:** `dist`

2. Нажмите кнопку публикации.

## Google Firebase

1. Убедитесь, что у вас установлен [firebase-tools](https://www.npmjs.com/package/firebase-tools).

2. Создайте `firebase.json` и `.firebaserc` в корне вашего проекта со следующим содержимым:

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

3. После запуска `npm run build` выполните публикацию с помощью команды `firebase deploy`.

## Surge

1. Сначала установите [surge](https://www.npmjs.com/package/surge), если вы еще этого не сделали.

2. Запустите `npm run build`.

3. Выполните публикацию на surge, набрав `surge dist`.

Вы также можете выполнить публикацию на [свой домен](http://surge.sh/help/adding-a-custom-domain), добавив `surge dist yourdomain.com`.

## Heroku

1. Установите [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli).

2. Создайте учетную запись Heroku, [зарегистрировавшись](https://signup.heroku.com).

3. Запустите `heroku login` и введите свои учетные данные Heroku:

   ```bash
   $ heroku login
   ```

4. Создайте файл с именем `static.json` в корне вашего проекта со следующим содержимым:

   `static.json`:

   ```json
   {
     "root": "./dist"
   }
   ```

   Это конфигурация вашего сайта; подробнее читайте на [heroku-buildpack-static](https://github.com/heroku/heroku-buildpack-static).

5. Настройте Heroku git remote:

   ```bash
   # изменение версии
   $ git init
   $ git add .
   $ git commit -m "My site ready for deployment."

   # создание нового приложения с указанным именем
   $ heroku apps:create example

   # указание buildpack для статических сайтов
   $ heroku buildpacks:set https://github.com/heroku/heroku-buildpack-static.git
   ```

6. Публикация вашего сайта:

   ```bash
   # опубликовать сайт
   $ git push heroku master

   # открыть браузер для просмотра Dashboard версии Heroku CI
   $ heroku open
   ```

## Vercel

Чтобы опубликовать приложение Vite с помощью [Vercel for Git](https://vercel.com/docs/git), убедитесь, что вы запушили его в Git репозиторий.

Перейдите на https://vercel.com/import/git и импортируйте проект в Vercel, используя выбранный вами Git (GitHub, GitLab или BitBucket). Следуя указаниям, выберите корень проекта с помощью `package.json` и переопределите этап сборки, используя `npm run build`, а выходной каталог укажите `./dist`

![Переопределение конфигурации Vercel](../images/vercel-configuration.png)

После того, как ваш проект будет импортирован, все последующие пуши в ветки будут генерировать предварительные публикации, а все изменения, внесенные в production ветвь (обычно "main"), приведут к production публикации.

После публикации вы получите URL-адрес для просмотра вашего приложения в реальном времени, например: https://vite.vercel.app

## Azure Static Web Apps

Вы можете быстро развернуть Vite приложение с помощью сервиса Microsoft Azure [Static Web Apps](https://aka.ms/staticwebapps). Для этого нужно:

- Учетная запись Azure и ключ подписки. Вы можете создать [бесплатную учетную запись Azure здесь](https://azure.microsoft.com/free).
- Код вашего приложения запушен на [GitHub](https://github.com).
- [Расширение SWA](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps) в [Visual Studio Code](https://code.visualstudio.com). 

Установите расширение в VS Code и перейдите в корень своего приложения. Откройте расширение Static Web Apps, войдите в Azure и кликните на знак «+», чтобы создать новое статическое веб-приложение. Вам будет предложено указать, какой ключ подписки использовать.

Следуйте указаниям, запущенного расширения, чтобы дать вашему приложению имя, выбрать пресет фреймворка, назначить корень приложения (обычно `/`) и указать расположение файлов `/dist`. Помощник запустится и создаст GitHub action в папке `.github` вашего репозитория.

Action будет публиковать ваше приложения (наблюдайте за его прогрессом на вкладке Actions вашего репозитория), и после успешного завершения вы сможете просмотреть свое приложение по адресу, указанному в окне прогресса расширения, нажав кнопку «Browse Website», которая появляется, когда GitHub action был запущен.