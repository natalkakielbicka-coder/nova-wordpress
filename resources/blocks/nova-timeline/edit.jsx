import { RichText, useBlockProps } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
	const { eyebrow = '', heading = '', description = '', items = [] } = attributes;
	const timelineItems = Array.isArray(items) ? items : [];

	const updateItem = (index, field, value) => {
		setAttributes({
			items: timelineItems.map((item, itemIndex) =>
				itemIndex === index ? { ...item, [field]: value } : item,
			),
		});
	};

	const addItem = () => {
		setAttributes({
			items: [
				...timelineItems,
				{
					date: '',
					title: '',
					description: '',
				},
			],
		});
	};

	const removeItem = (index) => {
		setAttributes({
			items: timelineItems.filter((_, itemIndex) => itemIndex !== index),
		});
	};

	return (
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
				<ol className="mx-auto max-w-3xl space-y-8 border-l border-nova-line pl-8">
					{timelineItems.map((item, index) => (
						<li key={index} className="relative">
							<span
								aria-hidden="true"
								className="absolute -left-[2.35rem] top-1.5 size-3 rounded-full bg-nova-ink"
							/>
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
								onChange={(value) => updateItem(index, 'description', value)}
								placeholder="Opis etapu..."
								allowedFormats={[]}
							/>
							<Button
								variant="secondary"
								isDestructive
								onClick={() => removeItem(index)}
							>
								Usuń etap
							</Button>
						</li>
					))}
				</ol>
			) : (
				<p className="mx-auto max-w-3xl text-center text-nova-muted">Brak etapów</p>
			)}
			<div className="mx-auto mt-8 max-w-3xl">
				<Button variant="secondary" onClick={addItem}>
					Dodaj etap
				</Button>
			</div>
		</section>
	);
}
