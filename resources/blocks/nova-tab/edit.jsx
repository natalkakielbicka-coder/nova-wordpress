import { InnerBlocks, RichText, useBlockProps } from '@wordpress/block-editor';

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
			<InnerBlocks
				allowedBlocks={[
					'core/paragraph',
					'core/heading',
					'core/image',
					'core/list',
					'core/buttons',
					'core/group',
				]}
				templateLock={false}
			/>
		</div>
	);
}
