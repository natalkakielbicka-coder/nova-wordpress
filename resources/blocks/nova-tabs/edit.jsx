import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function Edit() {
	return (
		<div {...useBlockProps()}>
			<InnerBlocks
				allowedBlocks={['nova/tab']}
				template={[['nova/tab']]}
				templateLock={false}
			/>
		</div>
	);
}
