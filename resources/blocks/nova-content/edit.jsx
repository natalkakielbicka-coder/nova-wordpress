import { InnerBlocks, InspectorControls, useBlockProps } from '@wordpress/block-editor';

import { PanelBody, SelectControl } from '@wordpress/components';

const ALLOWED_BLOCKS = [
	'core/heading',
	'core/paragraph',
	'core/image',
	'core/list',
	'core/buttons',
];

const TEMPLATE = [
	[
		'core/heading',
		{
			level: 2,
			placeholder: 'Nagłówek sekcji...',
			lock: {
				move: true,
				remove: true,
			},
		},
	],
	[
		'core/paragraph',
		{
			placeholder: 'Dodaj treść sekcji...',
		},
	],
];

const widthClasses = {
	narrow: 'max-w-xl',
	standard: 'max-w-2xl',
	wide: 'max-w-3xl',
};

export default function Edit({ attributes, setAttributes }) {
	const { width } = attributes;
	const blockProps = useBlockProps({
		className: 'nova-content w-full px-6 py-16 md:py-20',
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title="Ustawienia sekcji" initialOpen={true}>
					<SelectControl
						label="Szerokość treści"
						value={width}
						options={[
							{ label: 'Wąska', value: 'narrow' },
							{ label: 'Standardowa', value: 'standard' },
							{ label: 'Szeroka', value: 'wide' },
						]}
						onChange={(value) => setAttributes({ width: value })}
					/>
				</PanelBody>
			</InspectorControls>
			<section {...blockProps}>
				<div className={`mx-auto ${widthClasses[width]}`}>
					<InnerBlocks allowedBlocks={ALLOWED_BLOCKS} template={TEMPLATE} />
				</div>
			</section>
		</>
	);
}
