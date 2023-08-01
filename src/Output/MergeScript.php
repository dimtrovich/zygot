<?php

/**
 * This file is part of Zygot.
 *
 * (c) 2023 Dimitri Sitchet Tomkeu <devcode.dst@gmail.com>
 *
 * For the full copyright and license information, please view
 * the LICENSE file that was distributed with this source code.
 */

namespace Dimtrovich\Zygot\Output;

use Dimtrovich\Zygot\Zygot;
use Stringable;

/**
 * @credit <a href="https://github.com/tighten/ziggy">Ziggy - \Tightenco\Ziggy\Output\MergeScript</a>
 */
class MergeScript implements Stringable
{
    public function __construct(protected Zygot $zygot, protected string $nonce = '')
    {
    }

    public function __toString(): string
    {
        $routes = json_encode($this->zygot->toArray()['routes']);

        return <<<HTML
            <script type="text/javascript"{$this->nonce}>
                (function () {
                    const routes = {$routes};

                    Object.assign(Zygot.routes, routes);
                })();
            </script>
            HTML;
    }
}
