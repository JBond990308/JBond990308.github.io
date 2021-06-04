String.prototype.startsWith = function(str) {
	return (this.match("^"+str)==str)
}

String.prototype.endsWith = function(str) {
	return (this.match(str+"$")==str)
}
/*retrieves the element by Id */
function getElemById(elementId) {
	var element = document.getElementById(elementId);
	return element;
}

/*retrieves the element by Name */
function getElemByName(elementName) {
	var collection = document.getElementsByName(elementName);
	return collection[0];
}

function getRadioValue(radioName) {
	var radioCollection = document.all ? document.all[radioName] : document.getElementsByName(radioName);
	if (radioCollection) {
		for(var i=0;i<radioCollection.length;i++){
			if (radioCollection[i].checked) {
				return radioCollection[i].value;
			}
		}
	}
	return "";
}

function getRadioButtonValue(elementName) {
	elementCollection = document.getElementsByName(elementName);
	var value = "";
	for(var i=0;i<elementCollection.length;i++){
		if(elementCollection[i].checked) {
			value = elementCollection[i].value;
		}
	}
	return value;
}


function validateRadioButton(elementName) {  
	var elementCollection = document.all?document.all[elementName]:document.getElementsByName(elementName);
	var flag = "false";
	for(var i=0;i<elementCollection.length;i++){
		if(elementCollection[i].checked) {
			flag = "true";
		}
	}
	if(flag=="false") {
		return false;
	} else {
		return true;
	}
}

/* flag signifies whether we also need to change the dtostatus value of the parent */
function changedtostatus(elementname, elementValue, flag) {
	var elementnamepart = new Array();
	elementnamepart = elementname.split(".");
	var s = "";
	for(var i = 0; i < elementnamepart.length - 1; i++){
		s=s+elementnamepart[i] + ".";
	}
	if (arguments.length == 3 && arguments[2] == true) {
		var s_old = s;
		changedtostatus(s.substring(0, s.length - 1), elementValue); 
		s = s_old;
	}
	s=s+"dtoStatus";
	var dtostatus=getElemById(s);
	if (dtostatus.value!="n"){
		if (arguments.length > 1) {
			dtostatus.value=arguments[1];
		} else {
			dtostatus.value="m";
		}
	}
	if (elementValue=="a") {
		dtostatus.value=elementValue;
	}
	if (dtostatus.onchange) {
		dtostatus.onchange();
	}
	top.pageDirty = true;
}

function markThePageAsDirty() {
	top.pageDirty = true;
}


/*
To add rows to a table dynamically. Table ID is passed as an argument. 
The function will copy all existing cells of the table and change the names of each cell to a new value by
  generating a new index.

An optional second argument can be passed. This should be an ID of any object within the form. 
  The second argument will be used to change any one of the cells in the new row to the values 
  for the object reference of the second argument.

Optional set of arguments can be passed beyond the second arguments. These arguments should be the name attributes of the
  elements whose value should not be reset when a new row is copied. In other words the values from the existing row should
  be maintained as it is.
 */

function addRowDOM(tableID) {

	var found = "false";
	var table = getElemById(tableID);
	if (table.rows.length == 1){
		var div = getElemById("newRow");
		var newRow= table.insertRow(table.rows.length);
		newRow.innerHTML = div.childNodes[1].rows[0].innerHTML;
	}
	else {
		var lastRow = table.rows[table.rows.length-1];
		newRow= table.insertRow(table.rows.length);
		newRow.innerHTML = lastRow.innerHTML;
	}
	for (var iCell=0; iCell < newRow.cells.length; iCell++){
		var newCell = newRow.cells[iCell];

		var cellHTML = newCell.innerHTML;
		calIndex = cellHTML.indexOf("NewCal");
		if (calIndex > 0){
			var commaIndex = cellHTML.indexOf("',false");
			cellHTML = cellHTML.substring(0, calIndex+8) +  changeIndex(cellHTML.substring(calIndex+8, commaIndex),1) + cellHTML.substring(commaIndex);
			var regex = new RegExp("onclick=\"return false\"");
			cellHTML = cellHTML.replace(regex, "");
			newCell.innerHTML = cellHTML;
		}

		if (newCell.childNodes[1]) {
			if (newCell.childNodes[1].name){
				newCell.childNodes[1].name = changeIndex(newCell.childNodes[1].name, 1);
			}
			if (newCell.childNodes[1].id){
				newCell.childNodes[1].id = changeIndex(newCell.childNodes[1].id, 1);
			}
			if (newCell.childNodes[1].name.indexOf("dtoStatus") > 0){
				newCell.childNodes[1].value="n";
			} else {
				found="false";
				for (var i=3;i<arguments.length;i++){
					if (newCell.childNodes[1].name.indexOf(arguments[i]) > 0) {
						found="true";
					}
				}
				if (found!="true") {
					newCell.childNodes[1].value="";
				}
			}
			if (arguments[2]){
				if (arguments[2]!=""){
					colNum = arguments[2].split(",");
					for (j=0;j<colNum.length;j++){
						if (iCell == colNum[j]){
							newCell.childNodes[1].style.display="";
							newCell.childNodes[1].disabled="";
						}
					}
				}
			}

			if (arguments[1]){
				if (trim(arguments[1])!=""){
					if (newCell.childNodes[1].name.indexOf(arguments[1]) > 0){
						newCell.childNodes[1].disabled = "";
						newNode = getElemById(arguments[1]);
//						nodeName=newCell.childNodes[1].name;
						newHTML = newCell.innerHTML.substring(0, newCell.innerHTML.indexOf(">")+1)
						newHTML = newHTML + newNode.innerHTML + "</SELECT>";
						newCell.innerHTML = newHTML;
					}
				}
			}
		}
	}
	if (table.rows.length > 2){
		arrayIndex = getElemById("arrayIndex");
		arrayIndex.value = eval(arrayIndex.value)+1;
	}
}

function changeIndex(name, index){
	l=name.indexOf("[");
	if (l==-1){
		return name;
	}
	r=name.indexOf("]");
	s=name.substring(0,l+1);
	i=eval(name.substring(l+1,r));
	i=i+index;
	s=s+i+name.substring(r);
	return s;
}

