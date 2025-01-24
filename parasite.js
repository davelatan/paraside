
const ide = {};
const edi = {};

function updateInterface(item, attributes) {
    const { type, name } = item;
    const { mode, styles, events, cont, options, items, rows, columns, nodes } = attributes;

    // Trova l'elemento principale da aggiornare
    const $element = $(`#${name}`);
    if (!$element.length) {
        console.error(`Elemento con ID '${name}' non trovato.`);
        return;
    }

    // Aggiorna gli stili, se definiti
    if (styles) {
        $element.attr("style", styles?.istyles?.style ?? "");
    }

    // Aggiorna il contenuto HTML, se definito
    if (cont?.html) {
        $element.html(cont.html);
    }

    // Aggiungi o sostituisci eventi
    if (events) {
        Object.entries(events).forEach(([event, handler]) => {
            $element.off(event); // Rimuove eventuali eventi precedenti
            $element.on(event, handler);
        });
    }

    // Gestione di liste
    if (type === "list" && items) {
        if (mode === "replace") {
            $element.empty();
            items.forEach(item => {
                const $listItem = $(`<li>${item.content}</li>`).attr("id", item.id || "");
                $element.append($listItem);
            });
        } else if (mode === "alter") {
            items.forEach(item => {
                if (item.action === "add") {
                    const $listItem = $(`<li>${item.content}</li>`).attr("id", item.id || "");
                    $element.append($listItem);
                } else if (item.action === "remove") {
                    $element.find(`#${item.id}`).remove();
                }
            });
        }
    }

    // Gestione di tabelle
    if (type === "table" && (rows || columns)) {
        if (mode === "replace") {
            $element.empty();
            rows.forEach(row => {
                const $row = $("<tr></tr>");
                row.forEach(cell => {
                    const $cell = $(`<td>${cell.content}</td>`).attr("id", cell.id || "");
                    $row.append($cell);
                });
                $element.append($row);
            });
        } else if (mode === "alter") {
            rows?.forEach(row => {
                if (row.action === "add") {
                    const $row = $("<tr></tr>");
                    row.cells.forEach(cell => {
                        const $cell = $(`<td>${cell.content}</td>`).attr("id", cell.id || "");
                        $row.append($cell);
                    });
                    $element.append($row);
                } else if (row.action === "remove") {
                    $element.find(`#${row.id}`).remove();
                }
            });
        }
    }

    // Gestione di alberi
    if (type === "tree" && nodes) {
        const processNodes = (nodeList, $parentElement) => {
            nodeList.forEach(node => {
                const $nodeElement = $(`<div>${node.label}</div>`).attr("id", node.id || "");
                $parentElement.append($nodeElement);

                if (node.children && node.children.length) {
                    const $childContainer = $("<div class='tree-children'></div>");
                    $nodeElement.append($childContainer);
                    processNodes(node.children, $childContainer);
                }
            });
        };

        if (mode === "replace") {
            $element.empty();
            processNodes(nodes, $element);
        } else if (mode === "alter") {
            nodes.forEach(node => {
                if (node.action === "add") {
                    processNodes([node], $element);
                } else if (node.action === "remove") {
                    $element.find(`#${node.id}`).remove();
                }
            });
        }
    }

    // Altri tipi di aggiornamento possono essere aggiunti qui
    console.log(`Elemento con ID '${name}' aggiornato con successo.`);
}

