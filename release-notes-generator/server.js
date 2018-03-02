import requestRx from './requestRx';
import rx from 'rx';
import Mustache from 'mustache';
import fs from 'fs';

let username = process.env.JIRA_USERNAME
  , password = process.env.JIRA_PASSWORD
  , url = `https://${username}:${password}@issues.couchbase.com`
  , post_body = {json: true};

let known_issues = 'project = "Couchbase Server" AND fixVersion = vulcan AND labels = releasenote AND (level is EMPTY OR level not in (Private,Playdom,Zynga) ) AND affectedVersion !=  vulcan  AND  status != Open'
  , options = Object.assign({
      body: {
        "jql": known_issues,
        "fields": ["summary", "components", "comment"] /* Fields we need for release notes */
      },
      url: `${url}/rest/api/2/search?expand=renderedBody`
    }, post_body);

let result = {issues: []};
requestRx.post(options)
  .flatMap(result => {
    return rx.Observable.fromArray(result.body.issues);
  })
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
    onCompleted: () => {
      /* Generate the release notes in the build directory */
      let params = Object.assign(result, {query: known_issues});
      fs.readFile('template.html', 'utf8', function (err, data) {
        if (err) {
          return console.log(err);
        }
        fs.writeFile('./build/release-notes.html', Mustache.render(data, params), function(err) {
          if(err) {
            return console.log(err);
          }
          console.log("The file was saved!");
        });
      });
      console.log('Completed')
    }
  });
