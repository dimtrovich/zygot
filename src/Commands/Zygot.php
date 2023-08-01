<?php

/**
 * This file is part of Zygot.
 *
 * (c) 2023 Dimitri Sitchet Tomkeu <devcode.dst@gmail.com>
 *
 * For the full copyright and license information, please view
 * the LICENSE file that was distributed with this source code.
 */

namespace Dimtrovich\Zygot\Commands;

use BlitzPHP\Cli\Console\Command;
use BlitzPHP\Cli\Console\Console;
use BlitzPHP\Filesystem\Filesystem;
use Dimtrovich\Zygot\Output\File;
use Dimtrovich\Zygot\Zygot as ZygotZygot;
use Psr\Log\LoggerInterface;

class Zygot extends Command
{
    /**
     * @var string Groupe
     */
    protected $group = 'Zygot';

    /**
     * @var string Nom
     */
    protected $name = 'zygot:generate';

    /**
     * @var string Description
     */
    protected $description = 'Générez un fichier JavaScript contenant les itinéraires et la configuration de Ziggy.';

    /**
     * @var array Options
     */
    protected $options = [
        '--php'   => ['Chemin d\'accès au fichier JavaScript généré.', 'resources/js/zygot.js'],
        '--url'   => '',
        '--group' => '',
    ];

    /**
     * @param Console         $app    Application Console
     * @param LoggerInterface $logger Le Logger à utiliser
     */
    public function __construct(Console $app, LoggerInterface $logger, protected Filesystem $fs)
    {
        parent::__construct($app, $logger);
    }

    /**
     * {@inheritDoc}
     */
    public function execute(array $params)
    {
        $path            = $this->argument('path');
        $generatedRoutes = $this->generate($this->option('group'));

        $this->makeDirectory($path);
        $this->fs->put(base_path($path), $generatedRoutes);

        $this->info('Fichier généré!');
    }

    protected function makeDirectory(string $path): string
    {
        if (! $this->fs->isDirectory(dirname(base_path($path)))) {
            $this->fs->makeDirectory(dirname(base_path($path)), 0755, true, true);
        }

        return $path;
    }

    private function generate(null|string $group = null): string
    {
        $zygot = (new ZygotZygot($group, $this->option('url')));

        $output = config('zygot.output.file', File::class);

        return (string) new $output($zygot);
    }
}
