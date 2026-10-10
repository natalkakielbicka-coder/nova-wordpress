export const createPostCard = (post) => {
	if (!post.card_html) {
		console.error('Missing card_html for post:', post.id);
		return null;
	}

	const template = document.createElement('template');

	template.innerHTML = post.card_html.trim();

	return template.content.firstElementChild;
};
