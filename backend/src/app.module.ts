import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CounterModule } from './counter/counter.module';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  imports: [
    PrismaModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRootAsync({
      useFactory: () => {
        const rootPath = process.env['PEK_CLIENT_PATH'];
        if (!rootPath) return [];
        return [{ rootPath }];
      },
    }),
    CounterModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
