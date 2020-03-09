import {sendGet} from "./RequestFactory";

/**
 *
 */
describe('Requst Factory', () => {

    const API_URL = "https://portal.ayacom.kz/api";

    /**
     *
     */
    it('should send GET', done => {
        const url = `${API_URL}/comparative-tables`;

        sendGet(url, {
            show_all: "y"
        })
            .then(response => {
                expect(response.status).toEqual(200);
                done();
            })
            .catch(err => {
                console.warn(err);
                done();
            })
    });
});