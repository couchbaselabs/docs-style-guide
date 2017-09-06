# Replace Jekyll's handling of the Redcarpet code_block (which already adds
# support for highlighting, but needs support for the very non-standard
# "code fences with line highlights" extension).
# Since this is currently depending on Redcarpet to cooperate, we are going to
# be naive, and only allow line highlighting when a language is specified. If
# you don't want any syntax highlighting but want to highlight lines, then you
# need to specify text as your language, like:
# ```text{4}


module Jekyll
  module Converters
    class Markdown
      class RedcarpetParser
      	module CommonMethods
					def add_code_tags(code, lang)
						if (!lang.nil? && (lang.include? "+"))
							lang = lang[0..-2]
							code = code.to_s
							optional = code.dup
							if lang == "objective-c"
								code = code.sub(/<pre>/, "<span class=\"stripe-display objective-c\"><pre><code class=\"language-c\" data-lang=\"objective-c\">")
							elsif lang == "android"
								code = code.sub(/<pre>/, "<span class=\"stripe-display android\"><pre><code class=\"language-java\" data-lang=\"java\">")
							elsif lang == "java+android"
								code = code.sub(/<pre>/, "<span class=\"stripe-display android\"><pre><code class=\"language-java\" data-lang=\"java\">")
								optional = optional.sub(/<pre>/, "<span class=\"stripe-display java\"><pre><code class=\"language-java\" data-lang=\"java\">")
								optional = optional.sub(/<\/pre>/, "</code></pre></span>")
							else
								code = code.sub(/<pre>/, "<span class=\"stripe-display #{lang}\"><pre><code class=\"language-#{lang}\" data-lang=\"#{lang}\">")
							end
							
							code = code.sub(/<\/pre>/, "</code></pre></span>")
							
							if lang == "java+android"
								code = code << optional
							end
						
							code
						else
							code = code.to_s
							code = code.sub(
								%r!<pre>!,
								"<pre><code class=\"language-#{lang}\" data-lang=\"#{lang}\">"
							)
							code = code.sub(%r!</pre>!, "</code></pre>")
							code
						end
					end
				end

				module WithoutHighlighting
					require "cgi"

					include CommonMethods

					# removed <figure></figure> container tag to conform to server docs.
					def code_wrap(code)
						# "<figure class=\"highlight\"><pre>#{CGI.escapeHTML(code)}</pre></figure>"
						"<pre>#{CGI.escapeHTML(code)}</pre>"
					end

					def block_code(code, lang)
						lang = lang && lang.split.first || "text"
						add_code_tags(code_wrap(code), lang)
					end
				end
      end
    end
  end
end