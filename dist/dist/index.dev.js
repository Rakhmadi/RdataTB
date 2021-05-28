"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var RdataTB =
/*#__PURE__*/
function () {
  function RdataTB(IdTable) {
    _classCallCheck(this, RdataTB);

    this.HeaderDataTable = [];
    this.RowDataTable = [];
    this.PageSize = 5;
    this.NumSelectedPage = 0;
    this.Assc = true;
    this.DataPaginate = [];
    this.SicePage = [];
    this.TableElement = document.getElementById(IdTable);
    this.ConvertToJson();
    this.paginateRender();
    this.Control();
    this.search();
    this.paginateControl();
    this.RenderToHTML();
  }

  _createClass(RdataTB, [{
    key: "paginateControl",
    value: function paginateControl() {
      var _this = this;

      for (var i = 0; i < this.DataPaginate.length; i += 5) {
        this.SicePage.push(this.DataPaginate.slice(i, i + 5));
      }

      var loc = 0;

      function next() {}

      var CL = function CL() {
        _this.paginateReplace();
      };

      document.getElementById('x__NEXT__X').onclick = function () {
        if (loc != _this.SicePage.length - 1) {
          _this.NumSelectedPage = ++loc;
        }

        _this.paginateReplace();
      };

      document.getElementById('x__PREV__X').onclick = function () {
        if (loc != 0) {
          _this.NumSelectedPage = --loc;
          console.log(_this.NumSelectedPage);

          _this.paginateReplace();
        }
      };
    }
  }, {
    key: "Control",
    value: function Control() {
      var _this2 = this;

      var span1 = document.createElement('span');
      span1.innerHTML = "\n        <table border=\"0\" style=\"width:100%\">\n        <tr>\n          <td style=\"width:50%\">\n             <select id=\"my-select\" class=\"form-select\" style=\"float:left;width:99px!important\">\n             <option value=\"5\">5</option>\n             <option value=\"10\">10</option>\n             <option value=\"15\">15</option>\n             <option value=\"20\">20</option>\n             <option value=\"25\">25</option>\n             </select>\n          </td>\n          <td style=\"width:50%\">\n          <input class=\"form-control shadow-none\" placeholder=\"Search\" type=\"text\" id=\"SEARCH____X\" style=\"width:30%; float:right ;\">\n          </td>\n        </tr>\n      </table>\n        ";
      span1.className = 'Selc';
      this.TableElement.parentNode.insertBefore(span1, this.TableElement);
      this.TableElement.style.width = '100%';

      var ChangeV = function ChangeV(params) {
        _this2.PageSize = params;
        console.log(_this2.PageSize);

        _this2.paginateReplace();

        _this2.RenderToHTML();
      };

      document.getElementById('my-select').addEventListener('change', function () {
        ChangeV(this.value);
      });
    }
  }, {
    key: "paginateReplace",
    value: function paginateReplace() {
      this.paginateCountListed();
      var innerP = '';

      for (var z = 0; z < this.SicePage[this.NumSelectedPage].length; z++) {
        innerP += "<a id=\"P__X__".concat(this.SicePage[this.NumSelectedPage][z], "\" style=\"cursor:pointer;\">").concat(this.SicePage[this.NumSelectedPage][z], "</a>\n");
      }

      var k = "\n            <a href=\"#\" id=\"x__PREV__X\" style=\"cursor:pointer;\">&laquo;</a>\n            ".concat(innerP, "\n            <a href=\"#\" id=\"x__NEXT__X\" style=\"cursor:pointer;\">&raquo;</a>\n            </div>\n            ");
      var my_elem = document.getElementById('pgN');
      my_elem.innerHTML = k;
    }
  }, {
    key: "paginateCountListed",
    value: function paginateCountListed() {
      this.DataPaginate = [];

      for (var z = 0; z < Math.floor(this.DataTable.length / this.PageSize); z++) {
        this.DataPaginate.push(z + 1);
      }
    }
  }, {
    key: "paginateRender",
    value: function paginateRender() {
      this.paginateCountListed();
      var gh = [];

      for (var i = 0; i < this.DataPaginate.length; i += 5) {
        gh.push(this.DataPaginate.slice(i, i + 5));
      }

      console.log(gh);
      var innerP = '';

      for (var z = 0; z < Math.floor(this.DataTable.length / this.PageSize); z++) {
        innerP += "<a id=\"P__X__".concat(z + 1, "\" style=\"cursor:pointer;\">").concat(z + 1, "</a>\n");
      }

      console.log(innerP);
      var k = " <div class=\"pagination\" id=\"pgN\">\n        <a href=\"#\" id=\"x__PREV__X\" style=\"cursor:pointer;\">&laquo;</a>\n        ".concat(innerP, "\n        <a href=\"#\" id=\"x__NEXT__X\" style=\"cursor:pointer;\">&raquo;</a>\n        </div>\n        ");
      var span = document.createElement('span');
      span.innerHTML = k;
      span.className = 'asterisk';
      this.TableElement.parentNode.insertBefore(span, this.TableElement.nextSibling);
    }
  }, {
    key: "search",
    value: function search() {
      var _this3 = this;

      var _a;

      var dataTOsrc = this.DataTable;
      (_a = document.getElementById('SEARCH____X')) === null || _a === void 0 ? void 0 : _a.addEventListener('input', function (evt) {
        _this3.DataTable = dataTOsrc.filter(function (element) {
          for (var index = 0; index < _this3.HeaderDataTable.length; index++) {
            var fg = element[_this3.HeaderDataTable[index]].toLowerCase().includes(evt.target.value);

            if (fg) {
              return fg;
            }
          }
        });
        console.log(_this3.DataSearch);

        _this3.paginateReplace();

        _this3.RenderToHTML();
      });
    }
  }, {
    key: "ConvertToJson",
    value: function ConvertToJson() {
      var _this4 = this;

      var _a, _b, _c; //get Header


      var getHead = (_a = this.TableElement) === null || _a === void 0 ? void 0 : _a.getElementsByTagName('th');

      for (var v = 0; v < getHead.length; v++) {
        (_b = this.HeaderDataTable) === null || _b === void 0 ? void 0 : _b.push(getHead[v].textContent);
      } //get row data


      var getbody = (_c = this.TableElement) === null || _c === void 0 ? void 0 : _c.getElementsByTagName('tbody');

      for (var row = 0; row < getbody[0].rows.length; row++) {
        var cellsD = [];

        for (var cellsIndex = 0; cellsIndex < getbody[0].rows[row].cells.length; cellsIndex++) {
          cellsD.push(getbody[0].rows[row].cells[cellsIndex].innerHTML);
        }

        this.RowDataTable.push(cellsD);
      } // to key value Json


      this.DataTable = this.RowDataTable.reduce(function (akumulasi, e) {
        akumulasi.push(_this4.HeaderDataTable.reduce(function (x, y, i) {
          x[y] = e[i];
          return x;
        }, {}));
        return akumulasi;
      }, []);
      return this.DataTable;
    }
  }, {
    key: "Divide",
    value: function Divide(data) {
      var gh = [];

      for (var i = 0; i < data.length; i += this.PageSize) {
        gh.push(data.slice(i, i + this.PageSize));
      }

      return gh;
    }
  }, {
    key: "RenderToHTML",
    value: function RenderToHTML() {
      var _this5 = this;

      console.log(this.Divide(this.DataTable));
      console.log(Math.floor(this.DataTable.length / 7)); //clear 

      this.TableElement.innerHTML = ''; // check if is sorted

      var CheckIFSorted = this.DataSorted === null || this.DataSorted === [] || this.DataSorted === undefined ? this.Divide(this.DataTable)[this.NumSelectedPage] : this.Divide(this.DataSorted)[this.NumSelectedPage];
      this.DataToRender = CheckIFSorted; // HeaderDataTable To Element

      var header = '';

      for (var I = 0; I < this.HeaderDataTable.length; I++) {
        header += "<th style=\"cursor: pointer;\" id=\"".concat(this.HeaderDataTable[I], "\" class=\"columns tablesorter-header\">").concat(this.HeaderDataTable[I], "</th>\n");
      } // RowDataTable To Element


      var ifUndefinded = this.DataToRender === undefined ? 0 : this.DataToRender.length;
      var row = '';

      for (var ___row = 0; ___row < ifUndefinded; ___row++) {
        var ToCell = '';

        for (var ___cell = 0; ___cell < this.HeaderDataTable.length; ___cell++) {
          ToCell += "<td>".concat(this.DataToRender[___row][this.HeaderDataTable[___cell]], "</td>\n");
        }

        row += "<tr>".concat(ToCell, "</tr>\n");
      } // ====


      var ToEl = "\n        <thead>\n            <tr>\n                ".concat(header, "\n            </tr>\n        </thead>\n        <tbody>\n            ").concat(row, "\n        </tbody>\n        <tfoot>\n        ").concat(header, "\n        </tfoot>\n        ");
      this.TableElement.innerHTML = ToEl;

      var _loop = function _loop(n) {
        var cv = document.getElementById(_this5.HeaderDataTable[n]);
        document.getElementById(_this5.HeaderDataTable[n]).style.opacity = '100%';

        cv.onclick = function () {
          _this5.sort(_this5.HeaderDataTable[n]);

          document.getElementById(_this5.HeaderDataTable[n]).style.opacity = '60%';

          if (_this5.Assc) {
            document.getElementById(_this5.HeaderDataTable[n]).classList.remove('tablesorter-header-desc');
            document.getElementById(_this5.HeaderDataTable[n]).classList.add('tablesorter-header-asc');
          } else {
            document.getElementById(_this5.HeaderDataTable[n]).classList.remove('tablesorter-header-asc');
            document.getElementById(_this5.HeaderDataTable[n]).classList.add('tablesorter-header-desc');
          }
        };
      };

      for (var n = 0; n < this.HeaderDataTable.length; n++) {
        _loop(n);
      }
    }
  }, {
    key: "paginate",
    value: function paginate() {}
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

      var data = this.DataTable;

      if (this.Assc) {
        this.Assc = !this.Assc;
        data.sort(function (a, b) {
          return naturalCompare(a[column], b[column]);
        });
      } else {
        this.Assc = !this.Assc;
        data.sort(function (a, b) {
          return naturalCompare(b[column], a[column]);
        });
      }

      this.DataSorted = data;
      this.RenderToHTML();
      return this.DataSorted;
    }
  }]);

  return RdataTB;
}();