function createInterface(jsonData) {

    // Mappa per tenere traccia dei frame creati
    const frames = {};

    jsonData.forEach(item => {
        const { type, name, attributes , check} = item;
		const { styles, events, cont, options, items, container, window } = attributes;

        // Creazione dell'oggetto principale
        let $mainObject;
		
        // Controllo se un elemento con lo stesso ID esiste già
        if ( type=="update" )
		{
			updateInterface( item , attributes );
			return;
		}       
		else if( type=="div")
		{
                $mainDiv = $("<div>")
                    .addClass(`${type}-ite`)
                    .attr("style", styles?.istyles?.style ?? "") // Gestione proprietà mancanti
                    .attr("styles", JSON.stringify(styles?.istyles || {}) || "")
                    .attr("id", name);
                    if(cont.html){ $mainDiv.html(cont.html); }	

					if (container) {
						$("#" + container).append($mainDiv);
					} else {
						$("body").append($mainDiv);
					}
				
                return;			
		}		
		else if ( type=="console" )
		{
			console.log("Attributes content:", attributes);
			return;
		}
        else if ( type=="clear" )
		{
			$("#"+name).empty();
			return;
		}       
		else if ( type=="unlock" )
		{
			$("#locker").remove();
			return;
		}
		else if( type=="lock" )
		{
			if( $("#locker").length == 0 )
			{
				const $outerDiv = $("<locker>")
					.addClass(`locker`)
					.attr("style", styles?.istyles?.style ?? "") // Gestione proprietà mancanti
					.attr("styles", JSON.stringify(styles?.istyles || {}) || "")
					.attr("id", "locker")
					.append('<svg width="50px" height="50px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><defs><style>.cls-1 { fill: var(--button-tcolor); opacity: 0.7;} .cls-2 { fill: var(--button-tcolor); opacity: 0.5;} .cls-3 { fill: var(--button-tcolor); opacity: 0.3;}</style></defs><g data-name="Product Icons"><g><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite" /><path class="cls-1" d="M7.3,15.7A5.92,5.92,0,0,1,6,12H2a9.89,9.89,0,0,0,2.46,6.54Z" /><path class="cls-1" d="M12,2A10,10,0,0,0,5.45,4.45L8.29,7.29A6,6,0,0,1,18,12h4A10,10,0,0,0,12,2Z" /><circle id="Oval-2" class="cls-2" cx="8" cy="19" r="2" /><circle id="Oval-2-2" data-name="Oval-2" class="cls-3" cx="19" cy="16" r="2" /><circle id="Oval-2-3" data-name="Oval-2" class="cls-1" cx="14" cy="20" r="2" /><path class="cls-3" d="M6,12H2a10,10,0,0,0,.44,2.91l4-.79A6,6,0,0,1,6,12Z" /><g data-name="colored-32/network-tiers"><g><circle id="Oval-2-4" data-name="Oval-2" class="cls-2" cx="5" cy="8" r="2" /></g></g><path class="cls-3" d="M17.61,9.88A6,6,0,0,1,18,12h4a10,10,0,0,0-.43-2.91Z" /></g></g></svg>')
					$("body").append($outerDiv);
				return;				
			}
				
		}
        else if ( type=="layout" )
		{
				// Creazione del contenitore principale
				const $mainLayout = $("<div>")
					.addClass("layout-container "+attributes.orientation)
					.attr("style", styles?.estyles?.style ?? "") // Stile principale
					.attr("id", name);

				// Iterazione sui frame
				if (attributes.frames && Array.isArray(attributes.frames)) {
					attributes.frames.forEach((frame, index) => {
						const $frame = $("<div>")
							.addClass("frame-item "+attributes.orientation)
							
							.attr("id", frame.name || `frame_${index}`);
						
						if(attributes.orientation=="horizontal")
						{
							$frame.attr("style", `width: ${frame.size};`) // Altezza o larghezza iniziale
						}
						else
						{
							$frame.attr("style", `height: ${frame.size};`) // Altezza o larghezza iniziale
						}
						$mainLayout.append($frame);

						// Aggiunta della barra di separazione se non è l'ultimo frame
						if (index < attributes.frames.length - 1) {
							const $resizer = $("<resizer>")
								.addClass("frame-resizer "+attributes.orientation)
								.attr("data-index", index);
							$mainLayout.append($resizer);
						}
					});
				}

				// Aggiunge il layout al body

				if (container) {
					$("#" + container).append($mainLayout);
				} else {
					$("body").append($mainLayout);
				}
				// Avvio della logica di ridimensionamento
				initializeResizable($mainLayout, attributes.orientation);
				return;	
		}		
		else if($("#" + name).length > 0) { return; }

        const $outerDiv = $("<div>")
            .attr("style", styles?.estyles?.style ?? "") // Gestione proprietà mancanti
            .attr("styles", JSON.stringify(styles?.estyles || {}) || "")
			.attr("id",`${name}-ext`)
            .addClass(`external ${type}-ext`);

			if(window){	$outerDiv.addClass(`external ${type}-ext ${type}-ext-mob`); }
			else{ $outerDiv.addClass(`external ${type}-ext`); }

        const $innerLabel = $("<label>")
            .attr("style", styles?.cstyles?.style ?? "") // Gestione proprietà mancanti
            .attr("styles", JSON.stringify(styles?.cstyles || {}) || "")
            .addClass(`caption ${type}-cap`)
            .text(cont?.label || "");

			if(window)
			{	
				$innerLabel.addClass(`caption ${type}-cap ${type}-cap-mob`); 
				$innerLabel.append(`<span class="${type}-cap-mob-close" onclick="$('#${name}-ext').remove();">✖</span>`); 									
			}
			else{ $innerLabel.addClass(`caption ${type}-cap`); }

        switch (type) {
			
            case "frame":
                $mainObject = $("<div>")
                    .addClass(`${type}-ite`)
                    .attr("style", styles?.istyles?.style ?? "") // Gestione proprietà mancanti
                    .attr("styles", JSON.stringify(styles?.istyles || {}) || "")
                    .attr("id", name);
                break;

            case "select":
                $mainObject = $("<select>")
                    .addClass(`internal ${type}-ite`)
                    .attr("style", styles?.istyles?.style ?? "") // Gestione proprietà mancanti
                    .attr("styles", JSON.stringify(styles?.istyles || {}) || "")
                    .attr("id", name);

					if (typeof cont.items === "object" && cont.items !== null && !Array.isArray(cont.items)) {
						Object.entries(cont.items).forEach(([key, value]) => {
							const $listItem = $("<option>")
								.val(key || option)
								.text(value || option)
								.addClass("select-item");
							$mainObject.append($listItem);
						});
					} else {
						console.warn(`L'attributo 'items' non è un oggetto valido per il tipo 'list' con id '${name}'`);
					}
					break;                

            case "tree":
                $mainObject = $("<div>")
                    .addClass(`${type}-ite`)
                    .attr("id", name)
                    .attr("style", styles?.istyles?.style ?? "")
                    .attr("styles", JSON.stringify(styles?.istyles || {}) || "");

                if (cont.nodes && Array.isArray(cont.nodes)) {
                    $mainObject.append(createTreeNodes(cont.nodes, "", styles));
                }

                break;

            case "table":
                $mainObject = $("<div>")
                    .addClass(`${type}-ite-div`)
					.attr("id", name)
                    .append(createTable(cont.headers, cont.rows, styles));
                break;

                const buildTree = (nodes, $parent) => {
                    nodes.forEach(node => {
                        const $li = $("<li>").text(node.label || node);
                        $parent.append($li);

                        if (node.children && Array.isArray(node.children)) {
                            const $childUl = $("<ul>");
                            $li.append($childUl);
                            buildTree(node.children, $childUl);
                        }
                    });
                };

                if (attributes.nodes && Array.isArray(attributes.nodes)) {
                    buildTree(attributes.nodes, $mainObject);
                }
                break;

            case "checkbox":
                $mainObject = $("<input>")
                    .addClass(`internal ${type}-ite`)
                    .attr("style", styles?.istyles?.style ?? "") 
                    .attr("styles", JSON.stringify(styles?.istyles || {}) || "")
                    .attr("id", name)
                    .attr("type", "checkbox")
                    .text(attributes.content || "");
                break;

            case "radio":
                $mainObject = $("<input>")
                    .addClass(`internal ${type}-ite`)
                    .attr("style", styles?.istyles?.style ?? "") 
                    .attr("styles", JSON.stringify(styles?.istyles || {}) || "")
                    .attr("name", cont.group)
					.attr("id", name)
                    .attr("type", "radio")
                    .text(attributes.content || "");
                break;
				
            case "color":
                $mainObject = $("<input>")
                    .addClass(`internal ${type}-ite`)
                    .attr("style", styles?.istyles?.style ?? "") 
                    .attr("styles", JSON.stringify(styles?.istyles || {}) || "")
                    .attr("id", name)
                    .attr("type", "color")
                    .text(attributes.content || "");
                break;

            case "calendar":
                $mainObject = $("<input>")
                    .addClass(`internal ${type}-ite`)
                    .attr("style", styles?.istyles?.style ?? "")
                    .attr("styles", JSON.stringify(styles?.istyles || {}) || "")
                    .attr("id", name)
                    .attr("type", "color")
                    .text(attributes.content || "");
					if(cont.type){$mainObject.attr("type", cont.type);}else{$mainObject.attr("type", "date");}
                break;
				
            case "image":
                $mainObject = $("<img>")
                    .addClass(`internal ${type}-ite`)
                    .attr("style", styles?.istyles?.style ?? "")
                    .attr("styles", JSON.stringify(styles?.istyles || {}) || "")
                    .attr("id", name)
                    .attr("src", attributes.src || "")
                    .attr("alt", attributes.alt || "Image");
                break;

            case "iframe":
                $mainObject = $("<iframe>")
                    .addClass(`${type}-ite`)
                    .attr("style", styles?.istyles?.style ?? "") 
                    .attr("styles", JSON.stringify(styles?.istyles || {}) || "")
                    .attr("id", name)
                    .attr("src", attributes.src || "");
                break; 

            case "button":
                $mainObject = $("<button>")
                    .addClass(`internal ${type}-ite`)
                    .attr("style", styles?.istyles?.style ?? "") 
                    .attr("styles", JSON.stringify(styles?.istyles || {}) || "")
                    .attr("id", name)
                    .attr("src", attributes.src || "")
                    .html(cont.label);
                break;

            case "list":
                $mainObject = $("<div>")
                    .addClass(`internal ${type}-ite`)
                    .attr("style", styles?.istyles?.style ?? "") 
                    .attr("styles", JSON.stringify(styles?.istyles || {}) || "")
                    .attr("id", name);
 
				if (typeof cont.items === "object" && cont.items !== null && !Array.isArray(cont.items)) 
				{
                    Object.entries(cont.items).forEach(([key, value]) => {
                        const $listItem = $("<div>")
                            .addClass("list-item")
                            .attr("data-key", key)
                            .text(value);
                        $mainObject.append($listItem);
                    });
                } 
				else 
				{
                    console.warn(`L'attributo 'items' non è un oggetto valido per il tipo 'list' con id '${name}'`);
                }
                break; 		

            case "ide":
                $mainObject = $("<div>")
                    .addClass(`internal ${type}-ite`)
                    .attr("style", styles?.istyles?.style ?? "") 
                    .attr("styles", JSON.stringify(styles?.istyles || {}) || "")
                    .attr("id", name)
					.text(cont.text || "");		
					$( document ).ready(function() 
					{ 
						ace.require("ace/ext/language_tools");
						ide[name] = ace.edit(name, { mode: 'ace/mode/'+(cont?.language ?? "text"), selectionStyle:(cont?.language ?? "text"), dragEnabled:false });
							ide[name].setHighlightActiveLine(true);
							if(cont.wrap){ ide[name].session.setUseWrapMode(true); }
							if(cont.autocompletion){ ide[name].setOptions({ enableLiveAutocompletion: cont.autocompletion }); }							
						ide[name].resize(); 						
					});
					break;

            case "editor":
                $mainObject = $("<textarea>")
                    .addClass(`internal ${type}-ite editor`)
                    .attr("style", styles?.istyles?.style ?? "") 
                    .attr("styles", JSON.stringify(styles?.istyles || {}) || "")
                    .attr("id", name)
                    .text(cont.text || "");
					
					$( document ).ready(function() 
					{
						edi[name] = CKEDITOR.replace(name);
						edi[name].config.toolbarGroups = [{ name: 'clipboard', groups: [ 'clipboard', 'undo' ] },{ name: 'insert', groups: [ 'insert' ] },{ name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ] }];						
					});
					
                break;

/*            case "input":
                $mainObject = $(`<${type}>`)
                    .addClass(`${type}-ite`)
                    .attr("style", styles?.istyles?.style ?? "") 
                    .attr("styles", JSON.stringify(styles?.istyles || {}) || "")
                    .attr("id", name)
                break;
*/				
            default:
                $mainObject = $(`<${type}>`)
                    .addClass(`${type}-ite`)
                    .attr("style", styles?.istyles?.style ?? "") 
                    .attr("styles", JSON.stringify(styles?.istyles || {}) || "")
                    .attr("id", name)
					.val(cont.text ?? "");
                break;
        }

        applyEvents($mainObject, events); 
		
        $mainObject.attr("typ", type);		
		$outerDiv.append($innerLabel).append($mainObject);

        if (container) {
            $("#" + container).append($outerDiv);
        } else {
            $("body").append($outerDiv);
        }
    });
}

