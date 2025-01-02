/**
 * @jest-environment jsdom
 */

import assert, { deepEqual, strictEqual as same, throws } from 'assert';
import route from '../../src/js';

const defaultWindow = {
    location: {
        host: 'zygot.dev',
    },
};

const defaultZygot = {
    url: 'https://zygot.dev',
    port: null,
    defaults: { 
		locale: 'en', 
		throwOnUnavailable: true
	},
    routes: {
        home: {
            uri: '/',
            methods: ['GET', 'HEAD'],
        },
        'posts.index': {
            uri: 'posts',
            methods: ['GET', 'HEAD'],
        },
        'posts.show': {
            uri: 'posts/{post}',
            methods: ['GET', 'HEAD'],
            bindings: {
                post: 'id',
            },
        },
        'posts.update': {
            uri: 'posts/{post}',
            methods: ['PUT'],
            bindings: {
                post: 'id',
            },
        },
        'postComments.show': {
            uri: 'posts/{post}/comments/{comment}',
            methods: ['GET', 'HEAD'],
            bindings: {
                post: 'id',
                comment: 'uuid',
            },
        },
        'translatePosts.index': {
            uri: '{locale}/posts',
            methods: ['GET', 'HEAD'],
        },
        'translatePosts.show': {
            uri: '{locale}/posts/{id}',
            methods: ['GET', 'HEAD'],
        },
        'translatePosts.update': {
            uri: '{locale}/posts/{post}',
            methods: ['PUT', 'PATCH'],
        },
        'events.venues-index': {
            uri: 'events/{event}/venues-index',
            methods: ['GET', 'HEAD'],
            bindings: {
                event: 'id',
            },
        },
        'events.venues.index': {
            uri: 'events/{event}/venues',
            methods: ['GET', 'HEAD'],
            bindings: {
                event: 'id',
            },
        },
        'events.venues.show': {
            uri: 'events/{event}/venues/{venue}',
            methods: ['GET', 'HEAD'],
            bindings: {
                event: 'id',
                venue: 'id',
            },
        },
        'events.venues.update': {
            uri: 'events/{event}/venues/{venue}',
            methods: ['PUT', 'PATCH'],
        },
        'translateEvents.venues.show': {
            uri: '{locale}/events/{event}/venues/{venue}',
            methods: ['GET', 'HEAD'],
            bindings: {
                event: 'id',
                venue: 'id',
            },
        },
        'conversations.show': {
            uri: 'subscribers/{subscriber}/conversations/{type}/{conversation_id?}',
            methods: ['GET', 'HEAD'],
        },
        optional: {
            uri: 'optional/{id}/{slug?}',
            methods: ['GET', 'HEAD'],
        },
        optionalId: {
            uri: 'optionalId/{type}/{id?}',
            methods: ['GET', 'HEAD'],
        },
        'team.user.show': {
            uri: 'users/{id}',
            methods: ['GET', 'HEAD'],
            domain: '{team}.zygot.dev',
        },
        'translateTeam.user.show': {
            uri: '{locale}/users/{id}',
            methods: ['GET', 'HEAD'],
            domain: '{team}.zygot.dev',
        },
        'products.show': {
            uri: '{country?}/{language?}/products/{id}',
            methods: ['GET', 'HEAD'],
        },
        'hosting-contacts.index': {
            uri: 'hosting-contacts',
            methods: ['GET', 'HEAD'],
        },
        'pages.optional': {
            uri: 'optionalpage/{page?}',
            methods: ['GET', 'HEAD'],
        },
        'pages.optionalExtension': {
            uri: 'download/file{extension?}',
            methods: ['GET', 'HEAD'],
        },
        'pages.requiredExtension': {
            uri: 'strict-download/file{extension}',
            methods: ['GET', 'HEAD'],
        },
        'pages.optionalWhere': {
            uri: 'where/optionalpage/{page?}',
            methods: ['GET', 'HEAD'],
            wheres: {
                page: '[0-9]+',
            },
        },
        'pages.optionalExtensionWhere': {
            uri: 'where/download/file{extension?}',
            methods: ['GET', 'HEAD'],
            wheres: {
                extension: '\\.(php|html)',
            },
        },
        'pages.requiredExtensionWhere': {
            uri: 'where/strict-download/file{extension}',
            methods: ['GET', 'HEAD'],
            wheres: {
                extension: '\\.(php|html)',
            },
        },
        'pages.complexWhere': {
            uri: 'where/{word}-{digit}/{required}/{optional?}/file{extension?}',
            methods: ['GET', 'HEAD'],
            wheres: {
                word: '[a-z_-]+',
                digit: '[0-9]+',
                required: 'required',
                optional: 'optional',
                extension: '\\.(php|html)',
            },
        },
        'pages.complexWhereConflict1': {
            uri: 'where/{digit}-{word}/{required}/{optional?}/file{extension?}',
            methods: ['GET', 'HEAD'],
            wheres: {
                word: '[a-z_-]+',
                digit: '[0-9]+',
                required: 'required',
                optional: 'optional',
                extension: '\\.(php|html)',
            },
        },
        'pages.complexWhereConflict2': {
            uri: 'where/complex-{digit}/{required}/{optional?}/file{extension?}',
            methods: ['GET', 'HEAD'],
            wheres: {
                digit: '[0-9]+',
                required: 'different_but_required',
                optional: 'optional',
                extension: '\\.(php|html)',
            },
        },
        pages: {
            uri: '{page}',
            methods: ['GET', 'HEAD'],
        },
        slashes: {
            uri: 'slashes/{encoded}/{slug}',
            methods: ['GET', 'HEAD'],
            wheres: {
                slug: '.*',
            },
        },
        'regex.any': {
            uri: 'regex/(.*)',
            methods: ['GET', 'HEAD'],
        },
        'regex.segment': {
            uri: 'regex/([^/]+)',
            methods: ['GET', 'HEAD'],
        },
        'regex.alphanum': {
            uri: 'regex/([a-zA-Z0-9]+)',
            methods: ['GET', 'HEAD'],
        },
        'regex.num': {
            uri: 'regex/([0-9]+)',
            methods: ['GET', 'HEAD'],
        },
        'regex.alpha': {
            uri: 'regex/([a-zA-Z]+)',
            methods: ['GET', 'HEAD'],
        },
        'regex.hash': {
            uri: 'regex/([^/]+)',
            methods: ['GET', 'HEAD'],
        },
        'regex.slug': {
            uri: 'regex/([a-z0-9-]+)',
            methods: ['GET', 'HEAD'],
        },
        'regex.many': {
            uri: 'regex/([a-zA-Z]+)/([0-9]+)/([^/]+)',
            methods: ['GET', 'HEAD'],
        },
    },
};

