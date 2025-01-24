// Assicurati di includere la libreria parasite.js nel tuo progetto
// <script src="parasite.js"></script>

$(document).ready(function () {
    // Definizione dei dati JSON per creare l'interfaccia
    const jsonData = [
        {
            type: "div",
            name: "container1",
            attributes: {
                styles: { istyles: { style: "border: 2px solid black; padding: 10px; width: 300px; height: 200px;" } },
                cont: { html: "Questo è un contenitore principale" },
            },
        },
        {
            type: "button",
            name: "myButton",
            attributes: {
                styles: { istyles: { style: "background-color: blue; color: white; padding: 10px;" } },
                cont: { label: "Cliccami!" },
                events: {
                    click: () => alert("Bottone cliccato!"),
                },
            },
        },
        {
            type: "list",
            name: "myList",
            attributes: {
                styles: { istyles: { style: "margin-top: 10px;" } },
                cont: { items: { item1: "Elemento 1", item2: "Elemento 2", item3: "Elemento 3" } },
                events: {
                    click: (event) => console.log(`Elemento selezionato: ${$(event.target).text()}`),
                },
            },
        },
    ];

    // Creazione dell'interfaccia utilizzando la funzione della libreria
    createInterface(jsonData);
});