function fetchData($this, event) {
		let eventConfig;

		// Gestione specifica per il tipo tree
		if ($this.hasClass("tree-node")) {
			const $treeContainer = $this.closest(".tree-ite");

			if (!$treeContainer.length) {
				console.error("Contenitore del tree-view non trovato.");
				return;
			}

			eventConfig = $treeContainer.data("events");
		} 
		else if ($this.is("tr")) {
			
			 const $tableContainer = $this.closest(".table-ite-div");

			if (!$tableContainer.length) {
				console.error("Contenitore del tree-view non trovato.");
				return;
			}

			eventConfig = $tableContainer.data("events");		
		} 	
		else if ($this.hasClass("list-item")) {
			const $listContainer = $this.closest(".list-ite");
			eventConfig = $listContainer.data("events");		
		} 			
		
		else 
		{
			// Per gli altri tipi di oggetto
			eventConfig = $this.data("events");
		}

		if (!eventConfig) {
			console.error("Configurazione eventi non trovata.");
			return;
		}

		const eventType = event.type;
		const ajaxUrl = eventConfig[eventType];
		const lpost = eventConfig.lpost || [];

		if (!ajaxUrl) {
			console.error(`URL non configurato per l'evento: ${eventType}`);
			return;
		}

		const postData = {};

		lpost.forEach((varName) => {

			const $element = $("#"+CSS.escape(varName));
			if ($element.length)
			{
				if ( $this.hasClass("tree-node") || $this.hasClass("tree-ite") ) {
					postData[varName] = $element.attr("tree-sct"); 			
				}		
				else if ($element.hasClass("tree-ite") ) {
					postData[varName] = $element.attr("tree-sct"); 			
				}				
				else if ($this.is("tr")) {
					postData[varName] = $element.attr("table-sct"); 
				}		
				else if ($this.hasClass("list-item")) {
					 postData[varName] = $element.attr("list-sct"); 
				}
				else
				{
					if ($element.length) {
						postData[varName] = $element.val() || $element.text() || $element.attr("value");
					}			
				}					
			}

			
			console.log(postData);
			
		});

		$.ajax({
			url: ajaxUrl,
			method: "POST",
			data: postData,
			success: (response) => { try { eval(response); } catch (e) { console.log(response);} },
			error: (xhr, status, error) => { console.error(`AJAX Error per evento '${eventType}':`, status, error); },
		});
}

