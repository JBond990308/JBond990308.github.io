var first_Twenty = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", 
	                "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];

var multiples_Of_Tens = ["Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

var multiple_Of_Hundreds = ["Hundred", "Thousand", "Lakh", "Crore"];

var Crore = 10000000;
var Lakh = 100000; 
var Thousand = 1000;
var Hundred = 100;

function  spellCurrency(cur_val) {
	if (cur_val < 20) {
		return first_Twenty[cur_val];
	} 
      
	if(cur_val >= Crore) {
		var lastPart = spellCurrency(cur_val % Crore);
		if (lastPart == '') {
			return spellCurrency(Math.floor((cur_val / Crore))) + " " + multiple_Of_Hundreds[3]; 
		}
		return spellCurrency(Math.floor((cur_val / Crore))) + " " + multiple_Of_Hundreds[3] + " " + lastPart;
	}

	if (cur_val >= Lakh) {
		var lastPart = spellCurrency(cur_val % Lakh);
		if (lastPart == '') {
			return spellCurrency(Math.floor((cur_val / Lakh))) + " " + multiple_Of_Hundreds[2];
		}
	return spellCurrency(Math.floor((cur_val / Lakh))) + " " + multiple_Of_Hundreds[2] + " " + lastPart;
	}
	
	if (cur_val >= Thousand) {
		var lastPart = spellCurrency(cur_val % Thousand); 
		if (lastPart == '') {
			return spellCurrency(Math.floor((cur_val / Thousand))) + " " + multiple_Of_Hundreds[1];
		}
		return spellCurrency(Math.floor((cur_val / Thousand))) + " " + multiple_Of_Hundreds[1] + "  " + lastPart;
	}
	
	if (cur_val >= Hundred) {
        var lastPart = spellCurrency(cur_val % Hundred);
        if (lastPart == '') {
			return first_Twenty[Math.floor(cur_val/Hundred)] + " " + multiple_Of_Hundreds[0];
		}
		return first_Twenty[Math.floor(cur_val/Hundred)] + " " + multiple_Of_Hundreds[0] + "  " + lastPart;
	}
	
	if (cur_val >= 20) {
		var firstPart = spellCurrency(cur_val / 10);
		var lastPart = spellCurrency(cur_val % 10);
		if (lastPart == '') {
			return multiples_Of_Tens[(cur_val / 10) - 1];
		}
		return multiples_Of_Tens[Math.floor(cur_val / 10) - 1] + " " + lastPart;
	}
	return null;
}

function spellInWords(number) {	
	if (number == 0) {
		return "Zero Amount";
	}
	var num = Math.abs(number);
	var val = parseFloat(num, 10);
	var intValue = Math.floor(val);
	var str = val.toString();
	var dotIndex = str.indexOf('.');
	
	if (dotIndex != -1) {
		var suffix = str.substring(dotIndex);
		if (suffix != null && suffix != "" && suffix !=".0") {
			var fltValue = parseFloat(suffix, 10); 
			fltValue = fltValue * 100;
			var frac = Math.round(fltValue);
			return "Rupees " + spellCurrency(intValue) + " And  Paise " + spellCurrency(frac);
		}
		return "Rupees " + spellCurrency(intValue);
	}
	return "Rupees " + spellCurrency(intValue);	
}

