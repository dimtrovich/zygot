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
		$routes = config('zygot.except', '');
		if (is_string($routes)) {
			$routes = explode(',', $routes);
		}

		$routes = array_map(static fn(string $route) => ltrim(rtrim($route)), $routes);
		
        return in_array(uri_string(), $routes, true);
	}
}
