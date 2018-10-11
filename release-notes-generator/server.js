import requestRx from './requestRx';
import rx from 'rx';
import Mustache from 'mustache';
const fs = require('fs-extra');

let username = process.env.JIRA_USERNAME
  , password = process.env.JIRA_PASSWORD
  , url = `https://${username}:${password}@issues.couchbase.com`
  , post_body = {json: true};

let filter_ids = [16001, 15973, 16693, 16694, 16516];

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
          "fields": ["summary", "components", "comment"] /* Fields we need for release notes */
        },
        url: `${url}/rest/api/2/search?expand=renderedBody`
      }, post_body);
      return requestRx.post(options);
    })
    .flatMap(result => {
      return rx.Observable.fromArray(result.body.issues);
    })
    /* Query each issue */
    .flatMap(issue => {
      return rx.Observable.zip(
        rx.Observable.fromArray([issue]),
        requestRx.get(`${url}/rest/api/2/issue/${issue.key}/comment?expand=renderedBody`)
      )
    })
    .map(params => {
      let issue = params[0];
      let comments = JSON.parse(params[1].body).comments;
      /* Find the comment we will display in release notes */
      let rn_comment = comments.filter(comment => {
        let search = comment.body.search('Description for release notes:');
        if (search != -1) {
          return comment;
        }
      });
      return {
        key: issue.key,
        comment: rn_comment[0] ? rn_comment[0].renderedBody : '',
        components: issue.fields.components
      };
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
