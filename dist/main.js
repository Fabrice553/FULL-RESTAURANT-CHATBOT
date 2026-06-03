"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    // Enable CORS
    app.enableCors();
    // Global validation pipe
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    // Serve static files
    app.use('/public', require('express').static('public'));
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`🚀 Restaurant ChatBot running on http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map