import { Controller, Post, Req } from "@nestjs/common";
import { Request } from 'express';
import { AuthService } from "./auth.service";

// it's good practice to add a global prefix route (here, it's 'auth')
@Controller('auth')
export class AuthController{
    // the authService parameter is a shorthand for declaring authService as a property, then passing it in as an argument, then instantiating it using this.authService within the constructor
    constructor(private authService: AuthService) {}
    @Post('signup')
    // because Nest uses Express under the hood, you can expose and access it, such as in @Req() which is an Express Request object
    signup(@Req() req: Request) {
        console.log(req.body)
        return this.authService.signup()
    }

    @Post('signin')
    signin() {
        return this.authService.signin()
    }
}