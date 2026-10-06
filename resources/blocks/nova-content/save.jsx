import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const { width } = attributes;
	const blockProps = useBlockProps.save({
		className: 'nova-content px-6 py-16 md:py-20',
	});

	const widthClasses = {
		narrow: 'max-w-3xl',
		standard: 'max-w-5xl',
		wide: 'max-w-7xl',
	};

	return (
		<section {...blockProps}>
			<div className={`mx-auto ${widthClasses[width]}`}>
				<InnerBlocks.Content />
			</div>
		</section>
	);
}
