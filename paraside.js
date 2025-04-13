const ide = {};
const edi = {};
const iframe = {};

var debug=0; 

var store = { 
    vars: {}, 
    context: {} , 
	localcontext: localStorage.getItem("parasidecontext") ? JSON.parse(LZString.decompress(localStorage.getItem("parasidecontext"))) || {} : {}, 
    local: localStorage.getItem("paraside") ? JSON.parse(LZString.decompress(localStorage.getItem("paraside"))) || {} : {}, 
    session: sessionStorage.getItem("paraside") ? JSON.parse(LZString.decompress(sessionStorage.getItem("paraside"))) || {} : {}
};

function parasideconsole(title,message=""){
	if(debug){ console.log(title, message); }
}

function render(jsonData) {
    parasideconsole('exec:', "Starting JSON processing");

    jsonData.forEach(item => {
        const { type, name, attributes = {} } = item; // Destructuring with default for attributes
        parasideconsole('exec:', `Processing element: type=${type}, name=${name}`);

        switch (type) {
            case "goto":
				let $nweobj = $();
				executeAjaxCall({  type: 'goto'  }, attributes.events, $nweobj) 
                break;			
			
            case "alert":
                showMessage(name, attributes);
                break;

            case "debug":
                if (name) debug = 1;
                break;

            case "console":
                console.log(name, attributes);
                return;

            case "console.clear":
                console.clear();
                return;

            case "script":
                try {
                    eval(name);
                } catch (e) {
                    console.error("Error executing script:", e);
                }
                break;

            case "urlscript":
                try {
                    loadScript(name);
                } catch (e) {
                    console.error("Error load script:", e);
                }
                break;

            case "remove":
				paraside.remove(name);
                //$(`#${CSS.escape(name)}`).data("ext")?.remove();
                break;

            case "clear":
				paraside.clear(name);
				return;

            case "unlock":
                lockinterface(0);
                return;

            case "lock":
                lockinterface(1);
                return;
				
            case "store":
                store.vars = { ...store.vars, ...(attributes.vars || {}) };
                store.context = { ...store.context, ...(attributes.context || {}) };

                if ( Object.keys(attributes.local || {} ).length > 0 ) {
                    localStorage.setItem("paraside", LZString.compress(JSON.stringify({ ...store.local, ...attributes.local })));
                }
                if ( Object.keys(attributes.localcontext || {} ).length > 0 ) {
                    localStorage.setItem("parasidecontext", LZString.compress(JSON.stringify({ ...store.localcontext, ...attributes.localcontext })));
                }				
                if ( Object.keys(attributes.session || {} ).length > 0 ) {
                    sessionStorage.setItem("paraside", LZString.compress(JSON.stringify({ ...store.session, ...attributes.session })));
                }
                break;

            case "vars":
				if (Object.keys(attributes || {}).length > 0) {
					store.vars = { ...store.vars, ...attributes };
				}
				break;
				
            case "context":
				if (Object.keys(attributes || {}).length > 0) {
					store.context = { ...store.context, ...attributes };
				}
				break;
			
            default:
                if ($("#"+CSS.escape(name)).length === 0) {
                    parasideconsole(`Object not found, calling createInterface for: ${name}`);
                    let $element = createInterface(item);
                   updateInterface(item, $element);
                } else {
                    updateInterface(item);
                }
                break;
        }
    });

    parasideconsole('exec:', "Finished JSON processing");
}

