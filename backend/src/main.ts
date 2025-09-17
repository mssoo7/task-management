import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors();
	app.setGlobalPrefix('api');
	app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

	const config = new DocumentBuilder()
		.setTitle('Task Manager API')
		.setVersion('1.0')
		.addBearerAuth()
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api/docs', app, document);

	const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
	await app.listen(port);
}
bootstrap();
