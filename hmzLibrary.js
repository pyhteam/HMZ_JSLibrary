// Generactor Table: hmz_library
(function (global) {


    //#region   private methods
    /*
     * @param {object} data
     * @param {array} colums
         colums = [
             {
                 id: 1,
                 field: "field",
                 name: "name",
                 type: "text"
             }
         ]
     * @return {object} table
     * @description generate table by data and colums
     * @example
     * 
     **/
    function createTable(data, colums, configs) {
        var config = {
            id: configs.id || "hmzDataTable",
            class: configs.class || "table table-striped table-bordered table-hover",
            showAction: {
                edit: configs.showAction.edit || false,
                delete: configs.showAction.delete || false,
                view: configs.showAction.view || false
            },
            buttons: configs.buttons || []
        }
        let html = document.getElementById("hmzTable");
        let table = document.createElement("table");
        table.setAttribute("class", config.class);
        table.setAttribute("id", config.id);
        let thead = document.createElement("thead");
        // check showAction
        if (config.showAction) {
            colums = [
                ...colums,
                {
                    id: colums.length + 1,
                    field: "action",
                    name: "action",
                    type: "html"
                }
            ]
        }
        // buttons 
        // Example data buttons
        // const buttonsDefault = [
        //     {
        //         id: "BTN_EDIT",
        //         name: "Edit",
        //         class: "btn btn-primary btn-sm",
        //         icon: "fa fa-edit",
        //         event: function () {
        //             console.log("Edit");
        //         },
        //     },
        //     {
        //         id: "BTN_DELETE",
        //         name: "Delete",
        //         class: "btn btn-danger btn-sm",
        //         icon: "fa fa-trash",
        //         event: function () {
        //             console.log("Delete");
        //         }
        //     }
        // ];

        // generate thead by colums
        colums.forEach(element => {
            let th = document.createElement("th");
            // toUpperCase first letter
            th.innerHTML = element.name.charAt(0).toUpperCase() + element.name.slice(1);
            th.setAttribute("data-field", element.field);
            th.setAttribute("id", element.id);
            thead.appendChild(th);
        });
        table.appendChild(thead);
        // generate tbody by data
        let tbody = document.createElement("tbody");
        data.forEach(element => {
            let tr = document.createElement("tr");
            colums.forEach(colum => {
                // check property in data has in colums
                if (colum.field in element) {

                    let td = document.createElement("td");
                    td.innerHTML = element[colum.field];
                    tr.appendChild(td);
                }
                // check showAction
                if (config.showAction) {
                    // match to colums field = action
                    if (colum.field == "action") {
                        // generate buttons > 0
                        let btns = createButtonsTable(config.buttons, element.id);
                        let td = document.createElement("td");
                        td.appendChild(btns);
                        tr.appendChild(td);
                    }
                }

            });
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);

        html.appendChild(table);
        return html;
    }
    function createButtonsTable(buttons,id) {
        if (buttons.length > 0) {
            let btns = document.createElement("div");
            btns.setAttribute("style", "display: flex; justify-content: space-between;");
            buttons.forEach(button => {
                let btn = document.createElement("button");
                btn.setAttribute("id", button.id+"_"+ id);
                btn.setAttribute("class", button.class);
                btn.setAttribute("type", "button");
                btn.setAttribute("data-id", id);
                btn.innerHTML = `<i class="${button.icon}"></i> ${button.text}`;
                btn.addEventListener("click", button.event);
                btns.appendChild(btn);
            });
            return btns
            
        }
    }
    // Example POST method implementation:
    /* let data = HMZ.httpClient(API_URL, "GET")
        .then(function (res) {
            console.log(res);
        })
        .catch(function (error) {
            console.error("Error:", error);
    }); */
    function hmzHttpClient(url, method, data) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open(method, url);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.responseType = 'json';
            xhr.onload = () => resolve(xhr.responseType === 'json' ? xhr.response : xhr.responseText);
            xhr.onerror = () => reject(xhr.statusText);
            xhr.send(data);
        });
    }
    //#endregion

    //#region   public methods
    var HMZ = {
        httpClient: hmzHttpClient,
        createTable: createTable
    };
    global.HMZ = HMZ;
    //#endregion
})(window);