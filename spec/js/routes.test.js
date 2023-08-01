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
    defaults: { locale: 'en' },
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
});

describe('has()', () => {
    test('can check if given named route exists', () => {
        assert(route().has('posts.show'));
        assert(!route().has('non.existing.route'));
    });
});