beforeAll(() => {
    delete window.location;
    window.location = {};
});

beforeEach(() => {
    window.location = { ...defaultWindow.location };
    global.window.location = window.location;
    global.Zygot = { ...defaultZygot };
});

describe('route()', () => {
    test('can generate a URL with no parameters', () => {
        same(route('posts.index'), 'https://zygot.dev/posts');
    });

    test('can generate a URL with default parameters', () => {
        same(route('translatePosts.index'), 'https://zygot.dev/en/posts');
    });

	test('can generate a relative URL by passing absolute = false', () => {
        same(route('posts.index', [], false), '/posts');
    });

	test('can generate a URL with filled optional parameters', () => {
        same(
            route('conversations.show', {
                type: 'email',
                subscriber: 123,
                conversation_id: 1234,
            }),
            'https://zygot.dev/subscribers/123/conversations/email/1234'
        );
    });

	test('can generate a relative URL with filled optional parameters', () => {
        same(
            route('conversations.show', {
                type: 'email',
                subscriber: 123,
                conversation_id: 1234,
            }, false),
            '/subscribers/123/conversations/email/1234'
        );
    });

    test('can generate a relative URL with default parameters', () => {
        same(route('translatePosts.index', [], false), '/en/posts');
    });

    test('can error if a required parameter is not provided', () => {
        throws(() => route('posts.show'), /'post' parameter is required/);
    });

	test('can error if a required parameter is not provided to a route with default parameters', () => {
        throws(() => route('translatePosts.show'), /'id' parameter is required/);
    });

    test('can generate a URL using an integer', () => {
        // route with required parameters
        same(route('posts.show', 1), 'https://zygot.dev/posts/1');
        // route with default parameters
        same(route('translatePosts.show', 1), 'https://zygot.dev/en/posts/1');
    });

    test('can generate a URL using a string', () => {
        // route with required parameters
        same(route('posts.show', 'my-first-post'), 'https://zygot.dev/posts/my-first-post');
        // route with default parameters
        same(route('translatePosts.show', 'my-first-post'), 'https://zygot.dev/en/posts/my-first-post');
    });

	test('can generate a URL using an object', () => {
        // routes with required parameters
        same(route('posts.show', { id: 1 }), 'https://zygot.dev/posts/1');
        same(route('events.venues.show', { event: 1, venue: 2 }), 'https://zygot.dev/events/1/venues/2');
        // route with optional parameters
        same(route('optionalId', { type: 'model', id: 1 }), 'https://zygot.dev/optionalId/model/1');
        // route with both required and default parameters
        same(route('translateEvents.venues.show', { event: 1, venue: 2 }), 'https://zygot.dev/en/events/1/venues/2');
    });

    test('can generate a URL using an array', () => {
        // routes with required parameters
        same(route('posts.show', [1]), 'https://zygot.dev/posts/1');
        same(route('events.venues.show', [1, 2]), 'https://zygot.dev/events/1/venues/2');
        same(route('events.venues.show', [1, 'coliseum']), 'https://zygot.dev/events/1/venues/coliseum');
        // route with default parameters
        same(route('translatePosts.show', [1]), 'https://zygot.dev/en/posts/1');
        // route with both required and default parameters
        same(route('translateEvents.venues.show', [1, 2]), 'https://zygot.dev/en/events/1/venues/2');
    });

	test('can generate a URL for a route with domain parameters', () => {
        // route with required domain parameters
        same(route('team.user.show', { team: 'dimtrovich', id: 1 }), 'https://dimtrovich.zygot.dev/users/1');
        // route with required domain parameters and default parameters
        same(route('translateTeam.user.show', { team: 'dimtrovich', id: 1 }), 'https://dimtrovich.zygot.dev/en/users/1');
    });

	test('can return base URL if path is "/"', () => {
        same(route('home'), 'https://zygot.dev');
    });

	test('can ignore an optional parameter', () => {
        same(route('optional', { id: 123 }), 'https://zygot.dev/optional/123');
        same(route('optional', { id: 123, slug: 'news' }), 'https://zygot.dev/optional/123/news');
        same(route('optional', { id: 123, slug: null }), 'https://zygot.dev/optional/123');
    });

	test('can ignore a single optional parameter', () => {
        same(route('pages.optional'), 'https://zygot.dev/optionalpage');
        same(route('pages.optional', {}), 'https://zygot.dev/optionalpage');
        same(route('pages.optional', undefined), 'https://zygot.dev/optionalpage');
        same(route('pages.optional', null), 'https://zygot.dev/optionalpage');
    });

	test('missing optional parameter in first path segment', () => {
        same(route('products.show', { country: 'ca', language: 'fr', id: 1 }), 'https://zygot.dev/ca/fr/products/1');
        // These URLs aren't valid but this matches the behavior of Laravel's PHP `route()` helper
        same(route('products.show', { country: 'ca', id: 1 }), 'https://zygot.dev/ca//products/1');
        // First param is handled correctly
        same(route('products.show', { language: 'fr', id: 1 }), 'https://zygot.dev/fr/products/1');
    });

	test('can error if a route name doesn’t exist', () => {
        throws(() => route('unknown-route'), /Zygot error: route 'unknown-route' is not in the route list\./);
    });

	test('return base url if a route name doesn’t exist', () => {
		global.Zygot.defaults.throwOnUnavailable = false;
        
		same(route('unknown-route'), 'https://zygot.dev');
    });

	test('can automatically append extra parameter values as a query string', () => {
        same(
            route('events.venues.show', {
                event: 1,
                venue: 2,
                search: 'rogers',
                page: 2,
            }),
            'https://zygot.dev/events/1/venues/2?search=rogers&page=2'
        );
		same(
            route('events.venues.show', {
                id: 2,
                event: 1,
                venue: 2,
                search: 'rogers',
            }),
            'https://zygot.dev/events/1/venues/2?id=2&search=rogers'
        );
        // ignore values explicitly set to `null`
        same(route('posts.index', { filled: 'filling', empty: null }), 'https://zygot.dev/posts?filled=filling');
    });

	test('can cast boolean query parameters to integers', () => {
        same(route('posts.show', { post: 1, preview: true }), 'https://zygot.dev/posts/1?preview=1');
    });
	
	test('can generate a URL with a port', () => {
        global.Zygot.url = 'https://zygot.dev:81';
        global.Zygot.port = 81;

        // route with no parameters
        same(route('posts.index'), 'https://zygot.dev:81/posts');
        // route with required domain parameters
        same(route('team.user.show', { team: 'dimtrovich', id: 1 }), 'https://dimtrovich.zygot.dev:81/users/1');
    });

	test('can handle trailing path segments in the base URL', () => {
        global.Zygot.url = 'https://test.thing/ab/cd';

        same(route('events.venues.index', 1), 'https://test.thing/ab/cd/events/1/venues');
    });

	test('can URL-encode named parameters', () => {
        global.Zygot.url = 'https://test.thing/ab/cd';

        same(
            route('events.venues.index', { event: 'Fun&Games' }),
            'https://test.thing/ab/cd/events/Fun%26Games/venues'
        );
        same(
            route('events.venues.index', {
                event: 'Fun&Games',
                location: 'Blues&Clues',
            }),
            'https://test.thing/ab/cd/events/Fun%26Games/venues?location=Blues%26Clues'
        );
    });

	test('can handle a parameter explicity set to `0`', () => {
        same(route('posts.update', 0), 'https://zygot.dev/posts/0');
    });

	test('can accept a custom Zygot configuration object', () => {
        const config = {
            url: 'http://notYourAverage.dev',
            port: null,
            defaults: { locale: 'en' },
            routes: {
                'dimtrovichDev.packages.index': {
                    uri: 'dimtrovichDev/{dev}/packages',
                    methods: ['GET', 'HEAD'],
                },
            },
        };

        same(
            route('dimtrovichDev.packages.index', { dev: 1 }, true, config),
            'http://notYourAverage.dev/dimtrovichDev/1/packages'
        );
    });

	test('can use global route prefix name', () => {
		global.Zygot.defaults.routeNamePrefix = 'posts.';
        
        same(route('show', { post: 1, preview: true }), 'https://zygot.dev/posts/1?preview=1');
        same(route('show', [1]), 'https://zygot.dev/posts/1');
        same(route('show', { id: 1 }), 'https://zygot.dev/posts/1');
        same(route('show', 'my-first-post'), 'https://zygot.dev/posts/my-first-post');
        same(route('show', 1), 'https://zygot.dev/posts/1');
		same(route('index', [], false), '/posts');
		same(route('index'), 'https://zygot.dev/posts');
		same(route('index', [12]), 'https://zygot.dev/posts');

		global.Zygot.defaults.routeNamePrefix = '';
    });

	test('can use regex', () => {
        same(route('regex.any', [1]), 'https://zygot.dev/regex/1');
        same(route('regex.segment', [1]), 'https://zygot.dev/regex/1');
        same(route('regex.alphanum', ['abc123']), 'https://zygot.dev/regex/abc123');
        
		same(route('regex.num', ['123']), 'https://zygot.dev/regex/123');
        same(route('regex.num', 123), 'https://zygot.dev/regex/123');
        same(route('regex.num', [123]), 'https://zygot.dev/regex/123');
        
		same(route('regex.alpha', ['abc']), 'https://zygot.dev/regex/abc');
		same(route('regex.alpha', 'abc'), 'https://zygot.dev/regex/abc');
		expect(() => route('regex.alpha', 123)).toThrow('Zygot error: Invalid parameter type: \'123\'');
		
		same(route('regex.hash', 'abc'), 'https://zygot.dev/regex/abc');
		same(route('regex.slug', 'article-123'), 'https://zygot.dev/regex/article-123');
		same(route('regex.many', ['article', 123, 'abc']), 'https://zygot.dev/regex/article/123/abc');
    });
});

describe('has()', () => {
    test('can check if given named route exists', () => {
        assert(route().has('posts.show'));
        assert(!route().has('non.existing.route'));
    });
});
