"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WhereClause {
    constructor(base, query) {
        this.base = base;
        this.query = query;
    }
    search() {
        const searchWord = this.query.search
            ? {
                name: {
                    $regex: this.query.search,
                    $options: 'i'
                }
            }
            : {};
        this.base = this.base.find(Object.assign({}, searchWord));
        return this;
    }
    filter() {
        const copyQuery = Object.assign({}, this.query);
        delete copyQuery.search;
        delete copyQuery.limit;
        delete copyQuery.page;
        let stringOfCopyQuery = JSON.stringify(copyQuery);
        stringOfCopyQuery = stringOfCopyQuery.replace(/\b(gte|lte)\b/g, m => `$${m}`);
        const jsonOfCopyQuery = JSON.parse(stringOfCopyQuery);
        this.base = this.base.find(jsonOfCopyQuery);
        return this;
    }
    pager(resultPerPage) {
        var _a, _b;
        let currentPage = 1;
        if (this.query.page) {
            currentPage = this.query.page;
        }
        const skipValue = resultPerPage * (currentPage - 1);
        this.base = (_b = (_a = this.base).limit) === null || _b === void 0 ? void 0 : _b.call(_a, resultPerPage).skip(skipValue);
        return this;
    }
}
exports.default = WhereClause;
