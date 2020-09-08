import fs from 'fs';
 
interface ISaveToFilesOptions {
  data: any;
  name: string;
}
 
const basePathForSamples = `./src/cli/tasks`;
const samplesFolder = '_response-samples';
const samplesPath = `${ basePathForSamples }/${ samplesFolder }`;
 
const createFolder = (folderName: string): void => {
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
  }
};
 
export const saveToFileAsync = (
  { data, name }: ISaveToFilesOptions,
  extension?: string,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    createFolder(samplesPath);
  
    const pathWithDir = name.split('/');
    let basePath = `./${ samplesPath }`;
 
    if (pathWithDir.length > 1) {
      pathWithDir.forEach((_path, i) => {
        if (i === pathWithDir.length - 1) return;
        createFolder(`${ basePath }/${ _path }`);
        basePath += `/${ _path }`;
      });
    }
    
    const fileName = `./src/cli/tasks/${ samplesFolder }/${ name }.${ extension || 'json' }`;
    const jsonData = JSON.stringify(data, null, 2);
    if (extension === 'html') {
      fs.writeFile(fileName, data, error => {
        if (error) return reject(error);
        const message = `\nFile "${ fileName }" written successfully!\n`;
        console.log(message);
        return resolve(message);
      });
    } else {
      fs.writeFile(fileName, jsonData, error => {
        if (error) return reject(error);
        const message = `\nFile "${ fileName }" written successfully!\n`;
        console.log(message);
        return resolve(message);
      });
    }
  });
};
