const names = [{"id": 103, "order": 3, "firstName": "Mark", "lastName": "Otto"}, {"id": 101, "order": 4, "firstName": "Jacob", "lastName": "Thorton"}, {"id": 102, "order": 1, "firstName": "Josh", "lastName": "Jones"}, {"id": 104, "order": 2, "firstName": "Carl", "lastName": "Fox"}];

var orderedNames = names;

// populate the table
function populateTable() {
    $("#table_items").html('');
    for (let index = 0; index < orderedNames.length; index++) {
        let element = orderedNames[index];
        $("#table_items").append(`<tr><td class="my-handle">:::</td><th><input class="order form-control form-control-sm" type="text" value="${element.order}"></th><td>${element.firstName}</td><td>${element.lastName}</td><td class="id">${element.id}</td></tr>`);
        // use this to make order text editable
        $(".order").attr('contentEditable',true);
    }
}

// using sortable plugin for drag-and-drop functionality
var el = document.getElementById('table_items');
var sortable = Sortable.create(el, {
    // use this so that only the handle is dragable
    handle: ".my-handle"
});

// update order value to reflect visual order on the page
// after drag-and-drop
function dragUpdateOrder() {
    let currentOrder = [];
    $("#table_items tr .id").each(function() {
        currentOrder.push(parseInt($(this).text()));
    });


    for (let index = 0; index < orderedNames.length; index++) {
        let element = orderedNames[index];
        let newOrder = (currentOrder.indexOf(element.id) + 1);
        element.order = newOrder;
    }

    bubbleSortByOrder(orderedNames);
    populateTable();
};

function textUpdateOrder() {
    // TODO:
    // add a way to tell which element was just changed
    // to know to push it ahead of the old element with
    // the same order
    let orderObjects = [];
    $("#table_items tr").each(function() {
        let order = ($(this).find(".order")[0].value);
        let id = parseInt($(this).find(".id").text());
        let newObject = { "order": order, "id": id };
        orderObjects.push(newObject);
    });
    bubbleSortByOrder(orderObjects);

    let orderInt = []
    orderObjects.forEach(element => {
        orderInt.push(element.id);   
    });

    for (let index = 0; index < orderedNames.length; index++) {
        let element = orderedNames[index];
        let newOrder = (orderInt.indexOf(element.id) + 1);
        element.order = newOrder;
    }

    bubbleSortByOrder(orderedNames);
    populateTable();
}


// bubble sort by order property
function bubbleSortByOrder(array) {
    
    // swap function helper
    function swap(array, i, j) {
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    var swapped;
    do {
        swapped = false;
        for(var i = 0; i < array.length; i++) {
            try {
                if(array[i].order && array[(i + 1)].order && array[i].order > array[(i + 1)].order) {
                    swap(array, i, i + 1);
                    swapped = true;
                }
            } 
            catch (error) { }
        }
    } while(swapped);
    return array;
}

// slows down the call of my update function to give document
// a quick moment to catch up
function slowUpdate(){
    setTimeout(function() { dragUpdateOrder() }, 100);
};

function keyPressed(k) {
    if (k.code == 'Enter')
        textUpdateOrder();
    return false;
}

bubbleSortByOrder(orderedNames);
populateTable();

// calls update when item is dropped or touch ends
document.addEventListener("drop", slowUpdate);
document.addEventListener("touchend", textUpdateOrder);
document.addEventListener("keypress", keyPressed);