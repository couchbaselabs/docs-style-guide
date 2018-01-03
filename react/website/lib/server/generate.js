function execute() {
  const CWD = process.cwd();
  const mkdirp = require('mkdirp');
  const fs = require('fs-extra');
  const jsyaml = require('js-yaml');
  const program = require('commander');
  const path = require('path');
  const React = require('react');
  const renderToStaticMarkup = require('react-dom/server').renderToStaticMarkup;
  
  
  const DocsLayout = require('../../core/DocsLayout');
  const Tutorial = require('../../core/Tutorial');
  
  program.option('--input <path>', 'Specify input path')
    .option('--mode <mode>', 'Specify a mode')
    .parse(process.argv);
  const input_path = program.input;
  const mode = program.mode;
  
  // create the folder path for a file if it does not exist, then write the file.
  function writeFileAndCreateFolder(file, content) {
    mkdirp.sync(file.replace(new RegExp('/[^/]*$'), ''));
    
    fs.writeFileSync(file, content);
  }
  
  function buildDocs() {
    let content = fs.readFileSync(input_path);
    let yaml = jsyaml.load(content);

    /* Read every file path and output to the build dir */
    yaml.items
      .map(item => {
        let content = fs.readFileSync(`${path.dirname(program.input)}/${item.path}`, {encoding: 'utf8'});

        const docComp = (
          <DocsLayout>
            {md.render(content)}
          </DocsLayout>
        );
        const str = renderToStaticMarkup(docComp);

        writeFileAndCreateFolder(`../build/${item.path.replace('.md', '.html')}`, str);
      });
  }
  
  function buildTutorials() {
    let content = fs.readFileSync(input_path, {encoding: 'utf8'});
    const tutorialComp = (
      <Tutorial
        content={content}>
      </Tutorial>
    );
    const str = renderToStaticMarkup(tutorialComp);
    
    writeFileAndCreateFolder('../build/swift.html', str);
  }
  
  switch(mode) {
    case 'docs':
      buildDocs();
      break;
    case 'tutorials':
      buildTutorials();
      break;
    default:
      
  }
  
}

module.exports = execute;