import { Body, Get, JsonController, Post } from 'routing-controllers';
import { IsEmail, Max, Min, IsInt } from 'class-validator';

export class TestBody {

  @IsEmail()
  email: string;

  @IsInt()
  @Min(0)
  @Max(10)
  number: number;

  constructor(email: string, number: number) {
    this.email = email;
    this.number = number;
  }
}

@JsonController()
export class SampleController {

  @Get('/test')
  getTest() {
    return { test: 'test' };
  }

  @Post('/testpost')
  postTest(@Body() testBody: TestBody) {
    console.log('testBody', testBody);
    const anotherTest = new TestBody('sers@test.at', 10);
    console.log('anotherTest', anotherTest);
    return { sers: 'hallo' }
  }
}