import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";


// this class is also a provider like the auth service class (can use injectables)
// but we separate this because this class has a specfici use case and it's for validating the access token

// extends the passport strategy that comes from the Nest Js passport module
// implements the JWT strategy which comes from the passport-jwt library
@Injectable()
// within PassportStrategy, you can also pass in an additional parameter to specify the name of the strategy
// PassportStrategy(Strategy, 'jwt')
// which can be used as parameters for guards, but otherwise, it defaults to the name of the strategy anyway
// in this case, specifying 'jwt' is not necessary
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    // import prisma because we need to find the user from the database and return it in the validate method
    // config does not need to be private because putting private esstially declares the variable globally for the Passport Strategy
    // and it would also cause problems when trying to instantiate using the super() constructor because you would essentially be calling this.config.get()
    constructor(config: ConfigService, private prisma: PrismaService) {
        super({
            // configures the passport strategy to retrieve the JWT from the headers
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('JWT_SECRET')
        })
    }

    async validate(payload: {sub: number, email: string}) {
        // perform validation here
        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.sub
            }
        });
        // by returning the payload, we are appending the payload to the user object of the user object of the request object
        // then we can use it in our route (aka we can access it in our controllers as a parameter)
        // the payload is the user
        delete user.hash;
        return user;
        // if the user is not found (null) it will throw a 401 unauthorized error
    }
}
