import getPayAudio from './payAudio';

const t = {
  albumId: 22265517,
  apiVersion: '1.0.0',
  buyKey: 'fe4f133ccbf4b22dfa2a1e704ccbbda8',
  domain: 'http://audio.pay.xmcdn.com',
  downloadQualityLevel: 0,
  duration: 382,
  ep:
    'ixdsaY59SiQC2v0Mb4wd414PUk0i1ibGSddPKQ7mX3e0mLveivLbmbkO0PmIhvVqX+F/1nRXcKYw3KP4wwAWjbYPMCFRG6CqXt7GtyZdr0ShoetbmWoS',
  fileId:
    '3*32*50*44*36*27*35*18*58*38*35*47*58*35*39*58*35*25*34*3*53*45*56*65*38*16*6*39*57*40*45*20*66*5*20*66*38*53*52*25*52*48*54*38*22*27*58*11*6*38*17*',
  highestQualityLevel: 1,
  isAuthorized: true,
  msg: '0',
  ret: 0,
  sampleDuration: 90,
  sampleLength: 757961,
  seed: 4050,
  title: '发刊词 | 一场特殊音乐会的邀请函',
  totalLength: 3094573,
  trackId: 176874624,
  uid: 167345040,
};

const h =
  'http://audio.pay.xmcdn.com/download/1.0.0/group2/M04/70/D0/wKgLdFy4fmDzsdC8AC84Lbwb6h4320.m4a?sign=11cf9b3d0264ad826856b93a6b7053f9&buy_key=fe4f133ccbf4b22dfa2a1e704ccbbda8&token=8961&timestamp=1556875153092223&duration=382';
describe('pay audio', () => {
  test('getPayAudio', () => {
    expect(getPayAudio(t)).toBe(h);
  });
});
