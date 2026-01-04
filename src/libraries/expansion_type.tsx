/**
 * 辞書型
 *
 * - [TypeScriptで辞書型を表現してみよう](https://qiita.com/yoshi-maru/items/f0245ea25b5848305de4) を参考
 *
 * @template TKey 辞書のキーの型。`string`、`number`、または`symbol`である必要があります
 * @template TValue 辞書のキーに関連付けられた値の型
 */
export type Dictionary<TKey extends string | number | symbol, TValue> = {
    [key in TKey]: TValue;
};
