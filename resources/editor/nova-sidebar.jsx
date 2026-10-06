import { PluginDocumentSettingPanel } from '@wordpress/editor';
import { registerPlugin } from '@wordpress/plugins';
import { useSelect } from '@wordpress/data';

const NovaSidebar = () => {
	const { postId, postType } = useSelect((select) => {
		const editor = select('core/editor');

		return {
			postId: editor.getCurrentPostId(),
			postType: editor.getCurrentPostType(),
		};
	}, []);

	const isProject = postType === 'project';

	const project = useSelect(
		(select) => {
			if (!isProject || !postId) {
				return null;
			}

			return select('core').getEntityRecord('postType', 'project', postId);
		},
		[isProject, postId],
	);

	const missingProjectData =
		isProject && project && (!project.acf?.project_client || !project.acf?.project_year);

	return (
		<PluginDocumentSettingPanel
			name="nova-information"
			title="NOVA — informacje"
			className="nova-information-panel"
		>
			<p>
				<strong>Typ:</strong> {postType}
			</p>

			<p>
				<strong>ID:</strong> {postId}
			</p>

			{isProject && project?.acf && (
				<>
					<p>
						<strong>Klient:</strong> {project.acf.project_client || '—'}
					</p>

					<p>
						<strong>Rok:</strong> {project.acf.project_year || '—'}
					</p>
				</>
			)}

			{missingProjectData && (
				<p>
					<strong>Uwaga:</strong> Uzupełnij klienta i rok projektu.
				</p>
			)}
		</PluginDocumentSettingPanel>
	);
};

registerPlugin('nova-sidebar', {
	render: NovaSidebar,
});
