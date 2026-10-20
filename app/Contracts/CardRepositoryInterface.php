<?php

namespace App\Contracts;

interface CardRepositoryInterface
{
    public function clearCache(): void;

    public function getLatest(
        string $postType = 'post',
        int $limit = 3
    ): array;
}
