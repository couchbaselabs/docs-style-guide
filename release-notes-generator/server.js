import requestRx from './requestRx';
import rx from 'rx';
import Mustache from 'mustache';
const fs = require('fs-extra');

let username = process.env.JIRA_USERNAME
  , password = process.env.JIRA_PASSWORD
  , url = `https://${username}:${password}@issues.couchbase.com`
  , post_body = {json: true};

// Specify the filter IDs to fetch
let filter_ids = [
  17584, // cobalt-cbl-bugs-swift
  17585, // cobalt-cbl-bugs-objc
  17586, // cobalt-cbl-bugs-java-android
  17587, // cobalt-cbl-bugs-dotnet
  17580, // cobalt-sg-known-issues
  17525,  // cobalt-sg-bugs
  17589,
  17590,
  17591,
  17588
];

filter_ids.forEach(filter_id => buildReleaseNotes(filter_id));

/**
 * - Create output files
 */
fs.writeFile('./build/raw.html',
  fs.readFileSync('template.html'),
  function(err) {
    if(err) {
      return console.log(err);
    }
    console.log('Output file created.');
  });

fs.writeFile('./build/rendered.html',
  fs.readFileSync('template.html'),
  function(err) {
    if(err) {
      return console.log(err);
    }
    console.log('Output file created.');
  });

function buildReleaseNotes(filter_id) {
  let result = {issues: []};
  /* Get the filter metadata */
  requestRx.get(`${url}/rest/api/2/filter/${filter_id}`)
    /* Query the filter */
    .flatMap(data => {
      let filter = JSON.parse(data.body);
      result.name = filter.name;
      let options = Object.assign({
        body: {
          "jql": filter.jql,
          "fields": ["summary", "components", "comment"] /* Fields we need for release notes */
        },
        url: `${url}/rest/api/2/search?expand=renderedBody`
      }, post_body);
      return requestRx.post(options);
    })
    .flatMap(response => {
      console.log(response.body);
      return rx.Observable.fromArray(response.body.issues);
    })
    .map(issue => {
      return issue;
    })
    .subscribe({
      onNext: data => {
        result.issues.push(data);
      },
      onError: error => {
        console.log(new Error(error));
      },
      onCompleted: (data) => {
        /**
         * Method 1:
         * - Get release-notes-template.adoc
         * - Run issues through the template
         * - Append output string to preview.html
         */
        /* Generate the release notes in the build directory */
        let params = Object.assign(result, {filter: filter_id});
        fs.readFile('template-raw.adoc', 'utf8', function (err, data) {
          if (err) {
            return console.log(err);
          }
          let output = Mustache.render(data, params);
          fs.appendFile('./build/raw.html', output, function (err, data) {
            if(err) {
              return console.log(err);
            }
          });
        });
        fs.readFile('template-rendered.html', 'utf8', function (err, data) {
          if (err) {
            return console.log(err);
          }
          let output = Mustache.render(data, params);
          fs.appendFile('./build/rendered.html', output, function (err, data) {
            if(err) {
              return console.log(err);
            }
          });
        });
        console.log('Completed');
        /**
         * Method 2:
         * - For each filter:
         *   - Get release-notes-template.adoc
         *   - Run issues through the template
         *   - Store output string in a variable
         * - Get preview-template.html
         * - Run filters through the template
         * - Create preview-{filter-name}.adoc
         */
      }
    });
}
