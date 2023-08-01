![Zygot - Utilisez vos routes nommées BlitzPHP en JavaScript](https://raw.githubusercontent.com/dimtrovich/zygot/main/zygot-banner.png)

# Zygot – Utilisez vos routes nommées BlitzPHP en JavaScript

[![GitHub Actions Status](https://img.shields.io/github/actions/workflow/status/dimtrovich/zygot/test.yml?branch=main&style=flat)](https://github.com/dimtrovich/zygot/actions?query=workflow:Tests+branch:main)
[![Latest Version on Packagist](https://img.shields.io/packagist/v/dimtrovich/zygot.svg?style=flat)](https://packagist.org/packages/dimtrovich/zygot)
[![Downloads on Packagist](https://img.shields.io/packagist/dt/dimtrovich/zygot.svg?style=flat)](https://packagist.org/packages/dimtrovich/zygot)
[![Latest Version on NPM](https://img.shields.io/npm/v/zygot-js.svg?style=flat)](https://npmjs.com/package/zygot-js)
[![Downloads on NPM](https://img.shields.io/npm/dt/zygot-js.svg?style=flat)](https://npmjs.com/package/zygot-js)


## Credits

Zygot est une réadaptation du package [Ziggy](https://github.com/tighten/ziggy) pour pouvoir avoir le même fonctionnement avec BlitzPHP.
De ce fait tout le mérite revient à [Daniel Coulbourne](https://twitter.com/DCoulbourne), [Jake Bathman](https://twitter.com/jakebathman), [Matt Stauffer](https://twitter.com/stauffermatt), [Jacob Baker-Kretzmar](https://twitter.com/bakerkretzmar) et [tous les autres contributeurs](https://github.com/tighten/ziggy/contributors).

---
---


Zygot fournit une fonction d'assistance JavaScript `route()` qui fonctionne comme celle de BlitzPHP, ce qui facilite l'utilisation de vos routes nommées BlitzPHP en JavaScript.

Zygot prend en charge toutes les versions de BlitzPHP à partir de `0.4` et tous les navigateurs modernes.

- [**Installation**](#installation)
- [**Utilisation**](#utilisation)
    - [Le helper `route()`](#le-helper-route)
    - [La classe `Router`](#la-classe-router)
    - [Support TypeScript](#support-typescript)
- [**Configuration avancée**](#configuration-avancée)
    - [Frameworks JavaScript](#frameworks-javascript)
    - [Vue](#vue)
    - [React](#react)
    - [SPAs o dépôts séparés](#spas-ou-dépôts-séparés)
- [**Filtrage des routes**](#filtrage-des-routes)
    - [Filtrage de base](#filtrage-de-base)
    - [Filtrage à l'aide de groupes](#filtrage-à-l'aide-de-groupes)
- [**Autre**](#autre)
- [**Contribution**](#contribution)

## Installation

Installez Zygot dans votre application BlitzPHP avec `composer require dimtrovich/zygot`.

Ajoutez la fonction `<?= zygot() ?>` à votre mise en page principale (_avant_ le JavaScript de votre application), et la fonction d'assistance `route()` sera désormais disponible globalement dans votre code JavaScript !

> Par défaut, la sortie de la fonction `<?= zygot() ?>` inclut une liste de toutes les routes de votre application et de leurs paramètres. Cette liste de routes est incluse dans le code HTML de la page et peut être consultée par les utilisateurs finaux. Pour configurer les itinéraires inclus dans cette liste, ou pour afficher et masquer différentes routes sur différentes pages, consultez [Filtrer les routes](#filtering-routes).

## Utilisation

#### Le helper `route()`

La fonction d'aide `route()` de Zygot fonctionne comme celle de BlitzPHP - vous pouvez lui transmettre le nom de l'une de vos routes et les paramètres que vous souhaitez transmettre à la route, et elle renverra une URL.

**Utilisation basique**

```php
// app/Config/routes.php

$routes->get('posts', fn (Request $request) => /* ... */, ['as' => 'posts.index']);
```

```js
// app.js

route('posts.index'); // 'https://zygot.test/posts'
```

**Avec des paramètres**

```php
// app/Config/routes.php

$routes->get('posts/(:num)', fn (int $postId, Request $request) => /* ... */, ['as' => 'posts.show']);

// Uniquement BlitzPHP v0.4.2+
$routes->get('posts/{post}', fn ($post, Request $request) => /* ... */, ['as' => 'posts.show']);
```

```js
// app.js

route('posts.show', 1);           // 'https://zygot.test/posts/1'
route('posts.show', [1]);         // 'https://zygot.test/posts/1'
route('posts.show', { post: 1 }); // 'https://zygot.test/posts/1'
```

**Avec plusieurs parametres**

```php
// app/Config/routes.php

$routes->get('events/(:num)/venues/(:num)', fn (int $eventId, int $venueId, Request $request) => /* ... */, ['as' => 'events.venues.show']);

// Uniquement BlitzPHP v0.4.2+
$routes->get('events/{event}/venues/{venue}', fn ($event, $venue, Request $request) => /* ... */, ['as' => 'events.venues.show']);
```

```js
// app.js

route('events.venues.show', [1, 2]);                 // 'https://zygot.test/events/1/venues/2'
route('events.venues.show', { event: 1, venue: 2 }); // 'https://zygot.test/events/1/venues/2'
```

**Avec les parametres de la requete (query strings)**

```php
// app/Config/routes.php

$routes->get('events/(:num)/venues/(:num)', fn (int $eventId, int $venueId, Request $request) => /* ... */, ['as' => 'events.venues.show']);

// Uniquement BlitzPHP v0.4.2+
$routes->get('events/{event}/venues/{venue}', fn ($event, $venue, Request $request) => /* ... */, ['as' => 'events.venues.show']);
```

```js
// app.js

route('events.venues.show', {
    event: 1,
    venue: 2,
    page: 5,
    count: 10,
});
// 'https://zygot.test/events/1/venues/2?page=5&count=10'
```

Comme l'assistant `route()` de BlitzPHP, Zygot encode automatiquement les paramètres de requête booléens sous forme d'entiers dans la chaîne de requête :

```js
route('events.venues.show', {
    event: 1,
    venue: 2,
	draft: false,
	overdue: true,
});
// 'https://zygot.test/events/1/venues/2?draft=0&overdue=1'
```

**Avec les valeurs de paramètre par défaut**

Voir la [documentation BlitzPHP sur les valeurs des paramètres de route par défaut](https://blitz-php.com/docs/urls#default-values).

```php
// app/Config/routes.php

$routes->get('{locale}/posts/(:num)', fn (int $postId, Request $request) => /* ... */, ['as' => 'posts.show']);
```

```php
// app/Middlewares/SetLocale.php

config()->set('app.locale', $user->locale ?? 'de');
```

```js
// app.js

route('posts.show', 1); // 'https://zygot.test/de/posts/1'
```

**Exemple pratique AJAX**

```js
const post = { id: 1, title: 'Zygot Stardust' };

return axios.get(route('posts.show', post)).then((response) => response.data);
```

#### The `Router` class

Calling Zygot's `route()` helper function with no arguments will return an instance of the JavaScript `Router` class, which has some other useful properties and methods.

**Checking the current route: `route().current()`**

```js
// Route called 'events.index', with URI '/events'
// Current window URL is https://zygot.test/events

route().current();               // 'events.index'
route().current('events.index'); // true
route().current('events.*');     // true
route().current('events.show');  // false
```

The `current()` method optionally accepts parameters as its second argument, and will check that their values also match in the current URL:

```js
// Route called 'events.venues.show', with URI '/events/{event}/venues/{venue}'
// Current window URL is https://myapp.com/events/1/venues/2?authors=all

route().current('events.venues.show', { event: 1, venue: 2 }); // true
route().current('events.venues.show', { authors: 'all' });     // true
route().current('events.venues.show', { venue: 6 });           // false
```

**Checking if a route exists: `route().has()`**

```js
// App has only one named route, 'home'

route().has('home');   // true
route().has('orders'); // false
```

**Retrieving the current route params: `route().params`**

```js
// Route called 'events.venues.show', with URI '/events/{event}/venues/{venue}'
// Current window URL is https://myapp.com/events/1/venues/2?authors=all

route().params; // { event: '1', venue: '2', authors: 'all' }
```

> Note: parameter values retrieved with `route().params` will always be returned as strings.

#### TypeScript support

Pour le moment, aucun support TypeScript n'est disponible pour Zygot. Toutes vos contributions sont les bienvenues

## Configuration avancée

#### Frameworks JavaScript

Si vous n'utilisez pas la fonction `<?= zygot() ?>`, Zygot fournit une commande Klinge pour sortir sa configuration et ses routes vers un fichier : `php klinge zygot:generate`. Par défaut, cette commande stocke vos routes dans `resources/js/zygot.js`, mais vous pouvez personnaliser ce chemin en passant une valeur différente comme argument à la commande Klinge ou en définissant la valeur de configuration `zygot.output.path`. Alternativement, vous pouvez renvoyer la configuration de Zygot en tant que JSON à partir d'un point de terminaison dans votre API BlitzPHP (voir [Récupérer les routes et la configuration de Zygot à partir d'un point de terminaison API](#retrieving-ziggys-routes-and-config-from-an-api-endpoint) ci-dessous pour un exemple de configuration).

Le fichier généré par `php klinge zygot:generate` ressemblera à ceci :

```js
// zygot.js

const Zygot = {
    routes: {"home":{"uri":"\/","methods":["GET","HEAD"],"domain":null},"login":{"uri":"login","methods":["GET","HEAD"],"domain":null}},
    url: 'http://zygot.test',
    port: false
};

export { Zygot };
```

Vous pouvez éventuellement créer un alias pour faciliter l'importation des fichiers source principaux de Zygot :

```js
// vite.config.js
export default defineConfig({
    resolve: {
        alias: {
            zygot: 'vendor/dimtrovich/zygot/dist',
            // 'vendor/dimtrovich/zygot/dist/vue.es.js' if using the Vue plugin
        },
    },
});
```

```js
// webpack.mix.js

// Mix v6
const path = require('path');

mix.alias({
    zygot: path.resolve('vendor/dimtrovich/zygot/dist'),
    // 'vendor/dimtrovich/zygot/dist/vue' if using the Vue plugin
});

// Mix v5
const path = require('path');

mix.webpackConfig({
    resolve: {
        alias: {
            zygot: path.resolve('vendor/dimtrovich/zygot/dist'),
        },
    },
});
```

Enfin, importez et utilisez Zygot comme n'importe quelle autre bibliothèque JavaScript. 
Étant donné que l'objet de configuration Zygot n'est pas disponible globalement dans cette configuration, vous devrez généralement le transmettre manuellement à la fonction `route()` :

```js
// app.js

import route from 'zygot';
import { Zygot } from './zygot';

// ...

route('home', undefined, undefined, Zygot);
```

#### Vue

Zygot inclut un plugin Vue pour faciliter l'utilisation du helper `route()` dans votre application Vue :

```js
import { createApp } from 'vue';
import { ZiggyVue } from 'zygot';
import { Zygot } from './zygot';
import App from './App';

createApp(App).use(ZiggyVue, Zygot);

// Vue 2
import Vue from 'vue'
import { ZiggyVue } from 'zygot';
import { Zygot } from './zygot';

Vue.use(ZiggyVue, Zygot);
```

Si vous utilisez ce plugin avec l'alias d'importation `zygot` indiqué ci-dessus, assurez-vous de mettre à jour l'alias en `vendor/dimtrovich/zygot/dist/vue.es.js` (Vite) ou `vendor/dimtrovich/zygot/dist/ vue` (Laravel Mix).

> Remarque : Si vous utilisez la fonction `<?= zygot() ?>` dans vos vues, la configuration de Zygot sera déjà disponible globalement, vous n'avez donc pas besoin d'importer l'objet de configuration `Zygot` et de le passer dans `use()`.

Vous pouvez désormais utiliser `route()` n'importe où dans vos composants et modèles Vue, comme ceci :

```html
<a class="nav-link" :href="route('home')">Accueil</a>
```

#### React

Pour utiliser Zygot avec React, commencez par importer la fonction `route()` et votre configuration Zygot. 
Étant donné que l'objet de configuration Zygot n'est pas disponible globalement dans cette configuration, vous devrez le transmettre manuellement à la fonction `route()` :

```js
// app.js

import route from 'zygot';
import { Zygot } from './zygot';

// ...

route('home', undefined, undefined, Zygot);
```

Nous travaillons sur l'ajout d'un hook à Zygot pour rendre cela plus propre, mais pour l'instant, assurez-vous de passer l'objet de configuration comme quatrième argument à la fonction `route()` comme indiqué ci-dessus.

> Remarque : Si vous utilisez la fonction `<?= zygot() ?>` dans vos vues, le helper `route()` sera déjà disponible globalement, y compris dans votre application React, vous n'avez donc pas besoin d'importer `route` ou `Zygot` partout.

#### SPAs ou dépôts séparés

La fonction d'aide `route()` de Zygot est également disponible sous forme de package NPM, pour une utilisation dans des projets JavaScript gérés séparément de leur backend BlitzPHP (c'est-à-dire sans Composer ou un répertoire `vendor`). Vous pouvez installer le package NPM avec `npm install zygot-js`.

Pour rendre vos routes disponibles sur le frontend pour cette fonction à utiliser, vous pouvez soit exécuter `php klinge zygot:generate` et ajouter le fichier de routes généré à votre projet, ou vous pouvez renvoyer la configuration de Zygot en tant que JSON à partir d'un point de terminaison dans votre API BlitzPHP (voir [Récupération des routes et de la configuration de Zygot à partir d'un point de terminaison API](#retrieving-ziggys-routes-and-config-from-an-api-endpoint) ci-dessous pour un exemple de configuration).

Ensuite, importez et utilisez Zygot comme ci-dessus :

```js
// app.js

import route from 'zygot-js';

import { Zygot } from './zygot';
// ou...
const response = await fetch('/api/zygot');
const Zygot = await response.json();

// ...

route('home', undefined, undefined, Zygot);
```

## Filtrage des routes

Zygot prend en charge le filtrage des routes qu'il met à la disposition de votre JavaScript, ce qui est très bien si vous avez certaines routes que vous ne souhaitez pas voir incluses et visibles dans la source de la réponse renvoyée aux clients. Le filtrage des routes est facultatif. Par défaut, Zygot inclut toutes les routes nommées de votre application.

#### Filtrage de base

Pour configurer le filtrage de route de base, créez un fichier de configuration dans votre application BlitzPHP à `app/Config/zygot.php` et définissez **soit** un paramètre `only` ou `except` comme un tableau de modèles de noms de route.

> Remarque : Vous devez choisir l'un ou l'autre. Définir à la fois "only" et "except" désactivera complètement le filtrage et renverra toutes les routes nommées.

```php
// app/Config/zygot.php

return [
    'only' => ['home', 'posts.index', 'posts.show'],
];
```

Vous pouvez également utiliser des astérisques comme caractères génériques dans les filtres de routage. Dans l'exemple ci-dessous, `admin.*` exclura les routes nommées `admin.login` et `admin.register` :

```php
// app/Config/zygot.php

return [
    'except' => ['_debugbar.*', 'horizon.*', 'admin.*'],
];
```

#### Filtrage à l'aide de groupes

Vous pouvez également définir des groupes de routes que vous souhaitez rendre disponibles à différents endroits de votre application, à l'aide d'une clé "groups" dans votre fichier de configuration :

```php
// app/Config/zygot.php

return [
    'groups' => [
        'admin' => ['admin.*', 'users.*'],
        'author' => ['posts.*'],
    ],
];
```

Ensuite, vous pouvez exposer un groupe spécifique en passant le nom du groupe dans la fonction `zygot()` :

```php 
// app/Views/layouts/main.php

<head>
	<title>---</title>
	...
	<?= zygot('admin') ?>
</head>
```

Pour exposer plusieurs groupes, vous pouvez transmettre un tableau de noms de groupe :

```php 
// app/Views/layouts/main.php

<head>
	<title>---</title>
	...
	<?= zygot(['admin', 'author']) ?>
</head>
```

> Remarque : La transmission des noms de groupe à la fonction `zygot()` aura toujours priorité sur vos autres paramètres `only` ou `except`.
## Autre

#### Utilisation de `zygot` avec une politique de sécurité du contenu

Une [Politique de sécurité du contenu](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) (CSP) peut bloquer les scripts en ligne, y compris ceux générés par la fonction `zygot()`. Si vous avez un CSP et que vous utilisez un nonce pour marquer les scripts en ligne sécurisés, vous pouvez passer le nonce comme deuxième argument à la fonction `zygot()` et il sera ajouté à la balise de script de Zygot :

```php
zygot(nonce: 'your-nonce-here')
// ou
zygot(null, 'your-nonce-here')
```

#### Désactivation de l'assistant `route()`

Si vous souhaitez uniquement utiliser la fonction `zygot` pour rendre les routes de votre application disponibles en JavaScript, mais que vous n'avez pas besoin de la fonction d'assistance `route()`, définissez la valeur de configuration `skip-route-function` sur `true` :

```php
// app/Config/zygot.php

return [
    'skip-route-function' => true,
];
```

#### Récupération des routes et de la configuration de Zygot à partir d'un point de terminaison d'API

Zygot peut facilement renvoyer son objet de configuration au format JSON à partir d'un point de terminaison dans votre application BlitzPHP. Par exemple, vous pouvez configurer une route `/api/zygot` qui ressemble à ceci :

```php
// app/Config/routes.php

use Dimtrovich\Zygot\Zygot;

$routes->get('api/zygot', fn () => service('response')->json(new Zygot));
```

Ensuite, côté client, vous pouvez récupérer la configuration avec une requête HTTP :

```js
// app.js

import route from 'zygot-js';

const response = await fetch('/api/zygot');
const Zygot = await response.toJson();

// ...

route('home', undefined, undefined, Zygot);
```

#### Re-générer le fichier de routes lorsque les routes de votre application changent

Si vous exportez vos routes Zygot sous forme de fichier en exécutant `php klinge zygot:generate`, vous souhaiterez peut-être surveiller le fichier de route de votre application et réexécuter la commande automatiquement chaque fois qu'ils sont mis à jour.
L'exemple ci-dessous est un plugin Laravel Mix issue de [Ziggy](https://github.com/tighten/ziggy) et readapter.
Un grand merci à [Nuno Rodrigues](https://github.com/nacr) pour [l'idée et un exemple de mise en œuvre](https://github.com/tighten/ziggy/issues/321#issuecomment-689150082) !

<details>
<summary>Exemple de code</summary>
<p></p>

```js
const mix = require('laravel-mix');
const { exec } = require('child_process');

mix.extend('zygot', new class {
    register(config = {}) {
        this.watch = config.watch ?? ['app/Config/routes.php'];
        this.path = config.path ?? '';
        this.enabled = config.enabled ?? !mix.inProduction();
    }

    boot() {
        if (!this.enabled) return;

        const command = () => exec(
            `php klinge zygot:generate ${this.path}`,
            (error, stdout, stderr) => console.log(stdout)
        );

        command();

        if (mix.isWatching() && this.watch) {
            ((require('chokidar')).watch(this.watch))
                .on('change', (path) => {
                    console.log(`${path} changed...`);
                    command();
                });
        };
    }
}());

mix.js('resources/js/app.js', 'public/js')
    .postCss('resources/css/app.css', 'public/css', [])
    .zygot();
```
</details>

## Contribution

Pour commencer à contribuer à Zygot, consultez [le guide de contribution](CONTRIBUTING.md).

## Credits

Zygot est une réadaptation du package [Ziggy](https://github.com/tighten/ziggy) pour pouvoir avoir le même fonctionnement avec BlitzPHP.
De ce fait tout le mérite revient à [Daniel Coulbourne](https://twitter.com/DCoulbourne), [Jake Bathman](https://twitter.com/jakebathman), [Matt Stauffer](https://twitter.com/stauffermatt), [Jacob Baker-Kretzmar](https://twitter.com/bakerkretzmar) et [tous les autres contributeurs](https://github.com/tighten/ziggy/contributors) que nous remercions sincerement pour ce qu'ils font pour l'évolution du développement web

Merci à [Dimitri Sitchet Tomkeu](http://github.com/dimtrovich) pour la réadaptation.

## Licence

Zygot est un logiciel open source publié sous licence MIT. Voir [LICENSE](LICENCE) pour plus d'informations.