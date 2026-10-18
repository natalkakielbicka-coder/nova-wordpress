import { RichText, useBlockProps } from '@wordpress/block-editor';

export default function Edit({ attributes, setAttributes }) {
	const { heading } = attributes;

	const blockProps = useBlockProps();

	return (
		<section {...blockProps}>
			<RichText
				tagName="h2"
				value={heading}
				onChange={(value) => setAttributes({ heading: value })}
				placeholder="Wpisz nagłówek statystyk..."
				allowedFormats={[]}
			/>
		</section>
	);
}
