import { InspectorControls, RichText, useBlockProps } from '@wordpress/block-editor';

import { PanelBody, RangeControl, Spinner } from '@wordpress/components';

import { useSelect } from '@wordpress/data';

export default function Edit({ attributes, setAttributes }) {
	const { numberOfProjects, title } = attributes;

	const blockProps = useBlockProps();

	const projects = useSelect(
		(select) => {
			return select('core').getEntityRecords('postType', 'project', {
				per_page: numberOfProjects,
				status: 'publish',
				_embed: true,
			});
		},
		[numberOfProjects],
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title="Ustawienia projektów" initialOpen={true}>
					<RangeControl
						label="Liczba projektów"
						value={numberOfProjects}
						onChange={(value) => setAttributes({ numberOfProjects: value })}
						min={1}
						max={6}
					/>
				</PanelBody>
			</InspectorControls>

			<section {...blockProps}>
				<RichText
					tagName="h2"
					className="font-serif text-4xl leading-tight text-nova-ink"
					value={title}
					onChange={(value) => setAttributes({ title: value })}
					placeholder="Nagłówek sekcji..."
				/>

				{projects === null && (
					<div className="mt-10 flex items-center gap-3">
						<Spinner />
						<span>Ładowanie projektów...</span>
					</div>
				)}

				{projects?.length === 0 && (
					<p className="mt-10 text-sm text-nova-muted">Brak projektów do wyświetlenia.</p>
				)}

				{projects?.length > 0 && (
					<div className="mt-10 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
						{projects.map((project) => {
							const image = project._embedded?.['wp:featuredmedia']?.[0]?.source_url;

							return (
								<article key={project.id}>
									{image && (
										<div className="aspect-[4/3] overflow-hidden bg-nova-line">
											<img
												src={image}
												alt=""
												className="h-full w-full object-cover"
											/>
										</div>
									)}

									<div className="mt-5">
										<h3 className="font-serif text-2xl leading-tight text-nova-ink">
											{project.title.rendered}
										</h3>
									</div>
								</article>
							);
						})}
					</div>
				)}
			</section>
		</>
	);
}
