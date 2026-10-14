import { RichText, useBlockProps } from '@wordpress/block-editor';

export default function Edit({ attributes, setAttributes }) {
	const { eyebrow = '', heading = '', description = '' } = attributes;

	return (
		<section {...useBlockProps({ className: 'px-4 py-12 sm:px-6 md:py-20' })}>
			<header className="mx-auto mb-8 max-w-3xl text-center md:mb-12">
				<RichText
					tagName="p"
					className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-nova-muted"
					value={eyebrow}
					onChange={(value) => setAttributes({ eyebrow: value })}
					placeholder="Nadtytuł sekcji..."
					allowedFormats={[]}
				/>
				<RichText
					tagName="h2"
					className="font-serif text-4xl leading-tight tracking-tight text-nova-ink md:text-5xl"
					value={heading}
					onChange={(value) => setAttributes({ heading: value })}
					placeholder="Nagłówek sekcji..."
					allowedFormats={[]}
				/>
				<RichText
					tagName="p"
					className="mx-auto mt-6 max-w-xl text-base leading-7 text-nova-text"
					value={description}
					onChange={(value) => setAttributes({ description: value })}
					placeholder="Krótki opis sekcji..."
					allowedFormats={[]}
				/>
			</header>
		</section>
	);
}
