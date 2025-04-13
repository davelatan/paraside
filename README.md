// Make sure to include the parasite.js library in your project
// <script src="parasite.js"></script>

$(document).ready(function () {
    // Definition of the JSON data to create the interface
    const jsonData = [
        {
            type: "div",
            name: "container1",
            attributes: {
                styles: { istyles: { style: "border: 2px solid black; padding: 10px; width: 300px; height: 200px;" } },
                cont: { html: "This is a main container" },
            },
        },
        {
            type: "button",
            name: "myButton",
            attributes: {
                styles: { istyles: { style: "background-color: blue; color: white; padding: 10px;" } },
                cont: { label: "Click me!" },
                events: {
                    click: () => alert("Button clicked!"),
                },
            },
        },
        {
            type: "list",
            name: "myList",
            attributes: {
                styles: { istyles: { style: "margin-top: 10px;" } },
                cont: { items: { item1: "Item 1", item2: "Item 2", item3: "Item 3" } },
                events: {
                    click: (event) => console.log(`Selected item: ${$(event.target).text()}`),
                },
            },
        },
    ];

    // Interface creation using the library function
    createInterface(jsonData);
});
