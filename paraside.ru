require 'json'
require 'uri'

class Paraside
  LOCAL_PATH = "/application/web/"
  
  attr_accessor :uri, :interface_structure, :head_elements, :locstore, :sesstore, :varstore, :contstore

  def initialize
    scheme = ENV['HTTPS'] == 'on' ? 'https' : 'http'
    @uri = "#{scheme}://#{ENV['HTTP_HOST']}"
    @url = "#{@uri}/#{Dir.pwd.sub(LOCAL_PATH, '')}/"
    
    @interface_structure = []
    @head_elements = []
    @locstore = {}
    @sesstore = {}
    @varstore = {}
    @contstore = {}
  end

  def add_object(type, name, attributes = {})
    @interface_structure << {
      type: type,
      name: name,
      attributes: attributes
    }
  end

  def debug(onoff)
    add_object('debug', onoff)
  end

  def update(name, attributes = {})
    add_object('update', name, attributes)
  end

  def remove(name)
    add_object('remove', name)
  end

  def head(type, attributes = {})
    @head_elements << {
      type: type,
      attributes: attributes
    }
  end

  def input(name, attributes = {})
    add_object('input', name, attributes)
  end

  def password(name, attributes = {})
    add_object('password', name, attributes)
  end

  def button(name, attributes = {})
    if attributes[:cont]
      attributes[:cont][:licon] = imgstore(attributes[:cont][:licon]) if attributes[:cont][:licon]
      attributes[:cont][:ricon] = imgstore(attributes[:cont][:ricon]) if attributes[:cont][:ricon]
    end
    add_object('button', name, attributes)
  end

  def export_json
    [@locstore, @sesstore, @varstore, @contstore].each_with_index do |store, idx|
      store.each { |name, values| add_object(["local.store", "session.store", "var.store", "context.store"][idx], name, { value: values }) }
    end
    
    @interface_structure.empty? ? '[]' : JSON.pretty_generate(@interface_structure)
  end

  def export_head
    @head_elements.map do |element|
      case element[:type]
      when 'css'
        element[:attributes][:url] ? "<link rel=\"stylesheet\" href=\"#{element[:attributes][:url]}\">" : "<style>#{element[:attributes][:inline]}</style>"
      when 'js'
        element[:attributes][:url] ? "<script src=\"#{element[:attributes][:url]}\"></script>" : "<script>#{element[:attributes][:inline]}</script>"
      when 'meta'
        "<meta name=\"#{element[:attributes][:name]}\" content=\"#{element[:attributes][:content]}\">"
      else
        "<!-- Unrecognized head element: #{element[:type]} -->"
      end
    end.join("\n")
  end

  def start
    puts """<!DOCTYPE html>
    <html lang=\"en\">
    <head>
      <meta charset=\"UTF-8\">
      <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
      <link rel=\"stylesheet\" href=\"#{@url}paraside.css\">
      <script src=\"https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js\"></script>
      <script src=\"https://code.jquery.com/jquery-3.6.4.min.js\"></script>
      <script src=\"https://cdnjs.cloudflare.com/ajax/libs/ace/1.23.0/ace.js\" crossorigin=\"anonymous\" referrerpolicy=\"no-referrer\"></script>
      <script src=\"#{@url}libs/ckeditor/ckeditor.js\"></script>
      <script src=\"#{@url}paraside.js\"></script>
      #{export_head}
    </head>
    <body>
      <script>render(#{export_json});</script>
    </body>
    </html>"""
  end

  def clear(name)
    add_object('clear', name)
  end

  def echo(once = false)
    json_output = export_json
    puts "render(#{json_output});" unless once
  end
end
