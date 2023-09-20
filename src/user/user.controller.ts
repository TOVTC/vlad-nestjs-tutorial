import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

// pluralize route based on REST conventions
@Controller('users')
export class UserController {
    // within the passport package, there is a pre-built auth.guard module that is compatible with Nest Js
    // so we pass that in as a parameter, and indicate what strategy it is guarding for
    @UseGuards(AuthGuard('jwt'))
    // if you leave the Get decorator blank, it will catch any request to /users
    @Get('me')
    // this parameter is what is returned/appended via the validation emthod in the jwt strategy
    // the @Req() object is from Nest Js and the Request Interface is from Express
    getMe(@Req() req: Request) {
        return req.user;
    }
}
