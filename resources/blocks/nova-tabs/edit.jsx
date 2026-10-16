import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function Edit() {
	return (
		<div {...useBlockProps({ className: 'min-w-0 max-w-full space-y-6' })}>
			<div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
				<InnerBlocks
					allowedBlocks={['nova/tab']}
					template={[['nova/tab']]}
					templateLock={false}
				/>
			</div>
		</div>
	);
}
