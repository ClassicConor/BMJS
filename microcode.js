export function getNybble(CIR, index){
    if (index == 0)
    {
        return (CIR >> 12);
    }
    if (index == 1)
    {
        return ((CIR >> 8) & 0x0f);
    }
    if (index == 2)
    {
        return ((CIR >> 4) & 0x00f);
    }
    if (index == 3) 
    {
        return (CIR & 0x000f);
    }
    return 0;
}
export function getByte(CIR, index){
    if (index == 0){
        return (CIR >> 8);
    }
    else {
        return CIR & 0x00ff;
    }
}