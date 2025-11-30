/**
 * 入力テキストのSHA-256ハッシュを生成
 *
 * @param {string} text - ハッシュ化する入力テキスト
 * @return {string} 16進数文字列としてのハッシュ値
 */
export function create_hash(text: string): string {
    var buffer_hex: ArrayBuffer = new ArrayBuffer(0);
    (async () => {
            const text_encoder = new TextEncoder();

            const plaintext = text_encoder.encode(text);

            buffer_hex = await crypto.subtle.digest("SHA-256", plaintext);
        }
    )();

    return bufferToHex(buffer_hex);
}

/**
 * ArrayBufferを16進数文字列表現に変換
 *
 * @param {ArrayBuffer} buffer - 16進数文字列に変換するバッファ
 * @return {string} バッファの16進数文字列表現
 */
function bufferToHex(buffer: ArrayBuffer): string {
    return Array.from(new Uint8Array(buffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}
