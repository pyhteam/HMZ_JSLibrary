// Generactor Table: hmz_library
(function (global) {


    //#region   private methods Table  and Pagination
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
    function createTable(data, colums, configs, pageginateConfig = null) {
        var config = {
            id: configs.id || "hmzDataTable",
            class: configs.class || "table table-striped table-bordered table-hover",
            showAction: {
                edit: configs.showAction.edit || false,
                delete: configs.showAction.delete || false,
                view: configs.showAction.view || false
            },
            buttons: configs.buttons || [],
            paginate: configs.paginate || false
        }

        /**
         * @param {object} pageginateConfig
         * @param {number} pageginateConfig.pageIndex
         * @param {number} pageginateConfig.pageSize
         * @param {number} pageginateConfig.totalItems
         * @param {function} pageginateConfig.eventPage
         * @return {object} pageConfig
         * @description generate pageConfig
         * @example
         * 
         */
        var pageConfig = {
            pageIndex: pageginateConfig.pageIndex || 1,
            pageSize: pageginateConfig.pageSize || 10,
            totalItems: pageginateConfig.totalItems || 0,
            event: pageginateConfig.event || null,
            apiUrl: pageginateConfig.apiUrl || null,
            method: pageginateConfig.method || "GET",
        }

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
        let html = document.getElementById("hmzTable");
        let table = document.createElement("table");
        table.setAttribute("class", config.class);
        table.setAttribute("id", config.id);
        let thead = document.createElement("thead");
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
        let hmzTbody = createTBodyTable(data, colums, config);
        table.appendChild(hmzTbody);

        html.appendChild(table);
        // check paginate
        if (config.paginate == true && pageConfig) {
            let paginate = createPagination(pageConfig)
            html.appendChild(paginate);
        }
        return html;
    }


    function createTBodyTable(data, colums, config) {
        // check exist colums action
        if(config.showAction){
            if(colums.filter(x => x.field == "action").length == 0){
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
        }
        let tbody = document.createElement("tbody");
        tbody.setAttribute("id", "hmzTableBody");
        data.forEach(item => {
            let tr = document.createElement("tr");
            colums.forEach(colum => {
                // check property in data has in colums
                if (colum.field in item) {

                    let td = document.createElement("td");
                    td.innerHTML = item[colum.field];
                    tr.appendChild(td);
                }
                // check showAction
                if (config.showAction) {
                    // match to colums field = action
                    if (colum.field == "action") {
                        // generate buttons > 0
                        let btns = createButtonsTable(config.buttons, item.id);
                        let td = document.createElement("td");
                        td.appendChild(btns);
                        tr.appendChild(td);
                    }
                    
                }
                

            });
            tbody.appendChild(tr);
        });
        return tbody;
    }
    function createButtonsTable(buttons, id) {
        if (buttons.length > 0) {
            let btns = document.createElement("div");
            buttons.forEach(button => {
                let btn = document.createElement("button");
                btn.setAttribute("id", button.id + "_" + id);
                btn.setAttribute("class", button.class);
                btn.setAttribute("style", "margin-left: 5px;");
                btn.setAttribute("type", "button");
                btn.setAttribute("data-id", id);
                btn.innerHTML = `<i class="${button.icon}"></i> ${button.text}`;
                btn.addEventListener("click", button.event);
                btns.appendChild(btn);
            });
            return btns
        }
    }

    // My object
    // let pageConfig = {
    //     pageIndex: 1,
    //     pageSize: 10,
    //     totalItems: 0,
    //     event: function () {

    //     }
    // }
    function createPagination(config) {
        // Create the nav element
        var nav = document.createElement("nav");
        nav.setAttribute("aria-label", "Page navigation example");

        // Create the pagination ul element
        var pagination = document.createElement("ul");
        pagination.setAttribute("class", "pagination pagination-sm");

        // Calculate the total number of pages
        var totalPages = Math.ceil(config.totalItems / config.pageSize);

        // Check if it's the first page
        var isFirstPage = config.pageIndex === 1;

        // Check if it's the last page
        var isLastPage = config.pageIndex === totalPages;

        // Create the previous button
        var liPrevious = document.createElement("li");
        liPrevious.setAttribute("class", "page-item");
        if (isFirstPage) {
            liPrevious.classList.add("disabled");
        }
        var aPrevious = document.createElement("a");
        aPrevious.setAttribute("class", "page-link");
        aPrevious.setAttribute("id", "previous");
        aPrevious.setAttribute("href", "#");
        aPrevious.setAttribute("aria-label", "Previous");
        var spanPrevious = document.createElement("span");
        spanPrevious.setAttribute("aria-hidden", "true");
        spanPrevious.textContent = "Previous";
        aPrevious.appendChild(spanPrevious);
        liPrevious.appendChild(aPrevious);
        pagination.appendChild(liPrevious);

        // Create the page buttons
        for (var i = 1; i <= totalPages; i++) {
            var liPage = document.createElement("li");
            liPage.setAttribute("class", "page-item");
            liPage.setAttribute("id", ""+i);
            if (i === config.pageIndex) {
                liPage.classList.add("active");
            }
            var aPage = document.createElement("a");
            aPage.setAttribute("class", "page-link");
            aPage.setAttribute("href", "#");
            aPage.setAttribute("id", ""+i);
            aPage.textContent = i;
            liPage.appendChild(aPage);
            pagination.appendChild(liPage);
        }

        // Create the next button
        var liNext = document.createElement("li");
        liNext.setAttribute("class", "page-item");
        if (isLastPage) {
            liNext.classList.add("disabled");
        }
        var aNext = document.createElement("a");
        aNext.setAttribute("class", "page-link");
        aNext.setAttribute("href", "#");
        aNext.setAttribute("aria-label", "Next");
        aNext.setAttribute("id", "next");
        var spanNext = document.createElement("span");
        spanNext.setAttribute("aria-hidden", "true");
        spanNext.textContent = "Next";
        aNext.appendChild(spanNext);
        liNext.appendChild(aNext);
        pagination.appendChild(liNext);

        nav.appendChild(pagination);

        // Add click event listeners to the page buttons
        var pageLinks = pagination.querySelectorAll(".page-link");

        pageLinks.forEach(function (pageLink) {
            pageLink.addEventListener("click", function (event) {
                event.preventDefault();

                // Get the id of the clicked page link
                var id = this.id;

                // Check if the clicked page is the previous or next button
                if (id === "previous") {
                    // Handle previous page
                    var currentPage = pagination.querySelector(".page-item.active");
                    var prevPage = currentPage.previousElementSibling;

                    if (prevPage && !prevPage.classList.contains("disabled")) {
                        var pageIndex = parseInt(prevPage.id);
                        config.event(pageIndex);

                        // Update UI and activate the new page
                        currentPage.classList.remove("active");
                        prevPage.classList.add("active");

                        // Disable or enable Previous and Next buttons
                        liPrevious.classList.toggle("disabled", pageIndex === 1);
                        liNext.classList.remove("disabled");
                    }
                } else if (id === "next") {
                    // Handle next page
                    var currentPage = pagination.querySelector(".page-item.active");
                    var nextPage = currentPage.nextElementSibling;

                    if (nextPage && !nextPage.classList.contains("disabled")) {
                        var pageIndex = parseInt(nextPage.id);
                        config.event(pageIndex);

                        // Update UI and activate the new page
                        currentPage.classList.remove("active");
                        nextPage.classList.add("active");

                        // Disable or enable Previous and Next buttons
                        liPrevious.classList.remove("disabled");
                        liNext.classList.toggle("disabled", pageIndex === totalPages);
                    }
                } else {
                    
                    // Handle regular page click
                    var clickedPageIndex = parseInt(this.id);
                    

                    if (!this.parentNode.classList.contains("active")) {
                        config.event(clickedPageIndex);

                        // Update UI and activate the new page
                        var activePageItem = pagination.querySelector(".page-item.active");
                        activePageItem.classList.remove("active");
                        this.parentNode.classList.add("active");

                        // Disable or enable Previous and Next buttons
                        liPrevious.classList.toggle("disabled", clickedPageIndex === 1);
                        liNext.classList.toggle("disabled", clickedPageIndex === totalPages);
                    }
                }
            });
        });
        return nav;
    }
    // #endregion


    // #region   Methods module Modal
    function createModal(config) {
        const modalConfig = {
            title: config.title || "Modal title",
            body: config.body || "Modal body",
            footer: config.footer || "Modal footer",
            buttons: config.buttons || [
                {
                    id: "close",
                    text: "Close",
                    class: "btn btn-secondary",
                    icon: "fas fa-times",
                    handler: function () {
                        console.log("Close button clicked");
                    }
                },
                {
                    id: "save",
                    text: "Save changes",
                    class: "btn btn-primary",
                    icon: "fas fa-save",
                    handler: function () {
                        console.log("Save button clicked");
                    }

                }
            ]
        }
    }


    // #endregion



    // Example POST method implementation:
    /* let data = HMZ.httpClient(API_URL, "GET",{ username: 'example' }})
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
        createTable: createTable,
        createTBodyTable: createTBodyTable,
        
    };
    global.HMZ = HMZ;
    //#endregion
})(window);