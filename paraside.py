import json
import os
from urllib.parse import urlparse

class paraside:
    LOCAL_PATH = "/application/web/"
    
    def __init__(self):
        self.uri = ("https" if os.getenv('HTTPS') == 'on' else "http") + "://" + os.getenv('HTTP_HOST', '')
        self.url = f"{self.uri}/{os.path.relpath(os.getcwd(), self.LOCAL_PATH)}/"
        
        self.interface_structure = []
        self.head_elements = []
        self.locstore = {}
        self.sesstore = {}
        self.varstore = {}
        self.contstore = {}
    
    def _add_object(self, obj_type, name, attributes=None):
        if attributes is None:
            attributes = {}
        self.interface_structure.append({
            'type': obj_type,
            'name': name,
            'attributes': attributes
        })
    
    def debug(self, onoff):
        self._add_object('debug', onoff)
    
    def update(self, name, attributes=None):
        self._add_object('update', name, attributes)
    
    def remove(self, name):
        self._add_object('remove', name)
    
    def head(self, obj_type, attributes=None):
        if attributes is None:
            attributes = {}
        self.head_elements.append({
            'type': obj_type,
            'attributes': attributes
        })
    
    def _add_input_type(self, obj_type, name, attributes=None):
        self._add_object(obj_type, name, attributes)
    
    def input(self, name, attributes=None):
        self._add_input_type('input', name, attributes)
    
    def password(self, name, attributes=None):
        self._add_input_type('password', name, attributes)
    
    def button(self, name, attributes=None):
        if attributes:
            if "cont" in attributes:
                if "licon" in attributes["cont"]:
                    attributes["cont"]["licon"] = self._img_store(attributes["cont"]["licon"])
                if "ricon" in attributes["cont"]:
                    attributes["cont"]["ricon"] = self._img_store(attributes["cont"]["ricon"])
        self._add_object('button', name, attributes)
    
    def export_json(self):
        for store_name, store in [("local.store", self.locstore), ("session.store", self.sesstore), ("var.store", self.varstore), ("context.store", self.contstore)]:
            for key, value in store.items():
                self._add_object(store_name, key, {"value": value})
        
        return json.dumps(self._sanitize(self.interface_structure), indent=4) if self.interface_structure else "[]"
    
    def export_head(self):
        html = ""
        for element in self.head_elements:
            type_ = element['type']
            attributes = element['attributes']
            if type_ == 'css' and 'url' in attributes:
                html += f'<link rel="stylesheet" href="{attributes["url"]}">' + "\n"
            elif type_ == 'js' and 'url' in attributes:
                html += f'<script src="{attributes["url"]}"></script>' + "\n"
            elif type_ == 'meta' and 'name' in attributes and 'content' in attributes:
                html += f'<meta name="{attributes["name"]}" content="{attributes["content"]}">' + "\n"
        return html
    
    def start(self):
        print(f'''<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="{self.url}paraside.css">
            <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>
            <script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.23.0/ace.js" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
            <script src="{self.url}libs/ckeditor/ckeditor.js"></script>
            <script src="{self.url}paraside.js"></script>
            {self.export_head()}
        </head>
        <body>
            <script>render({self.export_json()});</script>
        </body>
        </html>
        ''')
    
    def _sanitize(self, obj):
        if isinstance(obj, list):
            return [self._sanitize(item) for item in obj]
        elif isinstance(obj, dict):
            return {k: self._sanitize(v) for k, v in obj.items()}
        else:
            return obj
    
    def _img_store(self, url):
        info = os.path.splitext(urlparse(url).path)
        filename = info[0]
        
        if "api.iconify.design" in url and url.endswith(".svg"):
            icon_path = f"libs/icons/api.iconify.design/{filename}.svp"
            if not os.path.exists(icon_path):
                with open(icon_path, "w") as f:
                    f.write(self._replace_svg_color(url))
            return f"{self.url}{icon_path}"
        return url
    
    def _replace_svg_color(self, svg_content):
        svg_content = svg_content.replace("stroke=\"#000000\"", "stroke=\"%23000000\"")
        svg_content = svg_content.replace("fill=\"#000000\"", "fill=\"%23000000\"")
        return svg_content
    
    def clear(self, name):
        self._add_object('clear', name)
    
    def echo(self, once=False):
        json_output = self.export_json()
        if not once:
            print(f"render({json_output});")
        else:
            print(f"render({json_output});")