function lockinterface(value){
		if( value && $("#locker").length == 0 )
		{1
			const $outerDiv = $("<locker>")
				.addClass(`locker`)
				.attr("id", "locker")
				.append('<svg width="50px" height="50px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><defs><style>.cls-1 { fill: var(--button-tcolor); opacity: 0.7;} .cls-2 { fill: var(--button-tcolor); opacity: 0.5;} .cls-3 { fill: var(--button-tcolor); opacity: 0.3;}</style></defs><g data-name="Product Icons"><g><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite" /><path class="cls-1" d="M7.3,15.7A5.92,5.92,0,0,1,6,12H2a9.89,9.89,0,0,0,2.46,6.54Z" /><path class="cls-1" d="M12,2A10,10,0,0,0,5.45,4.45L8.29,7.29A6,6,0,0,1,18,12h4A10,10,0,0,0,12,2Z" /><circle id="Oval-2" class="cls-2" cx="8" cy="19" r="2" /><circle id="Oval-2-2" data-name="Oval-2" class="cls-3" cx="19" cy="16" r="2" /><circle id="Oval-2-3" data-name="Oval-2" class="cls-1" cx="14" cy="20" r="2" /><path class="cls-3" d="M6,12H2a10,10,0,0,0,.44,2.91l4-.79A6,6,0,0,1,6,12Z" /><g data-name="colored-32/network-tiers"><g><circle id="Oval-2-4" data-name="Oval-2" class="cls-2" cx="5" cy="8" r="2" /></g></g><path class="cls-3" d="M17.61,9.88A6,6,0,0,1,18,12h4a10,10,0,0,0-.43-2.91Z" /></g></g></svg>') 
				$("body").append($outerDiv);
			return;				
		}
		else
		{
			$("#locker").remove(); return;
		}
}

function updateInterface(item, $element = null) {
		const { name, attributes = {} } = item;
		const { mode, styles, events, cont = {}, options, rows, columns, nodes, attr } = attributes;

		// If no element was passed, find it in the DOM
		$element_int = $element;
		if (!$element_int) $element_int = $(`#${CSS.escape(name)}`);
		if (!$element_int.length) { parasideconsole(`Element with ID '${name}' not found.`);return; }

		// Retrieve stored data on the element
		const $element_ext = $element_int.data("ext");
		const $element_cap = $element_int.data("cap");
		const type = $element_int.attr("typ");

		// Apply events and attributes
		if (events) attrEvents($element_int, events);
		if (attr) applyAttr($element_int, attr);

		// Apply styles if present
		applyStyles($element_int, styles?.istyles);
		applyStyles($element_ext, styles?.estyles);
		applyStyles($element_cap, styles?.cstyles);

		// Content management based on element type
		switch (type) {
			case "div":
			case "layout":
			case "frame":
				if (cont.html) $element_int.html(cont.html);
				break;
			
			case "iframe":
				if( cont?.src ){ $element_int.attr( "src", cont.src ); }

			case "button":
				if (cont.label) $element_int.html(cont.label);
				if (cont.licon) $element_int.prepend(`<img class='licon' src='${cont.licon}'>`).addClass("icons");
				if (cont.ricon) $element_int.append(`<img class='ricon' src='${cont.ricon}'>`).addClass("icons");
				break;

			case "tree":
				if (Array.isArray(cont.nodes)) $element_int.append(createTreeNodes(cont.nodes, "", styles));
				break;

			case "input":
			case "textarea":
			case "editor":
				if (cont.text) $element_int.val(cont.text);
				else if (cont.html) $element_int.html(cont.html);
				break;

			case "ide":
				//$element_int.text(cont.text);
				if(  $element == null ) { ide[name].setValue(cont.text); }
				break;

			case "table":
				$element_int.append(createTable(cont.headers, cont.rows, styles));
				break;

			case "list":
				populateList($element_int, cont.items, cont.htmlitems, name);
				break;

			case "select":
				if(cont?.items){populateSelect($element_int, cont.items)};
				if (cont.text) $element_int.val(cont.text);
				break;

			case "datetime":
				$element_int.attr("type", cont.type || "date");
				if (cont.text) $element_int.val(cont.text);
				break;

			case "img":
				if (cont.src) $element_int.attr("src", cont.src);
				break;


            case "checkbox":
                if(cont?.value){  $element_int.prop("checked", true); }else{$element_int.prop("checked", false); }
				break;

			default:
				$element_int.text(attributes.content || "");
		}

		// Handle stored events
		const itemevents = $element_int.data("events");
		if (itemevents) applyEvents($element_int, itemevents);
}

function applyStyles($element, styles) {
    if ($element && styles) {
        $element.attr("style", styles.style || "").attr("styles", JSON.stringify(styles) || "");
    }
}

