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
 * @credit <a href="https://github.com/tighten/ziggy">Ziggy - \Tightenco\Ziggy\Output\File</a>
 */
class File implements Stringable
{
    public function __construct(protected Zygot $zygot)
    {
    }

    public function __toString(): string
    {
        return <<<JAVASCRIPT
            const Zygot = {$this->zygot->toJson()};

            if (typeof window !== 'undefined' && typeof window.Zygot !== 'undefined') {
                Object.assign(Zygot.routes, window.Zygot.routes);
            }

            export { Zygot };

            JAVASCRIPT;
    }
}
