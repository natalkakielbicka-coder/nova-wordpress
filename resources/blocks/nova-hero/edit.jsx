import {
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';

import { Button, PanelBody, TextControl } from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
	const { eyebrow, title, text, buttonText, buttonUrl, imageId, imageUrl, imageAlt } = attributes;

	const blockProps = useBlockProps({
		className: 'px-6 py-16 md:py-20 lg:py-24',
	});

	const selectImage = (media) => {
		setAttributes({
			imageId: media.id,
			imageUrl: media.url,
			imageAlt: media.alt || '',
		});
	};

	const removeImage = () => {
		setAttributes({
			imageId: undefined,
			imageUrl: '',
			imageAlt: '',
		});
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title="Ustawienia przycisku" initialOpen={true}>
					<TextControl
						label="Adres URL"
						value={buttonUrl}
						onChange={(value) => setAttributes({ buttonUrl: value })}
						help="Np. /projekty/ lub #kontakt"
					/>
				</PanelBody>
			</InspectorControls>
			<section {...blockProps}>
				<div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
					<div>
						<RichText
							tagName="p"
							className="text-xs font-medium uppercase tracking-[0.2em] text-nova-muted"
							value={eyebrow}
							onChange={(value) => setAttributes({ eyebrow: value })}
							placeholder="Nadtytuł..."
						/>

						<RichText
							tagName="h1"
							className="mt-5 font-serif text-4xl leading-[1.05] text-nova-ink md:text-5xl lg:text-6xl"
							value={title}
							onChange={(value) => setAttributes({ title: value })}
							placeholder="Nagłówek..."
						/>

						<RichText
							tagName="p"
							className="mt-6 max-w-xl text-base leading-7 text-nova-text"
							value={text}
							onChange={(value) => setAttributes({ text: value })}
							placeholder="Opis..."
						/>

						<div className="mt-8">
							<RichText
								tagName="span"
								className="inline-flex bg-nova-ink px-6 py-3 text-sm font-medium text-nova-white"
								value={buttonText}
								onChange={(value) => setAttributes({ buttonText: value })}
								placeholder="Tekst przycisku..."
							/>
						</div>
					</div>

					<div>
						{imageUrl ? (
							<>
								<div className="aspect-[4/5] overflow-hidden bg-nova-line">
									<img
										src={imageUrl}
										alt={imageAlt}
										className="h-full w-full object-cover"
									/>
								</div>

								<div className="mt-4 flex gap-2">
									<MediaUploadCheck>
										<MediaUpload
											onSelect={selectImage}
											allowedTypes={['image']}
											value={imageId}
											render={({ open }) => (
												<Button variant="secondary" onClick={open}>
													Zmień zdjęcie
												</Button>
											)}
										/>
									</MediaUploadCheck>

									<Button variant="tertiary" isDestructive onClick={removeImage}>
										Usuń zdjęcie
									</Button>
								</div>
							</>
						) : (
							<div className="flex aspect-[4/5] items-center justify-center bg-nova-line">
								<MediaUploadCheck>
									<MediaUpload
										onSelect={selectImage}
										allowedTypes={['image']}
										value={imageId}
										render={({ open }) => (
											<Button variant="secondary" onClick={open}>
												Wybierz zdjęcie
											</Button>
										)}
									/>
								</MediaUploadCheck>
							</div>
						)}
					</div>
				</div>
			</section>
		</>
	);
}