function deleteRowDOM(row){
	top.pageDirty=true;
	var changeRowNumber = row.parentNode.rows.length;
	for (i=0; i<row.cells.length; i++){
		if (row.cells[i].childNodes[1]){
			if (row.cells[i].childNodes[1].name.indexOf("dtoStatus") > 0){
				if (row.cells[i].childNodes[1].value == "n"){
					for (j=0; j<row.parentNode.rows.length; j++){
						if (row == row.parentNode.rows[j]){
							changeRowNumber=j;
						}
						if (j > changeRowNumber){
							for (k=0; k<row.parentNode.rows[j].cells.length; k++){
								if(row.parentNode.rows[j].cells[k].childNodes[1]){
									var newName = changeIndex(row.parentNode.rows[j].cells[k].childNodes[1].name, -1);
									row.parentNode.rows[j].cells[k].childNodes[1].name = newName;
								}
							}
						}
					}
					row.parentNode.removeChild(row);
					var arrayIndex = getElemById("arrayIndex");
					if (arrayIndex.value > 1){
						arrayIndex.value = eval(arrayIndex.value)-1;
					}
					return;
				} else {
					row.cells[i].childNodes[1].value="d";
					row.style.display="none";
					return;
				}
			}
		}
	}
}

/* flag signifies that status of the same id object in the parent frame needs to be changed accordingly */
function changeStatus(elementName, currentValue, flag) {
	var val;
	var elementnamepart = new Array();
	elementnamepart = elementName.split(".");
	var s = "";

	for(var i = 0; i < elementnamepart.length - 1; i++){
		s = s + elementnamepart[i] + ".";
	}
	if (arguments.length == 3 && arguments[2] == true) {
		temps = s + "dtoStatus";
	}	
	s = s + "initialStatus";

	var initialValueStr = getElemById(s).value;
	var initialValue = new Boolean(false);
	initialValue = initialValueStr=="true"?true:false;
	var newStatus;
	if (currentValue == initialValue) {
		newStatus = "a";
	} else {
		if (currentValue) {
			newStatus = "n";
		} else {
			newStatus = "d";		
		}
	}

	changedtostatus(elementName, newStatus);
	if (arguments.length == 3 && arguments[2] == true) {
		var elem = document.all ? window.parent.document.all[temps] : window.parent.document.getElementById(temps);		
//		AppscaleAlert(elem.value);
		elem.value = newStatus;
	}
}

function checkDuplicate(tableId, curRow, cellNo, curCell){
	table = getElemById(tableId);
	for (i=0;i<table.rows.length;i++){
		row = table.rows[i];
		if (row==curRow){
			continue;
		}
		if (row.style.display=='none'){
			continue;
		}
		cell=row.cells[cellNo-1];
		if (cell.childNodes[1]){
			if (cell.childNodes[1].value == curCell.value){
				alert (curCell.value + " is already defined for this object. Please choose a different value");
				curCell.value="";
				return false;
			}
		}
	}
	return true;
}

function isNumeric(value){
	return value!=parseFloat(value, 10)?false:true;
}

function isInteger(value){	
	var str = "^[+|-]?[0-9]*$";
	var regex = new RegExp(str);	
	if (!value) {
		value = "";
	}
	if (typeof(value) != "string" ) {
		value = value.toString();
	}	
	return regex.test(value);
}

/*Function to trim leading blanks
  Called by function trim
  Argument:Field to be trimmed*/

function ltrim(field){
	if(field==""||field==null){
		return field;
	}
	else{
		var len=field.length;
		var s=field;
		while(s.charAt(0)==" "){
			if(len==1){
				s="";
				return s;
			}
			else{
				s=s.substring(1,len);
				len=len-1;
			}
		}
		return s;
	}
}

/* Function to trim trailing blanks
   Called by function trim
   Argument:Field to be trimmed*/

function rtrim(field){
	if(field==""||field==null){
		return field;
	}
	else{
		var len=field.length;
		var s=field;
		while(s.charAt(len-1)==" "){
			if(len==1){
				s="";
				return s;
			}
			else{
				s=s.substring(0,len-1);
				len=len-1;
			}
		}
		return s;
	}
}

/*Function to trim leading and trailing blank spaces
  Argument:Field to be trimmed*/

function trim(field){
	var str=ltrim(field);
	str=rtrim(str);
	return str;
}

/* returns false if str has a space in between else returns true */
function checkForSpace(str) {
	for (var i = 0; i < str.length; i++) {
		if (str.charAt(i) == " ") {
			return false;
		}
	}
	return true;
}

/* Function that prints the number(Rupee Value) with commas for better comprehension
   Argument that needs to be passed is the currency amount */
function formatCurrency(currencyValue){
//	alert("curr = " + currencyValue);
	if(isNaN(currencyValue)){
		return "NaN";
	}
	var currencyString = new String(currencyValue);
	var sign = "";
	if(currencyString.charAt(0)=='+'||currencyString.charAt(0)=='-') {
		sign = currencyString.charAt(0);
		currencyString = currencyString.substring(1);
	}
	if(currencyString == ""){
		return "0.00";
	}
	var integerPart = "0";
	var decimalPart = "00";
	var currencyStringArray = new Array();
	var integerPartString = "";
	var integerPartSubstring = "";
	currencyStringArray = currencyString.split(".");
//	AppscaleAlert(currencyStringArray[0]);
	if(currencyStringArray.length >= 1){
		integerPart = currencyStringArray[0];
		if(integerPart != ""){
//			AppscaleAlert("integer part not empty");
			if(integerPart.length >= 4){
//				AppscaleAlert("length is greater than 4");
				if(parseInt(integerPart.length)%2 == 0){
//					AppscaleAlert("number is of even length");
					for(var i=0;i<integerPart.length;i++){
						if(i%2 == 0){
							integerPartString = integerPartString + integerPart.charAt(i) + ",";
//							AppscaleAlert(integerPartString);
						}else{
							integerPartString = integerPartString + integerPart.charAt(i);
//							AppscaleAlert(integerPartString);
						}
						integerPartSubString = integerPart.substring(i+1);
//						AppscaleAlert(integerPartSubString);
						if(integerPartSubString.length <= 3){
//							AppscaleAlert("true");
							integerPart = integerPartString + integerPartSubString;
							break;
						}
					}	
				}else{
//					AppscaleAlert("number is of odd length");
					for(var i=0;i<integerPart.length;i++){
						if(i%2 != 0){
							integerPartString = integerPartString + integerPart.charAt(i) + ",";
//							AppscaleAlert(integerPartString);
						}else{
							integerPartString = integerPartString + integerPart.charAt(i);
//							AppscaleAlert(integerPartString);
						}
						integerPartSubString = integerPart.substring(i+1);
//						AppscaleAlert(integerPartSubString);
						if(integerPartSubString.length <= 3){
//							AppscaleAlert("true");
							integerPart = integerPartString + integerPartSubString;
							break;
						}
					}
				}
			}
		}
	}
	if(currencyStringArray.length > 1){
		decimalPart = currencyStringArray[1];
		if(decimalPart != ""){
			if(decimalPart.length == 1){
				decimalPart = decimalPart + "0";
			}
		}
	}
//	AppscaleAlert("input number: " + currencyString + " / " + "formatted number: " + integerPart + "." + decimalPart);
	return sign + integerPart + "." + decimalPart;
}

