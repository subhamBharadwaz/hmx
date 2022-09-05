"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const z = __importStar(require("zod"));
const addProductSchema = z.object({
    body: z.object({
        name: z
            .string({ required_error: 'Product name is required' })
            .max(120, { message: 'Product name should not be more than 120 characters long' }),
        price: z
            .string({ required_error: 'Product price is required' })
            .max(6, 'Product price should not be more than 6 digits'),
        description: z.string({ required_error: 'Product description is required' }),
        category: z.enum(['men', 'women', 'unisex']),
        productType: z.enum([
            'twilljogger',
            'shirredlegjogger',
            'motoknitjogger',
            'dropcrotchjogger',
            'hiphopjogger',
            'shadingblockjogger',
            'chinojogger',
            'handcuffedjogger',
            'loosepocketjogger',
            'splashcolorjogger',
            'wooljogger',
            'distressedjogger',
            'noncuffedjogger'
        ]),
        brand: z.string({ required_error: 'Product brand is required' }),
        size: z.enum(['s', 'm', 'l', 'xl', 'xxl'])
    })
});
exports.default = addProductSchema;
