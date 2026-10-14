import { useRef } from '@wordpress/element';
import { InspectorControls, RichText, useBlockProps } from '@wordpress/block-editor';
import { Button, PanelBody, SelectControl } from '@wordpress/components';

const createItemId = () =>
	globalThis.crypto?.randomUUID?.() ??
	`timeline-${Date.now()}-${Math.random().toString(36).slice(2)}`;

export default function Edit({ attributes, setAttributes }) {
	const {
		eyebrow = '',
		heading = '',
		description = '',
		layout = 'alternating',
		items = [],
	} = attributes;
	const timelineItems = Array.isArray(items) ? items : [];
	const temporaryIds = useRef(new WeakMap());
	const isAlternating = layout === 'alternating';

	const getItemId = (item) => {
		if (item.id) {
			return item.id;
		}

		if (!temporaryIds.current.has(item)) {
			temporaryIds.current.set(item, createItemId());
		}

		return temporaryIds.current.get(item);
	};

	const updateItem = (index, field, value) => {
		setAttributes({
			items: timelineItems.map((item, itemIndex) =>
				itemIndex === index
					? { ...item, id: item.id || getItemId(item), [field]: value }
					: item,
			),
		});
	};

	const addItem = () => {
		setAttributes({
			items: [
				...timelineItems,
				{
					id: createItemId(),
					date: '',
					title: '',
					description: '',
				},
			],
		});
	};

	const moveItem = (index, direction) => {
		const newIndex = index + direction;

		if (newIndex < 0 || newIndex >= timelineItems.length) {
			return;
		}

		const updatedItems = timelineItems.map((item) =>
			item.id ? item : { ...item, id: getItemId(item) },
		);
		[updatedItems[index], updatedItems[newIndex]] = [
			updatedItems[newIndex],
			updatedItems[index],
		];

		setAttributes({ items: updatedItems });
	};

	const removeItem = (index) => {
		setAttributes({
			items: timelineItems.filter((_, itemIndex) => itemIndex !== index),
		});
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title="Ustawienia Timeline" initialOpen>
					<SelectControl
						label="Układ"
						value={layout}
						options={[
							{ label: 'Vertical', value: 'vertical' },
							{ label: 'Alternating', value: 'alternating' },
						]}
						onChange={(value) => setAttributes({ layout: value })}
					/>
				</PanelBody>
			</InspectorControls>

			<section {...useBlockProps({ className: 'px-4 py-12 sm:px-6 md:py-20' })}>
				<header className="mx-auto mb-8 max-w-3xl text-center md:mb-12">
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
					placeholder="Nagłówek sekcji..."
					allowedFormats={[]}
				/>
				<RichText
					tagName="p"
					className="mx-auto mt-6 max-w-xl text-base leading-7 text-nova-text"
					value={description}
					onChange={(value) => setAttributes({ description: value })}
					placeholder="Krótki opis sekcji..."
					allowedFormats={[]}
				/>
				</header>

				{timelineItems.length > 0 ? (
					<div className="relative mx-auto w-full max-w-5xl">
					<span
						aria-hidden="true"
						className={`absolute inset-y-0 border-l border-nova-line ${
							isAlternating ? 'left-1.5 md:left-1/2' : 'left-1.5'
						}`}
					/>

					<ol className="space-y-8">
						{timelineItems.map((item, index) => {
							const isLeft = index % 2 === 0;

							return (
								<li
									key={getItemId(item)}
									className={
										isAlternating
											? 'relative grid min-w-0 grid-cols-1 pl-8 md:grid-cols-2 md:gap-x-12 md:pl-0'
											: 'relative min-w-0 pl-8'
									}
								>
									<span
										aria-hidden="true"
										className={`absolute top-1.5 size-3 -translate-x-1/2 rounded-full bg-nova-ink ${
											isAlternating ? 'left-1.5 md:left-1/2' : 'left-1.5'
										}`}
									/>
									<div
										className={
											isAlternating
												? `min-w-0 ${
														isLeft
															? 'md:col-start-1 md:pr-8 md:text-right'
															: 'md:col-start-2 md:pl-8 md:text-left'
													}`
												: 'min-w-0'
										}
									>
										<RichText
											tagName="p"
											className="text-sm font-medium text-nova-muted"
											value={item.date}
											onChange={(value) => updateItem(index, 'date', value)}
											placeholder="Rok lub data..."
											allowedFormats={[]}
										/>
										<RichText
											tagName="h3"
											className="mt-1 font-serif text-xl text-nova-ink"
											value={item.title}
											onChange={(value) => updateItem(index, 'title', value)}
											placeholder="Tytuł etapu..."
											allowedFormats={[]}
										/>
										<RichText
											tagName="p"
											className="mt-2 text-base leading-7 text-nova-text"
											value={item.description}
											onChange={(value) =>
												updateItem(index, 'description', value)
											}
											placeholder="Opis etapu..."
											allowedFormats={[]}
										/>
										<div
											className={`mt-4 flex flex-wrap gap-2 ${
												isLeft ? 'md:justify-end' : 'md:justify-start'
											}`}
										>
											<Button
												variant="secondary"
												disabled={index === 0}
												onClick={() => moveItem(index, -1)}
											>
												Przesuń w górę
											</Button>
											<Button
												variant="secondary"
												disabled={index === timelineItems.length - 1}
												onClick={() => moveItem(index, 1)}
											>
												Przesuń w dół
											</Button>
											<Button
												variant="secondary"
												isDestructive
												onClick={() => removeItem(index)}
											>
												Usuń etap
											</Button>
										</div>
									</div>
								</li>
							);
						})}
					</ol>
					</div>
				) : (
					<p className="mx-auto max-w-3xl text-center text-nova-muted">Brak etapów</p>
				)}
				<div className="mx-auto mt-8 max-w-3xl">
					<Button variant="secondary" onClick={addItem}>
						Dodaj etap
					</Button>
				</div>
			</section>
		</>
	);
}
