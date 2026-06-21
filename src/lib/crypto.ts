import CryptoJS from 'crypto-js';

export interface CryptoOptions {
  cipher: string;
  mode: string;
  padding: string;
  auth: string;
}

const DEFAULT_OPTIONS: CryptoOptions = {
  cipher: 'AES',
  mode: 'CBC',
  padding: 'Pkcs7',
  auth: 'HMAC'
};

export class CryptoUtil {
  private options: CryptoOptions;

  constructor(options: CryptoOptions = DEFAULT_OPTIONS) {
    this.options = options;
  }

  private getCipher(): any {
    const cipher = this.options.cipher.toUpperCase();
    if (cipher.startsWith('DES')) return CryptoJS.DES;
    if (cipher.startsWith('TRIPLEDES')) return CryptoJS.TripleDES;
    return CryptoJS.AES;
  }

  private getMode(): any {
    const mode = this.options.mode.toUpperCase();
    return (CryptoJS.mode as any)[mode] || CryptoJS.mode.CBC;
  }

  private getPadding(): any {
    const pad = this.options.padding;
    let normalizedPad = pad;
    if (pad.toLowerCase() === 'pkcs7') normalizedPad = 'Pkcs7';
    else if (pad.toLowerCase() === 'nopadding') normalizedPad = 'NoPadding';
    else if (pad.toLowerCase() === 'iso10126') normalizedPad = 'Iso10126';
    else if (pad.toLowerCase() === 'iso97971') normalizedPad = 'Iso97971';
    else if (pad.toLowerCase() === 'zeropadding') normalizedPad = 'ZeroPadding';
    return (CryptoJS.pad as any)[normalizedPad] || CryptoJS.pad.Pkcs7;
  }

  private computeSignature(data: string, key: string, algorithmOverride?: string): string | null {
    const authType = (algorithmOverride || this.options.auth).toUpperCase();
    if (authType === 'NONE' || !authType) return null;

    const keySize = this.getKeySize();
    const keyWA = this.parseKeyString(key, keySize);

    switch (authType) {
      case 'HMAC':
      case 'SHA256_HMAC':
        return CryptoJS.HmacSHA256(data, keyWA).toString();
      case 'SHA256':
        return CryptoJS.SHA256(data + key.trim()).toString();
      case 'MD5':
        return CryptoJS.MD5(data + key.trim()).toString();
      default:
        return null;
    }
  }

  private getKeySize(): number {
    const cipher = this.options.cipher.toUpperCase();
    if (cipher.includes('256')) return 32;
    if (cipher.includes('192')) return 24;
    if (cipher.includes('128')) return 16;
    if (cipher.includes('TRIPLEDES')) return 24;
    if (cipher.includes('DES')) return 8;
    return 32;
  }

  private parseKeyString(raw: string, targetBytes: number): CryptoJS.lib.WordArray {
    if (!raw) throw new Error("Key/IV string is empty");
    const trimmed = raw.trim();
    const cleaned = trimmed.startsWith("0x") || trimmed.startsWith("0X") ? trimmed.slice(2) : trimmed;

    const isHex = /^[0-9a-fA-F]+$/.test(cleaned);

    if (isHex && cleaned.length % 2 === 0) {
      const hexWA = CryptoJS.enc.Hex.parse(cleaned);
      if (hexWA.sigBytes === targetBytes) return hexWA;
    }

    const inputToHash = (isHex && cleaned.length % 2 === 0) ? CryptoJS.enc.Hex.parse(cleaned) : trimmed;
    const hash = targetBytes <= 16 ? CryptoJS.MD5(inputToHash) : CryptoJS.SHA256(inputToHash);

    if (hash.sigBytes > targetBytes) {
      return CryptoJS.lib.WordArray.create(hash.words.slice(0, targetBytes / 4), targetBytes);
    }
    return hash;
  }

