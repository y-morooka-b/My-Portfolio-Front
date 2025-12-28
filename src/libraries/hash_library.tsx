import SparkMD5 from "spark-md5";

/**
 * 入力テキストのハッシュを生成
 *
 * @param {string} text - ハッシュ化する入力テキスト
 * @return {string} 16進数文字列としてのハッシュ値
 */
export function create_hash(text: string): string {
    return SparkMD5.hash(text);
}

/**
 * 日付の成型
 * - yyyy-mm-dd の形式
 *
 * @param year
 * @param month
 * @param day
 */
export function format_date(year: number, month: number, day: number): string {
    return `${year}-${month}-${day.toString().padStart(2, '0')}`;
}
