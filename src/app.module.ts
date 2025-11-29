import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserAccountsModule } from './modules/user-accounts/user-accounts.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TestingModule } from './modules/testing/testing.module';
import { CoreModule } from './core/core.module';
import { BlogsModule } from './modules/blogs/blogs.module';
import { PostsModule } from './modules/posts/post.module';
import { CommentsModule } from './modules/comments/comments.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://docummagic0:481516Lost@cluster0.sfhnzph.mongodb.net/'), //TODO: move to env. will be in the following lessons
    UserAccountsModule, //все модули должны быть заимпортированы в корневой модуль, либо напрямую, либо по цепочке (через другие модули)
    TestingModule,
    CoreModule,
    BlogsModule,
    CommentsModule,
    PostsModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,  // ← Глобальный guard
    },
  ],
})
export class AppModule {}
