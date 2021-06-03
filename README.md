# RdataTB
simple vanilla javascript datatable 
## Setup

```html
<script src="https://cdn.jsdelivr.net/gh/Rakhmadi/RdataTB@main/dist/index.js"></script>

<script>
    let x = new RdataTB('youTableid');
</script>
```
### Valid Table syntax

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

## Download To CSV
```html
<script>
    let x = new RdataTB('youTableid');
    x.DownloadCSV('filename') // default filename it`s Export
</script>
```
 

## Download To JSON
```html
<script>
    let x = new RdataTB('youTableid');
    x.DownloadJSON('filename') // default filename it`s Export
</script>
```

## Get Raw DataTable
```html
<script>
    let x = new RdataTB('youTableid');
    console.log(x.DataTableRaw)
</script>
```

## Get Header table
```html
<script>
    let x = new RdataTB('youTableid');
    console.log(x.HeaderDataTable)
</script>
```

## Get Data Next
```html
<script>
    let x = new RdataTB('youTableid');
    x.nextItem()
</script>
```

## Get Data Prev
```html
<script>
    let x = new RdataTB('youTableid');
    x.prevItem()
</script>
```

## Sorting DataTable by column name
```html
<script>
    let x = new RdataTB('youTableid');
    x.sort('column_name')
</script>
```