function formatIntegerNumber(n) {
	var str = formatCurrency(n);
	return str.substring(0, str.indexOf("."));
}

/*Function that computes the day(i.e.,Monday,...)
  corresponding to the date passed
  Arguments: date-the name of the date variable in the form
             format-the format of the date(eg. yyyymmdd,yyyymondd,...)
             delimiter-the delimiter used(eg. ':','-',',',...)
             Note:The name of the date variable should end in .date
                  function will automatically set the corresponding day value
                  for a valid date which should end in .day/for an invalid date
                  will set day to ""*/

function day(date,format,delimiter){
	var elementnamepart=new Array();
	elementnamepart=date.split(".");
	s="";
	k="";
	for(var i=0;i<elementnamepart.length-1;i++){
		s=s+elementnamepart[i]+".";
	}
	k=s+"day";
	s=s+"date";
	var dateval=getElemById(s);
	var dayval=getElemById(k);
	var d=dateval.value;
	var datenamepart=new Array();
	var d1=validateInputDate(d,format,delimiter);
	if(d1==0){
		dayval.value="";
		dateval.focus();
		return false;
	}
	else{
		var val=d1.getDay();
		if(val==0){
			dayval.value="Sunday";
		}else if(val==1){
			dayval.value="Monday";
		}else if(val==2){
			dayval.value="Tuesday";
		}else if(val==3){
			dayval.value="Wednesday";
		}else if(val==4){
			dayval.value="Thursday";
		}else if(val==5){
			dayval.value="Friday";
		}else if(val==6){
			dayval.value="Saturday";
		}
	}
	return true;
}

/*Function which will validate an input string(date)
  Arguments:datetime-String(date)
            format-the format of the date(eg. yyyymmdd,yyyymondd,...)
            delimiter--the delimiter used(eg. ':','-',',',...)
            Returns 0 in case of invalid date
            and the date object in case of valid date
 * THIS FUNCTION MAY FAIL IF IN THE PATTERN, TIME COMES BEFORE DATE.
 */

function validateInputDate(datetime, format, delimiter) {
	format = format.replace("mon", "mmm"); // this is to make the unchanged code work. should be removed once dateformat is integrated in all the screens.
	format = format.toLowerCase();
	var timeavailable = "false";
	var datepart = new Array();
	var timepart = new Array();
	var datetimepart = new Array();
	datetime = trim(datetime);
	datetimepart = datetime.split(" ");
	var date = datetimepart[0];
	if (datetimepart.length == 2) {
		timeavailable = "true";
		var time = datetimepart[1];
		timepart = time.split(":");
	}
	datepart=date.split(delimiter);
	if (datepart.length != 3) {
		return 0;
	}

	var date_date,date_month,date_year;
	var dayIndex = format.indexOf("d");
	var monIndex = format.indexOf("m"); //this will be wrong when datetimepattern is hh:mm dd-yyyy-MM
	var yearIndex = format.indexOf("y");

	if (format.substring(0,1) == "d") {
		date_date = datepart[0];
		if (yearIndex < monIndex) {
			date_year = datepart[1];
			if (format.length == 8) {
				date_month=datepart[2];
			} else {
				date_month = findmonth(datepart[2]);
			}
		} else {
			date_year = datepart[2];
			if (format.length == 8) {
				date_month = datepart[1];
			} else {
				date_month = findmonth(datepart[1]);
			}
		}
	} else if (format.substring(0,1) == "m") {
		if (format.length == 8) {
			date_month = datepart[0];
			if (dayIndex < yearIndex) {
				date_date = datepart[1];
				date_year = datepart[2];
			} else {
				date_date = datepart[2];
				date_year = datepart[1];
			}
		} else {
			date_month = findmonth(datepart[0]);
			if (dayIndex < yearIndex) {
				date_date = datepart[1];
				date_year = datepart[2];
			} else {
				date_date = datepart[2];
				date_year = datepart[1];
			}
		}
	} else if (format.substring(0,1) == "y") {
		date_year = datepart[0];
		if(monIndex < dayIndex) {
			date_date = datepart[2];
			if (format.length == 8) {
				date_month = datepart[1];
			} else {
				date_month = findmonth(datepart[1]);
			}
		} else {
			date_date = datepart[1];
			if (format.length == 8) {
				date_month = datepart[2];
			} else {
				date_month = findmonth(datepart[2]);
			}
		}
	}
	var d = new Date(date_year, date_month);
	if (date_year == "") {
		return 0;
	}
	d.setFullYear(date_year);
	if (format.indexOf("mmm") == -1) {
		/*
		 * We have a two digit month value
		 */
		date_month = date_month - 1;
	}
	d.setMonth(date_month);
	d.setDate(date_date);
	if (timeavailable == "true") {
		d.setHours(timepart[0]);
		d.setMinutes(timepart[1]);
		d.setSeconds(timepart[2].substring(0,2));
	} else {
		d.setHours("0");
		d.setMinutes("0");
		d.setSeconds("0");
	}
	d.setMilliseconds("0");
	if (d.getFullYear() != date_year) {
		return 0;
	}

	if (d.getMonth() != date_month) {
		return 0;
	}

	if (d.getDate() != date_date) {
		return 0;
	}

	if (timeavailable == "true") {
		if (d.getHours() != timepart[0]) {
			return 0;
		}
		if (d.getMinutes() != timepart[1]) {
			return 0;
		}
		if (d.getSeconds() != timepart[2]) {
			return 0;
		}
	}

	return d;
}

