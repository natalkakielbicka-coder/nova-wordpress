<?php

namespace App\Providers;

use App\Repositories\FavoriteProductsRepository;
use App\Repositories\ProjectRepository;
use Roots\Acorn\Sage\SageServiceProvider;

class ThemeServiceProvider extends SageServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        parent::register();

        $this->app->bind(
            ProjectRepository::class,
            fn () => new ProjectRepository()
        );

        $this->app->bind(
            FavoriteProductsRepository::class,
            fn () => new FavoriteProductsRepository()
        );
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        parent::boot();
    }
}
