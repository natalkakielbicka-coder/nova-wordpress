import { InspectorControls, RichText, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';
import { styles } from './styles';

export default function Edit({ attributes, setAttributes }) {
	const { eyebrow, title, buttonText, buttonUrl, buttonTarget } = attributes;

	const blockProps = useBlockProps({
		className: styles.block,
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title="Ustawienia przycisku" initialOpen={true}>
					<TextControl
						label="Adres URL"
						value={buttonUrl}
						onChange={(value) => setAttributes({ buttonUrl: value })}
						help="Np. #kontakt lub /kontakt/"
					/>

					<ToggleControl
						label="Otwórz w nowej karcie"
						checked={buttonTarget === '_blank'}
						onChange={(value) => {
							setAttributes({
								buttonTarget: value ? '_blank' : '_self',
							});
						}}
					/>
				</PanelBody>
			</InspectorControls>

			<section {...blockProps}>
				<div className={styles.container}>
					<RichText
						tagName="p"
						className={styles.eyebrow}
						value={eyebrow}
						onChange={(value) => setAttributes({ eyebrow: value })}
						placeholder="Nadtytuł..."
					/>

					<div className={styles.content}>
						<RichText
							tagName="h2"
							className={`${styles.title} !text-nova-white`}
							value={title}
							onChange={(value) => setAttributes({ title: value })}
							placeholder="Nagłówek..."
						/>

						<div className={styles.button}>
							<RichText
								tagName="span"
								value={buttonText}
								onChange={(value) => setAttributes({ buttonText: value })}
								placeholder="Tekst przycisku..."
							/>

							<span aria-hidden="true" className={styles.arrow}>
								→
							</span>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
