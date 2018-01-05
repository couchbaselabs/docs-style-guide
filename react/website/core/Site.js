const React = require('react');
import Tutorial from './Tutorial';

class Site extends React.Component {
  render () {
    return (
      <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <link rel="icon" type="image/png" sizes="32x32" href="https://developer.couchbase.com/webfiles/1498186094252/images/icons/favicon/favicon-32x32.png"/>

        <script type="text/javascript" charset="utf-8" src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
        <script type="text/javascript" charset="utf-8" src="https://developer.couchbase.com/webfiles/1498186094252/js/thirdparty/vendor/jquery-migrate.js"></script>
        <script type="text/javascript" charset="utf-8" src="https://developer.couchbase.com/webfiles/1498186094252/js/thirdparty/vendor/slick.js"></script>
        <script type="text/javascript" charset="utf-8" src="https://developer.couchbase.com/webfiles/1498186094252/js/thirdparty/vendor/isotope.min.js"></script>
        <script type="text/javascript" charset="utf-8" src="https://developer.couchbase.com/webfiles/1498186094252/js/thirdparty/vendor/imagesloaded.min.js"></script>
        
        <link rel="stylesheet" href="https://developer.couchbase.com/webfiles/1498186094252/css/styles.css"/>
        <link rel="stylesheet" href="https://developer.couchbase.com/binaries/content/assets/css/overrides.css"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>Title</title>
        <link rel="stylesheet" href="/css/styles.css"/>
      </head>
      <body>
      <nav className="aux">
        <div>
        </div>
      </nav>
      <header id="global-header" className="global-header dev-portal">
        <div className="layout-wrapper">
          <div className="global-header__logo">
            <a href='http://www.couchbase.com'>Couchbase</a>
            <a href='index.html'>Developer</a>
          </div>
          <a data-modules="navigation,globalheadersearch"></a>
          <nav role="navigation" id="primary-navigation" className="primary-navigation">
            <button aria-controls="primary-navigation__wrapper"
                    aria-pressed="false"
                    className="primary-navigation__toggler"
                    type="button">
              <span>Menu</span>
            </button>
            <div id="primary-navigation__wrapper"
                 className="primary-navigation__wrapper"
                 aria-expanded="false">

              <ul className="primary-navigation__items">
                <li className="primary-navigation__item ">

                  <a href="https://developer.couchbase.com/documentation/server/current/introduction/intro.html">Server</a>
                </li>
                <li className="primary-navigation__item ">

                  <a href="https://developer.couchbase.com/mobile">Mobile</a>
                </li>
                <li className="primary-navigation__item has-secondary-navigation">

                  <a href="https://developer.couchbase.com/community">Community</a>
                  <div className="secondary-navigation">
                    <ul className="secondary-navigation__items">
                      <li className="secondary-navigation__item">
                        <a href="https://developer.couchbase.com/open-source-projects">Open Source Projects</a>
                      </li>
                      <li className="secondary-navigation__item">
                        <a href="https://developer.couchbase.com/contribute">Contribute</a>
                      </li>
                      <li className="secondary-navigation__item">
                        <a href="http://www.couchbase.com/nosql-resources/events">Events</a>
                      </li>
                      <li className="secondary-navigation__item">
                        <a href="https://developer.couchbase.com/experts-and-champions">Experts &amp; Champions</a>
                      </li>
                      <li className="secondary-navigation__item">
                        <a href="http://forums.couchbase.com/">Forums</a>
                      </li>
                      <li className="secondary-navigation__item">
                        <a href="http://blog.couchbase.com">Blogs</a>
                      </li>
                      <li className="secondary-navigation__item">
                        <a href="https://developer.couchbase.com/support">Support</a>
                      </li>
                    </ul>
                  </div>
                </li>
                <li className="primary-navigation__item has-secondary-navigation">

                  <a href="https://developer.couchbase.com/guides-and-references">Site Map</a>
                  <div className="secondary-navigation">
                    <ul className="secondary-navigation__items">
                      <li className="secondary-navigation__item">
                        <a href="https://developer.couchbase.com/guides-and-references#section-1">Couchbase Server</a>
                      </li>
                      <li className="secondary-navigation__item">
                        <a href="https://developer.couchbase.com/guides-and-references#section-2">Couchbase Mobile</a>
                      </li>
                      <li className="secondary-navigation__item">
                        <a href="https://developer.couchbase.com/guides-and-references#subsection-1-3">SDKs</a>
                      </li>
                      <li className="secondary-navigation__item">
                        <a href="https://developer.couchbase.com/guides-and-references#subsection-1-5">Connectors</a>
                      </li>
                      <li className="secondary-navigation__item">
                        <a href="https://developer.couchbase.com/documentation-archive">Documentation Archive</a>
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
              <form id="global-header-search"
                    autocomplete="off"
                    className="global-header-search global-header-search--js"
                    action="https://developer.couchbase.com/search"
                    aria-expanded="false">
                <ul><li>
                    <label for="global-header-search__query">
                      Search query
                    </label>
                    <input
                      type="search"
                      placeholder="Search"
                      name="q"
                      value=""
                      id="global-header-search__query"/>
                  </li><li>
                    <button type="submit">
                      <span>Search</span>
                    </button>
                  </li></ul>
                <button aria-controls="global-header-search__items"
                        aria-pressed="false"
                        className="global-header-search__toggler"
                        type="button">
                  <span>Search</span>
                </button>

                <div style={{display: 'none'}} about="custom-search-fields">

                  <input type="hidden"
                         name="cx"
                         value="017928787631531434501:3e7lwhjxsom" />
                  <input type="hidden"
                         name="cof"
                         value="FORID:11" />
                  <input type="hidden"
                         name="safe"
                         value="off" />
                  <input type="hidden"
                         name="form_build_id"
                         value="form-RrbKDUhO3kB2MiqBdZHIQI9L4LFE7c3L_s87N2B9BZo" />
                  <input type="hidden"
                         name="form_id"
                         value="google_cse_results_searchbox_form" />
                  <input type="hidden"
                         name="siteurl"
                         value='developer.couchbase.com' />

                </div>
              </form>
            </div>
          </nav>
          <a className="global-header__download-button" href="https://developer.couchbase.com/downloads">
            Download
          </a>
        </div>
      </header>
        <Tutorial content={this.props.content} />
      <script type="text/javascript" src="https://developer.couchbase.com/webfiles/1498186094252/js/thirdparty/vendor/require.js"></script>
      <script type="text/javascript" src="https://developer.couchbase.com/webfiles/1498186094252/js/thirdparty/vendor/prism.js"></script>
      <script rel="main" type="text/javascript" src="https://developer.couchbase.com/webfiles/1498186094252/js/main.js" ></script>
      </body>
      </html>
    )
  }
}

module.exports = Site;