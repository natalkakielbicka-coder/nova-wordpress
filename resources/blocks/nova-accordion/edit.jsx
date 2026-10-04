import { useBlockProps } from '@wordpress/block-editor';

export default function Edit() {
	const blockProps = useBlockProps({
		className: 'px-6 py-16 md:py-20',
	});

	return (
		<section {...blockProps}>
			<div className="mx-auto max-w-3xl">
				<div className="border-t border-nova-line">
					<div className="border-b border-nova-line">
						<div className="flex items-center justify-between gap-6 py-6">
							<span className="font-serif text-xl text-nova-ink">
								Jak wygląda proces realizacji projektu?
							</span>

							<span aria-hidden="true">+</span>
						</div>

						<div className="pb-6 text-nova-text">
							Proces rozpoczynam od analizy potrzeb, następnie przechodzę do projektu,
							wdrożenia i testów.
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
