export type IGeneratorInputResolver = (input: Object) => Promise<Object>;
export type IGeneratorInput = IGeneratorInputResolver | Object;
