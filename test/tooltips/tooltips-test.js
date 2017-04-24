import * as tooltips from '../../src/components/tooltips/tooltips';
import localforage from 'localforage';
import axios from 'axios';
import moxios from 'moxios';
import sinon from 'sinon'
import assert from 'assert';


describe('Create Tooltips On A Page.', () => {

    describe('Test caching helper function.', () => {

        let data;
        beforeEach(() => {
            data = {
                "key": "path/myKey",
                "value": "Some HTML string or object.",
                "timestamp": new Date().getTime(),
                "expire": 10000 // 10 seconds.
            };
        });

        it ('Returns true if cached data is null or undefined.', () => {
            assert.equal(true, tooltips.emptyOrExpired(null));
            assert.equal(true, tooltips.emptyOrExpired(undefined));
        });

        it ('Returns true if the cached data has expired.', () => {
            data.expire = -1000;
            assert.equal(true, tooltips.emptyOrExpired(data));
        });

        it ('Returns false if the cached data has not expired.', () => {
           assert.equal(false, tooltips.emptyOrExpired(data));
        });
    })

    describe('Test getAndOrSet function.', () =>{

        beforeEach(() => {
            /* Import and pass the custom axios instance to this method. */
            moxios.install(axios);
            /* Mock out Axios get request. */
            moxios.stubRequest('/path/glossary.json', {
                status: 200,
                data: {"glossary-term": "Some HTML."}
            });
        });

        afterEach(() => {
            /* Import and pass the custom axios instance to this method. */
            moxios.uninstall(axios);
        });

        it ('Caches anything that does not exist in the cache.', () => {
            tooltips.getAndOrSet('/path/glossary.json');

            //localforage.getItem('path/glossary.json').then((result) => {
            //    console.log("Phew!");
            //   assert.equal({"glossary-term": "Some HTML."}, result.value);
            //});
        });

        it ('Does not cache a failed response.', () => {
            moxios.stubRequest('/path/failure', {
                status: 404,
                data: null
            });

            tooltips.getAndOrSet('/path/failure');

            //localforage.getItem('path/failure').then((result) => {
            //    assert.equal(null, result);
            //});
        });

        it ('Provides a default expiry and the ability to override.', () => {

            tooltips.getAndOrSet('/path/glossary.json', 0);
            /* Then check the result.expire fields for the correct value. */
            //localforage.getItem('path/glossary.json').then((result) => {
            //    assert.equal(0, result.expire);
            //});

            /* On a subsequent call the previous will have expired
             immediately due to expire = 0 above. */

            tooltips.getAndOrSet('/path/glossary.json');
            /* Then check the result.expire fields for the correct value. */
            //localforage.getItem('path/glossary.json').then((result) => {
            //    assert.equal(100000, result.expire);
            //});
        });

        it ('Returns a promise.', () => {
            let promise = false;
            /* .then is the only standard promise libraries use. */
            tooltips.getAndOrSet('/path/glossary.json', 0).then(() => {
                console.log("Boo");
                promise = true;
            })
            assert.equal(true, promise);
        });
        it ('Raises errors that can be caught.', () => {

        });
        it ('Has dictionary["value"] returned in the promise data.', () => {

        });
    });

    describe('Test automaticTooltips function.', () =>{
        it ('Creates a tooltip if the corresponding glossary entry exists.', () => {

        });
        it ('Only does so if the term matches the glossary article title.', () => {

        });
    });

    describe('Test linkTooltips function.', () =>{
        it ('Creates a tooltip if the base url matches the window path.', () => {
            /* Asssert creation and no creation. */
        });
        it ('Performs a GET using the article link.', () => {

        });
    });


});
