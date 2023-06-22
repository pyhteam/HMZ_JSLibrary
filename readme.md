## How to use

---

1. Add file srcipt
   ` <script src="./hmzLibrary.js"></script>`

2. Example call api to table
```javascript
document.addEventListener("DOMContentLoaded", function(event) {
    const colums = [

        {
            id: 2,
            field: "id",
            name: "id",
            type: "number"
        },
        {
            id: 3,
            field: "title",
            name: "title",
            type: "text"
        }

    ]
    getData(colums);
});
// colums
function getData(colums) {
    // Get Data
    let API_URL = "https://jsonplaceholder.typicode.com/posts";
    const configs = {
        id: "hmzDatatable",
        class: "table table-striped table-hover",
        showAction: {
            edit: true,
            delete: true,
            view: true
        },
        paginate: true,
        buttons: [{
                id: "btnEdit",
                class: "btn btn-primary",
                text: "Edit",
                icon: "bi-pencil-square",
                event: function(data) {
                    // get data-id
                    let id = data.srcElement.dataset.id;
                    alert(id);
                }
            },
            {
                id: "btnDelete",
                class: "btn btn-danger",
                text: "Delete",
                icon: "bi-trash",
                event: function(data) {
                    let id = data.srcElement.dataset.id;
                    alert(id);
                }
            },
            {
                id: "btnView",
                class: "btn btn-success",
                text: "View",
                icon: "bi-eye",
                event: function(data) {
                    let id = data.srcElement.dataset.id;
                    alert(id);
                }
            }
        ]

    }
    let pageConfig = {
        pageIndex: 1,
        pageSize: 10,
        totalItems: 0,
        method: "GET",
        event: function() {

        }
    }
    let data = HMZ.httpClient(API_URL, "GET")
        .then(function(res) {
            if (res.length > 0) {
                // slip data 10 item
                let nextData = res ? res.slice(0, 10) : [];

                let configPage = {
                    ...pageConfig,
                    totalItems: res.length,
                    event: function(pageIndex) {
                        console.log(pageIndex);
                        nextData = res.slice((pageIndex - 1) _ 10, pageIndex _ 10);
                        // clear table
                        let hmzTableBody = document.getElementById("hmzTableBody");

                        let bodyTable = HMZ.createTBodyTable(nextData, colums, configs);
                        hmzTableBody.innerHTML = "";
                        hmzTableBody.replaceWith(bodyTable);

                    }
                }
                HMZ.createTable(nextData, colums, configs, configPage);

            }
        })
        .catch(function(error) {
            console.error("Error:", error);
        });
}
```

3. Run and test
