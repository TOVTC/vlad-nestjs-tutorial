import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}
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
            // prevents the hash from being returned
            delete user.hash;
            // return the saved user
            return user;
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
        // send back the user without the hashed password
        delete user.hash
        return {msg: 'I have signed in'};
    }
}