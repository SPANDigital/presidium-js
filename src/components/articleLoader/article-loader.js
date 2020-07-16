
const articleLoader = module.exports;

articleLoader.load = function(urlMap) {
    const loader = new Loader();
    loader.setup();
    loader.fetchData(urlMap);
}

const Loader = function() {
    this.articleURLs = [];
    this.isFetchingPosts = false;
    this.shouldFetchPosts = true;
    this.loadNewPostsThreshold = 3000;
    this.postsToLoad = 0;
}

Loader.prototype.setup = function() {
    this.postsToLoad = document.querySelectorAll(".article-list > .article").length;

    // If there's no spinner, it's not a page where posts should be fetched
    console.log("test: is spinner there", document.querySelector(".infinite-spinner"));
    if (document.querySelector(".infinite-spinner").length < 1)
        this.shouldFetchPosts = false;

    window.onscroll = this.onScroll.bind(this);
}

Loader.prototype.fetchData = function(urlMap) {
    // Load the JSON file containing all URLs for articles grouped by section
    fetch(urlMap)
        .then(r => r.json())
        .then(data => {
            const section = document.querySelector('.article-list');
            if (!section || !section.dataset || !section.dataset.section) {
                this.disableFetching();
            }
            this.articleURLs = data[section.dataset.section]; // load articles for active section
            console.log('postsToLoad: ', this.postsToLoad);

            // If all articles are showing on the page already, disable fetching
            if (this.articleURLs.length <= this.postsToLoad)
                this.disableFetching();
        });
}

Loader.prototype.onScroll = function() {
    if (!this.shouldFetchPosts || this.isFetchingPosts) return;

    const windowHeight = window.innerHeight;
    const windowScrollPosition = window.pageYOffset;
    const bottomScrollPosition = windowHeight + windowScrollPosition;
    const documentHeight = document.body.offsetHeight;

    // If we are close to the end of the page, load more posts
    if ((documentHeight - this.loadNewPostsThreshold) < bottomScrollPosition) {
        this.fetchPosts();
    }
}


// Fetch a new batch of articles, based on the amount of articles loaded on first load
Loader.prototype.fetchPosts = function() {
    console.log('fetchPosts: ');
    if (!this.articleURLs) return;
    this.isFetchingPosts = true;

    // load one post at a time
    var loadedPosts = 0;
    const postCount = document.querySelectorAll(".article-list .article").length;
    console.log("postCount: ", postCount);
    const callback = () => {
        loadedPosts++;
        const postIndex = postCount + loadedPosts;

        if (postIndex > this.articleURLs.length - 1) {
            this.disableFetching();
            return;
        }

        if (loadedPosts < this.postsToLoad) {
            this.fetchPostWithIndex(postIndex, callback);
        } else {
            this.isFetchingPosts = false;
        }
    }

    this.fetchPostWithIndex(postCount + loadedPosts, callback);
}

Loader.prototype.fetchPostWithIndex = function(index, callback) {
	console.log('fetchPostWithIndex: ', index);
	const articleURL = this.articleURLs[index];

    fetch(articleURL)
        .then(r => r.text())
        .then(data => {
            var htmlEl = document.createElement('div');
            htmlEl.innerHTML = data;
            document.querySelector('.article-list').append(htmlEl.querySelector('.article'));
            callback();
        });
}

Loader.prototype.disableFetching = function() {
    console.log('disabled fetching');
    this.shouldFetchPosts = false;
    this.isFetchingPosts = false;
    document.querySelector(".infinite-spinner").style.display = 'none';
}
