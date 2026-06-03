import { Buffer } from 'buffer';
import cryptoRandomString from 'crypto-random-string';
import moment from 'moment';

export class DataGenerator {
  public generateEmail(length: number, customPostfix?: string) {
    const mailpostfix = customPostfix ? customPostfix : '@mail.ru';
    return length - mailpostfix.length > 0
      ? `${cryptoRandomString({ length: length - mailpostfix.length })}${mailpostfix}`
      : cryptoRandomString({ length: 1 });
  }

  public generatePassword() {
    return `${cryptoRandomString({ length: 10, type: 'alphanumeric' })}${cryptoRandomString({ length: 6, type: 'numeric' })}`;
  }

  public generateAlphanumeric(length: number) {
    return `${cryptoRandomString({ length: length, type: 'alphanumeric' })}`;
  }

  public generateStringWithAllSymbols(length: number) {
    return cryptoRandomString({
      length: length,
      characters: ` /\\()[]{}<>@#%$№&-=*+.,!";:?_\`'~^_|0123456789
        АаБбВвГгДдЕеЁёЖжЗзИиЙйКкЛлМмНнОоПпРрСсТтУуФфХхЦцЧчШшЩщЪъЫыЬьЭэЮюЯя
        AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz`
    });
  }

  public generateRussianString(length: number) {
    return cryptoRandomString({
      length: length,
      characters:
        'АаБбВвГгДдЕеЁёЖжЗзИиЙйКкЛлМмНнОоПпРрСсТтУуФфХхЦцЧчШшЩщЪъЫыЬьЭэЮюЯя'
    });
  }

  public generateRussianStringWithSpaces(length: number) {
    return cryptoRandomString({
      length: length,
      characters:
        'АаБбВвГгДдЕеЁёЖжЗзИиЙйКкЛлМмНнОоПпРрСсТтУуФфХхЦцЧчШшЩщЪъЫыЬьЭэЮюЯя '
    });
  }

  public generateRussianStringWithNumbersAndSpaces(length: number) {
    return cryptoRandomString({
      length: length,
      characters:
        '1234567890АаБбВвГгДдЕеЁёЖжЗзИиЙйКкЛлМмНнОоПпРрСсТтУуФфХхЦцЧчШшЩщЪъЫыЬьЭэЮюЯя '
    });
  }

  public generatePhone() {
    return cryptoRandomString({ length: 10, type: 'numeric' });
  }

  public generateStringCharsAndNumbers(length: number) {
    return cryptoRandomString({
      length: length,
      characters: '1234567890АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'
    });
  }

  public generateLatinStringCharsAndNumbers(length: number) {
    return cryptoRandomString({
      length: length,
      characters: '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    });
  }

  public generateLatinStringCharsAndHyphen(length: number) {
    return cryptoRandomString({
      length: length,
      characters: '-ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    });
  }

  public generateLatinStringCharsAndNumbersWithSpaces(length: number) {
    return cryptoRandomString({
      length: length,
      characters: '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ '
    });
  }

  public generateKpp() {
    return `${cryptoRandomString({ length: 6, type: 'numeric' })}${this.generateStringCharsAndNumbers(3)}`;
  }

  public generateNumberString(length: number) {
    return cryptoRandomString({ length: length, type: 'numeric' });
  }

  public generatePaymentAccount() {
    return 408 + cryptoRandomString({ length: 17, type: 'numeric' });
  }

  public generateCorrespondentAccount() {
    return 301 + cryptoRandomString({ length: 17, type: 'numeric' });
  }

  public getRandomDate() {
    const dateTime = new Date(Math.random() * new Date().getTime());
    dateTime.setMilliseconds(123);
    return moment.parseZone(dateTime.toISOString());
  }

  public getRandomDateInRange(startDate: Date, endDate: Date) {
    if (!startDate) startDate = new Date();
    if (!endDate) endDate = new Date();

    const diff = endDate.getTime() - startDate.getTime();
    return new Date(Math.random() * diff + startDate.getTime()).toISOString();
  }

  public getRandomBoolean() {
    return Math.random() >= 0.5;
  }

  public generateGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  public getRandomNumber(maxNumber: number = 2147483647) {
    return Math.floor(Math.random() * maxNumber);
  }

  public getRandomDouble(maxNumber: number = 2147483647, roundDigits?: number) {
    const round = roundDigits ? Math.pow(10, roundDigits) : 1;
    return Math.round(Math.random() * maxNumber * round) / round;
  }

  public getRandomNumberFromInterval(min: number, max: number) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  public getRandomElementOfArray(arr: any[]) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  public generateBase64FromString(string: string = 'generateBase64FromString') {
    return Buffer.from(string).toString('base64');
  }

  public getNonIntegerFraction(): number {
    let num;
    do {
      num = Math.random();
    } while (num === 0 || num === 1);
    return num;
  }

  public getRandomEnum<T extends {}>(anEnum: T): T[keyof T] {
    const enumValues = Object.values(anEnum).filter((v) => isNaN(Number(v)));
    const i = Math.floor(Math.random() * enumValues.length);
    return enumValues[i] as T[keyof T];
  }
}
