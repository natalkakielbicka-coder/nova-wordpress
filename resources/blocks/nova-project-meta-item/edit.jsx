import { InspectorControls, useBlockProps } from '@wordpress/block-editor';

import { PanelBody, SelectControl, Spinner } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

export default function Edit({ attributes, setAttributes, context }) {
	const { field } = attributes;
	const blockProps = useBlockProps();
	const projectId = context['nova/projectId'];

	const project = useSelect(
		(select) => {
			if (!projectId) {
				return null;
			}

			return select('core').getEntityRecord('postType', 'project', projectId);
		},
		[projectId],
	);

	const value = project?.acf?.[field] || '';

	if (!projectId) {
		return <div {...blockProps}>Najpierw wybierz projekt.</div>;
	}

	if (!project) {
		return (
			<div {...blockProps}>
				<Spinner />
			</div>
		);
	}

	return (
		<>
			<InspectorControls>
				<PanelBody title="Dane projektu">
					<SelectControl
						label="Pole"
						value={field}
						options={[
							{
								label: 'Klient',
								value: 'project_client',
							},
							{
								label: 'Rok',
								value: 'project_year',
							},
							{
								label: 'Zakres',
								value: 'project_scope',
							},
							{
								label: 'Technologie',
								value: 'project_technologies',
							},
						]}
						onChange={(value) =>
							setAttributes({
								field: value,
							})
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>{value || 'Brak wartości'}</div>
		</>
	);
}
