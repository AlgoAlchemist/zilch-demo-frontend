import * as borsh from '@project-serum/borsh'

export class Prog {
    program_hash: string;
    inputs: number;
    program_code: string;

    constructor(program_hash: string, inputs: number, program_code: string) {
        this.program_hash = program_hash;
        this.inputs = inputs;
        this.program_code = program_code;
    }

    static mocks: prog[] = [
    ]

    borshInstructionSchema = borsh.struct([
        borsh.u8('variant'),
        borsh.str('program_hash'),
        borsh.u8('inputs'),
        borsh.str('program_code'),
    ])

    static borshAccountSchema = borsh.struct([
        borsh.bool('initialized'),
        borsh.u8('inputs'),
        borsh.str('program_hash'),
        borsh.str('program_code'),
    ])

    serialize(): Buffer {
        const buffer = Buffer.alloc(1000)
        this.borshInstructionSchema.encode({ ...this, variant: 0 }, buffer)
        return buffer.slice(0, this.borshInstructionSchema.getSpan(buffer))
    }

    static deserialize(buffer?: Buffer): prog | null {
        if (!buffer) {
            return null
        }

        try {
            const { program_hash, inputs, program_code } = this.borshAccountSchema.decode(buffer)
            return new prog(program_hash, inputs, program_code)
        } catch (e) {
            console.log('Deserialization error:', e)
            console.log(buffer)
            return null
        }
    }
}