function instruction_data(asm) {
    asm.replace("DATA", "");
    var data = Number("0x" + asm);
    if (data > 0xFF){
        return [data & 0xFF00, data & 0x00FF];
    }
    else{
        return [data, 0x00]
    }
}


function instruction_add(asm, mode) {
    var opcode = 0x00;
    var operand = 0x00;
    if (mode == "I") {
        opcode = 0x50;
    }
    else if (mode == "F") {
        opcode = 0x60;
    }
    else {
        console.log("Invalid mode for ADD");
    }
    asm = asm.replace("ADD" + mode, "")
    var RHS = asm.split("->")[0]
    var dest_register = asm.split("->")[1].replace("R", "");
    var add_register_1 = RHS.split(",")[0].replace("R", "");
    var add_register_2 = RHS.split(",")[1].replace("R", "");
    opcode += Number("0x0" + dest_register);
    //operand is (reg_add_1)(reg_add_2)
    operand = Number("0x" + add_register_1 + add_register_2);
    return [opcode, operand]
}

function instruction_logical(asm, mode) {
    var opcode = 0x00;
    var operand = 0x00;

    if (mode == "OR") {
        opcode += 0x70;
    }
    else if (mode == "AND") {
        opcode += 0x80;
    }
    else if (mode == "XOR") {
        opcode += 0x90;
    }
    else {
        console.log("Mode must be either OR,AND, or XOR");
    }

    asm = asm.replace(mode, "");
    var split = asm.split(',');
    //get registers to have operation carried out on as string
    var reg_logical_1 = split[0].substring(1);
    var reg_logical_2 = split[1].split("->")[0].substring(1);
    //get register to be sent to as a string
    var reg_dest = split[1].split("->")[1].substring(1);

    //second opcode argument is register to be sent to
    opcode += Number("0x0" + reg_dest);
    //operand is (reg_add_1)(reg_add_2)
    operand = Number("0x" + reg_logical_1 + reg_logical_2);

    console.log(reg_logical_1);
    console.log(reg_logical_2);
    console.log(reg_dest);
    console.log(opcode);
    return [opcode, operand];
}

// function instruction_jump_conditional(asm, mode) {
//     var opcode = 0xF0;
//     var operand = 0x00;

//     if (mode == "LT") {
//         operand = 0x50;
//     }
//     else if (mode == "GT") {
//         operand = 0x40;
//     }
//     else if (mode == "LE") {
//         operand = 0x30;
//     }
//     else if (mode == "GE") {
//         operand = 0x20;
//     }
//     else if (mode == "NE") {
//         operand = 0x10;
//     }
//     else {
//         console.log("Mode must be LT, GT, GE, LE, NE");
//     }

//     var line = asm.replace("JMP" + mode + "R", "");
//     var arguments = line.Split(",R");
//     var addr_reg = arguments[0];
//     var comp_reg = arguments[1];
//     opcode += Number("0x0" + comp_reg);
//     operand += Number("0x0" + addr_reg);

//     return (opcode, operand);
// }

function instruction_jump_eq(asm) {
    var opcode = 0xB0
    var operand = 0x00
    //JUMPEQxy,Rn
    asm = asm.replace("JUMPEQ", "");
    //xy,Rn
    let addr = asm.split(",R")[0];
    let n = asm.split(",R")[1];

    opcode += Number("0x" + n);
    operand = Number("0x" + addr);

    return [opcode, operand]
}



function instruction_jump(asm) {
    var opcode = 0xB0
    var operand = 0x00
    asm = asm.replace("JMP", "");
    if (asm.startsWith("R")) {
        opcode = 0xF0; 
        asm = asm.replace("R", "");
        operand = Number("0x0" + asm);
    }
    else{
        operand = Number("0x" + asm);
    }

    return [opcode, operand]
}

function instruction_halt(asm) {
    return [0xC0, 0x00];
}

function instruction_jump_compare(asm, comparison) {
    var opcode = 0x00;
    var operand = 0x00;

    // "JMPNER1,R2"

    switch (comparison) {
        case "EQ":
            operand = 0x00;
            break;
        case "NE":
            operand = 0x10;
            break;
        case "GE":
            operand = 0x20;
            break;
        case "LE":
            operand = 0x30;
            break;
        case "GT":
            operand = 0x40;
            break;
        case "LT":
            operand = 0x50;
            break;
    }

    asm = asm.replace("JMP" + comparison + "R", "")
    let m = asm.split(",R")[1];
    let n = asm.split(",")[0];

    opcode = Number("0xF" + m)
    operand += Number("0x" + n)

    return [opcode, operand]
}

function instruction_rotate(asm) {
    let opcode = 0xA0;
    let operand = 0x00;
    asm = asm.replace("ROTR","")
    let n = asm.split(",")[0];
    let x = asm.split(",")[1];
    opcode += Number("0x0" + n)
    operand = Number("0x0" + x);

    return [opcode, operand]
}

function instruction_no_operation(asm) {
    return (0x0F, 0xFF)
}

function instruction_move(asm) {
    let opcode = 0x00;
    let operand = 0x00;
    
    let line = asm.replace("MOV", "");
    let arguments = line.split("->");
    
    let source = arguments[0];
    let destination = arguments[1];

    if (source.startsWith('R')) // MOV Rm ->
    {
        source = source.substring(1);
        if (destination.startsWith("R")) //Rm -> Rn
        {
            opcode = 0x40;
            operand = Number("0x"+source + "0");
            operand += Number("0x0" + destination.substring(1));
        }
        else if (destination.startsWith("[R")) // Rm -> [Rn]
        {
            opcode = 0xE0;
            operand = Number("0x"+source + "0");
            operand += Number("0x0" + destination.substring(2,3));
        }
        else // Rm -> [xy]
        {
            //TODO: Allow non hex values
            opcode = 0x30;
            opcode += convert("0x0" + source);

            destination = destination.Replace("[","").Replace("]", "");
            operand = Number("0x" + destination);

        }
    }
    else if (source.startsWith("[R")) // MOV [Rm] -> Rn
    {
        opcode = 0xD0;
        operand = Number("0x"+destination.substring(1) + "0");
        operand += Number("0x0" + source.substring(2, 3));
    }
    else if (source.startsWith('[')) //MOV [xy] -> Rn
    {
        //TODO: Allow non hex values
        opcode = 0x10;
        opcode += Number("0x0" + destination.substring(1));

        operand = Number("0x"+source.substring(1, 3));
    }
    else // MOV value -> Rn
    {
        //TODO: Allow non hex values
        opcode = 0x20;
        opcode += Number("0x0" + destination.substring(1));
        operand = Number("0x" + source);
    }

    return [opcode, operand];
}