function initializeResizable($layoutContainer, orientation) {
    let isResizing = false;
    let startPageCoord = 0;
    let totalSize = 0;
    let startSizePrimary = 0;
    let startSizeSecondary = 0;
    let $currentFrame;
    let $nextFrame;

    $layoutContainer.find(".frame-resizer").on("mousedown", function (e) {
        isResizing = true;

        const index = $(this).data("index");
        //$currentFrame = $layoutContainer.find(".frame-item").eq(index);
        //$nextFrame = $layoutContainer.find(".frame-item").eq(index + 1);
        $currentFrame = $(this).prev();
        $nextFrame = $(this).next();

        // Calcola la dimensione totale disponibile solo per il layout corrente
        if (orientation === "vertical") {
            startPageCoord = e.pageY;
            totalSize = $layoutContainer.height(); // Altezza totale del layout
            startSizePrimary = ($currentFrame.height() / totalSize) * 101; // Altezza in %
            startSizeSecondary = ($nextFrame.height() / totalSize) * 101; // Altezza in %
        } else {
            startPageCoord = e.pageX;
            totalSize = $layoutContainer.width(); // Larghezza totale del layout
            startSizePrimary = ($currentFrame.width() / totalSize) * 101; // Larghezza in %
            startSizeSecondary = ($nextFrame.width() / totalSize) * 101; // Larghezza in %
        }

        $("body").addClass("resizing");
    });

    $(document).on("mousemove", function (e) {
        if (!isResizing) return;

        if (orientation === "vertical") {
            const dy = e.pageY - startPageCoord;
            const dyPercent = (dy / totalSize) * 100; // Converti lo spostamento in %
            const newSizePrimary = startSizePrimary + dyPercent;
            const newSizeSecondary = startSizeSecondary - dyPercent;

            if (newSizePrimary > 0 && newSizeSecondary > 0) {
                $currentFrame.css("height", ''+round(newSizePrimary.toFixed(15),5)+'%');
                $nextFrame.css("height", ''+round(newSizeSecondary.toFixed(15),5)+'%');
            }
        } else {
            const dx = e.pageX - startPageCoord;
            const dxPercent = (dx / totalSize) * 100; // Converti lo spostamento in %
            const newSizePrimary = startSizePrimary + dxPercent;
            const newSizeSecondary = startSizeSecondary - dxPercent;

            if (newSizePrimary > 0 && newSizeSecondary > 0) {
                $currentFrame.css("width", ''+round(newSizePrimary.toFixed(15),5)+'%');
                $nextFrame.css("width", ''+round(newSizeSecondary.toFixed(15),5)+'%');
            }
        }
    });

    $(document).on("mouseup", function () {
        if (isResizing) {
            isResizing = false;
            $("body").removeClass("resizing");
        }
    });
}

