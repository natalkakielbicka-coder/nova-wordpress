import { InspectorControls, RichText, useBlockProps } from '@wordpress/block-editor';
import { Button, PanelBody, ToggleControl, SelectControl } from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
	const { eyebrow, heading, description, items, openFirstItem, singleOpen, headingAlignment } =
		attributes;
	const blockProps = useBlockProps({
		className: 'px-4 py-12 sm:px-6 md:py-20',
	});

	const updateItem = (index, field, value) => {
		const updatedItems = items.map((item, itemIndex) => {
			if (itemIndex !== index) {
				return item;
			}

			return {
				...item,
				[field]: value,
			};
		});

		setAttributes({ items: updatedItems });
	};

	const addItem = () => {
		setAttributes({
			items: [
				...items,
				{
					question: 'Nowe pytanie',
					answer: 'Dodaj odpowiedź...',
				},
			],
		});
	};

	const removeItem = (index) => {
		setAttributes({
			items: items.filter((_, itemIndex) => itemIndex !== index),
		});
	};

	const moveItem = (index, direction) => {
		const newIndex = index + direction;

		if (newIndex < 0 || newIndex >= items.length) {
			return;
		}

		const updatedItems = [...items];

		[updatedItems[index], updatedItems[newIndex]] = [
			updatedItems[newIndex],
			updatedItems[index],
		];

		setAttributes({ items: updatedItems });
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title="Ustawienia accordionu" initialOpen>
					<ToggleControl
						label="Otwórz pierwszy element"
						checked={openFirstItem}
						onChange={(value) => setAttributes({ openFirstItem: value })}
					/>
					<ToggleControl
						label="Tylko jeden element otwarty"
						checked={singleOpen}
						onChange={(value) => setAttributes({ singleOpen: value })}
					/>
				</PanelBody>

				<PanelBody title="Ustawienia nagłówka" initialOpen={false}>
					<SelectControl
						label="Wyrównanie nagłówka"
						value={headingAlignment}
						options={[
							{ label: 'Do lewej', value: 'left' },
							{ label: 'Na środku', value: 'center' },
						]}
						onChange={(value) => setAttributes({ headingAlignment: value })}
					/>
				</PanelBody>
			</InspectorControls>
			<section {...blockProps}>
				<div className="mx-auto max-w-3xl">
					<div
						className={`mb-8 md:mb-12 ${
							headingAlignment === 'left' ? 'text-left' : 'text-center'
						}`}
					>
						<RichText
							tagName="p"
							className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-nova-muted"
							value={eyebrow}
							onChange={(value) => setAttributes({ eyebrow: value })}
							placeholder="Nadtytuł sekcji..."
							allowedFormats={[]}
						/>

						<RichText
							tagName="h2"
							className="font-serif text-4xl leading-tight tracking-tight text-nova-ink md:text-5xl"
							value={heading}
							onChange={(value) => setAttributes({ heading: value })}
							placeholder="Nagłówek FAQ..."
							allowedFormats={[]}
						/>

						<RichText
							tagName="p"
							className={`mt-6 max-w-xl text-base leading-7 text-nova-text ${
								headingAlignment === 'center' ? 'mx-auto' : ''
							}`}
							value={description}
							onChange={(value) => setAttributes({ description: value })}
							placeholder="Krótki opis sekcji..."
							allowedFormats={[]}
						/>
					</div>

					{items.length === 0 && (
						<div className="border border-dashed border-nova-line p-8 text-center">
							<p className="text-nova-muted">
								Accordion nie zawiera jeszcze żadnych pytań.
							</p>

							<Button variant="primary" className="mt-4" onClick={addItem}>
								Dodaj pierwsze pytanie
							</Button>
						</div>
					)}
					{items.length > 0 && (
						<div className="border-t border-nova-line">
							{items.map((item, index) => (
								<div key={index} className="border-b border-nova-line py-5 md:py-6">
									<div className="flex items-start justify-between gap-6">
										<RichText
											tagName="div"
											className="font-serif text-lg leading-snug text-nova-ink md:text-xl"
											value={item.question}
											onChange={(value) =>
												updateItem(index, 'question', value)
											}
											placeholder="Wpisz pytanie..."
										/>

										<span aria-hidden="true">+</span>
									</div>

									<RichText
										tagName="div"
										className="mt-4 text-nova-text"
										value={item.answer}
										onChange={(value) => updateItem(index, 'answer', value)}
										placeholder="Wpisz odpowiedź..."
									/>

									<Button
										variant="link"
										isDestructive
										onClick={() => removeItem(index)}
									>
										Usuń pytanie
									</Button>

									<div className="mt-4 flex items-center gap-3">
										<Button
											variant="secondary"
											disabled={index === 0}
											onClick={() => moveItem(index, -1)}
										>
											↑
										</Button>

										<Button
											variant="secondary"
											disabled={index === items.length - 1}
											onClick={() => moveItem(index, 1)}
										>
											↓
										</Button>

										<Button
											variant="link"
											isDestructive
											onClick={() => removeItem(index)}
										>
											Usuń pytanie
										</Button>
									</div>
								</div>
							))}
						</div>
					)}
					<Button variant="secondary" className="mt-6" onClick={addItem}>
						Dodaj pytanie
					</Button>
				</div>
			</section>
		</>
	);
}
