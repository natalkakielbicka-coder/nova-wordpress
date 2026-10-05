import { InnerBlocks, InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, SelectControl, Spinner } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

export default function Edit({ attributes, setAttributes }) {
	const { projectId } = attributes;
	const blockProps = useBlockProps();

	const projects = useSelect((select) => {
		return select('core').getEntityRecords('postType', 'project', {
			per_page: -1,
			orderby: 'title',
			order: 'asc',
		});
	}, []);

	const projectOptions = [
		{
			label: 'Wybierz projekt',
			value: 0,
		},
		...(projects || []).map((project) => ({
			label: project.title.rendered,
			value: project.id,
		})),
	];

	return (
		<>
			<InspectorControls>
				<PanelBody title="Projekt">
					{projects === null ? (
						<Spinner />
					) : (
						<SelectControl
							label="Projekt"
							value={projectId || 0}
							options={projectOptions}
							onChange={(value) =>
								setAttributes({
									projectId: Number(value),
								})
							}
						/>
					)}
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<InnerBlocks />
			</div>
		</>
	);
}
