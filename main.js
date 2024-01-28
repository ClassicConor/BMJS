import { getByte, getNybble } from "./microcode"
export var machine_memory = Array(256).fill(0);
export var registers = Array(16).fill(0);
export var PC = 0;
export var CIR = 0;
export var halted = false;
export var instruction = null;


export function set_memory(mem) {
  machine_memory = mem;
}

export function fetch() {
  CIR = machine_memory[PC] << 8;
  CIR += machine_memory[PC + 1];
  PC += 2;
}

export function decode() {
  let instruction_code = getNybble(CIR, 0);
  switch (instruction_code) {
    case 0x0: //no operation
      instruction = NOP;
      break;
    case 0x1: // LOAD direct
      instruction = Load_Direct;
      break;
    case 0x2: // LOAD immediate
      instruction = Load_Indirect;
      break;
    case 0x3: // store direct
      instruction = Store_Direct;
      break;
    case 0x4: //move r to s
      instruction = Move_Registers;
      break;
    case 0x5: // add as integers
      instruction = Addi;
      break;
    case 0x6: //add as floats
      instruction = Addf;
      break;
    case 0x7: //bitwise OR
      instruction = Bitwise_OR;
      break;
    case 0x8: //bitwise AND
      instruction = Bitwise_AND;
      break;
    case 0x9: //bitwise XOR
      instruction = Bitwise_XOR;
      break;
    case 0xa: //Rotate right
      instruction = ROT;
      break;
    case 0xb: //jump equal
      instruction = JMPEQ;
      break;
    case 0xc: //halt
      instruction = HALT;
      break;
    case 0xd: //load register indirect
      instruction = Load_Register_indirect;
      break;
    case 0xe: //store register indirect
      instruction = Store_Register_indirect;
      break;
    case 0xf: //jump conditional
      instruction = JUMPCMP;
      break;
    default:
      break;
  }
}

export function execute() {
  instruction();
}

function NOP() {
  return;
}

function Load_Direct() {
  let r = getNybble(CIR, 1);
  let address = getByte(CIR, 1);
  console.log(address);
  registers[r] = machine_memory[address];
}

function Load_Indirect() {
  let r = getNybble(CIR, 1);
  let value = getByte(CIR, 1);
  registers[r] = value;
}

function Store_Direct() {
  let r = getNybble(CIR, 1);
  let address = getByte(CIR, 1);
  machine_memory[address] = registers[r];
}

function Move_Registers() {
  let r = getNybble(CIR, 2);
  let s = getNybble(CIR, 3);
  registers[s] = registers[r];
}

function Addi() {
  let r = getNybble(CIR, 1);
  let s = getNybble(CIR, 2);
  let t = getNybble(CIR, 3);
  //why would js have types????
  // thus % 256 to simulate overflow
  registers[r] = registers[s] + (registers[t] % 256);
}
function Addf() {
  let r = getNybble(CIR, 1);
  let s = getNybble(CIR, 2);
  let t = getNybble(CIR, 3);
  //todo: learn how to do this???
}

function Bitwise_OR() {
  let r = getNybble(CIR, 1);
  let s = getNybble(CIR, 2);
  let t = getNybble(CIR, 3);
  registers[r] = registers[s] | registers[t];
}

function Bitwise_AND() {
  let r = getNybble(CIR, 1);
  let s = getNybble(CIR, 2);
  let t = getNybble(CIR, 3);
  registers[r] = registers[s] & registers[t];
}

function Bitwise_XOR() {
  let r = getNybble(CIR, 1);
  let s = getNybble(CIR, 2);
  let t = getNybble(CIR, 3);
  registers[r] = registers[s] ^ registers[t];
}

function ROT() {
  let target_register = getNybble(CIR, 1);
  let rotate_amount = getNybble(CIR, 3);
  let data = registers[target_register];
  registers[target_register] =
    (data >> rotate_amount) | ((data << (8 - rotate_amount)) & 0xff);
}

function JMPEQ() {
  let r = getNybble(CIR, 1);
  if (registers[r] == registers[0]) {
    PC = getByte(CIR, 1);
  }
}

function HALT() {
  halted = true;
}

function Load_Register_indirect() {
  let r = getNybble(CIR, 2);
  let s = getNybble(CIR, 3);

  registers[r] = machine_memory[registers[s]];
}

function Store_Register_indirect() {
  let r = getNybble(CIR, 2);
  let s = getNybble(CIR, 3);
  machine_memory[registers[s]] = registers[r];
}

function JUMPCMP() {
  let r = getNybble(CIR, 1);
  let x = getNybble(CIR, 2);
  let t = getNybble(CIR, 3);

  let fufilled = false;
  switch (x) {
    case 0:
      fufilled = registers[r] == registers[0];
      break;
    case 1:
      fufilled = registers[r] != registers[0];
      break;
    case 2:
      fufilled = registers[r] >= registers[0];
      break;
    case 3:
      fufilled = registers[r] <= registers[0];
      break;
    case 4:
      fufilled = regisers[r] > registers[0];
      break;
    case 5:
      fufilled = regisers[r] < registers[0];
      break;
  }
  if (fufilled) {
    PC = registers[t];
  }
}
