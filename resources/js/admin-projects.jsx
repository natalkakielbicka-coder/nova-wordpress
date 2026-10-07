import { useSelect } from '@wordpress/data';
import { createRoot } from '@wordpress/element';

const NovaProjectsAdmin = () => {
	const projects = useSelect((select) => {
		return select('core').getEntityRecords('postType', 'project', {
			per_page: 20,
			orderby: 'date',
			order: 'desc',
		});
	}, []);

	return (
		<div>
			<h1>NOVA Projects</h1>

			{projects === null ? (
				<p>Ładowanie projektów...</p>
			) : projects.length === 0 ? (
				<p>Nie znaleziono projektów.</p>
			) : (
				<table className="widefat striped">
					<thead>
						<tr>
							<th>Projekt</th>
							<th>Klient</th>
							<th>Rok</th>
							<th>Zakres</th>
							<th>Technologie</th>
						</tr>
					</thead>

					<tbody>
						{projects.map((project) => (
							<tr key={project.id}>
								<td>
									<strong>
										<a href={`post.php?post=${project.id}&action=edit`}>
											{project.title.rendered}
										</a>
									</strong>
								</td>

								<td>{project.acf?.project_client || '—'}</td>

								<td>{project.acf?.project_year || '—'}</td>

								<td>{project.acf?.project_scope || '—'}</td>

								<td>{project.acf?.project_technologies || '—'}</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
};

const rootElement = document.getElementById('nova-projects-admin');

if (rootElement) {
	createRoot(rootElement).render(<NovaProjectsAdmin />);
}
