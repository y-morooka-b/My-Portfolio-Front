/**
 * 全体で使う固定値系をここにまとめる
 */

// 日付関連
/**
 * 日付のロケーション
 * @type string
 */
export const DATE_FORMAT_LOCALE: string = 'ja-JP';

/**
 * 日付のフォーマットのオプション
 * @type DateTimeFormatOptions
 */
export const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long'
}


// その他

/**
 * 収支情報の日本語化用配列
 * @type string[]
 */
export const INCOME_AND_EXPENDITURE: string[] = [
    '支出',
    '収入'
];
