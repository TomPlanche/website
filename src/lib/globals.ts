// Type(s)
export type APIMethod = <TInput extends Record<string, string>, TOutput>(options: {
	url: string;
	method: 'GET' | 'POST';
}) => (input: TInput) => Promise<TOutput>;

// Other(s)
export const style_vars = {
	main_padding: '2rem',
	header_height: '8vmin'
};
