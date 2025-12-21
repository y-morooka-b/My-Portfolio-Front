/**
 * 全体で使う固定値系をここにまとめる
 */

// 日付関連
/** @type string 日付のロケーション */
export const DATE_FORMAT_LOCALE: string = 'ja-JP';

/** @type DateTimeFormatOptions 日付のフォーマットのオプション */
export const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long'
}


// その他

/** @type string[] 収支情報の日本語化用配列 */
export const INCOME_AND_EXPENDITURE: string[] = [
    '支出',
    '収入'
];
