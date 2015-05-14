$(document).ready(function() {
    $('#tablediv').hide();
	$('#table_buttons').hide();
	init_intro();
});

var init_intro = function() {
	
	$('#input_sudoku_button').click(function(event) {
        event.preventDefault();
		$('#intro_container').hide();
        $('#tablediv').show();
		$('#table_buttons').show();
		//var input_json = document.getElementById("pasted_json").value;
        //var parsed = JSON.parse(input_json);
        //init_loaded(parsed);
	});
	
	$('#solve').click(function(event) {
		event.preventDefault();
		get_data_and_solve();
	});
	
	$('#clear').click(function(event) {
		event.preventDefault();
		clear_table();
	});
	
	$('#back').click(function(event) {
        event.preventDefault();
       window.location.reload();
       console.log('hi');	   
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
			 
very_easy = [6,0,0, 8,0,5, 9,1,0,
			 9,4,1, 6,0,0, 5,0,0,
			 0,0,5, 1,4,0, 3,0,7,
			 
			 0,0,4, 5,8,1, 0,0,3,
			 0,6,0, 0,3,4, 7,2,0,
			 5,9,3, 0,0,0, 0,4,8,
			 
			 3,7,0, 0,1,8, 0,5,0,
			 0,5,2, 3,0,0, 4,0,1,
			 4,0,0, 0,5,2, 8,0,6];
			 
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
	for (var i = 1; i <= 9; i++) {
		if ($.inArray(i,imp) === -1) {
			pos.push(i);
		};
	};
	return pos;
};

var isSolvable = function(grid) {
	for (var i = 0; i <= 80; i++) {
		if (grid[i] === 0 && possible(grid, i).length === 0) {
			return false
		}
	}
	return true;
};

var solveAtLeastOneEasy = function(grid) {
	var didAtLeastOne = false;
	for (var i = 0; i <= 80; i++) {
		if (grid[i] === 0) {
			var pos = possible(grid, i);
			if (pos.length === 1) {
				didAtLeastOne = true;
				grid[i] = pos[0];
			}
		}
	}
	return [grid, didAtLeastOne];
}

var is_done = function(grid) {
	for (var i = 0; i <=80; i++) {
		if (grid[i] == 0) {
			return false;
		}
	}
	return true;
}

var get_min_i = function (grid) {
	var min = 9;
	for (var i = 0; i <= 80; i++) {
		var tmp = possible(grid, i).length;
		if (tmp > 0 && tmp < min) {
			min = tmp;
		}
	}
	
	for (var i = 0; i <= 80; i++) {
		if (possible(grid,i).length === min) {
			return i;
		}
	}
}

var guess_one_and_solve = function(grid) {
	if (is_done(grid)) {
		return true;
	}
	
	var i = get_min_i(grid);
	
	var wyn = possible(grid, i);
	for (var j = 0; j < wyn.length; j++) {
		grid[i] = wyn[j];
		//console.log(i, wyn[j], wyn, grid);
		maybe = solve(grid);
		if (maybe) {
			return true;
		}
	}
	grid[i] = 0;
	return false;
}

var solve = function(grid) {
	if (isSolvable(grid)) {
		return guess_one_and_solve(grid);
	} else {
		return false;
	}
}

var get_data_and_solve = function() {
	var grid = get_data();
	
	var solved = false;
	solved = solve(grid)

	if (!solved) {
		alert("Couldn't solve the puzzle!");
	} else {
		console.log(grid);
		fill_table(grid);
	}
}

weird_order = [ 0, 1, 2,  9,10,11, 18,19,20,
                3, 4, 5, 12,13,14, 21,22,23, 
				6, 7, 8, 15,16,17, 24,25,26,
				
				27,28,29, 36,37,38, 45,46,47,				
				30,31,32, 39,40,41, 48,49,50,
				33,34,35, 42,43,44, 51,52,53,
				
				54,55,56, 63,64,65, 72,73,74,
				57,58,59, 66,67,68, 75,76,77,
				60,61,62, 69,70,71, 78,79,80];
				

var get_data = function() {
	grid = [];
	for (var i = 0; i <= 80; i++) {
		var val = document.getElementById('f_' + weird_order[i]).value;
		if (val === "") { val = "0";}
		grid.push(parseInt(val));
	}
	return grid;
}

var fill_table = function(grid) {
	for (var i = 0; i <=80; i++) {
		document.getElementById('f_' + weird_order[i]).value = grid[i];
	}
}


var clear_table = function() {
	for (var i = 0; i <=80; i++) {
		document.getElementById('f_' + weird_order[i]).value = "";
	}
}