/*Function that returns the numeric equivalent(i.e.,0-Jan,1-Feb,...)for the passed
  month(Jan,Feb,...)*/
function findmonth(month){

	var monthlc = month.toLowerCase();

	if (monthlc.substring(0,3) == "jan") {
		return 0;
	} else if (monthlc.substring(0,3) == "feb") {
		return 1;
	} else if (monthlc.substring(0,3) == "mar") {
		return 2;
	} else if (monthlc.substring(0,3) == "apr") {
		return 3;
	} else if (monthlc.substring(0,3) == "may") {
		return 4;
	} else if (monthlc.substring(0,3) == "jun") {
		return 5;
	} else if (monthlc.substring(0,3) == "jul") {
		return 6;
	} else if (monthlc.substring(0,3) == "aug") {
		return 7;
	} else if (monthlc.substring(0,3) == "sep") {
		return 8;
	} else if (monthlc.substring(0,3) == "oct") {
		return 9;
	} else if (monthlc.substring(0,3) == "nov") {
		return 10;
	} else if (monthlc.substring(0,3) == "dec") {
		return 11;
	} else {
		return -1;
	}
}

//function to refresh the contents of list window

function refreshFrame(){
	top.iframe.searchandresult.window.location=top.iframe.searchandresult.window.location;
}

//function to refresh the contents of contents window
function refreshContentFrame() {
	top.iframe.content.window.location=top.iframe.content.window.location;
}

function changeFrameSize(framesetId, attribute, value) {
	var frameset = document.all?top.iframe.document.all[framesetId]:top.iframe.document.getElementById(framesetId);
	if (attribute=='rows'){
		frameset.rows=value;
	} else {
		frameset.cols=value;
	}
}

function changeFrameWindow(){
	if (top.pageDirty){
		if (!confirm("There are unsaved changes. Do you want to continue?")){
			return false;
		}
		else {
			top.pageDirty = false;
		}
	}
	var frameId;
	var frameSource;
	var frame;
	for (var i=0;i<arguments.length;i=i+2){
		frameId=arguments[i];
		frameSource=arguments[i+1];
		if (top.iframe) {
			frame = document.all?top.iframe.document.all[frameId]:top.iframe.document.getElementById(frameId);
		} else {
			frame = document.all?top.document.all[frameId]:top.document.getElementById(frameId);
		}

		if (!frame) {
			frame = document.all?top.iframe.content.document.all[frameId]:top.iframe.content.document.getElementById(frameId);
		}

		if (document.all){
			frame.src = frameSource;
		} else {
			frame.contentDocument.location.href=frameSource;
		}
//		AppscaleAlert(top.pageDirty);
//		AppscaleAlert(top.pageDirty);
//		alert (frameId);
//		alert (frameSource);
//		alert (frame.contentDocument.location.href);
		if (top.pageDirty) {
			AppscaleAlert(top.pageDirty);
			return false;
		}
	}
	return true;
}

//changeFrameWindow(frameId,framesource and so on)

//The JavaScript below is for effects while clicking menu items in the left menu of the application

function MenuColorChange(cell, eventName){
	if (eventName=="mouseOver"){
		cell.bgColor='#CCCCFF';
		return;
	}
	for (i=2;i<arguments.length;i++){
		var table = getElemById(arguments[i]);
		for (j=1;j<table.rows.length;j++){
			if (table.rows[j].cells[0]!=cell){
				if (table.rows[j].cells[0].bgColor.toUpperCase()=='#CCCCFF'){
					var found = "true";
					var oldCell = table.rows[j].cells[0];
				}
			}
		}
	}
	if (eventName!="mouseOut"){
		cell.bgColor='#CCCCFF'; 
		if (found=="true") {
			oldCell.bgColor='#FFFFFF'; 
		}
	}
	else {
		if (found){
			cell.bgColor='#FFFFFF';
		}
	}
}

function monthName(mon, isLong) {
	if (mon < 0 || mon > 11) {
		return "";
	}
	var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
	return isLong ? monthNames[mon] : monthNames[mon].substring(0, 3);
}

function isLeapYear(year) {
	if (year % 4 == 0) {
		if (year % 100 == 0) {
			if (year % 400 == 0) {
				return 1;
			} else {
				return 0;
			}
		}
		return 1;
	} 
	return 0;
}

function getPreviousDate(curtDate) {
	var oneDay = 24 * 60 * 60 * 1000; // One day in milli seconds
	var dayInMs = curtDate.getTime() - oneDay;
	var prevDate = new Date(dayInMs);
	return prevDate;
}

function isDateinCorrectFormat(date) {
	if (parseInt(date[0]) < 0 || parseInt(date[0]) > 31) {
		return false;
	}
	var mon = findmonth(date[1]);
	if (mon == -1) {
		return false;
	}
	if (date[2] <= 0) {
		return false;
	}
	if (mon == 1 || mon ==  3 || mon == 5 || mon == 8 || mon == 10) {
		if (date[0] > 30) {
			return false;
		}
	} 
	if (mon == 1) {
		if (date[0] > 29) {
			return false;
		}
	}
	if (isLeapYear(date[2]) == 0) {
		if (mon == 1 && date[0] == 29) {
			return false;
		}
	}
	return true;
}

function warnIfDirty(){
	if (top.pageDirty){
		return "There are unsaved data in this page";
	}
}

