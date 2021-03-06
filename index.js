$(document).ready(function() {
    $('#tablediv').hide();
	$('#table_buttons').hide();
	$('#load_json_div').hide();
	init_banned_rules();
	init_intro();
});

var init_intro = function() {
	
	$('#input_sudoku_button').click(function(event) {
        event.preventDefault();
		$('#intro_container').hide();
        $('#tablediv').show();
		$('#table_buttons').show();
	});
	
	$('#solve').click(function(event) {
		event.preventDefault();
		get_data_and_solve();
	});
	
	$('#solve_steps').click(function(event) {
		event.preventDefault();
		get_data_and_solve_steps();
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
	
	$('#add_banned').click(function(event) {
        event.preventDefault();
        add_to_banned_list();
    });
	
	$('#load_sudoku_button').click(function(event) {
		event.preventDefault();
		$('#intro_container').hide();
		$('#table_buttons').show();
		$('#export_button').hide();
		$('#clear').hide();
		$('#solve_steps').hide();
		$('#solve').hide();
		$('#load_json_div').show();
	});
	
	$('#load_button_next').click(function(event) {
        event.preventDefault();
        var input_json = document.getElementById("pasted_puzzle_json").value;
        var grid = JSON.parse(input_json);
		$('#export_button').show();
		$('#clear').show();
		$('#solve_steps').show();
		$('#solve').show();
		$('#load_json_div').hide();
		$('#tablediv').show();
		fill_table(grid);
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
			 
bad_column =[0,0,0,0,0,0,0,0,0,
			 0,0,0,0,0,0,0,0,0,
			 0,0,0,0,0,0,0,0,0,
			 
			 0,0,0,0,0,0,0,0,0,
			 0,9,0,0,0,0,0,0,0,
			 0,0,0,0,0,0,0,0,0,
			 
			 0,0,0,0,0,0,0,0,0,
			 0,9,0,0,0,0,0,0,0,
			 0,0,0,0,0,0,0,0,0];

bad_row =   [0,0,0,0,0,0,0,0,0,
			 0,0,0,0,0,0,0,0,0,
			 0,0,0,0,0,0,0,0,0,
			 
			 0,9,0,0,0,0,9,0,0,
			 0,0,0,0,0,0,0,0,0,
			 0,0,0,0,0,0,0,0,0,
			 
			 0,0,0,0,0,0,0,0,0,
			 0,0,0,0,0,0,0,0,0,
			 0,0,0,0,0,0,0,0,0];
			 
bad_square =[0,0,0,0,0,0,0,0,0,
			 0,0,0,0,0,0,0,0,0,
			 0,0,0,0,0,0,0,0,0,
			 
			 9,0,0,0,0,0,0,0,0,
			 0,0,0,0,0,0,0,0,0,
			 0,0,0,9,0,0,0,0,0,
			 
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
		result.push(grid[el]);
		});
	window.banned_rules[i].forEach(function(el, index, array) {
		result.push(el);
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

var guess_one_and_solve2 = function(grid) {
	if (is_done(grid)) {
		return true;
	}
	var i = get_min_i(grid);
	var wyn = possible(grid, i);
	for (var j = 0; j < wyn.length; j++) {
		grid[i] = wyn[j];
		fill_table(grid);
		alert("Writing " + wyn[j] + " in column " + (i%9) + " and row " + (Math.floor(i/9)));
		maybe = solve_steps(grid);
		if (maybe) {
			return true;
		}
		alert("Guessed wrong! Going back...");
		grid[i] = 0;
		fill_table(grid);
	}
	grid[i] = 0;
	fill_table(grid);
	return false;
}

var solve = function(grid) {
	if (isSolvable(grid)) {
		return guess_one_and_solve(grid);
	} else {
		return false;
	}
}

var solve_steps = function(grid) {
	if (isSolvable(grid)) {
		return guess_one_and_solve2(grid);
	} else {
		return false;
	}
}

var get_data_and_solve = function() {
	var grid = get_data();
	
	if (check_possible(grid)) {	
		var solved = false;
		solved = solve(grid)

		if (!solved) {
			alert("Couldn't solve the puzzle!");
		} else {
			console.log(grid);
			fill_table(grid);
		}
	} else {
		alert("Puzzle is incorrect!");
	}
}

var get_data_and_solve_steps = function() {
	var grid = get_data();
	
	if (check_possible(grid)) {	
		var solved = false;
		solved = solve_steps(grid)

		if (!solved) {
			alert("Couldn't solve the puzzle!");
		} else {
			console.log(grid);
			fill_table(grid);
		}
	} else {
		alert("Puzzle is incorrect!");
	}
}

var check_possible = function(grid) {
	for (var i = 0; i <=8 ; i++) {
		var poss = true;
		var indexes = column(i);
		poss = poss && check_unique(indexes, grid);
		indexes = [];
		indexes = row(i*9);
		poss = poss && check_unique(indexes, grid);
		indexes = getSquare(getCorner(i),0);
		poss = poss && check_unique(indexes, grid);
		if (!poss) {
			return false;
		}
	}
	return check_banned(grid);
}

var check_unique = function(tab, grid) {
	var tmp = [];
	for (var i = 0; i < tab.length; i++) {
		if (grid[tab[i]] != 0) {
			tmp.push(grid[tab[i]]);
		}
	}
	tmp.sort(sortNumber);
	for (var i = 1; i < tmp.length; i++) {
		if (tmp[i] == tmp[i-1]) {
			return false;
		}
	}
	return true;
}

var check_banned = function(grid) {
	for (var i = 0; i <=80; i++) {
		if ((grid[i] != 0) && ($.inArray(grid[i], window.banned_rules[i]) != -1)) {
			return false;
		}
	}
	return true;
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
		if(grid[i] == 0) {
			document.getElementById('f_' + weird_order[i]).value = "";
		} else {
			document.getElementById('f_' + weird_order[i]).value = grid[i];
		}
	}
}


var clear_table = function() {
	for (var i = 0; i <=80; i++) {
		document.getElementById('f_' + weird_order[i]).value = "";
	}
	if (!(window.banned_list === 'undefined')) {
		init_banned_rules();
	}
}

var add_to_banned_list = function() {
    var row_n = parseInt(document.getElementById('row_number').value);
    var column_n = parseInt(document.getElementById('column_number').value);
    var banned_n = parseInt(document.getElementById('banned_number').value);

    var list_item = '<tr><td>' + row_n + '</td><td>' + column_n + '</td><td>' + banned_n + '</td></tr>';
    var list = $('#banned_list');
    list.append(list_item);
    var index = row_n * 9 + column_n;
	window.banned_rules[index].push(banned_n);
}

var init_banned_rules = function() {
	window.banned_rules = [];
	for (var i = 0; i <=80; i++) {
		window.banned_rules.push([-1]);
	}
	var new_tbody = document.createElement('tbody');
	$('#banned_list tr').remove();
	$('#banned_list').append('<tr><td>Row</td><td>Column</td><td>Number</td></tr>');
}

function exportJson(el) {
	var grid = get_data();
    var json = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(grid));
    el.setAttribute("href", "data:" + json);
    el.setAttribute("download", "puzzle.json");

}

