import getXmSign from './xmSign';

const d = 1556881840150;
const t = 1556881840708;
const r = /e1b5d25d4d235fd44eb85530684d4890\(.{1,2}\)1556881840150\(.{2}\)1556881840708/;
describe('xm sign', () => {
  test('get xm sign', () => {
    expect(getXmSign(d, t)).toMatch(r);
  });
});
