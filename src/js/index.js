import Router from './Router';

export default function route(name, params, absolute, config) {
    const router = new Router(absolute);

    return name ? router.make(name, params) : router;
}
