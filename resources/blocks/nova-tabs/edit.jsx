import { useEffect, useState, createContext } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export const ActiveTabContext = createContext(null);

export default function Edit({ clientId }) {
	const { blocks, selectedTabId } = useSelect(
		(select) => {
			const blockEditor = select('core/block-editor');
			const selectedBlockId = blockEditor.getSelectedBlockClientId();
			const selectedBlockParents = selectedBlockId
				? blockEditor.getBlockParents(selectedBlockId)
				: [];
			const directBlocks = blockEditor.getBlocks(clientId);
			const selectedTab = directBlocks.find(
				(block) =>
					block.name === 'nova/tab' &&
					(block.clientId === selectedBlockId ||
						selectedBlockParents.includes(block.clientId)),
			);

			return {
				blocks: directBlocks,
				selectedTabId: selectedTab?.clientId ?? null,
			};
		},
		[clientId],
	);
	const tabs = blocks.filter((block) => block.name === 'nova/tab');
	const [activeClientId, setActiveClientId] = useState(null);

	useEffect(() => {
		if (selectedTabId) {
			setActiveClientId(selectedTabId);
		}
	}, [selectedTabId]);

	const activeTabId = tabs.some((tab) => tab.clientId === activeClientId)
		? activeClientId
		: selectedTabId ?? tabs[0]?.clientId ?? null;

	return (
		<div {...useBlockProps({ className: 'min-w-0 max-w-full space-y-6' })}>
			<div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
				{tabs.length > 0 && (
					<div
						className="mb-6 flex max-w-full gap-6 overflow-x-auto overscroll-x-contain whitespace-nowrap border-b border-nova-line"
						role="group"
						aria-label="Wybierz zakładkę"
					>
						{tabs.map((tab, index) => (
							<button
								key={tab.clientId}
								type="button"
								aria-pressed={tab.clientId === activeTabId}
								className="relative inline-flex shrink-0 items-center border-b-2 border-transparent px-1 py-3 text-sm font-medium text-nova-muted hover:bg-nova-background hover:text-nova-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nova-ink aria-pressed:border-nova-ink aria-pressed:text-nova-ink"
								onClick={() => setActiveClientId(tab.clientId)}
							>
								{tab.attributes.title?.trim() || `Zakładka ${index + 1}`}
							</button>
						))}
					</div>
				)}
				<ActiveTabContext.Provider value={activeTabId}>
					<InnerBlocks
						allowedBlocks={['nova/tab']}
						template={[['nova/tab']]}
						templateLock={false}
					/>
				</ActiveTabContext.Provider>
			</div>
		</div>
	);
}
