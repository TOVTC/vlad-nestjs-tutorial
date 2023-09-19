import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
    // use dependency injection to import the PrismaService
    // don't forget to also import the JWT auth service
    constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) {}
    async signup(dto: AuthDto) {
        try {
            // generate password hash
            const hash = await argon.hash(dto.password);
            // save the user in the db
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash,
                },
                // you can use the select: {} property to specify whether each data property should be returned using a boolean
            });
            // prevents the hash from being returned (but not necessary unless you are returning the user)
            // delete user.hash;

            // return the signed in user's JWT
            return this.signToken(user.id, user.email);
        // use catch function to return descriptive error messages and codes
        } catch (error) {
            // check if the error being generated originates from Prisma
            if (error instanceof PrismaClientKnownRequestError) {
                // Prisma error code for duplicate user registration request
                if (error.code === 'P2002') {
                    // build in error object from Prisma
                    throw new ForbiddenException(
                        'Credentials taken'
                    );
                }
            }
        }

    }

    async signin(dto: AuthDto) {
        // find the user by email
        // prisma has a findFirst or findUnique field, which lets you find a user by any field or only unique fields
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        });
        // if user does not exist throw exception
        if (!user) {
            throw new ForbiddenException(
                'Credentials incorrect'
            );
        }
        // compare password
        // the argon verify method takes the retrieved user's password has and the POSTed user's password plaintext as arguments
        const pwMatches = await argon.verify(user.hash, dto.password)
        // if password incorrect throw exception
        if (!pwMatches) {
            throw new ForbiddenException(
                'Credentials incorrect'
            );
        }
        return this.signToken(user.id, user.email);
    }

    // function to create JWT
    async signToken(userId: number, email: string): Promise<{ access_token: string }> {
        // the object to be signed
        const payload = {
            // standard of the JWT convention taht you need to use a unique identifier for the sub field
            sub: userId,
            email
        }
        const secret = this.config.get('JWT_SECRET');
        // method comes from the JWT package
        const token = await this.jwt.signAsync(payload, {
            // expires after 15 min
            expiresIn: '15m',
            secret: secret,
        });

        // because Nest will automatically configure the data type in the repsonse header, explicitly return an object to avoid returning a plain string
        return {
            access_token: token,
        }
    }
}