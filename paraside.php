<?php

if(!empty($_GET["prsdpst"]))
{
	include "libs/lzstring/lzstring";
	$prsdpst 	= 	$LZString->decompressFromBase64($_GET["prsdpst"]);
	$prsdpst 	= 	JSON_decode($prsdpst,true);
	$_POST 	= 	array_merge($_POST, $prsdpst); 
	extract($_POST);
}

class paraside
{
	 /*HELP title: costruzione degli oggetti paraside;
			
			description: $ui->{classe dell'oggetto da creare}
							(
								{nome attribuito all'oggetto},
								[attributi:
									"container"=> {mnome del contenitore dell'oggetto},
									"styles" => [ 
														"estyles" => ["style" => "width: 30%;", "mstyle" => ""],  { style del div esterno dell'oggetto , mstyle è lo style da applicare se il dispositivo è mobile}
														"cstyles" => ["style" => "width: 30%;", "mstyle" => ""], { style del div caption dell'oggetto , mstyle è lo style da applicare se il dispositivo è mobile }
														"istyles" => ["style" => "width: 30%;", "mstyle" => ""],	{ style dell'oggetto , mstyle è lo style da applicare se il dispositivo è mobile}
													],    
								
									"events" => [
												"click" {qualsiasi evento} => "registrar.php", { url per chiamata ajax di procedura remota}
												"onclick" {qualsiasi evento} => "alert('ok ci sono');", { esecuzione jscript/jquery ad ecento}
												"post" => [
																	"send"=>  [
																						"auth[driver]"=>"pgsql",
																						"auth[server]"=>"localhost",
																						"auth[username]"=>"superadmin",
																						"auth[password]"=>"sa412094"
																					],
																	"events" =>  [
																							"onclick" => "alert('ok ci sono');",
																							"click" => "users.actions.php?Action=insert",
																							"post" => [
																												"local"=>[ logindata[*] ],
																												"attr"=>[ "userdata" ],	
																												"send"=> [
																																	"auth[driver]"=>"pgsql",
																																	"auth[server]"=>"localhost",
																																	"auth[username]"=>"superadmin",
																																	"auth[password]"=>"saxxxx"
																															   ]		
																											],	
																							"store"=> [										
																												"vars"		=>	["v-pippo","v-fico"],
																												"session"	=> 	["s-fico","s-pippo"],
																												"local"		=> 	["l-pippo","l-fico"],		
																											],						
																							"lock"	=>	1
																						],																							
																],
												
											],
								]
							)
						;

			example: 

							$ui->{classe dell'oggetto da creare}
							(
								{nome attribuito all'oggetto},
								[attributi:
									"container"=> {mnome del contenitore dell'oggetto},
									"styles" => [ 
														"estyles" => ["style" => "width: 30%;", "mstyle" => ""],  { style del div esterno dell'oggetto , mstyle è lo style da applicare se il dispositivo è mobile}
														"cstyles" => ["style" => "width: 30%;", "mstyle" => ""], { style del div caption dell'oggetto , mstyle è lo style da applicare se il dispositivo è mobile }
														"istyles" => ["style" => "width: 30%;", "mstyle" => ""],	{ style dell'oggetto , mstyle è lo style da applicare se il dispositivo è mobile}
													],    
								
									"events" => [
												"click" {qualsiasi evento} => "registrar.php", { url per chiamata ajax di procedura remota}
												"onclick" {qualsiasi evento} => "alert('ok ci sono');", { esecuzione jscript/jquery ad ecento}
												"post" => [
																	"send"=>  [
																						"auth[driver]"=>"pgsql",
																						"auth[server]"=>"localhost",
																						"auth[username]"=>"superadmin",
																						"auth[password]"=>"sa412094"
																					],
																	"events" =>  [
																							"onclick" => "alert('ok ci sono');",
																							"click" => "users.actions.php?Action=insert",
																							"post" => [
																												"local"=>[ logindata[*] ],
																												"attr"=>[ "userdata" ],	
																												"send"=> [
																																	"auth[driver]"=>"pgsql",
																																	"auth[server]"=>"localhost",
																																	"auth[username]"=>"superadmin",
																																	"auth[password]"=>"saxxxx"
																															   ]		
																											],	
																							"store"=> [										
																												"vars"		=>	["v-pippo","v-fico"],
																												"session"	=> 	["s-fico","s-pippo"],
																												"local"		=> 	["l-pippo","l-fico"],		
																											],						
																							"lock"	=>	1
																						],																							
																],
												
											],
								]
							)
						;
			
			title: variabili di sistema;
			description: 
					le variabili possono essere chiamate in fase di "ajax call" niserendo inomi variabile nell'attributo
						events=>store=>local=>"l-pippo"
						events=>store=>session=>"s-pippo"
						events=>store=>vars=>"v-pippo";
			example: 				
						$ui->store=[
									"local"		=>	[ "l-pippo"=>"plutoòàè+§ù?=)(/&%\$£!" , "l-fico"=>file_get_contents("classes/db.create.sql") ],  // variabili locali registrate nel local store del browser
									"session"	=>	[ "s-pippo"=>"plutoòàè+§ù?=)(/&%\$£!" , "s-fico"=>["plutoòàè","topolino"] ],	// variabili di sessione registrate nel local store del browser
									"vars"		=>	[ "v-pippo"=>"plutoòàè+§ù?=)(/&%\$£!" , "v-fico"=>["plutoòàè","topolino"] ],	// variabili valide fino al refresh
									"context"	=>	[ "c-pippo"=>"plutoòàè+§ù?=)(/&%\$£!" , "c-fico"=>["plutoòàè","topolino"] ]   	// il contenuto di context viene inviato in post automaticamente a qualsiasi chiamata
								];			
					
						le variabili possono essere chiamate in fase di "ajax call" niserendo i nomi variabile nell'attributo
							events=>store=>local=>"l-pippo"
							events=>store=>session=>"s-pippo"
							events=>store=>vars=>"v-pippo"
			;		
	
	
	HELP*/
	