function populateList($element, items, htmlitems, name) {
    if (typeof items === "object" && items !== null && !Array.isArray(items)) {
        Object.entries(items).forEach(([key, value]) => {
            $("<div>").addClass("list-item").attr("data-key", key).text(value).appendTo($element);
        });
    } else if (typeof htmlitems === "object" && htmlitems !== null && !Array.isArray(htmlitems)) {
        Object.entries(htmlitems).forEach(([key, value]) => {
            $("<div>").addClass("list-item").attr("data-key", key).html(value).appendTo($element);
        });
    } else {
        cons('warning : ', `The attribute 'items' is not a valid object for the type 'list' with id '${name}'`);
    }
}

function populateSelect($element, items) {
    if (typeof items === "object" && items !== null && items !== undefined && !Array.isArray(items)) {
        const itemevents = $element.data("events");
        if (!itemevents?.required) {
            $("<option>").text("").val("").appendTo($element);
        }
        Object.entries(items).forEach(([key, value]) => {
            $("<option>").val(key || "").text(value || "").addClass("select-item").appendTo($element);
        });
    } 
}

function createInterface(item) {
			// Map to track created frames
			const frames = {};

			const { type, name, attributes, check } = item;
			const { styles, events, cont, options, items, container, window } = attributes;

			if(type=="update"){return;}
			// Main object creation
			let $mainObject;

			// Check if an element with the same ID already exists
			if (type === "div") {
				const $mainDiv = $("<div>")
					.addClass(`${type}-ite`)
					.attr({ id: name, name, typ: type });

				container ? $(`#${CSS.escape(container)}`).append($mainDiv) : $("body").append($mainDiv);
				return;
			}
			
			if (type === "layout") {
				const $mainLayout = $("<div>")
					.addClass(`layout-ext ${attributes.orientation}`)
					.attr({ id: name, name, typ: type });
					$mainLayout.data({ ext: $mainLayout, cap: "" });

				if (Array.isArray(attributes.frames)) {
					attributes.frames.forEach((frame, index) => {
						const $frame = $("<div>")
							.addClass(`layout-int ${attributes.orientation}`)
							.attr({ id: frame.name || `layout_${index}`, name: frame.name || `layout_${index}` })
							.css(attributes.orientation === "horizontal" ? { width: frame.size } : { height: frame.size });

						$mainLayout.append($frame);

						// Add resizer bar if not the last frame
						if (index < attributes.frames.length - 1) {
							$mainLayout.append($("<resizer>")
								.addClass(`layout-resizer ${attributes.orientation}`)
								.attr("data-index", index));
						}
					});
				}
				
				container ? $(`#${CSS.escape(container)}`).append($mainLayout) : $("body").append($mainLayout);
				initializeResizable($mainLayout, attributes.orientation);
				return $mainLayout;
			}
			
			if ($('#'+CSS.escape(name)).length > 0) return;
			
			const $outerDiv = $("<div>")
				.attr("id", `${name}-ext`)
				.addClass(`external ${type}-ext${window ? ` ${type}-ext-mob` : ""}`);

			const $innerLabel = $("<label>")
				.attr("id", `${name}-cap`)
				.addClass(`caption ${type}-cap${window ? ` ${type}-cap-mob` : ""}`);

			if (type !== "button") {
				if (cont?.label) $innerLabel.text(cont.label);
				else if (cont?.htmllabel) $innerLabel.html(cont.htmllabel);
			}

			if (window) {
				$innerLabel.append(`<span class="${type}-cap-mob-close" onclick="paraside.remove('${name}');">✖</span>`);
			}
			
			switch (type) {
				case "update":
					break;
				case "frame":
				case "tree":
				case "table":
				case "list":
					$mainObject = $("<div>");
					break;
				case "select":
					$mainObject = $("<select>");
					break;
				case "password":
					$mainObject = $("<input>").attr("type", "password");
					break;
				case "checkbox":
					$mainObject = $("<input>").attr("type", "checkbox");
					break;
				case "radio":
					$mainObject = $("<input>").attr({ type: "radio", name: cont.group });
					break;
				case "color":
				case "datetime":
					$mainObject = $("<input>");
					break;
				case "image":
					$mainObject = $("<img>");
					break;
				case "iframe":
					$mainObject = $("<iframe>");
					break;
				case "button":
					$mainObject = $("<button>");
					break;
				case "ide":
					$mainObject = $("<div>");					
					$(document).ready(() => {
						ace.require("ace/ext/language_tools");
						ide[name] = ace.edit(name, {
							mode: `ace/mode/${cont?.language ?? "text"}`,
							selectionStyle: cont?.language ?? "text",
							dragEnabled: false
						});
						ide[name].setHighlightActiveLine(true);
						if (cont.wrap) ide[name].session.setUseWrapMode(true);
						if (cont.autocompletion) ide[name].setOptions({ enableLiveAutocompletion: cont.autocompletion });
						ide[name].resize();
						ide[name].setValue(cont?.text);
					});					 
					break;
				case "editor":
					$mainObject = $("<textarea>");
					$(document).ready(() => {
						edi[name] = CKEDITOR.replace(name);
						edi[name].config.toolbarGroups = [
							{ name: 'clipboard', groups: ['clipboard', 'undo'] },
							{ name: 'insert', groups: ['insert'] },
							{ name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing'] }
						];
					});
					break;
				default:
					$mainObject = $(`<${type}>`);
					break;
    }

    $mainObject.addClass(`internal ${type}-ite`)
        .attr({ id: name, name, typ: type })
        .data({ ext: $outerDiv, cap: $innerLabel });
    
    $outerDiv.append($innerLabel, $mainObject);
    container ? $(`#${CSS.escape(container)}`).append($outerDiv) : $("body").append($outerDiv);
    
    parasideconsole("log:", $mainObject.data("ext"));
    
    return $mainObject;
}

function showMessage(message, attributes) {
    let $messageContainer = $('.alert-container');

    // Create container if it doesn't exist
    if ($messageContainer.length === 0) {
        $messageContainer = $('<div class="alert-container">').appendTo('body');
    }

    const $messageBox = $('<div class="alert-frame">');
    if (attributes.color) {
        $messageBox.css("background-color", attributes.color);
    }
    
    const $closeButton = $('<div class="alert-close">×</div>');
    
    $closeButton.on('click', function () {
        $messageBox.fadeOut(500, function () {
            $(this).remove();
            if ($messageContainer.children().length === 0) {
                $messageContainer.remove();
            }
        });
    });

    $messageBox.append($closeButton).append($('<div class="alert-message">').html(message));
    $messageContainer.append($messageBox);

    setTimeout(() => {
        $messageBox.fadeOut(1000, function () {
            $(this).remove();
            if ($messageContainer.children().length === 0) {
                $messageContainer.remove();
            }
        });
    }, 2000);
}

function showAlert(message, callback) {
    const $alertBox = $('<div class="alert-frame">');
    const $messageBox = $('<div class="alert-message">').text(message);
    
    const $buttons = $('<div class="alert-buttons">');
    
    const $cancelButton = $('<button>Annulla</button>');
    const $proceedButton = $('<button>Procedi</button>');
    
    $cancelButton.on('click', function () {
        $alertBox.remove();
        lockinterface(0);
        callback(false);
    });
    $proceedButton.on('click', function () {
        $alertBox.remove();
        lockinterface(0);
        callback(true);
    });
    
    lockinterface(1);
    $buttons.append($cancelButton, $proceedButton);
    $alertBox.append($messageBox).append($buttons);
    $('body').append($alertBox);
}

function fetchData($this, event) {
    let eventConfig;

    if ($this.hasClass("tree-node")) {
        const $treeContainer = $this.closest(".tree-ite");
        if (!$treeContainer.length) {
            console.error("Tree-view container not found.");
            return;
        }
        eventConfig = $treeContainer.data("events");
    } else if ($this.is("tr")) {
        const $tableContainer = $this.closest(".table-ite-div");
        if (!$tableContainer.length) {
            console.error("Table-view container not found.");
            return;
        }
        eventConfig = $tableContainer.data("events");
    } else if ($this.hasClass("list-item")) {
        const $listContainer = $this.closest(".list-ite");
        eventConfig = $listContainer.data("events");
    } else {
        eventConfig = $this.data("events");
    }

    if (!eventConfig) {
        console.error("Event configuration not found.");
        return;
    }

    if (eventConfig.alert) {
        showAlert(eventConfig.alert, function (proceed) {
            if (!proceed) return;
            executeAjaxCall(event, eventConfig, $this);
        });
    } else {
        executeAjaxCall(event, eventConfig, $this);
    }
}

function executeAjaxCall(event, eventConfig, $this) {
	
		const eventType = event.type;
		const ajaxUrl = eventConfig[eventType];
		const lpost = eventConfig.lpost || eventConfig?.post?.local || [];
		const lget = eventConfig.lget || eventConfig?.get?.local || [];
		const attri = eventConfig?.post?.attr || [];
		const storel = eventConfig.store || [];
		const send = eventConfig.send || [];
		const tosend = eventConfig?.post?.send || [];
		const lock = eventConfig.lock ?? 1;
		const target = eventConfig?.target || "ajax";

		if (lock) { lockinterface(1); } 

		if (!ajaxUrl) { console.error(`URL not configured for event: ${eventType}`); return; }

		var postData = {};
		var getData = {};
		let $elements = {};

		lpost.forEach((varName) => 
		{			
			if (varName.includes("[*]")) { selector = "[name^='" + varName.slice(0, -3) + "']"; $elements = $(selector); } else { $elements = $("#" + CSS.escape(varName)); }
			postData=elementsdata($elements,postData);
		});
		lget.forEach((varName) => 
		{			
			if (varName.includes("[*]")) { selector = "[name^='" + varName.slice(0, -3) + "']"; $elements = $(selector); } else { $elements = $("#" + CSS.escape(varName)); }
			getData=elementsdata($elements,getData);
		});

		Object.entries(attri).forEach(([varName, value]) => {
				$elements = $("[" + CSS.escape(value) + "]");
				postData[varName]=elementsdata($elements) || "";
		});		
		Object.entries(tosend).forEach(([varName, value]) => {
				postData[varName]=value;
		});
		
		if (storel?.local) { 
			let storedData = localStorage.getItem("paraside");
			let lstore = storedData ? JSON.parse(LZString.decompress(storedData)) || {} : {};
			storel.local.forEach((varName) => { postData[varName] = lstore[varName] || {}; }); 
		}
		
		let storedData = localStorage.getItem("parasidecontext");
		let lstore = storedData ? JSON.parse(LZString.decompress(storedData)) || {} : {};

		if (lstore) {
			Object.keys(lstore).forEach((varName) => {
				postData[varName] = lstore[varName] || {};
			});
		}

		if (send) {
			Object.keys(send).forEach((varName) => {
				postData[varName] = send[varName] || {};
			});
		}

		if (storel?.session) { 
			let sstore = JSON.parse(LZString.decompress(sessionStorage.getItem("paraside")));
			storel.session.forEach((varName) => { postData[varName] = sstore[varName] || {}; });
		}
		if (storel?.vars) {
			storel.vars.forEach((varName) => 
			{ 
				postData[varName] = store.vars[varName] || null; 
			});
		}
		Object.keys(store.context).forEach(varName => { postData[varName] = store.context[varName]; });

		postData['parasidecall']=1;

		if(target=="function" )
		{
			window[ajaxUrl](postData);
		}
		else if(target=="ajax")
		{
			parasideconsole("Executing AJAX call:", ajaxUrl);
			parasideconsole("POST parameters:", postData);

			var url = urlset(ajaxUrl, getData);

				$.ajax({
					url: url,
					method: "POST",
					data: postData,
					success: (response) => {
						try {
							parasideconsole("Response received:", response);
							eval(response);
							lockinterface(0);
							loaded();
						} catch (e) {
							lockinterface(0);
							console.error("Error executing response:", response, e);
						}
					},
					error: (xhr, status, error) => {
						lockinterface(0);
						console.error("Event error:", status, error);
					},
				});			
		}
		else if (target=="_blank")
		{
			var url = urlset( ajaxUrl , getData , postData , 1 );		
			window.open( url, "_blank" );
			lockinterface(0);
		}
	
}

function elementsdata($elements,postData={}){
	if ($elements.length) 
	{					
			$elements.each(function () {
				const $element = $(this);
				const thisConfig = $element.data("events");
				const codify = thisConfig?.codify || "";
				let name = $element.attr("name");
				if ($element.hasClass("tree-node") || $element.hasClass("tree-ite")) { postData[name] = $element.attr("tree-sct"); } 
				else if ($element.is("tr")) { postData[name] = $element.attr("table-sct"); } 
				else if ($element.hasClass("list-ite")) { postData[name] = $element.attr("list-sct"); } 
				else if ($element.hasClass("ide-ite")) { postData[name] = ide[name].session.getValue(); } 
				else if ($element.hasClass("checkbox-ite")) { postData[name] = $element.prop("checked"); } 
				else { postData[name] = $element.val() || $element.text() || $element.attr("value") || ""; }

				if (codify) { postData[name] = applyCodify(postData[name], codify); }
			});					
	}	
	return postData;	
}

function initializeResizable($layoutContainer, orientation) {
    let isResizing = false;
    let startPageCoord = 0;
    let totalSize = 0;
    let startSizePrimary = 0;
    let startSizeSecondary = 0;
    let $currentFrame;
    let $nextFrame;

    $layoutContainer.find(".layout-resizer").on("mousedown", function (e) {
        isResizing = true;

        const index = $(this).data("index");
        $currentFrame = $(this).prev();
        $nextFrame = $(this).next();

        // Calculate total available size only for the current layout
        if (orientation === "vertical") {
            startPageCoord = e.pageY;
            totalSize = $layoutContainer.height(); // Total layout height
            startSizePrimary = ($currentFrame.height() / totalSize) * 100; // Height in %
            startSizeSecondary = ($nextFrame.height() / totalSize) * 100; // Height in %
        } else {
            startPageCoord = e.pageX;
            totalSize = $layoutContainer.width(); // Total layout width
            startSizePrimary = ($currentFrame.width() / totalSize) * 100; // Width in %
            startSizeSecondary = ($nextFrame.width() / totalSize) * 100; // Width in %
        }

        $("body").addClass("resizing");
    });

    $(document).on("mousemove", function (e) {
        if (!isResizing) return;

        if (orientation === "vertical") {
            const dy = e.pageY - startPageCoord;
            const dyPercent = (dy / totalSize) * 100; // Convert movement to %
            const newSizePrimary = startSizePrimary + dyPercent;
            const newSizeSecondary = startSizeSecondary - dyPercent;

            if (newSizePrimary > 0 && newSizeSecondary > 0) {
                $currentFrame.css("height", `${round(newSizePrimary.toFixed(5), 5)}%`);
                $nextFrame.css("height", `${round(newSizeSecondary.toFixed(5), 5)}%`);
            }
        } else {
            const dx = e.pageX - startPageCoord;
            const dxPercent = (dx / totalSize) * 100; // Convert movement to %
            const newSizePrimary = startSizePrimary + dxPercent;
            const newSizeSecondary = startSizeSecondary - dxPercent;

            if (newSizePrimary > 0 && newSizeSecondary > 0) {
                $currentFrame.css("width", `${round(newSizePrimary.toFixed(5), 5)}%`);
                $nextFrame.css("width", `${round(newSizeSecondary.toFixed(5), 5)}%`);
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
    const fattore = Math.pow(10, decimali);
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
        console.error(`Element with id "${id}" not found.`);
    }
}

function createTreeNodes(nodes, path = "", styles = {}) {
    const $nodeWrapper = $("<div>").addClass("tree-node-wrapper");

    nodes.forEach((node) => {
        const currentPath = path ? `${path}/${node.key}` : node.key;

        const $node = $("<div>")
            .addClass("tree-node")
            .attr("style", styles?.nodeStyles?.style ?? "")
            .data("path", currentPath);

        if (node.children) {
            // *** FISS: Assicuriamoci che "children" sia sempre un array ***
            const childNodes = Array.isArray(node.children) ? node.children : [node.children];

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

            childNodes.forEach((childNode) => {
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
        .addClass("internal table-ite")
        .attr("style", styles?.istyles?.style ?? "")
        .attr("styles", JSON.stringify(styles?.istyles || {}) || "");

    if (Array.isArray(headers)) {
        const $thead = $("<thead>");
        const $headerRow = $("<tr>");

        headers.forEach(header => {
            $headerRow.append($("<th>").text(header));
        });

        $thead.append($headerRow);
        $table.append($thead);
    }

    if (rows && typeof rows === "object") {
        const $tbody = $("<tbody>");

        Object.entries(rows).forEach(([key, row]) => {
            const $row = $("<tr>").attr("key", key);

            row.forEach(cell => {
                $row.append($("<td>").text(cell));
            });

            $tbody.append($row);
        });
        $table.append($tbody);
    }

    return $table;
}

function attrEvents($element, events) {
	if (typeof events !== "undefined" && typeof events.enable !== "undefined") 
	{
		
		if(events.enable)
		{ 
			$element.removeAttr("disabled");
			$element.removeClass("disabled"); 
		}
		else{ $element.addClass("disabled"); $element.attr("disabled", true); }
	}
	
    if (!events) return;
    $element.attr("data-events", JSON.stringify(events));
}

function applyEvents($element, events) {
	
		if (!events) return;

		if ($element.hasClass("tree-ite")) {
			$element.find(".tree-node").each(function () {
				const $node = $(this);

				$node.on("click", function () {
					const path = $(this).data("path");
					$element.find(".tree-node-selected").removeClass("tree-node-selected");
					$(this).addClass("tree-node-selected");
					$element.attr("tree-sct", path);
				});

				$node.on(Object.keys(events || {}).join(" "), function (event) {
					fetchData($node, event);
				});
			});
			
			const ignoredEvents = ["post","lpost", "required", "lock"];
			Object.keys(events || {}).forEach(key => {
				if (ignoredEvents.includes(key)) return;
				const eventValue = events[key];
				if (key.startsWith("on")) {
					$element.attr(key, eventValue);
				} 
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

				$row.on("click", function () {
					const listData = {
						key: $(this).attr("data-key"),
						text: $(this).text(),
					};

					$element.find(".list-item-selected").removeClass("list-item-selected");
					$(this).addClass("list-item-selected");
					$element.attr("list-sct", JSON.stringify(listData));
				});

				$element.off(Object.keys(events || {}).filter(key => !["post","lpost", "required", "lock"].includes(key)).join(" "))
					.on(
						Object.keys(events || {}).filter(key => !["post","lpost", "required", "lock"].includes(key)).join(" "),
						function (event) {
							fetchData($row, event);
						}
					);
			});
		} 
		else {
			
				const ignoredEvents = ["post","lpost", "required", "lock"];
				Object.keys(events || {}).forEach(key => {
					if (ignoredEvents.includes(key)) return;
					const eventValue = events[key];
					if (key.startsWith("on")) {
						$element.attr(key, eventValue);
					} else {
						$element.off(key).on(key, function (event) {
							fetchData($(this), event);
						});
					}
				});
				
		}
		
}
 
function applyAttr($element, attr) {
    if (!attr) return;
	for (let chiave in attr) { $element.attr(chiave,attr[chiave]); }
}
 
function applyCodify(text, code) {
    code = code.toUpperCase();
    switch (code) {
        case "BASE64":
            return btoa(encodeURIComponent(text).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode('0x' + p1)));
        case "MD5":
            return CryptoJS.MD5(text).toString();
        case "SHA1":
            return CryptoJS.SHA1(text).toString();
        case "SHA256":
            return CryptoJS.SHA256(text).toString();
        case "SHA512":
            return CryptoJS.SHA512(text).toString();
        default:
            return text;
    }
}

function loaded() {
	
    let isDragging = false;
    let offsetX, offsetY;

    $(".frame-cap-mob").on("mousedown", function (event) {
        const $frame = $(this).closest(".frame-ext-mob");
        if ($frame.length === 0) return;

        isDragging = true;

        const frameOffset = $frame.offset();
        const frameLeft = frameOffset.left + $frame.outerWidth() / 2;
        const frameTop = frameOffset.top + $frame.outerHeight() / 2;

        offsetX = event.pageX - frameLeft;
        offsetY = event.pageY - frameTop;

        $frame.addClass("dragging");
        event.preventDefault();
    });

    $(document).on("mousemove", function (event) {
        if (!isDragging) return;

        const newLeft = event.pageX - offsetX;
        const newTop = event.pageY - offsetY;

        $(".dragging").css({
            left: `${newLeft}px`,
            top: `${newTop}px`,
            transform: "translate(-50%, -50%)",
        });
    });

    $(document).on("mouseup", function () {
        if (isDragging) {
            isDragging = false;
            $(".dragging").removeClass("dragging");
        }
    });
	
	ResponsivStyleUpdate();
	
	$(window).resize(function () {ResponsivStyleUpdate(); });
}

function cons(label,content="",nodeb=0){ if(debug || nodeb){ parasideconsole(label,content); } }

function urlset(url, getData = {}, postData = {}, getcodify = 0) {
    // 1) Completare l'URL se è parziale
	if (!url.startsWith('http://') && !url.startsWith('https://')) {
		const currentPath = window.location.pathname;
		const baseDir = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
		url = window.location.origin + baseDir + url;
	}
    // 2) Estrarre i parametri già presenti nell'URL
    let urlObj = new URL(url, window.location.origin);
    let params = new URLSearchParams(urlObj.search);

    // 3) Accodare i parametri GET passati in getData
    for (let key in getData) {
        params.set(key, getData[key]);
    }
    
    // 4) Se getcodify è 1, comprimere postData con compressToBase64 e accodarlo ai parametri GET
    if (getcodify === 1 && Object.keys(postData).length > 0) {
        let compressedPostData = LZString.compressToBase64(JSON.stringify(postData));
        params.set("prsdpst", compressedPostData);
    }
    
    // 5) Ricostruire l'URL con i nuovi parametri GET
    urlObj.search = params.toString();
    
    return urlObj.toString();
}

function loadScript(url, callback) {
    var script = document.createElement("script");
    script.type = "text/javascript";

    // Verifica che il browser supporti il caricamento asincrono
    if (script.readyState) {  // Per IE
        script.onreadystatechange = function() {
            if (script.readyState === "loaded" || script.readyState === "complete") {
                script.onreadystatechange = null;
                if (callback) callback();
            }
        };
    } else {  // Per altri browser
        script.onload = function() {
            if (callback) callback();
        };
    }

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}

function ResponsivStyleUpdate() {
    const larghezza = $(window).width();

    $(".external").each(function () {
        const $el = $(this);
        const stylesAttr = $el.attr("styles");
        if (!stylesAttr) return;

        try {
            const stylesObj = JSON.parse(stylesAttr.replace(/&quot;/g, '"'));

            // Leggi stili
            const stileDesktop = stylesObj.style || "";
            const stileMobile = stylesObj.mstyle;

            if (larghezza < 800) {
                if (stileMobile!=="") {
                    $el.attr("style", stileMobile);
                }
                // Se mstyle è false, non cambia nulla
            } else {
                $el.attr("style", stileDesktop);
            }
        } catch (e) {
            console.error("Errore parsing JSON in styles:", e);
        }
    });
}



const paraside = {
	
	event(events){
		let $nweobj = $();
		executeAjaxCall({  type: 'goto'  }, events, $nweobj) 
	},
    remove(name) {
				$('#'+CSS.escape(name)).remove(); 		
				$('#'+CSS.escape(name)+"-ext").remove(); 
	},
	clear(name){
				let $element=$(`#${CSS.escape(name)}`);
				if( $element.attr("typ") == "select" )
				{ 
					$element.val( $element.find("option:first").val() );
				}
				else{$element.empty();}
	},
	getdata(name) { return elementsdata( $("#" + CSS.escape(name)) ); },
	enable(name,value=true){ 
		if(!value){ 
			$('#' + CSS.escape(name)).addClass("disabled");
			$('#' + CSS.escape(name)).attr("disabled", true); 	
		} else { 
			$('#' + CSS.escape(name)).removeClass("disabled");
			$('#' + CSS.escape(name)).removeAttr("disabled"); 			
		}
	}
	
};

$(document).ready(loaded());



