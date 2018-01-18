import {HttpError} from 'routing-controllers';

export class AlreadyExistsError extends HttpError {
    public text: string;

    constructor(text: string) {
        super(400);
        Object.setPrototypeOf(this, AlreadyExistsError.prototype);
        this.text = text;
    }

    toJSON() {
        return {
            status: this.httpCode,
            failedOperation: this.text
        }
    }
}