function resetAllDescendantPages() {
	if (top.pageDirty){
		if (!confirm("There are unsaved changes. Do you want to continue?")) {
			return false;
		}	
	}
	top.pageDirty = false;
	if (top.iframe) {
		top.iframe.pageDirty = false;
		if (top.iframe.topbanner) top.iframe.topbanner.pageDirty = false;
		if (top.iframe.topmenu) top.iframe.topmenu.pageDirty = false;
		if (top.iframe.leftmenu) top.iframe.leftmenu.pageDirty = false;
		if (top.iframe.searchandresult) top.iframe.searchandresult.pageDirty = false;
		if (top.iframe.heading) top.iframe.heading.pageDirty = false;
		if (top.iframe.content) top.iframe.content.pageDirty = false;
		if (top.iframe.footer) top.iframe.footer.pageDirty = false;
	}
	return true;
}

function resetPage(){
	top.pageDirty = false;
}

function checkAndConvertDate(dateId) {
	var d = document.getElementById(dateId);
	var datePart = d.value.split("-");
	if(datePart.length == 3 && isDateinCorrectFormat(datePart)) {
		d.value = datePart[2] + "-" + (findmonth(datePart[1]) + 1) + "-" + datePart[0];
		return true;
	} else {
		return false;
	}
}

//This function pops up a window for taxlaw lookup 
//url should have following pattern..
//"PopupTaxLawWindow.do?subject=deduction&textBoxId=hodTaxLaw&objIdFieldId=hodObjId&dtoStatusId=dtoId"
//where subject can be one among deduction, pay or rebate.
//textBoxId is the input box where the tax law section will be displayed
//objIdFieldId corresponds to the id of the hidden field where we capture the objId for the tax. 
//dtostatusId corresponds to the dtoStatus Id of the invoking object 
function popUpTaxLawWindow(url) {
	popupWindow(url, 530, 710);
}

function processTransactionTypes(colNumArr){
	if (!isDefined('obj')) {
		/*
		 * skip the function if there is no grid at all.
		 */
		return;
	}
	var rowNum = obj.getRowProperty("count");
	var s = "";
	var x = -1;
	for(var j=0;j<colNumArr.length;j++) {
		x = colNumArr[j];
		for(var i=0;i<rowNum;i++){
			s = gridData[i][x];
			if(s == "S") {
				gridData[i][x] = "Submitted";
			} else if(s == "R") {
				gridData[i][x] = "Rejected";
			} else if(s == "A") {
				gridData[i][x] = "Approved";
			} else if(s == "T") {
				gridData[i][x] = "Returned";
			} else {
				gridData[i][x] = "ReSubmitted";
			}
		}
	}
	obj.refresh();
}

function processAmounts(colNumArr){
	var rowNum = obj.getRowProperty("count");
	var s = "";
	var x = -1;
	for(var j=0;j<colNumArr.length;j++) {
		x = colNumArr[j];
		for(var i=0;i<rowNum;i++){
			s = gridData[i][x];
			if(s == "") {
				s = "0.0";
			}
			gridData[i][x] = s;
		}
	}
	obj.refresh();
}

function popupPayHistory(url) {
	popupWindow(url, 600, 750);
}

function popupWindow(url, popupheight, popupwidth) {

	var popheight = 500;
	var popwidth = 800;

	if (arguments[1]) {
		popheight = popupheight;
	}

	if(arguments[2]) {
		popwidth = popupwidth;
	}

	var topPos = (screen.height - popupheight)/2;
	var leftPos = (screen.width - popupwidth)/2;

	var str = "height=" + popheight + ",width=" + popwidth + ",scrollbars=yes,resizable=yes,top="+ topPos + ",left=" + leftPos + ",screenX=" +topPos +",screenY=" + leftPos;   
	newWindow = window.open(url, 'popupWindow', str);
	if (window.focus) {
		newWindow.focus();
	}
}

function modalWindowIE(url, parentF, searchcontext) {
	modalWindow(url + "?parentF=" + parentF + "&searchcontext=" + searchcontext, 300, 840);
}

function modalWindow(url, popupheight, popupwidth) {

	var popheight = 500;
	var popwidth = 800;

	if (arguments[1]) {
		popheight = popupheight;
	}

	if(arguments[2]) {
		popwidth = popupwidth;
	}

	var str = "dialogHeight:" + popheight + "px" + "; dialogWidth:" + popwidth + "px" + "; scroll:yes; center:yes;";
	window.showModalDialog(url, "", str);
}


function alertError(){
	if (errorMessage.length > 0) {
		AppscaleAlert(errorMessage);
	}
}

function ChangeSubmenu(index) {

	var cIndex;

	if (arguments[1]) {
		cIndex = top.iframe.topmenu.window["currentSubmenuIndex"];
	} else {
		cIndex = currentSubmenuIndex;
	}

	var curText;
	if (arguments[1]) 
		curText = top.iframe.topmenu.document.getElementById("SubmenuText" + cIndex);
	else 
		curText = getElemById("SubmenuText" + cIndex);

	curText.style.display = "none";

	var curtHiddenLink;
	if (arguments[1]) 
		curtHiddenLink = top.iframe.topmenu.document.getElementById("SubmenuLink" + cIndex);
	else 	
		curtHiddenLink = getElemById("SubmenuLink" + cIndex);

	curtHiddenLink.style.display = "";

	var nextHiddenLink;
	if (arguments[1]) 
		nextHiddenLink = top.iframe.topmenu.document.getElementById("SubmenuLink" + index);
	else 
		nextHiddenLink = getElemById("SubmenuLink" + index);

	nextHiddenLink.style.display = "none";

	var nextText;
	if (arguments[1]) 
		nextText = top.iframe.topmenu.document.getElementById("SubmenuText" + index);
	else 
		nextText = getElemById("SubmenuText" + index);

	nextText.style.display = "";

	if (arguments[1]) 
		top.iframe.topmenu.window["currentSubmenuIndex"] = index;
	else 
		currentSubmenuIndex = index;
}

