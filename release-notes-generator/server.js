import requestRx from './requestRx';
import rx from 'rx';
import Mustache from 'mustache';
import fs from 'fs';

let username = process.env.JIRA_USERNAME
  , password = process.env.JIRA_PASSWORD
  , url = `https://${username}:${password}@issues.couchbase.com`
  , post_body = {json: true};

let fixed_issues = 'project = "Couchbase Server" AND fixVersion in (vulcan,5.1.0) AND labels = known_issue AND component in (memcached, couchbase-bucket)'
  , xdcr_body = Object.assign({
      body: {
        "jql": fixed_issues,
        "fields": ["summary", "components", "description"]
      },
      url: `${url}/rest/api/2/search`
    }, post_body);

requestRx.post(xdcr_body)
  .subscribe({
    onNext: data => {
      let params = Object.assign(data.body, {query: fixed_issues});
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
    },
    onError: error => {
      console.log(new Error(error));
    },
    onCompleted: () => {
      console.log('Completed')
    }
  });

var view = {
  title: "Joe",
  calc: function () {
    return 2 + 4;
  }
};