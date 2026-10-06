import { RichTextToolbarButton } from '@wordpress/block-editor';
import { applyFormat, registerFormatType, removeFormat } from '@wordpress/rich-text';

const FORMAT_NAME = 'nova/highlight';

registerFormatType(FORMAT_NAME, {
	title: 'NOVA Highlight',
	tagName: 'span',
	className: 'nova-highlight',

	edit({ isActive, value, onChange }) {
		return (
			<RichTextToolbarButton
				icon="marker"
				title="NOVA Highlight"
				isActive={isActive}
				onClick={() => {
					onChange(
						isActive
							? removeFormat(value, FORMAT_NAME)
							: applyFormat(value, {
									type: FORMAT_NAME,
								}),
					);
				}}
			/>
		);
	},
});
