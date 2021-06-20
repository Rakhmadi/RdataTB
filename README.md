## RdataTB
simple vanilla javascript datatable 
#### Setup

```html
<script src="https://cdn.jsdelivr.net/gh/Rakhmadi/RdataTB@main/dist/index.js"></script>

<script>
    let x = new RdataTB('youTableid');
</script>
```
#### Options 
You can enter options in the second parameter
```html
<script>
    let x = new RdataTB('youTableid',{
		RenderJSON:null, // Convert Json to Table html 
		ShowSearch:true,
		ShowSelect:true,
		ShowPaginate:true,
		SelectionNumber:[5,10,20,50], //Change Option in Select
		HideColumn:[] // Hide column
	});
</script>
```
#### Valid table syntax

```html
<table id="myTable">
	<thead>
		<tr>
			<th>Head 1</th>
			<th>Head 2</th>
			<th>Head 3</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>data 1</td>
			<td>data 2</td>
			<td>data 3</td>
		</tr>
	</tbody>
</table>
```
### Class RdataTB()
#### Property
| Property | Descriptions |
|--|--|
| ```DataTableRaw``` | Get table data in json format |
|``` HeaderDataTable ```|Get all column name|
|``` RowDataTable```|Get data in row table|
|```DataToRender```|Get the data displayed in the table|

#### Methods 
|Name Methods  | Descriptions|
|--|--|
| ``` DownloadCSV('FileName'); ``` | Download table in csv format "default filename is Export" |
|``` DownloadJSON('FileName');```|Download table in Json format "default filename is Export"|
|``` sort('columnName'); ```|Sort table by column asc and desc|
|```getNextItem();```|Get next page data|
|```getPrevItem();```|Get previous page data|

