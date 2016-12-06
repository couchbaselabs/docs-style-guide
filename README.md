## Getting Started

This repository is the style guide for mobile and server documentation. It's also the repository for common components used in both documentation sets.

### Docs Deployment

Make sure to have the following environment variables set:

- **DOCS_PATH** (path to root of docs repository - [docs-cb4](https://github.com/couchbase/docs-cb4) or [couchbase-mobile-portal](https://github.com/couchbaselabs/couchbase-mobile-portal)).
- **DITA_PATH** (path to root of [dita repository](https://github.com/couchbaselabs/dita-ot-2.1.1))
- **JENKINS_USERNAME** (your username to access the Jenkins server)
- **JENKINS_PASSWORD** (your password to access the Jenkins server)

Then you can run the script with the required parameters.

```bash
./deploy.sh <param1> <param2> <param3> <param4>
```

To deploy the server docs to staging:

```bash
./deploy.sh build server Server IngestStage
```

`param1` is always build. `param2` can be server or mobile. `param3` can be Server or Mobile. `param4` can be IngestStage or IngestQA.

### Examples

Make sure to have the following environment variables set:

- **JENKINS_USERNAME** (your username to access the Jenkins server)
- **JENKINS_PASSWORD** (your password to access the Jenkins server)

#### Article

This example is a simple page to see what the uploaded HTML must adhere to. To publish it to the dev portal, follow the steps below.

```bash
./example.sh article
```

The article is published at [http://developer-qa.cbauthx.com/documentation/mobile/1.3/article/index.html](http://developer-qa.cbauthx.com/documentation/mobile/1.3/article/index.html).

### REST API

In this example, REST APIs are documented using [Swagger](http://swagger.io/). Given a Swagger spec we can publish it on the dev portal using Swagger UI. To publish it to the dev portal, follow the steps below.

```bash
./example.sh rest-api
```

It uploads the content of the **rest-api** folder in this repository. As part of the uploaded content, there are `script` and `link` tags to pull the **SwaggerUI** resources as shown on the diagram below.

![](https://cl.ly/123P2G1R310M/swagger-ui-flow.png)

The REST API is published at [http://developer-qa.cbauthx.com/documentation/mobile/1.4/swagger-ui.html](http://developer-qa.cbauthx.com/documentation/mobile/1.4/swagger-ui.html).