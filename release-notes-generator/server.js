import requestRx from './requestRx';
import rx from 'rx';
import Mustache from 'mustache';
const fs = require('fs-extra');

let username = process.env.JIRA_USERNAME
  , password = process.env.JIRA_PASSWORD
  , url = `https://${username}:${password}@issues.couchbase.com`
  , post_body = {json: true};

let filter_ids = [17320];

filter_ids.forEach(filter_id => buildReleaseNotes(filter_id));

function buildReleaseNotes(filter_id) {
  let result = {issues: []};
  /* Get the filter metadata */
  requestRx.get(`${url}/rest/api/2/filter/${filter_id}`)
    /* Query the filter */
    .flatMap(data => {
      let filter = JSON.parse(data.body);
      let options = Object.assign({
        body: {
          "jql": filter.jql,
          "fields": ["summary", "components", "comment", "customfield_12580", "versions", "fixVersions", "description", "project"] /* Fields we need for release notes */
        },
        url: `${url}/rest/api/2/search?expand=renderedBody`
      }, post_body);
      return requestRx.post(options);
    })
    .flatMap(result => {
      return rx.Observable.fromArray(result.body.issues);
    })
    .map(issue => {
      console.log(issue);
      let cvss_severity_match = issue.fields.description.match(/(?<=CVSS\/Severity\*\*:\*)(.*\n?)(?=\r\n)/);
      issue.fields.cvss_severity = cvss_severity_match ? cvss_severity_match[0] : '';

      issue.fields.versions = issue.fields.versions
        .map(version => version.name)
        .join(', ');

      let published_date_match = issue.fields.description.match(/(?<=Publish date\*:)(.*\n?)(?=\r\n)/);
      issue.fields.published_date = published_date_match ? published_date_match[0] : '';

      issue.fields.fixVersions = issue.fields.fixVersions
        .map(version => version.name)
        .join(', ');

      let recognition_match = issue.fields.description.match(/(?<=Recognition:\*)(.*\n?)(?=\r\n)/);
      issue.fields.recognition = recognition_match ? recognition_match[0] : '';

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
        /* Generate the release notes in the build directory */
        let params = Object.assign(result, {filter: filter_id});
        fs.copy('./img/', './build/img/', err => {
          if (err) return console.error(err);
        });
        fs.readFile('template.html', 'utf8', function (err, data) {
          if (err) {
            return console.log(err);
          }
          fs.writeFile(`./build/release-notes-${filter_id}.html`, Mustache.render(data, params), function(err) {
            if(err) {
              return console.log(err);
            }
            console.log("The file was saved!");
          });
        });
        console.log('Completed')
      }
    });
}
