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

use BlitzPHP\Contracts\View\ViewDecoratorInterface;

class Decorator implements ViewDecoratorInterface
{
    public static function decorate(string $html): string
    {
		if (! static::isExcludeRoute()) {
			$zygot = zygot();
			$html  = str_replace('</head>', "\n\t$zygot\n</head>", $html);
		}

        return $html;
    }

	private static function isExcludeRoute(): bool 
	{
		if (is_string($routes = config('zygot.except', []))) {
			$routes = explode(',', $routes);
		}

		foreach (array_map('trim', $routes) as $route) {
			if (url_is($route)) {
				return true;
			}
		}

		return false;
	}
}
