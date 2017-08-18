module Jekyll
  class DitaConverter < Converter
    safe true
    priority :low

    def matches(ext)
      ext =~ /^\.dita$/i
    end

    def output_ext(ext)
      ".html"
    end

    def convert(content)
      File.open('input.dita', 'w') { |f|
        f.write(content)
      }
      output = `dita -f html5 -i input.dita  -o .`
      html = File.read('input.html')
      html
    end
  end
end