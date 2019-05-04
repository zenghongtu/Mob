// tslint:disable
import querystring from 'querystring';

function I(e) {
  (this._randomSeed = e), this.cg_hun();
}
I.prototype = {
  cg_hun() {
    this._cgStr = '';
    let e =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ/\\:._-1234567890',
      t = e.length,
      n = 0;
    for (n = 0; n < t; n++) {
      const r = this.ran() * e.length,
        a = parseInt(r);
      (this._cgStr += e.charAt(a)), (e = e.split(e.charAt(a)).join(''));
    }
  },
  cg_fun(e) {
    e = e.split('*');
    let t = '',
      n = 0;
    for (n = 0; n < e.length - 1; n++) {
      t += this._cgStr.charAt(e[n]);
    }
    return t;
  },
  ran() {
    return (
      (this._randomSeed = (211 * this._randomSeed + 30031) % 65536),
      this._randomSeed / 65536
    );
  },
  cg_decode(e) {
    let t = '',
      n = 0;
    for (n = 0; n < e.length; n++) {
      const r = e.charAt(n),
        a = this._cgStr.indexOf(r);
      -1 !== a && (t += a + '*');
    }
    return t;
  },
};

const getEncryptedFileName = function(e, t) {
  const n = new I(e).cg_fun(t);
  return '/' === n[0] ? n : '/' + n;
};

// maybe change
const o = 'g3utf1k6yxdwi0';
const u = [
  19,
  1,
  4,
  7,
  30,
  14,
  28,
  8,
  24,
  17,
  6,
  35,
  34,
  16,
  9,
  10,
  13,
  22,
  32,
  29,
  31,
  21,
  18,
  3,
  2,
  23,
  25,
  27,
  11,
  20,
  5,
  15,
  12,
  0,
  33,
  26,
];

const getEncryptedFileParams = function(e) {
  function a(e, t) {
    let n,
      r = [],
      a = 0,
      i = '',
      o = 0;
    for (; 256 > o; o++) {
      r[o] = o;
    }
    for (o = 0; 256 > o; o++) {
      (a = (a + r[o] + e.charCodeAt(o % e.length)) % 256),
        (n = r[o]),
        (r[o] = r[a]),
        (r[a] = n);
    }
    for (let u = (a = o = 0); u < t.length; u++) {
      (a = (a + r[(o = (o + 1) % 256)]) % 256),
        (n = r[o]),
        (r[o] = r[a]),
        (r[a] = n),
        (i += String.fromCharCode(t.charCodeAt(u) ^ r[(r[o] + r[a]) % 256]));
    }
    return i;
  }
  var t = a(
      (function(e, t) {
        for (var n = [], r = 0; r < e.length; r++) {
          for (
            var a =
                'a' <= e[r] && 'z' >= e[r]
                  ? e[r].charCodeAt() - 97
                  : e[r].charCodeAt() - 48 + 26,
              i = 0;
            36 > i;
            i++
          )
            if (t[i] == a) {
              a = i;
              break;
            }
          n[r] =
            25 < a
              ? String.fromCharCode(a - 26 + 48)
              : String.fromCharCode(a + 97);
        }
        return n.join('');
      })('d' + o + '9', u),
      (function(e) {
        if (!e) return '';
        var t,
          n,
          r,
          a,
          i,
          o = [
            -1,
            -1,
            -1,
            -1,
            -1,
            -1,
            -1,
            -1,
            -1,
            -1,
            -1,
            -1,
            -1,
            -1,
            -1,
            -1,
            -1,
            -1,
            -1,
            -1,
            -1,
            -1,
            -1,
            -1,
            -1,
            -1,
            -1,
            -1,
            -1,
            -1,
            -1,
            -1,
            -1,
            -1,
            -1,
            -1,
            -1,
            -1,
            -1,
            -1,
            -1,
            -1,
            -1,
            62,
            -1,
            -1,
            -1,
            63,
            52,
            53,
            54,
            55,
            56,
            57,
            58,
            59,
            60,
            61,
            -1,
            -1,
            -1,
            -1,
            -1,
            -1,
            -1,
            0,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            19,
            20,
            21,
            22,
            23,
            24,
            25,
            -1,
            -1,
            -1,
            -1,
            -1,
            -1,
            26,
            27,
            28,
            29,
            30,
            31,
            32,
            33,
            34,
            35,
            36,
            37,
            38,
            39,
            40,
            41,
            42,
            43,
            44,
            45,
            46,
            47,
            48,
            49,
            50,
            51,
            -1,
            -1,
            -1,
            -1,
            -1,
          ];
        for (a = (e = e.toString()).length, r = 0, i = ''; r < a; ) {
          do {
            t = o[255 & e.charCodeAt(r++)];
          } while (r < a && -1 == t);
          if (-1 == t) break;
          do {
            n = o[255 & e.charCodeAt(r++)];
          } while (r < a && -1 == n);
          if (-1 == n) break;
          i += String.fromCharCode((t << 2) | ((48 & n) >> 4));
          do {
            if (61 == (t = 255 & e.charCodeAt(r++))) return i;
            t = o[t];
          } while (r < a && -1 == t);
          if (-1 == t) break;
          i += String.fromCharCode(((15 & n) << 4) | ((60 & t) >> 2));
          do {
            if (61 == (n = 255 & e.charCodeAt(r++))) return i;
            n = o[n];
          } while (r < a && -1 == n);
          if (-1 == n) break;
          i += String.fromCharCode(((3 & t) << 6) | n);
        }
        return i;
      })(e)
    ).split('-'),
    n = t,
    i = n[0];
  return {
    sign: n[1],
    buy_key: i,
    token: n[2],
    timestamp: n[3],
  };
};

const getPayAudio = t => {
  // tslint:disable-next-line:one-variable-per-declaration
  const n = t.seed,
    a = t.fileId,
    e = t.ep,
    du = t.duration,
    s = t.domain,
    c = t.apiVersion,
    l = getEncryptedFileName(n, a),
    d = getEncryptedFileParams(e);
  d.duration = du;
  const link = s + '/download/' + c + l + '?' + querystring.stringify(d);
  return link;
};

export default getPayAudio;