	const LOCAL_PATH = "/application/web/";
	
	var $url;
	private $parasideurl = "https://www.paraside.cc/";
	var $uri;
    var $interfaceStructure = [];
    protected $headElements = []; 	
	var $store=[
					"local"		=>	[],
					"session"	=>	[],
					"vars"		=>	[],
					"context"	=>	[]
				];
 
    function __construct(){
		$this->uri = ((!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https" : "http") . "://" . $_SERVER['HTTP_HOST'];
		$this->url = $this->uri."/".str_replace(self::LOCAL_PATH,"",__DIR__)."/";	
	}
	
	protected function addObject(string $type, string $name, array $attributes = []){
        $this->interfaceStructure[] = [
            'type' => $type,
            'name' => $name,
            'attributes' => $attributes
        ];
    } 	
	
	public function obj(array $obj=[]){
		foreach ($obj as $item) 
		{	
			$this->addObject($item[0],$item[1],$item[2]);	
		}
    } 	
    public function debug($onoff){
        $this->addObject('debug', $onoff);
    }	


	/*HELP title: update;
			description: la struttura degli oggetti è la seguente;
			example: 
				$ui->update("registrarfields[email]"			,[ "attr"=>["readonly"=>"true"] ]); { il primo valore è il name dell'oggetto , il secondo valore riporta gli attributi esattamente come per la creazione}
			;
	*/
    public function update(string $name, array $attributes = []){
        $this->addObject('update', $name, $attributes);
    }	
	public function complete(array $values=[]){
		 foreach($values as $key=>$value)
		{ 
			if(!empty($value) )
			{
				$this->update( $key , [ "cont"=>[ "text"=>$value ] ] ); 
			} 
			else
			{
				$this->Clear( $key );
			}
		}
	}
    public function head(string $type, array $attributes = []){
        $this->headElements[] = [
            'type' => $type,
            'attributes' => $attributes
        ];
    }


	/*HELP title: input, password, color, date, datetime, textarea, ide;
			description: creazione di un oggetto input, color, date, datetime, textarea;
			example: 
				$ui->input("logindata[password]", 
				[
					"container"=>"loginframe",
					"styles" => [ 
							"estyles" => ["style" => "width: 100%; height:150px;", "mstyle" => ""],
					],    
					"events" => [
							"codify"=>"md5",
							"enterKey" => "login.php",
							"post" => [
												"local"=> ["searg"],	
											]
					],
					"cont" => [
						"label" => "Password", 
						"text"	=> "David412094"
					],	
				]);			 
 									
 	HELP*/ 
    public function input(string $name, array $attributes = []){
        $this->addObject('input', $name, $attributes);
    }
    public function password(string $name, array $attributes = []){
        $this->addObject('password', $name, $attributes);
    }
    public function color(string $name, array $attributes = []){
        $this->addObject('color', $name, $attributes);
    }
    public function datetime(string $name, array $attributes = []){
        $this->addObject('datetime', $name, $attributes);
    }
    public function textarea(string $name, array $attributes = []){
        $this->addObject('textarea', $name, $attributes);
    }	
    public function date(string $name, array $attributes = []){
        $this->addObject('date', $name, $attributes);
    }
    public function ide(string $name, array $attributes = []){
        $this->addObject('ide', $name, $attributes);
    }
	public function editor(string $name, array $attributes = []){
        $this->addObject('editor', $name, $attributes);
    }	
    public function label(string $name, array $attributes = []){
        $this->addObject('label', $name, $attributes);
    }

	/*HELP title: button;
			description: creazione di un oggetto button;
			example: 
			$ui->button("action[test]", [
				"container"=>"loginframe",
				"styles" => [ 
					"estyles" => ["style" => "width: 30%;", "mstyle" => ""],
				],    
				"events" => [
					"click" => "registrar.php?Action=dbcreate",
					"post" => [
												"local"=>["logindata[*]"],	
									]
				],
				"cont" => [
					"label"   => "Crea DB",
					"ricon"	=> "https://api.iconify.design/line-md/downloading-loop.svg?color=%23fff", 
				]	
			]);			 					
 	HELP*/
    public function button(string $name, array $attributes = []){
        if(!empty($attributes["cont"]["licon"])){ $attributes["cont"]["licon"]=$this->imgstore($attributes["cont"]["licon"]); }
        if(!empty($attributes["cont"]["ricon"])){ $attributes["cont"]["ricon"]=$this->imgstore($attributes["cont"]["ricon"]); }
		
		$this->addObject('button', $name, $attributes);
    }


	/*HELP title: layout;
		description: creazione di un oggetto layout, permette di creare orizzintalmente o verticalmente canvas la cui dimensione può essere modificata dall'utente
					gli oggetti sono elencati nell'array "frames";
		example: 
			$ui->layout( "GeneralLayout", 
			[
				"styles" => [ 
										"estyles" => ["style" => "height:100vh; width: 100%; ", "mstyle" => ""],	
								 ],
				"orientation"     => "horizontal",
				"frames"=>	[
										[ "name" =>"menu", "size" =>"15%" ],
										[ "name" =>"desk", "size" =>"85%" ],
									]
			]);
	HELP*/	
	public function layout(string $name, array $attributes = []){
        $this->addObject('layout', $name, $attributes);
    }


	/*HELP title: frame,iframe,div;
		description: creazione di un oggetto frame;
		example: 
			$ui->frame("mobileregistrar", [
			"window"=>"true", { definisce se la finestra ha una topbar e può essere spostata all'interno della finestra browser}
			"cont"=>[
				"label"=>"Registrati" 
			],
			"styles" => [ 
				"estyles" => ["style" => "top: 20%;height:fit-content; width: 60%; "],	
				"istyles"  => ["style" => "padding: 30px "],	
			],
		]);
	HELP*/
    public function frame(string $name, array $attributes = []){
        $this->addObject('frame', $name, $attributes);
    }	
    public function iframe(string $name, array $attributes = []){
        $this->addObject('iframe', $name, $attributes);
    }
    public function div(string $name, array $attributes = []){
        $this->addObject('div', $name, $attributes);
    }

	/*HELP title: select, list;
		description: creazione di un oggetto select;
		example: 
			$ui->select("CollectionList", [
		
				"container"=>"SelectionCanvas",
				"styles" => [ 
					"estyles" => ["style" => "width: 100%;", "mstyle" => ""],
				],     
				"events" => [
					"change" => "collection_selection.php",
					"lpost" => ["CollectionList"],
					"required" => 0,
					"lock"=>1
				],
				"cont" => [
					"label" => "Modelli milvus",
					"text" => $ui->uri,
					"items" => ["chiavevalore1"=>"testo valore 1","chiavevalore2"=>"testo valore 2","chiavevalore3"=>"testo valore 3"]
				]
			
			]);
	HELP*/	
    public function select(string $name, array $attributes = []){
        $this->addObject('select', $name, $attributes);
    }
    public function list(string $name, array $attributes = []){
        $this->addObject('list', $name, $attributes);
    }

	/*HELP title: checkbox, radio;
		description: creazione di un oggetto select;
		example: 
			$ui->checkbox( "evidenziasezioni",
							[
								"container"=>"data",
								"styles"=>[ "estyles"=>["style"=>"width: 100%;"] ],
								"cont"=>[ "label"=>"Evidenzia sezioni", "value"=>1 ],				
								"events"=>[ "onclick"=>"evidenziasezioni(); " ]
							]
					);
	HELP*/	
    public function checkbox(string $name, array $attributes = []){
        $this->addObject('checkbox', $name, $attributes);
    }
    public function radio(string $name, array $attributes = []) {
        $this->addObject('radio', $name, $attributes);
    }
    
    public function img(string $name, array $attributes = []){
		if(!empty($attributes["cont"]["src"])){ $attributes["cont"]["src"]=str_replace("#","%23",$this->imgstore($attributes["cont"]["src"])); }
		
	   $this->addObject('img', $name, $attributes);
    }	
   
	public function table(string $name, array $attributes = []){
		
		$this->addObject('table', $name, $attributes);
    } 

    public function tree(string $name, array $attributes = []){
        $this->addObject('tree', $name, $attributes);
    }
    
	
	public function lock(array $attributes = []){
        $this->addObject('lock', $attributes);
    }	
    public function unlock(){
        $this->addObject('unlock', "");
    }
	public function goto(array $attributes = []){
		$this->addObject('goto', '', $attributes);
	}	
	
	
	
	public function vars(array $attributes = []){
		$this->addObject('vars', '', $attributes);		
	}	
	public function context(array $attributes = []){
		$this->addObject('context', '', $attributes);		
	}	

	/*HELP title: alert;
		description: visualizza una finestra di alert;
		example: 
			$ui->alert("Eseguito",["color"=>"darkgreen"]); 
	HELP*/			
	public function alert($text, array $attributes = []){
		$this->addObject('alert', $text, $attributes);	
	}	
	
	/*HELP title: console, popup;
		description: visualizza in console.log informazioni e contenuti di variabili o array;
		example: 
			$ui->console( "user" , $user ); { trascrive titolo e contenuto nella console.log}
	HELP*/
	public function popup(array $attributes = []){
		$this->addObject('popup', '', $attributes);
	}
	public function console($title, $attributes=[]){
		
				if( is_array($title) && empty($attributes)){$attributes=$title; $title="console"; }
				if(!is_array($attributes)){ $attributes=[$attributes]; }
				if($title=="clear"){ $this->addObject('console.clear', ''); }
				else{ $this->addObject('console', $title, $attributes); }				
		
	}
	
	/*HELP title: remove,clear,script;
		description: esecuzione die comandi clear , remove e script;
		example: 
			$ui->remove("loginframe");			
			$ui->clear("loginframe");
			$ui->script("$('#miooggetto').css("display","none");");			
	HELP*/
	public function clear($name){	
		if(is_array($name)){ foreach($name as $value){ $this->addObject('clear', $value); } }
		else { $this->addObject('clear', $name); }
	}	
	public function remove(string $name){
        $this->addObject('remove', $name);
    }	
	public function script($script){
		$this->addObject('script', $script);
	}	


	public function urlscript($url){
		$this->addObject('urlscript', $url);
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
                    } 
                    elseif (!empty($attributes['src'])) {
                        $html .= "<script src=\"{$attributes['src']}\"></script>";
                    } 					
					elseif (!empty($attributes['inline'])) {
                        $html .= "<script>{$attributes['inline']}</script>";
                    }
                    break;

                case 'meta':
                    if (!empty($attributes['name']) && !empty($attributes['content'])) {
                        $html .= "<meta name=\"{$attributes['name']}\" content=\"{$attributes['content']}\">";
                    }
                    break;

                case 'free':
                    if (!empty($attributes['content'])) {
					   $html .= $attributes['content'];
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
    

	public function start($force=false){

		if( !empty($_POST["parasidecall"]) and $_POST["parasidecall"] AND !$force )
		{
			$this->echo();
		}
		else
		{
			echo '<!DOCTYPE html>
					<html lang="en">
						<head>
								<meta charset="UTF-8">
								<meta name="viewport" content="width=device-width, initial-scale=1.0">
								
								<script paraside-head="script" src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>
								<script paraside-head="script" src="https://code.jquery.com/jquery-3.6.4.min.js"></script>
								<script paraside-head="script" src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.23.0/ace.js" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
								<script paraside-head="script" src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.23.0/ext-language_tools.js"></script>
								<script paraside-head="script" src="https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.4.4/lz-string.min.js"></script>
							
								<script paraside-head="script" src="https://www.paraside.cc/libs/ckeditor/ckeditor.js"></script>
								<script paraside-head="script" src="https://www.paraside.cc/paraside.js"></script>
								<script paraside-head="script" src="https://cdnjs.cloudflare.com/ajax/libs/pako/2.1.0/pako.min.js"></script>
								<link    paraside-head="link" rel="stylesheet" href="https://www.paraside.cc/paraside.css?nocahche='.time().'">
								<link    paraside-head="link" rel="stylesheet" href="https://www.paraside.cc/paraside.mobile.css">
								' . $this->exportHead() . '

						<head>	
						<body>
							<script id=\'parasidestart\'>render(' . $this->exportJSON() . '); $(\'#parasidestart\').remove();</script>
						</body>
					</html>';
							
		}

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
	public function decompressFromBase64($string){
		include_once "libs/lzstring/lzstring";
		 $LZS=new LZString();
		return $LZS->decompressFromBase64($string);
	}


	/* utility */
		protected function sanitize($array) {
			return array_map(function ($value) {
				if (is_array($value)) {
					return $this->sanitize($value); // Ricorsione per array annidati
				} elseif (is_object($value)) {
					return (array) $value; // Converte gli oggetti in array
				} elseif (is_resource($value)) {
					return null; // Rimuove le risorse, non compatibili con JSON
				} elseif (is_string($value)) {
					return str_replace("\t", "", $value); // Rimuove i caratteri di tabulazione
				} else {
					return $value;
				}
			}, $array);
		}	
		protected function imgstore($url){
			$info = pathinfo($url);
			$info["model"]=basename($info["dirname"]);
			
			// Assicura che l'immagine sia richiesta sempre in nero
			$url = preg_replace('/(\?|&)color=[^&]+/', '', $url) . "?color=%23000000";

			if (
					str_contains($url, "api.iconify.design") 
					&& 
					str_contains($url, ".svg") 
					&&
					(
						is_dir(__DIR__ . "/libs/icons/api.iconify.design/" . $info["model"])
						or
						mkdir(__DIR__ . "/libs/icons/api.iconify.design/" . $info["model"], 0777, true)
					
					)
					&&
					!file_exists(__DIR__ . "/libs/icons/api.iconify.design/" . $info["model"] ."/" . $info['filename'] . ".svp")	
			) {
				$svg = file_get_contents($url);
				$svg = $this->replaceSvgColor($svg);
				file_put_contents(__DIR__ . "/libs/icons/api.iconify.design/" . $info["model"] ."/" . $info['filename'] . ".svp", $svg);
				return $this->parasideurl . "libs/icons/api.iconify.design/" . $info["model"] ."/" . $info['filename'] . ".svp" . substr($info["extension"], 3);
			} elseif (file_exists(__DIR__ . "/libs/icons/api.iconify.design/" . $info["model"] ."/" . $info['filename'] . ".svp")) {
				return $this->parasideurl . "libs/icons/api.iconify.design/" . $info["model"] ."/" . $info['filename'] . ".svp" . substr($info["extension"], 3);
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
