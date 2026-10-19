<?php

namespace App\Providers;

use App\Repositories\FavoriteProductsRepository;
use App\Repositories\ProjectRepository;
use App\Contracts\CardRepositoryInterface;
use App\Repositories\CardRepository;
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

        $this->app->bind(
            CardRepositoryInterface::class,
            CardRepository::class
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
