const monthMap = {
  'janeiro': '01', 'fevereiro': '02', 'março': '03', 'abril': '04',
  'maio': '05', 'junho': '06', 'julho': '07', 'agosto': '08',
  'setembro': '09', 'outubro': '10', 'novembro': '11', 'dezembro': '12'
};

let inputDate = $('JS-Calculate-Event-Budget').item.json.event_date;

if (typeof inputDate === 'string') {
  const lowerDate = inputDate.toLowerCase();

  // Procura pelo nome do mês dentro da string (ex: "Agosto/2026")
  for (let month in monthMap) {
    if (lowerDate.includes(month)) {
      // Extrai o ano se houver 4 dígitos, senão usa 2026 como padrão
      const yearMatch = lowerDate.match(/\d{4}/);
      const year = yearMatch ? yearMatch[0] : '2026';

      inputDate = `${year}-${monthMap[month]}-01`;
      break;
    }
  }
}

return { event_date: inputDate };