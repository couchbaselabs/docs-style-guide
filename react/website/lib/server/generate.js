function execute() {
  const CWD = process.cwd();
  const mkdirp = require('mkdirp');
  const fs = require('fs-extra');
  const jsyaml = require('js-yaml');
  const program = require('commander');
  
  program.option('--input <path>', 'Specify input path')
    .parse(process.argv);
  
  // create the folder path for a file if it does not exist, then write the file.
  function writeFileAndCreateFolder(file, content) {
    mkdirp.sync(file.replace(new RegExp('/[^/]*$'), ''));
    
    fs.writeFileSync(file, content);
  }
  
  let content = fs.readFileSync(program.input);
  let yaml = jsyaml.load(content);
  console.log(yaml);
  
}

module.exports = execute;