/* function to change the color of the left menus */
function ChangeMenuColor(trId) {
	var curtMenu;
	var nextMenu;
	if (arguments[1]) {
		curtMenu = top.iframe.leftmenu.document.getElementById(top.iframe.leftmenu.currentLeftMenuId);
		nextMenu = top.iframe.leftmenu.document.getElementById(trId);
	} else { 
		curtMenu = getElemById(currentLeftMenuId);
		nextMenu = getElemById(trId);
	}
	var ptr = 0;
	var cPtr = 0;	

//	We use tagName attribute to ignore the unnecessarry white space between td's. But
//	we still assume each tr (corresponding to a submenu) will have exactly 4 td's as it's 
//	children element and nothing else except white space.

	if (curtMenu) {
		while (cPtr < 2) {
			if (curtMenu.childNodes[ptr].tagName) {
				curtMenu.childNodes[ptr].style.display = "";
				cPtr++;
			}
			ptr++;
		}

		while (ptr < curtMenu.childNodes.length) {
			if (curtMenu.childNodes[ptr].tagName) {
				curtMenu.childNodes[ptr].style.display = "none";
				cPtr++;
			}
			ptr++;
		}
		curtMenu.className = "LeftMenuNotSelected";
	}

	ptr = 0;
	cPtr = 0;	
	while (cPtr < 2) {
		if (nextMenu.childNodes[ptr].tagName) {
			nextMenu.childNodes[ptr].style.display = "none";
			cPtr++;
		}
		ptr++;
	}

	while (ptr < nextMenu.childNodes.length) {
		if (nextMenu.childNodes[ptr].tagName) {
			nextMenu.childNodes[ptr].style.display = "";
			cPtr++;
		}
		ptr++;
	}

	nextMenu.className = "LeftMenuSelected";

	currentLeftMenuId = trId;
	if (arguments[1]) {
		top.iframe.leftmenu.currentLeftMenuId = trId;	
	}
}

/* Function to change the value of the heading */
function changeHeadingValue(arg) {
	top.headingValue = arg;
}

function setHeadingValue() {
	var headingValue = top.iframe.heading.document.getElementById('HeadingValue');
	if(headingValue && top.headingValue) {
		headingValue.innerHTML = top.headingValue;
	}
}

/* Function to change the Employee Submenu color */ 
function changeEmployeeSubmenuColor(index) {

	var prevLeft = getElemById(curtSubmenuIndex + "l");
	prevLeft.childNodes[0].src = "images/innerTabLftImg.gif";

	var  prevMid = getElemById(curtSubmenuIndex + "m");
	prevMid.className = "InnerNormalTD";
	prevMid.childNodes[0].style.display = "";
	prevMid.childNodes[1].style.display = "none";

	var prevRight = getElemById(curtSubmenuIndex + "r");
	prevRight.childNodes[0].src = "images/innerTabRtImg.gif";	

	var nextLeft = getElemById(index + "l");
	nextLeft.childNodes[0].src = "images/innerTabLftImgHi.gif";

	var  nextMid = getElemById(index + "m");
	nextMid.className = "InnerHighLightTD";
	nextMid.childNodes[0].style.display = "none";
	nextMid.childNodes[1].style.display = "";

	var nextRight = getElemById(index + "r");
	nextRight.childNodes[0].src = "images/innerTabRtImgHi.gif";
	curtSubmenuIndex = index;
}

function disableObject(elemId) {
	var object = getElemById(elemId);
	object.disabled = true;	
}


function hideObject(elemId) {
	var object = getElemById(elemId);
	object.style.display = 'none';	
}

function getframeset3RowsProperty(){
	var frameset3 = top.iframe.document.getElementById("frameset3");
	return frameset3.rows;
}

function maximizeOrRestore(headingHeight){
	if (isMaximized) {
		var image = getElemById("MaxOrRestoreGIF");
		image.src = "images/maximize.gif";
		changeFrameSize("frameset3", "rows", rowsProperty);
		isMaximized = false;
	} else {
		var image = getElemById("MaxOrRestoreGIF");
		image.src = "images/restore.gif";
		rowsProperty=getframeset3RowsProperty();
		headingHeight=rowsProperty.split(',')[1];
//		sAndRHeight=rowsProperty.split(',')[0];
//		sAndRHeight = sAndRHeight.split("%")[0];
//		for (var x=sAndRHeight-1; x>=5; x--) {
//		changeFrameSize("frameset3", "rows", x+"%,"+headingHeight+",*");
//		pause(100);
//		}
		changeFrameSize("frameset3", "rows", "5,"+headingHeight+",*");
		isMaximized = true;
	}
}

function FindEmployee(url, parentF, searchContext) {
	popupWindow(url + "?parentF=" + parentF + "&searchcontext=" + searchContext, 300, 840);
}

function FindEmployeeForPayroll(url, parentF, searchContext) {
	popupWindow(url + "&parentF=" + parentF + "&searchcontext=" + searchContext, 300, 840);
}


function ShowSearchedEmployee(url, parentF, searchContext) {
	popupWindow(url + "&parentF=" + parentF + "&searchcontext=" + searchContext, 300, 840);
}

function FindUser(url, parentF, searchContext) {
	popupWindow(url + "?parentF=" + parentF + "&searchcontext=" + searchContext, 300, 840);
}

function findDaysInAMonth(mon, year) {
	var days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

	if (isLeapYear(year)) {
		days[1] = 29;
	}

	return days[mon]; 
}

function calculateNMonthEarlyDate(date, n) {

	var days = 0;
	var monIndex = date.getMonth();
	var year = date.getFullYear();

	var oneDay = 24 * 60 * 60 * 1000;

	for (var i = 0; i < n; i++)	{

		prevMon = (monIndex + 11) % 12;

		if (prevMon > monIndex) {
			year = year - 1;
		}

		days = days + findDaysInAMonth(prevMon, year);
		monIndex = prevMon;
	}

	var d = new Date();
	d.setTime(date.getTime() - (oneDay * days));
	return d;
}

function calculateNMonthLaterDate(date, n) {

	var days = 0;
	var year = date.getFullYear();
	var monIndex = date.getMonth();
	var oneDay = 24 * 60 * 60 * 1000;

	for (var i = 0; i < n; i++)	{

		days = days + findDaysInAMonth(monIndex, year);
		var nextMon = (monIndex + 1) % 12; 

		if (nextMon < monIndex) {
			year = year + 1;
		}

		monIndex = nextMon;
	}

	var d = new Date();
	d.setTime(date.getTime() + (oneDay * days));
	return d;	
}

