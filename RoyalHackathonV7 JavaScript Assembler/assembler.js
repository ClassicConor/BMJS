
var input_string = "";
var memory = new Array(256).fill(0x00);


function read_textbox() {
    console.log("read_textbox");
    console.log(document.getElementById("text").value);
    input_string = document.getElementById("text").value;
}

function preproccess() {
    var all_lines = input_string.split("\n");

    for (var i = 0; i < all_lines.length; i++) {
        // remove whitespace
        all_lines[i] = all_lines[i].split(" ").join("");

        // remove comments
        for (var j = 0; j < all_lines[i].length; j++) {
            if (all_lines[i][j] == "#") {
                all_lines[i] = all_lines[i].slice(0, j);
                break;
            }
        }
    }

    // remove empty lines
    var parsed_lines = [];
    for (var j = 0; j < all_lines.length; j++) {
        if (all_lines[j] != "") {
            parsed_lines.push(all_lines[j]);
        }
    }
    console.log(parsed_lines);

    //index labels
    var labels = {};
    for (i = 0; i < parsed_lines.length; i++) {
        if (parsed_lines[i].includes(":")) {
            var label = parsed_lines[i].split(":")[0];
            parsed_lines[i] = parsed_lines[i].split(":")[1];
            labels[label] = 2 * i;
        }
    }
    console.log("labels = ");
    console.log(labels);

    // replacing labels with addresses
    for (i = 0; i < parsed_lines.length; i++) {
        for (var label in labels) {
            if (parsed_lines[i].includes(label)) {
                parsed_lines[i] = parsed_lines[i].replace(label, labels[label]);
            }
        }
    }
    return parsed_lines
}

function assemble() {
    var parsed_lines = preproccess();
    console.log(parsed_lines);
    console.log(parsed_lines.length)
    output = [];

    var curr_address = 0;
    for (let i = 0; i < parsed_lines.length; i++) {
        var line = parsed_lines[i];
        if (line.includes("DATA")) {
            output = instruction_data(line);
        }
        else if (line.includes("HALT")) { //finished
            output = instruction_halt(line);
        }
        else if (line.includes("ADDF")) { // finished
            output = instruction_add(line, "F");
        }
        else if (line.includes("ADDI", "I")) {// finished
            output = instruction_add(line);
        }
        else if (line.includes("NOP")) { // finished
            output = instruction_no_operation(line);
        }
        else if (line.includes("JMPLT")) { // finished
            output = instruction_jump_compare(line, "LT")
        }
        else if (line.includes("JMPGT")) { // finished
            output = instruction_jump_compare(line, "GT")
        }
        else if (line.includes("JMPLE")) {
            output = instruction_jump_compare(line, "GT") // finished
        }
        else if (line.includes("JMPGE")) {
            output = instruction_jump_compare(line, "GE") // finished
        }
        else if (line.includes("JMPNE")) {
            output = instruction_jump_compare(line, "NE") // finished
        }
        else if (line.includes("JMPEQR")) {
            output =instruction_jump_compare(line, "EQ") // finished
        }
        else if (line.includes("JMPEQ")) {
            output = instruction_jump_eq(line)
        }
        else if (line.includes("JMP")) {
            output = instruction_jump(line)
        }
        else if (line.includes("XOR")) {  // finished
            output = instruction_logical(line, "XOR");
        }
        else if (line.includes("AND")) {  // finished
            output = instruction_logical(line, "AND");
        }
        else if (line.includes("ROT")) {
            output = instruction_rotate(line);
        }
        else if (line.includes("MOV")) {
            output = instruction_move(line);
        }
        else if (line.includes("OR")) {  // finished
            output = instruction_logical("line", "OR");
        }
        else{
            console.warn("ERROR: Invalid instruction");
        
        }
        console.log(curr_address + ": " + output);
        memory[curr_address] = output[0];
        memory[curr_address + 1] = output[1];
        curr_address += 2;
    }
    console.log("output = ");
    console.log(memory);
}

//var parsed_lines = preproccess();