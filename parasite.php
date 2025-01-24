<?php

class parasite
{

    var $interfaceStructure = [];
    protected $headElements = [];

    protected function addObject(string $type, string $name, array $attributes = [])
    {
        $this->interfaceStructure[] = [
            'type' => $type,
            'name' => $name,
            'attributes' => $attributes
        ];
		//print_r($this->interfaceStructure);exit;
    }
 
    public function update(string $name, array $attributes = [])
    {
        $this->addObject('update', $name, $attributes);
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

    public function color(string $name, array $attributes = [])
    {
        $this->addObject('color', $name, $attributes);
    }

    public function calendar(string $name, array $attributes = [])
    {
        $this->addObject('calendar', $name, $attributes);
    }
		
    public function button(string $name, array $attributes = [])
    {
        $this->addObject('button', $name, $attributes);
    }

    // Nuovi oggetti aggiunti
    public function layout(string $name, array $attributes = [])
    {
        $this->addObject('layout', $name, $attributes);
    }
	
    // Nuovi oggetti aggiunti
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

    public function checkbox(string $name, array $attributes = [])
    {
        $this->addObject('checkbox', $name, $attributes);
    }

    public function radio(string $name, array $attributes = [])
    {
        $this->addObject('radio', $name, $attributes);
    }

    public function editor(string $name, array $attributes = [])
    {
        $this->addObject('editor', $name, $attributes);
    }

    public function table(string $name, array $attributes = [])
    {
		
		$this->addObject('table', $name, $attributes);
    } 

    public function image(string $name, array $attributes = [])
    {
        $this->addObject('image', $name, $attributes);
    }

    public function ide(string $name, array $attributes = [])
    {
        $this->addObject('ide', $name, $attributes);
    }

    public function label(string $name, array $attributes = [])
    {
        $this->addObject('label', $name, $attributes);
    }

    public function list(string $name, array $attributes = [])
    {
        $this->addObject('list', $name, $attributes);
    }

    public function tree(string $name, array $attributes = [])
    {
        $this->addObject('tree', $name, $attributes);
    }

    public function iframe(string $name, array $attributes = [])
    {
        $this->addObject('iframe', $name, $attributes);
    }
	
    public function div(string $name, array $attributes = [])
    {
        $this->addObject('div', $name, $attributes);
    }

    public function lock(array $attributes = [])
    {
        $this->addObject('lock', "", $attributes);
    }
	
    public function unlock()
    {
        $this->addObject('unlock', "");
    }
	
	public function popup(array $attributes = [])
	{
		$this->addObject('popup', '', $attributes);
	}
	
	public function console($attributes)
	{
		if(!is_array($attributes)){$attributes=[$attributes];}
		$this->addObject('console', '', $attributes);
	}
	
    // Metodi per esportare JSON e head
    public function exportJSON()
    {
       return  (!empty($this->interfaceStructure)) ? json_encode($this->interfaceStructure, JSON_PRETTY_PRINT) : [];
    }
    public function exportHead()
    {
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
    public function start()
    {
        
		
		
		echo '<!DOCTYPE html>
				<html lang="en">
					<head>
						<meta charset="UTF-8">
						<meta name="viewport" content="width=device-width, initial-scale=1.0">
						<link rel="stylesheet" href="parasite.1.0/parasite.css">
						<script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>
						<script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.23.0/ace.js" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
						<script src="parasite.1.0/libs/ckeditor/ckeditor.js"></script>
						<script src="parasite.1.0/parasite.js"></script>
						' . $this->exportHead() . '
					<head>	
					<body>
						<script>createInterface(' . $this->exportJSON() . ');</script>
					</body>
				</html>';
    }
	public function clear(string $name)
	{
		$this->addObject('clear', $name);
	}
    public function echo()
    {
		if($JSON=$this->exportJSON())
		{
			echo "createInterface(" . $JSON . ");";			
		}

    }

	
}