function incrementCounter(elemId) {
	var elem = getElemById(elemId);
	elem.value = parseInt(elem.value, 10) + 1;
}  

function decrementCounter(elemId) {
	var elem = getElemById(elemId);
	elem.value = parseInt(elem.value, 10) - 1;
}  

function AppscaleAlert(message) {
	message = message.toString();
	message = message.replace(/&nbsp;/g, " "); 
	message = message.replace(/<br>/g, "\n");
	alert(message);
	/*
// code to display alert messages using dialog scripts
	//First convert all \n to <br>
	message = message.replace(/\n/g, "<br>");
	//Now use the dialog script to display the message
	var hght=145;
	var wdth=325;

	var lines = findNumberOfLines(message, 50);
	if (lines > 5) {
		lines = findNumberOfLines(message, 75);
		wdth=525;
	}
	hght = lines*20 + 40;
	if (hght < 145) {
		hght = 145;
	}

	top.Dialog.alert(message, {windowParameters: {className: "mydialog", title: "HRWorks Alert", height:hght, width:wdth, showEffectOptions: {duration:0.5}}, okLabel: "OK"});
	 */
}


function AppscaleConfirm(message, link) {
	message = message.toString();
	message = message.replace(/&nbsp;/g, " "); 
	message = message.replace(/<br>/g, "\n");
	if (confirm(message)) {
		return true;
	}
	return false;
	/*
// code to display alert messages using dialog scripts
	//First convert all \n to <br>
	message = message.replace(/\n/g, "<br>");
	//Now use the dialog script to display the message	
	var hght=145;
	var wdth=325;

	var lines = findNumberOfLines(message, 50);
	if (lines > 5) {
		lines = findNumberOfLines(message, 85);
		wdth=525;
	}
	hght = lines*25 + 40;
	if (hght < 145) {
		hght = 145;
	}

	top.Dialog.confirm(message, {windowParameters: {className: "mydialog", title: "HRWorks Confirm", height:hght, width:wdth, showEffectOptions: {duration:0.5}}, okLabel: "YES", cancelLabel: "NO", ok:function(win){document.location.href=link;}});
	 */
}

function findNumberOfLines(str1, charsPerLine) {
	var array = str1.split("<br>");
	var lines = 0;
	for (i=0;i<array.length;i++) {
		lines = lines + Math.ceil(array[i].length/charsPerLine);
	}
	return lines;
}

function closeMe() {
	var parent = top.opener;
	if (parent) {
		if (parent.focus) {
			parent.focus();
		}
	}
	top.close();
}

/*
 * Returns a formatted number corresponding to value. 
 * It fixes n digits after decimal point after rounding.
 * toFixed(0, 2) returns 0.00
 * toFixed(12.123, 2) returns 12.12
 * n should be greater than 0, otherwise function will not work.
 */
function toFixed(value, n) {
	if (!value) {
		value = "0";
	}	
//	alert("val = " + value);
	if (n > 0) {
		var tmp = Math.pow(10, n);
		value = Math.round(value * tmp) / tmp;
	}
//	alert("rounded val = " + value);	
	var number = Number(value);
	return number.toFixed(n);
}

/*
 * Returns the delimiter from dateFormat. Here we assume that delimiter 
 * is non-alphabetic and exactly one charecter in length. We also assume 
 * that format will have only one delimiter.
 * findDelimiter("dd-MMM-yyyy") returns "-"
 * findDelimiter("dd/MM/yyyy") returns "/" 
 * findDelimiter("ddMMMyyyy") returns ""  
 */
function findDelimiter(format) {
	var re = new RegExp("[^a-z|A-Z]{1}");
	re.exec(format);
//	alert(format);
	return RegExp.lastMatch ? RegExp.lastMatch : ""; 
}


function keepinArray(yearsArray, year) {
	var add = true;
	for (var i = 0; i < yearsArray.length; i++) {
		if (yearsArray[i] == year) {
			add = false;
			break;
		}
	}
	if (add == true) {
		yearsArray[yearsArray.length] = year;
	} 
}
/*
 * trims delimiters from datePattern
 * trimDelimiter("dd-MMM-yyyy") --> ddMMMyyyy
 * trimDelimiter("yyyy/MM/dd") --> yyyyMMdd
 */
function trimDelimiter(format) {
	if (!format) {
		return "";
	}
	var re = new RegExp(findDelimiter(format), "g");
	return format.replace(re, ""); 
}

/*
 * Returns a formatted string corresponding to a date object.
 * depending on the format. Here we assume only three (ddMMyyyy,
 * MMddyyyy and yyyyMMdd) of the six day-mon-year combination
 * to be valid. 
 */
function findDateInWords(date, format) {

	format = format.toUpperCase();
	var day = date.getDate();
	var year = date.getFullYear();
	var month = "";
	var delim = findDelimiter(format);

	if (format.toUpperCase().indexOf("MMM") < 0) {
		month = date.getMonth() + 1;
	} else if (format.toUpperCase().indexOf("MMMM") < 0) {
		month = monthName(date.getMonth())
	} else {
		month = monthName(date.getMonth(), true);
	}

	var dayIndex = format.indexOf("D");
	var monIndex = format.indexOf("M"); 
	var yearIndex = format.indexOf("Y");

	if (dayIndex < monIndex && monIndex < yearIndex) {
		return day + delim + month + delim + year;
	} else if (monIndex < dayIndex && dayIndex < yearIndex) {
		return month + delim + day + delim + year;
	} else {
		return year + delim + month + delim + day;
	}
}

/**
 * checks if a variable is defined.
 * variable means variable name here. e.g. 
 * if you want to test whether obj 
 * is defined or not you need to call 
 * isDefined('obj')
 * returns true if variable is defined, otherwise false. 
 */
function isDefined(variable) {
	return (typeof(window[variable]) == "undefined") ? false : true;
}

function htmlEncode(text) {
	if (!text) {
		text = "";
	} else {
		text = text.toString();
	}
	return text.replace(/&/g, "&amp;");
}

function pause(millis) {
	date = new Date();
	var curDate = null;

	do { var curDate = new Date(); }
	while(curDate-date < millis);
}