function round(numero, decimali) {
    const fattore = Math.pow(10, decimali); // 10^decimali
    return Math.round(numero * fattore) / fattore;
}

function updateObjectContent(id, newContent) {
    const $element = $(`#${id}`);
    if ($element.length > 0) {
        if ($element.is('input, textarea')) {
            $element.val(newContent);
        } else {
            $element.html(newContent);
        }
    } else {
        console.error(`Elemento con id "${id}" non trovato.`);
    }
}

function createTreeNodes(nodes, path = "", styles = {}) {
    const $nodeWrapper = $("<div>").addClass("tree-node-wrapper");

    nodes.forEach((node) => {
        const currentPath = path ? `${path}.${node.key}` : node.key;

        const $node = $("<div>")
            .addClass("tree-node")
            .attr("style", styles?.nodeStyles?.style ?? "")
            .data("path", currentPath);

        if (node.children && Array.isArray(node.children) && node.children.length > 0) {
            const $toggleButton = $("<span>")
                .addClass("tree-toggle")
                .text(node.expanded ? "-" : "+")
                .css({
                    "margin-right": "5px",
                    "cursor": "pointer",
                    "font-weight": "bold",
                });

            $node.append($toggleButton).append(node.label);

            const $childrenContainer = $("<div>").addClass("tree-children");

            if (!node.expanded) {
                $childrenContainer.hide();
            }

            node.children.forEach((childNode) => {
                $childrenContainer.append(createTreeNodes([childNode], currentPath, styles));
            });

            $toggleButton.on("click", function (e) {
                e.stopPropagation();
                const isExpanded = $childrenContainer.is(":visible");
                $childrenContainer.toggle();
                $toggleButton.text(isExpanded ? "+" : "-");
            });

            $nodeWrapper.append($node).append($childrenContainer);
        } else {
            const $dot = $("<span>")
                .addClass("tree-dot")
                .text("●")
                .css({
                    "margin-right": "5px",
                    "color": "#999",
                });

            $node.append($dot).append(node.label);
            $nodeWrapper.append($node);
        }
    });

    return $nodeWrapper;
}

