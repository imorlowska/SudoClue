$(document).ready(function() {
    $('#tablediv').hide();
});

var init_intro = function() {
	
	$('#load_button_next').click(function(event) {
        event.preventDefault();
        var input_json = document.getElementById("pasted_json").value;
        var parsed = JSON.parse(input_json);
        init_loaded(parsed);
	});
};

zeroes =    [0,0,0,0,0,0,0,0,0,
			 0,0,0,0,0,0,0,0,0,
			 0,0,0,0,0,0,0,0,0,
			 
			 0,0,0,0,0,0,0,0,0,
			 0,0,0,0,0,0,0,0,0,
			 0,0,0,0,0,0,0,0,0,
			 
			 0,0,0,0,0,0,0,0,0,
			 0,0,0,0,0,0,0,0,0,
			 0,0,0,0,0,0,0,0,0];

easy1 =     [1,0,0, 7,0,0, 0,0,0,
			 0,8,0, 0,0,0, 6,4,0,
			 0,0,2, 0,4,1, 0,0,0,
			 
			 0,0,6, 0,0,0, 2,0,3,
			 7,0,0, 0,1,9, 0,0,0,
			 0,0,0, 6,0,0, 0,5,9,
			 
			 0,0,0, 0,0,8, 0,2,0,
			 3,0,8, 0,0,4, 5,0,0,
			 0,1,0, 0,5,0, 0,6,0]
			 
medium1 =   [6,9,8, 1,0,0, 0,2,0,
			 0,0,0, 6,0,0, 0,0,0,
			 2,0,0, 0,9,0, 8,0,0,
			 
			 3,5,0, 0,7,0, 0,0,2,
			 0,0,0, 0,0,0, 0,0,0,
			 9,0,0, 0,6,0, 0,5,8,
			 
			 0,0,3, 0,2,0, 0,0,5,
			 0,0,0, 0,0,1, 0,0,0,
			 0,8,0, 0,0,4, 1,3,6]
					 
hard1 =     [0,1,4, 0,5,0, 0,0,2,
			 2,0,0, 0,0,0, 0,0,0,
			 6,0,0, 0,0,1, 0,9,0,
			 
			 0,0,0, 0,2,0, 1,0,9,
			 0,0,9, 0,6,0, 8,0,0,
			 7,0,6, 0,8,0, 0,0,0,
			 
			 0,4,0, 8,0,0, 0,0,3,
			 0,0,0, 0,0,0, 0,0,7,
			 5,0,0, 0,3,0, 9,8,0]
			 
superhard1 =[0,0,0, 0,5,6, 0,0,0,
			 0,2,0, 8,0,0, 0,0,4,
			 1,6,0, 2,0,0, 0,5,0,
			 
			 0,0,0, 9,0,0, 0,0,8,
			 7,0,5, 0,0,0, 2,0,6,
			 8,0,0, 0,0,3, 0,0,0,
			 
			 0,3,0, 0,0,9, 0,4,7,
			 6,0,0, 0,0,2, 0,9,0,
			 0,0,0, 4,1,0, 0,0,0]
			 
incorrect = [0,0,0, 0,0,0, 0,0,0,
			 0,0,0, 0,0,0, 0,0,0,
			 0,0,0, 0,0,0, 0,0,0,
			 
			 0,0,0, 0,0,0, 0,0,0,
			 0,0,0, 0,0,0, 0,0,0,
			 0,0,0, 0,0,0, 0,0,0,
			 
			 0,0,0, 0,0,0, 0,0,0,
			 0,0,0, 0,0,0, 0,0,1,
			 2,3,4, 5,6,7, 8,9,0]


var getColumn = function(n,i) {
	if (i == 9) {
		return []
	}
	var rest = getColumn(n+9, i+1)
	var narr = [n]
	return narr.concat(rest);
};
//get all indexes in a column that i comes from
var column = function(i) {
	return getColumn(i % 9, 0);
};

var getRow = function(n,i) {
	if (i == 9) {
		return []
	}
	var rest = getRow(n+1, i+1)
	var narr = [n]
	return narr.concat(rest);
};
//get all indexes from a row that i comes from
var row = function(i) {
	return getRow((Math.floor(i/9))*9, 0);
};

//get index of where n-th square starts
var getCorner = function(n) {
	if (n <= 2) {
		return n*3
	}
	if (n <=5) {
		return (n % 3) * 3 + 27
	}
	return (n % 3) * 3 + 54
};

var getSquare = function(n,i) {
	if (i == 3) {
		return []
	};
	var rest = getSquare(n+9, i+1)
	var narr = [n, n+1, n+2]
	return narr.concat(rest);
};
//get all indexes from a square that i comes from
var square = function(i) {
	return getSquare(getCorner(Math.floor(i/27)*3 + Math.floor((i % 9)/3)), 0)
};

var sortNumber = function(a,b) {
	return a-b;
};
var unique = function(tab) {
	var result = [];
	$.each(tab, function(i, el){
		if ($.inArray(el, result) === -1) result.push(el);
	});
	return result;
};
//get all relevant indexes for i
var relevant = function(i) {
	var col = column(i);
	var ro = row(i);
	var sq = square(i);
	return unique((sq.concat(col.concat(ro))).sort(sortNumber));
};

//impossible values for i
var impossible = function(grid, i) {
	if (!(grid[i] == 0)) {
		return [1,2,3,4,5,6,7,8,9]
	};
	var result = [];
	relevant(i).forEach(function(el, index, array){
		result.push(grid[el])
		});
	result = unique(result.sort(sortNumber));
	if (!($.inArray(0, result) === -1)) {
		result.shift();
	}
	return result;
};

//possible values for grid[i]
var possible = function(grid, i) {
	var imp = impossible(grid,i);
	var pos = [];
	for (i = 1; i <= 9; i++) {
		if ($.inArray(i,imp) === -1) {
			pos.push(i);
		};
	};
	return pos;
};

var isSolvable = function(grid) {
	for (i = 0; i <= 80; i++) {
		if (grid[i] === 0 && possible(grid,i).length === 0) {
			return false
		}
	}
	return true;
};