  encrypt<T>(data: T, key: string, iv: string): string | null {
    try {
      const cipher = this.getCipher();
      const keySize = this.getKeySize();
      const ivSize = this.options.cipher.toUpperCase().includes('AES') ? 16 : 8;

      const keyWA = this.parseKeyString(key, keySize);
      const ivWA = this.parseKeyString(iv, ivSize);

      const text = typeof data === 'string' ? data : JSON.stringify(data);

      const encrypted = cipher.encrypt(text, keyWA, {
        iv: ivWA,
        mode: this.getMode(),
        padding: this.getPadding()
      });

      const ciphertext = encrypted.toString();
      const signature = this.computeSignature(ciphertext, key);

      return signature ? `${ciphertext}:${signature}` : ciphertext;

    } catch (error) {
      console.error('[CryptoUtil] Encryption error:', error);
      return null;
    }
  }

  decrypt<T>(input: string, key: string, iv: string): T | string | null {
    try {
      if (!input) return null;
      let targetInput = input.trim();

      if (targetInput.startsWith('{')) {
        try {
          const parsed = JSON.parse(targetInput);
          if (parsed.data) targetInput = parsed.data.trim();
          else if (parsed.payload) targetInput = parsed.payload.trim();
        } catch { /* ignore */ }
      }

      targetInput = targetInput.replace(/^["']|["']$/g, '').replace(/\\n/g, '').trim();

      const parts = targetInput.split(':').map(p => p.trim());
      let actualCiphertext = targetInput;
      let providedSignature: string | undefined;
      let dynamicIv = iv;

      if (parts.length >= 2) {
        dynamicIv = parts[0];
        actualCiphertext = parts[1];
        if (parts.length >= 3) {
          const hexOnly = parts[2].match(/^[0-9a-fA-F]+/);
          providedSignature = hexOnly ? hexOnly[0] : parts[2];
        }
      }

      if (providedSignature) {
        let detectAlg = this.options.auth;
        if (providedSignature.length === 32) detectAlg = 'MD5';
        else if (providedSignature.length === 64) detectAlg = 'HMAC';

        const expectedSignature = this.computeSignature(actualCiphertext, key, detectAlg);

        let isValid = (providedSignature === expectedSignature);

        if (!isValid && detectAlg === 'HMAC') {
          const literalKeyWA = CryptoJS.enc.Utf8.parse(key);
          const literalExpected = CryptoJS.HmacSHA256(actualCiphertext, literalKeyWA).toString();
          if (providedSignature === literalExpected) isValid = true;
        }

        if (!isValid) {
          throw new Error(`Integrity Check Failed: Signature mismatch using ${detectAlg}`);
        }
      }

      const cipher = this.getCipher();
      const keySize = this.getKeySize();
      const ivSize = this.options.cipher.toUpperCase().includes('AES') ? 16 : 8;

      const keyWA = this.parseKeyString(key, keySize);
      const ivWA = this.parseKeyString(dynamicIv, ivSize);

      const decrypted = cipher.decrypt(actualCiphertext, keyWA, {
        iv: ivWA,
        mode: this.getMode(),
        padding: this.getPadding()
      });

      const text = decrypted.toString(CryptoJS.enc.Utf8);
      if (!text) {
        if (key.length === 16) {
          const litK = CryptoJS.enc.Utf8.parse(key);
          const decLit = cipher.decrypt(actualCiphertext, litK, { iv: ivWA, mode: this.getMode(), padding: this.getPadding() });
          const resLit = decLit.toString(CryptoJS.enc.Utf8);
          if (resLit) return this.parseResult<T>(resLit);
        }
        throw new Error("Decryption failed: Result is not valid UTF-8");
      }

      return this.parseResult<T>(text);

    } catch (error) {
      throw error;
    }
  }

  private parseResult<T>(text: string): T | string {
    if (text.startsWith('{') || text.startsWith('[')) {
      try { return JSON.parse(text) as T; } catch { return text; }
    }
    return text;
  }

  static encrypt<T>(data: T, key: string, iv: string, config: CryptoOptions = DEFAULT_OPTIONS): string | null {
    const util = new CryptoUtil(config);
    const encrypted = util.encrypt(data, key, iv);
    if (!encrypted) return null;
    return `${iv.trim()}:${encrypted}`;
  }

  static decrypt<T>(input: string, key: string, iv: string, config: CryptoOptions = DEFAULT_OPTIONS): T | string | null {
    const util = new CryptoUtil(config);
    return util.decrypt(input, key, iv);
  }

  static generateDynamicKey(): string {
    return CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);
  }

  static generateDynamicIv(): string {
    return CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
  }
}
