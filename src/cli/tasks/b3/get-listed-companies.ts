import { ListedCompanies } from "../../../lib";
import { saveToFileAsync } from "../../helpers";

export const description =
  'Obtem todos os ativos listado na b3';
export const usage = 'npm run bin b3/get-listed-companies';
export const variables = {
  name: ''
};
export const flags = {
  '--help, -h': 'Shows this help'
};
export const example = `$ npm run bin b3/get-listed-companies
`;
 
export const execute = async (args: string[]) => {
  const name = args.join(' ');
  const ativos = await new ListedCompanies().get();
  await saveToFileAsync({data: ativos , name: 'ativosB3'})
};
