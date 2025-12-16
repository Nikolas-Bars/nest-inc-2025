import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller('testing')
export class TestingController {
  constructor(
    @InjectConnection() private readonly databaseConnection: Connection,
  ) {}

  @Delete('all-data')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAll() {
    const db = this.databaseConnection.db;
    if (!db) {
      throw new Error('Database connection is not available');
    }
    
    const collections = await db.listCollections().toArray();

    const promises = collections.map((collectionInfo) =>
      db.collection(collectionInfo.name).deleteMany({}),
    );
    await Promise.all(promises);
  }
}
