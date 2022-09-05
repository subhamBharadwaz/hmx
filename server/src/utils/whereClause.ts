import {Query, Document} from 'mongoose';

type TBase = Query<any, Document<Document>>;
type TQuery = {
	[key: string]: any;
};

class WhereClause {
	base: TBase;

	query: TQuery;

	constructor(base: TBase, query: TQuery) {
		this.base = base;
		this.query = query;
	}

	search() {
		// does the query contain a search keyword?
		const searchWord = this.query.search
			? {
					// if the search word exists, we are looking for in the name
					name: {
						$regex: this.query.search,
						$options: 'i' // for case insensitivity
					}
			  }
			: {};

		this.base = this.base.find({...searchWord});
		return this;
	}

	filter() {
		const copyQuery = {...this.query};

		// removing search, page and limit fields
		delete copyQuery.search; // we are suing dot notation instead copyQuery["search"]
		delete copyQuery.limit;
		delete copyQuery.page;

		// convert query into a string to use regex => copyQuery
		let stringOfCopyQuery = JSON.stringify(copyQuery);

		stringOfCopyQuery = stringOfCopyQuery.replace(/\b(gte|lte)\b/g, m => `$${m}`);

		const jsonOfCopyQuery = JSON.parse(stringOfCopyQuery);

		this.base = this.base.find(jsonOfCopyQuery);
		return this;
	}

	pager(resultPerPage: number) {
		let currentPage = 1;
		/** default page number is 1
		 * but if somebody pass page in query (eg: ?page=2), the value of currentPage should be change with that.
		 */

		if (this.query.page) {
			currentPage = this.query.page;
		}

		const skipValue = resultPerPage * (currentPage - 1);

		this.base = this.base.limit?.(resultPerPage).skip(skipValue);
		return this;
	}
}

export default WhereClause;
