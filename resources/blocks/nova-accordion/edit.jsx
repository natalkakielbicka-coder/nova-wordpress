import { RichText, useBlockProps } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
	const { items } = attributes;
	const blockProps = useBlockProps({
		className: 'px-6 py-16 md:py-20',
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
		<section {...blockProps}>
			<div className="mx-auto max-w-3xl">
				<div className="border-t border-nova-line">
					{items.map((item, index) => (
						<div key={index} className="border-b border-nova-line py-6">
							<div className="flex items-start justify-between gap-6">
								<RichText
									tagName="div"
									className="font-serif text-xl text-nova-ink"
									value={item.question}
									onChange={(value) => updateItem(index, 'question', value)}
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

							<Button variant="link" isDestructive onClick={() => removeItem(index)}>
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

				<Button variant="secondary" className="mt-6" onClick={addItem}>
					Dodaj pytanie
				</Button>
			</div>
		</section>
	);
}
