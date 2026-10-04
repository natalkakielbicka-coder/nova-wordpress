<?php

$wrapper_attributes = get_block_wrapper_attributes([
    'class' => 'px-6 py-16 md:py-20',
]);
?>

<section
    <?php echo $wrapper_attributes; ?>
    data-wp-interactive="nova/accordion"
>
    <div class="mx-auto max-w-3xl">
        <div class="border-t border-nova-line">
            <div class="border-b border-nova-line" data-wp-context='<?php echo wp_json_encode([
                'isOpen' => false,
            ]); ?>'>
                <button
                    type="button"
                    class="flex w-full items-center justify-between gap-6 py-6 text-left"
                    data-wp-on--click="actions.toggle" data-wp-bind--aria-expanded="context.isOpen">
                    <span class="font-serif text-xl text-nova-ink">
                        Jak wygląda proces realizacji projektu?
                    </span>

                    <span
                        aria-hidden="true"
                        data-wp-bind--hidden="context.isOpen"
                    >
                        +
                    </span>

                    <span
                        aria-hidden="true"
                        data-wp-bind--hidden="!context.isOpen"
                    >
                        −
                    </span>
                </button>

                <div class="pb-6 text-nova-text" data-wp-bind--hidden="!context.isOpen">
                    Proces rozpoczynam od analizy potrzeb, następnie przechodzę
                    do projektu, wdrożenia i testów.
                </div>
            </div>

            <div
                class="border-b border-nova-line"
                data-wp-context='<?php echo wp_json_encode([
                    'isOpen' => false,
                ]); ?>'
            >
                <button
                    type="button"
                    class="flex w-full items-center justify-between gap-6 py-6 text-left"
                    data-wp-on--click="actions.toggle"
                    data-wp-bind--aria-expanded="context.isOpen"
                >
                    <span class="font-serif text-xl text-nova-ink">
                        Jakich technologii używasz?
                    </span>

                    <span
                        aria-hidden="true"
                        data-wp-bind--hidden="context.isOpen"
                    >
                        +
                    </span>

                    <span
                        aria-hidden="true"
                        data-wp-bind--hidden="!context.isOpen"
                    >
                        −
                    </span>
                </button>

                <div
                    class="pb-6 text-nova-text"
                    data-wp-bind--hidden="!context.isOpen"
                >
                    WordPress, Sage, Tailwind CSS, JavaScript i nowoczesne API WordPressa.
                </div>
            </div>
        </div>
    </div>
</section>