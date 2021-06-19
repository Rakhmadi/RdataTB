"use strict";
/**
 *
 *
 * By Rakhmadi (c) 2021
 * Under the MIT License.
 *
 *
 */

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var RdataTB =
/*#__PURE__*/
function () {
  /**
   *
   * @param IdTable Id tabble
   * @param Options Options
   *
   */
  function RdataTB(IdTable) {
    var Options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      RenderJSON: null,
      ShowSearch: true,
      ShowSelect: true,
      ShowPaginate: true,
      SelectionNumber: [5, 10, 20, 50],
      HideColumn: []
    };

    _classCallCheck(this, RdataTB);

    var _a, _b, _c;

    this.HeaderDataTable = []; // header table to array

    this.RowDataTable = []; // get Table to json

    this.DataTable = [];
    this.DataSorted = [];
    this.DataToRender = [];
    this.PageSize = 5;
    this.NumSelectedPage = 0;
    this.Assc = false;
    this.DataSearch = [];
    this.i = 0;
    this.COntrolDataArr = [];
    this.DataTableRaw = [];
    this.searchValue = '';
    this.ListHiding = [];
    this.SelectionNumber = [5, 10, 20, 50];
    this.SelectElementString = '';
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

    if (Options.ShowSelect != true) {
      if (Options.ShowSelect != null || Options.ShowSelect === false) {
        (_a = document.getElementById('my-select')) === null || _a === void 0 ? void 0 : _a.remove();
      }
    }

    if (Options.ShowPaginate != true) {
      if (Options.ShowPaginate != null || Options.ShowPaginate === false) {
        (_b = document.getElementById('pgN')) === null || _b === void 0 ? void 0 : _b.remove();
      }
    }

    if (Options.ShowSearch != true) {
      if (Options.ShowSearch != null || Options.ShowSearch === false) {
        (_c = document.getElementById('SearchControl')) === null || _c === void 0 ? void 0 : _c.remove();
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
  }

  _createClass(RdataTB, [{
    key: "StyleS",
    value: function StyleS() {
      var style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML = "\n        table { \n            table-layout:fixed;\n        }\n        table > thead{\n            -webkit-user-select: none;  \n            -moz-user-select: none;    \n            -ms-user-select: none;      \n            user-select: none;\n        }\n        /* Pagination links */\n        .pagination a {\n          color: black;\n          float: left;\n          padding: 8px 12px;\n          text-decoration: none;\n          transition: background-color .3s;\n          font-size:12px;\n        }\n        \n        /* Style the active/current link */\n        .pagination a.active {\n          background-color: dodgerblue;\n          color: white;\n        }\n        .tablesorter-header-asc::after {\n            content: '\\2191';\n            top: calc(50% - 0.75em);\n            float: right;\n        }\n        \n        .tablesorter-header-desc::after {\n            content: '\\2193';\n            top: calc(50% - 0.75em);\n            float: right;\n        }\n        /* Add a grey background color on mouse-over */\n        .pagination a:hover:not(.active) {background-color: #ddd;}\n        .blink_me {\n            animation: blinker 1s;\n          }\n          \n          @keyframes blinker {\n            50% {\n              opacity: .5;\n            }\n          }\n          ";
      document.getElementsByTagName('head')[0].appendChild(style);
    }
  }, {
    key: "ChangeSelect",
    value: function ChangeSelect() {
      this.SelectElementString = '';

      for (var x = 0; x < this.SelectionNumber.length; x++) {
        this.SelectElementString += "<option value=\"".concat(this.SelectionNumber[x], "\">").concat(this.SelectionNumber[x], "</option>");
      }

      document.getElementById("my-select").innerHTML = this.SelectElementString;
      return this.SelectElementString;
    }
  }, {
    key: "Control",
    value: function Control() {
      var _this = this;

      var span1 = document.createElement('span');
      span1.innerHTML = "\n        <table id=\"C\" border=\"0\" style=\"width:100%;margin-bottom:12px;\">\n        <tr>\n          <td style=\"width:100%;\">\n             <select id=\"my-select\" class=\"form-select\" style=\"float:left;width:99px!important;margin-right:10px;\">\n             <option value=\"5\">5</option><option value=\"10\">10</option><option value=\"20\">20</option><option value=\"50\">50</option>\n             </select>\n             <input id=\"SearchControl\" class=\"form-control shadow-none\" placeholder=\"Search\" type=\"text\" style=\"width:30%;margin-left:10px\">\n          </td>\n        </tr>\n      </table>\n        ";
      span1.className = 'Selc';
      this.TableElement.parentNode.insertBefore(span1, this.TableElement);
      this.TableElement.style.width = '100%';

      var ChangeV = function ChangeV(params) {
        _this.PageSize = params;
        _this.i = 0;

        _this.RenderToHTML();
      };

      document.getElementById('my-select').addEventListener('change', function () {
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
    }
  }, {
    key: "getNextItem",
    value: function getNextItem() {
      this.nextItem();
      this.highlight(this.searchValue);
      this.DoHide();
    }
  }, {
    key: "getPrevItem",
    value: function getPrevItem() {
      this.prevItem();
      this.highlight(this.searchValue);
      this.DoHide();
    }
  }, {
    key: "nextItem",
    value: function nextItem() {
      this.i = this.i + 1; // increase i by one

      this.i = this.i % this.Divide(this.DataTable).length; // if we've gone too high, start from `0` again

      this.COntrolDataArr = this.Divide(this.DataTable)[this.i]; // give us back the item of where we are now

      this.RenderToHTML(this.COntrolDataArr);
    }
  }, {
    key: "prevItem",
    value: function prevItem() {
      if (this.i === 0) {
        // i would become 0
        this.i = this.Divide(this.DataTable).length; // so put it at the other end of the array
      }

      this.i = this.i - 1; // decrease by one

      this.COntrolDataArr = this.Divide(this.DataTable)[this.i]; // give us back the item of where we are now

      this.RenderToHTML(this.COntrolDataArr);
    }
  }, {
    key: "paginateRender",
    value: function paginateRender() {
      var innerP = '';

      for (var z = 0; z < Math.floor(this.DataTable === undefined ? 0 : this.DataTable.length / this.PageSize); z++) {
        innerP += "<a id=\"P__X__".concat(z + 1, "\" style=\"cursor:pointer;\">").concat(z + 1, "</a>\n");
      }

      var k = " <div class=\"pagination\" id=\"pgN\">\n        <a id=\"x__PREV__X\" style=\"cursor:pointer;user-select: none;\">&laquo;</a>\n           <div id=\"PF\">\n                ".concat(innerP, "\n           </div>\n        <a id=\"x__NEXT__X\" style=\"cursor:pointer;user-select: none;\">&raquo;</a>\n        </div>\n        ");
      var span = document.createElement('span');
      span.innerHTML = k;
      span.className = 'asterisk';
      this.TableElement.parentNode.insertBefore(span, this.TableElement.nextSibling);
    }
  }, {
    key: "PaginateUpdate",
    value: function PaginateUpdate() {
      if (document.getElementById('PF') != null) {
        document.getElementById('PF').innerHTML = "\n            <a style=\"\">Page ".concat(this.i + 1, " to ").concat(this.Divide(this.DataTable).length, " of ").concat(this.DataTable === undefined ? 0 : this.DataTable.length, " Entries</a>");
      }
    }
  }, {
    key: "search",
    value: function search() {
      var _this2 = this;

      var _a;

      this.DataSearch = this.DataTable;
      (_a = document.getElementById('SearchControl')) === null || _a === void 0 ? void 0 : _a.addEventListener('input', function (evt) {
        _this2.searchValue = evt.target.value;
        _this2.DataTable = _this2.DataSearch.filter(function (element) {
          for (var index = 0; index < _this2.HeaderDataTable.length; index++) {
            var fg = element[_this2.HeaderDataTable[index]].toString().toLowerCase().includes(evt.target.value.toLowerCase());

            if (fg) {
              return fg;
            }
          }
        });

        _this2.RenderToHTML();

        _this2.i = 0;

        _this2.PaginateUpdate();

        _this2.highlight(evt.target.value);
      });
    }
  }, {
    key: "ConvertToJson",
    value: function ConvertToJson() {
      var _this3 = this;

      var _a, _b, _c; //get Header


      var getHead = (_a = this.TableElement) === null || _a === void 0 ? void 0 : _a.getElementsByTagName('th');

      for (var v = 0; v < getHead.length; v++) {
        (_b = this.HeaderDataTable) === null || _b === void 0 ? void 0 : _b.push(getHead[v].textContent);
      } //get row data


      var getbody = (_c = this.TableElement) === null || _c === void 0 ? void 0 : _c.getElementsByTagName('tbody');

      for (var row = 0; row < (getbody[0] === undefined ? 0 : getbody[0].rows.length); row++) {
        var cellsD = [];

        for (var cellsIndex = 0; cellsIndex < getbody[0].rows[row].cells.length; cellsIndex++) {
          cellsD.push(getbody[0].rows[row].cells[cellsIndex].innerHTML);
        }

        this.RowDataTable.push(cellsD);
      } // to key value Json


      this.DataTable = this.RowDataTable.reduce(function (akumulasi, e) {
        akumulasi.push(_this3.HeaderDataTable.reduce(function (x, y, i) {
          x[y] = e[i];
          return x;
        }, {}));
        return akumulasi;
      }, []);
      this.DataTableRaw = this.DataTable;
      return this.DataTable;
    }
  }, {
    key: "Divide",
    value: function Divide(data) {
      var gh = [];
      var h = typeof this.PageSize === "string" ? parseInt(this.PageSize) : this.PageSize;

      for (var i = 0; i < (this.DataTable === undefined ? 0 : this.DataTable.length); i += h) {
        gh.push(this.DataTable.slice(i, i + h));
      }

      return gh;
    }
  }, {
    key: "RenderToHTML",
    value: function RenderToHTML() {
      var _this4 = this;

      var SlecTloaf = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      //clear 
      this.TableElement.innerHTML = ''; // check if is sorted

      var CheckIFSorted = this.DataSorted === null || this.DataSorted === [] || this.DataSorted === undefined ? this.Divide(this.DataTable)[this.NumSelectedPage] : this.Divide(this.DataSorted)[this.NumSelectedPage];
      this.DataToRender = CheckIFSorted; // HeaderDataTable To Element

      var header = '';
      var footer = '';

      for (var I = 0; I < this.HeaderDataTable.length; I++) {
        header += "<th style=\"cursor: pointer;\" id=\"".concat(this.HeaderDataTable[I], "_header\" class=\"columns tablesorter-header\">").concat(this.HeaderDataTable[I], "</th>\n");
        footer += "<th style=\"cursor: pointer;\" id=\"".concat(this.HeaderDataTable[I], "_footer\" class=\"columns tablesorter-header\">").concat(this.HeaderDataTable[I], "</th>\n");
      } // RowDataTable To Element


      var ifUndefinded = this.DataToRender === undefined ? 0 : this.DataToRender.length;
      var row = '';

      if (SlecTloaf === null) {
        for (var ___row = 0; ___row < ifUndefinded; ___row++) {
          var ToCell = '';

          for (var ___cell = 0; ___cell < this.HeaderDataTable.length; ___cell++) {
            ToCell += "<td class=\"".concat(this.HeaderDataTable[___cell], "__row\">").concat(this.DataToRender[___row][this.HeaderDataTable[___cell]], "</td>\n");
          }

          row += "<tr>".concat(ToCell, "</tr>\n");
        }
      } else {
        for (var _row = 0; _row < SlecTloaf.length; _row++) {
          var _ToCell = '';

          for (var _cell = 0; _cell < this.HeaderDataTable.length; _cell++) {
            _ToCell += "<td>".concat(SlecTloaf[_row][this.HeaderDataTable[_cell]], "</td>\n");
          }

          row += "<tr>".concat(_ToCell, "</tr>\n");
        }

        this.DataToRender = SlecTloaf;
      } // ====


      var ToEl = "<thead><tr>".concat(header, "</tr></thead><tbody>").concat(row, "</tbody><tfoot>").concat(footer, "</tfoot>");
      this.TableElement.innerHTML = ToEl;

      var _loop = function _loop(n) {
        var cv = document.getElementById("".concat(_this4.HeaderDataTable[n], "_header"));
        document.getElementById("".concat(_this4.HeaderDataTable[n], "_header")).style.opacity = '100%';

        cv.onclick = function () {
          _this4.sort("".concat(_this4.HeaderDataTable[n]));

          document.getElementById("".concat(_this4.HeaderDataTable[n], "_header")).style.opacity = '60%';

          if (_this4.Assc) {
            document.getElementById("".concat(_this4.HeaderDataTable[n], "_header")).classList.remove('tablesorter-header-asc');
            document.getElementById("".concat(_this4.HeaderDataTable[n], "_header")).classList.add('tablesorter-header-desc');
          } else {
            document.getElementById("".concat(_this4.HeaderDataTable[n], "_header")).classList.remove('tablesorter-header-desc');
            document.getElementById("".concat(_this4.HeaderDataTable[n], "_header")).classList.add('tablesorter-header-asc');
          } //animate


          var s = document.getElementsByClassName("".concat(_this4.HeaderDataTable[n], "__row"));

          var _loop2 = function _loop2(NN) {
            setTimeout(function () {
              return s[NN].classList.add('blink_me');
            }, 21 * NN);
          };

          for (var NN = 0; NN < s.length; NN++) {
            _loop2(NN);
          }
        };
      };

      for (var n = 0; n < this.HeaderDataTable.length; n++) {
        _loop(n);
      }

      this.PaginateUpdate();
      this.DoHide();
    }
    /**
     *
     * @param column name column to sort
     * @returns show data shorted
     */

  }, {
    key: "sort",
    value: function sort(column) {
      function naturalCompare(a, b) {
        var ax = [];
        var bx = [];
        a.toString().replace(/(^\$|,)/g, '').replace(/(\d+)|(\D+)/g, function (_, $1, $2) {
          ax.push([$1 || Infinity, $2 || ""]);
        });
        b.toString().replace(/(^\$|,)/g, '').replace(/(\d+)|(\D+)/g, function (_, $1, $2) {
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
      this.i = 0;
      this.RenderToHTML();
      return this.DataSorted;
    }
    /**
     *
     * @param filename filename to download default is Export
     *
     */

  }, {
    key: "DownloadCSV",
    value: function DownloadCSV() {
      var filename = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Export';
      var str = '';

      for (var i = 0; i < this.DataTable.length; i++) {
        var line = '';

        for (var index in this.DataTable[i]) {
          if (line != '') line += ',';
          line += this.DataTable[i][index];
        }

        str += line + '\r\n';
      }

      var element = document.createElement('a');
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

  }, {
    key: "DownloadJSON",
    value: function DownloadJSON() {
      var filename = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Export';
      var element = document.createElement('a');
      element.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.DataTable));
      element.target = '_blank';
      element.download = filename + '.json';
      element.click();
    }
    /**
     *
     * @param text for highlighting text in table
     *
     */

  }, {
    key: "highlight",
    value: function highlight(text) {
      var _a;

      var getbody = (_a = this.TableElement) === null || _a === void 0 ? void 0 : _a.getElementsByTagName('tbody');

      for (var row = 0; row < getbody[0].rows.length; row++) {
        for (var cellsIndex = 0; cellsIndex < getbody[0].rows[row].cells.length; cellsIndex++) {
          var innerHTML = getbody[0].rows[row].cells[cellsIndex].innerHTML;
          var index = innerHTML.indexOf(text);

          if (index >= 0) {
            innerHTML = innerHTML.substring(0, index) + "<span style='background-color: yellow;'>" + innerHTML.substring(index, index + text.length) + "</span>" + innerHTML.substring(index + text.length);
            getbody[0].rows[row].cells[cellsIndex].innerHTML = innerHTML;
            getbody[0].rows[row].cells[cellsIndex].classList.add("".concat(this.HeaderDataTable[cellsIndex].replace(/\s/g, '_'), "__row"));
          }
        }
      }
    }
    /**
     *
     * @param PayLoad you json data to table
     *
     */

  }, {
    key: "JSONinit",
    value: function JSONinit() {
      var PayLoad = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      this.HeaderDataTable = [];

      for (var key in PayLoad[0]) {
        this.HeaderDataTable.push(key);
      }

      this.DataTable = PayLoad;
      this.DataSearch = PayLoad;
      this.RenderToHTML();
    }
  }, {
    key: "HideCol",
    value: function HideCol(column) {
      var Classes = document.getElementsByClassName("".concat(column, "__row"));

      for (var O = 0; O < Classes.length; O++) {
        Classes[O].style.display = "none";
      }

      if (document.getElementById("".concat(column, "_header"))) {
        document.getElementById("".concat(column, "_header")).style.display = "none";
        document.getElementById("".concat(column, "_footer")).style.display = "none";
      }
    }
  }, {
    key: "ShowCol",
    value: function ShowCol(column) {
      var Classes = document.getElementsByClassName("".concat(column, "__row"));

      for (var O = 0; O < Classes.length; O++) {
        Classes[O].style.display = "";
      }

      if (document.getElementById("".concat(column, "_header"))) {
        document.getElementById("".concat(column, "_header")).style.display = "";
        document.getElementById("".concat(column, "_footer")).style.display = "";
      }
    }
  }, {
    key: "DoHide",
    value: function DoHide() {
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
    }
  }]);

  return RdataTB;
}();