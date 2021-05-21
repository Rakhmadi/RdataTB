"use strict";
class Rtable {
    constructor(idTable) {
        this.tHeadData = [];
        this.tBodyData = [];
        this.Assc = true;
        this.pageSize = 5;
        this.idTable = idTable;
        this.tableToJson();
        document.getElementById(this.idTable).innerHTML = '';
        console.log(this.tHeadData);
        console.log(this.dataTableJson);
        let innerP = '';
        for (let z = 0; z < Math.ceil(this.dataTableJsonA.length / this.pageSize); z++) {
            innerP += `<a id="P__X__${z + 1}" style="cursor:pointer;">${z + 1}</a>\n`;
        }
        let k = ` <div class="pagination">
        <a href="#" style="cursor:pointer;">&laquo;</a>
        ${innerP}
        <a href="#" style="cursor:pointer;">&raquo;</a>
      </div>
      `;
        console.log(k);
        let my_elem = document.getElementById(this.idTable);
        let span = document.createElement('span');
        span.innerHTML = k;
        span.className = 'asterisk';
        my_elem.parentNode.insertBefore(span, my_elem.nextSibling);
        let my_elem1 = document.getElementById(this.idTable);
        let span1 = document.createElement('span');
        span1.innerHTML = `
        <select id="my-select">
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
              <option value="25">25</option>
        </select> entries per page       `;
        span1.className = 'Selc';
        my_elem1.parentNode.insertBefore(span1, my_elem1);
        const ChangeV = (params) => {
            this.pageSize = params;
            console.log(this.pageSize);
            this.paginate(1);
        };
        document.getElementById('my-select').addEventListener('change', function () {
            ChangeV(this.value);
        });
        console.log(this.dataTableJsonA);
        this.renderToTable();
    }
    paginate(page_number) {
        this.dataTableJsonA = this.dataTableJson.slice((page_number - 1) * this.pageSize, page_number * this.pageSize);
        this.renderToTable();
        return this.dataTableJsonA;
    }
    tableToJson() {
        var _a, _b, _c;
        let getHead = (_a = document.getElementById(this.idTable)) === null || _a === void 0 ? void 0 : _a.getElementsByTagName('th');
        for (let v = 0; v < getHead.length; v++) {
            (_b = this.tHeadData) === null || _b === void 0 ? void 0 : _b.push(getHead[v].textContent);
        }
        let getbody = (_c = document.getElementById(this.idTable)) === null || _c === void 0 ? void 0 : _c.getElementsByTagName('tbody');
        console.log(getbody[0].rows.length);
        for (let row = 0; row < getbody[0].rows.length; row++) {
            let cellsD = [];
            for (let cellsIndex = 0; cellsIndex < getbody[0].rows[row].cells.length; cellsIndex++) {
                cellsD.push(getbody[0].rows[row].cells[cellsIndex].textContent);
            }
            this.tBodyData.push(cellsD);
        }
        this.dataTableJson = this.tBodyData.reduce((akumulasi, e) => {
            akumulasi.push(this.tHeadData.reduce((x, y, i) => {
                x[y] = e[i];
                return x;
            }, {}));
            return akumulasi;
        }, []);
        this.dataTableJsonA = this.dataTableJson;
        return this.dataTableJson;
    }
    sort(column) {
        function naturalCompare(a, b) {
            let ax = [];
            let bx = [];
            a.replace(/(\d+)|(\D+)/g, function (_, $1, $2) { ax.push([$1 || Infinity, $2 || ""]); });
            b.replace(/(\d+)|(\D+)/g, function (_, $1, $2) { bx.push([$1 || Infinity, $2 || ""]); });
            while (ax.length && bx.length) {
                var an = ax.shift();
                var bn = bx.shift();
                var nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
                if (nn)
                    return nn;
            }
            return ax.length - bx.length;
        }
        if (this.Assc) {
            this.Assc = !this.Assc;
            this.dataTableJson.sort((a, b) => {
                return naturalCompare(a[column], b[column]);
            });
            this.dataTableJsonA.sort((a, b) => {
                return naturalCompare(a[column], b[column]);
            });
        }
        else {
            this.Assc = !this.Assc;
            this.dataTableJson.sort((a, b) => {
                return naturalCompare(a[column], b[column]);
            });
            this.dataTableJsonA.sort((a, b) => {
                return naturalCompare(b[column], a[column]);
            });
        }
        this.renderToTable(true);
        return this.dataTableJson;
    }
    renderToTable(cls = false) {
        let pener = document.getElementById(this.idTable);
        pener.innerHTML = '';
        let TableHead = '';
        let ToRow = '';
        if (cls) {
            ToRow = '';
        }
        let TGB = this.dataTableJsonA.slice((1 - 1) * this.pageSize, 1 * this.pageSize);
        for (let y = 0; y < this.tHeadData.length; y++) {
            TableHead += `<th style="cursor: pointer;" id="${this.tHeadData[y]}" class="columns">${this.tHeadData[y]}</th>\n`;
        }
        for (let __row = 0; __row < TGB.length; __row++) {
            let ToCell = '';
            for (let __cell = 0; __cell < this.tHeadData.length; __cell++) {
                ToCell += `<td>${TGB[__row][this.tHeadData[__cell]]}</td>\n`;
            }
            ToRow += `<tr>${ToCell}</tr>\n`;
        }
        let tabS = `
        <thead>
            <tr>
                ${TableHead}
            </tr>
        </thead>
        <tbody>
            ${ToRow}
        </tbody>
        `;
        pener.innerHTML = tabS;
        for (let n = 0; n < this.tHeadData.length; n++) {
            let cv = document.getElementById(this.tHeadData[n]);
            cv.onclick = () => {
                this.sort(this.tHeadData[n]);
            };
        }
        for (let __w = 0; __w < Math.ceil(this.dataTableJson.length / this.pageSize); __w++) {
            let cv = document.getElementById(`P__X__${__w + 1}`);
            cv.onclick = () => {
                this.paginate(__w + 1);
            };
        }
        console.log(Math.ceil(this.dataTableJson.length / this.pageSize));
        return tabS;
    }
    downloadToCSV() {
        let res = this.tHeadData.join() + '\n';
        let csv = '';
        csv += res;
        for (let g = 0; g < this.tBodyData.length; g++) {
            csv += this.tBodyData[g].join() + '\r\n';
        }
        let element = document.createElement('a');
        element.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
        element.target = '_blank';
        element.download = 'export.csv';
        element.click();
    }
}
