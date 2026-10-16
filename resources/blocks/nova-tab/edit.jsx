import { InnerBlocks, RichText, useBlockProps } from '@wordpress/block-editor';

export default function Edit({ attributes, setAttributes }) {
	return (
		<div
			{...useBlockProps({
				className: 'min-w-0 max-w-full pt-6 text-base leading-8 text-nova-text',
			})}
		>
			<RichText
				tagName="h3"
				className="mb-4 mt-0 font-serif text-2xl leading-tight text-nova-ink"
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
