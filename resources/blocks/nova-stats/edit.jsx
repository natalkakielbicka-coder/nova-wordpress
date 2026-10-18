import { RichText, useBlockProps } from '@wordpress/block-editor';

export default function Edit({ attributes, setAttributes }) {
	const { heading, items = [] } = attributes;

	const updateItem = (index, field, value) => {
		const updatedItems = items.map((item, itemIndex) =>
			itemIndex === index ? { ...item, [field]: value } : item,
		);

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

			<div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
				{items.map((item, index) => (
					<div key={index} className="border-t border-nova-line pt-6">
						<RichText
							tagName="p"
							className="font-serif text-5xl text-nova-ink"
							value={item.value || ''}
							onChange={(value) => updateItem(index, 'value', value)}
							placeholder="Wpisz liczbę..."
							allowedFormats={[]}
						/>

						<RichText
							tagName="p"
							className="mt-4 text-base text-nova-text"
							value={item.label || ''}
							onChange={(value) => updateItem(index, 'label', value)}
							placeholder="Opis statystyki..."
							allowedFormats={[]}
						/>
					</div>
				))}
			</div>
		</section>
	);
}
