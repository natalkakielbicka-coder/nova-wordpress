import { InspectorControls, RichText, useBlockProps } from '@wordpress/block-editor';

import { Button, PanelBody, SelectControl } from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
	const {
		eyebrow = '',
		heading,
		headingAlignment = 'left',
		items = [],
		columns = 3,
	} = attributes;

	// Klasy odpowiadające liczbie kolumn
	const gridClasses = {
		2: 'md:grid-cols-2',
		3: 'md:grid-cols-3',
		4: 'md:grid-cols-4',
	};

	const gridClass = gridClasses[columns] || gridClasses[3];

	// Aktualizacja wybranej statystyki
	const updateItem = (index, field, value) => {
		const updatedItems = items.map((item, itemIndex) =>
			itemIndex === index ? { ...item, [field]: value } : item,
		);

		setAttributes({ items: updatedItems });
	};

	// Dodawanie nowej statystyki
	const addItem = () => {
		const newItem = {
			value: '',
			label: '',
		};

		setAttributes({
			items: [...items, newItem],
		});
	};

	// Usuwanie statystyki
	const removeItem = (index) => {
		const updatedItems = items.filter((_, itemIndex) => itemIndex !== index);

		setAttributes({ items: updatedItems });
	};

	// Zmiana kolejności statystyk
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

	const blockProps = useBlockProps({
		className: 'w-full',
	});

	return (
		<>
			{/* Ustawienia w panelu Gutenberga */}
			<InspectorControls>
				<PanelBody title="Ustawienia statystyk" initialOpen>
					<SelectControl
						label="Liczba kolumn"
						value={String(columns)}
						options={[
							{ label: '2 kolumny', value: '2' },
							{ label: '3 kolumny', value: '3' },
							{ label: '4 kolumny', value: '4' },
						]}
						onChange={(value) => setAttributes({ columns: Number(value) })}
					/>

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

			{/* Zawartość bloku */}
			<section {...blockProps}>
				<header className={headingAlignment === 'center' ? 'text-center' : 'text-left'}>
					<RichText
						tagName="p"
						className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-nova-muted"
						value={eyebrow}
						onChange={(value) => setAttributes({ eyebrow: value })}
						placeholder="Wpisz nadtytuł..."
						allowedFormats={[]}
					/>

					<RichText
						tagName="h2"
						className="font-serif text-4xl leading-tight tracking-tight text-nova-ink md:text-5xl"
						value={heading}
						onChange={(value) => setAttributes({ heading: value })}
						placeholder="Wpisz nagłówek statystyk..."
						allowedFormats={[]}
					/>
				</header>

				{/* Siatka statystyk */}
				<div className={`grid grid-cols-1 gap-8 sm:grid-cols-2 ${gridClass}`}>
					{items.map((item, index) => (
						<div key={index} className="border-t border-nova-line pt-6">
							{/* Liczba */}
							<RichText
								tagName="p"
								className="font-serif text-5xl text-nova-ink"
								value={item.value || ''}
								onChange={(value) => updateItem(index, 'value', value)}
								placeholder="Wpisz liczbę..."
								allowedFormats={[]}
							/>

							{/* Opis */}
							<RichText
								tagName="p"
								className="mt-4 text-base text-nova-text"
								value={item.label || ''}
								onChange={(value) => updateItem(index, 'label', value)}
								placeholder="Opis statystyki..."
								allowedFormats={[]}
							/>

							{/* Przyciski zarządzania */}
							<div className="mt-4 flex flex-wrap items-center gap-2">
								<Button
									variant="secondary"
									disabled={index === 0}
									onClick={() => moveItem(index, -1)}
									aria-label="Przesuń statystykę w górę"
								>
									↑
								</Button>

								<Button
									variant="secondary"
									disabled={index === items.length - 1}
									onClick={() => moveItem(index, 1)}
									aria-label="Przesuń statystykę w dół"
								>
									↓
								</Button>

								<Button
									variant="secondary"
									isDestructive
									onClick={() => removeItem(index)}
								>
									Usuń
								</Button>
							</div>
						</div>
					))}
				</div>

				{/* Dodawanie kolejnych statystyk */}
				<Button variant="secondary" className="mt-8" onClick={addItem}>
					+ Dodaj statystykę
				</Button>
			</section>
		</>
	);
}
