// import componets needed to be tested
import {setToken, getToken, setUsername, 
        getUsername, removeTokenCookie, removeUserCookie}  from "../utils/cookies.js";

import { setSessionToken, getSessionToken } from "../utils/session.js";

// cookies.js
test("cookie manipulation tests", () => {
    setToken("cookieToken");
    expect(getToken()).toBe("cookieToken");
    setUsername("usernameToken");
    expect(getUsername()).toBe("usernameToken");
    removeTokenCookie();
    expect(getToken()).toBeUndefined(undefined);
    removeUserCookie();
    expect(getUsername()).toBeUndefined(undefined);
});
// session.js
test("session manipulation tests", () => {
    setSessionToken("sessionToken");
    expect(getSessionToken()).toBe("sessionToken");
});

//


