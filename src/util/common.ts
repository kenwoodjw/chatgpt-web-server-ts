

export function getSysdate() {
	const date = new Date();
	const formatter = new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit'
	});
	const formattedDate = formatter.format(date);

	//console.log(formattedDate); // 输出类似于"2022-04-01 09:00:00"的字符串
	return formattedDate
}


export function formatDate(date: Date): string {
	const year = date.getFullYear();
	const month = ("0" + (date.getMonth() + 1)).slice(-2);
	const day = ("0" + date.getDate()).slice(-2);
	return `${year}${month}${day}`;
}
