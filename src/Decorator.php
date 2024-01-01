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
		$zygot = zygot();
		$html  = str_replace('</head>', "\n\t$zygot\n</head>", $html);

        return $html;
    }
}
