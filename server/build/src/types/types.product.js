"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingType = exports.SizeType = exports.ProductType = exports.CategoryType = void 0;
var CategoryType;
(function (CategoryType) {
    CategoryType["Men"] = "men";
    CategoryType["Women"] = "women";
    CategoryType["Unisex"] = "unisex";
})(CategoryType = exports.CategoryType || (exports.CategoryType = {}));
var ProductType;
(function (ProductType) {
    ProductType["Twill"] = "twilljogger";
    ProductType["Shirred"] = "shirredlegjogger";
    ProductType["Moto"] = "motoknitjogger";
    ProductType["Drop"] = "dropcrotchjogger";
    ProductType["HipHop"] = "hiphopjogger";
    ProductType["Shading"] = "shadingblockjogger";
    ProductType["Chino"] = "chinojogger";
    ProductType["Handcuffed"] = "handcuffedjogger";
    ProductType["Loose"] = "loosepocketjogger";
    ProductType["Splash"] = "splashcolorjogger";
    ProductType["Wool"] = "wooljogger";
    ProductType["Tore"] = "distressedjogger";
    ProductType["NonCuffed"] = "noncuffedjogger";
})(ProductType = exports.ProductType || (exports.ProductType = {}));
var SizeType;
(function (SizeType) {
    SizeType["Small"] = "s";
    SizeType["Medium"] = "m";
    SizeType["Large"] = "l";
    SizeType["ExtraLarge"] = "xl";
    SizeType["DoubleExtraLarge"] = "xxl";
})(SizeType = exports.SizeType || (exports.SizeType = {}));
var RatingType;
(function (RatingType) {
    RatingType[RatingType["One"] = 1] = "One";
    RatingType[RatingType["Two"] = 2] = "Two";
    RatingType[RatingType["Three"] = 3] = "Three";
    RatingType[RatingType["Four"] = 4] = "Four";
    RatingType[RatingType["Five"] = 5] = "Five";
})(RatingType = exports.RatingType || (exports.RatingType = {}));
