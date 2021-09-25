
/**
 * 
 * 
 * By Rakhmadi (c) 2021
 * Under the MIT License.
 * 
 * 
 */
interface IOptions{
    RenderJSON: Array<any> | null,
    ShowSearch:boolean,
    ShowSelect:boolean,
    ShowPaginate:boolean,
    SelectionNumber:Array<number>,
    HideColumn:Array<string>,
    ShowHighlight:boolean,
    fixedTable:boolean,
    sortAnimate:boolean,
    ExcludeColumnExport:Array<any>
    
}

interface IListtyped{
    HeaderIndex:number,
    dateVal:boolean
}

class RdataTB  {
    TableElement!: HTMLElement | null; // Element Table ById
    HeaderDataTable:Array<number | string | any> = [] ; // header table to array
    RowDataTable:Array<any> = [] // get Table to json
    DataTable:Array<any> = []
    DataSorted:Array<any> = []
    DataToRender:Array<any> = []
    PageSize:number = 5
    Assc: boolean = false
    DataSearch: Array<any> = [];
    i: number = 0;
    COntrolDataArr: Array<any> = [];
    DataTableRaw: Array<any> = [];
    searchValue: string = '';
    Options: IOptions;
    ListHiding:Array<string> = []
    SelectionNumber: number[] = [5,10,20,50]
    SelectElementString: string = '';
    timeSort!: number;
    ShowHighlight: boolean = false;
    listTypeDate: Array<IListtyped> = [];
    PageNow: number = 1;
    totalPages: number;
    ExcludeColumnExport:Array<any> = [];

