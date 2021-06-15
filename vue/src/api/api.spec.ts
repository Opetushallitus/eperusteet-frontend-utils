document.cookie = "CSRF=xyz1234";

import './common';
import axios from 'axios';

describe('Api', () => {
  test('Has caller id and CSRF token', () => {
    expect(axios.defaults.headers.common['Caller-Id']).toEqual('1.2.246.562.10.00000000001.eperusteet');
  });

  test('Has CSRF token', () => {
    expect(axios.defaults.headers.common.CSRF).toEqual('xyz1234');
  });

});
