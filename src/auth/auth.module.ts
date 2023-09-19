import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";

@Module({
    // import the package to sign and decode JWTs
    imports: [JwtModule.register({})],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule {}