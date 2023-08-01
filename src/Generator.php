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

use Dimtrovich\Zygot\Output\MergeScript;
use Dimtrovich\Zygot\Output\Script;
use Stringable;

/**
 * @credit <a href="https://github.com/tighten/ziggy">Ziggy - \Tightenco\Ziggy\BladeRouteGenerator</a>
 */
class Generator
{
    public static bool $generated = false;

    public function generate(null|array|string $group = null, ?string $nonce = null): string
    {
        $zygot = new Zygot($group);

        $nonce = $nonce ? ' nonce="' . $nonce . '"' : '';

        if (static::$generated) {
            return (string) $this->generateMergeJavascript($zygot, $nonce);
        }

        $function = $this->getRouteFunction();

        static::$generated = true;

        $output = config('zygot.output.script', Script::class);

        return (string) new $output($zygot, $function, $nonce);
    }

    /**
     * @return Stringable
     */
    private function generateMergeJavascript(Zygot $zygot, string $nonce = '')
    {
        $output = config('zygot.output.merge_script', MergeScript::class);

        return new $output($zygot, $nonce);
    }

    /**
     * @return false|string
     */
    private function getRouteFunction()
    {
        return config('zygot.skip-route-function') ? '' : file_get_contents(__DIR__ . '/../dist/index.js');
    }
}
