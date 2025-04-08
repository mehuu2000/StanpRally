### 初回セットアップ

```sh
make init
```

```sh
make [mack, win, linux]-app
```

---

これで確認してください

**.envがないので、各自で設定することになります。**


⚠️ **注意:** mainに直接pushしないでください。developを用意しているのでそれを編集し、push, fetch, margeしてください


その他のmakeコマンドはMakefileにおいています

----

### 新しい要素を追加する(コードを書く)場合

**developから**

```sh
git checkout -b future/〇〇  #新しいブランチを作成
```

#### 編集が終わると

```sh
git add .
```

```sh
git commit -m "⬜︎⬜︎"
```

```sh
git puch origin future/〇〇
```

```sh
git checkout develop  #developブランチに移動
```

```sh
git marge --squash future/〇〇  #developブランチにfuture/〇〇の変更を追加
```

```sh
git commit -m "⬜︎⬜︎"  #追加した変更にコメントを設定
```

```sh
git push origin develop  #developに適応
```

するのがいいかなと思います。