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
