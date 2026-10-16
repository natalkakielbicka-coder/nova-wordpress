import { useContext } from '@wordpress/element';
import { InnerBlocks, RichText, useBlockProps } from '@wordpress/block-editor';
import { ActiveTabContext } from '../nova-tabs/edit';

export default function Edit({ attributes, clientId, setAttributes }) {
	const activeClientId = useContext(ActiveTabContext);
	const isActive = activeClientId === null || activeClientId === clientId;

	return (
		<div
			{...useBlockProps({
				className: `min-w-0 max-w-full pt-6 text-base leading-8 text-nova-text ${
					isActive ? '' : 'hidden'
				}`,
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
