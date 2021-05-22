"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Rtable =
/*#__PURE__*/
function () {
  function Rtable(idTable) {
    var _this = this;

    _classCallCheck(this, Rtable);

    this.tHeadData = [];
    this.tBodyData = [];
    this.ToggleS = true;
    this.Assc = true;
    this.pageSize = 5;
    this.dataAttributsDate = [];
    this.idTable = idTable;
    this.tableToJson();
    document.getElementById(this.idTable).innerHTML = '';
    console.log(this.tHeadData);
    console.log(this.dataTableJson);

    var cv = function cv() {
      var innerP = '';

      for (var z = 0; z < Math.ceil(_this.dataTableJsonA.length / _this.pageSize); z++) {
        innerP += "<a id=\"P__X__".concat(z + 1, "\" style=\"cursor:pointer;user-select:none;\">").concat(z + 1, "</a>\n");
      }

      var k = " <div class=\"pagination\" id=\"pgN\">\n            <a href=\"#\" style=\"cursor:pointer;\">&laquo;</a>\n            ".concat(innerP, "\n            <a href=\"#\" style=\"cursor:pointer;\">&raquo;</a>\n            </div>\n            ");
      var my_elem = document.getElementById(_this.idTable);
      var span = document.createElement('span');
      span.innerHTML = k;
      span.className = 'asterisk';
      my_elem.parentNode.insertBefore(span, my_elem.nextSibling);
    };

    cv();
    var my_elem1 = document.getElementById(this.idTable);
    var span1 = document.createElement('span');
    span1.innerHTML = "\n        <select id=\"my-select\" class=\"form-select\" style=\"width:10%\">\n              <option value=\"5\">5</option>\n              <option value=\"10\">10</option>\n              <option value=\"15\">15</option>\n              <option value=\"20\">20</option>\n              <option value=\"25\">25</option>\n        </select> entries per page";
    span1.className = 'Selc';
    my_elem1.parentNode.insertBefore(span1, my_elem1);

    var gf = function gf() {
      var innerP = '';

      for (var z = 0; z < Math.ceil(_this.dataTableJson.length / _this.pageSize); z++) {
        innerP += "<a id=\"P__X__".concat(z + 1, "\" style=\"cursor:pointer;\">").concat(z + 1, "</a>\n");
      }

      var k = "\n            <a href=\"#\" style=\"cursor:pointer;\">&laquo;</a>\n            ".concat(innerP, "\n            <a href=\"#\" style=\"cursor:pointer;\">&raquo;</a>\n            </div>\n            ");
      var my_elem = document.getElementById('pgN');
      my_elem.innerHTML = k;
    };

    var ChangeV = function ChangeV(params) {
      _this.pageSize = params;
      console.log(_this.pageSize);
      gf();

      _this.paginate(1);
    };

    document.getElementById('my-select').addEventListener('change', function () {
      ChangeV(this.value);
    });
    console.log(this.dataTableJsonA);
    this.renderToTable();
  }

  _createClass(Rtable, [{
    key: "paginate",
    value: function paginate(page_number) {
      this.dataTableJsonA = this.dataTableJson.slice((page_number - 1) * this.pageSize, page_number * this.pageSize);
      this.renderToTable();
      return this.dataTableJsonA;
    }
  }, {
    key: "tableToJson",
    value: function tableToJson() {
      var _this2 = this;

      var _a, _b, _c;

      if (this.idTable != null || this.idTable != '') {
        var getHead = (_a = document.getElementById(this.idTable)) === null || _a === void 0 ? void 0 : _a.getElementsByTagName('th');

        for (var v = 0; v < getHead.length; v++) {
          (_b = this.tHeadData) === null || _b === void 0 ? void 0 : _b.push(getHead[v].textContent);
        }

        var getbody = (_c = document.getElementById(this.idTable)) === null || _c === void 0 ? void 0 : _c.getElementsByTagName('tbody');
        console.log(getbody[0].rows.length);

        for (var row = 0; row < getbody[0].rows.length; row++) {
          var cellsD = [];

          for (var cellsIndex = 0; cellsIndex < getbody[0].rows[row].cells.length; cellsIndex++) {
            cellsD.push(getbody[0].rows[row].cells[cellsIndex].textContent);
          }

          this.tBodyData.push(cellsD);
        }

        this.dataTableJson = this.tBodyData.reduce(function (akumulasi, e) {
          akumulasi.push(_this2.tHeadData.reduce(function (x, y, i) {
            x[y] = e[i];
            return x;
          }, {}));
          return akumulasi;
        }, []);

        for (var _v = 0; _v < getHead.length; _v++) {
          if (getHead[_v].attributes[0] === undefined) {
            this.dataAttributsDate.push('null');
          } else {
            if (getHead[_v].attributes[0]['value'] === 'date') {
              this.dataAttributsDate.push('date');
            } else {}
          }
        }

        console.log(this.dataAttributsDate);
      }

      this.dataTableRaw = this.dataTableJson;
      this.dataTableJsonA = this.dataTableJson;
      return this.dataTableJson;
    }
  }, {
    key: "sort",
    value: function sort(column) {
      function naturalCompare(a, b) {
        var ax = [];
        var bx = [];
        a.replace(/(\d+)|(\D+)/g, function (_, $1, $2) {
          ax.push([$1 || Infinity, $2 || ""]);
        });
        b.replace(/(\d+)|(\D+)/g, function (_, $1, $2) {
          bx.push([$1 || Infinity, $2 || ""]);
        });

        while (ax.length && bx.length) {
          var an = ax.shift();
          var bn = bx.shift();
          var nn = an[0] - bn[0] || an[1].localeCompare(bn[1]);
          if (nn) return nn;
        }

        return ax.length - bx.length;
      }

      if (this.Assc) {
        this.Assc = !this.Assc;
        this.dataTableJson.sort(function (a, b) {
          return naturalCompare(a[column], b[column]);
        });
        this.dataTableJsonA.sort(function (a, b) {
          return naturalCompare(a[column], b[column]);
        });
      } else {
        this.Assc = !this.Assc;
        this.dataTableJson.sort(function (a, b) {
          return naturalCompare(a[column], b[column]);
        });
        this.dataTableJsonA.sort(function (a, b) {
          return naturalCompare(b[column], a[column]);
        });
      } // for (let Ox = 0; Ox < this.dataAttributsDate.length; Ox++) {
      //     if (this.dataAttributsDate[Ox] === 'date') {
      //             if (this.tHeadData[Ox] === column) {
      //                 if (this.ToggleS) {
      //                     this.ToggleS = !this.ToggleS
      //                     this.dataTableJson.sort((a:any,b:any)=>{
      //                         return new Date(a[column]).getDate() - new Date(b[column]).getDate()
      //                     })
      //                     this.dataTableJsonA.sort((a:any,b:any)=>{
      //                         return new Date(a[column]).getDate() - new Date(b[column]).getDate()
      //                     })
      //                     console.log(new Date('2014-05-11').getDate());
      //                 } else {
      //                     this.ToggleS = !this.ToggleS
      //                     this.dataTableJson.sort((a:any,b:any)=>{
      //                         return new Date(b[column]).getDate() - new Date(a[column]).getDate()
      //                     })
      //                     this.dataTableJsonA.sort((a:any,b:any)=>{
      //                         return new Date(b[column]).getDate() - new Date(a[column]).getDate()
      //                     })
      //                     console.log('o');
      //                 }
      //             }
      //     }
      // }


      this.renderToTable(true);
      return this.dataTableJson;
    }
  }, {
    key: "renderToTable",
    value: function renderToTable() {
      var _this3 = this;

      var cls = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var pener = document.getElementById(this.idTable);
      pener.innerHTML = '';
      var TableHead = '';
      var ToRow = '';

      if (cls) {
        ToRow = '';
      }

      var TGB = this.dataTableJsonA.slice((1 - 1) * this.pageSize, 1 * this.pageSize);

      for (var y = 0; y < this.tHeadData.length; y++) {
        TableHead += "<th style=\"cursor: pointer;\" id=\"".concat(this.tHeadData[y], "\" class=\"columns\">").concat(this.tHeadData[y], "</th>\n");
      }

      for (var __row = 0; __row < TGB.length; __row++) {
        var ToCell = '';

        for (var __cell = 0; __cell < this.tHeadData.length; __cell++) {
          ToCell += "<td>".concat(TGB[__row][this.tHeadData[__cell]], "</td>\n");
        }

        ToRow += "<tr>".concat(ToCell, "</tr>\n");
      }

      var tabS = "\n        <thead>\n            <tr>\n                ".concat(TableHead, "\n            </tr>\n        </thead>\n        <tbody>\n            ").concat(ToRow, "\n        </tbody>\n        ");
      pener.innerHTML = tabS;

      var _loop = function _loop(n) {
        var cv = document.getElementById(_this3.tHeadData[n]);

        cv.onclick = function () {
          _this3.sort(_this3.tHeadData[n]);
        };
      };

      for (var n = 0; n < this.tHeadData.length; n++) {
        _loop(n);
      }

      var _loop2 = function _loop2(__w) {
        var cv = document.getElementById("P__X__".concat(__w + 1));

        cv.onclick = function () {
          _this3.paginate(__w + 1);

          cv.style.background = "#ddd";
        };

        cv.style.background = "#fff";
      };

      for (var __w = 0; __w < Math.ceil(this.dataTableJson.length / this.pageSize); __w++) {
        _loop2(__w);
      }

      for (var x = 0; x < this.tHeadData.length; x++) {
        console.log(x);
      }

      console.log(Math.ceil(this.dataTableJson.length / this.pageSize));
      return tabS;
    }
  }, {
    key: "downloadToCSV",
    value: function downloadToCSV() {
      var res = this.tHeadData.join() + '\n';
      var csv = '';
      csv += res;

      for (var g = 0; g < this.tBodyData.length; g++) {
        csv += this.tBodyData[g].join() + '\r\n';
      }

      var element = document.createElement('a');
      element.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
      element.target = '_blank';
      element.download = 'export.csv';
      element.click();
    }
  }]);

  return Rtable;
}();