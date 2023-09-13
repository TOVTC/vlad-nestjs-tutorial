import { Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

// it's good practice to add a global prefix route
@Controller('auth')
export class AuthController{
    //     authService: AuthService;
    //     constructor(authService: AuthService) {
    //         this.authService = authService;
    //     }
    // the line below is shorhand for the code above
    constructor(private authService: AuthService) {}
    @Post('signup')
    signup() {
        return this.authService.signup()
    }

    @Post('signin')
    signin() {
        return this.authService.signin()
    }
}