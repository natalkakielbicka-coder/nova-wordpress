import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function Edit() {
	return (
		<div {...useBlockProps({ className: 'min-w-0 max-w-full space-y-6' })}>
			<InnerBlocks
				allowedBlocks={['nova/tab']}
				template={[['nova/tab']]}
				templateLock={false}
			/>
		</div>
	);
}
