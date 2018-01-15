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
  const SDKLayout = require('../../core/SDKLayout');
  
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
  
  function buildMobileDocs() {
    let root = '/Users/jamesnocentini/Developer/couchbase-mobile-portal/md-docs/_20/guides/couchbase-lite';
    fs.readdir(root, (err, items) => {
      /* Find the Couchbase Lite guides */
      let guides = items
        .filter(item => {
          let clause = item === 'csharp.md' || item === 'java.md' || item === 'objc.md' || item === 'swift.md';
          if (clause) {
            return true;
          }
          return false;
        })
        .map(item => {
          return fs.readFileSync(`${root}/${item}`, 'utf8');
        });
      /* Pass 4 different files to React layout */
      const comp = (
        <SDKLayout
          csharp={guides[0]}
          java={guides[1]}
          objc={guides[2]}
          swift={guides[3]} />
      );
      const str = renderToStaticMarkup(comp);
      writeFileAndCreateFolder('../build/guides/index.html', str);
    });
  }
  
  switch(mode) {
    case 'docs':
      buildDocs();
      break;
    case 'tutorials':
      buildTutorials();
      break;
    case 'mobiledocs':
      buildMobileDocs();
      break;
    default:
      
  }
  
}

module.exports = execute;