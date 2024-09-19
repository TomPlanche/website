/**
 * @file src/routes/work/ascii-art/+page.ts
 * @description +page
 * @author Tom Planche
 */

export const load = async ({fetch}) => {
  const {files} = await fetch('/work/ascii-art').then(response => response.json());
  return {
    files
  };
}

/**
 * End of file src/routes/work/ascii-art/+page.ts
 */