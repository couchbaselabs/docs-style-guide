function execute() {
  const CWD = process.cwd();
  const mkdirp = require('mkdirp');
  const fs = require('fs-extra');
  const jsyaml = require('js-yaml');
  const program = require('commander');
  const path = require('path');
  
  program.option('--input <path>', 'Specify input path')
    .parse(process.argv);
  const input_path = program.input;
  
  // create the folder path for a file if it does not exist, then write the file.
  function writeFileAndCreateFolder(file, content) {
    mkdirp.sync(file.replace(new RegExp('/[^/]*$'), ''));
    
    fs.writeFileSync(file, content);
  }
  
  let content = fs.readFileSync(input_path);
  let yaml = jsyaml.load(content);
  
  /* Read every file path and output to the build dir */
  yaml.items
    .map(item => {
      let content = fs.readFileSync(`${path.dirname(program.input)}/${item.description}`);
      writeFileAndCreateFolder(`../build/${item.description}`, content);
    });
  
}

module.exports = execute;