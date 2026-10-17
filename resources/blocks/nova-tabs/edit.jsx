import { useEffect, useRef, useState, createContext } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import { InnerBlocks, InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import { Button, PanelBody, SelectControl } from '@wordpress/components';
import { Icon, arrowLeft, arrowRight, closeSmall } from '@wordpress/icons';

export const ActiveTabContext = createContext(null);

const navigationStyles = {
	underline: {
		nav: 'mb-6 flex max-w-full gap-6 overflow-x-auto overscroll-x-contain whitespace-nowrap border-b border-nova-line',
		tab:
			'relative inline-flex items-center border-b-2 border-transparent px-1 py-3 text-sm font-medium text-nova-muted hover:bg-nova-background hover:text-nova-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nova-ink aria-pressed:border-nova-ink aria-pressed:text-nova-ink',
		wrapper: 'inline-flex shrink-0 items-center border-b-2 border-transparent',
	},
	pills: {
		nav: 'mb-6 flex max-w-full gap-2 overflow-x-auto overscroll-x-contain whitespace-nowrap',
		tab:
			'relative inline-flex items-center rounded-full border-0 px-4 py-2 text-sm font-medium text-nova-muted hover:bg-nova-background hover:text-nova-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nova-ink aria-pressed:bg-nova-ink aria-pressed:text-nova-white',
		wrapper: 'inline-flex shrink-0 items-center',
		activeWrapper: '',
	},
	segmented: {
		nav: 'mb-6 flex max-w-full gap-1 overflow-x-auto overscroll-x-contain whitespace-nowrap rounded-lg bg-nova-background p-1',
		tab:
			'relative inline-flex items-center rounded-md border-0 px-4 py-2 text-sm font-medium text-nova-muted hover:bg-nova-white hover:text-nova-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nova-ink aria-pressed:bg-nova-white aria-pressed:text-nova-ink',
		wrapper: 'inline-flex shrink-0 items-center rounded-md',
		activeWrapper: '',
	},
};

export default function Edit({ attributes, clientId, setAttributes }) {
	const requestedVariant = attributes.styleVariant ?? 'underline';
	const styleVariant = navigationStyles[requestedVariant] ? requestedVariant : 'underline';
	const styles = navigationStyles[styleVariant];
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
	const pendingAddClientId = useRef(null);
	const tabButtonRefs = useRef(new Map());
	const addButtonRef = useRef(null);
	const { insertBlock, removeBlock, moveBlockToPosition } = useDispatch('core/block-editor');

	useEffect(() => {
		if (selectedTabId) {
			setActiveClientId(selectedTabId);
		}
	}, [selectedTabId]);

	useEffect(() => {
		if (tabs.some((tab) => tab.clientId === pendingAddClientId.current)) {
			pendingAddClientId.current = null;
		}
	}, [tabs]);

	const activeTabId = tabs.some((tab) => tab.clientId === activeClientId)
		? activeClientId
		: selectedTabId ?? tabs[0]?.clientId ?? null;

	const addTab = () => {
		if (pendingAddClientId.current) {
			return;
		}

		const newTab = createBlock('nova/tab', { title: 'Nowa zakładka' });
		pendingAddClientId.current = newTab.clientId;
		setActiveClientId(newTab.clientId);
		insertBlock(newTab, tabs.length, clientId);
	};

	const removeTab = (event, tabClientId) => {
		event.stopPropagation();

		const tabIndex = tabs.findIndex((tab) => tab.clientId === tabClientId);
		if (tabIndex === -1) {
			return;
		}

		const isRemovingActiveTab = activeTabId === tabClientId;
		const nextTab = tabs[tabIndex + 1] ?? tabs[tabIndex - 1] ?? null;
		const nextActiveId = isRemovingActiveTab ? nextTab?.clientId ?? null : activeTabId;

		if (isRemovingActiveTab) {
			setActiveClientId(nextActiveId);
		}

		const focusTarget = isRemovingActiveTab
			? nextTab
				? tabButtonRefs.current.get(nextTab.clientId)
				: addButtonRef.current
			: tabButtonRefs.current.get(activeTabId);
		focusTarget?.focus();
		removeBlock(tabClientId, false);
	};

	const moveTab = (event, tabClientId, direction) => {
		event.stopPropagation();

		const currentIndex = blocks.findIndex((block) => block.clientId === tabClientId);
		const targetIndex = currentIndex + direction;

		if (currentIndex === -1 || targetIndex < 0 || targetIndex >= blocks.length) {
			return;
		}

		moveBlockToPosition(tabClientId, clientId, clientId, targetIndex);
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title="Ustawienia NOVA Tabs" initialOpen>
					<SelectControl
						label="Styl nawigacji"
						value={styleVariant}
						options={[
							{ label: 'Underline', value: 'underline' },
							{ label: 'Pills', value: 'pills' },
							{ label: 'Segmented', value: 'segmented' },
						]}
						onChange={(value) => setAttributes({ styleVariant: value })}
					/>
				</PanelBody>
			</InspectorControls>
			<div {...useBlockProps({ className: 'min-w-0 max-w-full space-y-6' })}>
				<div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
					<div
						className={styles.nav}
						role="group"
						aria-label="Wybierz zakładkę"
					>
						{tabs.map((tab, index) => {
							const title = tab.attributes.title?.trim() || `Zakładka ${index + 1}`;

							return (
								<div
									key={tab.clientId}
									className={styles.wrapper}
								>
									<button
										ref={(element) => {
											if (element) {
												tabButtonRefs.current.set(tab.clientId, element);
											} else {
												tabButtonRefs.current.delete(tab.clientId);
											}
										}}
										type="button"
										aria-pressed={tab.clientId === activeTabId}
										className={styles.tab}
										onClick={() => setActiveClientId(tab.clientId)}
									>
										{title}
									</button>
									<Button
										icon={<Icon icon={arrowLeft} />}
										label={`Przesuń ${title} w lewo`}
										aria-label={`Przesuń ${title} w lewo`}
										disabled={index === 0}
										className="!min-h-0 !min-w-0 !p-1 text-nova-muted hover:text-nova-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nova-ink"
										onClick={(event) => moveTab(event, tab.clientId, -1)}
									/>
									<Button
										icon={<Icon icon={arrowRight} />}
										label={`Przesuń ${title} w prawo`}
										aria-label={`Przesuń ${title} w prawo`}
										disabled={index === tabs.length - 1}
										className="!min-h-0 !min-w-0 !p-1 text-nova-muted hover:text-nova-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nova-ink"
										onClick={(event) => moveTab(event, tab.clientId, 1)}
									/>
									<Button
										icon={<Icon icon={closeSmall} />}
										label={`Usuń zakładkę: ${title}`}
										aria-label={`Usuń zakładkę: ${title}`}
										className="!min-h-0 !min-w-0 !p-1 text-nova-muted hover:text-nova-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nova-ink"
										onClick={(event) => removeTab(event, tab.clientId)}
									/>
								</div>
							);
						})}
						<button
							ref={addButtonRef}
							type="button"
							aria-label="Dodaj zakładkę"
							className="inline-flex shrink-0 items-center justify-center border-b-2 border-transparent px-3 py-3 text-lg font-medium text-nova-muted hover:bg-nova-background hover:text-nova-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nova-ink"
							onClick={addTab}
						>
							+
						</button>
					</div>
					<ActiveTabContext.Provider value={activeTabId}>
						<InnerBlocks
							allowedBlocks={['nova/tab']}
							template={[['nova/tab']]}
							templateLock={false}
						/>
					</ActiveTabContext.Provider>
				</div>
			</div>
		</>
	);
}
