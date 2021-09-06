
"use strict";
var exports = {};

Object.defineProperty(exports, "__esModule", { value: true });
var RdataTB = /** @class */ (function () {
    /**
     *
     * @param IdTable Id tabble
     * @param Options Options
     *
     */
    function RdataTB(IdTable, Options) {
        if (Options === void 0) { Options = { RenderJSON: null,
            ShowSearch: true,
            ShowSelect: true,
            ShowPaginate: true,
            SelectionNumber: [5, 10, 20, 50],
            HideColumn: [],
            ShowHighlight: false,
            fixedTable: false,
            sortAnimate: true }; }
        var _a, _b, _c, _d, _e, _f;
        this.HeaderDataTable = []; // header table to array
        this.RowDataTable = []; // get Table to json
        this.DataTable = [];
        this.DataSorted = [];
        this.DataToRender = [];
        this.PageSize = 5;
        this.Assc = false;
        this.DataSearch = [];
        this.i = 0;
        this.COntrolDataArr = [];
        this.DataTableRaw = [];
        this.searchValue = '';
        this.ListHiding = [];
        this.SelectionNumber = [5, 10, 20, 50];
        this.SelectElementString = '';
        this.ShowHighlight = false;
        this.listTypeDate = [];
        this.PageNow = 1;
        this.TableElement = document.getElementById(IdTable);
        this.detectTyped();
        this.StyleS();
        this.ConvertToJson();
        this.paginateRender();
        this.Control();
        this.search();
        this.RenderToHTML();
        this.PaginateUpdate();
        this.Options = Options;
        if (Options.RenderJSON != null) {
            this.JSONinit(Options.RenderJSON);
        }
        if (Options.ShowSelect != true) {
            if (Options.ShowSelect != null || Options.ShowSelect === false) {
                (_a = document.getElementById('my-select')) === null || _a === void 0 ? void 0 : _a.remove();
            }
        }
        if (Options.ShowSelect != true) {
            if (Options.ShowSelect != null || Options.ShowSelect === false) {
                (_b = document.getElementById('my-select')) === null || _b === void 0 ? void 0 : _b.remove();
            }
        }
        if (Options.ShowHighlight != false) {
            if (Options.ShowHighlight != null || Options.ShowHighlight === true) {
                this.ShowHighlight = true;
            }
        }
        if (Options.fixedTable != false) {
            if (Options.fixedTable != null || Options.fixedTable === true) {
                (_c = this.TableElement) === null || _c === void 0 ? void 0 : _c.classList.add("table_layout_fixed");
            }
            else {
                (_d = this.TableElement) === null || _d === void 0 ? void 0 : _d.classList.remove("table_layout_fixed");
            }
        }
        else {
            (_e = this.TableElement) === null || _e === void 0 ? void 0 : _e.classList.add("table_layout_fixed");
        }
        if (Options.ShowSearch != true) {
            if (Options.ShowSearch != null || Options.ShowSearch === false) {
                (_f = document.getElementById('SearchControl')) === null || _f === void 0 ? void 0 : _f.remove();
            }
        }
        if (Options.HideColumn != null) {
            this.ListHiding = Options.HideColumn;
            this.DoHide();
        }
        if (Options.SelectionNumber != null) {
            this.SelectionNumber = Options.SelectionNumber;
            this.ChangeSelect();
        }
        this.totalPages = this.Divide().length;
    }
    RdataTB.prototype.detectTyped = function () {
        var _a;
        var getHead = (_a = this.TableElement) === null || _a === void 0 ? void 0 : _a.getElementsByTagName('th');
        for (var z = 0; z < getHead.length; z++) {
            if (getHead[z].attributes['type-date']) {
                this.listTypeDate.push({
                    HeaderIndex: z,
                    dateVal: true
                });
            }
        }
    };
    RdataTB.prototype.StyleS = function () {
        var style = document.createElement('style');
        style.innerHTML = "\n        .table_layout_fixed { \n            table-layout:fixed;\n        }\n        table > thead{\n            -webkit-user-select: none;  \n            -moz-user-select: none;    \n            -ms-user-select: none;      \n            user-select: none;\n        }\n        .pagination a {\n          color: black;\n          float: left;\n          padding: 8px 12px;\n          text-decoration: none;\n          transition: background-color .3s;\n          font-size:12px;\n        }\n        .tablesorter-header-asc::after {\n            content: '\\2191';\n            top: calc(50% - 0.75em);\n            float: right;\n        }\n        .tablesorter-header-desc::after {\n            content: '\\2193';\n            top: calc(50% - 0.75em);\n            float: right;\n        }\n        .pagination a:hover:not(.active) {background-color: #ddd;}\n        .blink_me {\n            animation: blinker 1s;\n          }\n          @keyframes blinker {\n            50% {\n              opacity: .5;\n            }\n          } \n          ";
        document.getElementsByTagName('head')[0].appendChild(style);
    };
    RdataTB.prototype.ChangeSelect = function () {
        this.SelectElementString = '';
        for (var x = 0; x < this.SelectionNumber.length; x++) {
            this.SelectElementString += "<option value=\"" + this.SelectionNumber[x] + "\">" + this.SelectionNumber[x] + "</option>";
        }
        document.getElementById("my-select").innerHTML = this.SelectElementString;
        return this.SelectElementString;
    };
    RdataTB.prototype.Control = function () {
        var _this = this;
        var span1 = document.createElement('span');
        span1.innerHTML = "\n        <table id=\"C\" border=\"0\" style=\"width:100%;margin-bottom:12px;\">\n        <tr>\n          <td style=\"width:100%;\">\n             <select id=\"my-select\" class=\"form-select shadow-none\" style=\"float:left;width:99px!important;margin-right:10px;\">\n             <option value=\"5\">5</option><option value=\"10\">10</option><option value=\"20\">20</option><option value=\"50\">50</option>\n             </select>\n             <input id=\"SearchControl\" class=\"form-control shadow-none\" placeholder=\"Search\" type=\"text\" style=\"width:30%;margin-left:10px\">\n          </td>\n        </tr>\n      </table>\n        ";
        span1.className = 'Selc';
        this.TableElement.parentNode.insertBefore(span1, this.TableElement);
        this.TableElement.style.width = '100%';
        var ChangeV = function (params) {
            _this.PageSize = params;
            _this.i = 0;
            _this.RenderToHTML();
        };
        var selectEl = document.getElementById('my-select');
        selectEl === null || selectEl === void 0 ? void 0 : selectEl.addEventListener('change', function () {
            ChangeV(this.value);
        });
        document.getElementById('x__NEXT__X').onclick = function () {
            _this.nextItem();
            _this.highlight(_this.searchValue);
            _this.DoHide();
        };
        document.getElementById('x__PREV__X').onclick = function () {
            _this.prevItem();
            _this.highlight(_this.searchValue);
            _this.DoHide();
        };
    };
    RdataTB.prototype.nextItem = function () {
        this.i = this.i + 1; // increase i by one
        this.i = this.i % this.Divide().length; // if we've gone too high, start from `0` again
        this.COntrolDataArr = this.Divide()[this.i]; // give us back the item of where we are now
        this.RenderToHTML(this.COntrolDataArr);
        this.PageNow = this.i + 1;
    };
    RdataTB.prototype.prevItem = function () {
        if (this.i === 0) { // i would become 0
            this.i = this.Divide().length; // so put it at the other end of the array
        }
        this.i = this.i - 1; // decrease by one
        this.PageNow = this.i + 1;
        this.COntrolDataArr = this.Divide()[this.i]; // give us back the item of where we are now
        this.RenderToHTML(this.COntrolDataArr);
    };
    RdataTB.prototype.paginateRender = function () {
        var k = " <div class=\"pagination\" id=\"pgN\"><a id=\"x__PREV__X\" style=\"cursor:pointer;user-select: none;\">&laquo;</a><div id=\"PF\"></div><a id=\"x__NEXT__X\" style=\"cursor:pointer;user-select: none;\">&raquo;</a></div>";
        var span = document.createElement('span');
        span.innerHTML = k;
        span.className = 'asterisk';
        this.TableElement.parentNode.insertBefore(span, this.TableElement.nextSibling);
    };
    RdataTB.prototype.PaginateUpdate = function () {
        if (document.getElementById('PF') != null) {
            document.getElementById('PF').innerHTML = "\n            <a style=\"\">Page " + (this.i + 1) + " to " + this.Divide().length + " of " + ((this.DataTable === undefined) ? 0 : this.DataTable.length) + " Entries</a>";
        }
    };
    RdataTB.prototype.search = function () {
        var _this = this;
        var _a;
        this.DataSearch = this.DataTable;
        (_a = document.getElementById('SearchControl')) === null || _a === void 0 ? void 0 : _a.addEventListener('input', function (evt) {
            _this.searchValue = evt.target.value;
            _this.DataTable = _this.DataSearch.filter(function (element) {
                for (var index = 0; index < _this.HeaderDataTable.length; index++) {
                    var fg = element[_this.HeaderDataTable[index]].toString().toLowerCase().includes(evt.target.value.toLowerCase());
                    if (fg) {
                        return fg;
                    }
                }
            });
            _this.RenderToHTML();
            _this.i = 0;
            _this.PaginateUpdate();
            _this.highlight(evt.target.value);
        });
    };
    RdataTB.prototype.ConvertToJson = function () {
        var _this = this;
        var _a, _b, _c;
        //get Header
        var getHead = (_a = this.TableElement) === null || _a === void 0 ? void 0 : _a.getElementsByTagName('th');
        for (var v = 0; v < getHead.length; v++) {
            (_b = this.HeaderDataTable) === null || _b === void 0 ? void 0 : _b.push(getHead[v].textContent);
        }
        //get row data
        var getbody = (_c = this.TableElement) === null || _c === void 0 ? void 0 : _c.getElementsByTagName('tbody');
        for (var row = 0; row < ((getbody[0] === undefined) ? 0 : getbody[0].rows.length); row++) {
            var cellsD = [];
            for (var cellsIndex = 0; cellsIndex < getbody[0].rows[row].cells.length; cellsIndex++) {
                cellsD.push(getbody[0].rows[row].cells[cellsIndex].innerHTML);
            }
            this.RowDataTable.push(cellsD);
        }
        // to key value Json
        this.DataTable = this.RowDataTable.reduce(function (akumulasi, e) {
            akumulasi.push(_this.HeaderDataTable.reduce(function (x, y, i) {
                x[y] = e[i];
                return x;
            }, {}));
            return akumulasi;
        }, []);
        this.DataTableRaw = this.DataTable;
        return this.DataTable;
    };
    RdataTB.prototype.Divide = function () {
        var gh = [];
        var h = (typeof this.PageSize === "string") ? parseInt(this.PageSize) : this.PageSize;
        for (var i = 0; i < ((this.DataTable === undefined) ? 0 : this.DataTable.length); i += h) {
            gh.push(this.DataTable.slice(i, i + h));
        }
        return gh;
    };
    RdataTB.prototype.RenderToHTML = function (SlecTloaf) {
        var _this = this;
        if (SlecTloaf === void 0) { SlecTloaf = null; }
        //clear 
        this.TableElement.innerHTML = '';
        // check if is sorted
        var CheckIFSorted = (this.DataSorted === null || this.DataSorted === [] || this.DataSorted === undefined) ?
            this.Divide()[0]
            : this.Divide()[0];
        this.DataToRender = CheckIFSorted;
        // HeaderDataTable To Element
        var header = '';
        var footer = '';
        for (var I = 0; I < this.HeaderDataTable.length; I++) {
            header += "<th style=\"cursor: pointer;\" id=\"" + this.HeaderDataTable[I] + "_header\" class=\"columns tablesorter-header\">" + this.HeaderDataTable[I] + "</th>\n";
            footer += "<th style=\"cursor: pointer;\" id=\"" + this.HeaderDataTable[I] + "_footer\" class=\"columns tablesorter-header\">" + this.HeaderDataTable[I] + "</th>\n";
        }
        // RowDataTable To Element
        var ifUndefinded = (this.DataToRender === undefined) ? 0 : this.DataToRender.length;
        var row = '';
        if (SlecTloaf === null) {
            for (var ___row = 0; ___row < ifUndefinded; ___row++) {
                var ToCell = '';
                for (var ___cell = 0; ___cell < this.HeaderDataTable.length; ___cell++) {
                    ToCell += "<td class=\"" + this.HeaderDataTable[___cell] + "__row\">" + this.DataToRender[___row][this.HeaderDataTable[___cell]] + "</td>\n";
                }
                row += "<tr>" + ToCell + "</tr>\n";
            }
        }
        else {
            for (var ___row = 0; ___row < SlecTloaf.length; ___row++) {
                var ToCell = '';
                for (var ___cell = 0; ___cell < this.HeaderDataTable.length; ___cell++) {
                    ToCell += "<td class=\"" + this.HeaderDataTable[___cell] + "__row\">" + SlecTloaf[___row][this.HeaderDataTable[___cell]] + "</td>\n";
                }
                row += "<tr>" + ToCell + "</tr>\n";
            }
            this.DataToRender = SlecTloaf;
        }
        // ====
        var ToEl = "<thead><tr>" + header + "</tr></thead><tbody>" + row + "</tbody><tfoot>" + footer + "</tfoot>";
        this.TableElement.innerHTML = ToEl;
        var _loop_1 = function (n) {
            var cv = document.getElementById(this_1.HeaderDataTable[n] + "_header");
            document.getElementById(this_1.HeaderDataTable[n] + "_header").style.opacity = '100%';
            cv.onclick = function () {
                _this.sort(_this.HeaderDataTable[n]);
                document.getElementById(_this.HeaderDataTable[n] + "_header").style.opacity = '60%';
                if (_this.Assc) {
                    document.getElementById(_this.HeaderDataTable[n] + "_header").classList.remove('tablesorter-header-asc');
                    document.getElementById(_this.HeaderDataTable[n] + "_header").classList.add('tablesorter-header-desc');
                }
                else {
                    document.getElementById(_this.HeaderDataTable[n] + "_header").classList.remove('tablesorter-header-desc');
                    document.getElementById(_this.HeaderDataTable[n] + "_header").classList.add('tablesorter-header-asc');
                }
                //animate
                if (_this.Options.sortAnimate || !undefined) {
                    var s_1 = document.getElementsByClassName(_this.HeaderDataTable[n] + "__row");
                    var _loop_2 = function (NN) {
                        setTimeout(function () { return s_1[NN].classList.add('blink_me'); }, 21 * NN);
                    };
                    for (var NN = 0; NN < s_1.length; NN++) {
                        _loop_2(NN);
                    }
                }
            };
        };
        var this_1 = this;
        for (var n = 0; n < this.HeaderDataTable.length; n++) {
            _loop_1(n);
        }
        this.PaginateUpdate();
        this.DoHide();
    };
    /**
     *
     * @param column name column to sort
     * @returns show data shorted
     */
    RdataTB.prototype.sort = function (column) {
        var t0 = performance.now();
        function naturalCompare(a, b) {
            var ax = [];
            var bx = [];
            a.toString().replace(/(^\$|,)/g, '').replace(/(\d+)|(\D+)/g, function (_, $1, $2) { ax.push([$1 || Infinity, $2 || ""]); });
            b.toString().replace(/(^\$|,)/g, '').replace(/(\d+)|(\D+)/g, function (_, $1, $2) { bx.push([$1 || Infinity, $2 || ""]); });
            for (var index = 0; ax.length && bx.length; index++) {
                var an = ax.shift();
                var bn = bx.shift();
                var nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
                if (nn)
                    return nn;
            }
            return ax.length - bx.length;
        }
        var IndexHead = this.HeaderDataTable.indexOf(column);
        var listDated = this.listTypeDate.find(function (x) { return x.HeaderIndex === IndexHead; });
        var isDate = (listDated === null || listDated === void 0 ? void 0 : listDated.HeaderIndex) === IndexHead;
        var data = this.DataTable;
        if (this.Assc) {
            this.Assc = !this.Assc;
            if (!isDate) {
                data.sort(function (a, b) {
                    return naturalCompare(a[column], b[column]);
                });
            }
            else {
                data.sort(function (a, b) {
                    return Date.parse(a[column]) - Date.parse(b[column]);
                });
            }
        }
        else {
            this.Assc = !this.Assc;
            if (!isDate) {
                data.sort(function (a, b) {
                    return naturalCompare(b[column], a[column]);
                });
            }
            else {
                data.sort(function (a, b) {
                    return Date.parse(b[column]) - Date.parse(a[column]);
                });
            }
        }
        this.DataSorted = data;
        this.i = 0;
        this.RenderToHTML();
        var t1 = performance.now();
        this.timeSort = Math.round((t1 - t0) / 1000 * 10000) / 10000;
        return this.DataSorted;
    };
    /**
     *
     * @param filename filename to download default is Export
     *
     */
    RdataTB.prototype.DownloadCSV = function (filename) {
        if (filename === void 0) { filename = 'Export'; }
        var str = '';
        var hed = this.HeaderDataTable.toString();
        str = hed + '\r\n';
        for (var i = 0; i < this.DataTable.length; i++) {
            var line = '';
            for (var index in this.DataTable[i]) {
                if (line != '')
                    line += ',';
                line += this.DataTable[i][index];
            }
            str += line + '\r\n';
        }
        var element = document.createElement('a');
        element.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(str);
        element.target = '_blank';
        element.download = filename + '.csv';
        element.click();
    };
    /**
     *
     * @param filename filename to download default is Export
     *
     */
    RdataTB.prototype.DownloadJSON = function (filename) {
        if (filename === void 0) { filename = 'Export'; }
        var element = document.createElement('a');
        element.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.DataTable));
        element.target = '_blank';
        element.download = filename + '.json';
        element.click();
    };
    /**
     *
     * @param text for highlighting text in table
     *
     */
    RdataTB.prototype.highlight = function (text) {
        var _a;
        if (this.ShowHighlight) {
            var getbody = (_a = this.TableElement) === null || _a === void 0 ? void 0 : _a.getElementsByTagName('tbody');
            for (var row = 0; row < getbody[0].rows.length; row++) {
                for (var cellsIndex = 0; cellsIndex < getbody[0].rows[row].cells.length; cellsIndex++) {
                    var innerHTML = getbody[0].rows[row].cells[cellsIndex].innerHTML;
                    var index = innerHTML.indexOf(text);
                    if (index >= 0) {
                        innerHTML = innerHTML.substring(0, index) + "<span style='background-color: yellow;'>" + innerHTML.substring(index, index + text.length) + "</span>" + innerHTML.substring(index + text.length);
                        getbody[0].rows[row].cells[cellsIndex].innerHTML = innerHTML;
                        getbody[0].rows[row].cells[cellsIndex].classList.add(this.HeaderDataTable[cellsIndex].replace(/\s/g, '_') + "__row");
                    }
                }
            }
        }
    };
    /**
     *
     * @param PayLoad you json data to table
     *
     */
    RdataTB.prototype.JSONinit = function (PayLoad) {
        if (PayLoad === void 0) { PayLoad = []; }
        this.HeaderDataTable = [];
        for (var key in PayLoad[0]) {
            this.HeaderDataTable.push(key);
        }
        this.DataTable = PayLoad;
        this.DataSearch = PayLoad;
        this.RenderToHTML();
    };
    RdataTB.prototype.HideCol = function (column) {
        var Classes = document.getElementsByClassName(column + "__row");
        for (var O = 0; O < Classes.length; O++) {
            Classes[O].style.display = "none";
        }
        if (document.getElementById(column + "_header")) {
            document.getElementById(column + "_header").style.display = "none";
            document.getElementById(column + "_footer").style.display = "none";
        }
    };
    RdataTB.prototype.ShowCol = function (column) {
        var Classes = document.getElementsByClassName(column + "__row");
        for (var O = 0; O < Classes.length; O++) {
            Classes[O].style.display = "";
        }
        if (document.getElementById(column + "_header")) {
            document.getElementById(column + "_header").style.display = "";
            document.getElementById(column + "_footer").style.display = "";
        }
    };
    RdataTB.prototype.DoHide = function () {
        var GetHeadArr = this.HeaderDataTable;
        var ListOftrutc = [];
        for (var T = 0; T < this.HeaderDataTable.length; T++) {
            ListOftrutc.push(true);
        }
        for (var O = 0; O < this.ListHiding.length; O++) {
            var Index = GetHeadArr.indexOf(this.ListHiding[O]);
            if (Index > -1) {
                ListOftrutc[Index] = false;
            }
        }
        var IndexTrue = [];
        var IndexFalse = [];
        for (var U = 0; U < ListOftrutc.length; U++) {
            if (ListOftrutc[U]) {
                IndexTrue.push(U);
            }
            if (!ListOftrutc[U]) {
                IndexFalse.push(U);
            }
        }
        for (var V = 0; V < IndexTrue.length; V++) {
            this.ShowCol(GetHeadArr[IndexTrue[V]]);
        }
        for (var F = 0; F < IndexFalse.length; F++) {
            this.HideCol(GetHeadArr[IndexFalse[F]]);
        }
    };
    return RdataTB;
}());
exports.default = RdataTB;
