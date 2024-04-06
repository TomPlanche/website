import { json } from '@sveltejs/kit';

export const GET = async () => {
	return json({
		error: 'Hey, you are not supposed to be here!'
	});
};
