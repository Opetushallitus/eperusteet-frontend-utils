import * as ylops from './ylops';
import * as eperusteet from './eperusteet';
import './common';
import axios from 'axios';

describe('Api', () => {
  test('Has caller id', () => {
    expect(axios.defaults.headers.common['Caller-Id']).toBe('1.2.246.562.10.00000000001.eperusteet');
  });
});
