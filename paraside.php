<?php

class paraside
{

	const LOCAL_PATH = "/application/web/";
	
	private $url;
	var $uri;
    var $interfaceStructure = [];
    protected $headElements = []; 
 
	var $store=[
					"local"		=>	[],
					"session"	=>	[],
					"vars"		=>	[],
					"context"	=>	[]
				];
 
    function __construct()
	{
		$this->uri = ((!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https" : "http") . "://" . $_SERVER['HTTP_HOST'];
		$this->url = $this->uri."/".str_replace(self::LOCAL_PATH,"",__DIR__)."/";	
	}
	
	protected function addObject(string $type, string $name, array $attributes = [])
    {
        $this->interfaceStructure[] = [
            'type' => $type,
            'name' => $name,
            'attributes' => $attributes
        ];
    } 
    public function debug($onoff)
    {
        $this->addObject('debug', $onoff);
    }	
    public function update(string $name, array $attributes = [])
    {
        $this->addObject('update', $name, $attributes);
    }	
    public function remove(string $name)
    {
        $this->addObject('remove', $name);
    }	
    public function head(string $type, array $attributes = [])
    {
        $this->headElements[] = [
            'type' => $type,
            'attributes' => $attributes
        ];
    }
    public function input(string $name, array $attributes = [])
    {
        $this->addObject('input', $name, $attributes);
    }	
    public function password(string $name, array $attributes = [])
    {
        $this->addObject('password', $name, $attributes);
    }
    public function color(string $name, array $attributes = [])
    {
        $this->addObject('color', $name, $attributes);
    }
    public function datetime(string $name, array $attributes = [])
    {
        $this->addObject('datetime', $name, $attributes);
    }
    public function button(string $name, array $attributes = [])
    {
        if(!empty($attributes["cont"]["licon"])){ $attributes["cont"]["licon"]=$this->imgstore($attributes["cont"]["licon"]); }
        if(!empty($attributes["cont"]["ricon"])){ $attributes["cont"]["ricon"]=$this->imgstore($attributes["cont"]["ricon"]); }
		
		$this->addObject('button', $name, $attributes);
    }
    public function layout(string $name, array $attributes = [])
    {
        $this->addObject('layout', $name, $attributes);
    }
    public function frame(string $name, array $attributes = [])
    {
        $this->addObject('frame', $name, $attributes);
    }	
    public function textarea(string $name, array $attributes = [])
    {
        $this->addObject('textarea', $name, $attributes);
    }
    public function select(string $name, array $attributes = [])
    {
        $this->addObject('select', $name, $attributes);
    }
    public function date(string $name, array $attributes = [])
    {
        $this->addObject('date', $name, $attributes);
    }
    public function checkbox(string $name, array $attributes = []){
        $this->addObject('checkbox', $name, $attributes);
    }
    public function radio(string $name, array $attributes = []) {
        $this->addObject('radio', $name, $attributes);
    }

    public function editor(string $name, array $attributes = []){
        $this->addObject('editor', $name, $attributes);
    }

    public function table(string $name, array $attributes = []){
		
		$this->addObject('table', $name, $attributes);
    } 

    public function img(string $name, array $attributes = []){
		if(!empty($attributes["cont"]["src"])){ $attributes["cont"]["src"]=str_replace("#","%23",$this->imgstore($attributes["cont"]["src"])); }
		
	   $this->addObject('img', $name, $attributes);
    }

    public function ide(string $name, array $attributes = []){
        $this->addObject('ide', $name, $attributes);
    }
    public function label(string $name, array $attributes = []){
        $this->addObject('label', $name, $attributes);
    }
    public function list(string $name, array $attributes = []){
        $this->addObject('list', $name, $attributes);
    }

    public function tree(string $name, array $attributes = []){
        $this->addObject('tree', $name, $attributes);
    }
    public function iframe(string $name, array $attributes = []){
        $this->addObject('iframe', $name, $attributes);
    }
    public function div(string $name, array $attributes = []){
        $this->addObject('div', $name, $attributes);
    }
    public function lock(array $attributes = []){
        $this->addObject('lock', $script);
    }
	public function script($script){
		$this->addObject('script', $script);
	}
    public function unlock(){
        $this->addObject('unlock', "");
    }
	public function popup(array $attributes = []){
		$this->addObject('popup', '', $attributes);
	}
	public function alert($text, array $attributes = []){
		$this->addObject('alert', $text, $attributes);	
	}	
	public function console($title, $attributes=[]){
		if(!is_array($attributes)){ $attributes=[$attributes]; }
		if($title=="clear")
		{
			$this->addObject('console.clear', '');	
		}
		else
		{
			$this->addObject('console', $title, $attributes);	
		}	
	}
    public function exportJSON(){

	   $this->addObject( "store" , 	"store", $this->store ); 
       return  (!empty($this->interfaceStructure)) ? json_encode($this->sanitize($this->interfaceStructure), JSON_PRETTY_PRINT | JSON_PARTIAL_OUTPUT_ON_ERROR) : [];
	   
    }
    public function exportHead(){
        $html = "";

        foreach ($this->headElements as $element) {
            $type = $element['type'];
            $attributes = $element['attributes'];

            switch ($type) {
                case 'css':
                    if (!empty($attributes['url'])) {
                        $html .= "<link rel=\"stylesheet\" href=\"{$attributes['url']}\">";
                    } elseif (!empty($attributes['inline'])) {
                        $html .= "<style>{$attributes['inline']}</style>";
                    }
                    break;

                case 'js':
                    if (!empty($attributes['url'])) {
                        $html .= "<script src=\"{$attributes['url']}\"></script>";
                    } elseif (!empty($attributes['inline'])) {
                        $html .= "<script>{$attributes['inline']}</script>";
                    }
                    break;

                case 'meta':
                    if (!empty($attributes['name']) && !empty($attributes['content'])) {
                        $html .= "<meta name=\"{$attributes['name']}\" content=\"{$attributes['content']}\">";
                    }
                    break;

                default:
                    $html .= "<!-- Elemento head non riconosciuto: {$type} -->";
                    break;
            }

            $html .= "\n"; // Aggiunge una nuova linea per leggibilità
        }

        return $html;
    }
    public function start(){

		echo '<!DOCTYPE html>
				<html lang="en">
					<head>
						<meta charset="UTF-8">
						<meta name="viewport" content="width=device-width, initial-scale=1.0">
						<link rel="stylesheet" href="'.$this->url.'paraside.css">
						<script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>
						<script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>
						<script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.23.0/ace.js" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
						<script src="https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.4.4/lz-string.min.js"></script>
						<script src="'.$this->url.'libs/ckeditor/ckeditor.js"></script>
						<script src="'.$this->url.'paraside.js"></script>
						' . $this->exportHead() . '
					<head>	
					<body>
						<script>render(' . $this->exportJSON() . ');</script>
					</body>
				</html>';
    }
	public function clear(string $name){
		$this->addObject('clear', $name);
	}
    public function echo($once=false){
		if(!$once && $JSON=$this->exportJSON())
		{
			echo "render(" . $JSON . ");";						
		}
		else if ( $once && realpath(debug_backtrace()[0]["file"]) == realpath($_SERVER["SCRIPT_FILENAME"])  && $JSON=$this->exportJSON())
		{
				echo "render(" . $JSON . ");";	
		}

    }


		protected function sanitize($array) {
			return array_map(function ($value) {
				if (is_array($value)) {
					return $this->sanitize($value); // Ricorsione per array annidati
				} elseif (is_object($value)) {
					return (array) $value; // Converte gli oggetti in array
				} elseif (is_resource($value)) {
					return null; // Rimuove le risorse, non compatibili con JSON
				} else {
					return $value;
				}
			}, $array);
		}	
		protected function imgstore($url){
			$info = pathinfo($url);
			
			// Assicura che l'immagine sia richiesta sempre in nero
			$url = preg_replace('/(\?|&)color=[^&]+/', '', $url) . "?color=%23000000";

			if (str_contains($url, "api.iconify.design") && str_contains($url, ".svg") && !file_exists(__DIR__ . "/libs/icons/api.iconify.design/" . $info['filename'] . ".svp")) {
				$svg = file_get_contents($url);
				$svg = $this->replaceSvgColor($svg);
				file_put_contents(__DIR__ . "/libs/icons/api.iconify.design/" . $info['filename'] . ".svp", $svg);
				return $this->url . "libs/icons/api.iconify.design/" . $info['filename'] . ".svp" . substr($info["extension"], 3);
			} elseif (file_exists(__DIR__ . "/libs/icons/api.iconify.design/" . $info['filename'] . ".svp")) {
				return $this->url . "libs/icons/api.iconify.design/" . $info['filename'] . ".svp" . substr($info["extension"], 3);
			} else {
				return $url;
			}
		}		
		protected function replaceSvgColor($svg){
			// Sostituisce solo i colori neri con il valore GET
			$svg = preg_replace('/stroke=\"(#?000000|#?000)\"/i', "stroke='<?= \$_GET['color'] ?>'", $svg);
			$svg = preg_replace('/fill=\"(#?000000|#?000)\"/i', "fill='<?= \$_GET['color'] ?>'", $svg);
			return "<?php header('Content-Type: image/svg+xml'); ?>" . $svg;
		}
	
	
}

