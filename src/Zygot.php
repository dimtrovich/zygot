<?php

/**
 * This file is part of Zygot.
 *
 * (c) 2023 Dimitri Sitchet Tomkeu <devcode.dst@gmail.com>
 *
 * For the full copyright and license information, please view
 * the LICENSE file that was distributed with this source code.
 */

namespace Dimtrovich\Zygot;

use BlitzPHP\Container\Services;
use BlitzPHP\Utilities\Iterable\Arr;
use BlitzPHP\Utilities\Iterable\Collection;
use BlitzPHP\Utilities\String\Text;
use JsonSerializable;

/**
 * @credit <a href="https://github.com/tighten/ziggy">Ziggy - \Tightenco\Ziggy\Output\Ziggy</a>
 */
class Zygot implements JsonSerializable
{
    protected static $cache;
    protected string $url;

    /**
     * @var Collection<object>
     */
    protected Collection $routes;

    public function __construct(protected null|array|string $group = null, ?string $url = null)
    {
        $this->url = rtrim(site_url($url ?? '/'), '/');

        if (! static::$cache) {
            static::$cache = $this->nameKeyedRoutes();
        }

        $this->routes = static::$cache;
    }

    public static function clearRoutes()
    {
        static::$cache = null;
    }

    /**
     * @return Collection<object>
     */
    private function applyFilters(null|array|string $group): Collection
    {
        if ($group) {
            return $this->group($group);
        }

        // renvoie des routes non filtrées si l'utilisateur définit les deux options de configuration.
        if (config()->has('zygot.except') && config()->has('zygot.only')) {
            return $this->routes;
        }

        if (config()->has('zygot.except')) {
            return $this->filter(config('zygot.except'), false)->routes;
        }

        if (config()->has('zygot.only')) {
            return $this->filter(config('zygot.only'))->routes;
        }

        return $this->routes;
    }

    /**
     * Filtrer les routes par groupe.
     *
     * @return Collection<object>
     */
    private function group(null|array|string $group): Collection
    {
        if (is_array($group)) {
            $filters = [];

            foreach ($group as $groupName) {
                $filters = array_merge($filters, config("zygot.groups.{$groupName}"));
            }

            return $this->filter($filters, true)->routes;
        }

        if (config()->has("zygot.groups.{$group}")) {
            return $this->filter(config("zygot.groups.{$group}"), true)->routes;
        }

        return $this->routes;
    }

    /**
     * Filtrez les routes par nom en utilisant les modèles donnés.
     *
     * @param mixed $filters
     */
    public function filter($filters = [], bool $include = true): self
    {
        $this->routes = $this->routes->filter(static fn ($route, $name) => Text::is(Arr::wrap($filters), $name) ? $include : ! $include);

        return $this;
    }

    /**
     * Obtenez une liste des routes nommées de l'application, saisies par leurs noms.
     */
    private function nameKeyedRoutes(): Collection
    {
        /** @var Collection $fallbacks */
        /** @var Collection $routes */
        [$fallbacks, $routes] = collect($this->getRoutes())
            ->reject(static fn (object $route) => Text::startsWith($route->name, 'generated::'))
            ->partition(static fn (object $route) => $route->isFallback);

        return $routes->merge($fallbacks)->map(static function ($route) {
            return collect($route)->only(['uri', 'methods'])
                ->put('domain', $route->domain)
                ->filter();
        });
    }

    /**
     * Convertissez cette instance Zygot en tableau.
     */
    public function toArray(): array
    {
        return [
            'url'      => $this->url,
            'port'     => parse_url($this->url)['port'] ?? null,
            'routes'   => $this->applyFilters($this->group)->toArray(),
            'defaults' => [
				'locale'             => config('app.language'),
				'supportedLocales'   => config('app.supported_locales'),
				'throwOnUnavailable' => config('zygot.throw-on-unavailable', false),
            ],
        ];
    }

    /**
     * Convertissez cette instance Zygot en quelque chose de JSON sérialisable.
     */
    public function jsonSerialize(): array
    {
        return array_merge($routes = $this->toArray(), [
            'defaults' => (object) $routes['defaults'],
        ]);
    }

    /**
     * Convertissez cette instance Zygot en JSON.
     */
    public function toJson(int $options = 0): string
    {
        return json_encode($this->jsonSerialize(), $options);
    }

    private function getRoutes(): array
    {
        $collection = Services::routes()->loadRoutes();
        $methods    = [
            'get',
            'head',
            'post',
            'patch',
            'put',
            'delete',
            'options',
            'trace',
            'connect',
            'cli',
        ];
        $routes = [];

        foreach ($methods as $method) {
            foreach ($collection->getRoutes($method, true) as $route => $handler) {
                $options = $collection->getRoutesOptions($route);
                $name    = (is_array($handler) && array_key_exists('name', $handler)) ? $handler['name'] : ($options['as'] ?? $route);

                $routes[] = [
                    'methods'    => strtoupper($method),
                    'name'       => $name,
                    'domain'     => $options['domain'] ?? '',
                    'uri'        => $route,
                    'isFallback' => false,
                ];
            }
        }

        $routes = collect($routes)->groupBy(static fn ($route) => $route['name'])->toArray();

        foreach ($routes as $name => $route) {
            $routes[$name] = array_merge_recursive(...$route);
            $routes[$name] = array_map(static fn ($route) => (array) $route, $routes[$name]);

            foreach ($routes[$name] as $k => &$v) {
                $v = array_unique($v);
                if ($k !== 'methods') {
                    $v = array_pop($v);
                }
            }
        }

        return array_map(static fn ($route) => (object) $route, $routes);
    }
}
