import { RichText, useBlockProps } from '@wordpress/block-editor';

export default function Edit({ attributes, setAttributes }) {
	return (
		<div {...useBlockProps()}>
			<RichText
				tagName="h3"
				value={attributes.title}
				onChange={(value) => setAttributes({ title: value })}
				placeholder="Tytuł zakładki..."
				allowedFormats={[]}
			/>
		</div>
	);
}
