export class PetModel {
    id: number;
    type: string = 'Panda';
    color: string = 'White';

    constructor(public name: string = 'Austin') {
    }
}
