<?php

/**
 * This file is part of Zygot.
 *
 * (c) 2023 Dimitri Sitchet Tomkeu <devcode.dst@gmail.com>
 *
 * For the full copyright and license information, please view
 * the LICENSE file that was distributed with this source code.
 */

namespace Dimtrovich\Zygot\Config;

use Dimtrovich\Zygot\Decorator;

class Registrar
{
	public static function view(): array
    {
        return [
            'decorators' => [
				Decorator::class
			],
        ];
    }
}
