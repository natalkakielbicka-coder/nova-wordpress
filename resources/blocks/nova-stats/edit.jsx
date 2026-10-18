import { RichText, useBlockProps } from '@wordpress/block-editor';

export default function Edit({ attributes, setAttributes }) {
	const { heading, items = [] } = attributes;

	const firstItem = items[0] || {
		value: '',
		label: '',
	};

	const updateItem = (field, value) => {
		const updatedItems = [...items];

		updatedItems[0] = {
			...firstItem,
			[field]: value,
		};

		setAttributes({ items: updatedItems });
	};

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

			<div className="mt-8 border-t border-nova-line pt-6">
				<RichText
					tagName="p"
					className="font-serif text-5xl text-nova-ink"
					value={firstItem.value}
					onChange={(value) => updateItem('value', value)}
					placeholder="12+"
					allowedFormats={[]}
				/>

				<RichText
					tagName="p"
					className="mt-4 text-base text-nova-text"
					value={firstItem.label}
					onChange={(value) => updateItem('label', value)}
					placeholder="Lat doświadczenia"
					allowedFormats={[]}
				/>
			</div>
		</section>
	);
}
