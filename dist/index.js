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
    /**
     *
     * @param IdTable Id tabble
     *
     * @param Options Options
     */
    constructor(IdTable, Options = { RenderJSON: null, ShowSearch: true, ShowSelect: true, ShowPaginate: true }) {
        this.HeaderDataTable = []; // header table to array
        this.RowDataTable = []; // get Table to json
        this.PageSize = 5;
        this.NumSelectedPage = 0;
        this.Assc = false;
        this.i = 0;
        this.searchValue = '';
        this.ListHiding = [];
        this.TableElement = document.getElementById(IdTable);
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
    }
    StyleS() {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
        table { 
            table-layout:fixed;
        }
        table > thead{
            -webkit-user-select: none;  
            -moz-user-select: none;    
            -ms-user-select: none;      
            user-select: none;
        }
        /* Pagination links */
        .pagination a {
          color: black;
          float: left;
          padding: 8px 12px;
          text-decoration: none;
          transition: background-color .3s;
          font-size:12px;
        }
        
        /* Style the active/current link */
        .pagination a.active {
          background-color: dodgerblue;
          color: white;
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
        /* Add a grey background color on mouse-over */
        .pagination a:hover:not(.active) {background-color: #ddd;}`;
        document.getElementsByTagName('head')[0].appendChild(style);
    }
    Control() {
        let span1 = document.createElement('span');
        span1.innerHTML = `
        <table border="0" style="width:100%;margin-bottom:12px;">
        <tr>
          <td style="width:100%;">
             <select id="my-select" class="form-select" style="float:left;width:99px!important;margin-right:10px;">
             <option value="5">5</option>
             <option value="10">10</option>
             <option value="15">15</option>
             <option value="20">20</option>
             <option value="25">25</option>
             <option value="100">100</option>
             </select>
             <input class="form-control shadow-none" placeholder="Search" type="text" id="SEARCH____X" style="width:30%;margin-left:10px">
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
        document.getElementById('my-select').addEventListener('change', function () {
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
        this.i = this.i % this.Divide(this.DataTable).length; // if we've gone too high, start from `0` again
        this.COntrolDataArr = this.Divide(this.DataTable)[this.i]; // give us back the item of where we are now
        return this.RenderToHTML(this.COntrolDataArr);
    }
    prevItem() {
        if (this.i === 0) { // i would become 0
            this.i = this.Divide(this.DataTable).length; // so put it at the other end of the array
        }
        this.i = this.i - 1; // decrease by one
        this.COntrolDataArr = this.Divide(this.DataTable)[this.i]; // give us back the item of where we are now
        return this.RenderToHTML(this.COntrolDataArr);
    }
    paginateRender() {
        let innerP = '';
        for (let z = 0; z < Math.floor((this.DataTable === undefined) ? 0 : this.DataTable.length / this.PageSize); z++) {
            innerP += `<a id="P__X__${z + 1}" style="cursor:pointer;">${z + 1}</a>\n`;
        }
        let k = ` <div class="pagination" id="pgN">
        <a id="x__PREV__X" style="cursor:pointer;user-select: none;">&laquo;</a>
           <div id="PF">
                ${innerP}
           </div>
        <a id="x__NEXT__X" style="cursor:pointer;user-select: none;">&raquo;</a>
        </div>
        `;
        let span = document.createElement('span');
        span.innerHTML = k;
        span.className = 'asterisk';
        this.TableElement.parentNode.insertBefore(span, this.TableElement.nextSibling);
    }
    PaginateUpdate() {
        document.getElementById('PF').innerHTML = `
            <a style="">Page ${this.i + 1} to ${this.Divide(this.DataTable).length} of ${(this.DataTable === undefined) ? 0 : this.DataTable.length} Entries</a>`;
    }
    search() {
        this.DataSearch = this.DataTable;
        document.getElementById('SEARCH____X')?.addEventListener('input', (evt) => {
            this.searchValue = evt.target.value;
            this.DataTable = this.DataSearch.filter((element) => {
                for (let index = 0; index < this.HeaderDataTable.length; index++) {
                    let fg = element[this.HeaderDataTable[index]].toString().toLowerCase().includes(evt.target.value.toLowerCase());
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
        //get Header
        let getHead = this.TableElement?.getElementsByTagName('th');
        for (let v = 0; v < getHead.length; v++) {
            this.HeaderDataTable?.push(getHead[v].textContent);
        }
        //get row data
        let getbody = this.TableElement?.getElementsByTagName('tbody');
        for (let row = 0; row < ((getbody[0] === undefined) ? 0 : getbody[0].rows.length); row++) {
            let cellsD = [];
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
    Divide(data) {
        let gh = [];
        let h = (typeof this.PageSize === "string") ? parseInt(this.PageSize) : this.PageSize;
        for (var i = 0; i < ((this.DataTable === undefined) ? 0 : this.DataTable.length); i += h) {
            gh.push(this.DataTable.slice(i, i + h));
        }
        return gh;
    }
    RenderToHTML(SlecTloaf = null) {
        //clear 
        this.TableElement.innerHTML = '';
        // check if is sorted
        let CheckIFSorted = (this.DataSorted === null || this.DataSorted === [] || this.DataSorted === undefined) ?
            this.Divide(this.DataTable)[this.NumSelectedPage]
            : this.Divide(this.DataSorted)[this.NumSelectedPage];
        this.DataToRender = CheckIFSorted;
        // HeaderDataTable To Element
        let header = '';
        let footer = '';
        for (let I = 0; I < this.HeaderDataTable.length; I++) {
            header += `<th style="cursor: pointer;" id="${this.HeaderDataTable[I]}_header" class="columns tablesorter-header">${this.HeaderDataTable[I]}</th>\n`;
            footer += `<th style="cursor: pointer;" id="${this.HeaderDataTable[I]}_footer" class="columns tablesorter-header">${this.HeaderDataTable[I]}</th>\n`;
        }
        // RowDataTable To Element
        let ifUndefinded = (this.DataToRender === undefined) ? 0 : this.DataToRender.length;
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
                    ToCell += `<td>${SlecTloaf[___row][this.HeaderDataTable[___cell]]}</td>\n`;
                }
                row += `<tr>${ToCell}</tr>\n`;
            }
            this.DataToRender = SlecTloaf;
        }
        // ====
        let ToEl = `<thead><tr>${header}</tr></thead><tbody>${row}</tbody><tfoot>${footer}</tfoot>`;
        this.TableElement.innerHTML = ToEl;
        for (let n = 0; n < this.HeaderDataTable.length; n++) {
            let cv = document.getElementById(`${this.HeaderDataTable[n]}_header`);
            document.getElementById(`${this.HeaderDataTable[n]}_header`).style.opacity = '100%';
            cv.onclick = () => {
                this.sort(`${this.HeaderDataTable[n]}`);
                document.getElementById(`${this.HeaderDataTable[n]}_header`).style.opacity = '60%';
                if (this.Assc) {
                    document.getElementById(`${this.HeaderDataTable[n]}_header`).classList.remove('tablesorter-header-asc');
                    document.getElementById(`${this.HeaderDataTable[n]}_header`).classList.add('tablesorter-header-desc');
                }
                else {
                    document.getElementById(`${this.HeaderDataTable[n]}_header`).classList.remove('tablesorter-header-desc');
                    document.getElementById(`${this.HeaderDataTable[n]}_header`).classList.add('tablesorter-header-asc');
                }
            };
        }
        this.PaginateUpdate();
        this.DoHide();
        console.log(this.ListHiding);
    }
    /**
     *
     * @param column name column to sort
     * @returns show data shorted
     */
    sort(column) {
        function naturalCompare(a, b) {
            let ax = [];
            let bx = [];
            a.toString().replace(/(^\$|,)/g, '').replace(/(\d+)|(\D+)/g, function (_, $1, $2) { ax.push([$1 || Infinity, $2 || ""]); });
            b.toString().replace(/(^\$|,)/g, '').replace(/(\d+)|(\D+)/g, function (_, $1, $2) { bx.push([$1 || Infinity, $2 || ""]); });
            while (ax.length && bx.length) {
                var an = ax.shift();
                var bn = bx.shift();
                var nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
                if (nn)
                    return nn;
            }
            return ax.length - bx.length;
        }
        let data = this.DataTable;
        if (this.Assc) {
            this.Assc = !this.Assc;
            data.sort((a, b) => {
                return naturalCompare(a[column], b[column]);
            });
        }
        else {
            this.Assc = !this.Assc;
            data.sort((a, b) => {
                return naturalCompare(b[column], a[column]);
            });
        }
        this.DataSorted = data;
        this.i = 0;
        this.RenderToHTML();
        return this.DataSorted;
    }
    /**
     *
     * @param filename filename to download default is Export
     *
     */
    DownloadCSV(filename = 'Export') {
        let res = this.HeaderDataTable.join() + '\n';
        let csv = '';
        csv += res;
        for (let g = 0; g < this.RowDataTable.length; g++) {
            csv += this.RowDataTable[g].join() + '\r\n';
        }
        let element = document.createElement('a');
        element.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
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
        let element = document.createElement('a');
        element.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.DataTableRaw));
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
        let getbody = this.TableElement?.getElementsByTagName('tbody');
        for (let row = 0; row < getbody[0].rows.length; row++) {
            for (let cellsIndex = 0; cellsIndex < getbody[0].rows[row].cells.length; cellsIndex++) {
                let innerHTML = getbody[0].rows[row].cells[cellsIndex].innerHTML;
                let index = innerHTML.indexOf(text);
                if (index >= 0) {
                    innerHTML = innerHTML.substring(0, index) + "<span style='background-color: yellow;'>" + innerHTML.substring(index, index + text.length) + "</span>" + innerHTML.substring(index + text.length);
                    getbody[0].rows[row].cells[cellsIndex].innerHTML = innerHTML;
                    console.log(getbody[0].rows[row].cells[cellsIndex].classList.add(`${this.HeaderDataTable[cellsIndex]}__row`));
                }
            }
        }
    }
    /**
     *
     * @param PayLoad you json data to table
     *
     */
    JSONinit(PayLoad) {
        this.HeaderDataTable = [];
        for (const key in PayLoad[0]) {
            this.HeaderDataTable.push(key);
        }
        this.DataTable = PayLoad;
        this.DataSearch = PayLoad;
        this.RenderToHTML();
    }
    HideCol(column) {
        let Classes = document.getElementsByClassName(`${column}__row`);
        for (let O = 0; O < Classes.length; O++) {
            Classes[O].style.display = "none";
        }
        document.getElementById(`${column}_header`).style.display = "none";
        document.getElementById(`${column}_footer`).style.display = "none";
        console.log(column);
    }
    ShowCol(column) {
        let Classes = document.getElementsByClassName(`${column}__row`);
        for (let O = 0; O < Classes.length; O++) {
            Classes[O].style.display = "";
        }
        if (document.getElementById(`${column}_header`)) {
            document.getElementById(`${column}_header`).style.display = "";
            document.getElementById(`${column}_footer`).style.display = "";
        }
    }
    DoHide() {
        const GetHeadArr = this.HeaderDataTable;
        let ListOftrutc = [];
        for (let T = 0; T < this.HeaderDataTable.length; T++) {
            ListOftrutc.push(true);
        }
        for (let O = 0; O < this.ListHiding.length; O++) {
            let Index = GetHeadArr.indexOf(this.ListHiding[O]);
            if (Index > -1) {
                ListOftrutc[Index] = false;
            }
        }
        let IndexTrue = [];
        let IndexFalse = [];
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
        console.log(IndexFalse);
        console.log('_______false');
        console.log(IndexTrue);
        console.log('_______true');
    }
}