function createTable(headers, rows, styles = {}) {
    const $table = $("<table>")
        .addClass(`internal table-ite`)
        .attr("style", styles?.istyles?.style ?? "")
        .attr("styles", JSON.stringify(styles?.istyles || {}) || "");

    if (headers && Array.isArray(headers)) {
        const $thead = $("<thead>");
        const $headerRow = $("<tr>");

        headers.forEach((header) => {
            const $headerCell = $("<th>").text(header);
            $headerRow.append($headerCell);
        });

        $thead.append($headerRow);
        $table.append($thead);
    }

    if (rows && typeof rows === "object") {
        const $tbody = $("<tbody>");

        Object.entries(rows).forEach(([key, row]) => {
            const $row = $("<tr>").attr("key", key);

            row.forEach((cell) => {
                const $cell = $("<td>").text(cell);
                $row.append($cell);
            });

            $tbody.append($row);
        });
        $table.append($tbody);
    }

    return $table;
}

function applyEvents($element, events) {
	
    if (!events) return;

    $element.attr("data-events", JSON.stringify(events));

    if ($element.hasClass("tree-ite")) {
        $element.find(".tree-node").each(function () {
            const $node = $(this);

            $node.on("click", function () {
                const path = $(this).data("path");
				$element.find(".tree-node-selected").each(function () {	$(this).removeClass("tree-node-selected");	 });								
				$(this).addClass("tree-node-selected");	
                $element.attr("tree-sct", path);
            });

            $node.on(Object.keys(events || {}).join(" "), function (event) {
                fetchData($node, event);
            });
        });
    } 
	else if ($element.hasClass("table-ite-div")) {
        $element.find("tbody tr").each(function () {
            const $row = $(this);

            $row.on("click", function (event) {
                const $cell = $(event.target);
                const cellIndex = $cell.index();
                const colName = $element.find("thead th").eq(cellIndex).text();
                const rowKey = $row.attr("key");
                const cellContent = $cell.text();

                const tableData = {
                    key: rowKey,
                    column: colName,
                    content: cellContent,
                };

                $element.attr("table-sct", JSON.stringify(tableData));
            });

            $row.on(Object.keys(events || {}).join(" "), function (event) {
                fetchData($row, event);
            });
        });
    } 
	
	else if ($element.hasClass("list-ite")) {	
		$element.find(".list-item").each(function () {

				const $row = $(this);
				$row.on("click", function (event) {
						const tableData = {
							key: $(this).attr("data-key"),
							text: $(this).text(),
						};	
						$element.find(".list-item-selected").each(function () {	$(this).removeClass("list-item-selected");	 });								
						$(this).addClass("list-item-selected");					
						$element.attr("list-sct", JSON.stringify(tableData));
				});

				$row.on(Object.keys(events || {}).join(" "), function (event) {
					fetchData($row, event);
				});
			});		

	}
	
	else {
			$element.on(Object.keys(events || {}).join(" "), function (event) { fetchData($(this), event); });
    }
	
}

