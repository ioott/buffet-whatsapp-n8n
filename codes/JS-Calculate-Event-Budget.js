const input = $('TRIGGER-Subflow').first().json;
const dbData = $('DB-Get-Client-Profile').first()?.json || {};

// 0. AI HALLUCINATION CLEANUP & DATE FORMATTER
for (let key in input) {
    if (typeof input[key] === 'string') {
        let value = input[key].trim();
        let lowerValue = value.toLowerCase();
        
        // Expanded AI hallucination filters
        const invalidTerms = ["client", "cliente", "não informado", "nao informado", "nenhuma.", "nenhuma"];
        
        // Checks if the string contains column names or schema garbage.
        if (invalidTerms.includes(lowerValue) || 
            value.includes("1900") || 
            value.includes("1990") || 
            value === "19:00" || 
            value === "00000000000" || 
            value.startsWith(",") ||
            value.includes("company_profession") || 
            value.includes("event_date:")) {
            input[key] = "";
        }
        
        // Prevents automatic assignment to the buffet manager.
        if (key === "venue_manager" && lowerValue === "vania") {
            input[key] = "";
        }

        // Corrects DD/MM/YYYY to YYYY-MM-DD
        if (input[key] && input[key].match(/^\d{2}\/\d{2}\/\d{4}$/)) {
            let [day, month, year] = input[key].split('/');
            input[key] = `${year}-${month}-${day}`;
        }
    }
}

// 1 e 2. Synchronization with database data
for (let key in input) {
  if ((input[key] === "" || input[key] === null || input[key] === undefined) && dbData[key] !== null && dbData[key] !== undefined) {
    input[key] = dbData[key];
  }
  
  if (input[key] === "") {
    input[key] = null;
  }
}

// 1. Extraction of quantities
let qtyAdults = Number(input.adults) || 0;
let qtyKids7to11 = Number(input.kids7to11) || 0;
let qtyKids4to6 = Number(input.kids4to6) || 0;

// 2. Blocking rule (< 30 adults)
if (qtyAdults < 30) {
    return {
        ...input,
        status: "MANUAL_ANALYSIS",
        stopHandling: true,
        notes: "< 30"
    };
}

// 3. Courtesy rules and paying customers
let allowedCourtesies = Math.floor(qtyAdults * 0.15); 
let exceedingKids = Math.max(0, qtyKids4to6 - allowedCourtesies);
let totalHalfPayers = qtyKids7to11 + exceedingKids;
let totalEquivalentPayers = qtyAdults + (totalHalfPayers / 2);

// 4. Cost rule
let baseCost = qtyAdults >= 60 ? 85.00 : 90.00;
let totalCost = (qtyAdults * baseCost) + (totalHalfPayers * (baseCost / 2));

// 5. Profit and Target Price
let minimumProfit = 1000.00;
let totalTargetValue = totalCost + minimumProfit;

let exactFullPrice = totalTargetValue / totalEquivalentPayers;
let exactHalfPrice = exactFullPrice / 2;

// 6. Rounding function (.90)
function roundPrice(value) {
    return Math.ceil((value - 4.90) / 5) * 5 + 4.90;
}

let fullPayerPrice = roundPrice(exactFullPrice);
let halfPayerPrice = roundPrice(exactHalfPrice);

// 7. Final calculation
let totalEventPrice = (qtyAdults * fullPayerPrice) + (totalHalfPayers * halfPayerPrice);
let estimatedProfit = totalEventPrice - totalCost;

// 8. Final return (Column mapping)
return {
    ...input,
    status: "Quote sent",
    stopHandling: false,
    qty12PlusYears: qtyAdults,
    qty7To11Years: qtyKids7to11,
    qty4To6Years: qtyKids4to6,
    totalCost: parseFloat(totalCost.toFixed(2)),
    fullPayerPrice: parseFloat(fullPayerPrice.toFixed(2)),
    halfPayerPrice: parseFloat(halfPayerPrice.toFixed(2)),
    totalEventPrice: parseFloat(totalEventPrice.toFixed(2)),
    profit: parseFloat(estimatedProfit.toFixed(2))
};
