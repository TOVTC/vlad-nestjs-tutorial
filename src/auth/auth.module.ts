import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategy";

@Module({
    // import the package to sign and decode JWTs
    imports: [JwtModule.register({})],
    controllers: [AuthController],
    // make sure to import the strategy
    providers: [AuthService, JwtStrategy]
})
export class AuthModule {}