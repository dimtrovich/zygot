import { in_array } from "php-in-js/modules/array";
import { ltrim, rtrim, strpos, str_replace, substr_replace, strlen, trim } from "php-in-js/modules/string";
import { empty, is_array, is_object } from "php-in-js/modules/types";
import { http_build_query, parse_url, urlencode } from "php-in-js/modules/url";

/**
 * Une collection de routes BlitzPHP. Cette classe constitue l'API principale de Zygot.
 * 
 * @credit <a href="https://github.com/tighten/ziggy">Ziggy</a>
 */
export default class Router {
    /**
     * @param {Boolean} [absolute] - S'il faut inclure le chemin absolue a l'URL.
     */
    constructor(absolute = true, config) {
        this._config = config || (typeof Zygot !== 'undefined' ? Zygot : globalThis?.Zygot);
        this._config = { ...this._config, absolute };
		this._routes = this._config.routes;
    }

	/**
     * Obtenez toutes les valeurs de paramètre à partir de l'URL de la fenêtre actuelle.
     *
     * @example
     * // Pour l'URL https://dimtrovich.zygot.dev/posts/4?lang=en avec 'posts.show' route 'posts/{post}' et le domaine '{team}.zygot.dev'
     * route().params; // { team: 'dimtrovich', post: 4, lang: 'en' }
     *
     * @return {Object}
     */
    get params() {
        const { params, query } = this._unresolve();

        return { ...params, ...query };
    }

	/**
     * Obtenez le nom de la route correspondant à l'URL de la fenêtre actuelle ou, à partir d'un nom de route 
	 * et de paramètres, vérifiez si l'URL et les paramètres de la fenêtre actuelle correspondent à cette route.
     *
     * @example
     * // at URL https://zygot.dev/posts/4 with 'posts.show' route 'posts/{post}'
     * route().current(); // 'posts.show'
     * route().current('posts.index'); // false
     * route().current('posts.show'); // true
     * route().current('posts.show', { post: 1 }); // false
     * route().current('posts.show', { post: 4 }); // true
     *
     * @param {String} [name] - Nom de la route à vérifier.
     * @param {(String|Number|Array|Object)} [params] - Paramètres de la route.
     * @return {(Boolean|String|undefined)}
     */
    current(name, params) {
        const { name: current, params: currentParams, query, route } = this._unresolve();

        // Si un nom n'a pas été passé, retourne le nom de la route actuelle
        if (!name) return current;

        // Testez le nom passé par rapport à la route actuelle, en faisant correspondre 
		// certains caractères génériques de base, par ex. passer `events.*` correspond à `events.show`

       	return new RegExp(`^${name.replace(/\./g, '\\.').replace(/\*/g, '.*')}$`).test(current);

		// @todo gestion des parametres tel que les 2 exemples suivants
		// route().current('posts.show', { post: 1 }); // false
		// route().current('posts.show', { post: 4 }); // true
    }

	/**
     * Vérifiez si la route donnée existe.
     *
     * @param {String} name
     * @return {Boolean}
     */
    has(name) {
        return Object.keys(this._routes).includes(name);
    }

	/**
     * Obtenez la chaîne d'URL compilée pour la route et les paramètres actuels.
     *
     * @example
     * // with 'posts.show' route 'posts/{post}'
     * (new Router()).make('posts.show', 1); // 'https://zygot.dev/posts/1'
     *
     * @return {String}
     */
	make(search, params) {
		params = [...arguments];

		search = params.shift();
		params = params.shift();

		if (in_array(params, [null, undefined, 'undefined', 'null', ''], true)) {
			params = []
		}

		if (!this.has(search)) {
			if (this._config.defaults.throwOnUnavailable) {
				throw new Error(`Zygot error: route '${search}' is not in the route list.`)
			}

			return trim(this._config.url, '/')
		}
		
		let url = this._buildReverseRoute(this._routes[search], params);
		
		if (! this._config.absolute) {
			return rtrim(url, '/');
		}
		
		const parts  = parse_url(this._config.url);
		
		if (url.includes(parts.host)) {
			url =  `${parts.scheme}://` + ltrim(url.replace(`${parts.scheme}://`, ''), '/')
		} else {
			url = this._config.url + url
		}

		const parts2 = parse_url(url)
		const port   = (parts2.port || parts.port) || (this._config.port || 80)

		const uri = {
			scheme: parts2.scheme || parts.scheme,
			host: parts2.host || parts.host,
			port: port == 80 ? '' : ':' + port,
			path: parts2.path || parts.path,
			query: parts2.query || parts.query
		}
		
		return trim(`${uri.scheme}://${uri.host}${uri.port}${uri.path}${uri.query ? '?' + uri.query : ''}`, '/')
	}

