import { useBlockProps } from '@wordpress/block-editor';
import { Spinner } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

export default function Edit({ context }) {
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

	return <div {...blockProps}>{project.title.rendered}</div>;
}
