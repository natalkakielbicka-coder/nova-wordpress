import { RichText, useBlockProps } from '@wordpress/block-editor';

import { styles } from './styles';

const deprecated = [
	{
		attributes: {
			eyebrow: {
				type: 'string',
				default: 'Porozmawiajmy',
			},
			title: {
				type: 'string',
				default: 'Masz pomysł na stronę?',
			},
			buttonText: {
				type: 'string',
				default: 'Napisz do mnie',
			},
			buttonUrl: {
				type: 'string',
				default: '#kontakt',
			},
		},

		migrate(attributes) {
			return {
				...attributes,
				buttonTarget: '_self',
			};
		},

		save({ attributes }) {
			const { eyebrow, title, buttonText, buttonUrl } = attributes;

			const blockProps = useBlockProps.save({
				className: styles.block,
			});

			return (
				<section {...blockProps}>
					<div className={styles.container}>
						<RichText.Content tagName="p" className={styles.eyebrow} value={eyebrow} />

						<div className={styles.content}>
							<RichText.Content tagName="h2" className={styles.title} value={title} />

							<a
								href={buttonUrl}
								className={`${styles.button} transition hover:bg-nova-white hover:text-nova-ink`}
							>
								<span className="nova-cta__button-content">
									<RichText.Content tagName="span" value={buttonText} />

									<span aria-hidden="true" className={styles.arrow}>
										→
									</span>
								</span>
							</a>
						</div>
					</div>
				</section>
			);
		},
	},
];

export default deprecated;
