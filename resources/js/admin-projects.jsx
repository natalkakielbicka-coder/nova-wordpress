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
			) : (
				<ul>
					{projects.map((project) => (
						<div key={project.id}>
							<h2>{project.title.rendered}</h2>

							<p>
								<strong>Klient:</strong> {project.acf?.project_client || '—'}
							</p>

							<p>
								<strong>Rok:</strong> {project.acf?.project_year || '—'}
							</p>

							<p>
								<strong>Zakres:</strong> {project.acf?.project_scope || '—'}
							</p>

							<p>
								<strong>Technologie:</strong>{' '}
								{project.acf?.project_technologies || '—'}
							</p>
						</div>
					))}
				</ul>
			)}
		</div>
	);
};

const rootElement = document.getElementById('nova-projects-admin');

if (rootElement) {
	createRoot(rootElement).render(<NovaProjectsAdmin />);
}
