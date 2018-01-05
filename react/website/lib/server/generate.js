import requestRx from './../requestRx';
import rx from 'rx';
import base64 from 'base-64';

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
  const Site = require('../../core/Site');
  
  program.option('--input <path>', 'Specify input path')
    .option('--mode <mode>', 'Specify a mode')
    .option('--dev <dev>', 'Run in dev mode')
    .parse(process.argv);
  const input_path = program.input;
  const mode = program.mode;
  const dev = program.dev;
  
  // create the folder path for a file if it does not exist, then write the file.
  function writeFileAndCreateFolder(file, content) {
    mkdirp.sync(file.replace(new RegExp('/[^/]*$'), ''));
    
    fs.writeFileSync(file, content);
  }
  
  function buildDocs() {
    let content = fs.readFileSync('../../tutorials/manifest.yaml');
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
    if (dev) {
      let content = fs.readFileSync(input_path, 'utf8');
      const tutorialComp = (
        <Site content={content}/>
      );
      const str = renderToStaticMarkup(tutorialComp);
      writeFileAndCreateFolder('../build/swift.html', str);
    } else {
      let manifest = fs.readFileSync('../../tutorials/manifest.yaml');
      let yaml = jsyaml.load(manifest);
      rx.Observable.fromArray(yaml.items)
        .flatMap(tutorial => {
          return requestRx.get(tutorial.link, {headers: {'User-Agent': 'request'}})
        })
        .flatMap(data => {
          let response = JSON.parse(data.body);
          let content = base64.decode(response.content);
          const tutorialComp = (
            <Site content={content}/>
          );
          const str = renderToStaticMarkup(tutorialComp);
          let repo = response.url.split('/')[5];
          writeFileAndCreateFolder(`../build/${repo}/${response.name.replace('.md', '.html')}`, str);
          return response.name;
        })
        .subscribe(
          data => {
            console.log('Wrote' +  data)
          },
          error => {
            throw error;
          },
          () => {
            console.log('Completed');
          }
        );
    }
    /* Copy stylesheet */
    mkdirp.sync('../build/css');
    let content = fs.readFileSync('static/css/styles.css');
    fs.writeFileSync('../build/css/styles.css', content);
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