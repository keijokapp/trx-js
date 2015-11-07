<table>
	<thead>
		<tr>
			<th>#</th>
		</tr>
	</thead>
	<tbody>
		<template is="x-template" data-for="qso in log.qsos">
			<tr><td>{{ qso }}</td></tr>
		</template>
	</tbody>
</template>
