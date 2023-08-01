<?php

/**
 * This file is part of Zygot.
 *
 * (c) 2023 Dimitri Sitchet Tomkeu <devcode.dst@gmail.com>
 *
 * For the full copyright and license information, please view
 * the LICENSE file that was distributed with this source code.
 */

use Dimtrovich\Zygot\Generator;

if (! function_exists('zygot')) {

    function zygot(null|array|string $group = null, ?string $nonce = null): string
    {
        return service(Generator::class)->generate($group, $nonce);
    }
}
