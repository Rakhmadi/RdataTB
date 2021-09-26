"use strict";
/**
 *
 *
 * By Rakhmadi (c) 2021
 * Under the MIT License.
 *
 *
 */
class RdataTB {
    constructor(IdTable, Options = { RenderJSON: null,
        ShowSearch: true,
        ShowSelect: true,
        ShowPaginate: true,
        SelectionNumber: [5, 10, 20, 50],
        HideColumn: [],
        ShowHighlight: false,
        fixedTable: false,
        sortAnimate: true,
        ShowTfoot: true,
        ExcludeColumnExport: [] }) {
        var _a, _b, _c, _d;
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
        this.ExcludeColumnExport = [];
        this.TableElement = document.getElementById(IdTable);
        this.Options = Options;
        this.detectTyped();
        this.StyleS();
        this.ConvertToJson();
        this.paginateRender();
        this.Control();
        this.search();
        this.RenderToHTML();
        this.PaginateUpdate();
        if (Options.RenderJSON != null && Options.hasOwnProperty('RenderJSON')) {
            this.JSONinit(Options.RenderJSON);
        }
        if (!Options.ShowSelect && Options.hasOwnProperty('ShowSelect')) {
            (_a = document.getElementById('my-select')) === null || _a === void 0 ? void 0 : _a.remove();
        }
        this.ShowHighlight = Options === null || Options === void 0 ? void 0 : Options.ShowHighlight;
        if (Options.fixedTable && Options.hasOwnProperty('fixedTable')) {
            (_b = this.TableElement) === null || _b === void 0 ? void 0 : _b.classList.add("table_layout_fixed");
        }
        else {
            (_c = this.TableElement) === null || _c === void 0 ? void 0 : _c.classList.remove("table_layout_fixed");
        }
        if (!Options.ShowSearch && Options.hasOwnProperty('ShowSearch')) {
            (_d = document.getElementById('SearchControl')) === null || _d === void 0 ? void 0 : _d.remove();
        }
        if (Options.HideColumn != null && Options.hasOwnProperty('HideColumn')) {
            this.ListHiding = Options.HideColumn;
            this.DoHide();
        }
        if (Options.SelectionNumber != null && Options.hasOwnProperty('SelectionNumber')) {
            this.SelectionNumber = Options.SelectionNumber;
            this.ChangeSelect();
        }
        this.totalPages = this.Divide().length;
    }
    detectTyped() {
        var _a;
        const getHead = (_a = this.TableElement) === null || _a === void 0 ? void 0 : _a.getElementsByTagName('th');
        for (let z = 0; z < getHead.length; z++) {
            if (getHead[z].attributes['type-date']) {
                this.listTypeDate.push({
                    HeaderIndex: z,
                    dateVal: true
                });
            }
        }
    }
    StyleS() {
        const style = document.createElement('style');
        style.innerHTML = `
        .table_layout_fixed { 
            table-layout:fixed;
        }
        table > thead{
            -webkit-user-select: none;  
            -moz-user-select: none;    
            -ms-user-select: none;      
            user-select: none;
        }
        .pagination a {
          color: black;
          float: left;
          padding: 8px 12px;
          text-decoration: none;
          transition: background-color .3s;
          font-size:12px;
        }
        .tablesorter-header-asc::after {
            content: '\\2191';
            top: calc(50% - 0.75em);
            float: right;
        }
        .tablesorter-header-desc::after {
            content: '\\2193';
            top: calc(50% - 0.75em);
            float: right;
        }
        .pagination a:hover:not(.active) {background-color: #ddd;}
        .blink_me {
            animation: blinker 1s;
          }
          @keyframes blinker {
            50% {
              opacity: .5;
            }
          } 
          `;
        document.getElementsByTagName('head')[0].appendChild(style);
    }
    ChangeSelect() {
        this.SelectElementString = '';
        for (let x = 0; x < this.SelectionNumber.length; x++) {
            this.SelectElementString += `<option value="${this.SelectionNumber[x]}">${this.SelectionNumber[x]}</option>`;
        }
        let ElSelect = document.getElementById("my-select");
        if (ElSelect) {
            ElSelect.innerHTML = this.SelectElementString;
        }
        return this.SelectElementString;
    }
    Control() {
        const span1 = document.createElement('span');
        span1.innerHTML = `
        <table id="C" border="0" style="width:100%;margin-bottom:12px;">
        <tr>
          <td style="width:100%;">
             <select id="my-select" class="form-select shadow-none" style="float:left;width:99px!important;margin-right:10px;">
             <option value="5">5</option><option value="10">10</option><option value="20">20</option><option value="50">50</option>
             </select>
             <input id="SearchControl" class="form-control shadow-none" placeholder="Search" type="text" style="width:30%;margin-left:10px">
          </td>
        </tr>
      </table>
        `;
        span1.className = 'Selc';
        this.TableElement.parentNode.insertBefore(span1, this.TableElement);
        this.TableElement.style.width = '100%';
        const ChangeV = (params) => {
            this.PageSize = params;
            this.i = 0;
            this.RenderToHTML();
        };
        let selectEl = document.getElementById('my-select');
        selectEl === null || selectEl === void 0 ? void 0 : selectEl.addEventListener('change', function () {
            ChangeV(this.value);
        });
        document.getElementById('x__NEXT__X').onclick = () => {
            this.nextItem();
            this.highlight(this.searchValue);
            this.DoHide();
        };
        document.getElementById('x__PREV__X').onclick = () => {
            this.prevItem();
            this.highlight(this.searchValue);
            this.DoHide();
        };
    }
    nextItem() {
        this.i = this.i + 1; // increase i by one
        this.i = this.i % this.Divide().length; // if we've gone too high, start from `0` again
        this.COntrolDataArr = this.Divide()[this.i]; // give us back the item of where we are now
        this.RenderToHTML(this.COntrolDataArr);
        this.PageNow = this.i + 1;
    }
    prevItem() {
        if (this.i === 0) { // i would become 0
            this.i = this.Divide().length; // so put it at the other end of the array
        }
        this.i = this.i - 1; // decrease by one
        this.PageNow = this.i + 1;
        this.COntrolDataArr = this.Divide()[this.i]; // give us back the item of where we are now
        this.RenderToHTML(this.COntrolDataArr);
    }
    paginateRender() {
        const k = ` <div class="pagination" id="pgN"><a id="x__PREV__X" style="cursor:pointer;user-select: none;">&laquo;</a><div id="PF"></div><a id="x__NEXT__X" style="cursor:pointer;user-select: none;">&raquo;</a></div>`;
        const span = document.createElement('span');
        span.innerHTML = k;
        span.className = 'asterisk';
        this.TableElement.parentNode.insertBefore(span, this.TableElement.nextSibling);
    }
    PaginateUpdate() {
        if (document.getElementById('PF') != null) {
            document.getElementById('PF').innerHTML = `
            <a style="">Page ${this.i + 1} to ${this.Divide().length} of ${(this.DataTable === undefined) ? 0 : this.DataTable.length} Entries</a>`;
        }
    }
    search() {
        var _a;
        this.DataSearch = this.DataTable;
        (_a = document.getElementById('SearchControl')) === null || _a === void 0 ? void 0 : _a.addEventListener('input', (evt) => {
            this.searchValue = evt.target.value;
            this.DataTable = this.DataSearch.filter((element) => {
                for (let index = 0; index < this.HeaderDataTable.length; index++) {
                    const fg = element[this.HeaderDataTable[index]].toString().toLowerCase().includes(evt.target.value.toLowerCase());
                    if (fg) {
                        return fg;
                    }
                }
            });
            this.RenderToHTML();
            this.i = 0;
            this.PaginateUpdate();
            this.highlight(evt.target.value);
        });
    }
    ConvertToJson() {
        var _a, _b, _c;
        //get Header
        const getHead = (_a = this.TableElement) === null || _a === void 0 ? void 0 : _a.getElementsByTagName('th');
        for (let v = 0; v < getHead.length; v++) {
            (_b = this.HeaderDataTable) === null || _b === void 0 ? void 0 : _b.push(getHead[v].textContent);
        }
        //get row data
        const getbody = (_c = this.TableElement) === null || _c === void 0 ? void 0 : _c.getElementsByTagName('tbody');
        for (let row = 0; row < ((getbody[0] === undefined) ? 0 : getbody[0].rows.length); row++) {
            const cellsD = [];
            for (let cellsIndex = 0; cellsIndex < getbody[0].rows[row].cells.length; cellsIndex++) {
                cellsD.push(getbody[0].rows[row].cells[cellsIndex].innerHTML);
            }
            this.RowDataTable.push(cellsD);
        }
        // to key value Json
        this.DataTable = this.RowDataTable.reduce((akumulasi, e) => {
            akumulasi.push(this.HeaderDataTable.reduce((x, y, i) => {
                x[y] = e[i];
                return x;
            }, {}));
            return akumulasi;
        }, []);
        this.DataTableRaw = this.DataTable;
        return this.DataTable;
    }
    Divide() {
        const gh = [];
        const h = (typeof this.PageSize === "string") ? parseInt(this.PageSize) : this.PageSize;
        for (let i = 0; i < ((this.DataTable === undefined) ? 0 : this.DataTable.length); i += h) {
            gh.push(this.DataTable.slice(i, i + h));
        }
        return gh;
    }
    RenderToHTML(SlecTloaf = null) {
        //clear 
        this.TableElement.innerHTML = '';
        // check if is sorted
        const CheckIFSorted = (this.DataSorted === null || this.DataSorted === [] || this.DataSorted === undefined) ?
            this.Divide()[0]
            : this.Divide()[0];
        this.DataToRender = CheckIFSorted;
        // HeaderDataTable To Element
        let header = '';
        let footer = '';
        for (let I = 0; I < this.HeaderDataTable.length; I++) {
            header += `<th style="cursor: pointer;" id="${this.HeaderDataTable[I]}_header" class="columns tablesorter-header">${this.HeaderDataTable[I]}</th>\n`;
            footer += `<th style="cursor: pointer;" id="${this.HeaderDataTable[I]}_footer" class="columns tablesorter-header">${this.HeaderDataTable[I]}</th>\n`;
        }
        // RowDataTable To Element
        const ifUndefinded = (this.DataToRender === undefined) ? 0 : this.DataToRender.length;
        let row = '';
        if (SlecTloaf === null) {
            for (let ___row = 0; ___row < ifUndefinded; ___row++) {
                let ToCell = '';
                for (let ___cell = 0; ___cell < this.HeaderDataTable.length; ___cell++) {
                    ToCell += `<td class="${this.HeaderDataTable[___cell]}__row">${this.DataToRender[___row][this.HeaderDataTable[___cell]]}</td>\n`;
                }
                row += `<tr>${ToCell}</tr>\n`;
            }
        }
        else {
            for (let ___row = 0; ___row < SlecTloaf.length; ___row++) {
                let ToCell = '';
                for (let ___cell = 0; ___cell < this.HeaderDataTable.length; ___cell++) {
                    ToCell += `<td class="${this.HeaderDataTable[___cell]}__row">${SlecTloaf[___row][this.HeaderDataTable[___cell]]}</td>\n`;
                }
                row += `<tr>${ToCell}</tr>\n`;
            }
            this.DataToRender = SlecTloaf;
        }
        // ====
        let ToEl = `<thead><tr>${header}</tr></thead><tbody>${row}</tbody>`;
        if (this.Options.ShowTfoot) {
            ToEl += `<tfoot>${footer}</tfoot>`;
        }
        this.TableElement.innerHTML = ToEl;
        for (let n = 0; n < this.HeaderDataTable.length; n++) {
            const cv = document.getElementById(`${this.HeaderDataTable[n]}_header`);
            document.getElementById(`${this.HeaderDataTable[n]}_header`).style.opacity = '100%';
            cv.onclick = () => {
                this.sort(this.HeaderDataTable[n]);
                let GetElsHeaderList = document.getElementById(`${this.HeaderDataTable[n]}_header`);
                document.getElementById(`${this.HeaderDataTable[n]}_header`).style.opacity = '60%';
                if (this.Assc) {
                    GetElsHeaderList.classList.remove('tablesorter-header-asc');
                    GetElsHeaderList.classList.add('tablesorter-header-desc');
                }
                else {
                    GetElsHeaderList.classList.remove('tablesorter-header-desc');
                    GetElsHeaderList.classList.add('tablesorter-header-asc');
                }
                //animate
                if (this.Options.sortAnimate) {
                    const s = document.getElementsByClassName(`${this.HeaderDataTable[n]}__row`);
                    for (let NN = 0; NN < s.length; NN++) {
                        setTimeout(() => s[NN].classList.add('blink_me'), 21 * NN);
                    }
                }
            };
        }
        this.PaginateUpdate();
        this.DoHide();
    }
    /**
     *
     * @param column name column to sort
     * @returns show data shorted
     */
    sort(column) {
        const t0 = performance.now();
        function naturalCompare(a, b) {
            const ax = [];
            const bx = [];
            a.toString().replace(/(^\$|,)/g, '').replace(/(\d+)|(\D+)/g, function (_, $1, $2) { ax.push([$1 || Infinity, $2 || ""]); });
            b.toString().replace(/(^\$|,)/g, '').replace(/(\d+)|(\D+)/g, function (_, $1, $2) { bx.push([$1 || Infinity, $2 || ""]); });
            for (let index = 0; ax.length && bx.length; index++) {
                const an = ax.shift();
                const bn = bx.shift();
                const nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
                if (nn)
                    return nn;
            }
            return ax.length - bx.length;
        }
        const IndexHead = this.HeaderDataTable.indexOf(column);
        const listDated = this.listTypeDate.find(x => x.HeaderIndex === IndexHead);
        const isDate = (listDated === null || listDated === void 0 ? void 0 : listDated.HeaderIndex) === IndexHead;
        const data = this.DataTable;
        if (this.Assc) {
            this.Assc = !this.Assc;
            if (!isDate) {
                data.sort((a, b) => {
                    return naturalCompare(a[column], b[column]);
                });
            }
            else {
                data.sort((a, b) => {
                    return Date.parse(a[column]) - Date.parse(b[column]);
                });
            }
        }
        else {
            this.Assc = !this.Assc;
            if (!isDate) {
                data.sort((a, b) => {
                    return naturalCompare(b[column], a[column]);
                });
            }
            else {
                data.sort((a, b) => {
                    return Date.parse(b[column]) - Date.parse(a[column]);
                });
            }
        }
        this.DataSorted = data;
        this.i = 0;
        this.RenderToHTML();
        const t1 = performance.now();
        this.timeSort = Math.round((t1 - t0) / 1000 * 10000) / 10000;
        return this.DataSorted;
    }
    MExcludeColumnExport() {
        let DataTable = JSON.parse(JSON.stringify(this.DataTable));
        let exlude = this.Options.ExcludeColumnExport;
        let head = [...this.HeaderDataTable];
        for (let x = 0; x < exlude.length; x++) {
            let indexHead = head.indexOf(exlude[x]);
            if (indexHead > -1) {
                head.splice(indexHead, 1);
            }
        }
        for (let x = 0; x < DataTable.length; x++) {
            for (let n = 0; n < exlude.length; n++) {
                delete DataTable[x][exlude[n]];
            }
        }
        return {
            "header": head,
            "data": DataTable
        };
    }
    /**
     *
     * @param filename filename to download default is Export
     *
     */
    DownloadCSV(filename = 'Export') {
        let data = this.MExcludeColumnExport();
        let str = '';
        let hed = data.header.toString();
        str = hed + '\r\n';
        for (let i = 0; i < data.data.length; i++) {
            let line = '';
            for (const index in data.data[i]) {
                if (line != '')
                    line += ',';
                line += data.data[i][index];
            }
            str += line + '\r\n';
        }
        const element = document.createElement('a');
        element.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(str);
        element.target = '_blank';
        element.download = filename + '.csv';
        element.click();
    }
    /**
     *
     * @param filename filename to download default is Export
     *
     */
    DownloadJSON(filename = 'Export') {
        let data = this.MExcludeColumnExport();
        const element = document.createElement('a');
        element.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data.data));
        element.target = '_blank';
        element.download = filename + '.json';
        element.click();
    }
    /**
     *
     * @param text for highlighting text in table
     *
     */
    highlight(text) {
        var _a;
        if (this.ShowHighlight) {
            const getbody = (_a = this.TableElement) === null || _a === void 0 ? void 0 : _a.getElementsByTagName('tbody');
            for (let row = 0; row < getbody[0].rows.length; row++) {
                for (let cellsIndex = 0; cellsIndex < getbody[0].rows[row].cells.length; cellsIndex++) {
                    let innerHTML = getbody[0].rows[row].cells[cellsIndex].innerHTML;
                    const index = innerHTML.indexOf(text);
                    if (index >= 0) {
                        innerHTML = innerHTML.substring(0, index) + "<span style='background-color: yellow;'>" + innerHTML.substring(index, index + text.length) + "</span>" + innerHTML.substring(index + text.length);
                        getbody[0].rows[row].cells[cellsIndex].innerHTML = innerHTML;
                        getbody[0].rows[row].cells[cellsIndex].classList.add(`${this.HeaderDataTable[cellsIndex].replace(/\s/g, '_')}__row`);
                    }
                }
            }
        }
    }
    /**
     *
     * @param PayLoad you json data to table
     *
     */
    JSONinit(PayLoad = []) {
        this.HeaderDataTable = [];
        for (const key in PayLoad[0]) {
            this.HeaderDataTable.push(key);
        }
        this.DataTable = PayLoad;
        this.DataSearch = PayLoad;
        this.RenderToHTML();
    }
    HideCol(column) {
        const Classes = document.getElementsByClassName(`${column}__row`);
        for (let O = 0; O < Classes.length; O++) {
            Classes[O].style.display = "none";
        }
        let ColmnHeader = document.getElementById(`${column}_header`);
        let ColmnFotter = document.getElementById(`${column}_footer`);
        if (ColmnHeader) {
            ColmnHeader.style.display = "none";
            if (ColmnFotter) {
                ColmnFotter.style.display = "none";
            }
        }
    }
    ShowCol(column) {
        const Classes = document.getElementsByClassName(`${column}__row`);
        for (let O = 0; O < Classes.length; O++) {
            Classes[O].style.display = "";
        }
        let ColmnHeader = document.getElementById(`${column}_header`);
        let ColmnFotter = document.getElementById(`${column}_footer`);
        if (ColmnHeader) {
            ColmnHeader.style.display = "";
            if (ColmnFotter) {
                ColmnFotter.style.display = "";
            }
        }
    }
    DoHide() {
        const GetHeadArr = this.HeaderDataTable;
        const ListOftrutc = [];
        for (let T = 0; T < this.HeaderDataTable.length; T++) {
            ListOftrutc.push(true);
        }
        for (let O = 0; O < this.ListHiding.length; O++) {
            const Index = GetHeadArr.indexOf(this.ListHiding[O]);
            if (Index > -1) {
                ListOftrutc[Index] = false;
            }
        }
        const IndexTrue = [];
        const IndexFalse = [];
        for (let U = 0; U < ListOftrutc.length; U++) {
            if (ListOftrutc[U]) {
                IndexTrue.push(U);
            }
            if (!ListOftrutc[U]) {
                IndexFalse.push(U);
            }
        }
        for (let V = 0; V < IndexTrue.length; V++) {
            this.ShowCol(GetHeadArr[IndexTrue[V]]);
        }
        for (let F = 0; F < IndexFalse.length; F++) {
            this.HideCol(GetHeadArr[IndexFalse[F]]);
        }
    }
}
