export type TLogSourceResponse = {
  [key: string]: number;
};

export type TSources = Record<string, number>;

export type TGetSourcesResponse = {
  sources: TSources;
};
