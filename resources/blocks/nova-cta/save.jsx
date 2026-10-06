import { RichText, useBlockProps } from '@wordpress/block-editor';

import { styles } from './styles';

export default function save({ attributes }) {
	const { eyebrow, title, buttonText, buttonUrl, buttonTarget } = attributes;

	const blockProps = useBlockProps.save({
		className: styles.block,
	});

	return (
		<section {...blockProps}>
			<div className={styles.container}>
				<RichText.Content tagName="span" className={styles.eyebrow} value={eyebrow} />

				<div className={styles.content}>
					<RichText.Content tagName="h2" className={styles.title} value={title} />

					<a
						href={buttonUrl}
						target={buttonTarget}
						rel={buttonTarget === '_blank' ? 'noopener noreferrer' : undefined}
						className={`${styles.button} transition hover:bg-nova-white hover:text-nova-ink`}
					>
						<RichText.Content tagName="span" value={buttonText} />

						<span aria-hidden="true" className={styles.arrow}>
							→
						</span>
					</a>
				</div>
			</div>
		</section>
	);
}
