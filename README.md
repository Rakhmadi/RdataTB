## RdataTB
simple vanilla javascript datatable for Boostrap V5
> !!!! Note = Min Bostrap Version is V5.0.1

### Demo  https://stoic-villani-c9b3f6.netlify.app/

### Example Usage
```html

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<script src="https://cdn.jsdelivr.net/gh/Rakhmadi/RdataTB@master/dist/index.js"></script>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-+0n0xVW2eSR5OomGNYDnhzAbDsOXxcvSN1TPprVMTNDbiYZCxYbOOl7+AMvyTG2x" crossorigin="anonymous">
<body>

<table id="myTable" class="table table-bordered" id="myTable" border="1">
	<thead>
		<tr>
			<th>Head 1</th>
			<th>Head 2</th>
			<th>Head 3</th> 
			 <!-- If column contain type date add attribut "type-date" example = <th type-date >Head 3</th>  -->
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

<script>
    let x = new RdataTB('myTable',{
		ShowSearch:true, // show search field,
		ShowSelect:true, // show show select,
		ShowPaginate:true, // show paginate ,
		SelectionNumber:[5,10,20,50], //Change Option in Select
		HideColumn:[], // Hide column
		ShowHighlight:false, // show Highlight if search
	        fixedTable:true, // fixed table
                sortAnimate:true, // show animated if sorted
		ShowTfoot:false,
		ExcludeColumnExport:[] 
	});
</script>

</body>
</html>
```
#### Options 
You can enter options in the second parameter
```html
<script>
    let x = new RdataTB('youTableid',{
		RenderJSON:[], // Convert Json to Table html 
		ShowSearch:true, // show search field,
		ShowSelect:true, // show show select,
		ShowPaginate:true, // show paginate ,
		SelectionNumber:[5,10,20,50], //Change Option in Select
		HideColumn:[], // Hide column
		ShowHighlight:false, // show Highlight if search
	        fixedTable:true, // fixed table
                sortAnimate:true, // show animated if sorted
		ShowTfoot:false,
		ExcludeColumnExport:[] 
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
			 <!-- If column contain type date add attribut "type-date" example = <th type-date >Head 3</th>  -->
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
|``` DataToRender```|Get the data displayed in the table|

#### Methods 
|Name Methods  | Descriptions|
|--|--|
| ``` DownloadCSV('FileName'); ``` | Download table in csv format "default filename is Export" |
|``` DownloadJSON('FileName');```|Download table in Json format "default filename is Export"|
|``` sort('columnName'); ```|Sort table by column asc and desc|
|```nextItem();```|Get next page data|
|``` prevItem();```|Get previous page data|

