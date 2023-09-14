import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
// update the service to extend the client, which allows for connection to the database
export class PrismaService extends PrismaClient {
    // the goal is to instantiate the prisma service with some configuration
    // here, the config module is a dependency that is injected into the PrismaService constructor
    constructor(config: ConfigService) {
        // calls the constructor of the PrismaClient
        super({
            datasources: {
                db: {
                    // The config module uses getters to expose values from the .env file
                    url: config.get('DATABASE_URL')
                }
            }
        });
    }
}
