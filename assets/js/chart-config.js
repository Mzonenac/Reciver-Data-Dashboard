
		function config(event) {
		 return {
			type: 'line',
			data: {
				labels: [moment().format(format)],
				datasets: [{
					label: event.id,
					backgroundColor: chartColorsArray11[event.index],
					borderColor: chartColorsArray11[event.index],
					data: [event.event],
					fill: false,
				}]
			},
			options: {
				responsive: true,
				title: {
					display: true,
					text: event.note
				},
				tooltips: {
					mode: 'index',
					intersect: false,
				},
				hover: {
					mode: 'nearest',
					intersect: true
				},
				scales: {
					xAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Time'
						}
					}],
					yAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Value'
						}
					}]
				}
			}
		}
		};





