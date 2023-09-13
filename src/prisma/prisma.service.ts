import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
// update the service to extend the client, which allows for connection to the database
export class PrismaService extends PrismaClient {
    // the goal is to instantiate the prisma service with some configuration
    constructor() {
        // calls the constructor of the PrismaClient
        super({
            datasources: {
                db: {
                    url: 'postgresql://postgres:123@localhost:5434/nest?schema=public'
                }
            }
        })
    }
}
