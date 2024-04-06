/**
 * @file src/lib/globals.ts
 * @description globals
 * @author Tom Planche
 */

// IMPORTS ===================================================================================================  IMPORTS

// END IMPORTS ==========================================================================================   END IMPORTS

// VARIABLES ================================================================================================ VARIABLE
// Type(s)
export type APIMethod = <
	TInput extends Record<string, string>,
	TOutput
> (options: {
	url: string;
	method: 'GET' | 'POST';
}) => (input: TInput) => Promise<TOutput>;

// Other(s)
export const style_vars = {
	main_padding: '2rem',
	header_height: '8vmin'
};
// END VARIABLES ======================================================================================= END VARIABLES

// FUNCTIONS ================================================================================================ FUNCTIONS

// END FUNCTIONS ======================================================================================== END FUNCTIONS

// CODE ========================================================================================================= CODE

// END CODE =======================================================================================  END COMPONENT

/**
 * End of file src/lib/globals.ts
 */