function roundOff(value, precision) {
	value = "" + value;
	precision = parseInt(precision);
	var whole = "" + Math.round(value * Math.pow(10, precision));
	var decPoint = whole.length - precision;
	if(decPoint != 0) {
		result = whole.substring(0, decPoint);
		result += ".";
		result += whole.substring(decPoint, whole.length);
	}
	else {
		result = whole;
	}
	return result;
}

function resetElement(id) {
	var elem = getElemById(id);
	elem.value = "";
	if (elem.onchange) {
		elem.onchange();
	}
}

function selectall(elemId, gridElemNamePrefix, dataArr, colArr, colIndex) {
	var elem = getElemById(elemId);

	if (elem.checked) {
		var regExp = new RegExp("CHECKED","ig");
		elem.checked = false;
		colArr[colIndex] = colArr[colIndex].replace(regExp, "");

		for (var i = 0; i < dataArr.length; i++) {
			elem = getElemById(gridElemNamePrefix + "[" + i + "].isActive");
			if (elem.checked) {
				elem.checked = false;
				if (elem.onchange) {
					elem.onchange();
				}
			}
		}

		return;
	}

	var regExp = new RegExp(">","g");
	elem.checked = true;
	colArr[colIndex] = colArr[colIndex].replace(regExp, " checked>");

	for (var i = 0; i < dataArr.length; i++) {
		elem = getElemById(gridElemNamePrefix + "[" + i + "].isActive");
		if (!elem.checked) {
			elem.checked = true;
			if (elem.onchange) {
				elem.onchange();
			}
		}
	}
}

function unselect(elemName, selectallbox, colArr, colIndex) {
	var elem = getElemById(elemName);
	if (!elem.checked) {
		var regExp = new RegExp("CHECKED","ig");
		elem = getElemById(selectallbox);
		elem.checked = false;
		colArr[colIndex] = colArr[colIndex].replace(regExp, "");
	}
}

function clearHTMLTags(html) {
	if (!html) html = "";
	html = html.replace(/<\s*br\s*[\/]?>/ig, "\n");
	html = html.replace(/<[a-z|A-Z|\/][^>]*>/g, ""); //remove all html tags.
	/* 
	 * now remove html character entity references which have an ascii equivalent 
	 * Note: This list may not include all possible entity references.
	 */
	html = html.replace(/&nbsp;/g, " ");
	html = html.replace(/&minus;/g, "-");
	html = html.replace(/&quot;/g, "\"");
	html = html.replace(/&amp;/g, "&");
	html = html.replace(/&lt;/g, "<");
	html = html.replace(/&gt;/g, ">");
	html = html.replace(/&tilde;/g, "~");
	html = html.replace(/&circ;/g, "^");		
	return html;
}
function sanitizeHTML(html) {
	if (!html) html = "";
	html = html.replace(/<\s*br\s*[\/]?>/ig, "\n");
	html = html.replace(/<[a-z|A-Z|\/][^>]*>/g, ""); //remove all html tags.	
	html = html.replace(/["()]/g, "");
	/* 
	 * now remove html character entity references which have an ascii equivalent 
	 * Note: This list may not include all possible entity references.
	*/
	html = html.replace(/&nbsp;/g, " ");
	html = html.replace(/&minus;/g, "-");
	html = html.replace(/&quot;/g, "\"");
	html = html.replace(/&amp;/g, "&");
	html = html.replace(/&lt;/g, "<");
	html = html.replace(/&gt;/g, ">");
	html = html.replace(/&tilde;/g, "~");
	html = html.replace(/&circ;/g, "^");
	return html;
}
//This function is used to copy the entire inner HTML elemnts to a desired document
function copyElements(elems, destDocument) {
	for (var i=elems.length; i-->0;) {
		var elem = elems[i];
		if (elem.id) {
			var elemParent = destDocument.getElementById(elem.id);
			if (!elemParent) continue;
			if (elem.options) {
				for(var j=elem.options.length; j-->0;) {
					elemParent.options[j].selected = elem.options[j].selected;
				}
			} else {
				elemParent.value = elem.value;
				elemParent.checked = elem.checked;
			}
		}
	}
}

function dateString(dt, dateFormat) {
	var dateString = dateFormat;
	var dateString = dateFormat.replace(/MMMM/, monthName(dt.getMonth(), true));
	dateString = dateString.replace(/MMM/, monthName(dt.getMonth(), false));
	dateString = dateString.replace(/MM/, dt.getMonth()<9?"0"+(dt.getMonth()+1):(dt.getMonth()+1)+"");
	dateString = dateString.replace(/yyyy/, dt.getFullYear());
	dateString = dateString.replace(/dd/, dt.getDate()<=9?"0"+dt.getDate():dt.getDate()+"");
	return dateString;
}

function CheckSpecialChar(data){      
   var iChars = "`!@#$%^&*()+=-[]\';,./{}|:<>?~_";
   for (var i = 0; i < data.length; i++) {
  	 if (iChars.indexOf(data.charAt(i)) != -1) {  	  
  	  return true;
  	 }
   }   
}

function fileExtension(fileName) {
   if(fileName.lastIndexOf(".")!= 0){ 
      var fileExtension=fileName.substr(fileName.lastIndexOf(".")+1).toLowerCase();
      if(fileExtension == "xlsx" || fileExtension == "jpeg" || fileExtension== "jpg" ||fileExtension== "png" || fileExtension== "zip"){
	      return fileName;
      } else{	
    	  return null;
      }
   }
}
function pdfFileExtension(fileName) {
   if(fileName.lastIndexOf(".")!= 0){ 
      var fileExtension=fileName.substr(fileName.lastIndexOf(".")+1).toLowerCase();
      if(fileExtension== "pdf"){
	      return fileName;
      } else{	
    	  return null;
      }
   }
}

function zipFilesExtension(fileName) {
   if(fileName.lastIndexOf(".")!= 0){ 
      var fileExtension=fileName.substr(fileName.lastIndexOf(".")+1).toLowerCase();
      if(fileExtension== "zip"){
	      return fileName;
      } else{	
    	  return null;
      }
   }
}