    constructor(IdTable:string,Options:IOptions = {RenderJSON:null,
        ShowSearch:true,
        ShowSelect:true,
        ShowPaginate:true,
        SelectionNumber:[5,10,20,50],
        HideColumn:[],
        ShowHighlight:false,
        fixedTable:false,
        sortAnimate:true,
        ExcludeColumnExport:[]}) {
        this.TableElement = document.getElementById(IdTable)
        this.detectTyped()
        this.StyleS();
        this.ConvertToJson()
        this.paginateRender()
        this.Control()
        this.search()
        this.RenderToHTML()
        this.PaginateUpdate()
        this.Options = Options

        if (Options.RenderJSON != null) {
            this.JSONinit(Options.RenderJSON)
        }
        if (Options.ShowSelect != true) {
            if (Options.ShowSelect != null || Options.ShowSelect === false){
                document.getElementById('my-select')?.remove()
            }
        }
        if (Options.ShowSelect != true) {
            if (Options.ShowSelect != null || Options.ShowSelect === false){
                document.getElementById('my-select')?.remove()
            }
        }
        if (Options.ShowHighlight != false) {
            if (Options.ShowHighlight != null || Options.ShowHighlight === true){
                this.ShowHighlight = true
            }
        }
        if (Options.fixedTable != false) {
            if (Options.fixedTable != null || Options.fixedTable === true){
                this.TableElement?.classList.add("table_layout_fixed")
            }else{
                this.TableElement?.classList.remove("table_layout_fixed")
            }
        }else{
            this.TableElement?.classList.add("table_layout_fixed")
        }
        if (Options.ShowSearch != true) {
            if (Options.ShowSearch != null || Options.ShowSearch === false){
                document.getElementById('SearchControl')?.remove()
            }
        }   
        if (Options.HideColumn != null) {
            this.ListHiding = Options.HideColumn
            this.DoHide()
        }
        if (Options.SelectionNumber != null) {
            this.SelectionNumber = Options.SelectionNumber
            this.ChangeSelect()
        }
        this.totalPages = this.Divide().length
    }
    detectTyped() {
        const getHead:Array<any> | any = this.TableElement?.getElementsByTagName('th');
        for (let z = 0; z < getHead.length; z++) {
            if (getHead[z]!.attributes['type-date']) {
                this.listTypeDate.push({
                    HeaderIndex:z,
                    dateVal:true
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

    public ChangeSelect(){
        this.SelectElementString = '' 
        for (let x = 0; x < this.SelectionNumber.length; x++) {
            this.SelectElementString += `<option value="${this.SelectionNumber[x]}">${this.SelectionNumber[x]}</option>`
        }
        document.getElementById("my-select")!.innerHTML = this.SelectElementString
        return this.SelectElementString;
    }

    public Control(){

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
        this.TableElement!.parentNode!.insertBefore(span1, this.TableElement);
        this.TableElement!.style.width = '100%'

        const ChangeV = (params:any) => {
            this.PageSize = params
            this.i = 0
            this.RenderToHTML()
        }
        let selectEl:HTMLInputElement = <HTMLInputElement>document.getElementById('my-select')
                        selectEl?.addEventListener('change', function(){
                        ChangeV(this.value)
        })
        document.getElementById('x__NEXT__X')!.onclick = ()=>{
            this.nextItem()
            this.highlight(this.searchValue);
            this.DoHide()
        }

        document.getElementById('x__PREV__X')!.onclick = ()=>{
            this.prevItem()
            this.highlight(this.searchValue);
            this.DoHide()
        }
    } 

    public nextItem():void {
        this.i = this.i + 1; // increase i by one
        this.i = this.i % this.Divide().length; // if we've gone too high, start from `0` again
        this.COntrolDataArr = this.Divide()[this.i]; // give us back the item of where we are now
        this.RenderToHTML(this.COntrolDataArr)
        this.PageNow = this.i + 1        
    }
    public prevItem():void {
        if (this.i === 0) { // i would become 0
            this.i = this.Divide().length; // so put it at the other end of the array
        }
        this.i = this.i - 1; // decrease by one
        this.PageNow = this.i + 1
        this.COntrolDataArr = this.Divide()[this.i]; // give us back the item of where we are now
        this.RenderToHTML(this.COntrolDataArr)
    }

    

    public paginateRender():void{
        const k = ` <div class="pagination" id="pgN"><a id="x__PREV__X" style="cursor:pointer;user-select: none;">&laquo;</a><div id="PF"></div><a id="x__NEXT__X" style="cursor:pointer;user-select: none;">&raquo;</a></div>`;
        const span = document.createElement('span');
        span.innerHTML = k;
        span.className = 'asterisk'
        this.TableElement!.parentNode!.insertBefore(span, this.TableElement!.nextSibling)
    }
    public PaginateUpdate():void{
        if (document.getElementById('PF') != null) {
            document.getElementById('PF')!.innerHTML = `
            <a style="">Page ${this.i + 1} to ${this.Divide().length} of ${(this.DataTable === undefined)?0:this.DataTable.length} Entries</a>`
        }
    }

    public search():void{
        this.DataSearch = this.DataTable
        document.getElementById('SearchControl')?.addEventListener('input',(evt)=>{
            this.searchValue =  (<HTMLInputElement>evt.target).value
            this.DataTable = this.DataSearch.filter( (element:any) =>{ 
                for (let index = 0; index < this.HeaderDataTable.length; index++) {
                     const fg = element[this.HeaderDataTable[index]].toString().toLowerCase().includes((<HTMLInputElement>evt.target).value.toLowerCase())
                     if (fg) {
                         return fg
                     }
                }
            })
            
            this.RenderToHTML()
            this.i = 0
            this.PaginateUpdate()
            this.highlight((<HTMLInputElement>evt.target).value)
        })
    }

    public ConvertToJson():Array<any>{
        //get Header
        const getHead:Array<any> | any = this.TableElement?.getElementsByTagName('th');
        for (let v = 0; v < getHead.length; v++) {
            this.HeaderDataTable?.push(getHead[v].textContent)
        }
        //get row data
        const getbody:Array<any> | any = this.TableElement?.getElementsByTagName('tbody');
        for (let row = 0; row < ((getbody[0] === undefined)? 0 : getbody[0].rows.length); row++) {
            const cellsD = []
            for (let cellsIndex = 0; cellsIndex < getbody[0].rows[row].cells.length; cellsIndex++) {
                cellsD.push(getbody[0].rows[row].cells[cellsIndex].innerHTML)
            }
            this.RowDataTable.push(cellsD)
        }
        // to key value Json
        this.DataTable = this.RowDataTable.reduce((akumulasi:any,e:any)=>{
            akumulasi.push(this.HeaderDataTable.reduce((x,y,i)=>{
                x[y] = e[i];
                return x;
            },{}))
            return akumulasi;
        },[]) 
        this.DataTableRaw = this.DataTable
        return this.DataTable
    }

    public Divide():Array<any>{
        const gh = []
        const h = (typeof this.PageSize === "string")?parseInt(this.PageSize):this.PageSize;
        for (let i = 0; i < ((this.DataTable === undefined)?0:this.DataTable.length); i += h){
            gh.push(this.DataTable.slice(i,i + h))        
        }
        return gh
    }

    public RenderToHTML(SlecTloaf:Array<number | string | any> | null = null):void{
        //clear 
        this.TableElement!.innerHTML = ''
        // check if is sorted
        const CheckIFSorted = (this.DataSorted === null || this.DataSorted === [] || this.DataSorted ===  undefined )? 
        this.Divide()[0] 
        : this.Divide()[0];
        this.DataToRender = CheckIFSorted
        // HeaderDataTable To Element
        let header:string = ''
        let footer:string = ''
        for (let I = 0; I < this.HeaderDataTable.length; I++) {
            header +=`<th style="cursor: pointer;" id="${this.HeaderDataTable[I]}_header" class="columns tablesorter-header">${this.HeaderDataTable[I]}</th>\n`;
            footer +=`<th style="cursor: pointer;" id="${this.HeaderDataTable[I]}_footer" class="columns tablesorter-header">${this.HeaderDataTable[I]}</th>\n`;
        }
        // RowDataTable To Element
        const ifUndefinded = (this.DataToRender === undefined) ? 0 : this.DataToRender.length
        let row:string = ''
        if (SlecTloaf === null) {
            for (let ___row = 0; ___row < ifUndefinded ; ___row++) {
                let ToCell:string = ''
                for (let ___cell = 0; ___cell < this.HeaderDataTable.length; ___cell++) {
                    ToCell += `<td class="${this.HeaderDataTable[___cell]}__row">${this.DataToRender[___row][this.HeaderDataTable[___cell]]}</td>\n`
                }
                row +=`<tr>${ToCell}</tr>\n` 
            }
        }else{
            for (let ___row = 0; ___row < SlecTloaf.length ; ___row++) {
                let ToCell:string = ''
                for (let ___cell = 0; ___cell < this.HeaderDataTable.length; ___cell++) {
                    ToCell += `<td class="${this.HeaderDataTable[___cell]}__row">${SlecTloaf[___row][this.HeaderDataTable[___cell]]}</td>\n`
                }
                row +=`<tr>${ToCell}</tr>\n` 
            }
            this.DataToRender = SlecTloaf
            
        }

        // ====
        const ToEl=`<thead><tr>${header}</tr></thead><tbody>${row}</tbody><tfoot>${footer}</tfoot>`
        this.TableElement!.innerHTML = ToEl

        for (let n = 0; n < this.HeaderDataTable.length; n++) {
            const cv:HTMLElement = document.getElementById(`${this.HeaderDataTable[n]}_header`)!;
            document.getElementById(`${this.HeaderDataTable[n]}_header`)!.style.opacity = '100%'

            
            cv.onclick = ()=>{

                this.sort(this.HeaderDataTable[n]);
                document.getElementById(`${this.HeaderDataTable[n]}_header`)!.style.opacity = '60%'
                if (this.Assc) {
                    document.getElementById(`${this.HeaderDataTable[n]}_header`)!.classList.remove('tablesorter-header-asc')
                    document.getElementById(`${this.HeaderDataTable[n]}_header`)!.classList.add('tablesorter-header-desc')

                } else {
                    document.getElementById(`${this.HeaderDataTable[n]}_header`)!.classList.remove('tablesorter-header-desc')
                    document.getElementById(`${this.HeaderDataTable[n]}_header`)!.classList.add('tablesorter-header-asc')
                }
                //animate
                if (this.Options.sortAnimate || !undefined) {
                    const s:any = document.getElementsByClassName(`${this.HeaderDataTable[n]}__row`)
                    for (let NN = 0; NN < s.length; NN++) {
                        setTimeout(()=>s[NN].classList.add('blink_me'),21*NN)            
                    }
                }
            }
        }
        this.PaginateUpdate()
        this.DoHide() 
    }
    /**
     * 
     * @param column name column to sort
     * @returns show data shorted
     */
    public sort(column:string):Array<any>{
        const t0:number = performance.now()

        function naturalCompare(a:any, b:any) {
            const ax:Array<any> = []
            const bx:Array<any> = []
            a.toString().replace(/(^\$|,)/g,'').replace(/(\d+)|(\D+)/g, function (_:any, $1:any, $2:any) { ax.push([$1 || Infinity, $2 || ""]) });
            b.toString().replace(/(^\$|,)/g,'').replace(/(\d+)|(\D+)/g, function (_:any, $1:any, $2:any) { bx.push([$1 || Infinity, $2 || ""]) });

            for (let index = 0; ax.length && bx.length ; index++) {
                const an = ax.shift();
                const bn = bx.shift();
                const nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
                if (nn) return nn;
            }
            return ax.length - bx.length;
         }
         const IndexHead:number = this.HeaderDataTable.indexOf(column)
         const listDated = this.listTypeDate.find(x=>x.HeaderIndex === IndexHead)
         const isDate:boolean = listDated?.HeaderIndex === IndexHead
         const data = this.DataTable

        if (this.Assc) {
            this.Assc = !this.Assc
            if (!isDate) {
                data.sort((a,b)=>{
                    return naturalCompare(a[column], b[column])
                })
            }else{
                data.sort((a,b)=>{
                    return Date.parse(a[column])- Date.parse(b[column])
                })
            }
        } else {
            this.Assc = !this.Assc
            if (!isDate) {
                data.sort((a,b)=>{
                    return naturalCompare(b[column], a[column])
                })
            }else{
                data.sort((a,b)=>{
                    return Date.parse(b[column])- Date.parse(a[column])
                })
            }
        }
        this.DataSorted = data
        this.i = 0
        this.RenderToHTML()
        const t1:number = performance.now()    
        this.timeSort = Math.round((t1 - t0)/1000*10000)/10000
        return this.DataSorted
    }

    MExcludeColumnExport():any{
        let DataTable:Array<any> = JSON.parse(JSON.stringify(this.DataTable));
        let exlude = this.Options.ExcludeColumnExport
        let head = [...this.HeaderDataTable]

        for(let x = 0 ; x < exlude.length ; x++){
            let indexHead = head.indexOf(exlude[x])
            if(indexHead > -1){
                head.splice(indexHead,1)
            }
        }


        for(let x = 0 ; x < DataTable.length ; x++){
             for (let n = 0; n < exlude.length; n++) {
                 delete DataTable[x][exlude[n]]
             }
        }
        return {
            "header" : head,
            "data":DataTable
        }
    }

    /**
     * 
     * @param filename filename to download default is Export
     * 
     */
    DownloadCSV(filename:string = 'Export'):void{
        let data = this.MExcludeColumnExport();
        let str = '';
        let hed = data.header.toString();
        str = hed + '\r\n';

        for (let i = 0; i < data.data.length; i++) {
            let line = '';
            for (const index in data.data[i]) {
                if (line != '') line += ','
                line += data.data[i][index];
            }
            str += line + '\r\n';
        }
        
        const element = document.createElement('a')!;
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
    DownloadJSON(filename:string = 'Export'):void{
        let data = this.MExcludeColumnExport();

        const element = document.createElement('a')!;
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
    public highlight(text:string):void{

        if (this.ShowHighlight) {
            const getbody:any = this.TableElement?.getElementsByTagName('tbody');
            for (let row = 0; row < getbody[0].rows.length; row++) {
                for (let cellsIndex = 0; cellsIndex < getbody[0].rows[row].cells.length; cellsIndex++) {
                     let innerHTML = getbody[0].rows[row].cells[cellsIndex].innerHTML;
                     const index = innerHTML.indexOf(text);
                     if (index >= 0) {  
                      innerHTML = innerHTML.substring(0,index) + "<span style='background-color: yellow;'>" + innerHTML.substring(index,index+text.length) + "</span>" + innerHTML.substring(index + text.length) ;
                      getbody[0].rows[row].cells[cellsIndex].innerHTML = innerHTML;
                      getbody[0].rows[row].cells[cellsIndex].classList.add(`${this.HeaderDataTable[cellsIndex].replace(/\s/g,'_')}__row`);
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
    public JSONinit(PayLoad:Array<number | string | any> = []):void{
        this.HeaderDataTable = []
        for (const key in PayLoad[0]) {
            this.HeaderDataTable.push(key)
        }
        this.DataTable = PayLoad
        this.DataSearch = PayLoad
        this.RenderToHTML()
    }
    
    public HideCol(column:string):void{
        const Classes = document.getElementsByClassName(`${column}__row`)  as HTMLCollectionOf<HTMLElement>;
        for (let O = 0; O < Classes.length; O++) {
            Classes[O].style.display = "none";
        }
        if (document.getElementById(`${column}_header`)) {
        document.getElementById(`${column}_header`)!.style.display = "none";
        document.getElementById(`${column}_footer`)!.style.display = "none";
        }
    }

    public ShowCol(column:string):void{
        const Classes = document.getElementsByClassName(`${column}__row`)  as HTMLCollectionOf<HTMLElement>;
        for (let O = 0; O < Classes.length; O++) {
            Classes[O].style.display = "";
        }
        if (document.getElementById(`${column}_header`)) {
            document.getElementById(`${column}_header`)!.style.display = "";
            document.getElementById(`${column}_footer`)!.style.display = "";
        }        
    }

    public DoHide():void{
        const GetHeadArr:Array<string> = this.HeaderDataTable
        const ListOftrutc:Array<boolean> = []
        for (let T = 0; T < this.HeaderDataTable.length; T++) {
            ListOftrutc.push(true)
        }
        for (let O = 0; O < this.ListHiding!.length; O++) {
             const Index = GetHeadArr.indexOf(this.ListHiding[O]);
             if (Index > -1) {
                ListOftrutc[Index] = false
              }
        }

        const IndexTrue:Array<number> = []
        const IndexFalse:Array<number> = []

        for (let U = 0; U < ListOftrutc.length; U++) {           
            if (ListOftrutc[U]) {
                IndexTrue.push(U)
            }
            if(!ListOftrutc[U]){
                IndexFalse.push(U)
            }
        }

        for (let V = 0; V < IndexTrue.length; V++) {
            this.ShowCol(GetHeadArr[IndexTrue[V]])
        }
        for (let F = 0; F < IndexFalse.length; F++) {
            this.HideCol(GetHeadArr[IndexFalse[F]])
        }
    }
}

