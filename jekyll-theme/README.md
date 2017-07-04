# Jekyll theme

This README explains how you can use this Jekyll theme for your own project.

## Getting Started

First you must have Jekyll installed on your machine (follow [these instructions](https://jekyllrb.com/docs/installation/)). Then, create a new Jekyll site with the following.

```bash
jekyll new project-foo
cd project-foo
```

This theme is not published on RubyGem so you will have to follow the steps below to include it manually to your Jekyll site.

- Clone this repository in another location.

	```bash
	git clone git@github.com:couchbaselabs/docs-style-guide.git
	cd docs-style-guide/jekyll-theme
	```

- Open **Gemfile** in your Jekyll site folder and replace `gem "minima", "~> 2.0"` with `gem "couchbase-theme", path: "/path/to/docs-style-guide/jekyll-theme"`.
- Open **_config.yml** and replace `theme: minima` with `theme: couchbase-theme`.
- Run `bundle update` in your Jekyll site directory.
- Start the Jekyll server.

	```bash
	jekyll serve --port 4000 --config _config.yml --livereload
	```

Your Jekyll site is now using this Jekyll theme.

## Projects

- The [CB samples site](http://docs-build.sc.couchbase.com/server/jekyll-theme/index.html) is using this theme ([README]()).