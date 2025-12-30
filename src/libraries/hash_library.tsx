import SparkMD5 from "spark-md5";
import { format } from 'date-fns';

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
 * 日付をkeyに成型
 * - yyyy-mm-dd の形式
 *
 * @param origin
 */
export function format_key_date(origin: Date): string {
    return format(origin, 'yyyy-MM-dd');
}