	_buildReverseRoute(route, params) {
		if (!in_array(params, [null, undefined, 'undefined', 'null', ''], true) && !is_array(params)) {
			params = [params];
		}
		if (params.length && is_object(params[0])) {
			params = params[0];
		}
		
		let from = trim(route.domain || '', '/') + '/' + trim(route.uri, '/');
		
		if (from.includes('{locale}')) {
			let locale = null;
			if (params) {
				if (params.locale) {
					locale = params.locale
					delete params.locale
				}
			}
			
			from = this._replaceLocale(from, locale);
		}

		let matches = from.match(new RegExp(/\{([A-Za-z_?]+)\}/, 'g'));
		if (matches) {
			matches.forEach((match, index) => {
				let paramKey = str_replace(['{', '}', '?'], '', match);
				if (!params[paramKey]) {
					if (!in_array(params[index], [null, undefined, 'undefined', 'null', ''], true)) {
						paramKey = index
					} else if (params['id'] && !matches.includes('{id}')) {
						paramKey = 'id'
					}
				}

				if (!match.endsWith('?}') && params[paramKey] !== 0 && empty(params[paramKey])) {
					throw new Error(`'${paramKey}' parameter is required`);
				}
				const paramValue = in_array(params[paramKey], [null, undefined, 'undefined', 'null'], true) ? '' : params[paramKey]

				from = str_replace(match, urlencode(paramValue), from);
				delete params[paramKey];
			});
		}

		if (is_object(params) && Object.keys(params).length) {
			from += '?' + http_build_query(params)
		}

		matches = from.match(new RegExp(/\([^)]+\)/));
    
        if (matches) {
			// Construisez notre chaîne résultante, en insérant les $params aux endroits appropriés.
			matches.forEach((pattern, index) => {
				if (! params[index].match(new RegExp(`^${pattern}$`, 'g'))) {
					throw new Error("Invalid parameter type: " + params[index])
				}

				// Assurez-vous que le paramètre que nous insérons correspond au type de paramètre attendu.
				const pos  = strpos(from, pattern);
				from = substr_replace(from, params[index], pos, strlen(pattern));
			})
        }

        return '/' + ltrim(from, '/');
	}

	_replaceLocale(url, locale) {
		if (strpos(url, '{locale}') === false) {
            return url;
        }

        // Vérifier les paramètres régionaux non valides
        if (locale !== null) {
            if (! in_array(locale, this._config.defaults.supportedLocales || [], true)) {
                locale = null;
            }
        }

        if (locale === null) {
            locale = this._config.defaults.locale || 'en';
        }

        return str_replace('{locale}', locale, url);
	}

	/**
     * Déterminez si le modèle de cette route correspond à l'URL donnée.
     *
     * @param {Object} route - Route a tester.
     * @param {String} url - URL à vérifier.
     * @return {Object|false} - Si cette route correspond, renvoie les paramètres correspondants.
     */
    _matchesUrl(route, uri) {
		if (!route.methods.includes('GET')) return false;
		
		uri = trim(uri, '/')

        let path = route.uri.replace(/:([\w]+)/, (match) => {
            /* if (match[1] in this.#params) {
                return '(' + this.#params[match[1]] + ')';
            } */
            return '([^/]+)';
        })
        
        const regex   = new RegExp(`^${path}$`, 'i');
        const matches = uri.match(regex);
       
        if (matches == null) {
           return false;
        }
        matches.shift();
        
		return matches;
    }

	/**
     * Obtenez les paramètres, les valeurs et les métadonnées à partir de l'URL donnée.
     *
     * @param {String} [url] - L'URL à inspecter est par défaut l'URL de la fenêtre actuelle.
     * @return {{ name: string, params: Object, query: Object, route: Object }}
     */
    _unresolve(url) {
        if (!url) {
            url = this._currentUrl();
        } else if (this._config.absolute && url.startsWith('/')) {
            // Si nous utilisons des URL absolues et qu'une URL relative est transmise, 
			// préfixez l'hôte pour le rendre absolu
            url = this._location().host + url;
        }

        let matchedParams = {};
		
        const [name, route] = Object.entries(this._routes).find(
          ([name, route]) => (matchedParams = this._matchesUrl(route, url))
        ) || [undefined, undefined];

        return { name, ...matchedParams, route };
    }
	
	/**
     * Obtenir un objet représentant l'emplacement actuel
	 * (par défaut, ce sera la `fenêtre` JavaScript globale si elle est disponible).
     *
     * @return {Object}
     */
    _location() {
        const { host = '', pathname = '', search = '' } = typeof window !== 'undefined' ? window.location : {};

        return {
            host    : this._config.location?.host ?? host,
            pathname: this._config.location?.pathname ?? pathname,
            search  : this._config.location?.search ?? search,
        };
    }

	_currentUrl() {
        const { host, pathname, search } = this._location();

        return (
            this._config.absolute
                ? host + pathname
                : pathname.replace(this._config.url.replace(/^\w*:\/\/[^/]+/, ''), '').replace(/^\/+/, '/')
        ) + search;
    }
}
