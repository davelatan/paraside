using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using System.Text;

public class Paraside
{
    private const string LOCAL_PATH = "/application/web/";
    private string url;
    public string Uri { get; private set; }
    public List<Dictionary<string, object>> InterfaceStructure { get; private set; } = new();
    public List<Dictionary<string, object>> HeadElements { get; private set; } = new();

    private Dictionary<string, object> locstore = new();
    private Dictionary<string, object> sesstore = new();
    private Dictionary<string, object> varstore = new();
    private Dictionary<string, object> contstore = new();

    public Paraside()
    {
        string scheme = Environment.GetEnvironmentVariable("HTTPS") == "on" ? "https" : "http";
        Uri = scheme + "://" + Environment.GetEnvironmentVariable("HTTP_HOST");
        url = Uri + "/" + Directory.GetCurrentDirectory().Replace(LOCAL_PATH, "") + "/";
    }

    private void AddObject(string type, string name, Dictionary<string, object> attributes = null)
    {
        attributes ??= new Dictionary<string, object>();
        InterfaceStructure.Add(new Dictionary<string, object>
        {
            { "type", type },
            { "name", name },
            { "attributes", attributes }
        });
    }

    public void Debug(string onoff) => AddObject("debug", onoff);
    public void Update(string name, Dictionary<string, object> attributes = null) => AddObject("update", name, attributes);
    public void Remove(string name) => AddObject("remove", name);
    public void Head(string type, Dictionary<string, object> attributes = null) => HeadElements.Add(new() { { "type", type }, { "attributes", attributes ?? new() } });
    public void Input(string name, Dictionary<string, object> attributes = null) => AddObject("input", name, attributes);
    public void Button(string name, Dictionary<string, object> attributes = null) => AddObject("button", name, attributes);

    public string ExportJson()
    {
        return InterfaceStructure.Count > 0 ? JsonSerializer.Serialize(InterfaceStructure, new JsonSerializerOptions { WriteIndented = true }) : "[]";
    }

    public string ExportHead()
    {
        StringBuilder html = new();
        foreach (var element in HeadElements)
        {
            string type = element["type"].ToString();
            var attributes = (Dictionary<string, object>)element["attributes"];
            if (type == "css" && attributes.ContainsKey("url"))
                html.AppendFormat("<link rel=\"stylesheet\" href=\"{0}\">\n", attributes["url"]);
            else if (type == "js" && attributes.ContainsKey("url"))
                html.AppendFormat("<script src=\"{0}\"></script>\n", attributes["url"]);
            else if (type == "meta" && attributes.ContainsKey("name") && attributes.ContainsKey("content"))
                html.AppendFormat("<meta name=\"{0}\" content=\"{1}\">\n", attributes["name"], attributes["content"]);
        }
        return html.ToString();
    }

    public void Start()
    {
        Console.WriteLine($"""<!DOCTYPE html>
        <html lang=\"en\">
        <head>
            <meta charset=\"UTF-8\">
            <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
            <link rel=\"stylesheet\" href=\"{url}paraside.css\">
            <script src=\"https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js\"></script>
            <script src=\"https://code.jquery.com/jquery-3.6.4.min.js\"></script>
            <script src=\"https://cdnjs.cloudflare.com/ajax/libs/ace/1.23.0/ace.js\" crossorigin=\"anonymous\" referrerpolicy=\"no-referrer\"></script>
            <script src=\"{url}libs/ckeditor/ckeditor.js\"></script>
            <script src=\"{url}paraside.js\"></script>
            {ExportHead()}
        </head>
        <body>
            <script>render({ExportJson()});</script>
        </body>
        </html>""");
    }
}