$(document).ready(function () {
    let isDragging = false;
    let offsetX, offsetY;

    $(".frame-cap-mob").on("mousedown", function (event) {
        // Rileva l'elemento contenitore .frame-ext-mob associato
        const $frame = $(this).closest(".frame-ext-mob");

        if ($frame.length === 0) return; // Se non trova il frame, esci

        // Abilita il trascinamento
        isDragging = true;

        // Ottieni la posizione effettiva del frame
        const frameOffset = $frame.offset();
        const frameLeft = frameOffset.left + $frame.outerWidth() / 2; // Considera il -50% del transform
        const frameTop = frameOffset.top + $frame.outerHeight() / 2; // Considera il -50% del transform

        // Calcola l'offset iniziale tra il click del mouse e il centro del frame
        offsetX = event.pageX - frameLeft;
        offsetY = event.pageY - frameTop;

        // Aggiungi una classe per evidenziare l'elemento durante il trascinamento
        $frame.addClass("dragging");

        // Evita selezioni accidentali
        event.preventDefault();
    });

    $(document).on("mousemove", function (event) {
        if (!isDragging) return;

        // Calcola la nuova posizione del frame (considerando il centro come punto di riferimento)
        const newLeft = event.pageX - offsetX;
        const newTop = event.pageY - offsetY;

        // Applica la nuova posizione al frame, togliendo l'effetto del transform
        $(".dragging").css({
            left: `${newLeft}px`,
            top: `${newTop}px`,
            transform: "translate(-50%, -50%)", // Mantieni il centro del frame
        });
    });

    $(document).on("mouseup", function () {
        if (isDragging) {
            // Disabilita il trascinamento
            isDragging = false;

            // Rimuovi la classe di trascinamento
            $(".dragging").removeClass("dragging");
        }
    });
});




