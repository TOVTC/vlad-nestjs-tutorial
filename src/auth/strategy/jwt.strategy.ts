import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";


// this class is also a provider like the auth service class (can use injectables)
// but we separate this because this class has a specfici use case and it's for validating the access token

// extends the passport strategy that comes from the Nest Js passport module
// implements the JWT strategy which comes from the passport-jwt library
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(config: ConfigService) {
        super({
            // configures the passport strategy to retrieve the JWT from the headers
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('JWT_SECRET')
        })
    }
}
