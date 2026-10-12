let activeSession;

export const initAnimations = ({ skipEntranceAnimations = false } = {}) => {
	activeSession?.cleanup();

	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		document.documentElement.classList.remove('nova-motion-ready');
		window.novaProjectAnimationsReady = false;
		return () => {};
	}

	const session = {
		cancelled: false,
		disposed: false,
		cleanups: [],
		cleanup: null,
	};

	const cleanup = () => {
		if (session.disposed) {
			return;
		}

		session.cancelled = true;
		session.disposed = true;

		for (let index = session.cleanups.length - 1; index >= 0; index--) {
			try {
				session.cleanups[index]();
			} catch (error) {
				console.error('Failed to clean up animation:', error);
			}
		}

		if (activeSession === session) {
			document.documentElement.classList.remove('nova-motion-ready');
			window.novaProjectAnimationsReady = false;
			activeSession = null;
		}
	};

	session.cleanup = cleanup;
	activeSession = session;

	const modules = [];

	if (!skipEntranceAnimations && document.querySelector('.nova-hero')) {
		modules.push({
			load: () => import('./animations/hero'),
			initialize: 'initHeroAnimation',
			name: 'hero',
		});
	}

	if (!skipEntranceAnimations && document.querySelector('.nova-project-card')) {
		modules.push({
			load: () => import('./animations/projects'),
			initialize: 'initProjectsAnimation',
			name: 'project',
		});
	}

	if (document.querySelector('.nova-pin-section')) {
		modules.push({
			load: () => import('./animations/pinned-section'),
			initialize: 'initPinnedSection',
			name: 'pinned section',
		});
	}

	modules.forEach(({ load, initialize, name }) => {
		(async () => {
			try {
				const module = await load();

				if (session.cancelled) {
					return;
				}

				const dispose = module[initialize]();

				if (typeof dispose === 'function') {
					if (session.cancelled) {
						dispose();
					} else {
						session.cleanups.push(dispose);
					}
				}
			} catch (error) {
				console.error(`Failed to initialize ${name} animations:`, error);

				if (!session.cancelled) {
					cleanup();
				}
			}
		})();
	});

	return cleanup;
};
