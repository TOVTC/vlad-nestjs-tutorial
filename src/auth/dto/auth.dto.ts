import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

// to use class validators from Nest Js pipes, declare AuthDto as a class instead of as an interface
export class AuthDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}