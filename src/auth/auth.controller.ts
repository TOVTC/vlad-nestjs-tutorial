import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";

// it's good practice to add a global prefix route (here, it's 'auth')
@Controller('auth')
export class AuthController{
    // the authService parameter is a shorthand for declaring authService as a property, then passing it in as an argument, then instantiating it using this.authService within the constructor
    constructor(private authService: AuthService) {}
    @Post('signup')
    // @Body() accesses request.body and specifies the expected form of that body using dto
    signup(@Body() dto: AuthDto) {
        // after validating the request body using the dto, pass to the auth service
        return this.authService.signup(dto)
    }

    @Post('signin')
    signin(@Body() dto: AuthDto) {
        return this.authService.signin(dto)
    }
}