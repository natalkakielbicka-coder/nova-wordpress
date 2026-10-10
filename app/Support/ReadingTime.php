<?php

namespace App\Support;

class ReadingTime
{
    public static function calculate(int $postId, int $wordsPerMinute = 200): int
    {
        $content = get_post_field('post_content', $postId);

        if (!is_string($content) || $content === '') {
            return 1;
        }

        $content = strip_shortcodes($content);
        $content = wp_strip_all_tags($content);

        preg_match_all('/[\p{L}\p{N}]+/u', $content, $matches);

        $wordCount = count($matches[0]);

        return max(1, (int) ceil($wordCount / max(1, $wordsPerMinute)));
    }
}
