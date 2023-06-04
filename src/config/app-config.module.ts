import {Module,Global } from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";
import {AppConfigService} from "./app-config.service";

@Global()
@Module({
    imports:[ConfigModule.forRoot()],
    controllers: [],
    providers: [AppConfigService],
    exports:[AppConfigService]
})
export class AppConfigModule {}