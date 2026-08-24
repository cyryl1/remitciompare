"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProvidersModule = exports.PROVIDER_ADAPTERS = void 0;
const common_1 = require("@nestjs/common");
const wise_adapter_1 = require("./adapters/wise/wise.adapter");
const providers_service_1 = require("./providers.service");
const providers_controller_1 = require("./providers.controller");
const prisma_module_1 = require("../prisma/prisma.module");
exports.PROVIDER_ADAPTERS = 'PROVIDER_ADAPTERS';
let ProvidersModule = class ProvidersModule {
};
exports.ProvidersModule = ProvidersModule;
exports.ProvidersModule = ProvidersModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [providers_controller_1.ProvidersController],
        providers: [
            providers_service_1.ProvidersService,
            wise_adapter_1.WiseAdapter,
            {
                provide: exports.PROVIDER_ADAPTERS,
                useFactory: (wise) => {
                    return [wise];
                },
                inject: [wise_adapter_1.WiseAdapter],
            },
        ],
        exports: [exports.PROVIDER_ADAPTERS],
    })
], ProvidersModule);
//# sourceMappingURL=providers.module.js.map