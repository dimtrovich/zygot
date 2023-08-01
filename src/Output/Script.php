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
 * @credit <a href="https://github.com/tighten/ziggy">Ziggy - \Tightenco\Ziggy\Output\Script</a>
 */
class Script implements Stringable
{
    public function __construct(protected Zygot $zygot, protected string $function, protected string $nonce = '')
    {
    }

    public function __toString(): string
    {
        return <<<HTML
            <script type="text/javascript" {$this->nonce}>
                const Zygot = {$this->zygot->toJson()};

                {$this->function}
            </script>
            HTML;
    }
}
